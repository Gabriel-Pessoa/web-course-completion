import React from 'react';

import { connect } from 'react-redux';
import { useSelector, useDispatch } from 'react-redux';
import { toggleMenu } from '../../../config/actions'; //!!!!!! Atenção:melhorar

import UserDropdown from '../UserDropdown';
import { FiChevronRight, FiChevronDown } from 'react-icons/fi';

import { Link } from 'react-router-dom';

import './styles.css';

const Header = (props) => {

    const hideToggle = props.hideToggle;
    const hideUserDropdown = props.hideUserDropdown;
    
    // redux
    const isMenuVisible = useSelector(state => state.isMenuVisible);
    const dispatch = useDispatch();

    

    // função que esconde e amostra menu
    function handleToggleMenu() {
        // envia undefined
        dispatch(toggleMenu());
    }

    return (
        <header className="header">

            {!hideToggle &&
                <a href="#toggle" className="toggle" onClick={handleToggleMenu}>
                    {isMenuVisible
                        ? <i><FiChevronDown /></i>
                        : <i><FiChevronRight /></i>
                    }
                </a>

            }

            <h1 className="title">
                <Link to="/">{props.title}</Link>
            </h1>

            {!hideUserDropdown &&
                <UserDropdown />
            }

        </header>
    );
}
// recebe como parâmetro uma função 
export default connect(store => ({ state: store.stateComponents }))(Header);
