const {
    isObjectEmpty,
    hasPrototypeTermsInName,
    getParamByOrderChoice,
} = require('./utils/index');

function parseRequestQuery(
    queryParams,
    isLastParams,
    forbiddenTerms,
    expectedParamsToBeArray
) {
    const forbiddenParametersFound = [];

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
