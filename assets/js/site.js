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

/* ---------- Turning model: the man turns in the fitting room, all three mirrors follow ---------- */
(() => {
  'use strict';
  const triptych = document.querySelector('[data-mirror]');
  if (!triptych) return;
  const panels = [
    { el: triptych.querySelector('.glass--left'), offset: 1 },
    { el: triptych.querySelector('.glass--center'), offset: 0 },
    { el: triptych.querySelector('.glass--right'), offset: 3 },
  ];
  const originals = panels.map((p) => p.el && p.el.querySelector('.slot__img'));
  if (originals.some((img) => !img)) return;

  // front, turn to one side, back, turn to the other side (the side shot mirrored)
  const POSES = [
    { src: originals[1].getAttribute('src') },
    { src: originals[0].getAttribute('src') },
    { src: originals[2].getAttribute('src') },
    { src: originals[0].getAttribute('src'), flip: true },
  ];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  let pose = 0;
  let layers = [];
  let timer = 0;
  let resumeTimer = 0;
  let visible = true;

  const show = (next, dir = 1) => {
    pose = (next + POSES.length) % POSES.length;
    layers.forEach((set, pi) => {
      const active = (pose + panels[pi].offset) % POSES.length;
      set.forEach((img, i) => {
        img.style.setProperty('--turn', `${dir * 10}px`);
        img.classList.toggle('is-on', i === active);
      });
    });
  };

  const stop = () => { window.clearInterval(timer); timer = 0; };
  const play = () => {
    stop();
    if (reduce.matches || !visible || document.hidden) return;
    timer = window.setInterval(() => show(pose + 1, 1), 2400);
  };

  const build = () => {
    layers = panels.map((p, pi) => {
      originals[pi].remove();
      return POSES.map((ps) => {
        const img = document.createElement('img');
        img.className = 'pose' + (ps.flip ? ' pose--flip' : '');
        img.src = ps.src;
        img.alt = '';
        img.decoding = 'async';
        img.draggable = false;
        p.el.appendChild(img);
        return img;
      });
    });
    triptych.classList.add('is-turning');
    triptych.setAttribute('role', 'img');
    triptych.setAttribute('aria-label', document.documentElement.lang === 'tr'
      ? 'Prova kabininde dönen takım: önden, yandan ve arkadan'
      : 'Anzug in der Anprobe, von vorne, von der Seite und von hinten');
    show(0);
    play();

    // Drag sideways to turn him yourself
    let startX = 0;
    let stepped = 0;
    let dragging = false;
    triptych.addEventListener('pointerdown', (e) => {
      dragging = true; startX = e.clientX; stepped = 0;
      triptych.classList.add('is-dragging');
      triptych.setPointerCapture(e.pointerId);
      stop(); window.clearTimeout(resumeTimer);
    });
    triptych.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const steps = Math.trunc((e.clientX - startX) / 45);
      if (steps !== stepped) {
        const dir = steps > stepped ? 1 : -1;
        show(pose + dir, dir);
        stepped = steps;
      }
    });
    const end = () => {
      if (!dragging) return;
      dragging = false;
      triptych.classList.remove('is-dragging');
      resumeTimer = window.setTimeout(play, 5000);
    };
    triptych.addEventListener('pointerup', end);
    triptych.addEventListener('pointercancel', end);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; visible ? play() : stop(); }).observe(triptych);
    }
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : play()));
  };

  // Only turn once all three photos exist; otherwise the mirrors keep their glass.
  let pending = originals.length;
  let failed = false;
  const settle = (ok) => { failed = failed || !ok; if (--pending === 0 && !failed) build(); };
  originals.forEach((img) => {
    if (img.complete) settle(img.naturalWidth > 0);
    else {
      img.addEventListener('load', () => settle(true), { once: true });
      img.addEventListener('error', () => settle(false), { once: true });
    }
  });
})();
