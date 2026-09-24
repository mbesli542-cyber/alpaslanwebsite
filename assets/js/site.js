/* PARLA Herrenmode: language switch, curtain, mirror, photo slots, menu, dock. */
(() => {
  'use strict';

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  /* ---------- Language (German is in the HTML, Turkish lives here) ---------- */
  const TR = {
    skip: 'İçeriğe geç',
    homeLabel: 'PARLA Herrenmode, sayfa başına dön',
    navLabel: 'Ana menü',
    navSuits: 'Takımlar',
    navWedding: 'Düğün',
    navAdvice: 'Danışmanlık',
    navVisit: 'Ziyaret',
    langLabel: 'Dil seçin',
    call: 'Ara',
    menuOpen: 'Menüyü aç',
    menuClose: 'Menüyü kapat',
    menuLabel: 'Menü',
    walkerLabel: 'Gri kruvaze takımlı bir adam prova aynasının önüne geliyor',
    shopTitle: 'Mağazadan, size.',
    shopLead: 'Mannheim’daki mağazamızdan takım elbise ve damatlıklar. Online sipariş verin, kargoyla gelsin ya da F1 8’den teslim alın.',
    filterLabel: 'Kategori',
    vatNote: 'Tüm fiyatlara KDV dahildir, ayrıca',
    shippingLink: 'kargo ücreti',
    close: 'Kapat',
    chooseSize: 'Beden seçin',
    addToCart: 'Sepete ekle',
    sizeHelp: 'Bedeninizden emin değil misiniz? Size seve seve yardımcı oluruz.',
    cartTitle: 'Sepet',
    cartLabel: 'Sepet',
    subtotal: 'Ara toplam',
    checkout: 'Ödemeye geç',
    secure: 'Stripe ile güvenli ödeme: kart, PayPal, Klarna, Apple Pay, Google Pay.',
    thanksTitle: 'Siparişiniz için teşekkür ederiz.',
    thanksLoading: 'Ödeme kontrol ediliyor …',
    thanksMail: 'Onay e-postası alacaksınız. Sorularınız için: <a href="tel:+4962143728859">0621 43728859</a>.',
    backToShop: 'Mağazaya dön',
    heroTitle: 'Tam size<br>göre takım.',
    heroLead: 'Mannheim’da erkek giyimi. İş, davet ve düğün için birebir danışmanlık, Quadrate’nin tam ortasında.',
    route: 'Yol tarifi',
    routeShort: 'Yol tarifi',
    altSide: 'Aynada yandan görünen takım',
    altFront: 'Prova kabini aynasında önden görünen takım',
    altBack: 'Aynada arkadan görünen takım',
    suitsTitle: 'Her duruma uygun takım elbise',
    suitsLead: 'İlk iş gününüzden kendi düğününüze kadar: Siz ne için olduğunu söyleyin, biz size yakışanı gösterelim.',
    altBusiness: 'İş takımı',
    suitBusiness: 'İş',
    suitBusinessText: 'Ofis, müşteri toplantısı ve iş görüşmesi için.',
    altOccasion: 'Davet ve özel gün takımı',
    suitOccasion: 'Davet &amp; Özel gün',
    suitOccasionText: 'Düğün daveti, nişan, mezuniyet balosu ve bayramlar için.',
    altWeddingSuit: 'Damatlık takım',
    suitWedding: 'Damatlık',
    suitWeddingText: 'Damat ve yakınları için.',
    altGroom: 'Damatlık takım giymiş damat',
    weddingTitle: 'Herkesin size bakacağı o gün için.',
    weddingLead: 'Nikâh, düğün ya da kına gecesi: Damadı, sağdıcı ve ailenin erkeklerini birbirine uyumlu giydiriyoruz. En iyisi birlikte gelin.',
    bringTitle: 'Gelmeden önce hazırlayın',
    bring1: 'Düğün tarihiniz',
    bring2: 'Düğünün renkleri ya da teması',
    bring3: 'Aldıysanız ayakkabılarınız',
    adviceTitle: 'Danışmanlık nasıl işler',
    beat1: 'İçeri girin.',
    beat1Note: 'Mannheim’ın tam ortasında, F1 8’de.',
    beat2: 'Ne istediğinizi söyleyin.',
    beat2Note: 'Davet, tarz, bütçe. Sizi dinliyor ve dürüstçe öneriyoruz.',
    beat3: 'Tam oturan takımla çıkın.',
    beat3Note: 'Deneyin, karar verin, hazırsınız.',
    reviewsTitle: 'Google’da 5 üzerinden 4,8',
    starsLabel: '5 üzerinden 4,8 yıldız',
    reviewsCount: '46 değerlendirme. Üçü, orijinal Almanca hâliyle:',
    reviewsAll: 'Tüm yorumlar Google’da',
    quoteSource: 'Google yorumu',
    visitTitle: 'Bizi F1 8’de ziyaret edin.',
    factAddress: 'Adres',
    copy: 'Adresi kopyala',
    copied: 'Kopyalandı',
    factPhone: 'Telefon',
    factHours: 'Çalışma saatleri',
    hoursLink: 'Güncel saatler Google’da',
    altShop: 'PARLA Herrenmode’un F1 8’deki mağazası',
    socialLead: 'Mağazadan kareler Instagram ve TikTok’ta.',
    legalLabel: 'Yasal bilgiler',
    privacy: 'Gizlilik',
  };

  const META = {
    tr: {
      title: 'PARLA Herrenmode Mannheim | F1 8’de takım elbise ve damatlık',
      description: 'Mannheim F1 8’deki PARLA Herrenmode: iş, davet ve düğün için takım elbise, birebir danışmanlık. Google’da 4,8 yıldız. Hemen arayın: 0621 43728859.',
    },
  };

  const textNodes = document.querySelectorAll('[data-i18n]');
  const attrNodes = document.querySelectorAll('[data-i18n-attr]');
  const metaDescription = document.querySelector('meta[name="description"]');
  const langButtons = document.querySelectorAll('[data-lang]');

  const parseAttrSpec = (el) =>
    el.dataset.i18nAttr.split(';').map((pair) => {
      const [attr, key] = pair.split(':');
      return { attr: attr.trim(), key: key.trim() };
    });

  // Capture the German originals from the document itself.
  const DE = {};
  textNodes.forEach((el) => {
    if (!(el.dataset.i18n in DE)) DE[el.dataset.i18n] = el.innerHTML;
  });
  attrNodes.forEach((el) => {
    parseAttrSpec(el).forEach(({ attr, key }) => {
      if (!(key in DE)) DE[key] = el.getAttribute(attr);
    });
  });
  META.de = { title: document.title, description: metaDescription ? metaDescription.content : '' };

  let currentLang = 'de';

  const applyLang = (lang) => {
    const dict = lang === 'tr' ? TR : DE;
    textNodes.forEach((el) => {
      const value = dict[el.dataset.i18n];
      if (value != null) el.innerHTML = value;
    });
    attrNodes.forEach((el) => {
      parseAttrSpec(el).forEach(({ attr, key }) => {
        const value = dict[key];
        if (value != null) el.setAttribute(attr, value);
      });
    });
    root.lang = lang;
    document.title = META[lang].title;
    if (metaDescription) metaDescription.content = META[lang].description;
    langButtons.forEach((btn) => btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang)));
    currentLang = lang;
  };

  const setLang = (lang, animate) => {
    if (lang === currentLang) return;
    try { localStorage.setItem('parla-lang', lang); } catch (e) { /* private mode */ }
    if (!animate || reduceMotion.matches) {
      applyLang(lang);
      return;
    }
    root.classList.add('is-switching');
    window.setTimeout(() => {
      applyLang(lang);
      requestAnimationFrame(() => root.classList.remove('is-switching'));
    }, 180);
  };

  langButtons.forEach((btn) => btn.addEventListener('click', () => setLang(btn.dataset.lang, true)));

  if (root.getAttribute('data-lang-pending') === 'tr') applyLang('tr');
  root.removeAttribute('data-lang-pending');

  /* ---------- Photo slots: files in images/ replace the material ---------- */
  document.querySelectorAll('.slot').forEach((slot) => {
    const img = slot.querySelector('.slot__img');
    if (!img) return;
    const loaded = () => img.classList.add('is-loaded');
    const missing = () => slot.classList.add('is-empty');
    if (img.complete) {
      if (img.naturalWidth > 0) loaded();
      else if (img.currentSrc || img.src) missing();
    } else {
      img.addEventListener('load', loaded, { once: true });
      img.addEventListener('error', missing, { once: true });
    }
  });

  /* ---------- Curtain: opens once per session ---------- */
  const triptych = document.querySelector('[data-mirror]');

  if (root.classList.contains('curtain-closed')) {
    const openCurtain = () => {
      if (triptych) triptych.classList.add('is-lit');
      root.classList.remove('curtain-closed');
      try { sessionStorage.setItem('parla-curtain', '1'); } catch (e) { /* private mode */ }
    };
    const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    const timeout = new Promise((resolve) => window.setTimeout(resolve, 900));
    Promise.race([fontsReady, timeout]).then(() => window.setTimeout(openCurtain, 280));
  }

  /* ---------- Mirror sheen follows the pointer ---------- */
  const hero = document.querySelector('.hero');
  if (hero && triptych && finePointer.matches && !reduceMotion.matches) {
    let target = 0;
    let current = 0;
    let frame = 0;
    const tick = () => {
      current += (target - current) * 0.08;
      triptych.style.setProperty('--mx', current.toFixed(3));
      frame = Math.abs(target - current) > 0.001 ? requestAnimationFrame(tick) : 0;
    };
    hero.addEventListener('pointermove', (event) => {
      const rect = hero.getBoundingClientRect();
      target = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      if (!frame) frame = requestAnimationFrame(tick);
    });
    hero.addEventListener('pointerleave', () => {
      target = 0;
      if (!frame) frame = requestAnimationFrame(tick);
    });
  }

  /* ---------- Garments swing once when the rail comes into view ---------- */
  const garments = document.querySelector('[data-swing]');
  if (garments && 'IntersectionObserver' in window && !reduceMotion.matches) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          garments.classList.add('is-in');
          io.disconnect();
        }
      });
    }, { threshold: 0.35 });
    io.observe(garments);
  }

  /* ---------- Nav turns solid once the page moves ---------- */
  const nav = document.querySelector('[data-nav]');
  const sentinel = document.querySelector('[data-nav-sentinel]');
  if (nav && sentinel && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      nav.classList.toggle('is-solid', !entry.isIntersecting);
    }).observe(sentinel);
  }

  /* ---------- Mobile dock appears once the hero actions are gone ---------- */
  const dock = document.querySelector('[data-dock]');
  const heroActions = document.querySelector('[data-hero-actions]');
  const setDock = (visible) => {
    if (!dock) return;
    dock.classList.toggle('is-visible', visible);
    dock.setAttribute('aria-hidden', String(!visible));
    dock.querySelectorAll('a').forEach((a) => (visible ? a.removeAttribute('tabindex') : a.setAttribute('tabindex', '-1')));
  };
  if (dock && heroActions && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(([entry]) => {
      setDock(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    io.observe(heroActions);
  }

  /* ---------- Menu ---------- */
  const menu = document.querySelector('[data-menu]');
  const openBtn = document.querySelector('[data-menu-open]');
  const closeBtn = document.querySelector('[data-menu-close]');

  const openMenu = () => {
    if (!menu) return;
    menu.hidden = false;
    void menu.offsetWidth; // commit the hidden state before transitioning in
    menu.classList.add('is-open');
    openBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    const first = menu.querySelector('.menu__links a');
    if (first) first.focus({ preventScroll: true });
  };
  const closeMenu = (returnFocus) => {
    if (!menu || menu.hidden) return;
    menu.classList.remove('is-open');
    openBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    const hide = () => { if (!menu.classList.contains('is-open')) menu.hidden = true; };
    if (reduceMotion.matches) window.setTimeout(hide, 200);
    else menu.addEventListener('transitionend', hide, { once: true });
    if (returnFocus) openBtn.focus();
  };

  if (menu && openBtn && closeBtn) {
    openBtn.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', () => closeMenu(true));
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => closeMenu(false)));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu(true);
    });
  }

  /* ---------- Copy address ---------- */
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    let timer = 0;
    btn.addEventListener('click', async () => {
      const text = btn.dataset.copy;
      try {
        await navigator.clipboard.writeText(text);
      } catch (e) {
        const area = document.createElement('textarea');
        area.value = text;
        area.setAttribute('readonly', '');
        area.style.position = 'fixed';
        area.style.opacity = '0';
        document.body.appendChild(area);
        area.select();
        try { document.execCommand('copy'); } catch (err) { /* nothing else to try */ }
        area.remove();
      }
      btn.classList.add('is-done');
      window.clearTimeout(timer);
      timer = window.setTimeout(() => btn.classList.remove('is-done'), 2200);
    });
  });
})();

