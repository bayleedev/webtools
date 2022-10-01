import { inspect } from 'util'

const assert = (value: any, msg: string, data?: any) => {
  const msgAndDataArray = [
    msg,
    data
  ].filter(Boolean)

  if (value) {
    console.log('💚 SUCCESS', ...msgAndDataArray)
  } else {
    console.log('🌻 FAILURE', ...msgAndDataArray)
  }
}

const assertObjectsEqual = (value_1: any, value_2: any, msg: string, data?: any) => {
  const value_1_string = JSON.stringify(value_1, null, '\t')
  const value_2_string = JSON.stringify(value_2, null, '\t')
  return assert(value_1_string === value_2_string, msg, {
    value_1_string: inspect(value_1),
    value_2_string: inspect(value_2),
    ...data
  })
}

const removeSubset = (largeString: string, sample: string) => {
  const sampleIdx = largeString.indexOf(sample)
  const begin = largeString.slice(0, sampleIdx)
  const end = largeString.slice(sampleIdx + sample.length, largeString.length)
  return begin + end
}

type KeyValueObj = Record<string, string[]>
type ParseReturn = Record<string, KeyValueObj[]>

const lineParse = (input: string): KeyValueObj => {
  const lines: string[] = input.trim().split('\n')
  return lines.reduce((acc: KeyValueObj, line: string): KeyValueObj => {
    const [key, value] = line.split(':')
    if (['BEGIN', 'END'].includes(key)) {
      return acc
    }
    const oldValue = acc[key] || []
    return {
      ...acc,
      [key]: [
        value,
        ...oldValue,
      ]
    }
  }, {})
}

const parse = (input: string): ParseReturn => {
  const regex = /BEGIN:(?<key>.*)(?<props>((?!BEGIN).)*)END:\k<key>/gs
  const matches = input.match(regex)
  if (!matches || matches.length === 0) {
    return {}
  }
  const matchGroups = matches.reduce((acc: any, currMatch: string) => {
    const found = currMatch.match(/^BEGIN:(.*)$/m)
    if (found) {
      const fullKey = found[1]
      acc[fullKey] = acc[fullKey] || []
      acc[fullKey].push(lineParse(currMatch))
    }
    return acc
  }, {})

  const subInput: string = matches.reduce((acc:string, match: string) => {
    return removeSubset(acc, match)
  }, input)

  if (subInput) {
    return {
      ...matchGroups,
      ...parse(subInput),
    }
  }
  return {
    ...matchGroups,
  }
}

const test_parse_line = () => {
  const actualKeys = lineParse('BEGIN:MEOW\nVERSION:2\nEND:MEOW')
  const expectedKeys = {
    VERSION: ['2']
  }
  assertObjectsEqual(actualKeys, expectedKeys, 'test_parse_line')
}

const test_basic_io = () => {
  const input = `BEGIN:MEOW
VERSION:2
BEGIN:RUFF
VERSION:3
END:RUFF
NAME:BAZ
BEGIN:RUFF
VERSION:4
END:RUFF
FOO:BAZ
END:MEOW`

  const expectedOutput = {
    RUFF: [{
      VERSION: ['3'],
    }, {
      VERSION: ['4'],
    }],
    MEOW: [{
      VERSION: ['2'],
      NAME: ['BAZ'],
      FOO: ['BAZ'],
    }]
  }

  assertObjectsEqual(parse(input), expectedOutput, 'test_basic_io')
}

test_basic_io()
test_parse_line()

export {}
