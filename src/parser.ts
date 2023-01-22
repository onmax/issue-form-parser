import * as core from "@actions/core"

type IssueFormPayload = Record<string, string | undefined>

// SectionNameOneWord\r\n\r\nvalue => ["SectionNameOneWord", "value"]
// SectionName\r\n\r\nsection value option 1 => ["SectionName", "section value option 1"]
// SectionNameUndefinedValue\r\n\r\n => ["SectionNameUndefinedValue", undefined]
function parseSection(section: string): { name: string, value?: string } {
    console
    const trimmed = section.trim();
    const re = /\r\n\r\n/;
    const split = trimmed.search(re);
    return split !== -1 // True? Has a name and value
        ? { name: trimmed.substring(0, split), value: trimmed.substring(split + 1).trim() }
        : { name: trimmed, value: undefined };
}

// ### NameSection1\r\n\r\nvalue1\r\n\r\n ### NameSection2\r\n\r\nvalue2: With a long value\r\n\r\n### NameSection3\r\n\r\n
//      => { NameSection1: "value1", NameSection2: "value2: With a long value", NameSection3: undefined }
export function parseBody(body: string): IssueFormPayload {
    core.debug(`Body: ${body}`)
    const sections = body.split("###").filter((s) => s.trim().length > 0);
    core.debug(`Found ${sections.length} sections in the form.`);

    if (sections.length < 2) {
        throw new Error(`No section in the form. Make sure to have '###' in the body of your issue. What we got ${body}`);
    }

    const res: IssueFormPayload = {};
    sections.map(parseSection).forEach(({ name, value }) => res[name] = value);

    core.debug(`Payload JSON: ${JSON.stringify(res)}`);
    return res;
}
