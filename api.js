const packageJson = require('./package.json');
const apiPrefix = packageJson.apiPrefix;
const { sendError } = require('./api-utils');
const parseClientsRequest = require('./api-clients');
const parsePetsRequest = require('./api-pets');

const trueBody = ['clients', 'pets'];


async function parseRequest({body, id, res, req}) {
  if (body === 'clients') parseClientsRequest({body, id, res, req});
  else if (body === 'pets') parsePetsRequest({body, id, res, req});
  else sendError({res, code: 500, message: 'Ошибка 3. Неверный запрос к API.'});
}


function api(req, res) {
  const url = req.url;
  if (!url.startsWith(apiPrefix))
    return sendError({res, code: 404, message: 'Not found'});
  if (url.replace(/[0-9a-zA-Z\/]/g, '')!=='')
    return sendError({res, code: 500, message: 'Ошибка 1. Неверный запрос к API.'});
  const [body, id] = (url.replace(apiPrefix, '')).split('/');
  if (trueBody.includes(body) && (id === undefined || id === 'search' || id.replace(/\d+/, '') === ''))
    return parseRequest({body, id, req, res});
  else
    sendError({res, code: 500, message: 'Ошибка 2. Неверный запрос к API.'});
}


module.exports = api;

