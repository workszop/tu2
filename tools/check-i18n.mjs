// Checks that every data-i18n key used in the HTML has a Polish translation,
// that no translation is unused, and that English chrome keys exist in both
// languages. Run: node tools/check-i18n.mjs
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKIP_DIRS = new Set(['.git', 'node_modules', 'assets', 'tools']);

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return SKIP_DIRS.has(name) ? [] : htmlFiles(path);
    return name.endsWith('.html') ? [path] : [];
  });
}

const source = readFileSync(join(ROOT, 'assets/js/i18n.js'), 'utf8');
const T = vm.runInNewContext(source + '\nT;');
const siteJs = readFileSync(join(ROOT, 'assets/js/site.js'), 'utf8');

const used = new Set();
const errors = [];
for (const file of htmlFiles(ROOT)) {
  const html = readFileSync(file, 'utf8');
  const page = (html.match(/data-page="([^"]+)"/) || [])[1];
  if (!page) errors.push(`${file}: missing data-page on <html>`);
  else { used.add(`${page}.metaTitle`); used.add(`${page}.metaDesc`); }
  for (const m of html.matchAll(/data-i18n="([^"]+)"/g)) used.add(m[1]);
  for (const m of html.matchAll(/data-i18n-attr="([^"]+)"/g)) {
    m[1].split(',').forEach((pair) => used.add(pair.split(':')[1].trim()));
  }
}
// Keys rendered by site.js (the nav.<id> keys are in the static header of every page).
for (const m of siteJs.matchAll(/(?:data-i18n="|:)((?:chrome|footer|cookie)\.[A-Za-z]+)/g)) used.add(m[1]);

for (const key of used) if (!(key in T.pl)) errors.push(`missing Polish translation: ${key}`);
for (const key of Object.keys(T.pl)) if (!used.has(key)) errors.push(`unused Polish translation: ${key}`);
for (const key of Object.keys(T.en)) if (!(key in T.pl)) errors.push(`chrome key missing in pl: ${key}`);
for (const [lang, dict] of Object.entries(T)) {
  for (const [key, text] of Object.entries(dict)) {
    if (text.includes('—')) errors.push(`em-dash in ${lang}:${key}`);
    if (!text.trim()) errors.push(`empty text in ${lang}:${key}`);
  }
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`i18n OK: ${used.size} keys, ${Object.keys(T.pl).length} Polish translations`);
