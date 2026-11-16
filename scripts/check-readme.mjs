#!/usr/bin/env node
// Checks the profile README and its SVG assets. No dependencies.
// Usage: node scripts/check-readme.mjs   → exit 0 "OK (<n> checks)" or exit 1 with FAIL lines.
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { execSync } from "node:child_process";
import { join, dirname, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FONT_STACK = "ui-monospace, 'Cascadia Code', 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";
const DARK_ONLY = ["#0d1117", "#161b22", "#c9d1d9", "#8b949e", "#58a6ff", "#3fb950", "#f0883e"];
// Forbidden name patterns live outside the tracked tree (one regex per line, case-insensitive)
// so the public repo never spells them out. Missing file → this check is skipped with a warning.
const FORBIDDEN_FILE = join(ROOT, ".git", "forbidden-names");
const FORBIDDEN = existsSync(FORBIDDEN_FILE)
  ? readFileSync(FORBIDDEN_FILE, "utf8").split(/[\r\n]+/).map((l) => l.trim()).filter(Boolean).map((l) => new RegExp(l, "i"))
  : (console.warn("WARN checkForbidden: .git/forbidden-names not found, skipping"), []);
const MAX_X = 980;

const rel = (p) => relative(ROOT, p).split(sep).join("/");
const read = (p) => readFileSync(p, "utf8");

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    statSync(p).isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
}
const svgs = () => walk(join(ROOT, "assets")).filter((p) => p.endsWith(".svg"));

export function checkSvgsParse() {
  const fails = [];
  for (const f of svgs()) {
    const src = read(f).replace(/<!--[\s\S]*?-->/g, "").replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, "");
    const stack = [];
    for (const m of src.matchAll(/<(\/?)([A-Za-z][\w:-]*)([^>]*?)(\/?)>/g)) {
      const [, close, tag, , self] = m;
      if (self) continue;
      if (close) {
        if (stack.pop() !== tag) { fails.push(`${rel(f)}: unbalanced </${tag}>`); break; }
      } else stack.push(tag);
    }
    if (stack.length) fails.push(`${rel(f)}: unclosed <${stack.at(-1)}>`);
    if (!/^\s*(<\?xml[^>]*>\s*)?<svg[^>]*viewBox="0 0 1000 \d+"/.test(src))
      if (rel(f).startsWith("assets/skills/")) continue; // third-party icons keep their own viewBox
      else fails.push(`${rel(f)}: root <svg> must have viewBox="0 0 1000 H"`);
  }
  return fails;
}

const ownSvgs = () => svgs().filter((f) => !rel(f).startsWith("assets/skills/"));

export function checkPairs() {
  const fails = [];
  for (const f of ownSvgs()) {
    const m = f.match(/^(.*)-(dark|light)\.svg$/);
    if (!m) { fails.push(`${rel(f)}: not a -dark/-light variant`); continue; }
    const other = `${m[1]}-${m[2] === "dark" ? "light" : "dark"}.svg`;
    if (!existsSync(other)) fails.push(`${rel(f)}: missing pair ${rel(other)}`);
  }
  return fails;
}

export function checkFonts() {
  const fails = [];
  for (const f of ownSvgs()) {
    const s = read(f);
    for (const m of s.matchAll(/font-family\s*[:=]\s*"?([^;"}]+)/g))
      if (m[1].trim() !== FONT_STACK) fails.push(`${rel(f)}: font-family "${m[1].trim()}"`);
    if (/\bfont\s*:/.test(s)) fails.push(`${rel(f)}: use font-family, not font shorthand`);
    if (/<script/i.test(s)) fails.push(`${rel(f)}: contains <script>`);
    if (/@import/i.test(s)) fails.push(`${rel(f)}: contains @import`);
    if (/href="https?:/i.test(s)) fails.push(`${rel(f)}: external href`);
  }
  return fails;
}

