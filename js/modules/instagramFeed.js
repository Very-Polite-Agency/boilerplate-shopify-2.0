import Render from 'render';
import Tools from 'tools';

const MAX_MINUTES = 300;
const config = { debug: true, name: 'instagramFeed.js', version: '1.0' };
const feed = {
  account: '',
  block_name: 'instagram-feed',
  element: false,
  glider_id: '',
  glider: {},
  item_count: 0,
  items: [],
  interval: null,
  limit: 0,
  local_storage: {
    data: {},
    data: 0,
    name: 'very-polite-instagram-feed',
  },
};

const asyncGetMedia = async ( token = '' ) => {

  return await fetch( `https://graph.instagram.com/me/media?fields=id,media_type,media_url,permalink&access_token=${token}`, { method: 'GET' } )
  .then((response) => {
    return response.json();
  })
  .catch((error) => {
    console.log(error);
  });

};

const asyncGetToken = async ( account = '' ) => {

  return await fetch( `https://very-polite-instagram-feed.herokuapp.com/token?userAccount=${account}`, { method: 'GET' } )
  .then((response) => {
    return response.json();
  })
  .catch((error) => {
    console.log(error);
  });

};

const localStorageNotExpired = ( data = '' ) => {

  let local_storage_data = JSON.parse( data );
  let local_storage_date = local_storage_data?.date || 0;
  let time_difference_milliseconds = Date.now() - local_storage_date;
  let time_difference_minutes = ( time_difference_milliseconds / 60000 ).toFixed(2);

  if ( time_difference_minutes > MAX_MINUTES ) {
    return false;
  }

  return true;

}

const init = () => {
  if ( config.debug ) console.log(`[ ${config.name} v.${config.version} initialized ]`);

    ( document.querySelectorAll( '.js--instagram-feed' ) || [] ).forEach( element => {

      feed.account = element.dataset?.feedAccount || '';
      feed.element = element;
      feed.id = element?.id || '';
      feed.limit = element.dataset?.feedLimit || 3;
      feed.local_storage.name += `--${feed.account}`;
      feed.local_storage.data = Tools.getLocalStorageDataByKey( feed.local_storage.name ) || false;

      if ( feed.account ) {
        if ( feed.local_storage.data && localStorageNotExpired( feed.local_storage.data ) ) {

          let data = JSON.parse( feed.local_storage.data );
          feed.items = data.items;
          Render.instagramFeed( feed );

        } else {
          asyncGetToken( feed.account ).then( data => {
            asyncGetMedia( data.token ).then( result => {

              feed.items = result.data;
              Tools.setLocalStorageDataByKey( feed.local_storage.name, JSON.stringify({ account: feed.account, date: Date.now(), items: feed.items }) );
              Render.instagramFeed( feed );

            });
          });
        }
      }

    });

  if ( config.debug ) console.log(`[ ${config.name} v.${config.version} complete ]`);
};

export default { init };
