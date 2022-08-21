const { sendJSON, getDataFromRequest } = require('./api-utils');
const AppDAO = require('./dao');
const dao = new AppDAO('./database.sqlite3');
const ClientsRepository = require('./repository-clients');
const PetsRepository = require('./repository-pets');
const clientsRepository = new ClientsRepository(dao);
const petsRepository = new PetsRepository(dao);
const {Client, Pet} = require('./entities');


async function parsePetsRequest({body, id, res, req}) {

  if (req.method === 'OPTIONS') {
    sendJSON({res, code: 200});
  }
  else if (req.method === 'GET') { // Read
    let pets = (await petsRepository.getAll()).map(i => new Pet(i.id, i.name, i.client === null ? null : new Client(i.client, i.cname)));
    sendJSON({res, code: 200, data: pets.map(c => c.stringify())});
    pets = null;
  }
  else if (req.method === 'POST' && id === 'search') { // сделал через POST, чтобы упростить себе задачу
    let data = await getDataFromRequest(req);
    let rows = (await petsRepository.search(JSON.parse(data).name)).map(i => new Pet(i.id, i.name, i.client === null ? null : new Client(i.client, i.cname)));
    sendJSON({res, code: 200, data: rows.map(r => r.stringify())});
  }
  else if (req.method === 'POST') { // Create
    let data = await getDataFromRequest(req);
    const name = (JSON.parse(data).name).trim();
    if (!name || name.length < 3) {
      sendJSON({res, code: 400, message: 'Длина имени должна быть не меньше 3 букв.'});
      return;
    }
    let row = await petsRepository.create(name);
    const fullRow = await petsRepository.getById(row.id);
    sendJSON({res, code: 200, data: fullRow});
  }
  else if (req.method === 'PUT' && id) { // Update
    let data = await getDataFromRequest(req);
    const name = (JSON.parse(data).name).trim();
    if (!name || name.length < 3) {
      sendJSON({res, code: 400, message: 'Длина имени должна быть не меньше 3 букв.'});
      return;
    }
    const clientId = JSON.parse(data).client;
    const oldClient = await clientsRepository.getIdByPet(id); // текущее значение клиента для этого питомца
    if (oldClient && oldClient.id && (clientId === null || clientId != oldClient.id)) { // если новое значение клиента не совпадает с текущим, то меняем везде на новое
      await clientsRepository.update({id: oldClient.id, name: oldClient.name, pet: null});
    }
    await petsRepository.update({id, ...JSON.parse(data), name});
    if (clientId !== null) {
      const newClient = await clientsRepository.getById(clientId);
      await clientsRepository.update({id: newClient.id, name: newClient.name, pet: id});
    }
    // todo: надо прочитать из БД изменённую строку и вернуть её
    sendJSON({res, code: 200});
  }
  else if (req.method === 'DELETE' && id) {
    await petsRepository.delete(id);
    const oldClient = await clientsRepository.getIdByPet(id); // клиент, у которого был удалённый питомец
    if (oldClient && oldClient.id)
      await clientsRepository.update({id: oldClient.id, name: oldClient.name, pet: null}); // если он был привязан к какому-то клиенту, то обнуляем привязку
    sendJSON({res, code: 200});
  }

}


module.exports = parsePetsRequest;

