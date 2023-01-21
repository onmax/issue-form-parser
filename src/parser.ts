import * as core from "@actions/core"

export function parseBody(body: string): Record<string, string> {
    const sections = body.split("###").filter((s) => s.trim().length > 0);
    core.debug(`Found ${sections.length} sections in the form.`);

    if (sections.length < 2) {
        throw new Error(`No section in the form. Make sure to have '###' in the body of your issue. What we got ${body}`);
    }

    const res: Record<string, string> = {};

    sections.forEach((section) => {
        const trimmed = section.trim();
        const indexOfFirstSpace = trimmed.indexOf(" ");
        const [name, value] = [trimmed.slice(0, indexOfFirstSpace), trimmed.slice(indexOfFirstSpace + 1)];

        core.debug(`Parsing section...`);
        core.debug(`Raw: ${section}`);
        core.debug(`Result -> { "${name}": "${value}" }`);

        if (!name || !value) {
            throw new Error(`Invalid section in the form. Got: ${section}`);
        }
        res[name.trim()] = value.trim();
    });

    core.debug(`Payload JSON: ${JSON.stringify(res)}`);
    return res;
}
