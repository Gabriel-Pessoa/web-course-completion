const { db } = require('./.env'); //importando dados para conexão

// configuração db
module.exports = {

  client: 'postgresql',
  connection: db,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }

};
