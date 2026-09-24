/* PARLA Shop: product grid, product sheet, cart and Stripe checkout. Prices are checked again on the server. */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const lang = () => (root.lang === 'tr' ? 'tr' : 'de');

  const T = {
    de: {
      all: 'Alle', anzug: 'Anzüge', hochzeit: 'Hochzeit', sakko: 'Sakkos', hose: 'Hosen', hemd: 'Hemden', accessoires: 'Accessoires',
      soldOut: 'Ausverkauft', few: 'Nur noch wenige in dieser Größe', pickSize: 'Bitte wählen Sie eine Größe.',
      added: 'Im Warenkorb', empty: 'Ihr Warenkorb ist leer.', remove: 'Entfernen', size: 'Größe', qty: 'Menge',
      less: 'Weniger', more: 'Mehr', loading: 'Kollektion wird geladen …', loadError: 'Die Kollektion konnte nicht geladen werden. Bitte später erneut versuchen.',
      none: 'Bald finden Sie hier unsere Anzüge. Bis dahin beraten wir Sie gern im Laden in F1 8.',
      pickup: 'Abholung im Laden (F1 8): kostenlos.', ship: (p) => `Versand in Deutschland: ${p}.`, freeFrom: (p) => `Kostenloser Versand ab ${p}.`,
      checkoutOff: 'Online-Bezahlung folgt in Kürze. Bestellen Sie gern telefonisch: 0621 43728859.',
      redirect: 'Weiter zu Stripe …', checkoutError: 'Die Kasse ist gerade nicht erreichbar. Bitte erneut versuchen.',
      from: 'statt',
      paid: (n) => `Bestellung ${n} ist bezahlt.`, waiting: (n) => `Bestellung ${n} ist eingegangen. Die Zahlung wird noch bestätigt.`,
      processing: 'Ihre Zahlung wird noch verarbeitet. Das kann einen Moment dauern.', unknown: 'Wir konnten die Bestellung nicht finden. Bitte kontaktieren Sie uns.',
      total: 'Gesamt',
    },
    tr: {
      all: 'Tümü', anzug: 'Takımlar', hochzeit: 'Damatlık', sakko: 'Ceketler', hose: 'Pantolonlar', hemd: 'Gömlekler', accessoires: 'Aksesuarlar',
      soldOut: 'Tükendi', few: 'Bu bedende son birkaç adet', pickSize: 'Lütfen bir beden seçin.',
      added: 'Sepette', empty: 'Sepetiniz boş.', remove: 'Kaldır', size: 'Beden', qty: 'Adet',
      less: 'Azalt', more: 'Artır', loading: 'Koleksiyon yükleniyor …', loadError: 'Koleksiyon yüklenemedi. Lütfen daha sonra tekrar deneyin.',
      none: 'Takımlarımız yakında burada. O zamana kadar sizi F1 8’deki mağazamızda ağırlamaktan mutluluk duyarız.',
      pickup: 'Mağazadan teslim (F1 8): ücretsiz.', ship: (p) => `Almanya içi kargo: ${p}.`, freeFrom: (p) => `${p} üzeri kargo ücretsiz.`,
      checkoutOff: 'Online ödeme çok yakında. Telefonla sipariş verebilirsiniz: 0621 43728859.',
      redirect: 'Stripe’a yönlendiriliyorsunuz …', checkoutError: 'Ödeme sayfası şu an açılamıyor. Lütfen tekrar deneyin.',
      from: 'yerine',
      paid: (n) => `${n} numaralı siparişinizin ödemesi alındı.`, waiting: (n) => `${n} numaralı siparişiniz alındı. Ödeme onayı bekleniyor.`,
      processing: 'Ödemeniz işleniyor. Bu biraz sürebilir.', unknown: 'Sipariş bulunamadı. Lütfen bizimle iletişime geçin.',
      total: 'Toplam',
    },
  };
  const t = (k, ...a) => { const v = T[lang()][k]; return typeof v === 'function' ? v(...a) : v; };
  const money = (c) => new Intl.NumberFormat(lang() === 'tr' ? 'tr-TR' : 'de-DE', { style: 'currency', currency: 'EUR' }).format(c / 100);
  const nameOf = (p) => (lang() === 'tr' && p.name.tr) || p.name.de;
  const descOf = (p) => (lang() === 'tr' && p.description.tr) || p.description.de;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- Cart (stored in this browser only) ---------- */
  const CART_KEY = 'parla-cart';
  const readCart = () => { try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch { return []; } };
  let cart = readCart();
  const writeCart = () => { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch { /* private mode */ } };
  const cartCount = () => cart.reduce((n, l) => n + l.qty, 0);

  const updateBadge = () => {
    $$('[data-cart-count]').forEach((el) => {
      const n = cartCount();
      el.textContent = n;
      el.hidden = n === 0;
    });
  };

  /* ---------- Sheets (product + cart) ---------- */
  let lastFocus = null;
  const openSheet = (el) => {
    lastFocus = document.activeElement;
    el.hidden = false;
    void el.offsetWidth;
    el.classList.add('is-open');
    document.body.classList.add('is-locked');
    $('.sheet__panel', el).focus({ preventScroll: true });
  };
  const closeSheet = (el) => {
    if (!el || el.hidden) return;
    el.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    window.setTimeout(() => { if (!el.classList.contains('is-open')) el.hidden = true; }, 380);
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  };
  $$('.sheet').forEach((sheet) => {
    sheet.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) close(sheet); });
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') $$('.sheet.is-open').forEach(close); });
  function close(sheet) {
    if (sheet.matches('[data-product]') && new URL(location.href).searchParams.has('p')) history.back();
    else closeSheet(sheet);
  }

  /* ---------- Data ---------- */
  let products = [];
  let settings = null;
  let filter = 'all';
  const bySlug = (s) => products.find((p) => p.slug === s);
  const byId = (id) => products.find((p) => p.id === id);

  /* ---------- Grid ---------- */
  const grid = $('[data-grid]');
  const state = $('[data-state]');
  const filters = $('[data-filters]');

  const renderFilters = () => {
    if (!filters) return;
    const cats = ['all', ...new Set(products.map((p) => p.category))];
    filters.innerHTML = cats.length > 2 ? cats.map((c) =>
      `<button type="button" class="filter" data-filter="${c}" aria-pressed="${c === filter}">${esc(t(c) || c)}</button>`).join('') : '';
  };

  const renderGrid = () => {
    if (!grid) return;
    const list = products.filter((p) => filter === 'all' || p.category === filter);
    grid.innerHTML = list.map((p, i) => `
      <li class="card" style="--i:${i}">
        <a class="card__link" href="?p=${encodeURIComponent(p.slug)}" data-open="${esc(p.slug)}">
          <span class="card__frame">
            ${p.images[0] ? `<img class="card__img" src="${esc(p.images[0])}" alt="${esc(nameOf(p))}" loading="${i < 3 ? 'eager' : 'lazy'}" decoding="async">` : '<span class="card__empty"></span>'}
            ${p.images[1] ? `<img class="card__img card__img--alt" src="${esc(p.images[1])}" alt="" loading="lazy" decoding="async">` : ''}
          </span>
          <span class="card__name">${esc(nameOf(p))}</span>
          <span class="card__price">
            ${p.compareAtCents ? `<s aria-label="${t('from')} ${money(p.compareAtCents)}">${money(p.compareAtCents)}</s>` : ''}
            <span>${money(p.priceCents)}</span>
          </span>
          ${p.soldOut ? `<span class="card__note">${t('soldOut')}</span>` : ''}
        </a>
      </li>`).join('');
    if (state) {
      state.hidden = list.length > 0;
      if (!list.length) state.textContent = t('none');
    }
  };

  filters && filters.addEventListener('click', (e) => {
    const b = e.target.closest('[data-filter]');
    if (!b) return;
    filter = b.dataset.filter;
    renderFilters();
    renderGrid();
  });

  grid && grid.addEventListener('click', (e) => {
    const a = e.target.closest('[data-open]');
    if (!a || e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    history.pushState({ p: a.dataset.open }, '', '?p=' + encodeURIComponent(a.dataset.open));
    showProduct(a.dataset.open);
  });

  /* ---------- Product sheet ---------- */
  const sheet = $('[data-product]');
  let current = null;
  let chosen = null;

  const showProduct = (slug) => {
    const p = bySlug(slug);
    if (!p || !sheet) return;
    current = p;
    chosen = p.sizes.filter((s) => s.available).length === 1 ? p.sizes.find((s) => s.available).label : null;
    renderProduct();
    if (sheet.hidden) openSheet(sheet);
  };

  const renderProduct = () => {
    const p = current;
    if (!p) return;
    $('[data-p-cat]', sheet).textContent = t(p.category) || '';
    $('[data-p-name]', sheet).textContent = nameOf(p);
    $('[data-p-price]', sheet).innerHTML = `${p.compareAtCents ? `<s>${money(p.compareAtCents)}</s> ` : ''}${money(p.priceCents)}`;
    $('[data-p-desc]', sheet).textContent = descOf(p) || '';
    const gal = $('[data-gallery]', sheet);
    if (gal.dataset.for !== p.id) {
      gal.dataset.for = p.id;
      gal.innerHTML = p.images.length ? `
        <div class="gal__main">
          <div class="gal__track" data-track>
            ${p.images.map((u, i) => `<img src="${esc(u)}" alt="${esc(nameOf(p))}${p.images.length > 1 ? ` (${i + 1}/${p.images.length})` : ''}" loading="${i ? 'lazy' : 'eager'}" decoding="async" draggable="false">`).join('')}
          </div>
          ${p.images.length > 1 ? `
            <button type="button" class="gal__nav gal__nav--prev" data-step="-1" aria-label="${lang() === 'tr' ? 'Önceki fotoğraf' : 'Vorheriges Foto'}">‹</button>
            <button type="button" class="gal__nav gal__nav--next" data-step="1" aria-label="${lang() === 'tr' ? 'Sonraki fotoğraf' : 'Nächstes Foto'}">›</button>` : ''}
        </div>
        ${p.images.length > 1 ? `<div class="gal__thumbs">${p.images.map((u, i) => `
          <button type="button" class="gal__thumb" data-go="${i}" aria-label="${i + 1}" aria-current="${i === 0}"><img src="${esc(u)}" alt="" loading="lazy" decoding="async"></button>`).join('')}</div>` : ''}`
        : '<span class="card__empty"></span>';
      galleryIndex = 0;
      const track = $('[data-track]', gal);
      if (track) {
        track.scrollLeft = 0;
        track.addEventListener('scroll', () => {
          const i = Math.round(track.scrollLeft / track.clientWidth);
          if (i !== galleryIndex) { galleryIndex = i; markThumb(); }
        }, { passive: true });
      }
    }
    $('[data-sizes]', sheet).innerHTML = p.sizes.map((s) => `
      <button type="button" class="size" data-size="${esc(s.label)}" aria-pressed="${chosen === s.label}" ${s.available ? '' : 'disabled'}>
        ${esc(s.label)}${s.available ? '' : `<span class="sr-only"> ${t('soldOut')}</span>`}
      </button>`).join('');
    const size = p.sizes.find((s) => s.label === chosen);
    $('[data-size-hint]', sheet).textContent = p.soldOut ? t('soldOut') : size && size.few ? t('few') : '';
    const add = $('[data-add]', sheet);
    add.disabled = p.soldOut;
  };

  let galleryIndex = 0;
  const markThumb = () => $$('.gal__thumb', sheet).forEach((t, i) => t.setAttribute('aria-current', String(i === galleryIndex)));
  const goTo = (i) => {
    const track = $('[data-track]', sheet);
    if (!track || !current) return;
    const n = current.images.length;
    galleryIndex = (i + n) % n;
    track.scrollTo({ left: galleryIndex * track.clientWidth, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    markThumb();
  };
  document.addEventListener('keydown', (e) => {
    if (!sheet || sheet.hidden || !current || current.images.length < 2) return;
    if (e.key === 'ArrowLeft') goTo(galleryIndex - 1);
    if (e.key === 'ArrowRight') goTo(galleryIndex + 1);
  });

  sheet && sheet.addEventListener('click', (e) => {
    const st = e.target.closest('[data-step]');
    if (st) { goTo(galleryIndex + Number(st.dataset.step)); return; }
    const go = e.target.closest('[data-go]');
    if (go) { goTo(Number(go.dataset.go)); return; }
    const b = e.target.closest('[data-size]');
    if (b && !b.disabled) { chosen = b.dataset.size; renderProduct(); }
    if (e.target.closest('[data-add]')) {
      if (!chosen) { $('[data-size-hint]', sheet).textContent = t('pickSize'); return; }
      const line = cart.find((l) => l.id === current.id && l.size === chosen);
      if (line) line.qty = Math.min(5, line.qty + 1);
      else cart.push({ id: current.id, size: chosen, qty: 1 });
      writeCart();
      updateBadge();
      renderCart();
      closeSheet(sheet);
      if (new URL(location.href).searchParams.has('p')) history.replaceState({}, '', location.pathname);
      window.setTimeout(() => openSheet(cartSheet), 250);
    }
  });

  window.addEventListener('popstate', () => {
    const slug = new URL(location.href).searchParams.get('p');
    if (slug) showProduct(slug);
    else closeSheet(sheet);
  });

  /* ---------- Cart sheet ---------- */
  const cartSheet = $('[data-cart]');
  const list = $('[data-cart-list]');

  const renderCart = () => {
    if (!list) return;
    cart = cart.filter((l) => byId(l.id) || !products.length);
    const lines = cart.map((l) => ({ ...l, p: byId(l.id) })).filter((l) => l.p);
    list.innerHTML = lines.length ? lines.map((l, i) => `
      <li class="line">
        ${l.p.images[0] ? `<img class="line__img" src="${esc(l.p.images[0])}" alt="" loading="lazy">` : '<span class="line__img"></span>'}
        <div class="line__body">
          <p class="line__name">${esc(nameOf(l.p))}</p>
          <p class="line__meta">${t('size')} ${esc(l.size)}</p>
          <div class="line__qty" role="group" aria-label="${t('qty')}">
            <button type="button" data-qty="${i}" data-d="-1" aria-label="${t('less')}"><svg class="icon" aria-hidden="true"><use href="#i-minus"/></svg></button>
            <span>${l.qty}</span>
            <button type="button" data-qty="${i}" data-d="1" aria-label="${t('more')}" ${l.qty >= 5 ? 'disabled' : ''}><svg class="icon" aria-hidden="true"><use href="#i-plus"/></svg></button>
          </div>
        </div>
        <div class="line__end">
          <p class="line__price">${money(l.p.priceCents * l.qty)}</p>
          <button type="button" class="line__remove" data-remove="${i}">${t('remove')}</button>
        </div>
      </li>`).join('') : `<li class="cart__empty">${t('empty')}</li>`;

    const subtotal = lines.reduce((n, l) => n + l.p.priceCents * l.qty, 0);
    $('[data-subtotal]').textContent = money(subtotal);
    const notes = [];
    if (settings) {
      if (settings.allowPickup) notes.push(t('pickup'));
      if (settings.allowShipping) {
        const free = settings.freeShippingFromCents > 0 && subtotal >= settings.freeShippingFromCents;
        notes.push(t('ship', free ? money(0) : money(settings.shippingCents)));
        if (settings.freeShippingFromCents > 0 && !free) notes.push(t('freeFrom', money(settings.freeShippingFromCents)));
      }
      if (!settings.checkoutEnabled) notes.push(t('checkoutOff'));
    }
    $('[data-ship-note]').textContent = notes.join(' ');
    $('[data-checkout]').disabled = !lines.length || (settings && !settings.checkoutEnabled);
  };

  cartSheet && cartSheet.addEventListener('click', (e) => {
    const q = e.target.closest('[data-qty]');
    const r = e.target.closest('[data-remove]');
    if (q) {
      const l = cart[Number(q.dataset.qty)];
      l.qty = Math.max(0, Math.min(5, l.qty + Number(q.dataset.d)));
      if (!l.qty) cart.splice(Number(q.dataset.qty), 1);
    }
    if (r) cart.splice(Number(r.dataset.remove), 1);
    if (q || r) { writeCart(); updateBadge(); renderCart(); }
  });

  $$('[data-cart-open]').forEach((b) => b.addEventListener('click', () => {
    if (!cartSheet) { location.href = 'shop.html?warenkorb=1'; return; }
    renderCart(); openSheet(cartSheet);
  }));

  const checkoutBtn = $('[data-checkout]');
  checkoutBtn && checkoutBtn.addEventListener('click', async () => {
    const err = $('[data-cart-error]');
    err.hidden = true;
    checkoutBtn.disabled = true;
    const label = checkoutBtn.innerHTML;
    checkoutBtn.textContent = t('redirect');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ items: cart.map(({ id, size, qty }) => ({ id, size, qty })), lang: lang() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) throw new Error(data.error || t('checkoutError'));
      location.href = data.url;
    } catch (e2) {
      err.textContent = e2.message || t('checkoutError');
      err.hidden = false;
      checkoutBtn.innerHTML = label;
      checkoutBtn.disabled = false;
    }
  });

  /* ---------- Thank-you page ---------- */
  const thanks = $('[data-thanks]');
  const showThanks = async (tries = 0) => {
    const id = new URL(location.href).searchParams.get('session_id');
    if (!id) { thanks.innerHTML = `<p class="lead">${t('unknown')}</p>`; return; }
    try {
      const o = await (await fetch('/api/order?session_id=' + encodeURIComponent(id))).json();
      if (o.status === 'paid' || o.status === 'shipped' || o.status === 'picked_up') {
        cart = []; writeCart(); updateBadge();
        thanks.innerHTML = `<p class="lead">${esc(t('paid', o.number))}</p>
          <ul class="danke__items" role="list">${o.items.map((i) => `<li>${i.qty}× ${esc(i.name)} · ${t('size')} ${esc(i.size)}</li>`).join('')}</ul>
          <p class="danke__total">${t('total')}: ${money(o.totalCents)}</p>`;
      } else if (o.status === 'awaiting_payment') {
        cart = []; writeCart(); updateBadge();
        thanks.innerHTML = `<p class="lead">${esc(t('waiting', o.number))}</p>`;
      } else if (tries < 8) {
        thanks.innerHTML = `<p class="lead">${t('processing')}</p>`;
        window.setTimeout(() => showThanks(tries + 1), 2000);
      } else {
        thanks.innerHTML = `<p class="lead">${t('processing')}</p>`;
      }
    } catch {
      thanks.innerHTML = `<p class="lead">${t('processing')}</p>`;
    }
  };

  /* ---------- Boot ---------- */
  const load = async () => {
    if (grid && state) { state.hidden = false; state.textContent = t('loading'); }
    try {
      const [pr, st] = await Promise.all([fetch('/api/products'), fetch('/api/settings')]);
      if (!pr.ok) throw new Error();
      products = await pr.json();
      settings = st.ok ? await st.json() : null;
    } catch {
      if (state) { state.hidden = false; state.textContent = t('loadError'); }
      return;
    }
    renderFilters();
    renderGrid();
    renderCart();
    const params = new URL(location.href).searchParams;
    if (params.get('p')) showProduct(params.get('p'));
    if (params.has('warenkorb')) { history.replaceState({}, '', location.pathname); openSheet(cartSheet); }
  };

  updateBadge();
  if (thanks) showThanks();
  if (grid || cartSheet) load();

  // Re-render dynamic text when the visitor switches DE/TR.
  new MutationObserver(() => {
    renderFilters(); renderGrid(); renderCart(); renderProduct();
    if (thanks) showThanks(8);
  }).observe(root, { attributes: true, attributeFilter: ['lang'] });
})();
