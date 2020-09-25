import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser, toggleMenu } from '../config/actions'
import { useHistory } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';

import axios from 'axios';
import { baseApiUrl, userKey } from '../global'

//Importando Templates
import Header from '../components/template/Header';
import Menu from '../components/template/Menu';
import Content from '../components/template/Content';
import Footer from '../components/template/Footer';
import Loading from '../components/template/Loading';

import './App.css'

const App = () => {
  //variável estado
  const [validatingToken, setValidatingToken] = useState(true);

  let history = useHistory(); // instancia para direcionar usuário para url específica

  // redux
  const isMenuVisible = useSelector(state => state.isMenuVisible); // variável recebe valor do state do redux.
  const user = useSelector(state => state.user); // variável recebe valor do state do redux.
  const dispatch = useDispatch();

  const hideMenu = !isMenuVisible || !user; // Esconde menu quando não estiver vísivel ou quando não tiver usuário.

  // parâmetros de media query
  const xs = useMediaQuery({ maxWidth: 576 });
  const sm = useMediaQuery({ maxWidth: 768 });


  // função que valida o token.
  async function validateToken() {
    setValidatingToken(true);

    const json = localStorage.getItem(userKey); // captura os dados do usuário armazenado no localStorage
    const userData = JSON.parse(json); // converte os dados em json e atribui à variável.
    dispatch(setUser(null));

    // caso usuário não esteja setado
    if (!userData) {
      setValidatingToken(false);
      history.push('/auth');
      return;
    }

    const response = await axios.post(`${baseApiUrl}/validateToken`, userData)

    if (response.data) {
      dispatch(setUser(userData));

      if (xs || sm) {
        dispatch(toggleMenu(false))
      }

    } else {
      localStorage.removeItem(userKey);
      history.push('/auth');
    }

    // uma segurança a mais para evitar erros em tempo de compilação, evitando loop infinito.
    setValidatingToken(false);
  }


  // executa apenas uma vez no momento da montagem do componente
  useEffect(() => {
    validateToken();
  }, []);


  return (

    <div id="app" className={hideMenu ? 'hide-menu' : ''} >
      <Header title="Cod3r - Base de Conhecimento" hideToggle={!user} hideUserDropdown={!user} />

      {user &&
        <Menu />
      }

      {validatingToken
        ? <Loading />
        : <Content />
      }

      <Footer />

    </div>
  );
}

export default App;
