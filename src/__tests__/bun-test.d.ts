declare module "bun:test" {
  type DescribeFn = (name: string, fn: (...args: unknown[]) => unknown) => void;
  export const describe: DescribeFn & { skip: DescribeFn };

  type TestFn = (
    name: string,
    fn: (...args: unknown[]) => unknown | Promise<unknown>,
  ) => void;
  export const test: TestFn & {
    each<T>(
      cases: readonly T[],
    ): (name: string, fn: (arg: T) => unknown | Promise<unknown>) => void;
  };

  export function expect(actual: unknown): {
    toBe(expected: unknown): void;
    toEqual(expected: unknown): void;
    toBeTruthy(): void;
    toBeGreaterThan(expected: number): void;
  };
}
