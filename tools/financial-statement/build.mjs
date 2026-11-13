// Builds the 2020 consolidated financial statements as a designed A4 PDF.
// Run: node tools/financial-statement/build.mjs
// Output: assets/docs/2020_Consolidated_Financial_Statement_VET-EYE.pdf
// The wording and every figure are those of the original audited document;
// this file only controls the layout.
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const asset = (path) => pathToFileURL(join(ROOT, 'assets', path)).href;
const CHROME = process.env.CHROME || 'google-chrome';
const OUTPUT = join(ROOT, 'assets', 'docs', '2020_Consolidated_Financial_Statement_VET-EYE.pdf');
const NONE = '–';

// ─── Auditor's report ───
const REPORT_PAGE_1 = [
  ['h', 'Opinion'],
  ['p', 'We have audited the consolidated financial statements of Vet-Eye S.A. (the “Company”), which comprise the consolidated statements of financial position as at December 31, 2020, and December 31, 2019 and the consolidated statements of operations and comprehensive loss, consolidated statements of changes in equity and consolidated statements of cash flows for the years then ended, and notes to the consolidated financial statements, including a summary of significant accounting policies.'],
  ['p', 'In our opinion, the accompanying consolidated financial statements, present fairly, in all material respects, the consolidated financial position of the Company as at December 31, 2020 and December 31, 2019, and its consolidated financial performance and its consolidated cash flows for the years then ended in accordance with International Financial Reporting Standards (IFRSs).'],
  ['h', 'Basis for Opinion'],
  ['p', 'We conducted our audit in accordance with generally accepted auditing standards. Our responsibilities under those standards are further described in the Auditor’s Responsibilities for the Audit of the Consolidated Financial Statements section of our report. We are independent of the Company in accordance with the ethical requirements that are relevant to our audit of the consolidated financial statements, and we have fulfilled our other ethical responsibilities in accordance with these requirements. We believe that the audit evidence we have obtained is sufficient and appropriate to provide a basis for our opinion.'],
];
const REPORT_PAGE_2 = [
  ['h', 'Information Other than the Consolidated Financial Statements and Auditor’s Report Thereon'],
  ['p', 'Management is responsible for the other information. The other information comprises the Management Discussion and Analysis but does not include the consolidated financial statements and our auditor’s report thereon.'],
  ['p', 'Our opinion on the consolidated financial statements does not cover the other information and we do not express any form of assurance conclusion thereon.'],
  ['p', 'In connection with our audit of the consolidated financial statements, our responsibility is to read the other information and, in doing so, consider whether the other information is materially inconsistent with the consolidated financial statements or our knowledge obtained in the audit or otherwise appears to be materially misstated.'],
  ['p', 'If, based on the work we have performed, we conclude that there is a material misstatement of this other information, we are required to report that fact. We have nothing to report in this regard.'],
  ['h', 'Responsibilities of Management and Those Charged with Governance for the Consolidated Financial Statements'],
  ['p', 'Management is responsible for the preparation and fair presentation of the consolidated financial statements in accordance with International Financial Reporting Standards (IFRSs), and for such internal control as management determines is necessary to enable the preparation of consolidated financial statements that are free from material misstatement, whether due to fraud or error. In preparing the consolidated financial statements, management is responsible for assessing the Company’s ability to continue as a going concern, disclosing, as applicable, matters related to going concern and using the going concern basis of accounting unless management either intends to liquidate the Company or to cease operations, or has no realistic alternative but to do so. Those charged with governance are responsible for overseeing the Company’s financial reporting process.'],
  ['sign', 'The engagement partner on the audit resulting in this independent auditor’s report is Albert Lis.'],
];

