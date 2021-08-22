import { Change, diffLines, LinesOptions } from 'diff'

export interface IBlameLine<S> {
  origin: S 
  value: string
  diffentry?: number
  lineindiff?: number
  previousOrigin?: S
  diff?: Change[]
}

export interface IExtractor<T,S> {
   getCode: (a: T) => string
   getOrigin: (a: T, idx: number) => S
}

export class StringExtractor<T extends string> implements IExtractor<T,number> {
  getCode(a: T): T {
    return a;
  } 
  getOrigin(a: string, idx: number): number {
    return idx;
  }
}

/**
 * 
 * @param snapshots 
 * idx=0 => most recent snapshot (what is seen in the editor), idx=length-1 => oldest snapshot 
 * -> be aware: the the input array will be changed inplace
 * 
 * @param extractor 
 */
export function blame<T,S>( 
  snapshots: Array<T>,
  extractor: IExtractor<T,S>,
): Array<IBlameLine<S>> {

  const result: Array<IBlameLine<S>> = []

  const getString = extractor.getCode
  // extractor can also use idx as origin (see StringExtractor)
  const getOrigin = extractor.getOrigin 



  snapshots.reverse()

  for( const [codeIndex, snapshot] of snapshots.entries()) { //(compareWith: T, codeIndex: number) => {
    const baseCode = codeIndex > 0 ? getString(snapshots[codeIndex-1]) : ''
    const newerCode = getString(snapshot)

    const diffResults: Change[] = diffLines(baseCode, newerCode, diffOptions)

    // Walk through diff result and check which parts needs to be updated
    let lineIndex = 0
    for( const [didx, diffResult] of diffResults.entries() ) {
      if (diffResult.added) {
        const lines = diffResult.value.split('\n');
        for( const line of lines.slice(0, diffResult.count) ) {
            // Add line to result
            result.splice(lineIndex, 0, {
              origin: getOrigin(snapshot, snapshots.length - codeIndex - 1 ),
              value: line,
              diffentry: didx,
              lineindiff: lineIndex,
              diff: diffResults
            })
            lineIndex += 1
          }
      } else if (diffResult.removed) {
        // Remove lines from result
        result.splice(lineIndex, diffResult.count)
      } else {
        // Nothing to do as the code is already part of the result
        lineIndex += diffResult.count || 0
      }
    }
  }

  return result
}



const diffOptions: LinesOptions = {
  newlineIsToken: false
}