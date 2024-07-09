const db = require('../config/db');

class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
  }

  create(data, callback) {
    const fields = Object.keys(data).join(', ');
    const values = Object.values(data);
    const placeholders = values.map(() => '?').join(', ');

    const query = `INSERT INTO ${this.tableName} (${fields}) VALUES (${placeholders})`;
    db.execute(query, values, callback);
  }

  findById(id, callback) {
    const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    db.execute(query, [id], callback);
  }

  findAll(callback) {
    const query = `SELECT * FROM ${this.tableName}`;
    db.execute(query, [], callback);
  }

  update(id, data, callback) {
    const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = Object.values(data).concat(id);

    const query = `UPDATE ${this.tableName} SET ${fields} WHERE id = ?`;
    db.execute(query, values, callback);
  }

  delete(id, callback) {
    const query = `DELETE FROM ${this.tableName} WHERE id = ?`;
    db.execute(query, [id], callback);
  }
}

module.exports = BaseModel;
