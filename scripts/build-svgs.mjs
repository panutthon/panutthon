#!/usr/bin/env node
// Generates the terminal-style README SVGs in dark and light variants.
// Usage: node scripts/build-svgs.mjs   (writes into assets/)
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FONT = "ui-monospace, 'Cascadia Code', 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";

const PALETTES = {
  dark: { bg: "#0d1117", chrome: "#161b22", border: "#30363d", text: "#c9d1d9", muted: "#8b949e", accent: "#58a6ff", prompt: "#3fb950", metric: "#f0883e" },
  light: { bg: "#ffffff", chrome: "#f6f8fa", border: "#d0d7de", text: "#1f2328", muted: "#656d76", accent: "#0969da", prompt: "#1a7f37", metric: "#bc4c00" },
};

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// A segment list: strings are plain text, [str] is highlighted as a metric.
const spans = (parts, cls = "m") =>
  parts.map((p) => (Array.isArray(p) ? `<tspan class="${cls}">${esc(p[0])}</tspan>` : esc(p))).join("");

function frame(p, { height, title, label, body }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="${height}" viewBox="0 0 1000 ${height}" role="img" aria-label="${esc(label)}">
  <style>
    text { font-family: ${FONT}; fill: ${p.text}; font-size: 19px; }
    .muted { fill: ${p.muted}; }
    .accent { fill: ${p.accent}; }
    .prompt { fill: ${p.prompt}; }
    .m { fill: ${p.metric}; font-weight: 700; }
    .b { font-weight: 700; }
    .title { font-size: 16px; fill: ${p.muted}; }
    .name { font-size: 36px; font-weight: 700; fill: ${p.accent}; }
    .small { font-size: 17px; fill: ${p.muted}; }
    .cursor { fill: ${p.prompt}; animation: blink 1.1s steps(1) infinite; }
    @keyframes blink { 50% { opacity: 0; } }
  </style>
  <rect x="1" y="1" width="998" height="${height - 2}" rx="12" fill="${p.bg}" stroke="${p.border}" stroke-width="1.5"/>
  <path d="M1 13a12 12 0 0 1 12-12h974a12 12 0 0 1 12 12v31H1z" fill="${p.chrome}"/>
  <line x1="1" y1="44" x2="999" y2="44" stroke="${p.border}" stroke-width="1.5"/>
  <circle cx="26" cy="22.5" r="6.5" fill="#ff5f56"/>
  <circle cx="48" cy="22.5" r="6.5" fill="#ffbd2e"/>
  <circle cx="70" cy="22.5" r="6.5" fill="#27c93f"/>
  <text x="500" y="28" text-anchor="middle" class="title">${esc(title)}</text>
${body}
</svg>
`;
}

function hero(p) {
  const rows = [
    ["role", "Full Stack Developer · ERP & E-commerce Integration"],
    ["location", "Bangkok, Thailand"],
    ["stack", "TypeScript · Node.js · NestJS · React · SQL Server"],
    ["erp", "Microsoft Dynamics 365 Business Central"],
    ["integrations", "Shopee · Lazada · TikTok Shop"],
  ];
  const lines = [
    `  <text x="36" y="86"><tspan class="prompt">❯</tspan> whoami</text>`,
    `  <text x="36" y="134" class="name">Panutthon Chanachon</text>`,
  ];
  let y = 176;
  for (const [k, v] of rows) {
    lines.push(`  <text x="36" y="${y}" class="muted">${esc(k.padEnd(14, "."))}</text><text x="210" y="${y}">${esc(v)}</text>`);
    y += 32;
  }
  y += 14;
  const swatches = [p.text, p.accent, p.prompt, p.metric, "#ff5f56", "#ffbd2e", "#a371f7", p.muted];
  lines.push(swatches.map((c, i) => `  <rect x="${36 + i * 34}" y="${y - 18}" width="28" height="18" rx="3" fill="${c}"/>`).join("\n"));
  y += 40;
  lines.push(`  <text x="36" y="${y}"><tspan class="prompt">❯</tspan></text><rect class="cursor" x="58" y="${y - 15}" width="10" height="19"/>`);
  return frame(p, {
    height: y + 28,
    title: "panutthon@bangkok: ~",
    label: "Panutthon Chanachon — Full Stack Developer, ERP & E-commerce Integration, Bangkok",
    body: lines.join("\n"),
  });
}

const PROJECTS = [
  {
    slug: "case-platform",
    title: "Case Management Platform",
    tag: "solo · full-stack",
    oneLiner: "Rebuilt a legacy PHP support-case system as NestJS + React on SQL Server",
    metrics: [
      [["6+ min → 145 ms"], " case-list API (server-side paging + indexes)"],
      [["69,681"], " cases · ", ["338,298"], " events · ", ["962"], " users migrated, ", ["0"], " errors"],
      [["~5 s → ~0.4 s"], " Kanban first render · ", ["1,959"], " automated tests"],
    ],
    stack: "TypeScript · NestJS · Prisma · React · SQL Server · AI copilot",
  },
  {
    slug: "warehouse",
    title: "Handheld Warehouse System for ERP",
    tag: "top contributor · team of 4–5",
    oneLiner: "Barcode-scanning handheld app posting stock moves into Business Central",
    metrics: [
      [["20+"], " warehouse & production flows: receipts, transfers, counts"],
      [["Live"], " for multiple client companies from one codebase"],
      [["2,650"], " automated tests · delta sync · audited BC post log"],
    ],
    stack: "Next.js · React · Express · SQL Server · D365 Business Central API",
  },
  {
    slug: "marketplace-erp",
    title: "Marketplace → ERP Integration",
    tag: "lead backend dev · ~84% of commits",
    oneLiner: "Syncs orders, returns and payouts from 3 marketplaces into Business Central",
    metrics: [
      [["3 → 1"], " Shopee · Lazada · TikTok Shop into one ERP"],
      [["Multi-tenant"], " OAuth auto-refresh · per-shop schedulers + checkpoints"],
      [["Audited"], " export queue (NTLM) · pre-deploy tenant-isolation guards"],
    ],
    stack: "Node.js · Express · Sequelize · MySQL/PostgreSQL/MSSQL · Docker",
  },
];

function card(p, pr) {
  const lines = [
    `  <text x="36" y="84"><tspan class="prompt">●</tspan> <tspan class="b">${esc(pr.title)}</tspan></text>`,
    `  <text x="964" y="84" text-anchor="end" class="small">${esc(pr.tag)}</text>`,
    `  <text x="36" y="116" class="muted">${esc(pr.oneLiner)}</text>`,
  ];
  let y = 158;
  for (const m of pr.metrics) {
    lines.push(`  <text x="36" y="${y}"><tspan class="muted">›</tspan> ${spans(m)}</text>`);
    y += 32;
  }
  y += 8;
  lines.push(`  <text x="36" y="${y}" class="small">stack: ${esc(pr.stack)}</text>`);
  return frame(p, { height: y + 28, title: `~/${pr.slug}`, label: `${pr.title} — ${pr.oneLiner}`, body: lines.join("\n") });
}

mkdirSync(join(ROOT, "assets", "projects"), { recursive: true });
for (const [mode, p] of Object.entries(PALETTES)) {
  writeFileSync(join(ROOT, "assets", `hero-${mode}.svg`), hero(p));
  for (const pr of PROJECTS) writeFileSync(join(ROOT, "assets", "projects", `${pr.slug}-${mode}.svg`), card(p, pr));
}
console.log("wrote hero + project SVGs");
