import React from 'react';
import { Link } from 'react-router-dom';
import imageDefault from '../../../assets/article.png';

import './styles.css';

const ArticleItem = (props) => {
    return (
        <div className="article-item">
            <Link to={`/articles/${props.article.id}`}>
                <div className="article-item-image d-none d-sm-block">

                    {props.article.imageUrl
                        ? <img src={props.article.imageUrl} height="150" width="150" alt="Article" />
                        : <img src={imageDefault} height="150" width="150" alt="Article" />
                    }
                    
                </div>
                <div className="article-item-info">
                    <h2>{props.article.name}</h2>
                    <p>{props.article.description}</p>
                    <span className="article-item-author">
                        <strong>Autor: </strong>{props.article.author}
                    </span>
                </div>
            </Link>
        </div>
    );
}

export default ArticleItem;