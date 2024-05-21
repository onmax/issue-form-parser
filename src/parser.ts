import { fetchIssueBody, parseIssueBody } from './util'

export async function parseIssue(
  issue: Issue,
  githubToken: string,
  { debug }: ParseIssueOptions
) {
  const body = await fetchIssueBody(issue, githubToken, { debug })
  return parseIssueBody(body, { debug })
}
