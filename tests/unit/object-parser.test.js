/* eslint-disable no-undef */

const queryParameterParser = require('../../src/object-parser');

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

    describe('parseParamsDeep', () => {
        it("Should throw when isLastParams is undefined", () => {
            expect(() => {
                queryParameterParser.parseParamsDeep(
                    { a: 1 },
                    undefined,
                    [],
                    []
                );
            }).toThrow("isLastParams can't be undefined");
        });

        it("Should throw when forbiddenTerms is undefined", () => {
            expect(() => {
                queryParameterParser.parseParamsDeep(
                    { a: 1 },
                    true,
                    undefined,
                    []
                );
            }).toThrow("forbiddenTerms can't be undefined");
        });

        it("Should throw when expectedParamsToBeArray is undefined", () => {
            expect(() => {
                queryParameterParser.parseParamsDeep(
                    { a: 1 },
                    true,
                    [],
                    undefined
                );
            }).toThrow("expectedParamsToBeArray can't be undefined");
        });

        it("Should return empty result when objectParams is empty", () => {
            const result = queryParameterParser.parseParamsDeep(
                {},
                true,
                [],
                []
            );
            expect(result).toEqual({
                sanitizedParams: {},
                forbiddenParametersFound: [],
            });
        });

        it("Should return empty result when objectParams is empty array", () => {
            const result = queryParameterParser.parseParamsDeep(
                [],
                true,
                [],
                []
            );
            expect(result).toEqual({
                sanitizedParams: {},
                forbiddenParametersFound: [],
            });
        });

        it("Should recursively sanitize array elements", () => {
            const input = [{ name: 'a' }, { name: 'b' }];
            const result = queryParameterParser.parseParamsDeep(
                input,
                true,
                [],
                []
            );
            expect(result.sanitizedParams).toEqual([
                { name: 'a' },
                { name: 'b' },
            ]);
        });

        it("Should preserve whitelisted arrays in nested objects", () => {
            const input = { user: { tags: ['a', 'b', 'c'] } };
            const result = queryParameterParser.parseParamsDeep(
                input,
                true,
                [],
                ['tags']
            );
            expect(result.sanitizedParams).toEqual({
                user: { tags: ['a', 'b', 'c'] },
            });
        });
    });
});
