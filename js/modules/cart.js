import Drawers from 'drawers';
import Render from 'render';
import Tools from 'tools';

const config = { debug: true, name: 'cart.js', version: '1.0' };
const elements = {
  cart: document.querySelectorAll('form.js--cart') || []
};
const DRAWER_CART_CLOSE_DELAY = Theme.settings?.cart_drawer_delay_close ?? 3000;

const addToCart = ( id = 0, quantity = 1 ) => {

  if ( id ) {
    fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        items: [{ id, quantity }]
      })
    })
    .then( response => {
      return response.json();
    })
    .then( data => {
      getCart().then( cart => {

        toggleCheckoutButtonUsability( 'enable' );
        Render.cartLineItemsTotal( cart.item_count );
        Render.cartLineItemsToElement( cart.items, elements.cart );
        Render.cartSubtotal( cart.items_subtotal_price );
        Drawers.openDrawerByID( 'shopify-section-drawer-cart', 250 );
        Drawers.closeDrawerByID( 'shopify-section-drawer-cart', DRAWER_CART_CLOSE_DELAY );

      });
    })
    .catch( error => {
      console.log('[ addToCart() ] :: Error', error );
    });
  }

};

const emptyCart = () => {
  fetch('/cart/clear.js', {
    method: 'POST',
  })
  .then(response => {
    return response.json();
  })
  .then((data) => {})
  .catch((error) => {
    console.error('[ emptyCart() ] :: Error', error);
  });
};

const getCart = async () => {
  return await fetch( '/cart.js', { method: 'GET', })
  .then(response => {
    return response.json();
  });
};

const onClickAddProductToCart = () => {
  ( document.querySelectorAll( '.js--add-to-cart-product, .js--add-to-cart-product-card' ) || [] ).forEach( button => {
    button.addEventListener( 'click', event => {

      event.preventDefault();

      let quantity = 1;
      let variantID = 0;

      switch ( button.type ) {
        case 'button': {
          // from PLP button
          variantID = parseInt( button.dataset?.productVariantId || 0 );
          break;
        }
        case 'submit': {
          // from PDP form
          let form = button.closest('form') || false;
          let inputQuantity = form.querySelector("input[name='quantity']");
          let inputOptions = form.querySelectorAll("input[name='id']");
          let inputOptionChecked = Array.from( inputOptions ).find( radio => radio.checked );
          quantity = parseInt( inputQuantity.value || 0 );
          variantID = parseInt( inputOptionChecked.value || 0 );
          break;
        }
      }

      addToCart( variantID, quantity );

    });
  });
};

const onClickRemoveCartLineItem = () => {
  document.addEventListener( 'click', event => {
    if ( event.target.closest( '.js--remove-cart-line-item' ) ) {

      let button = event.target.closest( '.js--remove-cart-line-item' );
      let cart_line_item = button.closest( '.cart-line-item' ) ?? false;
      let cart_line_item_key = cart_line_item.dataset.key || '';

      updateCartLineItemByKey( cart_line_item_key, 0 );

    }
  });
};

const onClickUpdateStepper = () => {
  document.addEventListener( 'click', event => {
    if ( event.target.closest( '.js--stepper-button' ) ) {

      let button = event.target.closest( '.js--stepper-button' );
      let cart_line_item = button.closest( '.cart-line-item') ?? false;
      let cart_line_item_key = cart_line_item ? cart_line_item.dataset?.key || '' : '';
      let stepper = button.closest('.stepper') || false;
      let stepper_input = stepper.querySelector('input[type="number"]') || false;
      let timer = { button: false, delay: 500 };

      console.log( '[ onClickUpdateStepper() ] :: ', button, cart_line_item, cart_line_item_key, stepper );

      if ( button && stepper_input ) {

        let min = parseInt(stepper_input.min);
        let max = parseInt(stepper_input.max);
        let quantity = parseInt(stepper_input.value);

        if ( button.classList.contains('increase') ) {
          quantity = ++quantity;
        } else {
          if ( quantity > min ) {
            quantity = --quantity;
          }
        }

        updateStepperButtonStates( quantity, min, max, stepper );

        if ( cart_line_item ) {
          updateCartLineItemByKey( cart_line_item_key, quantity, stepper );
        } else {
          updateStepperInputQuantity( quantity, stepper );
        }

      }

    }
  });
};

const toggleCheckoutButtonUsability = ( state = 'enable' ) => {
  ( document.querySelectorAll( 'button[name="checkout"]' ) || [] ).forEach( button => {
    switch ( state ) {
      case 'enable': {
        button.disabled = false;
        break;
      }
      case 'disable': {
        button.disabled = true;
        break;
      }
    }
  });
};

const updateCartLineItemByKey = ( key = '', quantity = 0, stepper = false ) => {
  console.log( '[ updateCartLineItemByKey() ] :: Initialized' );
  if ( key ) {
    fetch('/cart/change.js', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: key, quantity: quantity })
    })
    .then( response => {
      return response.json();
    })
    .then( cart => {

      if ( 0 == quantity ) Render.cartLineItemRemoveByKey( key );

      if ( cart.status == 422 ) {
        updateStepperInputQuantity( quantity - 1, stepper );
        Render.cartLineItemErrorMessage( key, cart.message );
      } else {

        if ( cart.item_count > 0 ) {
          toggleCheckoutButtonUsability( 'enable' );
          Render.cartLineItemsLinePrice( key, cart.items );
          Render.cartLineItemsQuantity( key, quantity, cart.items );
          updateStepperInputQuantity( quantity, stepper );
        } else {
          toggleCheckoutButtonUsability( 'disable' );
          Render.cartEmptyMessage();
        }

        Render.cartLineItemsTotal( cart.item_count );
        Render.cartSubtotal( cart.items_subtotal_price );

      }

    })
    .catch( error => {
      console.log('[ updateCartLineItemByKey() ] :: Error', error );
    });
  };
};

const updateStepperInputQuantity = ( quantity = 0, stepper = false ) => {
  if ( stepper.querySelector('input[name="quantity"]') ) {
    stepper.querySelector('input[name="quantity"]').value = quantity;
  }
};

const updateStepperButtonStates = ( quantity = 0, min = 0, max = 99999, stepper = false ) => {
  if ( stepper ) {
    let btnDecrease = stepper.querySelector('.stepper__button.decrease') || false;
    let btnIncrease = stepper.querySelector('.stepper__button.increase') || false;
    if ( quantity == min ) {
      btnDecrease.disabled = true;
      btnIncrease.disabled = false;
    } else if ( quantity > min && quantity < max ) {
      btnDecrease.disabled = false;
      btnIncrease.disabled = false;
    } else {
      btnDecrease.disabled = false;
      btnIncrease.disabled = true;
    }
  }
};

const init = () => {
  if ( config.debug ) console.log(`[ ${config.name} v.${config.version} initialized ]`);

  if ( Theme.cart.items.length ) {
    Render.cartLineItemsToElement( Theme.cart.items, elements.cart );
    toggleCheckoutButtonUsability( 'enable' );
  } else {
    Render.cartEmptyMessage();
    toggleCheckoutButtonUsability( 'disable' );
  }

  Render.cartLineItemsTotal( Theme.cart.item_count );
  Render.cartSubtotal( Theme.cart.items_subtotal_price );

  onClickAddProductToCart();
  onClickRemoveCartLineItem();
  onClickUpdateStepper();

  if ( config.debug ) console.log(`[ ${config.name} v.${config.version} complete ]`);
};

export default { addToCart, emptyCart, getCart, init };
