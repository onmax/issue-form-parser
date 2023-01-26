import * as core from "@actions/core"
import * as github from '@actions/github'
import { parseIssue } from "./parser"

async function run(): Promise<void> {
  try {
    const issueNumber = parseInt(core.getInput("issue_number", { required: true }))
    const githubToken = core.getInput("github_token", { required: true })

    const issue = {
      ...github.context.repo,
      number: issueNumber
    }
    const options = {
      debug: core.debug
    }
    const res = await parseIssue(issue, githubToken, options)

    core.setOutput("payload", JSON.stringify(res))
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run();
