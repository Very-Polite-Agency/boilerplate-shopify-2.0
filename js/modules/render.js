import anime from 'animejs/lib/anime.es.js';

import Gliders from 'gliders';
import Money from 'money';
import Tools from 'tools';
import Templates from 'templates';

const config = { debug: true, name: 'render.js', version: '1.0' };
const elements = {
  cart: document.querySelectorAll( '.js--cart' ) || [],
  cart_drawer: document.getElementById("drawer-cart__cart-line-items") || false
};

const cartDrawerLineItems = ( line_items = [] ) => {
  if ( elements.cart_drawer && line_items.length ) {
    let template = '';
    for ( let i = 0; i < line_items.length; i++ ) {
      template += Templates.cartLineItem( line_items[i] );
    }
    elements.cart_drawer.innerHTML = template;
  }
};

const cartEmptyMessage = () => {
  elements.cart.forEach( element => {
    element.innerHTML = Templates.cartEmptyMessage();
  });
};

const cartLineItems = ( line_items = [] ) => {
  elements.cart.forEach( element => {
    let template = '';
    for ( let i = 0; i < line_items.length; i++ ) {
      template += Templates.cartLineItem( line_items[i] );
    }
    element.innerHTML = template;
  });
};

const cartSubtotal = ( subtotal = 0 ) => {
  ( document.querySelectorAll( '.js--cart-subtotal' ) || [] ).forEach( element => {
    element.innerHTML = Money.format( subtotal );
  });
};

const cartLineItemsLinePrice = ( key = '', line_items = [] ) => {
  if ( line_items.length ) {
    for ( let i = 0; i < line_items.length; i++ ) {
      if ( key === line_items[i].key ) {
        ( document.querySelectorAll( `[data-key="${key}"] .cart-line-item__price` ) || [] ).forEach( element => {
          element.innerHTML = Money.format( line_items[i].final_line_price );
        });
      }
    }
  }
}

const cartLineItemsQuantity = ( key = '', quantity = 1, line_items = [] ) => {
  if ( line_items.length ) {
    for ( let i = 0; i < line_items.length; i++ ) {
      if ( key === line_items[i].key ) {
        if ( quantity > line_items[i].quantity ) {
          // show message stating no inventory
          ( document.querySelectorAll( `[data-key="${key}"] input[name="quantity"]` ) || [] ).forEach( element => {
            element.value = line_items[i].quantity;
          });
        }
        break;
      }
    }
  }
};

const cartLineItemsTotal = ( line_items_total = 0 ) => {
  ( document.querySelectorAll( '.js--cart-line-items-total' ) || [] ).forEach( element => {
    element.innerHTML = `(${line_items_total})`;
  });
};

const cartNotification = ( data = {} ) => {

  let {
    block_name = 'cart-notification',
    div = document.createElement("div"),
    id = 'not-set',
    image_height = 150,
    featured_image = {},
    final_price: price = 0,
    product_title: title = '',
    variant_title = '',
  } = data.items?.[0];

  div.className = `${block_name}`;
  div.id = `${block_name}--${id}--${Tools.getTimeStamp()}`;
  div.innerHTML = Templates.cartNotification({ block_name, id, image_height, featured_image, price, title, variant_title });
  document.body.appendChild(div);

  anime.timeline({
    targets: div,
    easing: 'easeOutExpo',
    duration: 3200,
  })
  .add({
    translateY: 70,
    opacity: 1
  })
  .add({
    delay: 850,
    duration: 350,
    translateY: -35,
    opacity: 0,
    complete: function(anim) {
      setTimeout(() => {
        div.remove();
      }, 500);
    }
  });

}

const instagramFeed = ( feed = {} ) => {

  let feed_slides = document.querySelector( '#' + feed.id +  ' .glide__slides' ) ?? false;
  let feed_glide = document.getElementById(feed.id) || false;
  if ( feed_glide && feed_slides ) {
    feed_slides.innerHTML = Templates.instagramFeedItems( feed );
    // Gliders.createGliderFromElement( feed_glide );
  }

};

const removeCartLineItem = ( key = '' ) => {
  let element = document.getElementById(`cart-line-item--${key}`) || false;
  if ( element ) element.remove();
}

export default {
  cartDrawerLineItems,
  cartEmptyMessage,
  cartLineItems,
  cartLineItemsLinePrice,
  cartLineItemsQuantity,
  cartLineItemsTotal,
  cartNotification,
  cartSubtotal,
  instagramFeed,
  removeCartLineItem
};