export function checkMinFont() {
  const fails = [];
  for (const f of ownSvgs())
    for (const m of read(f).matchAll(/font-size\s*[:=]\s*"?(\d+(?:\.\d+)?)/g))
      if (Number(m[1]) < 14) fails.push(`${rel(f)}: font-size ${m[1]} < 14`);
  return fails;
}

// Estimate each <text> line's right edge: x + chars * 0.6 * font-size.
// font-size comes from the element, else from a CSS class rule, else 16.
export function checkWidth() {
  const fails = [];
  for (const f of ownSvgs()) {
    const s = read(f);
    const classSize = {};
    for (const m of s.matchAll(/\.([\w-]+)\s*\{[^}]*font-size\s*:\s*(\d+(?:\.\d+)?)/g)) classSize[m[1]] = Number(m[2]);
    const baseSize = Number((s.match(/\btext\s*\{[^}]*font-size\s*:\s*(\d+(?:\.\d+)?)/) || [])[1] ?? 16);
    for (const m of s.matchAll(/<text\b([^>]*)>([\s\S]*?)<\/text>/g)) {
      const attrs = m[1];
      const x = Number((attrs.match(/\bx="([\d.]+)"/) || [])[1] ?? 0);
      const anchor = (attrs.match(/text-anchor="(\w+)"/) || [])[1];
      const cls = (attrs.match(/class="([^"]+)"/) || [])[1]?.split(/\s+/) ?? [];
      let size = Number((attrs.match(/font-size="([\d.]+)"/) || [])[1] ?? 0);
      if (!size) size = cls.map((c) => classSize[c]).find(Boolean) ?? baseSize;
      const text = m[2].replace(/<[^>]+>/g, "").replace(/&[a-z#0-9]+;/gi, "_").trim();
      const w = text.length * 0.6 * size;
      const right = anchor === "middle" ? x + w / 2 : anchor === "end" ? x : x + w;
      if (right > MAX_X) fails.push(`${rel(f)}: text "${text.slice(0, 40)}…" ends at ~${Math.round(right)} > ${MAX_X}`);
    }
  }
  return fails;
}

export function checkLightPalette() {
  const fails = [];
  for (const f of ownSvgs().filter((p) => p.endsWith("-light.svg"))) {
    const s = read(f).toLowerCase();
    for (const c of DARK_ONLY) if (s.includes(c)) fails.push(`${rel(f)}: dark-palette color ${c}`);
  }
  return fails;
}

export function checkForbidden() {
  const fails = [];
  const files = execSync("git ls-files --cached --others --exclude-standard", { cwd: ROOT, encoding: "utf8" })
    .split("\n").filter(Boolean)
    .filter((p) => !p.startsWith("docs/superpowers/") && !p.startsWith("profile-summary-card-output/"))
    ;
  for (const p of files) {
    for (const re of FORBIDDEN) if (re.test(p)) fails.push(`path ${p} matches ${re}`);
    const full = join(ROOT, p);
    if (!existsSync(full)) continue;
    const s = read(full);
    for (const re of FORBIDDEN) if (re.test(s)) fails.push(`${p} contains ${re}`);
  }
  return fails;
}

const readme = () => read(join(ROOT, "README.md"));

export function checkReadmeRefs() {
  const fails = [];
  const s = readme();
  for (const m of s.matchAll(/(?:src|srcset)="([^"]+)"/g)) {
    const ref = m[1];
    if (/^https?:/.test(ref)) continue;
    if (!existsSync(join(ROOT, ref.replace(/^\.\//, "")))) fails.push(`README references missing ${ref}`);
  }
  if (/streak-stats\.demolab\.com/.test(s)) fails.push("README uses streak-stats.demolab.com");
  if (/komarev\.com/.test(s)) fails.push("README uses komarev.com");
  return fails;
}

export function checkPictures() {
  const fails = [];
  const s = readme();
  const pictures = [...s.matchAll(/<picture>([\s\S]*?)<\/picture>/g)].map((m) => m[1]);
  const covered = new Set();
  for (const p of pictures) {
    if (!/<source[^>]*media="\(prefers-color-scheme: dark\)"/.test(p)) fails.push("a <picture> lacks a dark <source>");
    for (const m of p.matchAll(/(?:src|srcset)="([^"]+)"/g)) covered.add(m[1]);
  }
  for (const m of s.matchAll(/(?:src|srcset)="(\.?\/?(?:assets|profile-summary-card-output)\/[^"]+\.svg)"/g)) {
    if (m[1].includes("assets/skills/")) continue;
    if (!covered.has(m[1])) fails.push(`${m[1]} is not inside a <picture>`);
  }
  return fails;
}

const CHECKS = { checkSvgsParse, checkPairs, checkFonts, checkMinFont, checkWidth, checkLightPalette, checkForbidden, checkReadmeRefs, checkPictures };

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  let failed = 0;
  for (const [name, fn] of Object.entries(CHECKS))
    for (const msg of fn()) { console.log(`FAIL ${name}: ${msg}`); failed++; }
  if (failed) process.exit(1);
  console.log(`OK (${Object.keys(CHECKS).length} checks)`);
}
