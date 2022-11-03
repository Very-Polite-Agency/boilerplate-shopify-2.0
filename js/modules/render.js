const cartTotal = ( cartTotal = 0 ) => {
  ( document.querySelectorAll( '.js--cart-total' ) || [] ).forEach( element => {
    element.innerHTML = cartTotal;
  });
};

const cartNotification = ( data = {} ) => {
  console.log( 'cartNotification ::', data );
}

export default { cartTotal, cartNotification };
