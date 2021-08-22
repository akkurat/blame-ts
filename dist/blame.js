"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blame = exports.StringExtractor = void 0;
const diff_1 = require("diff");
class StringExtractor {
    getCode(a) {
        return a;
    }
    getOrigin(a, idx) {
        return idx;
    }
}
exports.StringExtractor = StringExtractor;
/**
 *
 * @param snapshots
 * idx=0 => most recent snapshot (what is seen in the editor), idx=length-1 => oldest snapshot
 * -> be aware: the the input array will be changed inplace
 *
 * @param extractor
 */
function blame(snapshots, extractor) {
    const result = [];
    const getString = extractor.getCode;
    // extractor can also use idx as origin (see StringExtractor)
    const getOrigin = extractor.getOrigin;
    snapshots.reverse();
    for (const [codeIndex, snapshot] of snapshots.entries()) { //(compareWith: T, codeIndex: number) => {
        const baseCode = codeIndex > 0 ? getString(snapshots[codeIndex - 1]) : '';
        const newerCode = getString(snapshot);
        const diffResults = diff_1.diffLines(baseCode, newerCode, diffOptions);
        // Walk through diff result and check which parts needs to be updated
        let lineIndex = 0;
        for (const [didx, diffResult] of diffResults.entries()) {
            if (diffResult.added) {
                const lines = diffResult.value.split('\n');
                for (const line of lines.slice(0, diffResult.count)) {
                    // Add line to result
                    result.splice(lineIndex, 0, {
                        origin: getOrigin(snapshot, snapshots.length - codeIndex - 1),
                        value: line,
                        diffentry: didx,
                        lineindiff: lineIndex,
                        diff: diffResults
                    });
                    lineIndex += 1;
                }
            }
            else if (diffResult.removed) {
                // Remove lines from result
                result.splice(lineIndex, diffResult.count);
            }
            else {
                // Nothing to do as the code is already part of the result
                lineIndex += diffResult.count || 0;
            }
        }
    }
    return result;
}
exports.blame = blame;
const diffOptions = {
    newlineIsToken: false
};
//# sourceMappingURL=blame.js.map