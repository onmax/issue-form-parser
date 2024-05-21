import { expect, test } from '@jest/globals'
import { parseIssueBody } from '../src/util'

test('One section', async () => {
  const body = '### name1\n\nvalue 1'
  const res = parseIssueBody(body, { debug: console.log })
  const expected = {
    name1: 'value 1'
  }
  expect(res).toEqual(expected)
})

test('Multiple sections', async () => {
  const body =
    '### name1\n\nhtml```<h1>Hola</h1>```\n\n### name2\n\nSalut\n\n### name3\n\nvalue3\n\nAnother sentence'
  const res = parseIssueBody(body, { debug: console.log })
  const expected = {
    name1: 'html```<h1>Hola</h1>```',
    name2: 'Salut',
    name3: 'value3\n\nAnother sentence'
  }
  expect(res).toEqual(expected)
})

test('Normal body', async () => {
  const body =
    '### name1\n\nvalue1\n\n### This is a longer section\n\nWith a longer answers!!\n\nBut it works!!\n\n### name3\n\nvalue3'
  const res = parseIssueBody(body, { debug: console.log })
  const expected = {
    name1: 'value1',
    'This is a longer section': 'With a longer answers!!\n\nBut it works!!',
    name3: 'value3'
  }
  expect(res).toEqual(expected)
})

test('With undefined', async () => {
  const body = '### name1\n\n### name2\n\nvalue2\n\n### name3\n\nvalue3'
  const res = parseIssueBody(body, { debug: console.log })
  const expected = {
    name1: undefined,
    name2: 'value2',
    name3: 'value3'
  }
  expect(res).toEqual(expected)
})

test('Body with SVG as HTML', async () => {
  const body =
    '### Name\n\nBulb\n\n### Keywords\n\nlight, solution, idea, bulb\n\n### SVG\n\n<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none"><path stroke="#21bca5" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M32.01 3.01v7.56m-21.39 1.3 5.35 5.35m37.43-5.35-5.34 5.35M3.03 33.26h7.56m50.41 0h-7.56"/><path fill="#21bca5" fill-rule="evenodd" d="M40 46.37a16 16 0 1 0-16 0v6.13a8 8 0 1 0 16 0v-6.13z" clip-rule="evenodd" opacity=".4"/></svg>'
  const res = parseIssueBody(body, { debug: console.log })
  const expected = {
    Name: 'Bulb',
    Keywords: ['light', 'solution', 'idea', 'bulb'],
    SVG: '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="none"><path stroke="#21bca5" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M32.01 3.01v7.56m-21.39 1.3 5.35 5.35m37.43-5.35-5.34 5.35M3.03 33.26h7.56m50.41 0h-7.56"/><path fill="#21bca5" fill-rule="evenodd" d="M40 46.37a16 16 0 1 0-16 0v6.13a8 8 0 1 0 16 0v-6.13z" clip-rule="evenodd" opacity=".4"/></svg>'
  }
  expect(res).toEqual(expected)
})

test('Invalid body', async () => {
  const body =
    '# This is a h1.\n\nAnd this\n\n## this is a h2 \n\nwith another content\n\nparagraph'
  const res = parseIssueBody(body, { debug: console.log })
  const expected = {
    'This is a h1.': 'And this',
    'this is a h2 ': 'with another content\n\nparagraph'
  }
  expect(res).toEqual(expected)
})

test('Simple dropdown', async () => {
  const body = '### name1\n\nvalue1, value2, value3'
  const res = parseIssueBody(body, { debug: console.log })
  const expected = {
    name1: ['value1', 'value2', 'value3']
  }
  expect(res).toEqual(expected)
})

test('Checkbox', async () => {
  const body = '### name1\n\n- [X] value1\n- [ ] value2\n- [x] value3'
  const res = parseIssueBody(body, { debug: console.log })
  const expected = {
    name1: { value1: true, value2: false, value3: true }
  }
  expect(res).toEqual(expected)
})
