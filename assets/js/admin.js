/* PARLA Yönetim: products, photos, stock, orders and shipping settings. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const money = (c) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format((c || 0) / 100);
  const toCents = (v) => {
    const s = String(v || '').trim().replace(/\s|€/g, '');
    if (!s) return 0;
    const n = Number(s.includes(',') ? s.replace(/\./g, '').replace(',', '.') : s);
    return Number.isFinite(n) ? Math.round(n * 100) : NaN;
  };
  const fromCents = (c) => (c ? (c / 100).toFixed(2).replace('.', ',') : '');
  const CAT = { anzug: 'Takım', hochzeit: 'Damatlık', sakko: 'Ceket', hose: 'Pantolon', hemd: 'Gömlek', accessoires: 'Aksesuar' };
  const STATUS = { awaiting_payment: 'Ödeme bekleniyor', paid: 'Ödendi – hazırlanacak', shipped: 'Kargoya verildi', picked_up: 'Teslim alındı', cancelled: 'İptal' };

  const api = async (path, opts = {}) => {
    const res = await fetch(path, { credentials: 'same-origin', ...opts });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) { showLogin(); throw new Error('Oturum kapandı, lütfen tekrar giriş yapın.'); }
    if (!res.ok) throw new Error(data.error || 'Bir hata oluştu.');
    return data;
  };
  const sendJson = (path, method, body) => api(path, { method, headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });

  /* ---------- Login ---------- */
  const loginView = $('[data-login]');
  const appView = $('[data-app]');
  const showLogin = () => { appView.hidden = true; loginView.hidden = false; $('#pw').focus(); };
  const showApp = () => { loginView.hidden = true; appView.hidden = false; loadAll(); };

  $('[data-login-form]').addEventListener('submit', async (e) => {
    e.preventDefault();
    const err = $('[data-login-err]');
    err.hidden = true;
    const btn = e.target.querySelector('button');
    btn.disabled = true;
    try {
      await sendJson('/api/admin/session', 'POST', { password: e.target.password.value });
      e.target.reset();
      showApp();
    } catch (x) {
      err.textContent = x.message === 'Falsches Passwort.' ? 'Şifre yanlış.' : x.message;
      err.hidden = false;
    } finally { btn.disabled = false; }
  });
  $('[data-logout]').addEventListener('click', async () => { await fetch('/api/admin/session', { method: 'DELETE' }); showLogin(); });

  /* ---------- Tabs ---------- */
  $$('[data-tab]').forEach((b) => b.addEventListener('click', () => {
    $$('[data-tab]').forEach((x) => x.setAttribute('aria-selected', String(x === b)));
    $$('[data-panel]').forEach((p) => { p.hidden = p.dataset.panel !== b.dataset.tab; });
    if (b.dataset.tab === 'orders') loadOrders();
  }));

  /* ---------- Products ---------- */
  let products = [];
  const plist = $('[data-plist]');
  const renderProducts = () => {
    const q = ($('[data-search]').value || '').toLowerCase();
    const list = products.filter((p) => !q || (p.name.de + ' ' + p.name.tr).toLowerCase().includes(q));
    plist.innerHTML = list.length ? list.map((p) => {
      const stock = p.sizes.reduce((n, s) => n + s.stock, 0);
      return `<li>
        <button type="button" class="prow" data-edit="${p.id}">
          ${p.images[0] ? `<img src="${esc(p.images[0])}" alt="">` : '<span class="noimg">Foto yok</span>'}
          <span class="prow__main">
            <strong>${esc(p.name.de)}</strong>
            <span class="muted">${esc(CAT[p.category] || p.category)} · ${p.sizes.map((s) => `${esc(s.label)}:${s.stock}`).join('  ') || 'beden yok'}</span>
          </span>
          <span class="prow__end">
            <strong>${money(p.priceCents)}</strong>
            <span class="tag ${p.published ? 'tag--on' : ''}">${p.published ? 'Yayında' : 'Taslak'}</span>
            ${stock === 0 ? '<span class="tag tag--warn">Stok yok</span>' : ''}
          </span>
        </button>
      </li>`;
    }).join('') : `<li class="empty">${products.length ? 'Sonuç yok.' : 'Henüz ürün yok. “+ Yeni ürün” ile ilk takımı ekleyin.'}</li>`;
  };
  $('[data-search]').addEventListener('input', renderProducts);
  plist.addEventListener('click', (e) => {
    const b = e.target.closest('[data-edit]');
    if (b) openEditor(products.find((p) => p.id === b.dataset.edit));
  });

  /* ---------- Editor ---------- */
  const dlg = $('[data-editor]');
  const form = $('[data-form]');
  let editing = null;
  let images = [];
  let sizes = [];

  const renderImages = () => {
    $('[data-images]').innerHTML = images.map((u, i) => `
      <figure class="img">
        ${u.startsWith('uploading:') ? '<span class="img__wait">Yükleniyor…</span>' : `<img src="${esc(u)}" alt="">`}
        <div class="img__tools">
          <button type="button" data-move="${i}" data-d="-1" ${i === 0 ? 'disabled' : ''} aria-label="Sola">←</button>
          <button type="button" data-del-img="${i}" aria-label="Sil">×</button>
          <button type="button" data-move="${i}" data-d="1" ${i === images.length - 1 ? 'disabled' : ''} aria-label="Sağa">→</button>
        </div>
        ${i === 0 ? '<span class="img__cover">Kapak</span>' : ''}
      </figure>`).join('');
  };
  const renderSizes = () => {
    $('[data-sizes]').innerHTML = sizes.map((s, i) => `
      <div class="size">
        <input aria-label="Beden" value="${esc(s.label)}" data-size-label="${i}" placeholder="50">
        <input aria-label="Stok" type="number" min="0" max="9999" value="${s.stock}" data-size-stock="${i}">
        <button type="button" data-del-size="${i}" aria-label="Bedeni sil">×</button>
      </div>`).join('') || '<p class="hint">Beden ekleyin. Stok 0 olan beden mağazada “tükendi” görünür.</p>';
  };

  const openEditor = (p) => {
    editing = p || null;
    images = p ? [...p.images] : [];
    sizes = p ? p.sizes.map((s) => ({ ...s })) : [];
    form.reset();
    $('[data-editor-title]').textContent = p ? 'Ürünü düzenle' : 'Yeni ürün';
    $('[data-delete]').hidden = !p;
    $('[data-form-err]').hidden = true;
    if (p) {
      form.nameDe.value = p.name.de; form.nameTr.value = p.name.tr || '';
      form.category.value = p.category;
      form.price.value = fromCents(p.priceCents); form.compare.value = fromCents(p.compareAtCents);
      form.descDe.value = p.description.de || ''; form.descTr.value = p.description.tr || '';
      form.published.checked = p.published; form.featured.checked = p.featured;
    } else {
      form.published.checked = true;
    }
    renderImages(); renderSizes();
    dlg.showModal();
  };
  $('[data-new]').addEventListener('click', () => openEditor(null));
  $$('[data-cancel]').forEach((b) => b.addEventListener('click', () => dlg.close()));

  $('[data-sizes]').addEventListener('input', (e) => {
    const l = e.target.dataset.sizeLabel; const s = e.target.dataset.sizeStock;
    if (l != null) sizes[l].label = e.target.value;
    if (s != null) sizes[s].stock = Math.max(0, Math.floor(Number(e.target.value) || 0));
  });
  $('[data-sizes]').addEventListener('click', (e) => {
    const d = e.target.closest('[data-del-size]');
    if (d) { sizes.splice(Number(d.dataset.delSize), 1); renderSizes(); }
  });
  $('[data-add-size]').addEventListener('click', () => { sizes.push({ label: '', stock: 1 }); renderSizes(); $$('[data-size-label]').pop()?.focus(); });
  $$('[data-preset]').forEach((b) => b.addEventListener('click', () => {
    const have = new Set(sizes.map((s) => s.label));
    b.dataset.preset.split(',').forEach((l) => { if (!have.has(l)) sizes.push({ label: l, stock: 0 }); });
    renderSizes();
  }));

  $('[data-images]').addEventListener('click', (e) => {
    const m = e.target.closest('[data-move]'); const d = e.target.closest('[data-del-img]');
    if (m) { const i = Number(m.dataset.move); const j = i + Number(m.dataset.d); [images[i], images[j]] = [images[j], images[i]]; renderImages(); }
    if (d) { images.splice(Number(d.dataset.delImg), 1); renderImages(); }
  });

  // Resize on the phone before upload: max 1800px, JPEG ~85%. Keeps uploads fast and under the size limit.
  const shrink = (file) => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, 1800 / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      c.toBlob((b) => (b ? resolve(b) : reject(new Error('Fotoğraf işlenemedi.'))), 'image/jpeg', 0.85);
      URL.revokeObjectURL(img.src);
    };
    img.onerror = () => reject(new Error('Fotoğraf okunamadı.'));
    img.src = URL.createObjectURL(file);
  });

  $('[data-files]').addEventListener('change', async (e) => {
    const files = [...e.target.files];
    e.target.value = '';
    const err = $('[data-form-err]');
    for (const f of files) {
      const token = 'uploading:' + Math.random();
      images.push(token); renderImages();
      try {
        const blob = await shrink(f);
        const { url } = await api('/api/admin/upload', { method: 'POST', headers: { 'content-type': 'image/jpeg' }, body: blob });
        images[images.indexOf(token)] = url;
      } catch (x) {
        images.splice(images.indexOf(token), 1);
        err.textContent = x.message; err.hidden = false;
      }
      renderImages();
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const err = $('[data-form-err]');
    err.hidden = true;
    if (images.some((u) => u.startsWith('uploading:'))) { err.textContent = 'Fotoğraflar hâlâ yükleniyor.'; err.hidden = false; return; }
    const price = toCents(form.price.value);
    const compare = toCents(form.compare.value);
    if (!price || Number.isNaN(price)) { err.textContent = 'Geçerli bir fiyat girin (örn. 349,00).'; err.hidden = false; return; }
    const body = {
      id: editing?.id,
      name: { de: form.nameDe.value, tr: form.nameTr.value },
      description: { de: form.descDe.value, tr: form.descTr.value },
      category: form.category.value,
      priceCents: price,
      compareAtCents: Number.isNaN(compare) ? 0 : compare,
      images,
      sizes: sizes.filter((s) => s.label.trim()),
      published: form.published.checked,
      featured: form.featured.checked,
      sort: editing?.sort ?? 0,
    };
    const btn = $('[data-save]');
    btn.disabled = true; btn.textContent = 'Kaydediliyor…';
    try {
      await sendJson('/api/admin/products', 'POST', body);
      dlg.close();
      await loadProducts();
    } catch (x) { err.textContent = x.message; err.hidden = false; }
    finally { btn.disabled = false; btn.textContent = 'Kaydet'; }
  });

  $('[data-delete]').addEventListener('click', async () => {
    if (!editing || !confirm(`“${editing.name.de}” silinsin mi? Bu geri alınamaz.`)) return;
    try {
      await api('/api/admin/products?id=' + encodeURIComponent(editing.id), { method: 'DELETE' });
      dlg.close();
      await loadProducts();
    } catch (x) { const err = $('[data-form-err]'); err.textContent = x.message; err.hidden = false; }
  });

  /* ---------- Orders ---------- */
  const olist = $('[data-olist]');
  const loadOrders = async () => {
    olist.innerHTML = '<li class="empty">Yükleniyor…</li>';
    try {
      const { orders } = await api('/api/admin/orders');
      const open = orders.filter((o) => o.status === 'paid').length;
      const pill = $('[data-new-orders]'); pill.textContent = open; pill.hidden = !open;
      olist.innerHTML = orders.length ? orders.map((o) => `
        <li class="card order">
          <div class="order__head">
            <strong>${esc(o.number)}</strong>
            <span class="muted">${new Date(o.createdAt).toLocaleString('de-DE')}</span>
            <strong>${money(o.totalCents)}</strong>
            <select data-status="${esc(o.id)}" aria-label="Durum">
              ${Object.entries(STATUS).map(([k, v]) => `<option value="${k}" ${o.status === k ? 'selected' : ''}>${v}</option>`).join('')}
            </select>
          </div>
          ${o.stockIssue ? '<p class="warn">Dikkat: sipariş anında stok yetersizdi. Lütfen kontrol edin.</p>' : ''}
          <ul class="order__items">${o.items.map((i) => `<li>${i.qty}× ${esc(i.name)} · Beden ${esc(i.size)} · ${money(i.unitCents * i.qty)}</li>`).join('')}</ul>
          <p class="muted">${esc(o.shippingMethod || '')}${o.shippingCents ? ' · ' + money(o.shippingCents) : ''}</p>
          <p>${esc(o.customer?.name || '')} · <a href="mailto:${esc(o.customer?.email || '')}">${esc(o.customer?.email || '')}</a> ${o.customer?.phone ? '· <a href="tel:' + esc(o.customer.phone) + '">' + esc(o.customer.phone) + '</a>' : ''}</p>
          ${o.address ? `<p class="muted">${esc([o.address.name, o.address.line1, o.address.line2, [o.address.postal_code, o.address.city].filter(Boolean).join(' '), o.address.country].filter(Boolean).join(', '))}</p>` : ''}
        </li>`).join('') : '<li class="empty">Henüz sipariş yok.</li>';
    } catch (x) { olist.innerHTML = `<li class="empty">${esc(x.message)}</li>`; }
  };
  olist.addEventListener('change', async (e) => {
    const s = e.target.closest('[data-status]');
    if (!s) return;
    try { await sendJson('/api/admin/orders', 'PATCH', { id: s.dataset.status, status: s.value }); } catch (x) { alert(x.message); }
  });
  $('[data-reload-orders]').addEventListener('click', loadOrders);

  /* ---------- Settings ---------- */
  const sform = $('[data-settings-form]');
  const loadSettings = async () => {
    const { settings, setup } = await api('/api/admin/settings');
    sform.allowPickup.checked = settings.allowPickup;
    sform.allowShipping.checked = settings.allowShipping;
    sform.shipping.value = fromCents(settings.shippingCents) || '0';
    sform.freeFrom.value = fromCents(settings.freeShippingFromCents) || '0';
    const item = (ok, text) => `<li class="${ok ? 'ok' : 'no'}">${ok ? '✓' : '✗'} ${text}</li>`;
    $('[data-setup-list]').innerHTML = `<h2>Kurulum durumu</h2><ul class="setup">
      ${item(setup.database, 'Veritabanı (Upstash Redis)')}
      ${item(setup.images, 'Fotoğraf deposu (Vercel Blob)')}
      ${item(setup.stripe, 'Stripe anahtarı' + (setup.testMode ? ' (TEST modu)' : ''))}
      ${item(setup.webhook, 'Stripe webhook')}
    </ul><p class="hint">Eksik olanların kurulumu README'deki “Shop kurulumu” bölümünde adım adım anlatılıyor.</p>`;
    const missing = !setup.database || !setup.images || !setup.stripe || !setup.webhook;
    const n = $('[data-setup]');
    n.hidden = !missing && !setup.testMode;
    n.textContent = missing ? 'Kurulum tamamlanmadı: Ayarlar sekmesinde eksikleri görebilirsiniz.' : 'Stripe TEST modunda: gerçek ödeme alınmıyor.';
  };
  sform.addEventListener('submit', async (e) => {
    e.preventDefault();
    await sendJson('/api/admin/settings', 'POST', {
      allowPickup: sform.allowPickup.checked, allowShipping: sform.allowShipping.checked,
      shippingCents: toCents(sform.shipping.value) || 0, freeShippingFromCents: toCents(sform.freeFrom.value) || 0,
    });
    const ok = $('[data-settings-ok]'); ok.hidden = false; setTimeout(() => { ok.hidden = true; }, 2000);
  });

  /* ---------- Boot ---------- */
  const loadProducts = async () => { products = (await api('/api/admin/products')).products; renderProducts(); };
  async function loadAll() {
    try { await Promise.all([loadProducts(), loadSettings()]); loadOrders(); } catch (x) { console.error(x); }
  }
  fetch('/api/admin/session').then((r) => r.json()).then((s) => (s.loggedIn ? showApp() : showLogin())).catch(showLogin);
})();