/* ---------- The walk-in: after the curtain opens he walks onto the stage, stops in front of the mirrors ---------- */
(() => {
  'use strict';
  const walker = document.querySelector('[data-walker]');
  const triptych = document.querySelector('[data-mirror]');
  if (!walker || !triptych) return;
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ua = navigator.userAgent;
  // WebKit (Safari, every iOS browser) cannot draw transparent VP9 video, so it gets an animated WebP.
  const webkit = /iP(hone|ad|od)/.test(ua) || (/Safari/.test(ua) && !/Chrome|Chromium|Edg|Android/.test(ua));

  const reflect = () => triptych.classList.add('is-reflecting');
  const settle = () => { walker.classList.add('is-standing'); reflect(); };

  const still = () => {
    const img = new Image();
    img.src = 'videos/yuruyus-son.webp';
    img.alt = '';
    img.className = 'walker__media';
    walker.appendChild(img);
    walker.classList.add('is-on');
    settle();
  };

  const walk = () => {
    walker.classList.add('is-on');
    if (reduce) { still(); return; }
    if (webkit) {
      const img = new Image();
      img.alt = '';
      img.className = 'walker__media';
      img.src = 'videos/yuruyus.webp?play=' + Date.now(); // a fresh copy so the one-shot animation restarts
      walker.appendChild(img);
      window.setTimeout(reflect, 1700);
      window.setTimeout(settle, 5200);
      return;
    }
    const v = document.createElement('video');
    v.className = 'walker__media';
    v.muted = true; v.playsInline = true; v.preload = 'auto';
    v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('aria-hidden', 'true');
    v.src = 'videos/yuruyus.webm';
    walker.appendChild(v);
    v.addEventListener('timeupdate', () => { if (v.currentTime > 1.7) reflect(); });
    v.addEventListener('ended', settle, { once: true });
    v.addEventListener('error', () => { v.remove(); still(); }, { once: true });
    const r = v.play();
    if (r && r.catch) r.catch(() => { v.remove(); still(); });
  };

  // Start as the curtain finishes opening; with no curtain, start almost at once.
  if (root.classList.contains('curtain-closed')) {
    const mo = new MutationObserver(() => {
      if (!root.classList.contains('curtain-closed')) { mo.disconnect(); window.setTimeout(walk, 800); }
    });
    mo.observe(root, { attributes: true, attributeFilter: ['class'] });
  } else {
    window.setTimeout(walk, 300);
  }
})();
