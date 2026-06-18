(function () {
  function initPopup() {
    const popup = document.querySelector('[data-social-proof-popup]');
    if (!popup) {
      console.warn('[Social Proof Popup] Popup element not found.');
      return;
    }

    const imageElement = popup.querySelector('[data-social-proof-image]');
    const customerElement = popup.querySelector('[data-social-proof-customer]');
    const productElement = popup.querySelector('[data-social-proof-product]');
    const locationElement = popup.querySelector('[data-social-proof-location]');
    const productInfo = popup.closest('product-info') || document.querySelector("product-info[id^='MainProduct-']");

    if (!imageElement || !customerElement || !productElement || !locationElement) {
      console.warn('[Social Proof Popup] Missing inner elements.');
      return;
    }
    if (!productInfo) {
      console.warn('[Social Proof Popup] product-info element not found. Variant image switching may be limited.');
    }

  const fallbackImage = popup.dataset.productImage || '';
  const productTitle = popup.dataset.productTitle || 'Producto';
  const defaultNames = [
    'Eduardo...', 'Camila...', 'Daniel...', 'Valentina...', 'Laura...',
    'David...', 'Juan...', 'Pedro...', 'María...', 'Ana...',
    'Luis...', 'Carlos...', 'Jorge...', 'Andrés...', 'Diego...',
    'José...', 'Miguel...', 'Santiago...', 'Sebastián...', 'Felipe...',
    'Alejandro...', 'Nicolás...', 'Juliana...', 'Daniela...', 'Natalia...',
    'Paola...', 'Marcela...', 'Adriana...', 'Melissa...', 'Stefanía...',
    'Isabella...', 'Sara...', 'Sofía...', 'Manuela...', 'Catalina...',
    'Fernanda...', 'Karen...', 'Yessica...', 'Lina...', 'Luisa...',
    'Fabián...', 'Cristian...', 'Iván...', 'Óscar...', 'Mauricio...',
    'Ricardo...', 'Édgar...', 'Héctor...', 'Wilmer...', 'Javier...',
    'Esteban...', 'Mateo...', 'Samuel...', 'Tomás...', 'Simón...',
    'Gloria...', 'Patricia...', 'Sandra...', 'Claudia...', 'Diana...'
  ];
  const defaultLocations = [
    /* Grandes ciudades */
    'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena',
    'Bucaramanga', 'Pereira', 'Santa Marta', 'Ibagué', 'Manizales',
    'Neiva', 'Villavicencio', 'Armenia', 'Popayán', 'Valledupar',
    'Montería', 'Sincelejo', 'Pasto', 'Cúcuta', 'Tunja',
    /* Ciudades intermedias */
    'Palmira', 'Bello', 'Barrancabermeja', 'Soledad',
    'Itagüí', 'Soacha', 'Envigado', 'Dosquebradas',
    /* Antioquia */
    'Rionegro', 'Sabaneta', 'La Ceja', 'Copacabana',
    'Girardota', 'Caldas', 'Marinilla', 'Barbosa', 'Apartadó', 'Caucasia',
    /* Costa Caribe */
    'Magangué', 'Lorica', 'Sahagún', 'Cereté', 'Ciénaga',
    /* Boyacá y Santanderes */
    'Sogamoso', 'Duitama', 'Chiquinquirá', 'San Gil', 'Socorro', 'Ocaña', 'Pamplona',
    /* Cundinamarca */
    'Zipaquirá', 'Facatativá', 'Mosquera', 'Funza', 'Girardot', 'Fusagasugá', 'Espinal',
    /* Tolima y Huila */
    'Honda', 'Líbano', 'Chaparral', 'Garzón', 'La Plata', 'Pitalito',
    /* Nariño y Cauca */
    'Ipiales', 'La Unión', 'Santander de Quilichao',
    /* Valle del Cauca */
    'Buga', 'Tuluá', 'Cartago', 'Jamundí', 'Yumbo', 'Zarzal'
  ];
  const variantImageMap = JSON.parse(popup.dataset.variantImages || '{}');
  const sequence = defaultNames.map((name, index) => ({
    name,
    location: defaultLocations[index % defaultLocations.length],
  }));

  let sequenceIndex = 0;
  let showTimer;
  let hideTimer;
  let nextTimer;

  const firstMinDelay  = 5000;  /* primera aparición: mínimo 5 s */
  const firstMaxDelay  = 10000; /* primera aparición: máximo 10 s */
  const minDelay       = 5000;  /* apariciones siguientes: mínimo 5 s */
  const maxDelay       = 15000; /* apariciones siguientes: máximo 15 s */
  const visibleDuration = 6000;
  const fadeDuration   = 500;

  function getActiveVariantId() {
    /* Si hay productInfo, usarlo; si no, buscar cualquier form de producto en la página */
    const scope = productInfo || document;
    const variantInput = scope.querySelector('form[id^="product-form-"] input[name="id"]');
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

  function getFirstDelay() {
    return Math.floor(Math.random() * (firstMaxDelay - firstMinDelay + 1)) + firstMinDelay;
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
    if (productInfo && (!target.closest('product-info') || target.closest('product-info') !== productInfo)) return;
    imageElement.src = getActiveImage();
  });

  popup.addEventListener('mouseenter', clearTimers);
  popup.addEventListener('mouseleave', function () {
    clearTimers();
    scheduleNextCycle(800);
  });

  scheduleNextCycle(getFirstDelay());
  } /* fin initPopup */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPopup);
  } else {
    initPopup();
  }
})();
