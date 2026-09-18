#!/usr/bin/env node
/**
 * add-pwa-links.js
 * -----------------
 * Walks the gita.study repo and inserts these 3 lines right after the
 * <title>...</title> tag in every .html file that doesn't already have them:
 *
 *   <link rel="manifest" href="...manifest.webmanifest">
 *   <link rel="icon" type="image/png" sizes="192x192" href="...icons/icon-192.png">
 *   <link rel="apple-touch-icon" href="...icons/icon-192.png">
 *
 * The "..." prefix is calculated automatically based on how deep the file is
 * (e.g. ch18/gita_18_60.html gets "../", a file two folders deep would get
 * "../../", and so on).
 *
 * Files that already contain rel="manifest" are left untouched (safe to
 * run more than once — it will never add duplicate lines).
 *
 * USAGE:
 *   1. Put this file in the ROOT of your local gita.study repo folder
 *      (same folder as index.html, manifest.webmanifest, nav.js).
 *   2. Open a terminal in that folder.
 *   3. Run:  node add-pwa-links.js
 */

const fs = require('fs');
const path = require('path');

const root = process.argv[2] || '.';

function walk(dir, results = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, results);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      results.push(full);
    }
  }
  return results;
}

const files = walk(root);
let updated = 0;
let skipped = 0;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');

  // Already has the manifest link (e.g. index.html, or a file we already fixed) — skip.
  if (content.includes('rel="manifest"')) {
    skipped++;
    continue;
  }

  const titleMatch = content.match(/<title>[\s\S]*?<\/title>/);
  if (!titleMatch) {
    console.warn(`No <title> tag found, skipped: ${file}`);
    skipped++;
    continue;
  }

  // How many folders deep is this file, relative to the repo root?
  const rel = path.relative(root, file);
  const depth = rel.split(path.sep).length - 1;
  const prefix = depth > 0 ? '../'.repeat(depth) : '';

  const linkLines =
    `\n<link rel="manifest" href="${prefix}manifest.webmanifest">\n` +
    `<link rel="icon" type="image/png" sizes="192x192" href="${prefix}icons/icon-192.png">\n` +
    `<link rel="apple-touch-icon" href="${prefix}icons/icon-192.png">`;

  const newContent = content.replace(titleMatch[0], titleMatch[0] + linkLines);
  fs.writeFileSync(file, newContent, 'utf8');
  updated++;
  console.log(`Updated: ${file}`);
}

console.log(`\nDone. Updated ${updated} file(s), skipped ${skipped} (already had the manifest link, or no <title> found).`);
