// Builds the 2020 investor presentation as two PDFs (English and Polish).
// Run: node tools/investor-deck/build.mjs
// Output: assets/docs/2020-investor-presentation-en.pdf and -pl.pdf
// All figures come from the audited 2020 consolidated financial statements
// (assets/docs/2020_Consolidated_Financial_Statement_VET-EYE.pdf), in U.S. dollars.
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const asset = (path) => pathToFileURL(join(ROOT, 'assets', path)).href;
const CHROME = process.env.CHROME || 'google-chrome';
const PYTHON = process.env.PYTHON || 'python3';
const workDir = mkdtempSync(join(tmpdir(), 'vet-eye-deck-'));

// ─── Images ───
// Chrome embeds WebP images losslessly, which makes each PDF about 18 MB. JPEG files are
// embedded as they are, so the images are converted first (needs Python with Pillow).
// Without Pillow the build still works, only the PDFs come out large.
const IMAGES = [
  'img/photo-library/01-hero-care.webp', 'img/photo-library/02-dog-ultrasound.webp',
  'img/photo-library/03-cat-care.webp', 'img/photo-library/06-clinical-training.webp',
  'img/photo-library/07-engineering.webp', 'img/photo-library/08-quality-control.webp',
  'img/photo-library/09-vet-consultation.webp', 'img/photo-library/10-support.webp',
  'img/vet-pro-key-75.webp', 'img/vet-portable-15.webp', 'img/vet-pro-70.webp',
];
const TO_JPEG = `
import sys
from PIL import Image
for src, dst in zip(sys.argv[1::2], sys.argv[2::2]):
    im = Image.open(src).convert('RGBA')
    flat = Image.new('RGB', im.size, 'white')
    flat.paste(im, mask=im.split()[3])
    flat.thumbnail((1600, 1600))
    flat.save(dst, 'JPEG', quality=84, optimize=True)
`;
const imageUrl = {};
function prepareImages() {
  const pairs = IMAGES.map((path, index) => [join(ROOT, 'assets', path), join(workDir, 'image-' + index + '.jpg')]);
  try {
    execFileSync(PYTHON, ['-c', TO_JPEG, ...pairs.flat()], { stdio: 'ignore' });
    IMAGES.forEach((path, index) => { imageUrl[path] = pathToFileURL(pairs[index][1]).href; });
  } catch (error) {
    console.warn('Pillow not available: embedding the original WebP images, the PDFs will be large.');
    IMAGES.forEach((path) => { imageUrl[path] = asset(path); });
  }
}
const image = (path) => imageUrl[path];
const photo = (name) => image('img/photo-library/' + name + '.webp');

// ─── Figures (U.S. dollars, from the audited statements) ───
const FIG = {
  revenue: [16215812, 12688752],
  cogs: [5495839, 5520050],
  gross: [10719973, 7168702],
  salesMarketing: [4935183, 4855988],
  research: [1162872, 1039827],
  admin: [2522741, 2861091],
  stockComp: [339892, 628280],
  depreciation: [903384, 841588],
  opex: [9864072, 10226774],
  operating: [10719973 - 9864072, 7168702 - 10226774],
  net: [2816450, -2495015],
  cash: [2827882, 2425468],
  assets: [15443766, 14856964],
  liabilities: [11356359, 12038811],
  equity: [4087407, 2818153],
};

// ─── Number formatting ───
function makeFormat(lang) {
  const dec = lang === 'pl' ? ',' : '.';
  const num = (value, digits) => Math.abs(value).toFixed(digits).replace('.', dec);
  const sign = (value) => (value < 0 ? '−' : '');
  return {
    // Millions with a currency unit, e.g. $16.2M or 16,2 mln USD.
    money(value, digits = 1) {
      const n = num(value / 1e6, digits);
      return lang === 'pl' ? sign(value) + n + ' mln USD' : sign(value) + '$' + n + 'M';
    },
    // Bare millions for table cells.
    cell(value) { return sign(value) + num(value / 1e6, 2); },
    percent(value, digits = 1) { return num(value, digits) + '%'; },
    change(pair) {
      const pct = (pair[0] / pair[1] - 1) * 100;
      return (pct < 0 ? '−' : '+') + num(pct, 1) + '%';
    },
  };
}

