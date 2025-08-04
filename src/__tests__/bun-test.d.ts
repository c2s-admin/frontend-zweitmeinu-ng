declare module "bun:test" {
  export function describe(
    name: string,
    fn: (...args: unknown[]) => unknown,
  ): void;
  export function test(
    name: string,
    fn: (...args: unknown[]) => unknown | Promise<unknown>,
  ): void;
  export function expect(actual: unknown): {
    toBe(expected: unknown): void;
    toEqual(expected: unknown): void;
  };
}
