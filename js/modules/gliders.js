import Glide from '@glidejs/glide';

const events = [ 'build.after', 'run.after' ];

const options = ( custom = {} ) => {

  let standard = {
    animationTimingFunc: 'ease-in-out',
    animationDuration: 550,
    autoplay: 0,
    perView: 1,
    type: 'carousel',
    rewind: true,
    throttle: 50,
    gap: 28,
  };

  return { ...standard, ...custom };

};

function init() {

  console.log('Glider initialized');

  ( document.querySelectorAll('.js--glider') || [] ).forEach( element => {

    let gliderID = element.id;
    let glider = new Glide( '#' + gliderID, options() );

    glider.on( events, event => {
      setTimeout( () => {
        console.log(event);
      }, 100 );
    });

    ( document.querySelectorAll('[data-glide-navigation="#' + gliderID + '"].next') || [] ).forEach( button => {
      button.addEventListener('click', function () {
        glider.go('>');
      });
    });

    ( document.querySelectorAll('[data-glide-navigation="#' + gliderID + '"].prev') || [] ).forEach( button => {
      button.addEventListener('click', function () {
        glider.go('<');
      });
    });

    glider.mount();

  });

};

export default {
  init,
  options
};
