/* eslint-disable no-undef */
const {
    getParamByOrderChoice,
    hasPrototypeTermsInName,
} = require('../src/utils/index');

describe('utils/index.js', () => {
    it("Should detect object with key with prototype's pattern", () => {
        const queryParams = {
            '__proto__.admin': {},
            __proto__: {},
            evilProperty1: 'constructor',
            evilProperty2: '__proto__',
            evilProperty3: '__proto__.admin',
            normalParam: 'test',
        };

        const result1 = hasPrototypeTermsInName(queryParams, '__proto__.admin');
        const result2 = hasPrototypeTermsInName(queryParams, '__proto__');
        const result3 = hasPrototypeTermsInName(queryParams, 'evilProperty1');
        const result4 = hasPrototypeTermsInName(queryParams, 'evilProperty2');
        const result5 = hasPrototypeTermsInName(queryParams, 'evilProperty3');
        const result6 = hasPrototypeTermsInName(queryParams, 'normalParam');

        expect(result1).toBe(true);
        expect(result2).toBe(true);
        expect(result3).toBe(true);
        expect(result4).toBe(true);
        expect(result5).toBe(true);
        expect(result6).toBe(false);
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
