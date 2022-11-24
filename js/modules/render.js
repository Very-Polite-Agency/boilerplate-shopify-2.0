import anime from 'animejs/lib/anime.es.js';
import Tools from 'tools';
import Templates from 'templates';

const cartTotal = ( cartTotal = 0 ) => {
  ( document.querySelectorAll( '.js--cart-total' ) || [] ).forEach( element => {
    element.innerHTML = cartTotal;
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

export default { cartTotal, cartNotification };
