import Redis from "ioredis";

// Simple in-memory mock for development/testing without Lua dependencies
interface RedisLike {
  incr(key: string): Promise<number>
  expire(key: string, seconds: number): Promise<1 | 0>
  get(key: string): Promise<string | null>
  set(key: string, value: string): Promise<"OK">
  del(key: string): Promise<number>
}

class SimpleRedisMock implements RedisLike {
  private store = new Map<string, { value: string; expires?: number }>();

  async incr(key: string): Promise<number> {
    const item = this.store.get(key);
    const currentValue = item?.value ? parseInt(item.value, 10) : 0;
    const newValue = currentValue + 1;
    
    this.store.set(key, { 
      value: newValue.toString(),
      expires: item?.expires
    });
    
    return newValue;
  }

  async expire(key: string, seconds: number): Promise<1 | 0> {
    const item = this.store.get(key);
    if (!item) return 0;
    
    this.store.set(key, {
      value: item.value,
      expires: Date.now() + (seconds * 1000)
    });
    
    // Clean up expired keys
    setTimeout(() => {
      const currentItem = this.store.get(key);
      if (currentItem?.expires && Date.now() > currentItem.expires) {
        this.store.delete(key);
      }
    }, seconds * 1000);
    
    return 1;
  }

  async get(key: string): Promise<string | null> {
    const item = this.store.get(key);
    if (!item) return null;
    
    if (item.expires && Date.now() > item.expires) {
      this.store.delete(key);
      return null;
    }
    
    return item.value;
  }

  async set(key: string, value: string): Promise<"OK"> {
    this.store.set(key, { value });
    return "OK";
  }

  async del(key: string): Promise<number> {
    return this.store.delete(key) ? 1 : 0;
  }
}

const redis: RedisLike =
  process.env.NODE_ENV === "test" || !process.env.REDIS_URL
    ? new SimpleRedisMock()
    : (new Redis(process.env.REDIS_URL) as unknown as RedisLike);

export { redis };
