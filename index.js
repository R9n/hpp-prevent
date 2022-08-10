const { parseRequestQuery } = require('./src/query-parameter-parser');
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

    const queryParamsSanitizeResult = parseRequestQuery(
        queryParams,
        isLastParams,
        forbiddenTerms,
        expectedParamsToBeArray
    );

    if (
        queryParamsSanitizeResult.forbiddenParametersFound.length &&
        isToReturn400Reponse
    ) {
        request.query = {};
        return handleForbiddenParam(
            invalidParamMessage,
            queryParamsSanitizeResult.forbiddenParametersFound,
            response
        );
    }

    request.query = queryParamsSanitizeResult.sanitizedParams;

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
};
