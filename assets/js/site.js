(function () {
  'use strict';

  // Mobile navigation drawer
  var drawer = document.getElementById('drawer');
  var openBtn = document.querySelector('.nav-toggle');
  var closeBtn = document.querySelector('.drawer-close');
  function setDrawer(open) {
    if (!drawer) return;
    drawer.classList.toggle('open', open);
    openBtn.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) closeBtn.focus(); else openBtn.focus();
  }
  if (drawer && openBtn && closeBtn) {
    openBtn.addEventListener('click', function () { setDrawer(true); });
    closeBtn.addEventListener('click', function () { setDrawer(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('open')) setDrawer(false);
    });
  }

  // Cookie banner
  var banner = document.getElementById('cookie');
  var KEY = 'vet-eye-cookie-consent';
  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  if (banner && !stored()) {
    banner.hidden = false;
    banner.addEventListener('click', function (e) {
      var choice = e.target.getAttribute && e.target.getAttribute('data-consent');
      if (!choice) return;
      try { localStorage.setItem(KEY, choice); } catch (err) { /* private mode */ }
      banner.classList.add('leaving');
      setTimeout(function () { banner.hidden = true; }, 400);
    });
  }

  // Blog carousel counter (small screens)
  var cards = document.querySelector('.blog-cards');
  var count = document.getElementById('blog-count');
  if (cards && count) {
    cards.addEventListener('scroll', function () {
      count.textContent = String(Math.round(cards.scrollLeft / cards.clientWidth) + 1);
    }, { passive: true });
  }

  // Contact form (static site: validates and confirms, nothing is sent anywhere)
  var form = document.querySelector('.contact-form');
  if (form) {
    var email = form.querySelector('input[type="email"]');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
      email.closest('.field').classList.toggle('invalid', !ok);
      if (!ok) { email.focus(); return; }
      form.classList.add('sent');
    });
    email.addEventListener('input', function () { email.closest('.field').classList.remove('invalid'); });
  }
})();
