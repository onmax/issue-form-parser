import * as process from "process";
import * as cp from "child_process";
import * as path from "path";
import { expect, test } from "@jest/globals";
import { parseBody } from "../src/parser";

test("Normal body", async () => {
  const body = "### name1 value1 ### name2 value2 ### name3 value3";
  const res = parseBody(body);
  const expected = {
    name1: "value1",
    name2: "value2",
    name3: "value3",
  };
  expect(res).toEqual(expected);
});

test("Body with SVG as HTML", async () => {
  const body =
    '### Name Bulb ### Keywords light, solution, idea, bulb ### SVG <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none"><path stroke="#21bca5" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M32.01 3.01v7.56m-21.39 1.3 5.35 5.35m37.43-5.35-5.34 5.35M3.03 33.26h7.56m50.41 0h-7.56"/><path fill="#21bca5" fill-rule="evenodd" d="M40 46.37a16 16 0 1 0-16 0v6.13a8 8 0 1 0 16 0v-6.13z" clip-rule="evenodd" opacity=".4"/></svg>';
  const res = parseBody(body);
  const expected = {
    Name: "Bulb",
    Keywords: "light, solution, idea, bulb",
    SVG: '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none"><path stroke="#21bca5" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M32.01 3.01v7.56m-21.39 1.3 5.35 5.35m37.43-5.35-5.34 5.35M3.03 33.26h7.56m50.41 0h-7.56"/><path fill="#21bca5" fill-rule="evenodd" d="M40 46.37a16 16 0 1 0-16 0v6.13a8 8 0 1 0 16 0v-6.13z" clip-rule="evenodd" opacity=".4"/></svg>',
  };
  expect(res).toEqual(expected);
});

test("Invalid body", async () => {
  const body = "# This does not have h1. And this ## h2";
  expect(() => parseBody(body)).toThrowError(
    "No section in the form. Make sure to have '###' in the body of your issue. What we got # This does not have h1. And this ## h2"
  );
});

// shows how the runner will run a javascript action with env / stdout protocol
test("test runs", () => {
  process.env["INPUT_BODY"] = "### name1 value1 ### name2 value2 ### name3 value3";
  const np = process.execPath;
  const ip = path.join(__dirname, "..", "lib", "main.js");
  const options: cp.ExecFileSyncOptions = {
    env: process.env,
  };
  console.log(cp.execFileSync(np, [ip], options).toString());
});
