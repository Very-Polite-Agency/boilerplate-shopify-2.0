import Tools from 'tools';

const config = { debug: true, name: 'drawers.js', version: '1.0' };
const elements = document.querySelectorAll( 'body, footer, header, main' ) || [];
const drawers = [];

const openDrawerByID = ( id = '', delay = 0 ) => {
  setTimeout(() => {
    Tools.addClass( `${id}--active`, elements );
  }, delay);
};

const closeDrawerByID = ( id = '', delay = 0 ) => {
  setTimeout(() => {
    Tools.removeClass( `${id}--active`, elements );
  }, delay);
}

const onClickOpenCartDrawer = () => {
  ( document.querySelectorAll( '.js--open-drawer' ) || [] ).forEach( button => {
    let drawerID = button.dataset.drawerId || '';
    button.addEventListener( 'click', event => {
      openDrawerByID( drawerID );
      drawers.push( drawerID );
    });
  });
};

const onClickCloseCartDrawer = () => {
  document.body.addEventListener( 'click', event => {
    let drawer = event.target.closest( '.drawer' ) ? true : false;
    let buttonDrawerOpen = event.target.closest( '.js--open-drawer' ) ? true : false;
    let buttonDrawerClose = event.target.closest( '.js--close-drawer' ) ?  true : false;
    if ( ( !drawer && !buttonDrawerOpen ) || buttonDrawerClose ) {
      for (let i = 0; i < drawers.length; i++) {
        closeDrawerByID( drawers[i] );
      }
      drawers.length = 0;
    }
  });
};

const init = () => {
  if ( config.debug ) console.log(`[ ${config.name} v.${config.version} initialized ]`);
  onClickOpenCartDrawer();
  onClickCloseCartDrawer();
  if ( config.debug ) console.log(`[ ${config.name} v.${config.version} complete ]`);
}

export default { closeDrawerByID, init, openDrawerByID };
