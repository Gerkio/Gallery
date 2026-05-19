const imageUrls = [
  'https://i.ibb.co/KwNDXYp/Comfy-UI-00512.png',
  'https://i.ibb.co/5sjBYq2/Comfy-UI-00269.png',
  'https://i.ibb.co/ccvfVFc/Comfy-UI-00489.png',
  'https://i.ibb.co/Wg8zqF1/Comfy-UI-00494.png',
  'https://i.ibb.co/qrJcXwy/Comfy-UI-00476.png',
  'https://i.ibb.co/C2Q2trF/Comfy-UI-00107.png',
  'https://i.ibb.co/wdtDwbP/Comfy-UI-00323.png',
  'https://i.ibb.co/GVfmFKq/Comfy-UI-00451.png',
  'https://i.ibb.co/KctLhFz/Comfy-UI-00459.png',
  'https://i.ibb.co/ZHN1sb1/Comfy-UI-00522.png',
  'https://i.ibb.co/Z6S1gWS/Comfy-UI-00505.png',
  'https://i.ibb.co/d23hMkD/Comfy-UI-00509.png',
  'https://i.ibb.co/fGfzDT2/Comfy-UI-00515.png',
  'https://i.ibb.co/k1NsdmY/Comfy-UI-00516.png',
  'https://i.ibb.co/YtzZC1q/Comfy-UI-00518.png'
];

const gallery  = document.getElementById('gallery');
const modal    = document.getElementById('image-modal');
const modalImg = document.getElementById('modal-img');
const caption  = document.getElementById('caption');
const counter  = document.getElementById('modal-counter');
const closeBtn = document.querySelector('.modal-close');
const strip    = document.getElementById('modal-strip');

let currentIndex   = 0;
let isTransitioning = false;
let touchStartX    = 0;
let observer;

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const preloadCache  = new Set();

const expandSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>`;

// ── Gallery ──────────────────────────────────────────────

function createItem(url, index) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'gallery-item';
  btn.dataset.index = index;
  btn.setAttribute('aria-label', `Abrir imagen ${index + 1}`);
  btn.style.setProperty('--i', index);

  const img = document.createElement('img');
  img.dataset.src = url;
  img.alt = `Imagen ${index + 1}`;
  img.loading = 'lazy';
  img.decoding = 'async';
  img.className = 'gallery-thumb';
  img.onload = () => {
    img.classList.add('loaded');
    btn.classList.add('img-loaded');
  };

  const overlay = document.createElement('div');
  overlay.className = 'gallery-overlay';
  overlay.innerHTML = `<div class="gallery-icon">${expandSvg}</div><span class="gallery-label">Foto ${index + 1}</span>`;

  btn.append(img, overlay);
  return btn;
}

function loadGallery() {
  const frag = document.createDocumentFragment();
  imageUrls.forEach((url, i) => frag.append(createItem(url, i)));
  gallery.appendChild(frag);

  gallery.querySelectorAll('img[data-src]').forEach(img => {
    if (observer) observer.observe(img);
    else img.src = img.dataset.src;
  });
}

// ── Intersection Observer ────────────────────────────────

function setupObserver() {
  if (!('IntersectionObserver' in window)) return;
  observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(({ isIntersecting, target }) => {
      if (!isIntersecting) return;
      target.src = target.dataset.src;
      obs.unobserve(target);
    });
  }, { rootMargin: '200px 0px', threshold: 0 });
}

// ── Thumbnail Strip ──────────────────────────────────────

function buildStrip() {
  const frag = document.createDocumentFragment();
  imageUrls.forEach((url, i) => {
    const img = document.createElement('img');
    img.src = url;
    img.alt = '';
    img.className = 'strip-thumb';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.setAttribute('role', 'listitem');
    img.setAttribute('tabindex', '0');
    img.setAttribute('aria-label', `Ir a imagen ${i + 1}`);
    img.dataset.index = i;
    img.addEventListener('click', () => navigate(i));
    img.addEventListener('keydown', e => { if (e.key === 'Enter') navigate(i); });
    frag.append(img);
  });
  strip.appendChild(frag);
}

function syncStrip(index) {
  strip.querySelectorAll('.strip-thumb').forEach((el, i) => el.classList.toggle('active', i === index));
  strip.querySelector('.strip-thumb.active')?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
}

// ── Preload ──────────────────────────────────────────────

function preload(url) {
  if (preloadCache.has(url)) return;
  preloadCache.add(url);
  new Image().src = url;
}

function preloadNeighbors(index) {
  const prev = (index - 1 + imageUrls.length) % imageUrls.length;
  const next = (index + 1) % imageUrls.length;
  const run = () => { preload(imageUrls[prev]); preload(imageUrls[next]); };
  'requestIdleCallback' in window
    ? requestIdleCallback(run, { timeout: 800 })
    : run();
}

// ── Modal ────────────────────────────────────────────────

function openModal(index) {
  currentIndex = index;
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  modalImg.src = imageUrls[index];
  modalImg.alt = `Imagen ampliada ${index + 1}`;
  caption.textContent = `Fotografía ${index + 1} de ${imageUrls.length}`;
  counter.textContent = `${index + 1} / ${imageUrls.length}`;
  document.body.style.overflow = 'hidden';
  closeBtn.focus();
  syncStrip(index);
  preloadNeighbors(index);
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

async function navigate(index) {
  if (isTransitioning) return;
  isTransitioning = true;
  currentIndex = index;

  if (!reducedMotion) {
    modalImg.classList.add('transitioning');
    await new Promise(r => setTimeout(r, 160));
  }

  modalImg.src = imageUrls[index];
  modalImg.alt = `Imagen ampliada ${index + 1}`;
  caption.textContent = `Fotografía ${index + 1} de ${imageUrls.length}`;
  counter.textContent = `${index + 1} / ${imageUrls.length}`;
  syncStrip(index);

  if (!reducedMotion) modalImg.classList.remove('transitioning');

  isTransitioning = false;
  preloadNeighbors(index);
}

function shift(delta) {
  navigate((currentIndex + delta + imageUrls.length) % imageUrls.length);
}

// ── Events ───────────────────────────────────────────────

gallery.addEventListener('click', e => {
  const item = e.target.closest('button.gallery-item');
  if (item) openModal(Number(item.dataset.index));
});

modal.addEventListener('click', e => {
  const nav = e.target.closest('[data-direction]');
  if (nav) { shift(nav.dataset.direction === 'next' ? 1 : -1); return; }
  if (e.target.closest('[data-close]') || e.target.closest('.modal-close')) closeModal();
});

document.addEventListener('keydown', e => {
  if (!modal.classList.contains('open')) return;
  if (e.key === 'Escape')     closeModal();
  if (e.key === 'ArrowRight') shift(1);
  if (e.key === 'ArrowLeft')  shift(-1);
});

modal.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
modal.addEventListener('touchend',   e => {
  const dx = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(dx) > 45) shift(dx > 0 ? 1 : -1);
}, { passive: true });

// ── Init ─────────────────────────────────────────────────

setupObserver();
loadGallery();
buildStrip();
preload(imageUrls[0]);
