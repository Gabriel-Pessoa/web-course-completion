import React from 'react';
import ReactDOM from 'react-dom';
import App from './main/App';

import { Provider } from 'react-redux'; // Utilizado para repassar informações a todos componentes filhos. Utilizado para manipular os dados, ações do usuário
import store from './config/store';

// Importando o CSS do Bootstrap 
import 'bootstrap/dist/css/bootstrap.min.css';

//Temporário
require('axios').defaults.headers.common['Authorization'] = 'bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwibmFtZSI6IkdhYnJpZWwgUGVzc29hIiwiZW1haWwiOiJnYWJyaWVsai5iLnBlc3NvYUBnbWFpbC5jb20iLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNTk4NTc5Mzk5LCJleHAiOjE1OTg4Mzg1OTl9.W3SvsU8VvYwMg7m5f9x4RsjBidZRiUq8qovnr84-ao8'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);