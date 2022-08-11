const {
    hasPrototypeTermsInName,
    isObjectEmpty,
} = require('../src/utils/index');

function parseBody(bodyParams) {
    if (isObjectEmpty(bodyParams)) {
        return { sanitizedParams: {}, forbiddenParametersFound: [] };
    }
    const sanitizedParams = Object.create(null, {});
    const forbiddenParametersFound = [];

    const params = Object.keys(bodyParams);

    for (const param of params) {
        if (hasPrototypeTermsInName(bodyParams, param)) {
            forbiddenParametersFound.push(param);
            continue;
        }

        sanitizedParams[param] = bodyParams[param];
    }
    return { sanitizedParams, forbiddenParametersFound };
}

module.exports = parseBody;
