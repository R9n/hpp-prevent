/* eslint-disable no-undef */

const bodyParser = require('../src/body-parser');

describe('body-parser.js', () => {
    it("Should detect object with key with prototype's pattern", () => {
        const body = {
            query: {},
            param: 'teste',
            '__proto__.admin': 'true',
        };

        const result1 = bodyParser(body);

        expect(result1.sanitizedParams.param).toBe('teste');
    });

    it("Should return bodyParams can't be undefined error when bodyParam property is not provided", () => {
        const body = undefined;

        expect(() => {
            bodyParser(body);
        }).toThrow("bodyParams can't be undefined");
    });
});
