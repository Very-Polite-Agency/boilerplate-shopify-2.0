const getLocalStorageValueByKey = ( $key ) => {
  return localStorage.getItem( $key );
}

const setLocalStorage = ( $key, $value ) => {
  localStorage.setItem( $key, $value );
}

const setHeaderHeightTotalCSSVariable = () => {
  setCSSVariable( 'theme-header-total-height', getElementHeightByTag('header') + 'px' );
};

const getElementHeightByTag = ( $tag = '' ) => {
  return document.getElementsByTagName( $tag )[0].offsetHeight || 0;
};

const getArrayOfElementsByTag = ( $elements = [ 'body', 'footer', 'header', 'main' ] ) => {
  let filteredElements = $elements.filter( tag => { return document.getElementsByTagName( tag )[0] } ) || [];
  return filteredElements.map( tag => document.getElementsByTagName( tag )[0] ) || [];
};

const addClass = ( $class = '', $elements = [] ) => {
  if ( $class && $elements.length ) {
    for( let i = 0; i < $elements.length; i++ ) {
      if ( $elements[i] ) {
        $elements[i].classList.add( $class );
      }
    }
  }
};

const removeClass = ( $class = '', $elements = [] ) => {
  if ( $class && $elements.length ) {
    for( let i = 0; i < $elements.length; i++ ) {
      if ( $elements[i] ) {
        $elements[i].classList.remove( $class );
      }
    }
  }
};

const toggleClass = ( $class = '', $elements = [] ) => {
  if ( $class && $elements.length ) {
    for( let i = 0; i < $elements.length; i++ ) {
      if ( $elements[i] ) {
        $elements[i].classList.toggle( $class );
      }
    }
  }
};

const setCSSVariable = ( $id = '', $value = '' ) => {
  if ( $id && $value ) {
    document.documentElement.style.setProperty( '--' + $id, $value );
  }
};

export default {
  addClass,
  getLocalStorageValueByKey,
  getElementHeightByTag,
  getArrayOfElementsByTag,
  removeClass,
  setCSSVariable,
  setLocalStorage,
  setHeaderHeightTotalCSSVariable,
  toggleClass
};
