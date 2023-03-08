import Announcements from './modules/announcements';
import Cart from './modules/cart';
import Credits from './modules/credits';
import Gliders from './modules/gliders';
import Product from './modules/product';
import Scrolling from './modules/scrolling';

const throttled = {
  resize: false,
  scroll: false
};

Cart.init();
Credits.init();
Announcements.init();
Product.init();
RandomImage.init();
Scrolling.init();

AOS.init({
  offset: 150,                // offset (in px) from the original trigger point
  delay: 0,                   // values from 0 to 3000, with step 50ms
  duration: 500,              // values from 0 to 3000, with step 50ms
  easing: 'ease-in-out',      // default easing for AOS animations
});

window.addEventListener( 'load', function (e) {

  Gliders.init();
  AOS.refresh();

});

window.addEventListener( 'resize', function(e) {

  if ( !throttled.resize ) {
    window.requestAnimationFrame(function() {
      // do throttled stuff on resize...
      throttled.resize = false;
    });
    throttled.resize = true;
  }

});

window.addEventListener( 'scroll', function(e) {

  if ( !throttled.scroll ) {
    window.requestAnimationFrame(function() {
      // do throttled stuff on scroll...
      throttled.scroll = false;
    });
    throttled.scroll = true;
  }

});


