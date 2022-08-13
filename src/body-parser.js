const assert = require('assert');
const {
    hasPrototypeTermInTopLevelTerms,
    isObjectEmpty,
} = require('../src/utils/index');

/** 
@param bodyParams object with request body , the request.body object
@returns Return  a dto like
{
    sanitizedParams, // body parameters sanitized
    forbiddenParametersFound  // forbidden properties found in body object and removed from teh sanitized parameters
}
**/
function parseBody(bodyParams) {
    assert(bodyParams !== undefined, "bodyParams can't be undefined");

    if (isObjectEmpty(bodyParams)) {
        return { sanitizedParams: {}, forbiddenParametersFound: [] };
    }
    const sanitizedParams = Object.create(null, {});
    const forbiddenParametersFound = [];

    const params = Object.keys(bodyParams);

    for (const param of params) {
        if (hasPrototypeTermInTopLevelTerms(param)) {
            forbiddenParametersFound.push(param);
            continue;
        }

        sanitizedParams[param] = bodyParams[param];
    }
    return { sanitizedParams, forbiddenParametersFound };
}

module.exports = parseBody;
