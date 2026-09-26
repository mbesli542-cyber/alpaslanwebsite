/* PARLA Galerie: reveal on scroll and a lightbox with keys and swipe. */
(() => {
  'use strict';
  const items = [...document.querySelectorAll('.look')];
  if (!items.length) return;

  const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px' }) : null;
  items.forEach((el) => (io ? io.observe(el) : el.classList.add('is-in')));

  const box = document.querySelector('[data-lightbox]');
  const img = box.querySelector('img');
  const count = box.querySelector('[data-count]');
  const srcs = items.map((el) => el.querySelector('button').dataset.full);
  const alts = items.map((el) => el.querySelector('img').alt);
  let at = 0;
  let opener = null;

  const show = (i) => {
    at = (i + srcs.length) % srcs.length;
    img.classList.add('is-swapping');
    const next = new Image();
    next.onload = next.onerror = () => { img.src = srcs[at]; img.alt = alts[at]; img.classList.remove('is-swapping'); };
    next.src = srcs[at];
    count.textContent = `${at + 1} / ${srcs.length}`;
    new Image().src = srcs[(at + 1) % srcs.length];
  };
  const open = (i, from) => {
    opener = from;
    box.hidden = false;
    document.body.style.overflow = 'hidden';
    show(i);
    requestAnimationFrame(() => box.classList.add('is-open'));
    box.querySelector('.lightbox__close').focus();
  };
  const close = () => {
    box.classList.remove('is-open');
    document.body.style.overflow = '';
    setTimeout(() => { box.hidden = true; }, 240);
    if (opener) opener.focus();
  };

  items.forEach((el, i) => el.querySelector('button').addEventListener('click', (e) => open(i, e.currentTarget)));
  box.querySelector('.lightbox__close').addEventListener('click', close);
  box.querySelector('.lightbox__prev').addEventListener('click', () => show(at - 1));
  box.querySelector('.lightbox__next').addEventListener('click', () => show(at + 1));
  box.addEventListener('click', (e) => { if (e.target === box) close(); });
  document.addEventListener('keydown', (e) => {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(at - 1);
    else if (e.key === 'ArrowRight') show(at + 1);
  });
  let x0 = null;
  box.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(at + (dx < 0 ? 1 : -1));
    x0 = null;
  });
})();
