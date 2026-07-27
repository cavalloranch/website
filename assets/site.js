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
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(function (el) { io.observe(el); });
})();
