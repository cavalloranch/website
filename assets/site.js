(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Hero video: only reveal once it is genuinely playing. Safari may block
  // autoplay (Low Power Mode, data saver) — in that case the poster stays.
  var hv = document.querySelector('.hero__video');
  if (hv) {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      hv.remove();
    } else {
      var show = function () { hv.classList.add('is-playing'); };
      hv.addEventListener('playing', show);
      if (hv.readyState >= 3 && !hv.paused) show();
      var p = hv.play();
      if (p && typeof p.catch === 'function') {
        p.catch(function () { /* autoplay blocked — poster remains visible */ });
      }
    }
  }

  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  }
})();

// Room gallery lightbox: click a room to open a slideshow of its photos.
(function () {
  var rooms = document.querySelectorAll('.room[data-images]');
  if (!rooms.length && !document.querySelector('.photo-strip[data-images]')) return;

  var ov = document.createElement('div');
  ov.className = 'lightbox';
  ov.setAttribute('aria-hidden', 'true');
  ov.setAttribute('role', 'dialog');
  ov.setAttribute('aria-modal', 'true');
  ov.innerHTML =
    '<button class="lb-close" aria-label="Close">&times;</button>' +
    '<button class="lb-nav lb-prev" aria-label="Previous image">&#8249;</button>' +
    '<figure class="lb-stage"><img alt=""><figcaption class="lb-cap"></figcaption></figure>' +
    '<button class="lb-nav lb-next" aria-label="Next image">&#8250;</button>' +
    '<div class="lb-count" aria-hidden="true"></div>';
  document.body.appendChild(ov);

  var imgEl = ov.querySelector('img');
  var capEl = ov.querySelector('.lb-cap');
  var countEl = ov.querySelector('.lb-count');
  var list = [], idx = 0, title = '', lastFocus = null;

  function render() {
    imgEl.src = list[idx];
    capEl.textContent = title;
    countEl.textContent = (idx + 1) + ' / ' + list.length;
    ov.querySelector('.lb-prev').style.visibility = list.length > 1 ? 'visible' : 'hidden';
    ov.querySelector('.lb-next').style.visibility = list.length > 1 ? 'visible' : 'hidden';
  }
  function open(images, t, trigger, start) {
    list = images; idx = start || 0; title = t; lastFocus = trigger || null;
    ov.classList.add('open'); ov.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    render();
    ov.querySelector('.lb-close').focus();
  }
  function close() {
    ov.classList.remove('open'); ov.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; imgEl.removeAttribute('src');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function step(d) { idx = (idx + d + list.length) % list.length; render(); }

  rooms.forEach(function (r) {
    r.classList.add('room--clickable');
    r.setAttribute('role', 'button');
    r.setAttribute('tabindex', '0');
    function act() {
      var imgs = r.getAttribute('data-images').split(',')
        .map(function (s) { return s.trim(); }).filter(Boolean);
      if (!imgs.length) return;
      var h = r.querySelector('h3');
      open(imgs, h ? h.textContent : '', r);
    }
    r.addEventListener('click', act);
    r.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); act(); }
    });
  });

  // Scrolling photo strips: click any thumbnail to open the lightbox at it.
  document.querySelectorAll('.photo-strip[data-images]').forEach(function (strip) {
    var imgs = strip.getAttribute('data-images').split(',')
      .map(function (s) { return s.trim(); }).filter(Boolean);
    var t = strip.getAttribute('data-title') || '';
    strip.querySelectorAll('.ps-item').forEach(function (it, i) {
      it.addEventListener('click', function () { open(imgs, t, it, i); });
    });
  });

  ov.querySelector('.lb-close').addEventListener('click', close);
  ov.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); step(-1); });
  ov.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); step(1); });
  ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
  document.addEventListener('keydown', function (e) {
    if (!ov.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
  });
})();
