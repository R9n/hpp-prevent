/* eslint-disable no-undef */

const queryParameterParser = require('../src/query-parameter-parser');

describe('query-parameter-parser.js', () => {
    it("Should isLastParams can't be undefined error when no isLatParam property is passed to query parser ", () => {
        const query = {
            query: {},
            param: 'teste',
            '__proto__.admin': 'true',
        };

        const isLastParams = undefined;
        const forbiddenTerms = [];
        const expectedParamsToBeArray = [];

        expect(() => {
            queryParameterParser(
                query,
                isLastParams,
                forbiddenTerms,
                expectedParamsToBeArray
            );
        }).toThrow("isLastParams can't be undefined");
    });
    it("Should return expectedParamsToBeArray can't be undefined error when no isLatParam property is passed to query parser ", () => {
        const query = {
            query: {},
            param: 'teste',
            '__proto__.admin': 'true',
        };

        const isLastParams = true;
        const forbiddenTerms = [];
        const expectedParamsToBeArray = undefined;

        expect(() => {
            queryParameterParser(
                query,
                isLastParams,
                forbiddenTerms,
                expectedParamsToBeArray
            );
        }).toThrow("expectedParamsToBeArray can't be undefined");
    });
    it("Should forbiddenTerms can't be undefined error when no isLatParam property is passed to query parser ", () => {
        const query = {
            query: {},
            param: 'teste',
            '__proto__.admin': 'true',
        };

        const isLastParams = true;
        const forbiddenTerms = undefined;
        const expectedParamsToBeArray = [];

        expect(() => {
            queryParameterParser(
                query,
                isLastParams,
                forbiddenTerms,
                expectedParamsToBeArray
            );
        }).toThrow("forbiddenTerms can't be undefined");
    });
});
