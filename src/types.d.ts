interface Issue {
    owner: string,
    repo: string,
    number: number,
}

interface ParseIssueOptions {
    debug: (str: string) => void
}

type CheckboxInput = { [key: string]: boolean }
type DropdownInput = string[]
type TextInput = string
type IssueFormPayloadValue = CheckboxInput | DropdownInput | TextInput | undefined
interface IssueFormPayload {
    [key: string]: IssueFormPayloadValue
}
