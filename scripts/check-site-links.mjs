import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pages = ['index.html', 'portal.html', 'ancient-egyptian-language/index.html'];
for (const dir of ['history', 'graeco-roman', 'islamic-history', 'modern-history']) {
  pages.push(...fs.readdirSync(path.join(root, dir))
    .filter(name => name.endsWith('.html')).map(name => `${dir}/${name}`));
}
let count = 0;
for (const page of pages) {
  const html = fs.readFileSync(path.join(root, page), 'utf8');
  for (const [, value] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    if (/^(?:https?:|data:|mailto:|tel:|#|\/\/)/.test(value)) continue;
    const target = value.split(/[?#]/, 1)[0];
    if (!target) continue;
    const resolved = path.resolve(root, path.dirname(page), decodeURIComponent(target));
    assert(resolved.startsWith(root + path.sep), `${page}: link escapes site: ${value}`);
    assert(fs.existsSync(resolved), `${page}: missing ${value}`);
    count++;
  }
}
console.log(`Checked ${count} local page and asset links across ${pages.length} pages.`);
