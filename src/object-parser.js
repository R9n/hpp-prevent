const assert = require('assert');
const {
    isObjectEmpty,
    hasPrototypeTermsInName,
    getParamByOrderChoice,
} = require('./utils/index');

/**
 * @param objectParams object with query or body parameters
 * @param isLastParams boolean value to set the parameter's order, if false, take the first occurrence, otherwise take the last occurrence
 * @param forbiddenTerms list with the terms that you want to explicitly block from query parameters
 * @param expectedParamsToBeArray list with the params that you expect to be array in the query parameters
 * @returns Return a dto like
 * {
 *   sanitizedParams, // object parameters sanitized
 *   forbiddenParametersFound  // forbidden properties found in objectParams and removed from the sanitized parameters
 * }
 **/
function parseRequestQuery(
    objectParams,
    isLastParams,
    forbiddenTerms,
    expectedParamsToBeArray
) {
    assert(isLastParams !== undefined, "isLastParams can't be undefined");
    assert(forbiddenTerms !== undefined, "forbiddenTerms can't be undefined");
    assert(
        expectedParamsToBeArray !== undefined,
        "expectedParamsToBeArray can't be undefined"
    );

    if (isObjectEmpty(objectParams)) {
        return { sanitizedParams: {}, forbiddenParametersFound: [] };
    }

    const sanitizedParams = Object.create(null);
    const forbiddenParametersFound = [];

    for (const param of Object.keys(objectParams)) {
        const paramTrimmed = param.trim();
        const paramValue = objectParams[param];

        if (
            hasPrototypeTermsInName(objectParams, param) ||
            forbiddenTerms.includes(paramTrimmed) ||
            forbiddenTerms.includes(paramValue)
        ) {
            forbiddenParametersFound.push(param);
            continue;
        }

        if (expectedParamsToBeArray.includes(paramTrimmed)) {
            sanitizedParams[param] = paramValue;
        } else {
            sanitizedParams[param] = Array.isArray(paramValue)
                ? getParamByOrderChoice(objectParams, param, isLastParams)
                : paramValue;
        }
    }

    return { sanitizedParams, forbiddenParametersFound };
}

module.exports = parseRequestQuery;
