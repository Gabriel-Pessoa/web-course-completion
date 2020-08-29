import React from 'react';

import { connect } from 'react-redux';
import { toggleMenu } from '../../../config/actions'; //!!!!!! Atenção:melhorar

import UserDropdown from '../UserDropdown';
import { FiChevronRight, FiChevronDown } from 'react-icons/fi';

import { Link } from 'react-router-dom';

import './styles.css';

const Header = ({ state, dispatch }) => {

    const hideToggle = state.stateComponents.hideToggle; // atribuindo a variável o valor atual recebido do redux
    const title = state.header.title; // valor recebido do redux
    const hideUserDropdown = state.stateComponents.hideUserDropdown;// valor recebido do redux

    // função que esconde e amostra menu
    function handleToggleMenu() {
        dispatch(toggleMenu(hideToggle));
    }

    return (
        <header className="header">
            <i className="toggle" onClick={handleToggleMenu}>
                {hideToggle
                    ? <i><FiChevronRight /></i>
                    : <i><FiChevronDown /></i>
                }
            </i>
            <h1 className="title">
                <Link to="/">{title}</Link>
            </h1>
            {hideUserDropdown
                ? null
                : <UserDropdown />
            }
        </header>
    );
}
// recebe como parâmetro uma função 
export default connect(store => ({ state: store }))(Header);
