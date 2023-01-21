import * as core from "@actions/core"
import { parseBody } from "./parser"
import { getIssueBody } from "./issues"

async function run(): Promise<void> {
  try {
    let body: string = core.getInput("body")

    if (!body) {
      const issueNumber: number = parseInt(core.getInput("issue_number"))
      const githubToken: string = core.getInput("github_token")
      body = await getIssueBody(githubToken, issueNumber)
    }

    if (!body) {
      throw new Error("No body found. Make sure to set either body or issue_number & github_token.")
    }

    const res = parseBody(body)
    core.setOutput("payload", res)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run();
