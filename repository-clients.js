class ClientsRepository {
  constructor(dao) {
    this.dao = dao
  }

  createTable() {
    const sql = `
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      pet INTEGER
    )`
    return this.dao.run(sql)
  }

  create(name) {
    return this.dao.run(
      'INSERT INTO clients (name) VALUES (?)',
      [name]);
  }

  update({ id, name, pet }) {
    return this.dao.run(
      `UPDATE clients SET name = ?, pet = ? WHERE id = ?`,
      [name, pet, id]
    );
  }

  delete(id) {
    return this.dao.run(
      `DELETE FROM clients WHERE id = ?`,
      [id]
    );
  }

  getById(id) {
    return this.dao.get(
      `SELECT * FROM clients WHERE id = ?`,
      [id]);
  }

  getAll() {
    return this.dao.all(`
      SELECT clients.id as id, clients.name as name, pets.id as pet, pets.name as pname
      FROM clients
      LEFT JOIN pets ON clients.pet = pets.id
    `);
  }

  search(name) {
    return this.dao.all(`
      SELECT clients.id as id, clients.name as name, pets.id as pet, pets.name as pname
      FROM (SELECT * FROM clients WHERE clients.name LIKE '%` + name + `%') as clients
      LEFT JOIN pets ON clients.pet = pets.id
    `); // todo: name надо экранировать (чтобы исключить риск sql-инъекций)
  }

  getIdByPet(petId) {
    return this.dao.get(
      `SELECT * FROM clients WHERE pet = ?`,
      [petId]);
  }
  
}

module.exports = ClientsRepository;

