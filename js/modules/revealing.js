// ES6 module pattern is essentially RMP using a object based, default export.

let privateVar = 'Ben Cherry';
const publicVar = 'Hey there!';

const privateFunction = () => {
  console.log(`Name:${privateVar}`);
};

const setName = ( strName ) => {
  privateVar = strName;
};

const greeting = () => {
  console.log( `Hello ${privateVar}!` );
}

const getName = () => {
  privateFunction();
};

export default {
  setName,
  greeting,
  getName
};
