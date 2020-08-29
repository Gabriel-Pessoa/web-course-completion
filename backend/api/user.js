//Desafio: Implementar paginação

const bcrypt = require('bcrypt-nodejs'); // Pacote para criptografar senha de usuário

module.exports = app => {

    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation // desestruturação do arquivo validation

    const encryptPassword = password => {
        // gera o hash específico para uma senha específica
        const salt = bcrypt.genSaltSync(10);
        // retorna a senha criptografada e seu hash para comparação
        return bcrypt.hashSync(password, salt);
    }

    // função para inserir ou alterar um usuário
    const save = async (req, res) => {
        const user = { ...req.body }; // clonando o body da requisição; bodyParser já efetou o parse na requisição para json.

        //se vinher id na requisição, seta o user.id com o id recebido 
        if (req.params.id) user.id = req.params.id;

        // validações que não permitem usuário comum setar admin = true
        if(!req.originalUrl.startsWith('/users')) user.admin = false; // a url que não começar com /users; admin = false
        if(!req.user || !req.user.admin) user.admin = false; //Usuário não está logado ou req.user.admin false; admin = false

        try {
            //validações
            existsOrError(user.name, 'Nome não informado');
            existsOrError(user.email, 'Email não informado');
            existsOrError(user.password, 'Senha não informada');
            existsOrError(user.confirmPassword, 'Confirmação de Senha inválida');
            equalsOrError(user.password, user.confirmPassword, 'Senhas não conferem');

            // na tabela users onde linha email = user.email, traga o primeiro resultado
            const userFromDB = await app.db('users')
                .where({ email: user.email }).first();

            // validação somente se id não estiver setado. 
            if (!user.id) {
                // se valor existir gera erro, senão passa na validação
                notExistsOrError(userFromDB, 'Usuário já cadastrado');
            }
        }
        catch (msg) { // caso erro
            return res.status(400).send(msg);
        }

        user.password = encryptPassword(user.password);
        delete user.confirmPassword; // Não é guardado o confirmPassword no db 

        // se user.id estiver setado
        if(user.id) {
            app.db('users')
                .update(user)
                .where({ id: user.id })
                .whereNull('deletedAt') // linha nula, significa que usuário não foi excluído virtualmente
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err)); // caso erro
        } 
        else { // caso id não setado
            app.db('users')
            .insert(user)
            .then(_ => res.status(204).send())
            .catch(err => res.status(500).send(err)); // caso erro
        }

    }

    // método retorna todos os usuários
    // Desafio implementar o paginação!!!!!!!!!!!
    const get = (req, res) => {
        app.db('users')
            .select('id', 'name', 'email', 'admin')
            .whereNull('deletedAt') 
            .then(users => res.json(users)) // caso o nome da coluna divergir, aqui será o lugar ideal para usar o map fazendo a transformação.
            .catch(err => res.status(500).send(err)); // caso erro   
    }

    // método retorna usuário por id
    const getById = (req, res) => {
        app.db('users')
            .select('id', 'name', 'email', 'admin')
            .where({ id: req.params.id })
            .whereNull('deletedAt')
            .first()
            .then(user => res.json(user))
            .catch(err => res.status(500).send(err))
    }


    //A estratégia não vai ser chamar o delete, e sim atualizar deletedAt.
    //Uma vez que a coluna está preenchida com alguma data, o usuário foi excluído de forma virtual
    // Não foi excluído do banco, mas no sistema ele irá desaparecer
    const remove = async (req, res) => {
        try {
            // validação que não permite excluir usuário com artigos associados
            const articles = await app.db('articles')
                .where({ userId: req.params.id });
            notExistsOrError(articles, 'Usuário possui artigos associados.'); 

            //Passando na validação acima, faz o update na tabela users, passando a data atual do momento da exclusão
            const rowsUpdated = await app.db('users')
                .update({ deletedAt: new Date() })
                .where({ id: req.params.id });
            existsOrError(rowsUpdated, 'Usuário não foi encontrado.'); //rowsUpdate == 0, gerou um erro no update, provavelmente o id do usuário

            res.status(204).send(); //sucesso nas validações
        } 
        catch(msg) {
            res.status(400).send(msg);
        }
    }



    // retorno todas as funções desse módulo para que fiquem visíveis fora do arquivo
    return { save, get, getById, remove }
}