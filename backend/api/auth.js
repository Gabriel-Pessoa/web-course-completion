const { authSecret } = require('../.env'); //importando o env
const jwt = require('jwt-simple'); // gerar o token
const bcrypt = require('bcrypt-nodejs'); // comparar senha encriptada.

module.exports = app => {
    const signin = async (req, res) => {
        // validação para email e senha não setados
        if(!req.body.email || !req.body.password) {
            return res.status(400).send('Informe usuário e senha!');
        }

        const user = await app.db('users')
            .where({ email: req.body.email })
            .first();

        if(!user) return res.status(400).send('Usuário não encontrado!'); // usuário não setado. Significa usuário não foi cadastrado no db.    

        // função que compara senha de entrada do usuário no banco de dados criptografada com hash 
        const isMatch = bcrypt.compareSync(req.body.password, user.password)

        if(!isMatch) return res.status(401).send('Email ou Senha inválido!');

        const dateNow = Math.floor(Date.now() / 1000); // hora atual em milissegundos

        // conteúdo do token
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            admin: user.admin,
            iat: dateNow, //data geração do token
            exp: dateNow + (60 * 60 * 24 * 3) //data expira em 3 dias. Forçar o usuário a fazer login novamente
        }

        res.json({
            ...payload,
            token: jwt.encode(payload, authSecret) // gerado a partir do payload; authoSecret a partir de um segredo para que só o servidor tenha acesso

            // Obs: Qualquer nova requisição precisará ter um header authorization no frontend que será armazenado no localstorage mostrando a credencial
            // todas as vezes para o backend, para ter acesso a determinadas rotas/ arquivos 
        });
    }
    
    
    /* Obs: Se quiser renovar o token sempre o usuário logar, no momento de validar o token, invés de retornar bool, 
        retorna um token novo. O frontend substitui o token antigo pelo novo no localstorage no browser.*/

    
    const validateToken = async (req, res) => {
        const userData = req.body || null;

        try {
            if(userData) {
                const token = jwt.decode(userData.token, authSecret);
                
                if(new Date(token.exp * 1000) > new Date()) { // date em milissegundo da expiração > que a data atual
                    return res.send(true);
                }
            }
        } catch(e) {
            //problema no token ou authSecret
        }

        res.send(false); // significa que token não está válido
    }

    return { signin, validateToken }
}
