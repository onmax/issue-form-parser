import axios from 'axios'

export async function fetchIssueBody(issue: Issue, githubToken: string, { debug }: Pick<ParseIssueOptions, "debug">) {
    const url = `https://api.github.com/repos/${issue.owner}/${issue.repo}/issues/${issue.number}`;
    debug(`Fetching issue body from ${url}`);

    const headers = {
        Authorization: `token ${githubToken}`,
    };
    const response = await axios.get(url, { headers });
    const data = response.data;

    const body = data.body.replace(/\r/g, "");

    debug(`Body: ${body}`)
    return body;
}

function parseIssueSection(section: string): { name: string, value?: string } {
    const trimmed = section.trim();

    const re = /\n\n/;
    const split = trimmed.search(re);

    if (split !== -1) {
        // There is an answer
        const name = trimmed.substring(0, split);
        const value = trimmed.substring(split + 1).trim();
        return { name, value };
    } else {
        // No answer
        return { name: trimmed, value: undefined };
    }
}

function getSections(body: string) {
    const sections = body.split(/^(#{1,6})/gm).filter((s) => s.trim().length > 0);
    return sections;
}

export function parseIssueBody(body: string, { debug }: Pick<ParseIssueOptions, "debug">) {
    const sections = getSections(body);
    debug(`Found ${sections.length} sections in the form. Keys: ${sections.map(parseIssueSection).map(({ name }) => name).join(", ")}`);

    const res: IssueFormPayload = {};
    sections.map(parseIssueSection).forEach(({ name, value }) => res[name] = value);
    debug(`Payload JSON: ${JSON.stringify(res)} `);

    return res;
}
