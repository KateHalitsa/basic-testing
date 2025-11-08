// Uncomment the code below and write your tests
/**/ import {  simpleCalculator, Action } from './index';

const testCases = [
    { a: 1, b: 2, action: Action.Add, expected: 3 },
    { a: 2, b: 2, action: Action.Add, expected: 4 },
    { a: 3, b: 2, action: Action.Add, expected: 5 },
    {a : 5, b: 3, action: Action.Subtract,expected: 2 },
    { a: 2, b: 4, action: Action.Multiply, expected: 8 },
    { a: 6, b: 2, action: Action.Divide, expected: 3 },
    { a: 2, b: 3, action: Action.Exponentiate, expected: 8 },
];
const invalidCases = [
    { a: 'a', b: 3, action: Action.Add },
    { a: 2, b: 'b', action: Action.Subtract },
    { a: 4, b: 2, action: ':<' },
];
describe('simpleCalculator', () => {
  // This test case is just to run this test suite, remove it when you write your own tests
    test.each(testCases)(
        'returns $expected for $a $action $b',
        ({ a, b, action, expected }) => {
            expect(simpleCalculator({ a, b, action })).toBe(expected);
        },
    );
    test.each(invalidCases)(
        'returns null for invalid input %#',
        ({ a, b, action }) => {
            expect(simpleCalculator({ a, b, action })).toBeNull();
        },
    );

});
