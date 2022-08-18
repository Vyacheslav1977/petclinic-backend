class PetsRepository {
  constructor(dao) {
    this.dao = dao
  }

  createTable() {
    const sql = `
    CREATE TABLE IF NOT EXISTS pets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT
    )`
    return this.dao.run(sql)
  }

  create(name) {
    return this.dao.run(
      'INSERT INTO pets (name) VALUES (?)',
      [name]);
  }

  update({id, name}) {
    return this.dao.run(
      `UPDATE pets SET name = ? WHERE id = ?`,
      [name, id]
    );
  }

  delete(id) {
    return this.dao.run(
      `DELETE FROM pets WHERE id = ?`,
      [id]
    );
  }

  getById(id) {
    return this.dao.get(
      `SELECT * FROM pets WHERE id = ?`,
      [id]);
  }

  getAll() {
    return this.dao.all(`SELECT pets.id as id, pets.name as name, clients.id as client, clients.name as cname FROM pets LEFT JOIN clients ON clients.pet = pets.id`);
  }

  search(name) {
    return this.dao.all(`SELECT * FROM pets WHERE name LIKE '%` + name + `%'`); // todo: name надо экранировать (чтобы исключить риск sql-инъекций)
  }

}

module.exports = PetsRepository;


