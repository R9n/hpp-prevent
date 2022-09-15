/* eslint-disable no-undef */
const hppPrevent = require('../../index');
const HppPrevent = require('../../index');

describe('index.js', () => {
    it('Should return a correct parsed query object when any property is passed twice', () => {
        const request = {
            query: {
                id: [1, 2, 3],
                name: ['value1', 'value2'],
                lastName: 'teste',
            },
        };
        const response = {
            status: () => {
                return {
                    send: () => {
                        return this;
                    },
                };
            },
        };

        const next = () => {
            return request;
        };

        const generatedMiddleware = HppPrevent.hppPrevent();
        const parsedRequest = generatedMiddleware(request, response, next);

        expect(parsedRequest.query.id).toBe(3);
        expect(parsedRequest.query.name).toBe('value2');
        expect(parsedRequest.query.lastName).toBe('teste');
    });

    it('Should return a correct parsed query object when any property is passed twice and parameter order is set to first element', () => {
        const request = {
            query: {
                id: [1, 2, 3],
                name: ['value1', 'value2'],
                lastName: 'teste',
            },
        };
        const response = {
            status: () => {
                return {
                    send: () => {
                        return this;
                    },
                };
            },
        };

        const next = () => {
            return request;
        };

        HppPrevent.config({ takeLastOcurrences: false });

        const generatedMiddleware = HppPrevent.hppPrevent();
        const parsedRequest = generatedMiddleware(request, response, next);

        expect(parsedRequest.query.id).toBe(1);
        expect(parsedRequest.query.name).toBe('value1');
        expect(parsedRequest.query.lastName).toBe('teste');

        HppPrevent.config({ takeLastOcurrences: true });
    });

    it('Should return a badrequest response when a forbidden item is found in query params ', () => {
        const request = {
            query: {
                id: [1, 2, 3],
                name: ['value1', 'value2'],
                lastName: 'teste',
            },
        };
        const response = {
            status: () => {
                return {
                    send: () => {
                        return `Error. Invalid param`;
                    },
                };
            },
        };

        const next = () => {
            return request;
        };

        HppPrevent.config({ blackList: ['id'], returnBadRequestReponse: true });

        const generatedMiddleware = HppPrevent.hppPrevent();
        const result = generatedMiddleware(request, response, next);

        expect(result).toBe('Error. Invalid param');
        HppPrevent.config({ blackList: [], returnBadRequestReponse: false });
    });

    it('Should return a badrequest response when a forbidden item is found in query values ', () => {
        const request = {
            query: {
                param1: 'id',
                name: ['value1', 'value2'],
                lastName: 'teste',
            },
        };
        const response = {
            status: () => {
                return {
                    send: () => {
                        return `Error. Invalid param`;
                    },
                };
            },
        };

        const next = () => {
            return request;
        };

        HppPrevent.config({ blackList: ['id'], returnBadRequestReponse: true });

        const generatedMiddleware = HppPrevent.hppPrevent();
        const result = generatedMiddleware(request, response, next);

        expect(result).toBe('Error. Invalid param');
        HppPrevent.config({ blackList: [], returnBadRequestReponse: false });
    });

    it('Should ignore succesfully values passed in whitelist array', () => {
        const request = {
            query: {
                id: [1, 2, 3],
                name: ['value1', 'value2'],
                lastName: 'teste',
            },
        };
        const response = {
            status: () => {
                return {
                    send: () => {
                        return this;
                    },
                };
            },
        };

        const next = () => {
            return request;
        };

        HppPrevent.config({ whiteList: ['name'] });

        const generatedMiddleware = HppPrevent.hppPrevent();
        const result = generatedMiddleware(request, response, next);

        expect(result.query.id).toBe(3);

        expect(result.query.name[0]).toBe('value1');

        expect(result.query.name[1]).toBe('value2');

        expect(result.query.lastName).toBe('teste');

        HppPrevent.config({ whiteList: [] });
    });

    it('Should return a query object without prototype', () => {
        const request = {
            query: {
                id: [1, 2, 3],
                name: ['value1', 'value2'],
                lastName: 'teste',
                __proto__: { id: 9 },
            },
        };
        const response = {
            status: () => {
                return {
                    send: () => {
                        return this;
                    },
                };
            },
        };

        const next = () => {
            return request;
        };

        const generatedMiddleware = HppPrevent.hppPrevent();
        const result = generatedMiddleware(request, response, next);

        expect(Object.getPrototypeOf(result.query)).toBe(null);
    });

    it('Should return a badrequest response  with custom message when a forbidden item is found in query values ', () => {
        const request = {
            query: {
                param1: 'id',
                name: ['value1', 'value2'],
                lastName: 'teste',
            },
        };
        const response = {
            status: () => {
                return {
                    send: (message) => {
                        return message;
                    },
                };
            },
        };

        const next = () => {
            return request;
        };

        HppPrevent.config({
            blackList: ['id'],
            returnBadRequestReponse: true,
            customInvalidParamMessage: 'Invalid param',
        });

        const generatedMiddleware = HppPrevent.hppPrevent();
        const result = generatedMiddleware(request, response, next);

        expect(result).toBe('Invalid param');

        HppPrevent.config({
            blackList: [],
            returnBadRequestReponse: false,
            customInvalidParamMessage: undefined,
        });
    });

    it('Should ignore param when a forbidden item is found in query values and the lib is set to no return any response, just ignore the param', () => {
        const request = {
            query: {
                param1: 'id',
                name: ['value1', 'value2'],
                lastName: 'teste',
            },
        };
        const response = {
            status: () => {
                return {
                    send: (message) => {
                        return message;
                    },
                };
            },
        };

        const next = () => {
            return request;
        };

        HppPrevent.config({
            blackList: ['id'],
            returnBadRequestReponse: false,
        });

        const generatedMiddleware = HppPrevent.hppPrevent();
        const result = generatedMiddleware(request, response, next);

        expect(result.query.id).toBe(undefined);
        expect(result.query.name).toBe('value2');
        expect(result.query.lastName).toBe('teste');

        HppPrevent.config({
            blackList: [],
        });
    });
    it('Should remove prototype terms from query object', () => {
        const request = {
            query: {
                id: [1, 2, 3],
                name: ['value1', 'value2'],
                lastName: 'teste',
                __proto__: { id: 9 },
                t: '__proto__',
            },
        };
        const response = {
            status: () => {
                return {
                    send: () => {
                        return this;
                    },
                };
            },
        };

        const next = () => {
            return request;
        };

        const generatedMiddleware = HppPrevent.hppPrevent();
        const result = generatedMiddleware(request, response, next);

        expect(Object.getPrototypeOf(result.query)).toBe(null);
    });
    it('Should remove invalid parameters from request body', () => {
        const request = {
            query: {},
            body: {
                teste: 1,
                pollutedParam: [1, 2],
                '__proto__.admin': true,
            },
        };
        const response = {
            status: () => {
                return {
                    send: (message) => {
                        return message;
                    },
                };
            },
        };

        const next = () => {
            return request;
        };

        const generatedMiddleware = HppPrevent.hppPrevent();
        const result = generatedMiddleware(request, response, next);

        expect(result.body.teste).toBe(1);
        expect(result.body.pollutedParam).toBe(2);
        expect(result.body['__proto__.admin']).toBe(undefined);
    });
    it('Should ignore invalid parameters from request body', () => {
        const request = {
            query: {},
            body: {
                teste: 1,
                teste2: [1, 2],
                '__proto__.admin': true,
            },
        };
        const response = {
            status: () => {
                return {
                    send: (message) => {
                        return message;
                    },
                };
            },
        };

        const next = () => {
            return request;
        };
        HppPrevent.config({ canIgnoreBodyParse: true });

        const generatedMiddleware = HppPrevent.hppPrevent();
        const result = generatedMiddleware(request, response, next);

        expect(result.body.teste).toBe(1);
        expect(result.body.teste2[0]).toBe(1);
        expect(result.body.teste2[1]).toBe(2);
        expect(result.body['__proto__.admin']).toBe(true);
    });

    it('Should reset the lib configuration', () => {
        HppPrevent.config({ canIgnoreBodyParse: true });

        const modifiedConfig = HppPrevent.getCurrentConfig();

        expect(modifiedConfig.ignoreBodyParse).toBe(true);

        HppPrevent.resetConfig();

        const originalConfig = HppPrevent.getCurrentConfig();

        expect(originalConfig.ignoreBodyParse).toBe(false);
    });
    it('Should use the async version when deepSearch is true', async () => {
        const request = {
            query: {
                id: [1, 2, 3],
                name: ['value1', 'value2'],
                lastName: 'teste',
            },
            body: {
                id: [1, 2, 3],
                name: ['value1', 'value2'],
                lastName: 'teste',
            },
        };
        const response = {
            status: () => {
                return {
                    send: () => {
                        return this;
                    },
                };
            },
        };

        const next = () => {
            return request;
        };

        HppPrevent.config({ deepSearch: true, blackList: ['id'] });

        const generatedMiddleware = HppPrevent.hppPrevent();
        const result = generatedMiddleware(request, response, next);

        expect(result.query.id).toBe(undefined);
        expect(result.query.name).toBe('value2');
        expect(result.query.lastName).toBe('teste');
        hppPrevent.resetConfig();
    });
    it('Should override default config with middleware config', async () => {
        const request = {
            query: {
                id3: [1, 2, 3],
                id: [2],
                name: ['value1', 'value2'],
                lastName: 'teste',
            },
            body: {
                id3: [1, 2, 3],
                id: [1],
                name: ['value1', 'value2'],
                lastName: 'teste',
            },
        };
        const response = {
            status: () => {
                return {
                    send: () => {
                        return this;
                    },
                };
            },
        };

        const next = () => {
            return request;
        };

        HppPrevent.config({ deepSearch: true, blackList: ['id'] });

        const generatedMiddleware = HppPrevent.hppPrevent({
            blackList: ['id3'],
        });

        const result = generatedMiddleware(request, response, next);

        expect(result.query.id3).toBe(undefined);
        expect(result.query.name).toBe('value2');
        expect(result.query.lastName).toBe('teste');
        hppPrevent.resetConfig();
    });
});
