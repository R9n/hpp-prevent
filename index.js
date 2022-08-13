const parseRequestQuery = require('./src/query-parameter-parser');
const parseRequestBody = require('./src/body-parser');
const { handleForbiddenParam } = require('./src/utils/');

let isLastParams = true;

let forbiddenTerms = ['__proto__', 'constructor'];

let expectedParamsToBeArray = [];

let isToReturn400Reponse = false;

let invalidParamMessage;

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

    const bodyParamsSanitizeResult = parseRequestBody(bodyParams);

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

function config({
    takeLastOcurrences,
    blackList,
    whiteList,
    returnBadRequestReponse,
    customInvalidParamMessage,
}) {
    isLastParams = takeLastOcurrences ?? isLastParams;
    forbiddenTerms = blackList ?? forbiddenTerms;
    expectedParamsToBeArray = whiteList ?? expectedParamsToBeArray;
    isToReturn400Reponse = returnBadRequestReponse ?? isToReturn400Reponse;
    invalidParamMessage = customInvalidParamMessage ?? invalidParamMessage;
}

module.exports = {
    config,
    hppPrevent,
    parseRequestQuery,
    parseRequestBody,
};
