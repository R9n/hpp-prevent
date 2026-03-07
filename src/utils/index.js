function handleForbiddenParam(invalidParamMessage, param, response) {
    const badRequestStatusCode = 400;
    const message = invalidParamMessage || 'Error. Invalid param';
    return response.status(badRequestStatusCode).send(message);
}

function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
}

function hasPrototypeTermsInName(parameters, param) {
    const stringParamContent = String(parameters[param]);
    return ['__proto__', 'constructor'].some(
        (term) => param.includes(term) || stringParamContent.includes(term)
    );
}

function getParamByOrderChoice(parameters, param, isToTakeLastParameter) {
    const index = isToTakeLastParameter ? parameters[param].length - 1 : 0;
    return parameters[param][index];
}

function auxDeepSearch(plainObject, paramName, value) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
        Object.entries(value).forEach(([key, val]) => {
            auxDeepSearch(plainObject, key, val);
        });
    } else {
        plainObject[paramName] = value;
    }
}

function plainObject(object) {
    const plain = Object.create(null);
    auxDeepSearch(plain, 'start', object);
    return plain;
}

module.exports = {
    isObjectEmpty,
    handleForbiddenParam,
    hasPrototypeTermsInName,
    getParamByOrderChoice,
    plainObject,
};
