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
 * @param str1 the first string.
 * @param str2 the second string.
 * @param options Use `Intl.Collator` for locale-sensitive string comparison.
 */
export function compare(
  str1: string,
  str2: string,
  options: LevenshteinOptions = {},
) {
  let useCollator = Boolean(options.useCollator);

  let str1Len = str1.length;
  let str2Len = str2.length;

  // base cases
  if (str1Len === 0) {
    return str2Len;
  }
  if (str2Len === 0) {
    return str1Len;
  }

  // two rows
  let curCol: number;
  let nextCol: number;
  let i: number;
  let j: number;
  let tmp: number;

  // initialise previous row
  for (i = 0; i < str2Len; ++i) {
    prevRow[i] = i;
    str2Char[i] = str2.charCodeAt(i);
  }

  prevRow[str2Len] = str2Len;

  let strCmp: boolean;
  if (useCollator) {
    // calculate current row distance from previous row using collator
    for (i = 0; i < str1Len; ++i) {
      nextCol = i + 1;

      for (j = 0; j < str2Len; ++j) {
        curCol = nextCol;

        // substitution
        strCmp =
          0 ===
          collator.compare(str1.charAt(i), String.fromCharCode(str2Char[j]));

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
  for (i = 0; i < str1Len; ++i) {
    nextCol = i + 1;

    for (j = 0; j < str2Len; ++j) {
      curCol = nextCol;

      // substitution
      strCmp = str1.charCodeAt(i) === str2Char[j];

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
