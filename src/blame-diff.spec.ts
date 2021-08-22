import { expect } from "chai";
import { blame, StringExtractor } from "./blame";

describe('blame-only', function () {
    it('add-only forw', function () {
        const result = blame(snapshots, new StringExtractor())
        console.log(JSON.stringify(result))

    });
});

const snapshots = [
    "Pferdi\nHans\nLadial\nFranz\nKalala",
    "Pferdi\nHans\nFranz\n",
    "Pferdi\nFranz",
    "Franz\n",
]
