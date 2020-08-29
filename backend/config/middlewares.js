const bodyParser = require('body-parser');
const cors = require('cors');

// parâmetro é exatamente a instancia do express criada 
module.exports = app => {
    app.use(bodyParser.json()); // middleware que irá interpreta o json que virá na requisição
    app.use(cors()); // cors para controle de requisições
}