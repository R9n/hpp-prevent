const assert = require('assert');
const {
    isObjectEmpty,
    hasPrototypeTermsInName,
    getParamByOrderChoice,
} = require('./utils/index');

/**
@param objectParams object with query or body parameters
@param isLastParams boolean value to set the parameter's order, if false, take the first occurance, otherwise take the last occurance
@param forbiddenTerms list with the terms that you want to explicity block from query parameters
@param expectedParamsToBeArray list with the params that you expect to be array in the query parameters
@returns Return  a dto like
{
    sanitizedParams, // object parameters sanitized
     forbiddenParametersFound  // forbidden properties found in objectParams and removed from teh sanitized parameters
}
**/
function parseRequestQuery(
    objectParams,
    isLastParams,
    forbiddenTerms,
    expectedParamsToBeArray
) {
    const forbiddenParametersFound = [];

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

    const params = Object.keys(objectParams);

    let sanitizedParam = '';

    for (const param of params) {
        if (
            hasPrototypeTermsInName(objectParams, param) ||
            forbiddenTerms.includes(param.trim()) ||
            forbiddenTerms.includes(objectParams[param])
        ) {
            forbiddenParametersFound.push(param);
            continue;
        }

        if (expectedParamsToBeArray.includes(param.trim())) {
            sanitizedParams[param] = objectParams[param];
            continue;
        }

        const isParamArray = objectParams[param].constructor === Array;

        sanitizedParam = isParamArray
            ? getParamByOrderChoice(objectParams, param, isLastParams)
            : objectParams[param];

        sanitizedParams[param] = sanitizedParam;
    }

    return { sanitizedParams, forbiddenParametersFound };
}

module.exports = parseRequestQuery;
