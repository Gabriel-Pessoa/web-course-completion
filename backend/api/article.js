const queries = require('./queries'); // importe do arquivo queries

module.exports = app => {
    // importando validações que serão usadas nesse arquivo
    const { existsOrError } = app.api.validation; 

    const save = (req, res) => {
        const article = { ...req.body }; //clonando body da requisição

        // se req.params.id estiver setado. Seta o objeto article.id com o id recebido no req.params.id
        if(req.params.id) article.id = req.params.id;

        try{
            existsOrError(article.name, 'Nome não informado');
            existsOrError(article.description, 'Descrição não informada');
            existsOrError(article.categoryId, 'Categoria não informada');
            existsOrError(article.userId, 'Autor não informado');
            existsOrError(article.content,'Conteúdo não informado');
        } 
        catch(msg) {
            res.status(400).send(msg); // Erro lado cliente, não informou uns dos campos
        }
        
        //com article.id setado significa update
        if(article.id) {
            app.db('articles')
                .update(article)
                .where({ id: article.id }) // filtro por id 
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err));
        } 
        else { //significa insert
            app.db('articles')
                .insert(article)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err));
        }
    }

    // função para remover o article
    const remove = async (req, res) => {
        try {
            //Como artigo não tem relacação com ninguém, fica mais simples excluí-lo
            const rowsDeleted = await app.db('articles')
                .where({ id: req.params.id }).del();

            // caso erro usuário
            try {
                existsOrError(rowsDeleted, 'Artigo não foi encontrado.'); 
            // Dica: poderia criar uma validação para somente o autor do artigo poder excluir    
            }
            catch(msg) {
                return res.status(400).send(msg); // caso erro do usuário
            }    

            res.status(204).send(); // ocorreu tudo certo
        }
        catch(msg) {
            res.status(500).send(msg); // caso erro no servidor
        }
    }

    const limit = 3; //limite de arquivo por página

    //função que retorna dados para paginação no frontend
    const get = async (req, res) => {
        const page = req.query.page || 1;
        
        const result = await app.db('articles').count('id').first(); // consulta no db a quantidade de artigos
        const count = parseInt(result.count); // converte o resultado em int

        app.db('articles')
            .select('id', 'name', 'description')
            .limit(limit).offset(page * limit - limit)
            .then(articles => res.json({ data: articles, count, limit }))
            .catch(err => res.status(500).send(err));
    }

    //função que retorna conteúdo do artigo por Id
    const getById = (req, res) => {
        app.db('articles')
            .where({ id: req.params.id })
            .first()
            .then(article => {
                article.content = article.content.toString(); //parse binário para String
                return res.json(article);
            })
            .catch(err => res.status(500).send(err));
    }

    // função que captura os artigos por ID
    const getByCategory = async (req, res) => {
        const categoryId = req.params.id; //Id da categoria para pegar todos os artigos da categoria e filhos

        const page = req.query.page || 1; // recebe o page por requisição através do query, ou, assume valor padrão.
        
        const categories = await app.db.raw(queries.categoryWithChildren, categoryId) // retorna um objeto

        // retorna um array com todos os ids dentro do objeto categories.rows
        const ids = categories.rows.map(c => c.id);   

        //consulta que vai obter os artigos
        app.db({ a: 'articles', u: 'users' })//apelidos para as tabelas
            .select('a.id', 'a.name', 'a.description', 'a.imageUrl', { author: 'u.name' })
            .limit(limit).offset(page * limit - limit)
            .whereRaw('?? = ??', ['u.id', 'a.userId']) //Na seleção de duas tabelas é necessário igualar. O u.id e user.Id, tem que ser exatamento o autor do artigo
            .whereIn('categoryId', ids) //consulta todas as categoryId dentro do ids
            .orderBy('a.id', 'desc')
            .then(articles => res.json(articles)) //resposta da consulta
            .catch(err => res.status(500).send(err)); // caso erro na consulta
        }

    return { save, remove, get, getById, getByCategory }
}