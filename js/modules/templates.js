import Money from 'money';

const config = { debug: true, name: 'templates.js', version: '1.0' };

const cartEmptyMessage = ( data = {} ) => {

  let {
    block_name = 'cart-empty-message',
    message = Theme.settings.cart?.empty_message || '',
  } = data;

  return `
    <div class="${block_name}">
      <div class="${block_name}__content body-copy--secondary">${message}</div>
    </div>
  `;

};

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

  let icon_trash = Theme.icons.dark?.trash ?? '';
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
      <div class="${block_name}__content">
        <div class="${block_name}__info">
          <strong class="${block_name}__product-title">
            <a class="${block_name}__title-link link" href="${url}" title="${product_title}" target="_self">${product_title}</a>
          </strong>
          ${ variant_title ? `<span class="${block_name}__variant-title">${variant_title}</span>` : '' }
        </div>
        <div class="${block_name}__price">${price_formatted}</div>
        <div class="${block_name}__stepper">${stepper({ quantity })}</div>
        <div class="${block_name}__action">
          <button class="${block_name}__button-remove button button--remove-cart-line-item js--remove-cart-line-item" type="button">
            ${ icon_trash ? `<img src="${icon_trash}" alt="Remove" width="20" height="20" />` : 'Remove' }
          </button>
        </div>
      </div>
    </div>
  `;

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

  return `${items.map( (item) => `${instagramFeedItem( item )}` ).join('')}`;

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

};

const stepper = ( data = {} ) => {

  let {
    block_name = 'stepper',
    quantity,
  } = data;

  let icons = {
    minus: Theme.icons.dark?.minus ?? '',
    plus: Theme.icons.dark?.plus ?? ''
  };

  return `
    <div class="${block_name}">
      <button class="${block_name}__button button button--stepper decrease js--stepper-button" type="button">
        <span class="${block_name}__button-icon button__icon minus">
          ${ icons.minus ? `<img src="${icons.minus}" alt="Minus" width="20" height="20" />` : '-' }
        </span>
      </button>
      <input class="${block_name}__input js--stepper-input" type="number" name="quantity" min="1" max="9999" value="${quantity}" readonly>
      <button class="${block_name}__button button button--stepper increase js--stepper-button" type="button">
        <span class="${block_name}__button-icon button__icon plus">
          ${ icons.plus ? `<img src="${icons.plus}" alt="Plus" width="20" height="20" />` : '+' }
        </span>
      </button>
    </div>
  `;

};

export default {
  cartEmptyMessage,
  cartLineItem,
  cartNotification,
  instagramFeedItems
};
