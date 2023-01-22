import * as core from "@actions/core"
import { parseBody } from "./parser"
import { getIssueBody } from "./issues"

async function run(): Promise<void> {
  try {
    const issueNumber = parseInt(core.getInput("issue_number", { required: true }))
    const githubToken = core.getInput("github_token", { required: true })
    const body = await getIssueBody(githubToken, issueNumber)
    if (!body) throw new Error(`Failed to get body from issue number ${issueNumber}`)

    const res = parseBody(body)
    core.setOutput("payload", JSON.stringify(res))
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run();
