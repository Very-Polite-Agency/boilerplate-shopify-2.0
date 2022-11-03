import Tools from 'tools';

let throttled = false;

const elements = Tools.getArrayOfElementsByTag();
const scrollClasses = {
  atTop: 'scroll-position--at-top',
  scrolled: 'scroll-position--scrolled',
  scrollingDown: 'scroll-position--scrolling-down',
  scrollingUp: 'scroll-position--scrolling-up'
};
const scrollPosition = {
  current: window.pageYOffset || document.documentElement.scrollTop,
  initial: window.pageYOffset || document.documentElement.scrollTop,
  previous: window.pageYOffset || document.documentElement.scrollTop,
  down: false
};

const setScrollStateClassesByScrollPosition = ( $scrollPos = 0 ) => {

  // assign scroll direction
  scrollPosition.down = ( scrollPosition.current > scrollPosition.previous ) ? true : false;

  // set scrolling action state
  if ( $scrollPos > 15 ) {
    Tools.addClass( scrollClasses.scrolled, elements );
  } else {
    Tools.removeClass( scrollClasses.scrolled, elements );
  }

  // set scroll top position state
  if ( $scrollPos === 0 ) {
    Tools.addClass( scrollClasses.atTop, elements );
  } else {
    Tools.removeClass( scrollClasses.atTop, elements );
  }

  // set scroll direction down state
  if ( scrollPosition.down ) {
    Tools.addClass( scrollClasses.scrollingDown, elements );
    Tools.removeClass( scrollClasses.scrollingUp, elements );
  } else {
    Tools.addClass( scrollClasses.scrollingUp, elements );
    Tools.removeClass( scrollClasses.scrollingDown, elements );
  }

};

const elementIsInView = ( $element = false ) => {

  let viewportHeight = window.innerHeight || document.documentElement.clientHeight;

  if ( $element ) {
    let bounding = $element.getBoundingClientRect();
    console.log( bounding );
  }

  return false;

};

const init = ( $options = false ) => {

  setScrollStateClassesByScrollPosition( scrollPosition.current );
  Tools.setHeaderHeightTotalCSSVariable();

  // ---------------------------------------- On resize
  document.addEventListener( 'scroll', function(e) {

    scrollPosition.previous = scrollPosition.current;
    scrollPosition.current = window.pageYOffset || document.documentElement.scrollTop;

    if ( !throttled ) {
      window.requestAnimationFrame(function() {
        setScrollStateClassesByScrollPosition( scrollPosition.current );
        Tools.setHeaderHeightTotalCSSVariable();
        throttled = false;
      });
      throttled = true;
    }
  });

};

export default { init };
