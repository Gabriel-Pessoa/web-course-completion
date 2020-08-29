const app = require('express')(); // resultado do import foi atribuido a variável app
const consign = require('consign');
const db = require('./config/db');
const mongoose = require('mongoose');
require('./config/mongodb'); // Carregando arquivo mongo

app.db = db; // adicionando a variável db(knex) ao objeto app, sendo acessível aos arquivos injetados do consign
app.mongoose = mongoose; // adicionando a variável mongoose) ao objeto app, sendo acessível aos arquivos injetados do consign

// o método then do consign é a porta de entrada para carregar os arquivos, injetando o parâmetro passando para o método into
consign()
    .include('./config/passport.js')
    .then('./config/middlewares.js')
    .then('./api/validation.js')
    .then('./api') //leia todos os arquivos da pasta
    .then('./schedule') // carrega todos os arquivos na pasta
    .then('./config/routes.js')
    .into(app); // injetar nas dependecias carregadas como parâmetro o app criado aqui e passa para os middleware dos diretórios acima


const port = 3001;
app.listen(port, () => {
    console.log(`Aplication running port: http://localhost:${port}`);
});

