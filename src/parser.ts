import * as core from "@actions/core"
import { sanitazeString } from "./util";

type IssueFormPayload = Record<string, string | undefined>

// SectionNameOneWord\r\n\r\nvalue => ["SectionNameOneWord", "value"]
// SectionName\r\n\r\nsection value option 1 => ["SectionName", "section value option 1"]
// SectionNameUndefinedValue\r\n\r\n => ["SectionNameUndefinedValue", undefined]
function parseSection(section: string): { name: string, value?: string } {
    const sanitazed = sanitazeString(section);

    // Split on the first \r\n\r\n
    const re = /\r\n\r\n/;
    const split = sanitazed.search(re);

    if (split !== -1) {
        // There is an answer
        const name = sanitazed.substring(0, split);
        const value = sanitazed.substring(split + 1).trim();
        return { name, value };
    } else {
        // No answer
        return { name: sanitazed, value: undefined };
    }
}

// ### NameSection1\r\n\r\nvalue1\r\n\r\n ### NameSection2\r\n\r\nvalue2: With a long value\r\n\r\n### NameSection3\r\n\r\n
//      => { NameSection1: "value1", NameSection2: "value2: With a long value", NameSection3: undefined }
export function parseBody(body: string): IssueFormPayload {
    core.debug(`Body: ${body}`)

    if (!body.startsWith("###")) {
        throw new Error(`
            Invalid issue body format. Body must start with '###' followed by the name of the section and its value.
            See https://github.com/onmax/issue-form-parser/issues. The body we got is: ${body}
        `);
    }

    const sections = body.split("###").filter((s) => s.trim().length > 0);
    core.debug(`Found ${sections.length} sections in the form.`);

    const res: IssueFormPayload = {};
    sections.map(parseSection).forEach(({ name, value }) => res[name] = value);
    core.debug(`Payload JSON: ${JSON.stringify(res)}`);

    return res;
}
