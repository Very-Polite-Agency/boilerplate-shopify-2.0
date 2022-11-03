const images = Theme.placeholder.product_images || [];

const renderRandomImage = () => {
  if ( images.length ) {
    ( document.querySelectorAll('.js--product-image-placeholder') || [] ).forEach( el => {
      let randomImageSrc = images[Math.floor(Math.random() * images.length)];
      el.setAttribute('data-src', randomImageSrc );
    });
  }
};

const init = () => {
  renderRandomImage();
};

export default { init };
