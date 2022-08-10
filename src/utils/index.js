function handleForbiddenParam(invalidParamMessage, param, response) {
    const badRequestStatusCode = 400;

    if (invalidParamMessage) {
        return response.status(badRequestStatusCode).send(invalidParamMessage);
    }
    return response
        .status(badRequestStatusCode)
        .send(`Error. Invalid param: ${param}`);
}

function isObjectEmpty(obj) {
    // eslint-disable-next-line no-unreachable-loop
    for (const x in obj) {
        return false;
    }
    return true;
}
function hasPrototypeTermsInName(parameters, param) {
    const stringParamContent = String(parameters[param]);
    return (
        param.includes('__proto__') ||
        param.includes('constructor') ||
        stringParamContent.includes('__proto__') ||
        stringParamContent.includes('constructor')
    );
}

function getParamByOrderChoice(parameters, param, isToTakeLastParameter) {
    const firsArrayIndex = 0;
    const lastArrayIndex = parameters[param].length - 1;

    return isToTakeLastParameter
        ? parameters[param][lastArrayIndex]
        : parameters[param][firsArrayIndex];
}
module.exports = {
    isObjectEmpty,
    handleForbiddenParam,
    hasPrototypeTermsInName,
    getParamByOrderChoice,
};
