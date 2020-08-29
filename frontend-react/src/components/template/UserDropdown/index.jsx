import React from 'react';

import { connect } from 'react-redux'
import { Dropdown } from 'react-bootstrap'
import { FiCpu, FiLogOut } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Gravatar from 'react-gravatar';
import './styles.css';

const UserDropdown = ({ state }) => {

    const user = state.user; // atribuindo usuário atual

    return (
        <Dropdown className="user-dropdown">
            <Dropdown.Toggle variant="none" id="user-button">
                <span className="d-none d-sm-block">{user.name}</span>
                <div className="user-dropdown-img">
                    <Gravatar email={user.email} alt="user" />
                </div>
            </Dropdown.Toggle>

            <Dropdown.Menu className="user-dropdown-content" >

                <Dropdown.Item className="link-item">
                    <Link to='/admin'>
                        <FiCpu className="mr-2" />
                        <span>Administração</span>
                    </Link>
                </Dropdown.Item>

                <Dropdown.Item className="link-item">
                    <Link to='/signout'>
                        <FiLogOut className="mr-2" />
                        <span>Sair</span>
                    </Link>
                </Dropdown.Item>

            </Dropdown.Menu>
        </Dropdown>
    );
}

export default connect(store => ({ state: store }))(UserDropdown);