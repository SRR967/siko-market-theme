(function () {
  function cleanLeadingEmptySpace(productInfo) {
    if (!productInfo) return;

    const description = productInfo.querySelector('.product__description');
    if (!description) return;

    const children = Array.from(description.children);
    for (const child of children) {
      const hasImage = !!child.querySelector('img');
      const text = (child.textContent || '').replace(/\u00a0/g, ' ').trim();
      const html = (child.innerHTML || '').replace(/<br\s*\/?>/gi, '').trim();

      if (hasImage || text.length > 0 || html.length > 0) break;
      child.remove();
    }
  }

  function cleanAllEmptyBlocks(productInfo) {
    if (!productInfo) return;

    const description = productInfo.querySelector('.product__description');
    if (!description) return;

    const blocks = Array.from(description.querySelectorAll('p, div, figure, span'));
    blocks.forEach((block) => {
      const hasImage = !!block.querySelector('img');
      const hasMedia = !!block.querySelector('video, iframe');
      const text = (block.textContent || '').replace(/\u00a0/g, ' ').trim();
      const html = (block.innerHTML || '').replace(/<br\s*\/?>/gi, '').trim();

      if (!hasImage && !hasMedia && text.length === 0 && html.length === 0) {
        block.remove();
      }
    });
  }

  function setupDescriptionImageAnimation(productInfo) {
    if (!productInfo) return;

    const description = productInfo.querySelector('.product__description');
    if (!description) return;

    const images = description.querySelectorAll('img');
    if (!images.length) return;

    images.forEach((image) => image.classList.add('dtc-image-enter'));

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );

    images.forEach((image) => observer.observe(image));
  }

  function moveBuyButtonsAfterFirstImage(productInfo) {
    if (!productInfo || productInfo.dataset.dtcBuyButtonsMoved === 'true') return;

    const description = productInfo.querySelector('.product__description');
    const productForm = productInfo.querySelector('product-form');
    if (!description || !productForm) return;

    const firstImage = description.querySelector('img');
    if (!firstImage) return;

    const anchor = firstImage.closest('p, div, figure') || firstImage;
    anchor.insertAdjacentElement('afterend', productForm);
    productInfo.dataset.dtcBuyButtonsMoved = 'true';
  }

  function insertProductVideoGridAfterFourthImage(productInfo) {
    if (!productInfo) return;

    const description = productInfo.querySelector('.product__description');
    if (!description || description.querySelector('.video-container-grid')) return;

    const handle = (productInfo.getAttribute('data-product-handle') || '').toLowerCase().trim();
    if (handle !== 'apolo-balsamo' && handle !== 'biohack-mind') return;

    const url1 = productInfo.getAttribute('data-dtc-video-a');
    const url2 = productInfo.getAttribute('data-dtc-video-b');
    if (!url1 || !url2) return;

    const images = description.querySelectorAll('img');
    if (!images.length) return;

    const index = images.length >= 4 ? 3 : images.length - 1;
    const targetImage = images[index];
    const anchor = targetImage.closest('p, div, figure') || targetImage;

    const grid = document.createElement('div');
    grid.className = 'video-container-grid';
    grid.setAttribute('data-apolo-video-grid', 'true');
    grid.innerHTML =
      '<div class="video-item">' +
      '<video autoplay muted loop playsinline preload="metadata">' +
      '<source src="' +
      url1 +
      '" type="video/mp4">' +
      '</video>' +
      '</div>' +
      '<div class="video-item">' +
      '<video autoplay muted loop playsinline preload="metadata">' +
      '<source src="' +
      url2 +
      '" type="video/mp4">' +
      '</video>' +
      '</div>';

    anchor.insertAdjacentElement('afterend', grid);
  }

  function scheduleVideoInsert(productInfo) {
    insertProductVideoGridAfterFourthImage(productInfo);
    window.requestAnimationFrame(function () {
      insertProductVideoGridAfterFourthImage(productInfo);
    });
    window.setTimeout(function () {
      insertProductVideoGridAfterFourthImage(productInfo);
    }, 250);
  }

  function stripProductInfoToDescriptionAndForm(productInfo) {
    if (!productInfo) return;

    const container = productInfo.querySelector('.product__info-container');
    const description = productInfo.querySelector('.product__description');
    const productForm = productInfo.querySelector('product-form');
    if (!container || !description || !productForm) return;

    Array.from(container.children).forEach((child) => {
      if (child === description || child === productForm) return;
      child.remove();
    });
  }

  function init() {
    const productInfo = document.querySelector("product-info[id^='MainProduct-']");
    if (!productInfo) return;
    cleanLeadingEmptySpace(productInfo);
    cleanAllEmptyBlocks(productInfo);
    scheduleVideoInsert(productInfo);
    moveBuyButtonsAfterFirstImage(productInfo);
    stripProductInfoToDescriptionAndForm(productInfo);
    setupDescriptionImageAnimation(productInfo);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  document.addEventListener('product-info:loaded', function (event) {
    const productInfo = event.target.closest("product-info[id^='MainProduct-']");
    cleanLeadingEmptySpace(productInfo);
    cleanAllEmptyBlocks(productInfo);
    scheduleVideoInsert(productInfo);
    moveBuyButtonsAfterFirstImage(productInfo);
    stripProductInfoToDescriptionAndForm(productInfo);
    setupDescriptionImageAnimation(productInfo);
  });
})();
