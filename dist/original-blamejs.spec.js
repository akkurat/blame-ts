"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mocha_1 = require("mocha");
const chai_1 = require("chai");
const index_1 = require("./index");
const blame_1 = require("./blame");
const chai = __importStar(require("chai"));
const chai_exclude_1 = __importDefault(require("chai-exclude"));
chai.use(chai_exclude_1.default);
const extractor = {
    getCode: (item) => item.code,
    getOrigin: (item) => item.id,
};
const excludeAddinfo = ['diff', 'diffentry', 'lineindiff'];
mocha_1.describe('blame', () => {
    mocha_1.it('is a function', () => {
        chai_1.expect(index_1.blame).to.be.a('function');
    });
    mocha_1.it('returns array containing every line and its origin', () => {
        const codes = [
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
        ];
        chai_1.expect(index_1.blame(codes, extractor)).to.be.a('Array')
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
        ]);
    });
    mocha_1.it('returns array containing every line and its index', () => {
        const codes = [
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
        ];
        chai_1.expect(index_1.blame(codes, new blame_1.StringExtractor())).to.be.a('Array')
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
        ]);
    });
    mocha_1.it('returns array containing every line and its origin with trimmed source code', () => {
        const codes = [
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
        ];
        chai_1.expect(index_1.blame(codes, extractor)).to.be.a('Array')
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
        ]);
    });
    mocha_1.it('returns array containing every line and its origin with whitespace eol', () => {
        const codes = [
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
        ];
        chai_1.expect(index_1.blame(codes, extractor)).to.be.a('Array')
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
        ]);
    });
});
//# sourceMappingURL=original-blamejs.spec.js.map