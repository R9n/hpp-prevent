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

module.exports = { isObjectEmpty, handleForbiddenParam };
