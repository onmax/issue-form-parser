import * as core from "@actions/core";
import * as github from '@actions/github';

export async function getIssueBody(githubToken: string, issueNumber: number): Promise<string | undefined | null> {
    if (!githubToken) {
        throw new Error('Github token is not defined.');
    }
    if (!issueNumber) {
        throw new Error('Issue number is not defined.');
    }
    core.debug(`Fetching issue body with issue number ${issueNumber} in ${github.context.repo.owner}/${github.context.repo.repo}`);

    core.debug(`Github token: ${githubToken}`);
    core.debug(`Issue number: ${issueNumber}`);

    const octokit = github.getOctokit(githubToken);
    return octokit.rest.issues.get({
        ...github.context.repo,
        issue_number: issueNumber,
    }).then(res => {
        if (res.status !== 200) {
            throw new Error(`Failed to get issue body. Status: ${res.status}`);
        }
        return res.data.body;
    }).catch((err: any) => {
        throw new Error(`Failed to get issue body. Error: ${err}`);
    });
}