import { IdleValue } from "./idle-value";

const codes: number[] = [];
const cache: number[] = [];

export function compare(a: string, b: string): number {
  if (a === b) {
    return 0;
  }

  const a_len = a.length;
  const b_len = b.length;

  if (a_len === 0) {
    return b_len;
  }

  if (b_len === 0) {
    return a_len;
  }

  // compute the base row of distances
  let idx_a = 0;
  while (idx_a < a_len) {
    codes[idx_a] = a.charCodeAt(idx_a);
    cache[idx_a] = ++idx_a;
  }

  let res: number;
  let dist_a: number;
  let dist_b: number;

  for (let idx_b = 0; idx_b < b_len; idx_b += 1) {
    let code_b = b.charCodeAt(idx_b);
    res = dist_a = idx_b;

    for (idx_a = 0; idx_a < a_len; idx_a += 1) {
      dist_b = code_b === codes[idx_a] ? dist_a : dist_a + 1;
      dist_a = cache[idx_a];
      cache[idx_a] = res =
        dist_a > res
          ? dist_b > res
            ? res + 1
            : dist_b
          : dist_b > dist_a
            ? dist_a + 1
            : dist_b;
    }
  }

  return res!;
}

const idle_collator = new IdleValue(() =>
  Intl.Collator("generic", { sensitivity: "base" }),
);
const collated_cache: number[] = [];
const collated_codes: number[] = [];

export function compare_collated(a: string, b: string) {
  if (a === b) {
    return 0;
  }

  let a_len = a.length;
  let b_len = b.length;
  let collator = idle_collator.value;

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
    collated_cache[i] = i;
    collated_codes[i] = b.charCodeAt(i);
  }

  collated_cache[b_len] = b_len;

  let strCmp: boolean;
  // calculate current row distance from previous row using collator
  for (i = 0; i < a_len; ++i) {
    nextCol = i + 1;

    for (j = 0; j < b_len; ++j) {
      curCol = nextCol;

      // substitution
      strCmp =
        0 ===
        collator.compare(a.charAt(i), String.fromCharCode(collated_codes[j]));

      nextCol = collated_cache[j] + (strCmp ? 0 : 1);

      // insertion
      tmp = curCol + 1;
      if (nextCol > tmp) {
        nextCol = tmp;
      }
      // deletion
      tmp = collated_cache[j + 1] + 1;
      if (nextCol > tmp) {
        nextCol = tmp;
      }

      // copy current col value into previous (in preparation for next iteration)
      collated_cache[j] = curCol;
    }

    // copy last col value into previous (in preparation for next iteration)
    collated_cache[j] = nextCol;
  }

  return nextCol!;
}
