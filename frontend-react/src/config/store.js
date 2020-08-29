/**
 * Área de armazenamento que compartilha estados entre os componentes, sem necessariamente um componente modificar outro. 
 * Quando a store é modificada, o componente que tem a referência é modificado.
 */

import { createStore } from 'redux'; // Criar um estado global

const INITIAL_STATE = {
    header: { title: "Cod3r - Base de Conhecimento" },
    stateComponents: {
        hideToggle: false,
        hideUserDropdown: false
    },
    user: {
        name: 'Usuário Mock',
        email: 'mock@cod3r.com.br'
    }
}

function reducer(state = INITIAL_STATE, action) {

   if (action.type === 'HIDE_MENU') {
       return;
   }

    if (action.type === 'TOOGLE_MENU') {
        return {
            ...state, stateComponents: {
                hideToggle: !action.hideToggle,
                hideUserDropdown: state.stateComponents.hideUserDropdown
            }
        };
    }
    return state;
}

const store = createStore(reducer); // precisa de uma função como parâmetro obrigatório que retorna o estado inicial

export default store;