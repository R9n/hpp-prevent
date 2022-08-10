let isLastParams = true

let forbiddenTerms = ['__proto__', 'constructor']

let expectedParamsToBeArray = []

let isToReturn400Reponse = false

let invalidParamMessage

function hasPrototypeTermsInName(queryParams, param) {
    return (
        param.includes('__proto__') ||
        param.includes('constructor') ||
        queryParams[param].includes('__proto__') ||
        queryParams[param].includes('constructor')
    )
}

function getParamByOrderChoice(queryParams, param, isToTakeLastParameter) {
    const firsArrayIndex = 0
    const lastArrayIndex = queryParams[param].length - 1

    return isToTakeLastParameter
        ? queryParams[param][lastArrayIndex]
        : queryParams[param][firsArrayIndex]
}

function handleForbiddenParam(invalidParamMessage, param, response) {
    const badRequestStatusCode = 400

    if (invalidParamMessage) {
        return response.status(badRequestStatusCode).send(invalidParamMessage)
    }
    return response
        .status(badRequestStatusCode)
        .send(`Error. Invalid param: ${param}`)
}

function hppPrevent(request, response, next) {
    const queryParams = { ...request.query }

    delete request.query

    if (!queryParams) {
        return next()
    }

    const sanitizedParams = Object.create(null)

    const params = Object.keys(queryParams)

    let sanitizedParam = ''

    for (const param of params) {
        if (
            hasPrototypeTermsInName(queryParams, param) ||
            forbiddenTerms.includes(param.trim()) ||
            forbiddenTerms.includes(queryParams[param])
        ) {
            if (isToReturn400Reponse) {
                return handleForbiddenParam(
                    invalidParamMessage,
                    param,
                    response
                )
            } else {
                continue
            }
        }

        if (expectedParamsToBeArray.includes(param.trim())) {
            sanitizedParams[param] = queryParams[param]

            continue
        }

        const isParamArray = queryParams[param].constructor === Array

        sanitizedParam = isParamArray
            ? getParamByOrderChoice(queryParams, param, isLastParams)
            : queryParams[param]

        sanitizedParams[param] = sanitizedParam
    }

    request.query = sanitizedParams

    return next()
}

function config({
    takeLastOcurrences,
    blackList,
    whiteList,
    returnBadRequestReponse,
    customInvalidParamMessage,
}) {
    isLastParams = takeLastOcurrences ?? isLastParams
    forbiddenTerms = blackList ?? forbiddenTerms
    expectedParamsToBeArray = whiteList ?? expectedParamsToBeArray
    isToReturn400Reponse = returnBadRequestReponse ?? isToReturn400Reponse
    invalidParamMessage = customInvalidParamMessage ?? invalidParamMessage
}

module.exports = {
    config,
    hppPrevent,
}