// ─── Text ───
const TEXT = {
  en: {
    docTitle: 'vet-eye 2020 results: investor presentation',
    footer: 'Vet-Eye S.A. · 2020 results',
    coverEyebrow: 'Investor presentation',
    coverTitle: '2020 results',
    coverBy: 'Dr. Jan Kot, President & CEO',
    safeTitle: 'Safe harbor statement',
    safeText: [
      'This presentation includes forward-looking statements within the meaning of the “safe harbor” provisions of the US Private Securities Litigation Reform Act of 1995 that relate to future events or our future financial performance regarding, among other things, the plans, strategies and prospects, both business and financial, of the Company. These statements are based on the beliefs and assumptions of the Company’s management team.',
      'Although the Company believes that its plans, intentions and expectations reflected in or suggested by these forward-looking statements are reasonable, the Company cannot assure you that it will achieve or realize these plans, intentions or expectations. Forward-looking statements are inherently subject to risks, uncertainties and assumptions.',
      'Generally, statements that are not historical facts, including statements concerning possible or assumed future actions, business strategies, events or results of operations, are forward-looking statements. These statements may be preceded by, followed by or include the words “believes,” “estimates,” “expects,” “projects,” “forecasts,” “may,” “will,” “should,” “seeks,” “plans,” “scheduled,” “anticipates” or “intends” or similar expressions. The forward-looking statements are based on projections prepared by, and are the responsibility of, the Company’s management.',
    ],
    glanceEyebrow: 'Highlights',
    glanceTitle: '2020 at a glance',
    glanceLead: 'Revenue grew by more than a quarter and the company moved from an operating loss to an operating profit.',
    revenue: 'Revenue',
    grossMargin: 'Gross margin',
    operatingProfit: 'Operating profit',
    netIncome: 'Net income',
    versus: 'vs. 2019',
    in2019: 'in 2019',
    aboutEyebrow: 'What we do',
    aboutTitle: 'We design and manufacture high-end veterinary ultrasound scanners',
    aboutLead: 'vet-eye is headquartered in Lublin, Poland.',
    sites: 'sites',
    employees: 'employees',
    clinics: 'veterinary clinics use our equipment daily',
    clinicsNumber: '10,000+',
    productsEyebrow: 'Our products',
    productsTitle: 'Three portable systems for veterinary practice',
    productProKey: 'Our sharpest image, ready to scan in under 25 seconds',
    productPortable: 'High-end imaging you can take anywhere',
    productPro70: 'All-digital, configured for the practice',
    marketEyebrow: 'Market opportunity',
    marketTitle: 'A growing global market',
    marketSizeNumber: '$488.9M',
    marketSize: 'expected size of the global animal ultrasound market by 2028',
    marketGrowth: 'compound annual growth rate',
    marketSource: 'Source: Grand View Research, Inc.',
    growthEyebrow: '2020 performance',
    growthTitle: (f) => `Revenue up ${f.change(FIG.revenue).slice(1)}, gross margin at ${f.percent(66.1)}`,
    grossProfit: 'Gross profit',
    growthNote: (f) => `Cost of goods sold was flat at ${f.money(FIG.cogs[0])}, so all of the additional revenue reached gross profit.`,
    unitNote: 'USD million',
    incomeEyebrow: 'FY2020 financial results',
    incomeTitle: 'Income statement summary',
    change: 'Change',
    rows: {
      revenue: 'Revenue', cogs: 'Cost of goods sold', gross: 'Gross profit',
      salesMarketing: 'Sales and marketing', research: 'Research and development',
      admin: 'Administration', stockComp: 'Stock-based compensation',
      depreciation: 'Depreciation and amortization', opex: 'Total operating expenses',
      operating: 'Operating result', net: 'Net income (loss)',
    },
    incomeNote: (f) => `Operating result is gross profit less operating expenses. Net income for 2020 includes ${f.money(2620248)} of non-cash fair-value gains on warrants and the derivative preferred share liability, a ${f.money(463411)} foreign exchange gain and ${f.money(1062437)} of interest expense.`,
    source: 'Source: audited consolidated financial statements for 2020 (IFRS), in U.S. dollars.',
    balanceEyebrow: 'Financial position',
    balanceTitle: 'A stronger balance sheet',
    cash: 'Cash and cash equivalents',
    equity: 'Shareholders’ equity',
    liabilities: 'Total liabilities',
    assets: 'Total assets',
    balancePoints: (f) => [
      `Debentures reduced from ${f.money(5871293)} to ${f.money(2558248)}`,
      `Deferred consideration on acquisition down from ${f.money(1650000, 2)} to ${f.money(450000, 2)}`,
      `Preferred shares of ${f.money(2504044)} and a related derivative liability of ${f.money(2901787)} at year end`,
    ],
    goalsEyebrow: 'Outlook',
    goalsTitle: 'Near-term goals to drive growth',
    goal1: 'Clinical partnerships',
    goal1Text: 'Broaden partnerships with clinical leaders.',
    goal2: 'Commercial expansion',
    goal2Text: 'Partner across care settings, specialties and geographies to accelerate adoption.',
    goal3: 'Innovation',
    goal3Text: (f) => `Keep investing in innovation. R&D spending rose ${f.change(FIG.research).slice(1)} to ${f.money(FIG.research[0])} in 2020.`,
    summaryEyebrow: 'Summary',
    summaryTitle: 'Key takeaways',
    summaryPoints: (f) => [
      `Revenue of ${f.money(FIG.revenue[0])}, up ${f.change(FIG.revenue).slice(1)} year on year`,
      `Gross margin of ${f.percent(66.1)}, up from ${f.percent(56.5)}`,
      `Operating profit of ${f.money(FIG.operating[0])} after a ${f.money(-FIG.operating[1])} loss in 2019`,
      `Cash up ${f.change(FIG.cash).slice(1)} and shareholders’ equity up ${f.change(FIG.equity).slice(1)}`,
      'A global market expected to grow 11% a year to 2028',
    ],
    thanks: 'Thank you',
    contact: 'Investor relations',
    contactName: 'Tomek Klekowski',
  },

  pl: {
    docTitle: 'vet-eye, wyniki za 2020 rok: prezentacja dla inwestorów',
    footer: 'Vet-Eye S.A. · wyniki za 2020 rok',
    coverEyebrow: 'Prezentacja dla inwestorów',
    coverTitle: 'Wyniki za 2020 rok',
    coverBy: 'dr Jan Kot, prezes zarządu',
    safeTitle: 'Zastrzeżenie prawne',
    safeText: [
      'Niniejsza prezentacja zawiera stwierdzenia dotyczące przyszłości w rozumieniu przepisów o „bezpiecznej przystani” (safe harbor) amerykańskiej ustawy Private Securities Litigation Reform Act z 1995 roku. Odnoszą się one do przyszłych zdarzeń lub przyszłych wyników finansowych Spółki, w tym do jej planów, strategii i perspektyw biznesowych i finansowych. Stwierdzenia te opierają się na przekonaniach i założeniach zarządu Spółki.',
      'Spółka uważa, że plany, zamiary i oczekiwania wyrażone w tych stwierdzeniach są uzasadnione, ale nie może zapewnić, że zostaną zrealizowane. Stwierdzenia dotyczące przyszłości z natury wiążą się z ryzykiem, niepewnością i założeniami.',
      'Za stwierdzenia dotyczące przyszłości uznaje się co do zasady wszystkie stwierdzenia, które nie odnoszą się do faktów historycznych, w tym te o możliwych lub zakładanych przyszłych działaniach, strategiach biznesowych, zdarzeniach lub wynikach działalności. Mogą im towarzyszyć słowa takie jak „uważa”, „szacuje”, „oczekuje”, „prognozuje”, „może”, „powinien”, „dąży”, „planuje”, „przewiduje” czy „zamierza” albo podobne wyrażenia. Stwierdzenia dotyczące przyszłości opierają się na projekcjach przygotowanych przez zarząd Spółki, który ponosi za nie odpowiedzialność.',
    ],
    glanceEyebrow: 'Najważniejsze liczby',
    glanceTitle: 'Rok 2020 w skrócie',
    glanceLead: 'Przychody wzrosły o ponad jedną czwartą, a spółka przeszła od straty operacyjnej do zysku operacyjnego.',
    revenue: 'Przychody',
    grossMargin: 'Marża brutto',
    operatingProfit: 'Zysk operacyjny',
    netIncome: 'Zysk netto',
    versus: 'r/r',
    in2019: 'w 2019 roku',
    aboutEyebrow: 'Czym się zajmujemy',
    aboutTitle: 'Projektujemy i produkujemy wysokiej klasy ultrasonografy weterynaryjne',
    aboutLead: 'Siedziba vet-eye mieści się w Lublinie.',
    sites: 'lokalizacje',
    employees: 'pracowników',
    clinics: 'lecznic weterynaryjnych codziennie korzysta z naszego sprzętu',
    clinicsNumber: '10 000+',
    productsEyebrow: 'Nasze produkty',
    productsTitle: 'Trzy przenośne aparaty dla lecznic weterynaryjnych',
    productProKey: 'Nasz najostrzejszy obraz, gotowy do badania w niecałe 25 sekund',
    productPortable: 'Obraz z najwyższej półki, który można zabrać wszędzie',
    productPro70: 'W pełni cyfrowy, konfigurowany pod lecznicę',
    marketEyebrow: 'Rynek',
    marketTitle: 'Rosnący rynek światowy',
    marketSizeNumber: '488,9 mln USD',
    marketSize: 'prognozowana wartość światowego rynku USG dla zwierząt w 2028 roku',
    marketGrowth: 'średnioroczne tempo wzrostu (CAGR)',
    marketSource: 'Źródło: Grand View Research, Inc.',
    growthEyebrow: 'Wyniki za 2020 rok',
    growthTitle: (f) => `Przychody wyższe o ${f.change(FIG.revenue).slice(1)}, marża brutto ${f.percent(66.1)}`,
    grossProfit: 'Zysk brutto ze sprzedaży',
    growthNote: (f) => `Koszt własny sprzedaży pozostał na poziomie ${f.money(FIG.cogs[0])}, więc cały dodatkowy przychód przełożył się na zysk brutto.`,
    unitNote: 'mln USD',
    incomeEyebrow: 'Wyniki finansowe za 2020 rok',
    incomeTitle: 'Rachunek zysków i strat w skrócie',
    change: 'Zmiana',
    rows: {
      revenue: 'Przychody', cogs: 'Koszt własny sprzedaży', gross: 'Zysk brutto ze sprzedaży',
      salesMarketing: 'Sprzedaż i marketing', research: 'Badania i rozwój',
      admin: 'Koszty ogólnego zarządu', stockComp: 'Wynagrodzenia w formie akcji',
      depreciation: 'Amortyzacja', opex: 'Koszty operacyjne razem',
      operating: 'Wynik operacyjny', net: 'Zysk (strata) netto',
    },
    incomeNote: (f) => `Wynik operacyjny to zysk brutto ze sprzedaży pomniejszony o koszty operacyjne. Zysk netto za 2020 rok obejmuje ${f.money(2620248)} niepieniężnych zysków z wyceny warrantów i pochodnego zobowiązania z tytułu akcji uprzywilejowanych, ${f.money(463411)} dodatnich różnic kursowych oraz ${f.money(1062437)} kosztów odsetek.`,
    source: 'Źródło: zbadane skonsolidowane sprawozdanie finansowe za 2020 rok (MSSF), w dolarach amerykańskich.',
    balanceEyebrow: 'Sytuacja finansowa',
    balanceTitle: 'Mocniejszy bilans',
    cash: 'Środki pieniężne',
    equity: 'Kapitał własny',
    liabilities: 'Zobowiązania razem',
    assets: 'Aktywa razem',
    balancePoints: (f) => [
      `Zobowiązania z tytułu obligacji spadły z ${f.money(5871293)} do ${f.money(2558248)}`,
      `Odroczona płatność za przejęcie zmalała z ${f.money(1650000, 2)} do ${f.money(450000, 2)}`,
      `Na koniec roku: akcje uprzywilejowane o wartości ${f.money(2504044)} i związane z nimi zobowiązanie pochodne w kwocie ${f.money(2901787)}`,
    ],
    goalsEyebrow: 'Plany',
    goalsTitle: 'Cele na najbliższy czas',
    goal1: 'Partnerstwa kliniczne',
    goal1Text: 'Poszerzamy współpracę z liderami klinicznymi.',
    goal2: 'Ekspansja handlowa',
    goal2Text: 'Szukamy partnerów w różnych typach placówek, specjalizacjach i regionach, żeby przyspieszyć wdrożenia.',
    goal3: 'Innowacje',
    goal3Text: (f) => `Dalej inwestujemy w innowacje. Wydatki na badania i rozwój wzrosły w 2020 roku o ${f.change(FIG.research).slice(1)}, do ${f.money(FIG.research[0])}.`,
    summaryEyebrow: 'Podsumowanie',
    summaryTitle: 'Najważniejsze wnioski',
    summaryPoints: (f) => [
      `Przychody ${f.money(FIG.revenue[0])}, o ${f.change(FIG.revenue).slice(1)} więcej niż rok wcześniej`,
      `Marża brutto ${f.percent(66.1)} wobec ${f.percent(56.5)} rok wcześniej`,
      `Zysk operacyjny ${f.money(FIG.operating[0])} po stracie ${f.money(-FIG.operating[1])} w 2019 roku`,
      `Środki pieniężne wyższe o ${f.change(FIG.cash).slice(1)}, kapitał własny o ${f.change(FIG.equity).slice(1)}`,
      'Rynek światowy, który ma rosnąć o 11% rocznie do 2028 roku',
    ],
    thanks: 'Dziękujemy',
    contact: 'Relacje inwestorskie',
    contactName: 'Tomek Klekowski',
  },
};

