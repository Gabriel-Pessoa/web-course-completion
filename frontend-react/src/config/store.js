/**
 * Área de armazenamento que compartilha estados entre os componentes, sem necessariamente um componente modificar outro. 
 * Quando a store é modificada, o componente que tem a referência é modificado.
 */

import { createStore } from 'redux'; // Criar um estado global
import axios from 'axios';


const INITIAL_STATE = {
    isMenuVisible: false,
    user: null
};

function reducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'TOOGLE_MENU':

            // condição que captura quando usuário não está setado
            if (!state.user) {
                state.isMenuVisible = false;
                return state;
            }

            if (action.isVisible === undefined) {
                state.isMenuVisible = !state.isMenuVisible;

            } else {
                state.isMenuVisible = action.isVisible;
            }

            return state;

        case 'SET_USER':

            state.user = action.user

            if (action.user) {
                axios.defaults.headers.common['Authorization'] = `bearer ${action.user.token}`;
                state.isMenuVisible = true;

            } else {
                delete axios.defaults.headers.common['Authorization'];
                state.isMenuVisible = false;
            }
            
            return state;

        default:
            return state;
    }
}

const store = createStore(reducer); // precisa de uma função como parâmetro obrigatório que retorna o estado inicial

export default store;