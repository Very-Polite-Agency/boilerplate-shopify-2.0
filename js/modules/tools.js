const addClass = ( $class = '', $elements = [] ) => {
  if ( $class && $elements.length ) {
    for( let i = 0; i < $elements.length; i++ ) {
      if ( $elements[i] ) {
        $elements[i].classList.add( $class );
      }
    }
  }
};

const getArrayOfElementsByTag = ( $elements = [ 'body', 'footer', 'header', 'main' ] ) => {
  let filteredElements = $elements.filter( tag => { return document.getElementsByTagName( tag )[0] } ) || [];
  return filteredElements.map( tag => document.getElementsByTagName( tag )[0] ) || [];
};

const getElementHeightByTag = ( $tag = '' ) => {
  return document.getElementsByTagName( $tag )[0].offsetHeight || 0;
};

const getLocalStorageValueByKey = ( $key ) => {
  return localStorage.getItem( $key );
}

const getTimeStamp = () => {
  let d = new Date();
  return d.getTime();
}

const removeClass = ( $class = '', $elements = [] ) => {
  if ( $class && $elements.length ) {
    for( let i = 0; i < $elements.length; i++ ) {
      if ( $elements[i] ) {
        $elements[i].classList.remove( $class );
      }
    }
  }
};

const setCSSVariable = ( $id = '', $value = '' ) => {
  if ( $id && $value ) {
    document.documentElement.style.setProperty( '--' + $id, $value );
  }
};

const setHeaderHeightTotalCSSVariable = () => {
  setCSSVariable('theme-header-height-total', getElementHeightByTag('header') + 'px'  );
};

const setLocalStorage = ( $key, $value ) => {
  localStorage.setItem( $key, $value );
}

const toggleClass = ( $class = '', $elements = [] ) => {
  if ( $class && $elements.length ) {
    for( let i = 0; i < $elements.length; i++ ) {
      if ( $elements[i] ) {
        $elements[i].classList.toggle( $class );
      }
    }
  }
};

export default {
  addClass,
  getArrayOfElementsByTag,
  getElementHeightByTag,
  getLocalStorageValueByKey,
  getTimeStamp,
  removeClass,
  setCSSVariable,
  setHeaderHeightTotalCSSVariable,
  setLocalStorage,
  toggleClass
};
