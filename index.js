const parseParams = require('./src/object-parser');

const { handleForbiddenParam, plainObject } = require('./src/utils/');

const defaultParameters = require('./src/initial-parameters');

let isLastParams = defaultParameters.isLastParams;

let forbiddenTerms = defaultParameters.forbiddenTerms;

let expectedParamsToBeArray = defaultParameters.expectedParamsToBeArray;

let isToReturn400Reponse = defaultParameters.isToReturn400Reponse;

let invalidParamMessage = defaultParameters.invalidParamMessage;

let deepObjectSearch = defaultParameters.deepSearch;

let ignoreBodyParse = defaultParameters.ignoreBodyParse;

function hppPrevent({
    takeLastOcurrences,
    blackList,
    whiteList,
    returnBadRequestReponse,
    customInvalidParamMessage,
    canIgnoreBodyParse,
    deepSearch,
} = {}) {
    const isLastParamsConfig = takeLastOcurrences ?? isLastParams;

    const forbiddenTermsConfig = blackList ?? forbiddenTerms;

    const expectedParamsToBeArrayConfig = whiteList ?? expectedParamsToBeArray;

    const isToReturn400ReponseConfig =
        returnBadRequestReponse ?? isToReturn400Reponse;

    const invalidParamMessageConfig =
        customInvalidParamMessage ?? invalidParamMessage;

    const deepObjectSearchConfig = canIgnoreBodyParse ?? deepObjectSearch;

    const ignoreBodyParseConfig = deepSearch ?? ignoreBodyParse;

    return (request, response, next) => {
        let queryParams;
        let bodyParams;

        if (deepObjectSearchConfig) {
            queryParams = plainObject(request.query);
            bodyParams = plainObject(request.body);
        } else {
            queryParams = { ...request.query };
            bodyParams = { ...request.body };
        }

        delete request.query;
        delete request.body;

        const queryParamsSanitizeResult = parseParams(
            queryParams,
            isLastParamsConfig,
            forbiddenTermsConfig,
            expectedParamsToBeArrayConfig
        );

        const bodyParamsSanitizeResult = ignoreBodyParseConfig
            ? { forbiddenParametersFound: [], sanitizedParams: bodyParams }
            : parseParams(
                  bodyParams,
                  isLastParamsConfig,
                  forbiddenTermsConfig,
                  expectedParamsToBeArrayConfig
              );

        const haveForbiddenParameters =
            bodyParamsSanitizeResult.forbiddenParametersFound.length ||
            queryParamsSanitizeResult.forbiddenParametersFound.length;

        const forbiddenParametersFound = [
            ...bodyParamsSanitizeResult.forbiddenParametersFound,
            ...queryParamsSanitizeResult.forbiddenParametersFound,
        ];

        if (haveForbiddenParameters && isToReturn400ReponseConfig) {
            request.query = {};
            request.body = {};
            return handleForbiddenParam(
                invalidParamMessageConfig,
                forbiddenParametersFound,
                response
            );
        }

        request.query = queryParamsSanitizeResult.sanitizedParams;
        request.body = bodyParamsSanitizeResult.sanitizedParams;

        return next();
    };
}

function resetConfig() {
    isLastParams = defaultParameters.isLastParams;

    forbiddenTerms = defaultParameters.forbiddenTerms;

    expectedParamsToBeArray = defaultParameters.expectedParamsToBeArray;

    isToReturn400Reponse = defaultParameters.isToReturn400Reponse;

    invalidParamMessage = defaultParameters.invalidParamMessage;

    ignoreBodyParse = defaultParameters.ignoreBodyParse;

    deepObjectSearch = defaultParameters.deepSearch;
}

function getCurrentConfig() {
    return {
        isLastParams,
        forbiddenTerms,
        expectedParamsToBeArray,
        isToReturn400Reponse,
        invalidParamMessage,
        ignoreBodyParse,
        deepObjectSearch,
    };
}

/**
 @deprecated Since version 2.0.0

 Now you can apply configuration directly to the middleware. This way

 ```
 app.use(httpPrevent.hppPrevent({

  takeLastOcurrences: true,

  deepSearch: true,

  whiteList: ["friends", "tags"],

}));
```
**/
function config({
    takeLastOcurrences,
    blackList,
    whiteList,
    returnBadRequestReponse,
    customInvalidParamMessage,
    canIgnoreBodyParse,
    deepSearch,
}) {
    isLastParams = takeLastOcurrences ?? defaultParameters.isLastParams;

    forbiddenTerms = blackList ?? defaultParameters.forbiddenTerms;

    expectedParamsToBeArray =
        whiteList ?? defaultParameters.expectedParamsToBeArray;

    isToReturn400Reponse =
        returnBadRequestReponse ?? defaultParameters.isToReturn400Reponse;

    invalidParamMessage =
        customInvalidParamMessage ?? defaultParameters.invalidParamMessage;

    ignoreBodyParse = canIgnoreBodyParse ?? defaultParameters.ignoreBodyParse;

    deepObjectSearch = deepSearch ?? defaultParameters.deepSearch;
}

module.exports = {
    config,
    hppPrevent,
    parseRequestQuery: parseParams,
    resetConfig,
    getCurrentConfig,
    parseParams,
};
