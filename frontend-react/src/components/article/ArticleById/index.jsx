import React, { useState, useEffect } from 'react';

import { baseApiUrl } from '../../../global';
import axios from 'axios';
import PageTitle from '../../template/PageTitle';
import { FaFolderOpen } from 'react-icons/fa';


import './styles.css';



const ArticleById = (props) => {
    const [article, setArticle] = useState({});


    // executa apenas uma vez no momento da montagem do componente
    useEffect(() => {
        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();

        const mounted = () => {
            const id = props.match.params.id;
            const url = `${baseApiUrl}/articles/${id}`;
            axios(url, { cancelToken: source.token })
                .then(response => setArticle(response.data));
        }

        mounted();

        return () => {
            source.cancel();
        };

    }, [props.match.params.id]);


    return (
        <div className="article-by-id">
            <PageTitle icon={<FaFolderOpen />} main={article.name} sub={article.description} />
            <div className="article-content" contentEditable='true' dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
    );
}

export default ArticleById;
