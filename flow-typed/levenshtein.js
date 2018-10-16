// @flow

declare module "@pictalk/levenshtein" {
  declare export interface LevenshteinOptions {
    useCollator?: boolean;
  }
  /**
   * Calculate levenshtein distance of the two strings.
   * Based on the algorithm at http://en.wikipedia.org/wiki/Levenshtein_distance.
   *
   * @param a the first string.
   * @param b the second string.
   * @param options Use `Intl.Collator` for locale-sensitive string comparison.
   */
  declare export function compare(
    a: string,
    b: string,
    options?: LevenshteinOptions,
  ): number;
}
