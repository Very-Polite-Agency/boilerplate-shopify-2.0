const config = { debug: false, name: 'gliders.js', version: '1.0' };
const elements = document.querySelectorAll( '.js--glide' ) || [];
const events = [ "build.after", "run.after" ];
const gliders = {};

const createGliderFromElement = ( element = {} ) => {

  let element_id = element?.id ?? '';
  let animationDuration = parseInt( element.dataset?.glideAnimationDuration ) ?? 450;
  let autoplay = parseInt( element.dataset?.glideAutoplay ) ?? 3500;
  let gap = parseInt( element.dataset?.glideGap ) ?? 36;
  let style = element.dataset?.glideStyle ?? '';
  let options = getOptions({ animationDuration, autoplay, gap });

  switch ( style ) {
    case 'awards': {
      options = getOptions({
        animationDuration,
        autoplay,
        breakpoints: {
          991: {
            peek: { before: 0, after: 150 },
            perView: 2
          },
          767: {
            peek: { before: 0, after: 150 },
            perView: 1
          },
          575: {
            peek: { before: 0, after: 75 },
            perView: 1
          }
        },
        gap,
      });
      break;
    }
    case 'product-carousel': {
       options = getOptions({
        animationDuration,
        autoplay,
        breakpoints: {
          9999: {
            peek: { before: 0, after: 160 },
            perView: 5
          },
          1799: {
            peek: { before: 0, after: 160 },
            perView: 4
          },
          1399: {
            peek: { before: 0, after: 160 },
            perView: 3
          },
          1199: {
            peek: { before: 0, after: 160 },
            perView: 3
          },
          991: {
            peek: { before: 0, after: 160 },
            perView: 2
          },
          767: {
            peek: { before: 0, after: 160 },
            perView: 1
          },
          575: {
            peek: { before: 0, after: 80 },
            perView: 1
          }
        },
        gap,
        hoverpause: true,
      });
      break;
    }
  }

  if ( element_id ) {

    let glide = new Glide( `#${element_id}`, options );

    glide.on( events, event => {

      switch ( style ) {
        default: {
          setTimeout( () => updateGlideTrackHeight( element ), 100 );
          break;
        }
      }

    });

    ( document.querySelectorAll( `[data-glide-navigation="#${element_id}"].next, [data-target="#${element_id}"].next`  ) || [] ).forEach( button => {
      button.addEventListener("click", function () {
        glide.go(">");
      });
    });

    ( document.querySelectorAll( `[data-glide-navigation="#${element_id}"].prev, [data-target="#${element_id}"].prev` ) || [] ).forEach( button => {
      button.addEventListener("click", function () {
        glide.go("<");
      });
    });

    glide.mount();

    // FIX for when single slide does not fill 100% of glider
    setTimeout( () => { glide.update() }, 300 );

    gliders[element_id] = { element_id, glide };

  }

};

const getOptions = ( custom = {} ) => {

  let standard = {
    animationTimingFunc: "ease-in-out",
    animationDuration: 350,
    autoHeight: true,
    autoplay: 5000,
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

export default {
  createGliderFromElement,
  getOptions,
  gliders,
  init
};
