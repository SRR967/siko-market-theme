(function () {
  // Early: add body class synchronously so CSS applies before paint
  (function () {
    var pi = document.querySelector("product-info[data-product-handle='sabanas-100-garantizadas-1']");
    if (pi) document.body.classList.add('sabanas-dark-hero');
  })();

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

  function setupInjectedElementsAnimation(productInfo) {
    if (!productInfo) return;
    var description = productInfo.querySelector('.product__description');
    if (!description) return;

    var selectors = [
      '.sabanas-text-block',
      '.sabanas-carousel',
      '.sabanas-promo-img',
      '.sabanas-faq'
    ];

    var elements = description.querySelectorAll(selectors.join(','));
    if (!elements.length) return;

    elements.forEach(function (el) {
      if (el.dataset.sabanasAnimInit) return;
      el.dataset.sabanasAnimInit = 'true';
      el.classList.add('sabanas-enter');
    });

    var animObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('sabanas-visible');
        animObserver.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });

    elements.forEach(function (el) { animObserver.observe(el); });
  }

  function setupSabanasDarkHero(productInfo) {
    if (!productInfo) return;
    if (productInfo.getAttribute('data-product-handle') !== 'sabanas-100-garantizadas-1') return;
    document.body.classList.add('sabanas-dark-hero');
  }

  // Finds the first visible clickable buy button in the product form area
  function findSabanasVisibleBuyButton(productInfo) {
    var form = productInfo.querySelector('product-form') || productInfo.querySelector('.product-form');
    if (!form) return null;
    var candidates = form.querySelectorAll('button, a[href]');
    for (var i = 0; i < candidates.length; i++) {
      var el = candidates[i];
      var cs = window.getComputedStyle(el);
      if (cs.display !== 'none' && cs.visibility !== 'hidden' && el.offsetParent !== null) {
        return el;
      }
    }
    return null;
  }

  function applyGoldStyleToBtn(btn) {
    btn.style.setProperty('background', 'linear-gradient(135deg,#F5A800,#d48000)', 'important');
    btn.style.setProperty('background-color', '#F5A800', 'important');
    btn.style.setProperty('color', '#0d0d0d', 'important');
    btn.style.setProperty('font-weight', '800', 'important');
    btn.style.setProperty('border-color', '#d48000', 'important');
    btn.style.setProperty('border-radius', '8px', 'important');
    btn.style.setProperty('box-shadow', '0 4px 20px rgba(245,168,0,0.5)', 'important');
    btn.dataset.sabanasGold = '1';
  }

  function setupSabanasGoldenButton(productInfo) {
    if (!productInfo) return;
    if (productInfo.getAttribute('data-product-handle') !== 'sabanas-100-garantizadas-1') return;

    function paintButtons() {
      var form = productInfo.querySelector('product-form') || productInfo.querySelector('.product-form');
      if (!form) return;
      form.querySelectorAll('button, a').forEach(function (el) {
        if (el.dataset.sabanasGold) return;
        var cs = window.getComputedStyle(el);
        if (cs.display !== 'none' && cs.visibility !== 'hidden' && el.offsetParent !== null) {
          applyGoldStyleToBtn(el);
        }
      });
    }

    // Run at 500ms, 1500ms, 3000ms to catch late-loading app buttons
    [500, 1500, 3000].forEach(function (t) { window.setTimeout(paintButtons, t); });

    // MutationObserver to catch dynamically added app buttons
    var mo = new MutationObserver(paintButtons);
    mo.observe(productInfo, { childList: true, subtree: true });
  }

  function setupSabanasImageClickToBuy(productInfo) {
    if (!productInfo) return;
    if (productInfo.getAttribute('data-product-handle') !== 'sabanas-100-garantizadas-1') return;
    if (productInfo.dataset.sabanasImgClickSetup === 'true') return;
    productInfo.dataset.sabanasImgClickSetup = 'true';

    var description = productInfo.querySelector('.product__description');
    if (!description) return;

    // Event delegation: any image click → scroll to form → click buy button
    description.addEventListener('click', function (e) {
      var target = e.target;
      if (target.tagName !== 'IMG') return;

      var productForm = productInfo.querySelector('product-form') || productInfo.querySelector('.product-form');
      if (productForm) {
        productForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      // After scroll animation, find and click the visible buy button
      window.setTimeout(function () {
        var btn = findSabanasVisibleBuyButton(productInfo);
        if (btn) btn.click();
      }, 600);
    });

    // Pointer cursor on existing + future images
    description.querySelectorAll('img').forEach(function (img) { img.style.cursor = 'pointer'; });
    var mo = new MutationObserver(function () {
      description.querySelectorAll('img:not([data-click-buy])').forEach(function (img) {
        img.setAttribute('data-click-buy', '1');
        img.style.cursor = 'pointer';
      });
    });
    mo.observe(description, { childList: true, subtree: true });
  }

  function setupBiohackAnnouncement(productInfo) {
    if (!productInfo) return;
    if (productInfo.getAttribute('data-product-handle') !== 'biohack-mind-d-p') return;

    document.body.classList.add('biohack-announcement');

    // Change all announcement bar text spans to the new text
    var announcementSpans = document.querySelectorAll('.announcement-bar__message span, .announcement-bar__announcement span');
    announcementSpans.forEach(function (span) {
      span.textContent = 'Producto importado \uD83C\uDDFA\uD83C\uDDF8';
    });

    // Also update any plain <p> text in case span is empty
    var announcementMsgs = document.querySelectorAll('.announcement-bar__message');
    announcementMsgs.forEach(function (p) {
      if (!p.querySelector('span')) {
        p.textContent = 'Producto importado \uD83C\uDDFA\uD83C\uDDF8';
      }
    });
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

    const sabanasBanner = productInfo.querySelector('.sabanas-banner-container');
    if (sabanasBanner) {
      productForm.insertAdjacentElement('afterend', sabanasBanner);
    }

    productInfo.dataset.dtcBuyButtonsMoved = 'true';
  }

  function insertSabanasTextBlock(productInfo) {
    if (!productInfo) return;
    if (productInfo.dataset.sabanasTextInserted === 'true') return;
    if (productInfo.getAttribute('data-product-handle') !== 'sabanas-100-garantizadas-1') return;

    const description = productInfo.querySelector('.product__description');
    if (!description) return;

    // Get only images that are direct content (not inside product-form or banner)
    const allImages = Array.from(description.querySelectorAll('img')).filter(function (img) {
      return !img.closest('product-form') && !img.closest('.sabanas-banner-container');
    });

    if (allImages.length < 2) return;

    const secondImage = allImages[1];

    // Insert after the immediate parent container of the second image
    // (e.g. the <p> or <div> that wraps the img — stays inside description)
    const insertAfter = (secondImage.parentNode && secondImage.parentNode !== description)
      ? secondImage.parentNode
      : secondImage;

    // Guard: don't insert twice
    if (insertAfter.nextElementSibling && insertAfter.nextElementSibling.classList.contains('sabanas-text-block')) return;

    const block = document.createElement('div');
    block.className = 'sabanas-text-block';
    block.innerHTML = [
      '<style>',
      '  .sabanas-text-block {',
      '    background-color: #0d0d0d;',
      '    border-radius: 12px;',
      '    padding: 36px 28px;',
      '    margin: 24px 0;',
      '    text-align: center;',
      '    font-family: "Nunito", "Poppins", sans-serif;',
      '    position: relative;',
      '    z-index: 10;',
      '  }',
      '  .sabanas-text-block__title {',
      '    font-size: 32px;',
      '    font-weight: 800;',
      '    color: #F59C00;',
      '    line-height: 1.2;',
      '    margin: 0 0 20px 0;',
      '    font-family: "Nunito", "Poppins", sans-serif;',
      '  }',
      '  .sabanas-text-block__body {',
      '    font-size: 17px;',
      '    color: #ffffff;',
      '    line-height: 1.7;',
      '    margin: 0 0 20px 0;',
      '    font-weight: 400;',
      '  }',
      '  .sabanas-text-block__body strong {',
      '    color: #F59C00;',
      '    font-weight: 700;',
      '  }',
      '  .sabanas-text-block__body:last-child { margin-bottom: 0; }',
      '  @media (max-width: 749px) {',
      '    .sabanas-text-block__title { font-size: 26px; }',
      '    .sabanas-text-block__body { font-size: 15px; }',
      '    .sabanas-text-block { padding: 28px 20px; }',
      '  }',
      '</style>',
      '<p class="sabanas-text-block__title">90% algod\u00f3n y 800<br>Hilos de Precisi\u00f3n Textil.</p>',
      '<p class="sabanas-text-block__body">Nuestras s\u00e1banas Premium <strong>800 hilos est\u00e1n confeccionadas con un tejido satinado de alta densidad, que combina 90% algod\u00f3n</strong> y 10% poli\u00e9ster t\u00e9cnico.</p>',
      '<p class="sabanas-text-block__body">Esta composici\u00f3n garantiza una <strong>mayor durabilidad, menor formaci\u00f3n de arrugas y una textura consistentemente suave al tacto.</strong></p>'
    ].join('');

    insertAfter.insertAdjacentElement('afterend', block);
    productInfo.dataset.sabanasTextInserted = 'true';
  }

  function insertSabanasTextBlock4(productInfo) {
    if (!productInfo) return;
    if (productInfo.dataset.sabanasText4Inserted === 'true') return;
    if (productInfo.getAttribute('data-product-handle') !== 'sabanas-100-garantizadas-1') return;

    const description = productInfo.querySelector('.product__description');
    if (!description) return;

    const allImages = Array.from(description.querySelectorAll('img')).filter(function (img) {
      return !img.closest('product-form') && !img.closest('.sabanas-banner-container');
    });

    if (allImages.length < 4) return;

    const fourthImage = allImages[3];
    const insertAfter = (fourthImage.parentNode && fourthImage.parentNode !== description)
      ? fourthImage.parentNode
      : fourthImage;

    if (insertAfter.nextElementSibling && insertAfter.nextElementSibling.classList.contains('sabanas-text-block')) return;

    // Text block
    const block = document.createElement('div');
    block.className = 'sabanas-text-block';
    block.innerHTML = [
      '<p class="sabanas-text-block__title">Sujeci\u00f3n Firme,<br>Sin Arrugas.</p>',
      '<p class="sabanas-text-block__body">Con un fuelle adaptable <strong>de 25 a 35 cm</strong>, garantizamos un ajuste perfecto que realza la est\u00e9tica de tu cama y asegura una comodidad sin igual.</p>'
    ].join('');

    insertAfter.insertAdjacentElement('afterend', block);

    // Carousel
    var carouselImages = [
      'https://cdn.shopify.com/s/files/1/0810/9401/7282/files/ALEJA_5_CM_LA_CMARA_202605172341.jpg?v=1779079298',
      'https://cdn.shopify.com/s/files/1/0810/9401/7282/files/PON_LAS_ASABANAS_DE_COLOR_202605172341.jpg?v=1779079332',
      'https://cdn.shopify.com/s/files/1/0810/9401/7282/files/PON_LAS_ASABANAS_COLOR_ROJO_202605172342.jpg?v=1779079386',
      'https://cdn.shopify.com/s/files/1/0810/9401/7282/files/PON_LAS_SABANAS_DE_COLOR_202605172343.jpg?v=1779079429',
      'https://cdn.shopify.com/s/files/1/0810/9401/7282/files/PON_LAS_SABANAS_DE_COLOR_202605172344.jpg?v=1779079467',
      'https://cdn.shopify.com/s/files/1/0810/9401/7282/files/PON_LAS_SABANAS_DE_COLRO_202605172345.jpg?v=1779079517',
      'https://cdn.shopify.com/s/files/1/0810/9401/7282/files/PON_LAS_SABANAS_DE_COLOR_202605172347.jpg?v=1779079659',
      'https://cdn.shopify.com/s/files/1/0810/9401/7282/files/Hotel_room_with_beige_sheets_202605172351.jpg?v=1779079925',
      'https://cdn.shopify.com/s/files/1/0810/9401/7282/files/Hotel_room_with_beige_sheets_202605172349_1.jpg?v=1779079774',
      'https://cdn.shopify.com/s/files/1/0810/9401/7282/files/Hotel_room_with_beige_sheets_202605172349.jpg?v=1779079751',
      'https://cdn.shopify.com/s/files/1/0810/9401/7282/files/Hotel_room_with_beige_sheets_202605172348.jpg?v=1779079719'
    ];

    var carousel = document.createElement('div');
    carousel.className = 'sabanas-carousel';

    var slidesHtml = carouselImages.map(function (src) {
      return '<div class="sabanas-carousel__slide"><img src="' + src + '" alt="S\u00e1banas Premium"></div>';
    }).join('');

    var dotsHtml = carouselImages.map(function (_, i) {
      return '<button class="sabanas-carousel__dot' + (i === 0 ? ' is-active' : '') + '" data-index="' + i + '" aria-label="Imagen ' + (i + 1) + '"></button>';
    }).join('');

    carousel.innerHTML =
      '<div class="sabanas-carousel__track">' + slidesHtml + '</div>' +
      '<button class="sabanas-carousel__btn sabanas-carousel__btn--prev" aria-label="Anterior">&#8249;</button>' +
      '<button class="sabanas-carousel__btn sabanas-carousel__btn--next" aria-label="Siguiente">&#8250;</button>' +
      '<div class="sabanas-carousel__dots">' + dotsHtml + '</div>';

    block.insertAdjacentElement('afterend', carousel);

    // Init carousel logic
    var track = carousel.querySelector('.sabanas-carousel__track');
    var dots = Array.from(carousel.querySelectorAll('.sabanas-carousel__dot'));
    var prevBtn = carousel.querySelector('.sabanas-carousel__btn--prev');
    var nextBtn = carousel.querySelector('.sabanas-carousel__btn--next');
    var current = 0;
    var total = carouselImages.length;
    var timer;

    function goTo(index) {
      current = (index + total) % total;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach(function (dot, i) { dot.classList.toggle('is-active', i === current); });
    }

    function startTimer() { timer = setInterval(function () { goTo(current + 1); }, 1500); }
    function resetTimer() { clearInterval(timer); startTimer(); }

    prevBtn.addEventListener('click', function () { goTo(current - 1); resetTimer(); });
    nextBtn.addEventListener('click', function () { goTo(current + 1); resetTimer(); });
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () { goTo(parseInt(dot.dataset.index)); resetTimer(); });
    });

    var touchStartX = 0;
    carousel.addEventListener('touchstart', function (e) { touchStartX = e.touches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', function (e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); resetTimer(); }
    });

    startTimer();

    // Insert promo image after the 5th description image (one after the carousel context)
    var allImagesForPromo = Array.from(description.querySelectorAll('img')).filter(function (img) {
      return !img.closest('product-form') && !img.closest('.sabanas-banner-container') && !img.closest('.sabanas-carousel');
    });

    if (allImagesForPromo.length >= 5) {
      var fifthImage = allImagesForPromo[4];
      var insertAfterFifth = (fifthImage.parentNode && fifthImage.parentNode !== description)
        ? fifthImage.parentNode
        : fifthImage;

      var promoImg = document.createElement('img');
      promoImg.src = 'https://cdn.shopify.com/s/files/1/0810/9401/7282/files/IMAGEN_DE_COLOR_NEGRO_Pon_202605181705.jpg?v=1779155113';
      promoImg.alt = 'S\u00e1banas Premium';
      promoImg.className = 'sabanas-promo-img';
      insertAfterFifth.insertAdjacentElement('afterend', promoImg);

      // Text block after promo image
      var promoBlock = document.createElement('div');
      promoBlock.className = 'sabanas-text-block';
      promoBlock.innerHTML = [
        '<p class="sabanas-text-block__title">La calidad del algod\u00f3n,<br>en cada hilo.</p>',
        '<p class="sabanas-text-block__body">Confeccionadas en <strong>90% algod\u00f3n de fibra larga</strong>, m\u00e1s suave, resistente y transpirable.</p>',
        '<p class="sabanas-text-block__body"><strong>No retiene el calor ni el sudor</strong>, para un descanso m\u00e1s fresco y confortable.</p>',
        '<p class="sabanas-text-block__body">Adem\u00e1s, <strong>somos fabricantes</strong>, garantizando calidad sin intermediarios.</p>'
      ].join('');
      promoImg.insertAdjacentElement('afterend', promoBlock);

      // Testimonials title
      var testimonialsTitle = document.createElement('div');
      testimonialsTitle.className = 'sabanas-text-block sabanas-testimonials-title';
      testimonialsTitle.innerHTML = '<p class="sabanas-text-block__title">Testimonios</p>';
      promoBlock.insertAdjacentElement('afterend', testimonialsTitle);

      // Testimonials carousel
      var testimImages = [
        'https://cdn.shopify.com/s/files/1/0810/9401/7282/files/QUITA_EL_LOGO_QUE_HAY_202605182123.jpg?v=1779157675',
        'https://cdn.shopify.com/s/files/1/0810/9401/7282/files/gempages_485402500090823934-17f5f3f1-e92a-4b9d-b22b-44a6fbe51c68.webp?v=1779157676',
        'https://cdn.shopify.com/s/files/1/0810/9401/7282/files/UNA_LINEA_MAS_GRUEESA_QUE_202605182127.jpg?v=1779157679'
      ];

      var testimCarousel = document.createElement('div');
      testimCarousel.className = 'sabanas-carousel sabanas-testimonials-carousel';

      var tSlidesHtml = testimImages.map(function (src) {
        return '<div class="sabanas-carousel__slide"><img src="' + src + '" alt="Testimonio"></div>';
      }).join('');

      var tDotsHtml = testimImages.map(function (_, i) {
        return '<button class="sabanas-carousel__dot' + (i === 0 ? ' is-active' : '') + '" data-index="' + i + '" aria-label="Testimonio ' + (i + 1) + '"></button>';
      }).join('');

      testimCarousel.innerHTML =
        '<div class="sabanas-carousel__track">' + tSlidesHtml + '</div>' +
        '<button class="sabanas-carousel__btn sabanas-carousel__btn--prev" aria-label="Anterior">&#8249;</button>' +
        '<button class="sabanas-carousel__btn sabanas-carousel__btn--next" aria-label="Siguiente">&#8250;</button>' +
        '<div class="sabanas-carousel__dots">' + tDotsHtml + '</div>';

      testimonialsTitle.insertAdjacentElement('afterend', testimCarousel);

      var tTrack = testimCarousel.querySelector('.sabanas-carousel__track');
      var tDots = Array.from(testimCarousel.querySelectorAll('.sabanas-carousel__dot'));
      var tPrev = testimCarousel.querySelector('.sabanas-carousel__btn--prev');
      var tNext = testimCarousel.querySelector('.sabanas-carousel__btn--next');
      var tCurrent = 0;
      var tTotal = testimImages.length;
      var tTimer;

      function tGoTo(index) {
        tCurrent = (index + tTotal) % tTotal;
        // Peek carousel: center current slide, show edges of neighbors
        var containerW = testimCarousel.clientWidth;
        var slideW = containerW * 0.76;  // 76% of container per slide
        var gapW = containerW * 0.04;    // 4% gap between slides
        var peekSide = (containerW - slideW) / 2; // centering offset
        var offset = (tCurrent * (slideW + gapW)) - peekSide;
        tTrack.style.transform = 'translateX(-' + Math.max(0, offset) + 'px)';
        tDots.forEach(function (d, i) { d.classList.toggle('is-active', i === tCurrent); });
      }

      function tStartTimer() { tTimer = setInterval(function () { tGoTo(tCurrent + 1); }, 3000); }
      function tResetTimer() { clearInterval(tTimer); tStartTimer(); }

      tPrev.addEventListener('click', function () { tGoTo(tCurrent - 1); tResetTimer(); });
      tNext.addEventListener('click', function () { tGoTo(tCurrent + 1); tResetTimer(); });
      tDots.forEach(function (d) {
        d.addEventListener('click', function () { tGoTo(parseInt(d.dataset.index)); tResetTimer(); });
      });

      var tTouchX = 0;
      testimCarousel.addEventListener('touchstart', function (e) { tTouchX = e.touches[0].clientX; }, { passive: true });
      testimCarousel.addEventListener('touchend', function (e) {
        var diff = tTouchX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) { tGoTo(diff > 0 ? tCurrent + 1 : tCurrent - 1); tResetTimer(); }
      });

      tStartTimer();

      // Stock block: title → image → paragraph (all in one block)
      var stockBlock = document.createElement('div');
      stockBlock.className = 'sabanas-text-block';
      stockBlock.innerHTML = [
        '<p class="sabanas-text-block__title">\u00a1Stock disponible en las principales ciudades del pa\u00eds!</p>',
        '<img src="https://cdn.shopify.com/s/files/1/0810/9401/7282/files/gempages_485402500090823934-bd2c72a9-198a-46c8-89b1-6bbc224944c1.webp?v=1779157827" alt="Instrucciones de cuidado" class="sabanas-block-inner-img">',
        '<p class="sabanas-text-block__body">Siga las <strong>instrucciones de lavado</strong> y cuidado para conservar la textura, el color y la softness de sus s\u00e1banas en perfecto estado, noche tras noche.</p>'
      ].join('');
      testimCarousel.insertAdjacentElement('afterend', stockBlock);

      // FAQ accordion section
      var faqData = [
        { q: '\u00bfLas s\u00e1banas est\u00e1n compuestas en un 90% de algod\u00f3n?', a: 'S\u00ed, nuestras s\u00e1banas est\u00e1n fabricadas con <strong>90% algod\u00f3n de fibra larga</strong> y 10% poli\u00e9ster t\u00e9cnico para mayor durabilidad, suavidad y resistencia al desgaste.' },
        { q: '\u00bfPuedo realizar el pago contra entrega?', a: 'S\u00ed, ofrecemos <strong>pago contra entrega en todas las ciudades del pa\u00eds</strong>. Paga c\u00f3modamente cuando recibas tu pedido en la puerta de tu casa.' },
        { q: '\u00bfSon los mayores distribuidores de lencer\u00eda para el hogar en comercio electr\u00f3nico?', a: 'S\u00ed, somos <strong>fabricantes directos</strong> con distribuci\u00f3n a nivel nacional, lo que nos permite garantizar calidad sin intermediarios y precios justos.' },
        { q: '\u00bfC\u00f3mo debo lavar y cuidar mis s\u00e1banas?', a: 'Lavar a <strong>temperatura fr\u00eda</strong>, planchar a temperatura tibia y <strong>no blanquear con CLOROX</strong>. Esto preserva la textura, el color y la suavidad por mucho m\u00e1s tiempo.' },
        { q: '\u00bfTienen garant\u00eda?', a: 'S\u00ed, nuestras s\u00e1banas cuentan con <strong>garant\u00eda de satisfacci\u00f3n</strong>. Si tienes alg\u00fan inconveniente con tu pedido, cont\u00e1ctanos y lo resolveremos de inmediato.' },
        { q: '\u00bfRealizan env\u00edos a todo el pa\u00eds?', a: 'S\u00ed, realizamos env\u00edos a <strong>todo el territorio nacional</strong> con tiempos de entrega de 1 a 5 d\u00edas h\u00e1biles.' }
      ];

      var faqSection = document.createElement('div');
      faqSection.className = 'sabanas-faq';
      faqSection.innerHTML = '<p class="sabanas-faq__title">Preguntas Frecuentes</p>' +
        faqData.map(function (item, i) {
          return '<div class="sabanas-faq__item" data-faq-index="' + i + '">' +
            '<button class="sabanas-faq__q">' + item.q + '<span class="sabanas-faq__icon">+</span></button>' +
            '<div class="sabanas-faq__a"><p>' + item.a + '</p></div>' +
            '</div>';
        }).join('');

      stockBlock.insertAdjacentElement('afterend', faqSection);

      // FAQ toggle logic
      faqSection.querySelectorAll('.sabanas-faq__item').forEach(function (item) {
        item.querySelector('.sabanas-faq__q').addEventListener('click', function () {
          var isOpen = item.classList.contains('is-open');
          faqSection.querySelectorAll('.sabanas-faq__item').forEach(function (el) {
            el.classList.remove('is-open');
            el.querySelector('.sabanas-faq__icon').textContent = '+';
          });
          if (!isOpen) {
            item.classList.add('is-open');
            item.querySelector('.sabanas-faq__icon').textContent = '\u00d7';
          }
        });
      });
    }

    productInfo.dataset.sabanasText4Inserted = 'true';
  }

  function insertProductVideoGridAfterFourthImage(productInfo) {
    if (!productInfo) return;

    const description = productInfo.querySelector('.product__description');
    if (!description || description.querySelector('.video-container-grid')) return;
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
      if (child === description || child === productForm || child.classList.contains('sabanas-banner-container')) return;
      child.remove();
    });
  }

  function init() {
    const productInfo = document.querySelector("product-info[id^='MainProduct-']");
    if (!productInfo) return;
    cleanLeadingEmptySpace(productInfo);
    cleanAllEmptyBlocks(productInfo);
    setupSabanasDarkHero(productInfo);
    setupBiohackAnnouncement(productInfo);
    scheduleVideoInsert(productInfo);
    moveBuyButtonsAfterFirstImage(productInfo);
    setupSabanasImageClickToBuy(productInfo);
    setupSabanasGoldenButton(productInfo);
    insertSabanasTextBlock(productInfo);
    insertSabanasTextBlock4(productInfo);
    stripProductInfoToDescriptionAndForm(productInfo);
    setupDescriptionImageAnimation(productInfo);
    window.setTimeout(function () { setupInjectedElementsAnimation(productInfo); }, 100);
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
    setupSabanasDarkHero(productInfo);
    setupBiohackAnnouncement(productInfo);
    scheduleVideoInsert(productInfo);
    moveBuyButtonsAfterFirstImage(productInfo);
    setupSabanasImageClickToBuy(productInfo);
    setupSabanasGoldenButton(productInfo);
    insertSabanasTextBlock(productInfo);
    insertSabanasTextBlock4(productInfo);
    stripProductInfoToDescriptionAndForm(productInfo);
    setupDescriptionImageAnimation(productInfo);
    window.setTimeout(function () { setupInjectedElementsAnimation(productInfo); }, 100);
  });
})();
