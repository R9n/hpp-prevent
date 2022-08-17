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

function hppPrevent(request, response, next) {
    let queryParams;
    let bodyParams;

    if (deepObjectSearch) {
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
        isLastParams,
        forbiddenTerms,
        expectedParamsToBeArray
    );

    const bodyParamsSanitizeResult = ignoreBodyParse
        ? { forbiddenParametersFound: [], sanitizedParams: bodyParams }
        : parseParams(
              bodyParams,
              isLastParams,
              forbiddenTerms,
              expectedParamsToBeArray
          );

    const haveForbiddenParameters =
        bodyParamsSanitizeResult.forbiddenParametersFound.length ||
        queryParamsSanitizeResult.forbiddenParametersFound.length;

    const forbiddenParametersFound = [
        ...bodyParamsSanitizeResult.forbiddenParametersFound,
        ...queryParamsSanitizeResult.forbiddenParametersFound,
    ];

    if (haveForbiddenParameters && isToReturn400Reponse) {
        request.query = {};
        request.body = {};
        return handleForbiddenParam(
            invalidParamMessage,
            forbiddenParametersFound,
            response
        );
    }

    request.query = queryParamsSanitizeResult.sanitizedParams;
    request.body = bodyParamsSanitizeResult.sanitizedParams;

    return next();
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
