//////////////////////////////////////////////////////////
////  Forms
//////////////////////////////////////////////////////////

const Forms = (() => {

  let debug = false;
  let info = { name : 'Forms', version : '2.2.3' };

  let tools = new Tools();
  let maxMB = 25.0;
  let formFiles = [];
  let messages = {
    error: {
      429: "Too many attempts to recover password. Please try again later.",
    },
    success: {
      password_recover: "We've sent you an email with a link to update your password.",
      register_account: "Thanks for registering! You will be redirected shortly."
    },
  };

  //////////////////////////////////////////////////////////
  ////  On Focus
  //////////////////////////////////////////////////////////

  const onFormFocus = () => {

    ( document.querySelectorAll('form') || [] ).forEach( form => {

      form.addEventListener('focusin', (e) => {
        if ( e.target.closest('.form__field') ) {
          e.target.closest('.form__field').classList.add("in-focus");
        }
      });

      form.addEventListener('focusout', (e) => {
        if ( e.target.closest('.form__field') && !e.target.value ) {
          e.target.closest('.form__field').classList.remove("in-focus");
        }
      });

    });

  };

  //////////////////////////////////////////////////////////
  ////  Check if Field is Valid
  //////////////////////////////////////////////////////////

  const isFieldValid = ( $field = false ) => {

    console.log( 'isFieldValid() start' );

    let value = '';
    let isValid = false;
    let name = $field.name || 'no-name';
    let type = $field.type || 'no-type';
    let nodeName = $field.nodeName || 'no-node-name';

    switch ( nodeName ) {
      case 'INPUT':
        switch ( type ) {

          case 'checkbox':
            isValid = $field.checked;
            break;

          case 'email':
            if ( validator.isEmail( $field.value.trim() ) ) {
              isValid = true;
            }
            break;

          case 'file':
            break;

          case 'radio':
            break;

          case 'tel':
            if ( validator.isMobilePhone( $field.value.trim() ) ) {
              isValid = true;
            }
            break;

          case 'password':
          case 'text':
            if ( ! validator.isEmpty( $field.value.trim() ) ) {
              isValid = true;
            }
            break;

        }
        break;
      case 'TEXTAREA':
        if ( ! validator.isEmpty( $field.value.trim() ) ) {
          isValid = true;
        }
        break;
    }

    if ( isValid ) {
      tools.removeClass( 'error', [ $field.closest('.form__field') ] );
    } else {
      tools.addClass( 'error', [ $field.closest('.form__field') ] );
    }

    console.log( { type, name, nodeName, isValid } );
    console.log( 'isFieldValid() finish' );

    return isValid;

  };

  //////////////////////////////////////////////////////////
  ////  Check if Form is Valid
  //////////////////////////////////////////////////////////

  const isFormValid = ( $form = false ) => {

    let isValid = true;
    let requiredFields = $form.querySelectorAll('.required') || [];

    for ( let i = 0; i < requiredFields.length; i++ ) {
      console.log( 'isFormValid() loop count' + i );
      if ( !isFieldValid( requiredFields[i] ) ) {
        isValid = false;
      }
    }

    return isValid;

  };

  //////////////////////////////////////////////////////////
  ////  Check for Spam
  //////////////////////////////////////////////////////////

  const hasSpam = ( $form = false ) => {

    let inputs = $form.querySelectorAll('input.rude') || [];

    for ( let i = 0; i < inputs.length; i++ ) {
      if ( inputs[i].value ) {
        // yes spam, stop loop and exit
        return true;
      }
    }

    // no spam!
    return false;

  };

  //////////////////////////////////////////////////////////
  ////  Check if form has files
  //////////////////////////////////////////////////////////

  const underFileSizeLimit = ( $form = false ) => {

    console.log( 'hasFiles start' );

    let totalMB = 0;
    let inputs = $form.querySelectorAll('input[type="file"]') || [];
    formFiles.length = 0;

    for ( let i = 0; i < inputs.length; i++ ) {

      let input = inputs[i];
      let field = input.closest('.field');
      let fieldErrorMessage = field.querySelector('.form__error-message') || false;
      let files = input.files || {};
      let message = '';
      for ( let key in files ) {
        totalMB += files[key].size || 0;
        if ( files[key].size ) {
          formFiles.push( files[key] );
        }
      }
      totalMB = totalMB/1024/1024;
      if ( totalMB > maxMB ) {
        message = `The total file size (${totalMB.toFixed(1)}MB) is larger than ${maxMB}.0MB`;
        field.classList.add( 'error' );
        if ( fieldErrorMessage ) fieldErrorMessage.innerHTML = message;
        return false;
      } else {
        if ( fieldErrorMessage ) fieldErrorMessage.innerHTML = message;
        field.classList.remove( 'error' );
      }
    }

    console.log( 'hasFiles end', {
      totalMB,
      maxMB
    });

    return true;

  };

  //////////////////////////////////////////////////////////
  ////  Submit Form via Axios
  //////////////////////////////////////////////////////////

  const submitForm = ( formElement = false ) => {

    let formAction = formElement.action || false;
    let formData = new FormData( formElement );
    let redirectURL = formElement.dataset.redirectUrl || false;
    let formType = formElement.dataset.formType || 'default';
    let formObject = {};

    if ( formFiles.length ) {
      formFiles.forEach( ( file, index ) => {
        formData.append( 'files' , file );
      });
    }

    formData.forEach((value, key) => formObject[key] = value);
    document.body.classList.add('form-posting');

    console.log( formObject );

    axios.post( formAction, formData )
    .then( data => {
      if ( debug ) console.log( data );
      switch ( formType ) {
        case 'lead-generation': {
          formElement.reset();
          setTimeout(() => {
            formElement.classList.remove('posting');
            alert(`Thanks ${formObject['First Name']}!`);
          }, 750 );
          break;
        }
        case 'redirect': {
          if ( redirectURL ) window.location.replace( redirectURL );
          break;
        }
        default: {
          window.location.replace( '/pages/thank-you' );
        }
      }
    })
    .catch( data => {
      console.log( 'catch() data :: ', data );
    });

  };

  //////////////////////////////////////////////////////////
  ////  Initialize
  //////////////////////////////////////////////////////////

  const init = () => {
    if ( debug ) console.log( `${info.name}.init() v.${info.version} Started` );

      onFormFocus();

      document.querySelectorAll('.js--validate-me [type="submit"]').forEach( button => {

        button.addEventListener('click', ( event ) => {

          event.preventDefault();

          let form = button.closest( 'form' );
          let formRedirectURL = false;
          let formValid = isFormValid( form );
          let formHasSpam = hasSpam( form );
          let formUnderFileSizeLimit = underFileSizeLimit( form );

          if ( debug ) console.log( `${info.name}.init()`, { formValid, formHasSpam, formUnderFileSizeLimit } );

          if ( formValid && !formHasSpam && formUnderFileSizeLimit ) {
            submitForm( form );
          }

        });

      });

    if ( debug ) console.log( `${info.name}.init() Finished` );
  };

  //////////////////////////////////////////////////////////
  ////  Returned Methods
  //////////////////////////////////////////////////////////

  return {
    info,
    init,
  };

});
