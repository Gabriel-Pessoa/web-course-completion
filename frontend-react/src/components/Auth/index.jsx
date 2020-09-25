import React, { useState } from 'react';
import { baseApiUrl, showError, showSuccess, userKey } from '../../global';

import axios from 'axios';
import logo from '../../assets/logo.png';
import { useDispatch } from 'react-redux';
import { setUser } from '../../config/actions'
import { useHistory } from 'react-router-dom';

import './styles.css';



const Auth = () => {
    //variáveis estados
    const [showSignup, setShowSignup] = useState(false);
    const [userForm, setUserForm] = useState({});

    const dispatch = useDispatch(); // dispatch do redux para ser capturado no store

    let history = useHistory(); //instanciando da função do router-dom, que servirá para encaminhar para a url raiz


    //função que envia dados do formulário ao backend em caso de login, recebendo em caso de sucesso, dados para acessar a aplicação.
    async function signin() {
        await axios.post(`${baseApiUrl}/signin`, userForm)
            .then(response => {
                dispatch(setUser(response.data));
                localStorage.setItem(userKey, JSON.stringify(response.data)); // converto json em string
                history.push('/');
            }).catch(() => {
                alert('Email ou Senha inválido!');
            });
    }


    //função que envia dados do formulário ao backend em caso de cadastrar, recebendo em caso de sucesso, dados para acessar a aplicação.
    async function signup() {
        await axios.post(`${baseApiUrl}/signup`, userForm)
            .then(() => {
                showSuccess();
                setUserForm({});
                setShowSignup(false);
            }).catch(showError);
    }


    //função que trata da entrada dos inputs do formulário
    function handleInputChange(event) {
        const { name, value } = event.target;

        setUserForm({ ...userForm, [name]: value });
    }


    // função que trata do clique no link
    function handleLink(event) {
        event.preventDefault();

        setShowSignup(!showSignup);
    }


    //Button com atribuição condicional. Depende do bool(showSignup) para alternar de botão.
    let buttonSigninOrSignup;
    if (showSignup) {
        buttonSigninOrSignup = <button onClick={signup}>Registrar</button>
    } else {
        buttonSigninOrSignup = <button onClick={signin}>Entrar</button>
    }


    return (
        <div className="auth-content">
            <div className="auth-modal">
                <img src={logo} width="200" alt="Logo" />
                <hr />
                <div className="auth-title">

                    {showSignup
                        ? 'Cadastro'
                        : 'Login'
                    }

                </div>

                {showSignup &&
                    <input type="text" id="auth-name" name="name"
                        onChange={handleInputChange} value={userForm.name || ''} placeholder="Nome" />
                }

                <input type="email" id="auth-email" name="email"
                    onChange={handleInputChange} value={userForm.email || ''} placeholder="E-mail" />

                <input type="password" id="auth-password" name="password"
                    onChange={handleInputChange} value={userForm.password || ''} placeholder="Senha" />

                {showSignup &&
                    <input type="password" id="auth-confirmPassword" name="confirmPassword"
                        onChange={handleInputChange} value={userForm.confirmPassword || ''} placeholder="Confirme a Senha" />
                }

                {buttonSigninOrSignup}

                <a href="#auth" onClick={handleLink}>
                    {showSignup
                        ? <span>Já tem cadastro? Acesse o Login!</span>
                        : <span>Não tem cadastro? Registre-se aqui!</span>
                    }
                </a>
            </div>
        </div>
    );
}

export default Auth;