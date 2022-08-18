const delayMs = 0; // значение задержки (в мс), чтобы увеличить отклик сервера (для тестирования)


function sendError({res, code = 404, message}) {
  sendJSON({res, code, message});
}


function sendJSON({res, code, message, data, actions}) {
  const body = JSON.stringify({message, data, actions});

  setTimeout(() => {

    res.statusCode = code;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET, PUT, DELETE');
    res.setHeader('Access-Control-Max-Age', '2592000');
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Length', Buffer.byteLength(body));
    res.end(body);

  }, delayMs);

}


async function getDataFromRequest(req) {
  return new Promise(function(resolve, reject) {
    try {
      let data = '';
      req.on('data', chunk => data += chunk);
      req.on('end', async () => resolve(data));
    }
    catch (e) {
      reject(e);
    }
  });
}


module.exports = {
  sendError,
  sendJSON,
  getDataFromRequest
};

