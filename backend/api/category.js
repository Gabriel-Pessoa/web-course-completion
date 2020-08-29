//Desafio: Implementar paginação

module.exports = app => {
    //importando funções de validações específicos para esse arquivo
    const { existsOrError, notExistsOrError } = app.api.validation;

    // função para incluir ou alterar nova categoria
    const save = (req, res) => {
        const category = { 
            // pegando dados do body que realmente interessam
            id: req.body.id,
            name: req.body.name,
            parentId: req.body.parentId
        }; // clonando o body da requisição

        if(req.params.id) category.id = req.params.id; // caso req.params.id setado, atribuir a variável category.id, o valor

        // validações
        try{    
            existsOrError(category.name, 'Nome não informado');
        }
        catch(msg) {
            return res.status(400).send(msg);
        }

        // com category.id setado, signifca update     
        if(category.id) {
            app.db('categories')
                .update(category)
                .where({ id: category.id })
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err));
        }
        else { // significa create
            app.db('categories')
                .insert(category)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err));
        }
    }

    // Remove categoria. Existe relação entre artigos e categorias, precisa de uma série de validações para remover. É comum usar a técnica  soft delete
    const remove = async (req, res) => {
        
        try {
            // id tem que está presente.
            // Poderia validar o id como sempre positivo
            existsOrError(req.params.id, 'Código da Categoria não informado.'); 
            
            const subcategory = await app.db('categories')
                .where({ parentId: req.params.id }); //categoria onde o parentId = req.params.id
            notExistsOrError(subcategory, 'Categoria possui subcategorias'); // não pode existir subcategorias

            const articles = await app.db('articles')
                .where({ categoryId: req.params.id }); // tem algum artigo associado a categoria.
            notExistsOrError(articles, 'Categoria possui artigos.'); // se tiver algum artigo associado a categoria, é gerado um erro

            const rowsDeleted = await app.db('categories')
                .where({ id: req.params.id }).del(); // exclui linha que passou por todas as validações.
            existsOrError(rowsDeleted, 'Categoria não foi encontrada'); // caso não deletado nada, lança esse erro

            res.status(204).send(); // envio de resposta sem corpo
        }
        catch(msg) {
            // caso não passe em alguma validação
            res.status(400).send(msg);
        }
    }

    // função que monta o caminho das categorias, subcategorias e artigos
    const withPath = categories => {

        // pegar categoria pai
        const getParent = (categories, parentId) => {
            const parent = categories.filter(parent => parent.id === parentId);  
            return parent.length ? parent[0] : null ;      
        }

        // monta as categorias cancatenando com o path
        const categoriesWithPath = categories.map(category => {
            let path = category.name; //começa sempre pelo name, o primeiro da pilha
            let parent = getParent(categories, category.parentId);//quando o parent for null, para de montar o caminho

            while(parent) {
                path = `${parent.name} > ${path}`;
                parent = getParent(categories, parent.parentId); // para pegar o próximo parente, condição para sair do while
            }

            return { ...category, path }
        })

        // ordenar categorias
        categoriesWithPath.sort((a, b) => {
            if(a.path < b.path) return -1;
            if(a.path > b.path) return 1;
            return 0;
        })

        return categoriesWithPath
    }

    // retorna todas as categorias
    // Desafio implementar o paginação!!!!!!!!!!!
    const get = (req, res) => {
        app.db('categories') // sem necessidade do select *
            .then(categories => res.json(withPath(categories)))
            .catch(err => res.status(500).send(err));
    }

    // retorna categoria por ID
    const getById = (req, res) => {
        app.db('categories')
            .where({ id: req.params.id })
            .first()
            .then(category => res.json(category))
            .catch(err => res.status(500).send(err));
    }
    
    // função que transforma um array de categoria em árvore, baseado no parentId
    const toTree = (categories, tree) => {
        // Se tree não estiver setado, irá filtrar apenas categories que não tem parentId setado.
        // Serve como ponto de partida para categorias que ainda não tem filhos, formando as categorias iniciais. 
        if(!tree) tree = categories.filter(c => !c.parentId);
        // quando começar a filtrar, pegar os nó pai. 
        tree = tree.map(parentNode => {
            const isChild = node => node.parentId == parentNode.id; //Pega quem são os filhos desse nó
            // recursão. Passando como parâmetro de entrada categories, categories filtrando os filhos.
            parentNode.children = toTree(categories, categories.filter(isChild)); // seta parentNode.children

            return parentNode; // já como o children setado
        });
        return tree; // retorna a árvore toda resolvida
    }

    // função que retorna o serviço de resposta à requisição get, devolvendo a árvore formada na função acima
    const getTree = (req, res) => {
        app.db('categories')
            .then(categories => res.json(toTree(withPath(categories))))
            .catch(err => res.status(500).send(err));
    }

    return { save, remove, get, getById, getTree }
}