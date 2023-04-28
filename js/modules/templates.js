import Money from 'money';
import Regions from 'regions';

const config = { debug: false, name: 'templates.js', version: '1.0' };

const cartLineItem = ( line_item = {} ) => {

  let {
    block_name = 'cart-line-item',
    featured_image,
    final_line_price, // price x quantity
    key,
    price,
    product_title,
    product_type,
    quantity,
    title,
    url,
    variant_id,
    variant_title
  } = line_item;

  let icon_trash = Theme.svg.icon?.trash ?? '';
  let image = {
    classes: 'lazyload lazyload-item lazyload-item--image lazypreload lazyload-item--inline inline',
    src: Theme.tools?.imgURLFilter ? Theme.tools.imgURLFilter( featured_image.url, 'small' ) : featured_image.url,
  };
  let price_formatted = Money.format( final_line_price );

  return `
    <div class="${block_name}" id="${block_name}--${key}" data-key="${key}">
      <div class="${block_name}__image">
        <a class="${block_name}__image-link link" href="${url}" title="${product_title}" target="_self">
          <img class="${image.classes}" src="${image.src}" alt="${featured_image.alt}" width="${featured_image.width}" height="${featured_image.height}" />
        </a>
      </div>
      <div class="${block_name}__content text--uppercase">
        <div class="${block_name}__info">
          <strong class="${block_name}__product-title">
            <a class="${block_name}__product-title-link link" href="${url}" title="${product_title}" target="_self">${product_title}</a>
          </strong>
          ${ variant_title ? `<span class="${block_name}__variant-title">${variant_title}</span>` : '' }
        </div>
        <div class="${block_name}__price">${price_formatted}</div>
        <div class="${block_name}__stepper">${stepper({ quantity })}</div>
        <div class="${block_name}__action">
          <button class="${block_name}__button-remove button button--remove-cart-line-item js--remove-cart-line-item" type="button">
            ${ icon_trash ?? 'Remove' }
          </button>
        </div>
      </div>
    </div>
  `;

};

const cartLineItemsTotal = ( line_items_total = 0 ) => {
  ( document.querySelectorAll( '.js--cart-line-items-total' ) || [] ).forEach( element => {
    element.innerHTML = `${line_items_total}`;
  });
};

const cartNotification = ( data = {} ) => {

  let {
    block_name,
    image_height,
    featured_image,
    price,
    title,
    variant_title
  } = data;

  return `
    <div class="${block_name}__triangle">
      ${ Theme.icons?.triangle && Theme.tools?.imgURLFilter ? `<img src="${ Theme.tools.imgURLFilter( Theme.icons.triangle, 'small' ) }" />` : '' }
    </div>
    <div class="${block_name}__main">
      <strong class="${block_name}__heading body-copy--1">1 item added to cart!</strong>
      <div class="${block_name}__media">
        <img
          class="lazyload lazyload-item"
          ${ featured_image?.url ? `src="${featured_image.url}"` : '' }
          ${ image_height && featured_image?.aspect_ratio ? `width="${ featured_image.aspect_ratio * image_height }"` : ''}
          ${ image_height ? `height="${image_height}"` : ''}
          ${ featured_image?.alt ? `alt="${featured_image.alt}"` : ''}
        />
      </div>
      <div class="${block_name}__content">
        ${ title ? `<strong class="${block_name}__product-title">${title}</strong>` : '' }
        <div class="${block_name}__product-info body-copy--1">
          ${ variant_title ? `<div class="${block_name}__details">${variant_title}</div>` : '' }
          ${ price ? `<div class="${block_name}__details">$${ price/100 }</div>` : '' }
        </div>
      </div>
      <div class="${block_name}__cta body-copy--1">
        <a class="${block_name}__cta-link link" href="/cart" target="_self" title="Checkout">Checkout</a>
      </div>
    </div>
  `;

};

const instagramFeedItems = ( feed = {} ) => {

  let {
    block_name = 'instagram-feed',
    item_count = 0,
    limit = 0,
    items = [],
  } = feed;

  function instagramFeedItem( item = {} ) {

    let {
      media_type = '',
      media_url = '',
      permalink = '',
      template = ''
    } = item;

    if ( ( "CAROUSEL_ALBUM" === media_type || "IMAGE" === media_type ) && ( item_count < limit ) ) {
      template = `
        <li class="glide__slide">
          <div class="${block_name}__item" data-count="${item_count}">
            <a class="${block_name}__item-link link" href="${permalink}" target="_blank" title="Intagram">
              <div class="${block_name}__item-image">
                <img class="lazyload lazyload-item lazyload-item--image lazypreload" src="${media_url}" title="Instagram Image" />
              </div>
            </a>
          </div>
        </li>
      `;
      item_count++;
    }

    return template;

  }

  return `${items.map( (item) => `${instagramFeedItem( item )}` ).join('')}`;

};

const stepper = ( data = {} ) => {

  let {
    block_name = 'stepper',
    quantity,
  } = data;

  let button = {
    decrease: Theme.svg.button.stepper?.decrease ?? '-',
    increase: Theme.svg.button.stepper?.increase ?? '+'
  };

  return `
    <div class="${block_name}">
      <button class="${block_name}__button button button--stepper button--svg decrease js--stepper-button" type="button">
        <span class="${block_name}__button-icon button__icon">${button.decrease}</span>
      </button>
      <input class="${block_name}__input input--secondary js--stepper-input" type="number" name="quantity" min="1" max="9999" value="${quantity}" readonly>
      <button class="${block_name}__button button button--stepper button--svg increase js--stepper-button" type="button">
        <span class="${block_name}__button-icon button__icon">${button.increase}</span>
      </button>
    </div>
  `;

};

const stockistAddress = ( location = {} ) => {

  // Lat & Long API
  // https://positionstack.com/documentation

  let {
    block_name = 'stockists',
    address = '',
    address2 = '',
    city = '',
    country = '',
    name = '',
    postal = '',
    region = ''
  } = location;

  address += address2 ? `, ${address2}` : ``;
  city += region ? `, ${Regions.getCodeFromName(region)}` : ``;
  city += postal ? ` ${postal}` : ``;

  return address || city ?
    `
      <div class="${block_name}__location-address text--secondary">
        <a class="${block_name}__location-address-link link" href="${stockistDirectionsLink( location )}" target="_blank" title="Directions to ${name}">
          ${ address ? `<span>${address}</span>` : `` }
          ${ city ? `<span>${city}</span>` : `` }
        </a>
      </div>
    ` : ``;
};

const stockistDirectionsLink = ( location = {} ) => {

  let {
    block_name = 'stockists',
    address = '',
    address2 = '',
    city = '',
    country = '',
    query = '',
    name = '',
    postal = '',
    region = ''
  } = location;

  query += address ?? ``;
  query += city ? `, ${city}` : ``;
  query += region ? `, ${region}` : ``;
  query += postal ? `, ${postal}` : ``;
  query += country ? `, ${country}` : ``;
  query += name ? `, ${name}` : ``;

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query.trim())}`

};

const stockistLocation = ( location = {} ) => {

  let {
    block_name = 'stockists',
    name = ''
  } = location;

  return `
    <div class="${block_name}__location">
      ${ name ? `<strong class="${block_name}__location-name">${name}</strong>` : '' }
      ${stockistAddress( location )}
    </div>
  `;

};

export default {
  cartLineItem,
  stockistLocation
};
