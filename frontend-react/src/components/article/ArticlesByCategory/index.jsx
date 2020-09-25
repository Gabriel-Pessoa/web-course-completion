import React, { useState, useEffect } from 'react';

import { baseApiUrl } from '../../../global';
import axios from 'axios';
import { FaFolderOpen } from 'react-icons/fa';

import PageTitle from '../../template/PageTitle';
import ArticleItem from '../ArticleItem';

import './styles.css';


const ArticlesByCategory = (props) => {
    //variáveis estados
    const [category, setCategory] = useState({ id: props.match.params.id });
    const [articles, setArticles] = useState([]);
    const [page, setPage] = useState(1);
    const [loadMore, setLoadMore] = useState(true);


    //Função que realiza chamada à api, carregando a categoria
    async function getCategory(id) {
        const articleId = id || category.id;
        const url = `${baseApiUrl}/categories/${articleId}`;
        await axios(url)
            .then(response => setCategory(response.data));
    }


    //função que realiza a chamada à api carregando os artigos, trazendo a quantidade limitada a paginação.
    async function getArticles(id) {
        const articleId = id || category.id;
        let url = `${baseApiUrl}/categories/${articleId}/articles?page=${page}`;

        // condição para captura caso novo artigo seja setado como argumento, não permitindo alteração no artigo corrente.
        if (id && arguments[0]) {
            url = `${baseApiUrl}/categories/${articleId}/articles?page=${1}`;
            await axios(url)
                .then(response => {
                    setArticles(response.data);

                    setPage(2);

                    setLoadMore(true);
                });

            return; //sai da função, evitando executar linhas de códigos abaixo, que alteram artigo corrente.
        }

        await axios(url)
            .then(response => {
                // concatena a reposta da api com os dados anteriores para acrescentar mais dados e não substituir.
                setArticles(articles.concat(response.data));

                setPage(page + 1); // incrementa a paginação

                // quando não tiver mais dados para carregar trazidos do backend
                if (response.data.length === 0) setLoadMore(false);
            });
    }


    //realiza a chamada apenas uma vez no momento da montagem do componente.
    useEffect(() => {
        getCategory();
        getArticles();
    }, []);


    //cada mudança no param ID, significa carregar novo artigo 
    let id = props.match.params.id;
    useEffect(() => {
        // setCategory({});
        // setArticles([]);
        // setPage(1);
        // setLoadMore(true);

        getCategory(id);
        getArticles(id);
    }, [id]);



    return (
        <div className="articles-by-category">
            <PageTitle icon={<FaFolderOpen />} main={category.name} sub="Categoria" />

            <ul>

                {articles.map(article =>

                    <li key={article.id}>
                        <ArticleItem article={article} />
                    </li>

                )}

            </ul>
            <div className="load-more">

                {loadMore &&
                    <button className="btn btn-lg btn-outline-primary" onClick={() => getArticles(null)}>
                        Carregar Mais Artigos
                    </button>
                }

            </div>
        </div >
    );
}

export default ArticlesByCategory;