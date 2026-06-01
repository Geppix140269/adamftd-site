/* ============================================================
   ADAMftd · Investor Microsite · interactive layer
   ============================================================ */

// ----- Sticky-nav shadow on scroll -----
(function () {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 12);
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ----- Reveal on scroll (with robust fallback) -----
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  // Opt-in to the hidden-until-revealed CSS state. Without JS, content stays visible.
  document.documentElement.classList.add('js-reveal');

  // Immediately reveal anything already in (or near) the viewport
  const revealVisible = () => {
    const h = window.innerHeight;
    els.forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.top < h + 200) el.classList.add('in');
    });
  };
  requestAnimationFrame(revealVisible);

  // Safety net — force everything visible if anything is still hidden 700ms in
  setTimeout(() => {
    els.forEach(el => el.classList.add('in'));
  }, 700);

  if (!('IntersectionObserver' in window)) {
    document.addEventListener('scroll', revealVisible, { passive: true });
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -5% 0px' });
  els.forEach(el => io.observe(el));
})();

// ----- Density toggle (in-page + Tweaks host protocol) -----
(function () {
  const KEY = 'adamftd.site.density';
  const root = document.documentElement;
  const buttons = document.querySelectorAll('.density-toggle button');
  const valid = ['editorial', 'compact'];

  function applyDensity(v) {
    if (!valid.includes(v)) v = 'editorial';
    root.setAttribute('data-density', v);
    buttons.forEach(b => b.classList.toggle('active', b.dataset.density === v));
    try { localStorage.setItem(KEY, v); } catch (e) {}
  }

  const saved = (() => { try { return localStorage.getItem(KEY); } catch (e) { return null; } })();
  if (saved) applyDensity(saved);

  buttons.forEach(b => {
    b.addEventListener('click', () => applyDensity(b.dataset.density));
  });

  // Expose for Tweaks panel
  window.__adamftdDensity = applyDensity;
})();

// ----- Burger (mobile menu) -----
(function () {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  if (!burger || !nav) return;
  burger.addEventListener('click', () => nav.classList.toggle('open'));
  nav.querySelectorAll('.links a').forEach(a => {
    a.addEventListener('click', () => nav.classList.remove('open'));
  });
})();
