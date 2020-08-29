import React from 'react';
import { connect } from 'react-redux';
import './styles.css'

const Menu = ({ state }) => {

    const isMenuVisible = state.stateComponents.hideToggle;

    return (
        <>
            {   !isMenuVisible
                    ? <aside className="menu">Menu</aside>
                    : null
            }
        </>
    );
}

export default connect(store => ({ state: store }))(Menu);