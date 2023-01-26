interface Issue {
    owner: string,
    repo: string,
    number: number,
}

interface ParseIssueOptions {
    debug: (str: string) => void
}

interface IssueFormPayload {
    [key: string]: string | undefined
}
