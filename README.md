# vet-eye

Static website of vet-eye, a fictional veterinary ultrasound company used in an AI class. Plain HTML, CSS and JavaScript, no build step.

## Run it

```
python3 -m http.server 8000
```

Then open http://localhost:8000/.

## Structure

- `*.html`, `company/f/*.html` – page content in English. Every translatable element has a `data-i18n="key"` attribute.
- `assets/js/i18n.js` – the dictionary `T`. `T.pl` holds the Polish text for every key; `T.en` holds only the strings that are rendered by JavaScript (header, footer, cookie banner).
- `assets/js/site.js` – renders the shared header, footer and cookie banner, and handles the EN/PL switch, the mobile menu and the contact form.
- `assets/css/style.css` – all styles; colours, fonts and sizes are tokens in `:root`.
- `tools/check-i18n.mjs` – verifies that every key has a Polish translation.

## Changing text

1. Edit the English text in the HTML file.
2. Edit the same key in `T.pl` in `assets/js/i18n.js`.
3. Run `node tools/check-i18n.mjs`.

The language is picked from the saved choice, then from the browser language (Polish browsers get Polish, everyone else English).

## State exposed for tests

- `html[data-lang]` – current language (`en` or `pl`)
- `#drawer[data-open]` – mobile menu open or closed
- `#cookie[data-consent]` – `pending`, `accepted` or `declined`
- `.contact-form[data-state]` – `idle`, `invalid` or `sent`

The contact form has no backend: it validates the email and shows a confirmation, nothing is sent.
