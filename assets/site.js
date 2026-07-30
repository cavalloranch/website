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

// Email-capture popup (name + email). Wired for Mailchimp's JSONP endpoint.
// Stays DORMANT until MC config below is filled in — safe to deploy as-is.
(function () {
  // ---- Mailchimp config: fill these from your embedded-form action URL ----
  // Example action URL:
  //   https://cavalloranch.us21.list-manage.com/subscribe/post?u=abc123&id=def456
  //   -> dc = "us21", u = "abc123", id = "def456"
  var MC = { dc: 'us11', u: 'a66d2b2e684f4b48b4ca2a6f5', id: '239f3283db' };
  // ------------------------------------------------------------------------
  if (!MC.dc || !MC.u || !MC.id) return;                 // not configured yet
  if (localStorage.getItem('cr_signup_v1')) return;      // already seen/joined

  var ov = document.createElement('div');
  ov.className = 'signup';
  ov.setAttribute('role', 'dialog');
  ov.setAttribute('aria-modal', 'true');
  ov.setAttribute('aria-label', 'Join the Cavallo Ranch list');
  ov.innerHTML =
    '<div class="signup__card">' +
      '<button class="signup__close" aria-label="Close">&times;</button>' +
      '<span class="eyebrow">Stay in touch</span>' +
      '<h3>Join the Cavallo Ranch list</h3>' +
      '<p>Be first to hear about availability, offers, and news from the ranch.</p>' +
      '<form class="signup__form" novalidate>' +
        '<input type="text" name="name" placeholder="Name" autocomplete="name" required>' +
        '<input type="email" name="email" placeholder="Email" autocomplete="email" required>' +
        '<button class="btn" type="submit">Sign Up</button>' +
        '<p class="signup__note">By signing up you agree to receive emails from Cavallo Ranch. See our <a href="/privacy-policy">Privacy Policy</a>.</p>' +
        '<p class="signup__msg" role="status"></p>' +
      '</form>' +
    '</div>';
  document.body.appendChild(ov);

  var form = ov.querySelector('.signup__form');
  var msg = ov.querySelector('.signup__msg');
  function openIt() { ov.classList.add('open'); }
  function closeIt() { ov.classList.remove('open'); }
  function remember() { try { localStorage.setItem('cr_signup_v1', '1'); } catch (e) {} }

  ov.querySelector('.signup__close').addEventListener('click', function () { closeIt(); remember(); });
  ov.addEventListener('click', function (e) { if (e.target === ov) { closeIt(); remember(); } });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && ov.classList.contains('open')) { closeIt(); remember(); } });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    var name = form.name.value.trim(), email = form.email.value.trim();
    msg.textContent = 'Signing you up…';
    var cb = 'mc_cb_' + Date.now();
    window[cb] = function (resp) {
      delete window[cb];
      var ok = resp && resp.result === 'success';
      msg.textContent = ok ? "Thank you — you're on the list." : (resp && resp.msg ? String(resp.msg).replace(/^\d+\s*-\s*/, '') : 'Something went wrong — please try again.');
      if (ok) { remember(); setTimeout(closeIt, 1800); }
    };
    var q = 'u=' + encodeURIComponent(MC.u) + '&id=' + encodeURIComponent(MC.id) +
            '&EMAIL=' + encodeURIComponent(email) + '&FNAME=' + encodeURIComponent(name) + '&c=' + cb;
    var s = document.createElement('script');
    s.src = 'https://' + MC.dc + '.list-manage.com/subscribe/post-json?' + q;
    s.onerror = function () { msg.textContent = 'Network error — please try again.'; };
    document.body.appendChild(s);
  });

  setTimeout(openIt, 7000);  // show after 7s on first visit
})();
