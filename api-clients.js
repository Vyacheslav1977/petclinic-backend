const { sendJSON, getDataFromRequest } = require('./api-utils');
const AppDAO = require('./dao');
const dao = new AppDAO('./database.sqlite3');
const ClientsRepository = require('./repository-clients');
const clientsRepository = new ClientsRepository(dao);
const {Client, Pet} = require('./entities');


async function parseClientsRequest({body, id, res, req}) {

  if (req.method === 'OPTIONS') {
    sendJSON({res, code: 200});
  }
  else if (req.method === 'GET') { // Read
    let clients = (await clientsRepository.getAll()).map(i => new Client(i.id, i.name, i.pet === null ? null : new Pet(i.pet, i.pname)));
    const data = clients.map(c => c.stringify());
    sendJSON({res, code: 200, data});
    clients = null;
  }
  else if (req.method === 'POST' && id === 'search') { // сделал через POST, чтобы упростить себе задачу
    let data = await getDataFromRequest(req);
    let rows = (await clientsRepository.search(JSON.parse(data).name)).map(i => new Client(i.id, i.name, i.pet === null ? null : new Pet(i.pet, i.pname)));
    sendJSON({res, code: 200, data: rows.map(r => r.stringify())});
  }
  else if (req.method === 'POST') { // Create
    let data = await getDataFromRequest(req);
    const name = (JSON.parse(data).name).trim();
    if (!name || name.length < 3) {
      sendJSON({res, code: 400, message: 'Длина имени должна быть не меньше 3 букв.'});
      return;
    }
    let row = await clientsRepository.create(name);
    const fullRow = await clientsRepository.getById(row.id);
    sendJSON({res, code: 200, data: fullRow});
  }
  else if (req.method === 'PUT' && id) { // Update
    let data = await getDataFromRequest(req);
    const name = (JSON.parse(data).name).trim();
    if (!name || name.length < 3) {
      sendJSON({res, code: 400, message: 'Длина имени должна быть не меньше 3 букв.'});
      return;
    }
    const petId = JSON.parse(data).pet;
    if (petId) {
      const oldClient = await clientsRepository.getIdByPet(petId); // текущее значение клиента для питомца
      if (oldClient && oldClient.id && (id != oldClient.id)) { // обнуляем значение питомца у старого клиента
        await clientsRepository.update({id: oldClient.id, name: oldClient.name, pet: null});
      }
    }
    await clientsRepository.update({id, ...JSON.parse(data), name});
    // todo: надо прочитать из БД изменённую строку и вернуть её
    sendJSON({res, code: 200});
  }
  else if (req.method === 'DELETE' && id) {
    await clientsRepository.delete(id);
    sendJSON({res, code: 200});
  }

}


module.exports = parseClientsRequest;

