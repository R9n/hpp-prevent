/* eslint-disable no-undef */

const bodyParser = require('../src/body-parser');

describe('body-parser.js', () => {
    it("Should detect object with key with prototype's pattern", () => {
        const body = {
            param: 'teste',
            param2: '__proto__',
        };

        const result1 = bodyParser(body);

        expect(result1.sanitizedParams.param).toBe('teste');
        expect(result1.forbiddenParametersFound[0]).toBe('param2');
    });
});
