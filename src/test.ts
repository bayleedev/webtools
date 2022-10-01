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
  const assertValue = value_1_string === value_2_string
  return assert(assertValue, msg, (assertValue || {
    value_1_string: inspect(value_1, { depth: null }),
    value_2_string: inspect(value_2, { depth: null }),
    ...data
  }))
}

const removeSubset = (largeString: string, sample: string) => {
  const sampleIdx = largeString.indexOf(sample)
  const begin = largeString.slice(0, sampleIdx)
  const end = largeString.slice(sampleIdx + sample.length, largeString.length)
  return begin + end
}

type KeyValueObj = Record<string, string[]>
type ParseReturn = Record<string, KeyValueObj[]>

const badLine = /^.+;.+=.+:.+$/

const lineParse = (input: string): KeyValueObj => {
  const lines: string[] = input.trim().split('\n')
  let followerKey: string = ''
  return lines.reduce((acc: KeyValueObj, line: string): KeyValueObj => {
    if (line.match(badLine)) {
      return acc
    }
    const matches = line.match(/^(?<key>[A-Z]+):(?<value>.*)$/)
    let key, value;
    if (!matches || !matches.groups) {
      key = followerKey
      value = line
    } else {
      key = matches.groups.key
      value = matches.groups.value
    }
    if (['BEGIN', 'END'].includes(key) || !value) {
      return acc
    }
    const oldValue = acc[key] || []
    followerKey = key
    return {
      ...acc,
      [key]: [
        ...oldValue,
        value,
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
      acc[fullKey].unshift(lineParse(currMatch))
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
      VERSION: ['4'],
    }, {
      VERSION: ['3'],
    }],
    MEOW: [{
      VERSION: ['2'],
      NAME: ['BAZ'],
      FOO: ['BAZ'],
    }]
  }

  assertObjectsEqual(parse(input), expectedOutput, 'test_basic_io')
}

const test_sample_isc = () => {
  const input = `
BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
CLASS:PUBLIC
DESCRIPTION:Foobar\nDate and Time - Sep 30\\, 2022 12:00 AM to 12:00 AM\nVenue - 1111 Winchester Blvd\\, Portland OR\\, 97232\nfoobaz\n
DTSTART:20220930T070000Z
DTEND:20220930T070000Z
LOCATION:1111 Winchester Blvd, Portland OR, 97232
SUMMARY;LANGUAGE=en-us:Foobar
END:VEVENT
END:VCALENDAR`
  const expectedOutput = {
    VEVENT: [{
      CLASS: ['PUBLIC'],
      DESCRIPTION: [
        'Foobar',
        'Date and Time - Sep 30\\, 2022 12:00 AM to 12:00 AM',
        'Venue - 1111 Winchester Blvd\\, Portland OR\\, 97232',
        'foobaz'
      ],
      DTSTART: ['20220930T070000Z'],
      DTEND: ['20220930T070000Z'],
      LOCATION: ['1111 Winchester Blvd, Portland OR, 97232'],
    }],
    VCALENDAR: [{
      VERSION: ['2.0'],
    }],
  }

  const actualOutput = parse(input)
  assertObjectsEqual(actualOutput, expectedOutput, 'test_sample_isc')
}

test_sample_isc()
test_basic_io()
test_parse_line()

export {}
