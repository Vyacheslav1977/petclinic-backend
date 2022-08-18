const packageJson = require('./package.json');
const http = require("http");
const AppDAO = require('./dao');
const AppAPI = require('./api');
const ClientsRepository = require('./repository-clients');
const PetsRepository = require('./repository-pets');

const dao = new AppDAO('./database.sqlite3');
const clientsRepository = new ClientsRepository(dao);
const petsRepository = new PetsRepository(dao);

clientsRepository.createTable();
petsRepository.createTable();

http.createServer(AppAPI).listen(packageJson.server.port, packageJson.server.host);

