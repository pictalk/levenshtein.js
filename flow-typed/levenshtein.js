// @flow

declare module "@pictalk/levenshtein" {
  declare var levenshtein: {
    compare: (a: string, b: string) => number,
    compare_collated: (a: string, b: string) => number,
  };

  declare class IdleValue<T> {
    constructor(factory: () => T): IdleValue<T>;
    value: T;
  }

  declare module.exports: {
    levenshtein: typeof levenshtein,
    IdleValue: typeof IdleValue,
  };
}
