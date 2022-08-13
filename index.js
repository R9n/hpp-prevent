const parseRequestQuery = require('./src/query-parameter-parser');
const parseRequestBody = require('./src/body-parser');
const { handleForbiddenParam } = require('./src/utils/');

const defaultParameters = require('./src/initial-parameters');

let isLastParams = defaultParameters.isLastParams;

let forbiddenTerms = defaultParameters.forbiddenTerms;

let expectedParamsToBeArray = defaultParameters.expectedParamsToBeArray;

let isToReturn400Reponse = defaultParameters.isToReturn400Reponse;

let invalidParamMessage = defaultParameters.invalidParamMessage;

let ignoreBodyParse = defaultParameters.ignoreBodyParse;

function hppPrevent(request, response, next) {
    const queryParams = { ...request.query };
    const bodyParams = { ...request.body };

    delete request.query;
    delete request.body;

    const queryParamsSanitizeResult = parseRequestQuery(
        queryParams,
        isLastParams,
        forbiddenTerms,
        expectedParamsToBeArray
    );

    const bodyParamsSanitizeResult = ignoreBodyParse
        ? { forbiddenParametersFound: [], sanitizedParams: bodyParams }
        : parseRequestBody(bodyParams);

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
}

function getCurrentConfig() {
    return {
        isLastParams,
        forbiddenTerms,
        expectedParamsToBeArray,
        isToReturn400Reponse,
        invalidParamMessage,
        ignoreBodyParse,
    };
}
function config({
    takeLastOcurrences,
    blackList,
    whiteList,
    returnBadRequestReponse,
    customInvalidParamMessage,
    canIgnoreBodyParse,
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
}

module.exports = {
    config,
    hppPrevent,
    parseRequestQuery,
    parseRequestBody,
    resetConfig,
    getCurrentConfig,
};
