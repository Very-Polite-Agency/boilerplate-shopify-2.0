window.lazySizesConfig = window.lazySizesConfig || {};
window.lazySizesConfig.lazyClass = 'lazyload';

import 'lazysizes';
import 'lazysizes/plugins/unveilhooks/ls.unveilhooks';
import 'lazysizes/plugins/attrchange/ls.attrchange';

document.addEventListener('lazybeforeunveil', function(e){
	var bg = e.target.getAttribute('data-bg') || false;
	if ( bg ) e.target.style.backgroundImage = 'url(' + bg + ')';
});

document.addEventListener('lazyloaded', function(e){
  e.target.parentNode.classList.add('lazyloaded');
});;
