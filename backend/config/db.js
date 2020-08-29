const config = require('../knexfile.js'); // arquivo de configuração db
const knex = require('knex')(config); // importamos o knex passando o arquivo de configuração importado, o resultado foi atribuido a variável knex

//toda vez que o sistema carregar, executará as migrations
// não é uma boa prática, foge um pouco do controle
//knex.migrate.latest([config]); 

module.exports = knex; // exportando a variável knex