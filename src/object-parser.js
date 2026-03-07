const {
    isObjectEmpty,
    hasPrototypeTermsInName,
    getParamByOrderChoice,
} = require('./utils/index');

/**
 * Sanitiza recursivamente preservando a estrutura aninhada.
 * Detecta termos proibidos em qualquer nível sem achatar o objeto.
 *
 * @param objectParams valor a sanitizar (objeto, array ou primitivo)
 * @param isLastParams boolean - true = última ocorrência em arrays; false = primeira
 * @param forbiddenTerms lista de termos proibidos
 * @param expectedParamsToBeArray lista de chaves que podem permanecer como array
 * @param forbiddenParametersFound array acumulador (mutado durante recursão)
 * @returns valor sanitizado
 */
function sanitizeRecursive(
    objectParams,
    isLastParams,
    forbiddenTerms,
    expectedParamsToBeArray,
    forbiddenParametersFound
) {
    if (objectParams === null || typeof objectParams !== 'object') {
        return objectParams;
    }

    if (Array.isArray(objectParams)) {
        return objectParams.map((item) =>
            sanitizeRecursive(
                item,
                isLastParams,
                forbiddenTerms,
                expectedParamsToBeArray,
                forbiddenParametersFound
            )
        );
    }

    const sanitizedParams = Object.create(null);

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
            sanitizedParams[param] = sanitizeRecursive(
                paramValue,
                isLastParams,
                forbiddenTerms,
                expectedParamsToBeArray,
                forbiddenParametersFound
            );
        } else if (Array.isArray(paramValue)) {
            const chosen = getParamByOrderChoice(
                objectParams,
                param,
                isLastParams
            );
            sanitizedParams[param] = sanitizeRecursive(
                chosen,
                isLastParams,
                forbiddenTerms,
                expectedParamsToBeArray,
                forbiddenParametersFound
            );
        } else if (paramValue !== null && typeof paramValue === 'object') {
            sanitizedParams[param] = sanitizeRecursive(
                paramValue,
                isLastParams,
                forbiddenTerms,
                expectedParamsToBeArray,
                forbiddenParametersFound
            );
        } else {
            sanitizedParams[param] = paramValue;
        }
    }

    return sanitizedParams;
}

/**
 * Parse recursivo que preserva a estrutura aninhada (para deepSearch).
 * Retorna o mesmo formato que parseRequestQuery.
 */
function parseParamsDeep(
    objectParams,
    isLastParams,
    forbiddenTerms,
    expectedParamsToBeArray
) {
    if (isLastParams === undefined) {
        throw new TypeError("isLastParams can't be undefined");
    }
    if (forbiddenTerms === undefined) {
        throw new TypeError("forbiddenTerms can't be undefined");
    }
    if (expectedParamsToBeArray === undefined) {
        throw new TypeError("expectedParamsToBeArray can't be undefined");
    }

    if (isObjectEmpty(objectParams)) return { sanitizedParams: {}, forbiddenParametersFound: [] };

    const forbiddenParametersFound = [];
    const sanitizedParams = sanitizeRecursive(
        objectParams,
        isLastParams,
        forbiddenTerms,
        expectedParamsToBeArray,
        forbiddenParametersFound
    );

    return { sanitizedParams, forbiddenParametersFound };
}

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
    if (isLastParams === undefined) {
        throw new TypeError("isLastParams can't be undefined");
    }
    if (forbiddenTerms === undefined) {
        throw new TypeError("forbiddenTerms can't be undefined");
    }
    if (expectedParamsToBeArray === undefined) {
        throw new TypeError("expectedParamsToBeArray can't be undefined");
    }

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
module.exports.parseParamsDeep = parseParamsDeep;
