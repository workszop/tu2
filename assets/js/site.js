// vet-eye site script: shared chrome (header, footer, cookie banner),
// language switch and page behaviours. Requires i18n.js (global T) loaded first.
(function () {
  'use strict';

  // ─── Constants ───
  const LANGS = ['en', 'pl'];
  const LANG_KEY = 'vet-eye-lang';
  const CONSENT_KEY = 'vet-eye-cookie-consent';
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const ORPHANS_PL = /(^|[\s(„»>])([aiouwzAIOUWZ]) /g;
  const DESKTOP_QUERY = '(min-width: 1024px)';
  // document.currentScript is null when a script optimiser (e.g. Cloudflare
  // Rocket Loader) runs this file, so fall back to finding the tag by its src.
  const SCRIPT = document.currentScript || document.querySelector('script[src$="assets/js/site.js"]');
  const ROOT = new URL('../../', SCRIPT.src).href;
  const MAP_URL = 'https://www.google.com/maps?q=Lublin,+Poland&z=13&output=embed&hl=';

  const NAV = [
    { id: 'home', href: 'index.html' },
    { id: 'products', href: 'products.html' },
    { id: 'ultrasonography', href: 'ultrasonography.html' },
    { id: 'technology', href: 'technology-1.html' },
    { id: 'company', href: 'company.html' },
    { id: 'contact', href: 'contact-us.html' },
  ];

  const SOCIALS = [
    { icon: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/vet-eye' },
    { icon: 'twitter', label: 'Twitter', href: 'https://www.twitter.com/vet-eye' },
    { icon: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/vet-eye' },
  ];

  const ICON_PATHS = {
    burger: '<path fill-rule="evenodd" d="M19 8H5a1 1 0 1 1 0-2h14a1 1 0 0 1 0 2zm0 5.097H5a1 1 0 1 1 0-2h14a1 1 0 1 1 0 2zm0 5.25H5a1 1 0 1 1 0-2h14a1 1 0 1 1 0 2z"/>',
    close: '<path fill-rule="evenodd" d="M19.245 4.313a1.065 1.065 0 0 0-1.508 0L11.78 10.27 5.82 4.313A1.065 1.065 0 1 0 4.312 5.82l5.958 5.958-5.958 5.959a1.067 1.067 0 0 0 1.508 1.508l5.959-5.958 5.958 5.958a1.065 1.065 0 1 0 1.508-1.508l-5.958-5.959 5.958-5.958a1.065 1.065 0 0 0 0-1.508"/>',
    facebook: '<path fill-rule="evenodd" d="M22 12.061C22 6.505 17.523 2 12 2S2 6.505 2 12.061c0 5.022 3.657 9.184 8.438 9.939v-7.03h-2.54v-2.91h2.54V9.845c0-2.522 1.492-3.915 3.777-3.915 1.094 0 2.238.197 2.238.197v2.476h-1.26c-1.243 0-1.63.775-1.63 1.57v1.888h2.773l-.443 2.908h-2.33V22c4.78-.755 8.437-4.917 8.437-9.939z"/>',
    twitter: '<path d="M22 12c0-5.524-4.477-10-10-10C6.478 2 2 6.478 2 12c0 5.523 4.478 10 10 10 5.523 0 10-4.477 10-10zm-3.795-3.516c-.33.492-.749.926-1.23 1.271l.008.319c0 3.255-2.477 7.005-7.006 7.005a6.968 6.968 0 01-3.773-1.107 4.94 4.94 0 003.645-1.019 2.466 2.466 0 01-2.3-1.71 2.464 2.464 0 001.112-.042 2.465 2.465 0 01-1.975-2.413v-.032c.333.185.711.295 1.115.309a2.461 2.461 0 01-.762-3.286 6.987 6.987 0 005.075 2.572 2.462 2.462 0 014.196-2.245 4.986 4.986 0 001.564-.597A2.469 2.469 0 0116.79 8.87a4.936 4.936 0 001.414-.387z"/>',
    youtube: '<g transform="translate(2 2)"><polygon points="8.811 11.495 11.927 9.88 8.807 8.255"/><path d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10A10 10 0 0 0 10 0zm5.673 10.436c0 .935-.066 1.866-.066 1.866-.027.415-.17.814-.41 1.153-.306.308-.72.483-1.153.487-1.615.116-4.033.12-4.033.12s-2.99-.03-3.913-.117a1.91 1.91 0 0 1-1.25-.49 2.273 2.273 0 0 1-.419-1.146s-.033-.934-.033-1.865V9.56c0-.935.033-1.876.033-1.876s.03-.804.364-1.153c.305-.312.72-.493 1.156-.506 1.615-.116 4.036-.149 4.036-.149s2.411.033 4.026.15c.44.016.855.203 1.16.52.244.336.394.731.436 1.145 0 0 .07.934.07 1.865l-.004.88z"/></g>',
    message: '<rect x="4" y="6" width="16" height="10.222" rx="1.129"/><path d="M8.977 18.578l.2-2.722a.564.564 0 01.564-.523h3.61c.548 0 .774.705.327 1.024l-3.81 2.721a.564.564 0 01-.89-.5z"/>',
  };

  // ─── State ───
  const state = {
    lang: 'en',
    page: document.documentElement.dataset.page || 'home',
    navId: document.documentElement.dataset.nav || document.documentElement.dataset.page || 'home',
    drawerOpen: false,
    consent: null,
    defaults: {},       // English text captured from the HTML, by key
    defaultAttrs: {},   // English attribute values captured from the HTML
  };

  // ─── DOM refs (filled after the chrome is rendered) ───
  const refs = {};

  // ─── Helpers ───
  function icon(name) {
    return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' + ICON_PATHS[name] + '</svg>';
  }

  function readStore(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }

  function writeStore(key, value) {
    try { localStorage.setItem(key, value); } catch (e) { /* storage unavailable */ }
  }

  function initialLang() {
    const saved = readStore(LANG_KEY);
    if (LANGS.includes(saved)) return saved;
    return (navigator.language || '').toLowerCase().startsWith('pl') ? 'pl' : 'en';
  }

  function t(key) {
    let text = T[state.lang][key];
    if (text === undefined) text = T.en[key];
    if (text === undefined) text = state.defaults[key];
    if (text === undefined) return '';
    // Polish typography: keep one-letter words attached to the next word.
    return state.lang === 'pl' ? text.replace(ORPHANS_PL, '$1$2 ') : text;
  }

  function parseAttrMap(el) {
    return el.dataset.i18nAttr.split(',').map(function (pair) {
      const parts = pair.split(':');
      return { attr: parts[0].trim(), key: parts[1].trim() };
    });
  }

  function captureDefaults() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.dataset.i18n;
      if (!(key in T.en) && !(key in state.defaults)) state.defaults[key] = el.innerHTML;
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      parseAttrMap(el).forEach(function (item) {
        if (!(item.key in T.en) && !(item.key in state.defaultAttrs)) {
          state.defaultAttrs[item.key] = el.getAttribute(item.attr) || '';
        }
      });
    });
    state.defaults[state.page + '.metaTitle'] = document.title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) state.defaults[state.page + '.metaDesc'] = desc.content;
  }

  // ─── Render ───
  function renderChrome() {
    const links = NAV.map(function (item) {
      const current = item.id === state.navId ? ' aria-current="page"' : '';
      return '<li><a href="' + ROOT + item.href + '"' + current + ' data-i18n="nav.' + item.id + '"></a></li>';
    }).join('');
    const langButtons = LANGS.map(function (lang) {
      return '<button type="button" data-set-lang="' + lang + '" lang="' + lang + '">' + lang.toUpperCase() + '</button>';
    }).join('');

    document.getElementById('site-header').innerHTML =
      '<a class="skip-link" href="#main" data-i18n="chrome.skip"></a>' +
      '<header class="site-header"><div class="container bar">' +
        '<a class="logo" href="' + ROOT + 'index.html">vet-eye</a>' +
        '<nav class="main-nav" data-i18n-attr="aria-label:chrome.siteNav"><ul>' + links + '</ul></nav>' +
        '<div class="lang-switch" role="group" data-i18n-attr="aria-label:chrome.language">' + langButtons + '</div>' +
        '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="drawer" data-i18n-attr="aria-label:chrome.menuOpen">' + icon('burger') + '</button>' +
      '</div></header>' +
      '<div class="drawer" id="drawer" data-open="false">' +
        '<button class="drawer-close" type="button" data-i18n-attr="aria-label:chrome.menuClose">' + icon('close') + '</button>' +
        '<nav data-i18n-attr="aria-label:chrome.siteNav"><ul>' + links + '</ul></nav>' +
      '</div>';

    document.getElementById('site-footer').innerHTML =
      '<footer class="site-footer"><div class="container"><p data-i18n="footer.copyright"></p></div></footer>' +
      '<a class="fab" href="' + ROOT + 'contact-us.html" data-i18n-attr="aria-label:chrome.message">' + icon('message') + '</a>' +
      '<div class="cookie" id="cookie" role="region" aria-labelledby="cookie-title" hidden>' +
        '<h2 class="cookie-title" id="cookie-title" data-i18n="cookie.title"></h2>' +
        '<p data-i18n="cookie.text"></p>' +
        '<div class="actions">' +
          '<button type="button" data-consent="declined" data-i18n="cookie.decline"></button>' +
          '<button type="button" data-consent="accepted" data-i18n="cookie.accept"></button>' +
        '</div>' +
      '</div>';

    document.querySelectorAll('[data-social]').forEach(function (el) {
      el.classList.add('social');
      el.innerHTML = SOCIALS.map(function (item) {
        return '<a href="' + item.href + '" target="_blank" rel="noopener" aria-label="' + item.label + '">' + icon(item.icon) + '</a>';
      }).join('');
    });

    refs.main = document.getElementById('main');
    refs.footer = document.getElementById('site-footer');
    refs.drawer = document.getElementById('drawer');
    refs.navToggle = document.querySelector('.nav-toggle');
    refs.drawerClose = document.querySelector('.drawer-close');
    refs.cookie = document.getElementById('cookie');
    refs.langSwitch = document.querySelector('.lang-switch');
    refs.form = document.querySelector('.contact-form');
    refs.email = refs.form ? refs.form.querySelector('input[type="email"]') : null;
    refs.cards = document.querySelector('.blog-cards');
    refs.cardCount = document.getElementById('blog-count');
    refs.map = document.querySelector('[data-map]');
  }

  function renderLang() {
    const root = document.documentElement;
    root.lang = state.lang;
    root.dataset.lang = state.lang;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.innerHTML = t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      parseAttrMap(el).forEach(function (item) {
        el.setAttribute(item.attr, t(item.key) || state.defaultAttrs[item.key] || '');
      });
    });

    document.title = t(state.page + '.metaTitle');
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.content = t(state.page + '.metaDesc');

    refs.langSwitch.querySelectorAll('button').forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.dataset.setLang === state.lang));
    });
    if (refs.map && refs.map.dataset.mapLang !== state.lang) {
      refs.map.dataset.mapLang = state.lang;
      refs.map.src = MAP_URL + state.lang;
    }
  }

  function renderDrawer() {
    refs.drawer.dataset.open = String(state.drawerOpen);
    refs.navToggle.setAttribute('aria-expanded', String(state.drawerOpen));
    document.body.classList.toggle('no-scroll', state.drawerOpen);
    // Keep keyboard focus inside the open drawer.
    refs.main.inert = state.drawerOpen;
    refs.footer.inert = state.drawerOpen;
  }

  function renderCookie() {
    refs.cookie.hidden = state.consent !== null;
    refs.cookie.dataset.consent = state.consent || 'pending';
  }

  // ─── Actions ───
  function setLang(lang) {
    if (!LANGS.includes(lang) || lang === state.lang) return;
    state.lang = lang;
    writeStore(LANG_KEY, lang);
    renderLang();
  }

  function setDrawer(open) {
    state.drawerOpen = open;
    renderDrawer();
    (open ? refs.drawerClose : refs.navToggle).focus();
  }

  function setConsent(choice) {
    state.consent = choice;
    writeStore(CONSENT_KEY, choice);
    renderCookie();
  }

  function submitForm(event) {
    event.preventDefault();
    const valid = EMAIL_PATTERN.test(refs.email.value.trim());
    refs.form.dataset.state = valid ? 'sent' : 'invalid';
    refs.email.setAttribute('aria-invalid', String(!valid));
    if (!valid) refs.email.focus();
    // Static site: there is no backend, so nothing is sent anywhere.
  }

  // ─── Listeners ───
  function bind() {
    refs.langSwitch.addEventListener('click', function (event) {
      const button = event.target.closest('[data-set-lang]');
      if (button) setLang(button.dataset.setLang);
    });
    refs.navToggle.addEventListener('click', function () { setDrawer(true); });
    refs.drawerClose.addEventListener('click', function () { setDrawer(false); });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && state.drawerOpen) setDrawer(false);
    });
    window.matchMedia(DESKTOP_QUERY).addEventListener('change', function (event) {
      if (event.matches && state.drawerOpen) setDrawer(false);
    });
    refs.cookie.addEventListener('click', function (event) {
      const button = event.target.closest('[data-consent]');
      if (button) setConsent(button.dataset.consent);
    });
    if (refs.form) {
      refs.form.addEventListener('submit', submitForm);
      refs.email.addEventListener('input', function () {
        if (refs.form.dataset.state === 'invalid') {
          refs.form.dataset.state = 'idle';
          refs.email.setAttribute('aria-invalid', 'false');
        }
      });
    }
    if (refs.cards && refs.cardCount) {
      refs.cards.addEventListener('scroll', function () {
        refs.cardCount.textContent = String(Math.round(refs.cards.scrollLeft / refs.cards.clientWidth) + 1);
      }, { passive: true });
    }
  }

  // ─── Init ───
  state.lang = initialLang();
  state.consent = readStore(CONSENT_KEY);
  captureDefaults();
  renderChrome();
  renderLang();
  renderDrawer();
  renderCookie();
  bind();
  document.documentElement.classList.add('ready');
})();
