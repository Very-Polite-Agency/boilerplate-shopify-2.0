const cartNotification = ( data = {} ) => {

  let { block_name, image_height, featured_image, price, title, variant_title } = data;

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

}

export default { cartNotification };