// ─── Styles ───
const CSS = `
@font-face { font-family: 'Instrument Sans'; font-weight: 400 700; src: url(${asset('fonts/instrument-sans-latin-ext.woff2')}) format('woff2');
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7, U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20C4, U+2113, U+2C60-2C7F, U+A720-A7FF; }
@font-face { font-family: 'Instrument Sans'; font-weight: 400 700; src: url(${asset('fonts/instrument-sans-latin.woff2')}) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
:root { --ink: #0f1416; --band: #182024; --paper: #ffffff; --soft: #f5f3f0; --text: #465055; --strong: #12181b; --muted: #647077;
  --line: #e3e0dc; --accent: #0f766e; --accent-bright: #2dd4bf; --on-dark: #f2f5f6; --on-dark-muted: #b4bdc2; }
@page { size: 1280px 720px; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font: 400 20px/1.5 'Instrument Sans', arial, sans-serif; color: var(--text); background: var(--paper); }
.slide { position: relative; width: 1280px; height: 720px; padding: 60px 72px 72px; overflow: hidden; display: flex; flex-direction: column; break-after: page; background: var(--paper); }
.slide.dark { background: var(--ink); color: var(--on-dark-muted); }
.slide.soft { background: var(--soft); }
.eyebrow { font-weight: 600; font-size: 14px; letter-spacing: .14em; text-transform: uppercase; color: var(--accent); margin-bottom: 14px; }
.dark .eyebrow { color: var(--accent-bright); }
h1 { font-weight: 700; font-size: 84px; line-height: 1.02; letter-spacing: -.025em; color: var(--on-dark); }
h2 { font-weight: 700; font-size: 42px; line-height: 1.12; letter-spacing: -.02em; color: var(--strong); max-width: 22em; text-wrap: balance; }
.dark h2 { color: var(--on-dark); }
h3 { font-weight: 600; font-size: 22px; line-height: 1.25; color: var(--strong); }
.lead { font-size: 23px; line-height: 1.45; max-width: 34em; margin-top: 18px; }
.body { flex: 1; display: flex; flex-direction: column; justify-content: center; min-height: 0; margin-top: 28px; }
.foot { position: absolute; left: 72px; right: 72px; bottom: 28px; display: flex; justify-content: space-between; font-size: 13px; color: var(--muted); }
.dark .foot { color: var(--on-dark-muted); }
.logo { font-weight: 700; font-size: 22px; letter-spacing: -.01em; color: var(--strong); }
.dark .logo { color: var(--on-dark); }
.source { font-size: 13px; line-height: 1.45; color: var(--muted); margin-top: 18px; max-width: 78em; }

/* Photo backgrounds and split layouts */
.bg { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.shade { position: absolute; inset: 0; background: linear-gradient(90deg, rgb(15 20 22 / .94) 0%, rgb(15 20 22 / .72) 34%, rgb(15 20 22 / 0) 66%); }
.over { position: relative; display: flex; flex-direction: column; height: 100%; }
.split { flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center; min-height: 0; margin-top: 28px; }
.split img, .photo { width: 100%; height: 100%; max-height: 430px; object-fit: cover; border-radius: 16px; }

/* Numbers */
.kpis { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px; }
.kpi { padding: 34px 28px 32px; border: 1px solid var(--line); border-radius: 16px; background: var(--paper); }
.kpi-num { font-weight: 700; font-size: 56px; line-height: 1; letter-spacing: -.03em; color: var(--accent); white-space: nowrap; }
.kpis.pl .kpi-num { font-size: 35px; }
.kpi-label { font-weight: 600; font-size: 20px; color: var(--strong); margin-top: 20px; }
.kpi-sub { font-size: 17px; color: var(--muted); margin-top: 4px; }
.facts { display: grid; grid-template-columns: repeat(3, auto); gap: 36px; margin-top: 34px; justify-content: start; }
.fact-num { font-weight: 700; font-size: 44px; line-height: 1; letter-spacing: -.03em; color: var(--accent); white-space: nowrap; }
.dark .fact-num { color: var(--accent-bright); }
.fact-label { font-size: 16px; line-height: 1.35; margin-top: 10px; max-width: 13em; }
.big-num { font-weight: 700; font-size: 92px; line-height: 1; letter-spacing: -.035em; color: var(--accent-bright); white-space: nowrap; }
.big-num.pl { font-size: 68px; }

/* Cards */
.cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.card { display: flex; flex-direction: column; border: 1px solid var(--line); border-radius: 16px; overflow: hidden; background: var(--paper); }
.card .plate { height: 230px; display: grid; place-items: center; padding: 18px; background: #fff; border-bottom: 1px solid var(--line); }
.card .plate img { max-width: 100%; max-height: 194px; object-fit: contain; }
.card .cover { height: 230px; width: 100%; object-fit: cover; }
.card .text { padding: 20px 22px 24px; font-size: 17px; line-height: 1.45; }
.card h3 { margin-bottom: 6px; }

/* Chart */
.chart { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: end; }
.group { display: flex; flex-direction: column; }
.bars { display: flex; align-items: flex-end; gap: 28px; height: 300px; border-bottom: 2px solid var(--line); padding: 0 12px; }
.bar { flex: 1; display: flex; flex-direction: column; justify-content: flex-end; align-items: center; }
.bar i { display: block; width: 100%; border-radius: 10px 10px 0 0; background: #c9d6d4; }
.bar.now i { background: var(--accent); }
.bar b { font-weight: 700; font-size: 26px; color: var(--strong); margin-bottom: 8px; }
.years { display: flex; gap: 28px; padding: 8px 12px 0; font-size: 15px; color: var(--muted); }
.years span { flex: 1; text-align: center; }
.group h3 { margin-bottom: 18px; }
.group h3 small { font-weight: 600; font-size: 16px; color: var(--accent); margin-left: 10px; }

/* Table */
table { width: 100%; border-collapse: collapse; font-size: 17px; line-height: 1.2; }
th, td { padding: 8px 14px; text-align: right; border-bottom: 1px solid var(--line); font-variant-numeric: tabular-nums; }
th:first-child, td:first-child { text-align: left; padding-left: 0; }
thead th { font-weight: 600; font-size: 14px; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); border-bottom: 2px solid var(--strong); }
tr.total td { font-weight: 700; color: var(--strong); background: var(--soft); }
tr.total td:first-child { padding-left: 14px; }
td.now { font-weight: 600; color: var(--strong); }

/* Lists */
ul.points { list-style: none; display: grid; gap: 16px; }
ul.points li { position: relative; padding-left: 34px; font-size: 21px; line-height: 1.4; color: var(--strong); }
ul.points li::before { content: ""; position: absolute; left: 0; top: .45em; width: 14px; height: 14px; border-radius: 50%; background: var(--accent); }
ul.points.small li { font-size: 18px; }
`;

