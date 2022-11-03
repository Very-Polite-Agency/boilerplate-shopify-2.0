// Exporting multiple named functions without 'default' prefix. When importing, must import as object {}

// import isEmpty from 'lodash/isEmpty';

function foo() {
  console.log('foo');
}

function bar() {
  console.log('bar');
}

function croft() {
  console.log( 'croft', isEmpty() );
}

function brenden( option = '' ) {
  if ( option ) console.log( option );
}

function init( optional = '' ) {
  foo();
  bar();
  croft();
  if ( optional ) console.log( optional );
}

export {
  foo,
  bar,
  croft,
  init,
  brenden
}
