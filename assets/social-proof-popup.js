(function () {
  const popup = document.querySelector('[data-social-proof-popup]');
  if (!popup) return;

  const imageElement = popup.querySelector('[data-social-proof-image]');
  const customerElement = popup.querySelector('[data-social-proof-customer]');
  const productElement = popup.querySelector('[data-social-proof-product]');
  const locationElement = popup.querySelector('[data-social-proof-location]');
  const productInfo = popup.closest('product-info');

  if (!imageElement || !customerElement || !productElement || !locationElement || !productInfo) return;

  const fallbackImage = popup.dataset.productImage || '';
  const productTitle = popup.dataset.productTitle || 'Producto';
  const defaultNames = ['Eduardo...', 'Camila...', 'Daniel...', 'Valentina...', 'Laura...','David...','Juan...','Pedro...','Maria...','Ana...','Luis...','Carlos...','Jorge...','Andres...','Diego...','Jose...','Miguel...'];
  const defaultLocations = ['Cartagena', 'Medellin', 'Bogota', 'Cali', 'Barranquilla','Armenia','Pereira','Bucaramanga','Santa Marta','Ibague','Neiva','Popayan'];
  const variantImageMap = JSON.parse(popup.dataset.variantImages || '{}');
  const sequence = defaultNames.map((name, index) => ({
    name,
    location: defaultLocations[index % defaultLocations.length],
  }));

  let sequenceIndex = 0;
  let showTimer;
  let hideTimer;
  let nextTimer;

  const minDelay = 30000;
  const maxDelay = 60000;
  const visibleDuration = 6000;
  const fadeDuration = 500;

  function getActiveVariantId() {
    const variantInput = productInfo.querySelector('form[id^="product-form-"] input[name="id"]');
    return variantInput ? variantInput.value : '';
  }

  function getActiveImage() {
    const variantId = getActiveVariantId();
    if (variantId && variantImageMap[variantId]) return variantImageMap[variantId];
    return fallbackImage;
  }

  function renderNotification() {
    const entry = sequence[sequenceIndex];
    customerElement.textContent = entry.name;
    productElement.textContent = productTitle;
    locationElement.textContent = `Desde ${entry.location}, ahora mismo`;
    imageElement.src = getActiveImage();
    imageElement.alt = productTitle;
  }

  function showPopup() {
    popup.classList.add('is-visible');
  }

  function hidePopup() {
    popup.classList.remove('is-visible');
  }

  function clearTimers() {
    window.clearTimeout(showTimer);
    window.clearTimeout(hideTimer);
    window.clearTimeout(nextTimer);
  }

  function getRandomDelay() {
    return Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
  }

  function scheduleNextCycle(delay) {
    nextTimer = window.setTimeout(cycle, delay);
  }

  function cycle() {
    renderNotification();
    showPopup();

    showTimer = window.setTimeout(() => {
      hidePopup();
      hideTimer = window.setTimeout(() => {
        sequenceIndex = (sequenceIndex + 1) % sequence.length;
        scheduleNextCycle(getRandomDelay());
      }, fadeDuration);
    }, visibleDuration);
  }

  document.addEventListener('change', function (event) {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    if (target.name !== 'id') return;
    if (!target.closest('product-info') || target.closest('product-info') !== productInfo) return;
    imageElement.src = getActiveImage();
  });

  popup.addEventListener('mouseenter', clearTimers);
  popup.addEventListener('mouseleave', function () {
    clearTimers();
    scheduleNextCycle(800);
  });

  scheduleNextCycle(3000);
})();
