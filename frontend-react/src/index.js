import React from 'react';
import ReactDOM from 'react-dom';
import App from './main/App';

import { Provider } from 'react-redux'; // Utilizado para repassar informações a todos componentes filhos. Utilizado para manipular os dados, ações do usuário
import store from './config/store'; // Uma loja Redux mantendo o estado do aplicativo.

import { BrowserRouter } from 'react-router-dom'; // Um <Router> que usa a API de histórico do HTML5 para se manter sincronizada com a URL.

import './config/axios'; // interceptador do axios, para redicionar para página home quando token expirar


// Importando o CSS do Bootstrap 
import 'bootstrap/dist/css/bootstrap.min.css';


ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);