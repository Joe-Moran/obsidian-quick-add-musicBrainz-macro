const searchParams = {
  QUERY: 'query',
  FORMAT: 'fmt'
};

const requestFormats = {
  JSON: 'json'
}

function buildRequestPath(url, queryParams) {
  let finalURL = new URL(url);
  if (queryParams) {
    finalURL.searchParams.append(searchParams.QUERY, buildQueryString(queryParams));
    finalURL.searchParams.append(searchParams.FORMAT, requestFormats.JSON);
  }
  return finalURL;
}

/**
 *
 * @param {object} queryParams
 * @returns {string} The query string for requests to musicbrainz API.
 */
function buildQueryString(queryParams) {
  return Object.entries(queryParams).reduce(
    (previous, [queryParamKey, queryParamValue]) =>
      `${previous} AND ${queryParamKey}:${queryParamValue}`,
    ""
  );
}

export { buildRequestPath, buildQueryString };
