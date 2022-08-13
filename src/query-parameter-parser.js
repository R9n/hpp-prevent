const assert = require('assert');
const {
    isObjectEmpty,
    hasPrototypeTermsInName,
    getParamByOrderChoice,
} = require('./utils/index');

/**
@param queryParams object with query parameters, the request.query object
@param isLastParams boolean value to set the parameter's order, if false, take the first occurance, otherwise take the last occurance
@param forbiddenTerms list with the terms that you want to explicity block from query parameters
@param expectedParamsToBeArray list with the params that you expect to be array in the query parameters
@returns Return  a dto like
{
    sanitizedParams, // query parameters sanitized
     forbiddenParametersFound  // forbidden properties found in query object and removed from teh sanitized parameters
}
**/
function parseRequestQuery(
    queryParams,
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

    if (isObjectEmpty(queryParams)) {
        return { sanitizedParams: {}, forbiddenParametersFound: [] };
    }

    const sanitizedParams = Object.create(null);

    const params = Object.keys(queryParams);

    let sanitizedParam = '';

    for (const param of params) {
        if (
            hasPrototypeTermsInName(queryParams, param) ||
            forbiddenTerms.includes(param.trim()) ||
            forbiddenTerms.includes(queryParams[param])
        ) {
            forbiddenParametersFound.push(param);
            continue;
        }

        if (expectedParamsToBeArray.includes(param.trim())) {
            sanitizedParams[param] = queryParams[param];
            continue;
        }

        const isParamArray = queryParams[param].constructor === Array;

        sanitizedParam = isParamArray
            ? getParamByOrderChoice(queryParams, param, isLastParams)
            : queryParams[param];

        sanitizedParams[param] = sanitizedParam;
    }
    return { sanitizedParams, forbiddenParametersFound };
}

module.exports = parseRequestQuery;
