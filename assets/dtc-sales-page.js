(function () {
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

  function init() {
    const productInfo = document.querySelector("product-info[id^='MainProduct-']");
    if (!productInfo) return;
    moveBuyButtonsAfterFirstImage(productInfo);
    setupDescriptionImageAnimation(productInfo);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  document.addEventListener('product-info:loaded', function (event) {
    const productInfo = event.target.closest("product-info[id^='MainProduct-']");
    moveBuyButtonsAfterFirstImage(productInfo);
    setupDescriptionImageAnimation(productInfo);
  });
})();
