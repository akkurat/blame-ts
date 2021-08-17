# blame-ts

_blame-ts_ compares an array of source codes and outputs information about where each line originates from.
Its behaviour is similar to the blame functionality that is integrated in _Git_.

## Install

`npm install --save https://github.com/akkurat/blame-ts.git`

## Usage

Pay attention to the order of items in the array: the first one in the array is the newest. The items can either be simple texts or objects. 
The latter requires to pass an `getCode` and `getOrigin` function to be passed in the options (see example 2).
```typescript
import { blame, IBlameLine } from 'blame-ts';

/*
Result:
[ { origin: 0, value: 'a' },
  { origin: 0, value: 'b' },
  { origin: 2, value: 'c' } ]
*/
blame([`a
b
c`,
`c`,
`a
b
c`
])

/*
Result:
[ { origin: 'Commit #3', value: 'a' },
  { origin: 'Commit #3', value: 'b' },
  { origin: 'Commit #1', value: 'c' } ]
*/
blame(
  [
    {
      commit: 'Commit #3',
      code: `a
b
c`,
    },
    {
      commit: 'Commit #2',
      code: `c`,
    },
    {
      commit: 'Commit #1',
      code: `a
b
c`,
    },
  ],
  {
    getCode: item => item.code,
    getOrigin: item => item.commit,
  },
)
```

## Running the tests

Mocha tests are implemented and you can run all tests via
```
npm run test
```

## Built With

* [diff](https://github.com/kpdecker/jsdiff) - a javascript text differencing implementation

## Authors

* **Julian Hundeloh** - *Initial work* - [jaulz](https://github.com/jaulz)

See also the list of [contributors](https://github.com/hundeloh-consulting/r3connect/contributors) who participated in this project.

* **Moritz Vifian** - Rewrite in Typescript
## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details. 
