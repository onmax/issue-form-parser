import axios from 'axios'

export async function fetchIssueBody(
  issue: Issue,
  githubToken: string,
  { debug }: Pick<ParseIssueOptions, 'debug'>
) {
  const url = `https://api.github.com/repos/${issue.owner}/${issue.repo}/issues/${issue.number}`
  debug(`Fetching issue body from ${url}`)

  const headers = {
    Authorization: `token ${githubToken}`
  }
  const response = await axios.get(url, { headers })
  const data = response.data

  const body = data.body.replace(/\r/g, '')

  debug(`Body: ${body}`)
  return body
}

function isDropdown(value: string): boolean {
  const isDropdownRegex = /^([^,\n]+, )+[^,\n]+$/
  return isDropdownRegex.test(value)
}

function parseDropdownValue(value: string): DropdownInput {
  const lines = value.split(/,/)
  const res: DropdownInput = []
  lines.forEach(line => {
    const trimmed = line.trim()
    res.push(trimmed)
  })
  return res
}

function isCheckbox(value: string): boolean {
  const isCheckboxRegex = /^- \[[ Xx]\] /
  return isCheckboxRegex.test(value)
}

function parseCheckboxValue(value: string): CheckboxInput {
  const lines = value.split(/\n/)
  const res: CheckboxInput = {}
  lines.forEach(line => {
    const trimmed = line.trim()
    const re = /^- \[([ Xx])\] (.+)$/
    const match = re.exec(trimmed)
    if (match) {
      const [, checked, name] = match
      res[name] = checked.toLowerCase() === 'x'
    }
  })
  return res
}

function parseTextInputValue(value: string): IssueFormPayloadValue {
  if (value === '') {
    return undefined
  }
  if (isDropdown(value)) {
    return parseDropdownValue(value)
  }
  if (isCheckbox(value)) {
    return parseCheckboxValue(value)
  }
  return value
}

function parseIssueSection(section: string): {
  name: string
  value: IssueFormPayloadValue
} {
  const trimmed = section.trim()

  const re = /\n\n/
  const split = trimmed.search(re)

  if (split === -1) {
    // There is no answer
    return { name: trimmed, value: undefined }
  }

  // There is an answer
  const name = trimmed.substring(0, split)
  const value = parseTextInputValue(trimmed.substring(split + 1).trim())
  return { name, value }
}

function getSections(body: string) {
  // FIXME: This is a hacky way to split the sections
  // It will break if the user uses a # with a space in the answer
  const sections = body
    .split(/#+ /)
    .map(section => section.trim())
    .filter(section => section !== '')
  console.log({ sections })
  return sections
}

export function parseIssueBody(
  body: string,
  { debug }: Pick<ParseIssueOptions, 'debug'>
) {
  const sections = getSections(body)
  debug(`Found ${sections.length} sections in the form.`)

  const res: IssueFormPayload = {}
  sections
    .map(parseIssueSection)
    .forEach(({ name, value }) => (res[name] = value))
  debug(`Payload JSON: ${JSON.stringify(res)} `)

  return res
}
