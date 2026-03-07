const parseParams = require('./src/object-parser');
const parseParamsDeep = require('./src/object-parser').parseParamsDeep;
const { handleForbiddenParam } = require('./src/utils/');
const defaultParameters = require('./src/initial-parameters');

let {
    isLastParams,
    forbiddenTerms,
    expectedParamsToBeArray,
    isToReturn400Response,
    invalidParamMessage,
    deepSearch: deepObjectSearch,
    ignoreBodyParse,
} = defaultParameters;

function hppPrevent({
    takeLastOccurrences,
    blackList,
    whiteList,
    returnBadRequestResponse,
    customInvalidParamMessage,
    canIgnoreBodyParse,
    deepSearch,
} = {}) {
    const config = {
        isLastParamsConfig: takeLastOccurrences ?? isLastParams,
        forbiddenTermsConfig: blackList ?? forbiddenTerms,
        expectedParamsToBeArrayConfig: whiteList ?? expectedParamsToBeArray,
        isToReturn400ResponseConfig:
            returnBadRequestResponse ?? isToReturn400Response,
        invalidParamMessageConfig:
            customInvalidParamMessage ?? invalidParamMessage,
        deepObjectSearchConfig: deepSearch ?? deepObjectSearch,
        ignoreBodyParseConfig: canIgnoreBodyParse ?? ignoreBodyParse,
    };

    return (req, res, next) => {
        const query = req.query ?? {};
        const body = req.body ?? {};

        const queryParams = config.deepObjectSearchConfig ? query : { ...query };
        const bodyParams = config.deepObjectSearchConfig ? body : { ...body };

        delete req.query;
        delete req.body;

        const parseFn = config.deepObjectSearchConfig ? parseParamsDeep : parseParams;
        const queryParamsSanitizeResult = parseFn(
            queryParams,
            config.isLastParamsConfig,
            config.forbiddenTermsConfig,
            config.expectedParamsToBeArrayConfig
        );

        const bodyParamsSanitizeResult = config.ignoreBodyParseConfig
            ? { forbiddenParametersFound: [], sanitizedParams: bodyParams }
            : parseFn(
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
            config.isToReturn400ResponseConfig
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
    isLastParams = defaultParameters.isLastParams;
    forbiddenTerms = defaultParameters.forbiddenTerms;
    expectedParamsToBeArray = defaultParameters.expectedParamsToBeArray;
    isToReturn400Response = defaultParameters.isToReturn400Response;
    invalidParamMessage = defaultParameters.invalidParamMessage;
    deepObjectSearch = defaultParameters.deepSearch;
    ignoreBodyParse = defaultParameters.ignoreBodyParse;
}

function getCurrentConfig() {
    return {
        isLastParams,
        forbiddenTerms,
        expectedParamsToBeArray,
        isToReturn400Response,
        invalidParamMessage,
        deepObjectSearch,
        ignoreBodyParse,
    };
}

/**
 @deprecated Since version 2.0.0
 Now you can apply configuration directly to the middleware. This way:
 app.use(httpPrevent.hppPrevent({
   takeLastOccurrences: true,
   deepSearch: true,
   whiteList: ["friends", "tags"],
 }));
**/
function config({
    takeLastOccurrences,
    blackList,
    whiteList,
    returnBadRequestResponse,
    customInvalidParamMessage,
    canIgnoreBodyParse,
    deepSearch,
}) {
    // Atribuindo os parâmetros recebidos ou mantendo os valores padrões de `defaultParameters`
    isLastParams = takeLastOccurrences ?? defaultParameters.isLastParams;
    forbiddenTerms = blackList ?? defaultParameters.forbiddenTerms;
    expectedParamsToBeArray =
        whiteList ?? defaultParameters.expectedParamsToBeArray;
    isToReturn400Response =
        returnBadRequestResponse ?? defaultParameters.isToReturn400Response;
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
