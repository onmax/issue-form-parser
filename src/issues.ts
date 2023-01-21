const github = require('@actions/github');
import * as core from "@actions/core"

export function getIssueBody(githubToken: string, issueNumber: number): Promise<string> {
    const octokit = new github.getOctokit({
        auth: githubToken,
    });
    core.debug(`Fetching issue body with issue number ${issueNumber} in ${github.context.repo.owner}/${github.context.repo.repo}`);

    return octokit.rest.issues.get({
        ...github.context.repo,
        issue_number: issueNumber,
    }).then((res: { status: number; data: { body: any; }; }) => {
        if (res.status !== 200) {
            throw new Error(`Failed to get issue body. Status: ${res.status}`);
        }
        return res.data.body;
    }).catch((err: any) => {
        throw new Error(`Failed to get issue body. Error: ${err}`);
    });
}