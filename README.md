<p align="center">
  <a href="https://github.com/onmax/issue-form-parser/actions"><img alt="issue-form-parser status" src="https://github.com/onmax/issue-form-parser/actions/workflows/test.yml/badge.svg"></a>
</p>

# Issue Form Parser - GitHub Action

Convert GitHub Form Issues into JSON objects with this simple Action.

![Issue Form Parser](./issue-form-parser.png)

---

## Description

This GitHub Action allows you to easily convert GitHub issues into JSON objects, making it simple to work with and manipulate issue data in your workflow. With just a few simple steps, you can use this action to automatically convert an issue into a JSON object, which can then be used for a variety of purposes, such as data analysis, reporting, or integration with other systems. This action is designed to be flexible and easy to use, so you can quickly and easily convert issues into JSON format without any hassle.

## Parameters

| Name | Required | Description |
| ------------- | ------------- | ------------- |
| `issue_number` | `true` | The issue number to parse. |
| `issue_form_template` | `false` | Only required if you are using GitHub Issue forms. The path to the issue template file. Somthing like to `.github/ISSUE_TEMPLATE/YOUR_TEMPLATE.yml`. If not provided, the action will try to find the issue template file in the `.github/ISSUE_TEMPLATE` folder. |
| `github_token` | `false` | The GitHub token to use for authentication and fetching the issue. Defaults to the `GITHUB_TOKEN` secret. |

## Usage

First, you need to create a GitHub Issue Form. You can read more about it [here](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms).

Then, you need to create a workflow file and include the following step:

```yaml
steps:
  - name: Parse issue
    id: parse
    uses: onmax/issue-form-parser@v1.2
    with:
      issue_number: ${{ github.event.issue.number }}

  # Examples on how to use the output
  - name: Show parsed payload data
    run: |
      # Using the character `'` to prevent all characters enclosed within
      # them from being treated as special characters (e.g. $ or `)
      echo '${{ steps.parse.outputs.payload }}'

      # Print the value of the "Name" field
      echo '${{ fromJson(steps.parse.outputs.payload)["Name"] }}'
```

## ⚠️ Limitations

- The action only works with issues, not pull requests.
- **The `issue_number` input is required.** If the event that trigger the workflow is not an issue, you need to specify the issue number manually.
- **The returned `payload` is a string.** You need to use `fromJson` to convert it to a JSON object. Read more about [GitHub Actions expressions](https://docs.github.com/en/actions/learn-github-actions/expressions#fromJson).
- Checkboxes are not supported. If you need to use checkboxes, you can create a PR or use the [`peter-murray/issue-forms-body-parser@v3.0.0`](https://github.com/peter-murray/issue-forms-body-parser)

## Example

This issue:

```md
### Country

Spain

### Age

The age of the candidate is 17 years old

### Languages

Python, TypeScript, and others...

### How many years of experience do you have?

I have 2 years of experience
```

Will be converted to:

```json
{
  "Country": "Spain",
  "Age": "The age of the candidate is 17 years old",
  "Languages": "Python, TypeScript, and others...",
  "How many years of experience do you have?": "I have 2 years of experience"
}
```


## Learn more about the parser

<details>
<summary>Open me!</summary>

## Types of issues

To understand and format the issues, first we need to understand the different types of issues that can be created using GitHub UI. There are two types of issues that can be created:

### Issue Form

This types of forms are created using the issue form feature, where the user needs to fill in the form. The content of the issue is the form itself, and the user's answers are in the body of the issue.

```md
### Question 1\n\nAnswer 1\n\n### Question 2\n\nAnswer 2\n\n### Question 3\n\nAnswer 3
```

This issue will be parsed as:

```json
{
  "Question 1": "Answer 1",
  "Question 2": "Answer 2",
  "Question 3": "Answer 3"
}
```

### Regular issue

This types of forms are the more traditional ones, where the user can write whatever they want in the body of the issue. The content of the issue is the body of the issue.

```md
# Question 1\r\n\r\nThis is my answer\r\n\r\n## Question 2\r\n\r\nThis is my second answer\r\n\r\n#### Question 3\r\n\r\nThis is my third answer
```

This issue will be parsed as:

```json
{
  "Question 1": "This is my answer",
  "Question 2": "This is my second answer",
  "Question 3": "This is my third answer"
}
```

> As you can see, Regular issues required to have a title followed by a block with the answer.

You can see the two types of issues here:
- [Issue Form](https://api.github.com/repos/onmax/nimiq-icons/issues/113)
- [Regular issue](https://api.github.com/repos/onmax/issue-form-parser/issues/10)
</details>

## Acknowledgements

- Based on the previous work of [Peter Murray](https://github.com/peter-murray/issue-forms-body-parser)
- This template was created using the [TypeScript Action Template](https://github.com/actions/typescript-action)
