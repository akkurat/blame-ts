import { describe, it } from 'mocha'
import { expect } from 'chai'
import { blame } from './index'
import { IExtractor, StringExtractor } from './blame'
import * as chai from 'chai';
import chaiExclude from 'chai-exclude';

chai.use(chaiExclude);

type snapshot = {
  code: string
  id: string
}

const extractor: IExtractor<snapshot, string> = {
  getCode: (item: snapshot): string => item.code,
  getOrigin: (item: snapshot): string => item.id,
}

const excludeAddinfo = ['diff', 'diffentry', 'lineindiff']

describe('blame', () => {
  it('is a function', () => {
    expect(blame).to.be.a('function')
  })

  it('returns array containing every line and its origin', () => {
    const codes: Array<snapshot> = [
      {
        id: '0',
        code: `
          REPORT test.

          WRITE 'a'.
        `,
      },
      {
        id: '1',
        code: `
          REPORT test.

          WRITE 'b'.
          WRITE 'c'.
          WRITE 'd'.
        `,
      },
      {
        id: '2',
        code: `
          REPORT test.

          WRITE 'a'.
          WRITE 'c'.
        `,
      },
    ]

    expect(blame(codes, extractor)).to.be.a('Array')
    .excludingEvery(excludeAddinfo)
    .and.deep.equal([
      {
        origin: '2',
        value: '',
      },
      {
        origin: '2',
        value: '          REPORT test.',
      },
      {
        origin: '2',
        value: '',
      },
      {
        origin: '0',
        value: "          WRITE 'a'.",
      },
      {
        origin: '2',
        value: '        ',
      },
    ])
  })

  it('returns array containing every line and its index', () => {
    const codes: Array<string> = [
      `
        REPORT test.

        WRITE 'a'.
        WRITE 'd'.
      `,
      `
        REPORT test.

        WRITE 'b'.
        WRITE 'c'.
        WRITE 'd'.
      `,
      `
        REPORT test.

        WRITE 'a'.
        WRITE 'c'.
      `,
    ]

    expect(blame(codes, new StringExtractor())).to.be.a('Array')
    .excludingEvery(excludeAddinfo)
    .and.deep.equal([
      {
        origin: 2,
        value: '',
      },
      {
        origin: 2,
        value: '        REPORT test.',
      },
      {
        origin: 2,
        value: '',
      },
      {
        origin: 0,
        value: "        WRITE 'a'.",
      },
      {
        origin: 1,
        value: "        WRITE 'd'.",
      },
      {
        origin: 2,
        value: '      ',
      },
    ])
  })

  it('returns array containing every line and its origin with trimmed source code', () => {
    const codes: Array<snapshot> = [
      {
        id: '0',
        code: `
          REPORT test2.

          WRITE 'a'.
          WRITE 'd'.
        `,
      },
      {
        id: '1',
        code: `
          REPORT test2.

          WRITE 'b'.
          WRITE 'c'.
          WRITE 'd'.
        `,
      },
      {
        id: '2',
        code: `
          REPORT test.

          WRITE 'a'.
          WRITE 'c'.
        `,
      },
    ]

    expect(blame(codes, extractor)).to.be.a('Array')
    .excludingEvery(excludeAddinfo)
    .and.deep.equal([
      {
        origin: '2',
        value: '',
      },
      {
        origin: '1',
        value: '          REPORT test2.',
      },
      {
        origin: '2',
        value: '',
      },
      {
        origin: '0',
        value: "          WRITE 'a'.",
      },
      {
        origin: '1',
        value: "          WRITE 'd'.",
      },
      {
        origin: '2',
        value: '        ',
      },
    ])
  })

  it('returns array containing every line and its origin with whitespace eol', () => {
    const codes: Array<snapshot> = [
      {
        id: '0',
        code: `
          REPORT test2. 

          WRITE 'a'. 
          WRITE 'd'.
        `,
      },
      {
        id: '1',
        code: `
          REPORT test2. 

          WRITE 'b'.
          WRITE 'c'.
          WRITE 'd'.
        `,
      },
      {
        id: '2',
        code: `
          REPORT test. 

          WRITE 'a'. 
          WRITE 'c'.
        `,
      },
    ]

    expect(blame(codes, extractor)).to.be.a('Array')
    .excludingEvery(excludeAddinfo)
    .and.deep.equal([
      {
        origin: '2',
        value: '',
      },
      {
        origin: '1',
        value: '          REPORT test2. ',
      },
      {
        origin: '2',
        value: '',
      },
      {
        origin: '0',
        value: "          WRITE 'a'. ",
      },
      {
        origin: '1',
        value: "          WRITE 'd'.",
      },
      {
        origin: '2',
        value: '        ',
      },
    ])
  })
})
