import * as fs from "fs";
import { levenshtein } from "../src/";

describe("Levenshtein", async () => {
  it("basic tests", async () => {
    let str = "hello";
    let str1 = str;
    let str2 = str;
    let i;

    // equal strings
    expect(levenshtein.compare("hello", "hello")).toBe(0);
    expect(levenshtein.compare_collated("hello", "hello")).toBe(0);

    // inserts
    for (i = 0; i <= str.length; ++i) {
      str1 = str.substr(0, i);
      str2 = str;

      expect(levenshtein.compare(str1, str2)).toBe(str.length - i);
      expect(levenshtein.compare_collated(str1, str2)).toBe(str.length - i);
    }

    // deletes
    for (i = str.length - 1; i >= 0; --i) {
      str1 = str;
      str2 = str.substr(0, i);

      expect(levenshtein.compare(str1, str2)).toBe(str.length - i);
      expect(levenshtein.compare_collated(str1, str2)).toBe(str.length - i);
    }
  });

  it("substitutions", async () => {
    // substitutions
    expect(levenshtein.compare("a", "b")).toBe(1);
    expect(levenshtein.compare_collated("a", "b")).toBe(1);

    expect(levenshtein.compare("ab", "ac")).toBe(1);
    expect(levenshtein.compare_collated("ab", "ac")).toBe(1);

    expect(levenshtein.compare("ac", "bc")).toBe(1);
    expect(levenshtein.compare_collated("ac", "bc")).toBe(1);

    expect(levenshtein.compare("abc", "axc")).toBe(1);
    expect(levenshtein.compare_collated("abc", "axc")).toBe(1);

    expect(levenshtein.compare("xabxcdxxefxgx", "1ab2cd34ef5g6")).toBe(6);
    expect(levenshtein.compare_collated("xabxcdxxefxgx", "1ab2cd34ef5g6")).toBe(
      6,
    );
  });

  it("many ops", async () => {
    expect(levenshtein.compare("xabxcdxxefxgx", "abcdefg")).toBe(6);
    expect(levenshtein.compare_collated("xabxcdxxefxgx", "abcdefg")).toBe(6);

    expect(levenshtein.compare("javawasneat", "scalaisgreat")).toBe(7);
    expect(levenshtein.compare_collated("javawasneat", "scalaisgreat")).toBe(7);

    expect(levenshtein.compare("example", "samples")).toBe(3);
    expect(levenshtein.compare_collated("example", "samples")).toBe(3);

    expect(levenshtein.compare("forward", "drawrof")).toBe(6);
    expect(levenshtein.compare_collated("forward", "drawrof")).toBe(6);

    expect(levenshtein.compare("sturgeon", "urgently")).toBe(6);
    expect(levenshtein.compare_collated("sturgeon", "urgently")).toBe(6);

    expect(levenshtein.compare("levenshtein", "frankenstein")).toBe(6);
    expect(levenshtein.compare_collated("levenshtein", "frankenstein")).toBe(6);

    expect(levenshtein.compare("distance", "difference")).toBe(5);
    expect(levenshtein.compare_collated("distance", "difference")).toBe(5);

    expect(levenshtein.compare("distance", "eistancd")).toBe(2);
    expect(levenshtein.compare_collated("distance", "eistancd")).toBe(2);
  });

  it("non-latin", async () => {
    expect(levenshtein.compare("你好世界", "你好")).toBe(2);
    expect(levenshtein.compare_collated("你好世界", "你好")).toBe(2);

    expect(
      levenshtein.compare(
        "因為我是中國人所以我會說中文",
        "因為我是英國人所以我會說英文",
      ),
    ).toBe(2);
    expect(
      levenshtein.compare_collated(
        "因為我是中國人所以我會說中文",
        "因為我是英國人所以我會說英文",
      ),
    ).toBe(2);
  });

  it("diacritics", async () => {
    // collation (see https://github.com/hiddentao/fast-levenshtein/issues/7)
    expect(levenshtein.compare("mikailovitch", "Mikhaïlovitch")).toBe(3);

    //! Distance should be 1 for the 'h' only
    expect(levenshtein.compare_collated("mikailovitch", "Mikhaïlovitch")).toBe(
      1,
    );
  });

  it("long text", async () => {
    expect(
      levenshtein.compare(
        "Morbi interdum ultricies neque varius condimentum. Donec volutpat turpis interdum metus ultricies vulputate. Duis ultricies rhoncus sapien, sit amet fermentum risus imperdiet vitae. Ut et lectus",
        "Duis erat dolor, cursus in tincidunt a, lobortis in odio. Cras magna sem, pharetra et iaculis quis, faucibus quis tellus. Suspendisse dapibus sapien in justo cursus",
      ),
    ).toBe(143);

    expect(
      levenshtein.compare_collated(
        "Morbi interdum ultricies neque varius condimentum. Donec volutpat turpis interdum metus ultricies vulputate. Duis ultricies rhoncus sapien, sit amet fermentum risus imperdiet vitae. Ut et lectus",
        "Duis erat dolor, cursus in tincidunt a, lobortis in odio. Cras magna sem, pharetra et iaculis quis, faucibus quis tellus. Suspendisse dapibus sapien in justo cursus",
      ),
    ).toBe(143);
  });

  it("huge text", async () => {
    let text1 = fs.readFileSync(__dirname + "/text1.txt", "utf-8");
    let text2 = fs.readFileSync(__dirname + "/text2.txt", "utf-8");

    console.time("Huge Text");
    let distance = levenshtein.compare(text1, text2);
    console.timeEnd("Huge Text");

    expect(distance).toBe(194);
  });
});
