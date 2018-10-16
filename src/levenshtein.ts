const collator = Intl.Collator("generic", { sensitivity: "base" });

// arrays to re-use
const prevRow: number[] = [];
const str2Char: number[] = [];

export interface LevenshteinOptions {
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
export function compare(
  a: string,
  b: string,
  options: LevenshteinOptions = {},
) {
  let useCollator = Boolean(options.useCollator);

  let a_len = a.length;
  let b_len = b.length;

  // base cases
  if (a_len === 0) {
    return b_len;
  }
  if (b_len === 0) {
    return a_len;
  }

  // two rows
  let curCol: number;
  let nextCol: number;
  let i: number;
  let j: number;
  let tmp: number;

  // initialise previous row
  for (i = 0; i < b_len; ++i) {
    prevRow[i] = i;
    str2Char[i] = b.charCodeAt(i);
  }

  prevRow[b_len] = b_len;

  let strCmp: boolean;
  if (useCollator) {
    // calculate current row distance from previous row using collator
    for (i = 0; i < a_len; ++i) {
      nextCol = i + 1;

      for (j = 0; j < b_len; ++j) {
        curCol = nextCol;

        // substitution
        strCmp =
          0 === collator.compare(a.charAt(i), String.fromCharCode(str2Char[j]));

        nextCol = prevRow[j] + (strCmp ? 0 : 1);

        // insertion
        tmp = curCol + 1;
        if (nextCol > tmp) {
          nextCol = tmp;
        }
        // deletion
        tmp = prevRow[j + 1] + 1;
        if (nextCol > tmp) {
          nextCol = tmp;
        }

        // copy current col value into previous (in preparation for next iteration)
        prevRow[j] = curCol;
      }

      // copy last col value into previous (in preparation for next iteration)
      prevRow[j] = nextCol;
    }

    return nextCol!;
  }

  // calculate current row distance from previous row without collator
  for (i = 0; i < a_len; ++i) {
    nextCol = i + 1;

    for (j = 0; j < b_len; ++j) {
      curCol = nextCol;

      // substitution
      strCmp = a.charCodeAt(i) === str2Char[j];

      nextCol = prevRow[j] + (strCmp ? 0 : 1);

      // insertion
      tmp = curCol + 1;
      if (nextCol > tmp) {
        nextCol = tmp;
      }
      // deletion
      tmp = prevRow[j + 1] + 1;
      if (nextCol > tmp) {
        nextCol = tmp;
      }

      // copy current col value into previous (in preparation for next iteration)
      prevRow[j] = curCol;
    }

    // copy last col value into previous (in preparation for next iteration)
    prevRow[j] = nextCol;
  }

  return nextCol;
}
