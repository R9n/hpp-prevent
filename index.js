function getParamByOrderChoice(queryParams, param, isToTakeLastParameter) {
  const firsArrayIndex = 0;
  const lastArrayIndex = queryParams[param].length - 1;

  return isToTakeLastParameter
    ? queryParams[param][lastArrayIndex]
    : queryParams[param][firsArrayIndex];
}

module.exports = (request, response, next) => {
  const isLastParams = true;

  const forbbidenTerms = ["select"];

  const allowedTerms = ["id"];


  const isToReturn400Reponse = true;

  const invalidParamMessage = '';


  const queryParams = { ...request.query };

  delete request.query;

  if (!queryParams) {
    return next();
  }

  const sanitizedParams = Object.create(null);

  const params = Object.keys(queryParams);

  let sanitizedParam = "";

  for (const param of params) {
    if (allowedTerms.length && allowedTerms.includes(param.trim())) {
      continue;
    }

    if (forbbidenTerms.length && forbbidenTerms.includes(param.trim())) {
      checar resposta
    }

    const isParamArray = typeof queryParams[param] === "object";

    sanitizedParam = isParamArray
      ? getParamByOrderChoice(queryParams, param, isLastParams)
      : queryParams[param];

    sanitizedParams[param] = sanitizedParam;
  }

  request.query = sanitizedParams;

  return next();
};
