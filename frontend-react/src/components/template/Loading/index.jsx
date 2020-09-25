import React from 'react';

import loadingGif from '../../../assets/loading.gif';

import './styles.css';

const Loading = () => {
    return (
        <div className="loading">
            <img src={loadingGif} alt="Loading"/>
        </div>
    );
}

export default Loading;