// ─── Statements ───
// Row kinds: section (caps heading), group (sub-heading), item, sum (unlabelled subtotal),
// total (bold with rule), grand (bold with double rule). A leading "$" marks rows that carry
// a currency sign in the original.
const POSITION = [
  ['section', 'Assets'],
  ['group', 'Current assets'],
  ['item', 'Cash and cash equivalents', '$ 2,827,882', '$ 2,425,468'],
  ['item', 'Trade and other receivables', '2,531,208', '1,578,371'],
  ['item', 'Inventory', '891,331', '778,939'],
  ['item', 'Prepaid expenses and deposits', '476,633', '433,272'],
  ['sum', '', '6,727,054', '5,216,050'],
  ['group', 'Non-current assets'],
  ['item', 'Property and equipment', '63,395', '152,497'],
  ['item', 'Intangible assets', '6,785,187', '7,620,287'],
  ['item', 'Goodwill', '1,868,130', '1,868,130'],
  ['grand', 'Total assets', '$ 15,443,766', '$ 14,856,964'],
  ['section', 'Liabilities and shareholders’ equity'],
  ['group', 'Current liabilities'],
  ['item', 'Trade payables and accrued liabilities', '$ 2,042,424', '$ 2,191,815'],
  ['item', 'Deferred revenue', '899,701', '892,570'],
  ['item', 'Debentures', '2,558,248', '2,152,841'],
  ['item', 'Deferred consideration on acquisition', '450,000', '1,200,000'],
  ['sum', '', '5,950,373', '6,437,226'],
  ['group', 'Non-current liabilities'],
  ['item', 'Debentures', NONE, '3,718,452'],
  ['item', 'Preferred shares', '2,504,044', NONE],
  ['item', 'Derivative preferred share liability', '2,901,787', NONE],
  ['item', 'Warrants', '155', '1,372,122'],
  ['item', 'Lease liability', NONE, '61,011'],
  ['item', 'Deferred consideration on acquisition', NONE, '450,000'],
  ['total', 'Total liabilities', '11,356,359', '12,038,811'],
  ['group', 'Shareholders’ equity'],
  ['item', 'Share capital', '$ 50,944,234', '50,944,234'],
  ['item', 'Stock-based payment reserve', '3,139,368', '2,799,476'],
  ['item', 'Warrants reserve', '494,287', '381,374'],
  ['item', 'Accumulated other comprehensive income', '474,458', '474,458'],
  ['item', 'Deficit', '(50,964,940)', '(51,781,389)'],
  ['total', 'Total shareholders’ equity', '4,087,407', '2,818,153'],
  ['grand', 'Total liabilities and shareholders’ equity', '$ 15,443,766', '14,856,964'],
];

const OPERATIONS = [
  ['total', 'Revenues', '$ 16,215,812', '$ 12,688,752'],
  ['item', 'Cost of goods sold', '5,495,839', '5,520,050'],
  ['sum', '', '10,719,973', '7,168,702'],
  ['group', 'Expenses'],
  ['item', 'Sales and marketing', '4,935,183', '4,855,988'],
  ['item', 'Research and development', '1,162,872', '1,039,827'],
  ['item', 'Administration', '2,522,741', '2,861,091'],
  ['item', 'Stock-based compensation', '339,892', '628,280'],
  ['item', 'Depreciation and amortization', '903,384', '841,588'],
  ['sum', '', '9,864,072', '10,226,774'],
  ['total', 'Operating loss', '865,001', '(3,058,072)'],
  ['group', 'Other expenses/(earnings)'],
  ['item', 'Change in fair value of Polish zloty denominated warrants', '(1,371,967)', '(1,593,244)'],
  ['item', 'Change in fair value of derivative preferred share liability', '(1,248,281)', NONE],
  ['item', 'Foreign exchange (gain) loss', '(463,411)', '439,145'],
  ['item', 'Other non-operating expenses', '60,673', NONE],
  ['item', 'Interest', '1,062,437', '591,042'],
  ['sum', '', '(1,960,549)', '(563,057)'],
  ['total', 'Net income (loss) and comprehensive income (loss) before income taxes', '2,816,450', '(2,495,015)'],
  ['item', 'Income tax expense', NONE, NONE],
  ['grand', 'Net income (loss) and comprehensive income (loss) for the year', '$ 2,816,450', '$ (2,495,015)'],
  ['gap'],
  ['item', 'Income (loss) per share – basic', '$ 0.08', '$ 0.08'],
  ['item', 'Weighted average number of shares outstanding – basic', '37,915,820', '31,668,318'],
  ['item', 'Income (loss) per share – diluted', '$ 0.08', '$ 0.08'],
  ['item', 'Weighted average number of shares outstanding – diluted', '44,485,873', '31,668,318'],
];

