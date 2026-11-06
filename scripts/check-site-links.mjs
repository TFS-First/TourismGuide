import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pages = ['index.html', 'portal.html', 'ancient-egyptian-language/index.html', 'spanish-language/index.html', 'spanish/index.html'];
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

for (const page of ['index.html', 'portal.html', 'ancient-egyptian-language/index.html', 'spanish-language/index.html', 'spanish/index.html',
  'history/index.html', 'graeco-roman/index.html', 'islamic-history/index.html',
  'modern-history/index.html']) {
  const html = fs.readFileSync(path.join(root, page), 'utf8');
  const meta = name => html.match(new RegExp(`<meta (?:property|name)="${name}" content="([^"]+)"`))?.[1];
  const expectedUrl = `https://tfs-first.github.io/TourismGuide/${page === 'index.html' || page === 'portal.html' ? '' : page.replace(/index\.html$/, '')}`;
  assert.equal(meta('og:url'), expectedUrl, `${page}: incorrect social URL`);
  assert(meta('og:title') && meta('og:description'), `${page}: missing social title or description`);
  const image = meta('og:image');
  assert(image?.startsWith('https://tfs-first.github.io/TourismGuide/assets/'), `${page}: missing absolute social image`);
  const imagePath = path.join(root, new URL(image).pathname.replace('/TourismGuide/', ''));
  assert(fs.existsSync(imagePath), `${page}: social image is missing`);
  assert.equal(meta('og:image:secure_url'), image, `${page}: social image secure URL mismatch`);
  assert.equal(meta('og:image:type'), 'image/jpeg', `${page}: social image must be JPEG`);
  assert(image.endsWith('.jpg'), `${page}: social image URL must point to JPEG`);
  assert(fs.readFileSync(imagePath).subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff])), `${page}: invalid JPEG`);
  assert(fs.statSync(imagePath).size < 300_000, `${page}: social image is too large`);
  assert.equal(meta('twitter:image'), image, `${page}: social image mismatch`);
}
console.log('Checked social sharing metadata for the portal and all six subjects.');
