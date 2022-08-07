function getParamByOrderChoice(queryParams, param, isToTakeLastParameter) {
  const firsArrayIndex = 0;
  const lastArrayIndex = queryParams[param].length - 1;

  return isToTakeLastParameter
    ? queryParams[param][lastArrayIndex]
    : queryParams[param][firsArrayIndex];
}

function handleForbiddenParam(invalidParamMessage, param, response) {
  const badRequestStatusCode = 400;

  if (invalidParamMessage) {
    return response.status(badRequestStatusCode).send(invalidParamMessage);
  }
  return response
    .status(badRequestStatusCode)
    .send(`Error. Invalid param: ${param}`);
}

module.exports = (request, response, next) => {
  const isLastParams = true;

  const forbbidenTerms = [];

  const expectedParamsToBeArray = [];

  const isToReturn400Reponse = true;

  let invalidParamMessage;

  const queryParams = { ...request.query };

  delete request.query;

  if (!queryParams) {
    return next();
  }

  const sanitizedParams = Object.create(null);

  const params = Object.keys(queryParams);

  let sanitizedParam = "";

  for (const param of params) {
    if (expectedParamsToBeArray.includes(param.trim())) {
      sanitizedParams[param] = queryParams[param];
      continue;
    }

    if (forbbidenTerms.includes(param.trim())) {
      if (isToReturn400Reponse) {
        return handleForbiddenParam(invalidParamMessage, param, response);
      } else {
        continue;
      }
    }

    const isParamArray = queryParams[param].constructor === Array;

    sanitizedParam = isParamArray
      ? getParamByOrderChoice(queryParams, param, isLastParams)
      : queryParams[param];

    sanitizedParams[param] = sanitizedParam;
  }

  request.query = sanitizedParams;

  return next();
};
