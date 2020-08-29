import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

//Importando Templates
import Header from '../components/template/Header';
import Menu from '../components/template/Menu';
import Content from '../components/template/Content';
import Footer from '../components/template/Footer';

import './App.css'

const App = ({ state }) => {

  const hideToggle = state.stateComponents.hideToggle; // variável recebe valor do state do redux.

  return (
    <BrowserRouter>
      <div id="app" className={hideToggle ? 'hide-menu' : null}>
        <Header />
        <Menu />
        <Content />
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default connect(store => ({ state: store }))(App);
