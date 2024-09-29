const parseParams = require('./src/object-parser');
const { handleForbiddenParam, plainObject } = require('./src/utils/');
const defaultParameters = require('./src/initial-parameters');

let {
    isLastParams,
    forbiddenTerms,
    expectedParamsToBeArray,
    isToReturn400Reponse,
    invalidParamMessage,
    deepSearch: deepObjectSearch,
    ignoreBodyParse,
} = defaultParameters;

function hppPrevent({
    takeLastOcurrences,
    blackList,
    whiteList,
    returnBadRequestReponse,
    customInvalidParamMessage,
    canIgnoreBodyParse,
    deepSearch,
} = {}) {
    const config = {
        isLastParamsConfig: takeLastOcurrences ?? isLastParams,
        forbiddenTermsConfig: blackList ?? forbiddenTerms,
        expectedParamsToBeArrayConfig: whiteList ?? expectedParamsToBeArray,
        isToReturn400ReponseConfig:
            returnBadRequestReponse ?? isToReturn400Reponse,
        invalidParamMessageConfig:
            customInvalidParamMessage ?? invalidParamMessage,
        deepObjectSearchConfig: canIgnoreBodyParse ?? deepObjectSearch,
        ignoreBodyParseConfig: deepSearch ?? ignoreBodyParse,
    };

    return (req, res, next) => {
        const { query, body } = req;

        const queryParams = config.deepObjectSearchConfig
            ? plainObject(query)
            : { ...query };
        const bodyParams = config.deepObjectSearchConfig
            ? plainObject(body)
            : { ...body };

        delete req.query;
        delete req.body;

        const queryParamsSanitizeResult = parseParams(
            queryParams,
            config.isLastParamsConfig,
            config.forbiddenTermsConfig,
            config.expectedParamsToBeArrayConfig
        );

        const bodyParamsSanitizeResult = config.ignoreBodyParseConfig
            ? { forbiddenParametersFound: [], sanitizedParams: bodyParams }
            : parseParams(
                  bodyParams,
                  config.isLastParamsConfig,
                  config.forbiddenTermsConfig,
                  config.expectedParamsToBeArrayConfig
              );

        const forbiddenParametersFound = [
            ...bodyParamsSanitizeResult.forbiddenParametersFound,
            ...queryParamsSanitizeResult.forbiddenParametersFound,
        ];

        if (
            forbiddenParametersFound.length &&
            config.isToReturn400ReponseConfig
        ) {
            req.query = {};
            req.body = {};
            return handleForbiddenParam(
                config.invalidParamMessageConfig,
                forbiddenParametersFound,
                res
            );
        }

        req.query = queryParamsSanitizeResult.sanitizedParams;
        req.body = bodyParamsSanitizeResult.sanitizedParams;

        return next();
    };
}

function resetConfig() {
    ({
        isLastParams,
        forbiddenTerms,
        expectedParamsToBeArray,
        isToReturn400Reponse,
        invalidParamMessage,
        deepObjectSearch,
        ignoreBodyParse,
    } = defaultParameters);
}

function getCurrentConfig() {
    return {
        isLastParams,
        forbiddenTerms,
        expectedParamsToBeArray,
        isToReturn400Reponse,
        invalidParamMessage,
        deepObjectSearch,
        ignoreBodyParse,
    };
}

/**
 @deprecated Since version 2.0.0
 Now you can apply configuration directly to the middleware. This way:
 app.use(httpPrevent.hppPrevent({
   takeLastOcurrences: true,
   deepSearch: true,
   whiteList: ["friends", "tags"],
 }));
**/
function config({
    takeLastOcurrences,
    blackList,
    whiteList,
    returnBadRequestReponse,
    customInvalidParamMessage,
    canIgnoreBodyParse,
    deepSearch,
}) {
    // Atribuindo os parâmetros recebidos ou mantendo os valores padrões de `defaultParameters`
    isLastParams = takeLastOcurrences ?? defaultParameters.isLastParams;
    forbiddenTerms = blackList ?? defaultParameters.forbiddenTerms;
    expectedParamsToBeArray =
        whiteList ?? defaultParameters.expectedParamsToBeArray;
    isToReturn400Reponse =
        returnBadRequestReponse ?? defaultParameters.isToReturn400Reponse;
    invalidParamMessage =
        customInvalidParamMessage ?? defaultParameters.invalidParamMessage;
    deepObjectSearch = deepSearch ?? defaultParameters.deepSearch;
    ignoreBodyParse = canIgnoreBodyParse ?? defaultParameters.ignoreBodyParse;
}
module.exports = {
    config,
    hppPrevent,
    parseRequestQuery: parseParams,
    resetConfig,
    getCurrentConfig,
    parseParams,
};
