const { uri } = require('../.env'); // importando uri do arquivo .env
const mongoose = require('mongoose'); // cria esquema no mongo. Tipo de dados, validação, consulta.

//conexão com o mongo
mongoose.connect(uri, { useNewUrlParser: true }) // parâmetros de configuração
    .catch(e => {
        const msg = 'ERRO!!! Não foi possível conectar com o MongoDB.';

        // criando mensagem no terminal com caracteres especiais
        console.log('\x1b[41m%s\x1b[37m', msg, '\x1b[0m')
    });
