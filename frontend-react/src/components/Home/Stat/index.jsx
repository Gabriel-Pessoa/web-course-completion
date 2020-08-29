import React from 'react';
import { FaTimes } from 'react-icons/fa'; // default icon, case props.icon == undefined
import './styles.css';

const Stat = (props) => {
    return (
        <div className="stat">
            <div className="stat-icon">
                <i>{props.icon || <FaTimes color="#ff0000"/>}</i>
            </div>
            <div className="stat-info">
                <span className="stat-title">{props.title}</span>
                <span className="stat-value">{props.value}</span>
            </div>
        </div>
    );
}

export default Stat;