// ─── Styles ───
const CSS = `
@font-face { font-family: 'Instrument Sans'; font-weight: 400 700; src: url(${asset('fonts/instrument-sans-latin.woff2')}) format('woff2'); }
:root { --ink: #0f1416; --paper: #ffffff; --soft: #f5f3f0; --text: #3c464b; --strong: #12181b; --muted: #647077;
  --line: #e3e0dc; --accent: #0f766e; --accent-bright: #2dd4bf; --on-dark: #f2f5f6; --on-dark-muted: #b4bdc2; }
@page { size: 210mm 297mm; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font: 400 10.5pt/1.55 'Instrument Sans', arial, sans-serif; color: var(--text); }
.page { position: relative; width: 210mm; height: 297mm; padding: 30mm 22mm 26mm; overflow: hidden; break-after: page; background: var(--paper); }
.top { position: absolute; left: 22mm; right: 22mm; top: 13mm; display: flex; justify-content: space-between; align-items: baseline; padding-bottom: 3mm; border-bottom: 1px solid var(--line); font-size: 8.5pt; color: var(--muted); }
.logo { font-weight: 700; font-size: 13pt; letter-spacing: -.01em; color: var(--strong); }
.foot { position: absolute; left: 22mm; right: 22mm; bottom: 12mm; display: flex; justify-content: space-between; font-size: 8.5pt; color: var(--muted); }
.eyebrow { font-weight: 600; font-size: 8.5pt; letter-spacing: .14em; text-transform: uppercase; color: var(--accent); margin-bottom: 3mm; }
h1 { font-weight: 700; font-size: 24pt; line-height: 1.12; letter-spacing: -.02em; color: var(--strong); margin-bottom: 2mm; }
.sub { font-size: 10.5pt; color: var(--muted); margin-bottom: 8mm; }
h2 { font-weight: 600; font-size: 12.5pt; line-height: 1.3; color: var(--strong); margin: 7mm 0 2.5mm; }
h2:first-of-type { margin-top: 0; }
p + p { margin-top: 3mm; }
.sign { margin-top: 9mm; padding-top: 5mm; border-top: 1px solid var(--line); font-weight: 600; color: var(--strong); }

/* Cover */
.cover { background: var(--ink); color: var(--on-dark-muted); padding: 22mm; display: flex; flex-direction: column; }
.cover .logo { color: var(--on-dark); font-size: 17pt; }
.cover .eyebrow { color: var(--accent-bright); margin-bottom: 6mm; }
.cover h1 { font-size: 40pt; line-height: 1.04; letter-spacing: -.025em; color: var(--on-dark); margin-bottom: 8mm; max-width: 9em; }
.cover .period { font-size: 14pt; line-height: 1.4; color: var(--on-dark); }
.cover .note { margin-top: 2mm; font-size: 10.5pt; }
.cover .rule { width: 22mm; height: 1.2mm; background: var(--accent-bright); margin-bottom: 10mm; }
.contents { margin-top: auto; border-top: 1px solid rgb(255 255 255 / .16); padding-top: 6mm; }
.contents p { display: flex; justify-content: space-between; padding: 1.6mm 0; margin: 0; color: var(--on-dark); }
.contents span:last-child { color: var(--on-dark-muted); font-variant-numeric: tabular-nums; }

/* Statement tables */
table { width: 100%; border-collapse: collapse; font-size: 10pt; line-height: 1.25; }
th, td { padding: 1.75mm 0 1.75mm 4mm; text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
th:first-child, td:first-child { text-align: left; padding-left: 0; white-space: normal; }
thead th { font-weight: 600; font-size: 8.5pt; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); border-bottom: 1.5px solid var(--strong); padding-bottom: 2.5mm; }
col.num { width: 31mm; }
tr.item td { border-bottom: 1px solid var(--line); }
tr.item td:first-child { padding-left: 5mm; }
tr.item td.now, tr.sum td.now, tr.total td.now { color: var(--strong); font-weight: 600; }
tr.section td { padding-top: 6mm; font-weight: 600; font-size: 8.5pt; letter-spacing: .14em; text-transform: uppercase; color: var(--accent); }
tr.section:first-child td { padding-top: 3mm; }
tr.group td { padding-top: 4mm; font-weight: 600; color: var(--strong); border-bottom: 1px solid var(--line); }
tr.sum td { font-weight: 600; color: var(--strong); border-bottom: 1px solid var(--line); }
tr.total td { font-weight: 700; color: var(--strong); background: var(--soft); border-bottom: 1px solid var(--line); }
tr.total td:first-child, tr.grand td:first-child { padding-left: 3mm; }
tr.total td:last-child, tr.grand td:last-child { padding-right: 3mm; }
tr.grand td { font-weight: 700; color: var(--on-dark); background: var(--ink); }
tr.gap td { height: 6mm; }
tr.item td:last-child, tr.sum td:last-child, tr.group td:last-child { padding-right: 3mm; }
thead th:last-child { padding-right: 3mm; }
.statement { padding-top: 27mm; }
.statement h1 { font-size: 17pt; }
.statement .eyebrow { margin-bottom: 2mm; }
.statement .sub { margin-bottom: 4mm; font-size: 9.5pt; }
/* Each statement must fit one page (the statement of financial position has 35 rows). */
.tight { font-size: 9pt; }
.tight th, .tight td { padding-top: .8mm; padding-bottom: .8mm; }
.tight tr.section td { padding-top: 3.2mm; }
.tight tr.group td { padding-top: 2.2mm; }
.tight tr.gap td { height: 4mm; }
`;

