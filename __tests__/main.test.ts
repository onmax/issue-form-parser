import { expect, test } from "@jest/globals";
import { parseBody } from "../src/parser";

test("One section", async () => {
  const body = "### name1\r\n\r\nvalue 1";
  const res = parseBody(body);
  const expected = {
    name1: "value 1",
  };
  expect(res).toEqual(expected);
});

test("Normal body", async () => {
  const body = "### name1\r\n\r\nhtml```<h1>Hola</h1>```";
  const res = parseBody(body);
  const expected = {
    name1: "html```<h1>Hola</h1>```",
  };
  expect(res).toEqual(expected);
});


test("Normal body", async () => {
  const body = "### name1\r\n\r\nvalue1\r\n\r\n### This is a longer section\r\n\r\nWith a longer answers!!\n\r\n\rBut it works!!\r\n\r\n### name3\r\n\r\nvalue3";
  const res = parseBody(body);
  const expected = {
    name1: "value1",
    "This is a longer section": "With a longer answers\!\!\n\r\n\rBut it works\!\!",
    name3: "value3",
  };
  expect(res).toEqual(expected);
});

test("With undefined", async () => {
  const body = "### name1\r\n\r\n### name2\r\n\r\nvalue2\r\n\r\n### name3\r\n\r\nvalue3";
  const res = parseBody(body);
  const expected = {
    name1: undefined,
    name2: "value2",
    name3: "value3",
  };
  expect(res).toEqual(expected);
});

test("Body with SVG as HTML", async () => {
  const body =
    '### Name\r\n\r\nBulb\r\n\r\n### Keywords\r\n\r\nlight, solution, idea, bulb\r\n\r\n### SVG\r\n\r\n<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none"><path stroke="#21bca5" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M32.01 3.01v7.56m-21.39 1.3 5.35 5.35m37.43-5.35-5.34 5.35M3.03 33.26h7.56m50.41 0h-7.56"/><path fill="#21bca5" fill-rule="evenodd" d="M40 46.37a16 16 0 1 0-16 0v6.13a8 8 0 1 0 16 0v-6.13z" clip-rule="evenodd" opacity=".4"/></svg>';
  const res = parseBody(body);
  const expected = {
    Name: "Bulb",
    Keywords: "light, solution, idea, bulb",
    SVG: '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none"><path stroke="#21bca5" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M32.01 3.01v7.56m-21.39 1.3 5.35 5.35m37.43-5.35-5.34 5.35M3.03 33.26h7.56m50.41 0h-7.56"/><path fill="#21bca5" fill-rule="evenodd" d="M40 46.37a16 16 0 1 0-16 0v6.13a8 8 0 1 0 16 0v-6.13z" clip-rule="evenodd" opacity=".4"/></svg>',
  };
  expect(res).toEqual(expected);
});

test("Invalid body", async () => {
  const body = "# This does not have h1.\r\n\r\nAnd this\r\n\r\n## h2";
  expect(() => parseBody(body)).toThrowError(
    "Invalid issue body format"
  );
});