// ─── Slides ───
function buildSlides(lang) {
  const t = TEXT[lang];
  const f = makeFormat(lang);
  const text = (value) => (typeof value === 'function' ? value(f) : value);
  const kpi = (number, label, sub) =>
    `<div class="kpi"><p class="kpi-num">${number}</p><p class="kpi-label">${label}</p><p class="kpi-sub">${sub}</p></div>`;
  const row = (key, cls = '') => {
    const pair = FIG[key];
    const flipped = pair[0] > 0 !== pair[1] > 0;
    return `<tr class="${cls}"><td>${t.rows[key]}</td><td class="now">${f.cell(pair[0])}</td><td>${f.cell(pair[1])}</td><td>${flipped ? '' : f.change(pair)}</td></tr>`;
  };
  const bars = (pair, title) => {
    const scale = 290 / (FIG.revenue[0] / 1e6);
    const bar = (value, cls) => `<div class="bar ${cls}"><b>${f.cell(value)}</b><i style="height:${Math.round(value / 1e6 * scale)}px"></i></div>`;
    return `<div class="group"><h3>${title}<small>${f.change(pair)}</small></h3><div class="bars">${bar(pair[1], '')}${bar(pair[0], 'now')}</div><div class="years"><span>2019</span><span>2020</span></div></div>`;
  };
  const points = (items, cls = '') => `<ul class="points ${cls}">${items.map((item) => `<li>${item}</li>`).join('')}</ul>`;
  const head = (eyebrow, title) => `<p class="eyebrow">${eyebrow}</p><h2>${text(title)}</h2>`;

  const slides = [
    // 1. Cover
    `<section class="slide dark"><img class="bg" src="${photo('01-hero-care')}" alt=""><div class="shade"></div>
      <div class="over"><p class="logo">vet-eye</p>
      <div style="margin-top:auto;margin-bottom:auto"><p class="eyebrow">${t.coverEyebrow}</p><h1>${t.coverTitle}</h1><p class="lead">${t.coverBy}</p></div></div></section>`,

    // 2. Safe harbor
    `<section class="slide soft">${head('Vet-Eye S.A.', t.safeTitle)}
      <div class="body" style="font-size:16.5px;line-height:1.55;gap:14px;max-width:1040px">${t.safeText.map((p) => `<p>${p}</p>`).join('')}</div></section>`,

    // 3. Highlights
    `<section class="slide">${head(t.glanceEyebrow, t.glanceTitle)}<p class="lead">${t.glanceLead}</p>
      <div class="body"><div class="kpis ${lang}">
        ${kpi(f.money(FIG.revenue[0]), t.revenue, f.change(FIG.revenue) + ' ' + t.versus)}
        ${kpi(f.percent(66.1), t.grossMargin, f.percent(56.5) + ' ' + t.in2019)}
        ${kpi(f.money(FIG.operating[0]), t.operatingProfit, f.money(FIG.operating[1]) + ' ' + t.in2019)}
        ${kpi(f.money(FIG.net[0]), t.netIncome, f.money(FIG.net[1]) + ' ' + t.in2019)}
      </div><p class="source">${t.source}</p></div></section>`,

    // 4. What we do
    `<section class="slide">${head(t.aboutEyebrow, t.aboutTitle)}
      <div class="split"><div><p class="lead" style="margin-top:0">${t.aboutLead}</p>
        <div class="facts"><div><p class="fact-num">2</p><p class="fact-label">${t.sites}</p></div>
        <div><p class="fact-num">45+</p><p class="fact-label">${t.employees}</p></div>
        <div><p class="fact-num">${t.clinicsNumber}</p><p class="fact-label">${t.clinics}</p></div></div></div>
        <img src="${photo('07-engineering')}" alt=""></div></section>`,

    // 5. Products
    `<section class="slide soft">${head(t.productsEyebrow, t.productsTitle)}
      <div class="body"><div class="cards">
        <div class="card"><div class="plate"><img src="${image('img/vet-pro-key-75.webp')}" alt=""></div><div class="text"><h3>vet pro-key 75</h3><p>${t.productProKey}</p></div></div>
        <div class="card"><div class="plate"><img src="${image('img/vet-portable-15.webp')}" alt=""></div><div class="text"><h3>vet portable 15</h3><p>${t.productPortable}</p></div></div>
        <div class="card"><div class="plate"><img src="${image('img/vet-pro-70.webp')}" alt=""></div><div class="text"><h3>vet pro 70</h3><p>${t.productPro70}</p></div></div>
      </div></div></section>`,

    // 6. Market
    `<section class="slide dark">${head(t.marketEyebrow, t.marketTitle)}
      <div class="split"><div><p class="big-num ${lang}">${t.marketSizeNumber}</p><p class="lead" style="margin-top:14px">${t.marketSize}</p>
        <div class="facts" style="margin-top:30px"><div><p class="fact-num">11%</p><p class="fact-label" style="max-width:none">${t.marketGrowth}</p></div></div>
        <p class="source" style="color:var(--on-dark-muted)">${t.marketSource}</p></div>
        <img src="${photo('02-dog-ultrasound')}" alt=""></div></section>`,

    // 7. Growth chart
    `<section class="slide">${head(t.growthEyebrow, t.growthTitle)}
      <div class="body"><div class="chart">${bars(FIG.revenue, t.revenue)}${bars(FIG.gross, t.grossProfit)}</div>
      <p class="source" style="font-size:17px;color:var(--text)">${text(t.growthNote)} <span style="color:var(--muted)">(${t.unitNote})</span></p></div></section>`,

    // 8. Income statement
    `<section class="slide">${head(t.incomeEyebrow, t.incomeTitle)}
      <div class="body" style="margin-top:18px"><table><thead><tr><th>${t.unitNote}</th><th>2020</th><th>2019</th><th>${t.change}</th></tr></thead><tbody>
        ${row('revenue')}${row('cogs')}${row('gross', 'total')}${row('salesMarketing')}${row('research')}${row('admin')}${row('stockComp')}${row('depreciation')}${row('opex')}${row('operating', 'total')}${row('net', 'total')}
      </tbody></table><p class="source" style="margin-top:12px">${text(t.incomeNote)} ${t.source}</p></div></section>`,

    // 9. Balance sheet
    `<section class="slide soft">${head(t.balanceEyebrow, t.balanceTitle)}
      <div class="body"><div class="kpis ${lang}">
        ${kpi(f.money(FIG.cash[0]), t.cash, f.change(FIG.cash) + ' ' + t.versus)}
        ${kpi(f.money(FIG.equity[0]), t.equity, f.change(FIG.equity) + ' ' + t.versus)}
        ${kpi(f.money(FIG.liabilities[0]), t.liabilities, f.change(FIG.liabilities) + ' ' + t.versus)}
        ${kpi(f.money(FIG.assets[0]), t.assets, f.change(FIG.assets) + ' ' + t.versus)}
      </div><div style="margin-top:30px">${points(text(t.balancePoints), 'small')}</div><p class="source">${t.source}</p></div></section>`,

    // 10. Goals
    `<section class="slide">${head(t.goalsEyebrow, t.goalsTitle)}
      <div class="body"><div class="cards">
        <div class="card"><img class="cover" src="${photo('06-clinical-training')}" alt=""><div class="text"><h3>${t.goal1}</h3><p>${t.goal1Text}</p></div></div>
        <div class="card"><img class="cover" src="${photo('09-vet-consultation')}" alt=""><div class="text"><h3>${t.goal2}</h3><p>${t.goal2Text}</p></div></div>
        <div class="card"><img class="cover" src="${photo('08-quality-control')}" alt=""><div class="text"><h3>${t.goal3}</h3><p>${text(t.goal3Text)}</p></div></div>
      </div></div></section>`,

    // 11. Summary
    `<section class="slide">${head(t.summaryEyebrow, t.summaryTitle)}
      <div class="split" style="grid-template-columns:1.15fr 1fr">${points(text(t.summaryPoints))}<img src="${photo('03-cat-care')}" alt=""></div></section>`,

    // 12. Thank you
    `<section class="slide dark"><img class="bg" src="${photo('10-support')}" alt="" style="object-position:70% 30%"><div class="shade" style="background:linear-gradient(90deg, rgb(15 20 22 / .96) 0%, rgb(15 20 22 / .82) 40%, rgb(15 20 22 / .1) 78%)"></div>
      <div class="over"><p class="logo">vet-eye</p>
      <div style="margin-top:auto;margin-bottom:auto"><h1>${t.thanks}</h1><p class="eyebrow" style="margin:36px 0 6px">${t.contact}</p><p class="lead" style="margin-top:0;color:var(--on-dark)">${t.contactName}</p></div></div></section>`,
  ];

  // Footer with page number on every slide except the cover and the closing slide.
  return slides.map((html, index) => {
    if (index === 0 || index === slides.length - 1) return html;
    const foot = `<div class="foot"><span>${t.footer}</span><span>${index + 1}</span></div>`;
    return html.replace(/<\/section>$/, foot + '</section>');
  });
}

function buildHtml(lang) {
  return `<!DOCTYPE html><html lang="${lang}"><head><meta charset="utf-8"><title>${TEXT[lang].docTitle}</title><style>${CSS}</style></head><body>${buildSlides(lang).join('\n')}</body></html>`;
}

// ─── Build ───
prepareImages();
const keepHtml = process.argv.includes('--keep-html');
for (const lang of ['en', 'pl']) {
  const htmlPath = join(workDir, `deck-${lang}.html`);
  const pdfPath = join(ROOT, 'assets', 'docs', `2020-investor-presentation-${lang}.pdf`);
  writeFileSync(htmlPath, buildHtml(lang));
  execFileSync(CHROME, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--no-pdf-header-footer',
    '--user-data-dir=' + join(workDir, 'profile-' + lang),
    '--virtual-time-budget=8000', '--print-to-pdf=' + pdfPath, pathToFileURL(htmlPath).href,
  ], { stdio: 'ignore' });
  console.log('written ' + pdfPath);
}
if (keepHtml) console.log('HTML kept in ' + workDir);
else rmSync(workDir, { recursive: true, force: true });
