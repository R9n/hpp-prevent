const { isObjectEmpty } = require('./utils/index');

function hasPrototypeTermsInName(queryParams, param) {
    return (
        param.includes('__proto__') ||
        param.includes('constructor') ||
        queryParams[param].includes('__proto__') ||
        queryParams[param].includes('constructor')
    );
}

function getParamByOrderChoice(queryParams, param, isToTakeLastParameter) {
    const firsArrayIndex = 0;
    const lastArrayIndex = queryParams[param].length - 1;

    return isToTakeLastParameter
        ? queryParams[param][lastArrayIndex]
        : queryParams[param][firsArrayIndex];
}

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
