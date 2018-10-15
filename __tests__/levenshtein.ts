import * as fs from "fs";
import { compare } from "../src/levenshtein";

describe("Levenshtein", async () => {
  it("basic tests", async () => {
    let str = "hello";
    let str1 = str;
    let str2 = str;
    let i;

    // equal strings
    expect(compare("hello", "hello")).toBe(0);

    // inserts
    for (i = 0; i <= str.length; ++i) {
      str1 = str.substr(0, i);
      str2 = str;

      expect(compare(str1, str2)).toBe(str.length - i);
    }

    // deletes
    for (i = str.length - 1; i >= 0; --i) {
      str1 = str;
      str2 = str.substr(0, i);

      expect(compare(str1, str2)).toBe(str.length - i);
    }
  });

  it("substitutions", async () => {
    // substitutions
    expect(compare("a", "b")).toBe(1);
    expect(compare("ab", "ac")).toBe(1);
    expect(compare("ac", "bc")).toBe(1);
    expect(compare("abc", "axc")).toBe(1);
    expect(compare("xabxcdxxefxgx", "1ab2cd34ef5g6")).toBe(6);
  });

  it("many ops", async () => {
    expect(compare("xabxcdxxefxgx", "abcdefg")).toBe(6);
    expect(compare("javawasneat", "scalaisgreat")).toBe(7);
    expect(compare("example", "samples")).toBe(3);
    expect(compare("forward", "drawrof")).toBe(6);
    expect(compare("sturgeon", "urgently")).toBe(6);
    expect(compare("levenshtein", "frankenstein")).toBe(6);
    expect(compare("distance", "difference")).toBe(5);
    expect(compare("distance", "eistancd")).toBe(2);
  });

  it("non-latin", async () => {
    expect(compare("你好世界", "你好")).toBe(2);
    expect(
      compare("因為我是中國人所以我會說中文", "因為我是英國人所以我會說英文"),
    ).toBe(2);
  });

  it("diacritics", async () => {
    // collation (see https://github.com/hiddentao/fast-levenshtein/issues/7)
    expect(compare("mikailovitch", "Mikhaïlovitch")).toBe(3);
    expect(
      compare("mikailovitch", "Mikhaïlovitch", { useCollator: true }),
    ).toBe(1);
  });

  it("long text", async () => {
    expect(
      compare(
        "Morbi interdum ultricies neque varius condimentum. Donec volutpat turpis interdum metus ultricies vulputate. Duis ultricies rhoncus sapien, sit amet fermentum risus imperdiet vitae. Ut et lectus",
        "Duis erat dolor, cursus in tincidunt a, lobortis in odio. Cras magna sem, pharetra et iaculis quis, faucibus quis tellus. Suspendisse dapibus sapien in justo cursus",
      ),
    ).toBe(143);
  });

  it("huge text", async () => {
    let text1 = fs.readFileSync(__dirname + "/text1.txt", "utf-8");
    let text2 = fs.readFileSync(__dirname + "/text2.txt", "utf-8");

    console.time("Huge Text");
    let distance = compare(text1, text2);
    console.timeEnd("Huge Text");

    expect(distance).toBe(194);
  });
});
