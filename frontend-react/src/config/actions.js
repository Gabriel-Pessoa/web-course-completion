function toggleMenu(isVisible) {
    return {
        type: 'TOOGLE_MENU',
        isVisible
    };
}

function setUser(user) {
    return {
        type: 'SET_USER',
        user
    };
}
module.exports = {toggleMenu, setUser} 