import React from 'react';
import './styles.css';

const PageTitle = (props) => {
    return (
        <div className="page-title">
            <h1><i className="mr-2">{props.icon || null}</i>{props.main}</h1>
            <h2>{props.sub}</h2>
            <hr />
        </div>
    );
}

export default PageTitle;