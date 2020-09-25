import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../../config/actions';
import { Dropdown } from 'react-bootstrap';
import { FiCpu, FiLogOut } from 'react-icons/fi';
import { Link, useHistory } from 'react-router-dom';
import Gravatar from 'react-gravatar';
import { userKey } from '../../../global';

import './styles.css';

const UserDropdown = (props) => {

    const user = useSelector(state => state.user); // atribuindo usuário atual, recebido do redux

    const dispatch = useDispatch(); // encaminha ação para o redux, que é tratada no arquivo store

    //instanciando da função do router-dom, que servirá para encaminhar para o artigo selecionado na árvore.
    let history = useHistory();


    // função que desloga usuário atual
     function logout(event) {
        event.preventDefault();
        localStorage.removeItem(userKey);
        dispatch(setUser(null));
         history.push('/auth', { from: props.location });
    }


    return (
        <Dropdown className="user-dropdown">
            <Dropdown.Toggle variant="none" id="user-button">
                <span className="d-none d-sm-block">{user.name}</span>
                <div className="user-dropdown-img">
                    <Gravatar email={user.email} alt="user" />
                </div>
            </Dropdown.Toggle>

            <Dropdown.Menu className="user-dropdown-content" >

                {user.admin &&
                    <div className="link-item dropdown-item" role="button">
                        <Link to='/admin'>
                            <FiCpu className="mr-2" />
                            <span>Administração</span>
                        </Link>
                    </div>
                }

                <div className="link-item dropdown-item" role="button">
                    <Link to="/auth" onClick={logout}>
                        <FiLogOut className="mr-2" />
                        <span>Sair</span>
                    </Link>
                </div>

            </Dropdown.Menu>
        </Dropdown>
    );
}

export default UserDropdown;