import Tools from 'tools';

let elements = document.querySelectorAll( '.burger, .push-menu' ) || [];

const toggleMobileMenu = () => {
  ( document.querySelectorAll( '.burger' ) || [] ).forEach( element => {
    element.addEventListener( 'click', () => {
      Tools.toggleClass( 'is-active', elements );
    });
  });
};

const closeMobileMenu = () => {
  ( document.querySelectorAll( 'header, main' ) || [] ).forEach( element => {
    element.addEventListener('click', () => {
      Tools.removeClass( 'is-active', elements );
    });
  });
};

const init = () => {
  toggleMobileMenu();
  closeMobileMenu();
};

export default { init };
