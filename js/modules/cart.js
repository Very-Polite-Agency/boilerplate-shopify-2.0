import anime from 'animejs/lib/anime.es.js';
import Render from 'render';

const productForm = document.querySelectorAll( 'form[action="/cart/add"]' ) || [];

const getCart = () => {
  fetch( '/cart.js', {
    method: 'GET',
  })
  .then(response => {
    return response.json();
  })
  .then((data) => {
    Render.cartTotal(data.item_count);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
};

const emptyCart = () => {
  fetch('/cart/clear.js', {
    method: 'POST',
  })
  .then(response => {
    return response.json();
  })
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

const addToCart = () => {
  productForm.forEach( form => {
    form.addEventListener('submit', event => {

      event.preventDefault();

      let quantity = form.elements['quantity'].value || false;
      let id = form.elements['id'].value || false;

      if ( quantity && id ) {
        fetch('/cart/add.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            items: [{ id, quantity }]
          })
        })
        .then(response => {
          getCart();
          return response.json();
        })
        .then((data) => {
          Render.cartNotification(data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      }

    });
  });
};

const init = () => {
  // emptyCart();
  addToCart();
  getCart();
};

export default { getCart, init };