// ─── Pages ───
function reportBlocks(blocks) {
  return blocks.map(([kind, text]) => {
    if (kind === 'h') return `<h2>${text}</h2>`;
    if (kind === 'sign') return `<p class="sign">${text}</p>`;
    return `<p>${text}</p>`;
  }).join('');
}

function statementTable(rows, cls = '') {
  const body = rows.map(([kind, label = '', now = '', before = '']) => {
    if (kind === 'gap') return '<tr class="gap"><td colspan="3"></td></tr>';
    if (kind === 'section' || kind === 'group') return `<tr class="${kind}"><td>${label}</td><td></td><td></td></tr>`;
    return `<tr class="${kind}"><td>${label}</td><td class="now">${now}</td><td>${before}</td></tr>`;
  }).join('');
  return `<table class="${cls}"><colgroup><col><col class="num"><col class="num"></colgroup>
    <thead><tr><th>Expressed in U.S. dollars</th><th>December 31, 2020</th><th>December 31, 2019</th></tr></thead><tbody>${body}</tbody></table>`;
}

function page(number, content, cls = '') {
  return `<section class="page ${cls}"><div class="top"><span class="logo">vet-eye</span><span>Consolidated financial statements 2020</span></div>
    ${content}<div class="foot"><span>Vet-Eye S.A.</span><span>${number}</span></div></section>`;
}

const HTML = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Vet-Eye S.A. consolidated financial statements 2020</title><style>${CSS}</style></head><body>
<section class="page cover"><p class="logo">vet-eye</p>
  <div style="margin-top:62mm"><div class="rule"></div><p class="eyebrow">Vet-Eye S.A.</p><h1>Consolidated financial statements</h1>
  <p class="period">For the years ended December 31, 2020 and 2019</p><p class="note">(Expressed in U.S. dollars)</p></div>
  <div class="contents"><p><span>Independent auditor’s report</span><span>2</span></p><p><span>Consolidated statements of financial position</span><span>4</span></p><p><span>Consolidated statements of operations and comprehensive loss</span><span>5</span></p></div>
</section>
${page(2, `<p class="eyebrow">Independent auditor’s report</p><h1>Independent auditor’s report</h1><p class="sub">To the Board of Directors and Shareholders of Vet-Eye S.A.</p>${reportBlocks(REPORT_PAGE_1)}`)}
${page(3, `<p class="eyebrow">Independent auditor’s report</p>${reportBlocks(REPORT_PAGE_2)}`)}
${page(4, `<p class="eyebrow">Vet-Eye S.A.</p><h1>Consolidated statements of financial position</h1><p class="sub">As at December 31, 2020 and 2019</p>${statementTable(POSITION, 'tight')}`, 'statement')}
${page(5, `<p class="eyebrow">Vet-Eye S.A.</p><h1>Consolidated statements of operations and comprehensive loss</h1><p class="sub">For the years ended December 31, 2020 and 2019</p>${statementTable(OPERATIONS, 'tight')}`, 'statement')}
</body></html>`;

// ─── Build ───
const workDir = mkdtempSync(join(tmpdir(), 'vet-eye-statement-'));
const htmlPath = join(workDir, 'statement.html');
writeFileSync(htmlPath, HTML);
execFileSync(CHROME, [
  '--headless=new', '--disable-gpu', '--no-sandbox', '--no-pdf-header-footer',
  '--user-data-dir=' + join(workDir, 'profile'),
  '--virtual-time-budget=8000', '--print-to-pdf=' + OUTPUT, pathToFileURL(htmlPath).href,
], { stdio: 'ignore' });
rmSync(workDir, { recursive: true, force: true });
console.log('written ' + OUTPUT);
