function toggleMenu(hideToggle) {
    return {
        type: 'TOOGLE_MENU',
        hideToggle
    };
}

function hideDropdown(isVisible) {
    return {
        type: 'HIDE_MENU',
        isVisible
    };
}
module.exports = {toggleMenu, hideDropdown} 