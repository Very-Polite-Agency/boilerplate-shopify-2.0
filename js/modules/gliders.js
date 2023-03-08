import Glide from "@glidejs/glide";

const config = { debug: true, name: 'gliders.js', version: '1.0' };
const events = [ "build.after", "run.after" ];
const elements = document.querySelectorAll( '.js--glide' ) || [];
const gliders = {};

const createGliderFromElement = ( element = {} ) => {

  let element_id = element?.id ?? '';
  let animationDuration = parseInt( element.dataset?.glideAnimationDuration ) ?? 450;
  let autoplay = parseInt( element.dataset?.glideAutoplay ) ?? 3500;
  let gap = parseInt( element.dataset?.glideGap ) ?? 36;
  let style = element.dataset?.glideStyle ?? '';
  let options = getOptions();

  switch ( style ) {
    case 'media-grid':
    case 'post':
    case 'work': {
      options = getOptions({
        animationDuration,
        autoplay,
        breakpoints: {
          9999: {
            perView: 3
          },
          768: {
            perView: 2
          }
        },
        gap,
        perView: 2,
      });
      break;
    }
    case 'showcase': {
      options = getOptions({
        animationDuration,
        autoplay,
        gap,
        peek: 0,
      });
      break;
    }
  }

  let glide = new Glide( "#" + element_id, options );

  glide.on( events, event => {

    switch ( style ) {
      case 'showcase': {
        let active = element.querySelector('.glide__slide--active') || false;
        let title = active.dataset.title || '';
        if ( title ) {
          ( document.querySelectorAll('.footer__project-title') || [] ).forEach( footerTitleEl => {
            footerTitleEl.innerHTML = title;
          });
        }
        break;
      }
      default: {
        setTimeout( () => updateGlideTrackHeight( element ), 100 );
        break;
      }
    }

  });

  ( document.querySelectorAll( '[data-glide-navigation="#' + element_id + '"].next, [data-target="#' + element_id + '"].next' ) || [] ).forEach( button => {
    button.addEventListener("click", function () {
      glide.go(">");
    });
  });

  ( document.querySelectorAll( '[data-glide-navigation="#' + element_id + '"].prev, [data-target="#' + element_id + '"].prev' ) || [] ).forEach( button => {
    button.addEventListener("click", function () {
      glide.go("<");
    });
  });

  glide.mount();

  // FIX for when single slide does not fill 100% of glider
  setTimeout( () => { glide.update() }, 250 );

  gliders[element_id] = { element_id, glide };

};

const getOptions = ( custom = {} ) => {

  let standard = {
    animationTimingFunc: "ease-in-out",
    animationDuration: 350,
    autoHeight: true,
    autoplay: 3250,
    dragThreshold: 35,
    hoverpause: false,
    perView: 1,
    swipeThreshold: 35,
    type: "carousel",
    rewind: true,
    throttle: 50,
    gap: 0,
  };

  return { ...standard, ...custom };

};

const updateGlideTrackHeight = ( element = false ) => {
  if ( element ) {
    let active_slide = element.querySelector( '.glide__slide--active' ) || false;
    let glide_track = element.querySelector( '.glide__track' ) || false;
    if ( active_slide && glide_track ) {
      let active_slide_height = active_slide.offsetHeight;
      let glide_track_height = glide_track.offsetHeight;
      if ( glide_track_height != active_slide_height ) glide_track.style.height = active_slide_height + 'px';
      AOS.refresh();
    }
  }
};

const init = () => {
  if ( config.debug ) console.log(`[ ${config.name} v.${config.version} initialized ]`);
    elements.forEach( element => createGliderFromElement( element ) );
  if ( config.debug ) console.log(`[ ${config.name} v.${config.version} complete ]`);
};

export default { gliders, init };
