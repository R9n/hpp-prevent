/* eslint-disable no-undef */
const {
    getParamByOrderChoice,
    hasPrototypeTermsInName,
} = require('../src/query-parameter-parser');

describe('query-parameter-parser.js', () => {
    it("Should detect object with key with prototype's pattern", () => {
        const queryParams = {
            __proto__: {},

            evilProperty: 'constructor',
            normalParam: 'test',
        };

        const result1 = hasPrototypeTermsInName(queryParams, '__proto__');
        const result2 = hasPrototypeTermsInName(queryParams, 'evilProperty');
        const result3 = hasPrototypeTermsInName(queryParams, 'normalParam');

        expect(result1).toBe(true);
        expect(result2).toBe(true);
        expect(result3).toBe(false);
    });

    it("Should get the correct param of the array by order's select choice", () => {
        const queryParams = {
            parameter1: [1, 2, 3],
        };
        const isToTakeLastParameter = true;

        const result1 = getParamByOrderChoice(
            queryParams,
            'parameter1',
            isToTakeLastParameter
        );
        const result2 = getParamByOrderChoice(
            queryParams,
            'parameter1',
            !isToTakeLastParameter
        );

        expect(result1).toBe(3);
        expect(result2).toBe(1);
    });
});
