import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');
const distFile = path.join(distDir, 'index.html');
assert.ok(fs.existsSync(distFile), 'dist/index.html bulunamadı. Önce npm run build çalıştırın.');
const html = fs.readFileSync(distFile, 'utf8');
const assetsDir = path.join(distDir, 'assets');
assert.ok(fs.existsSync(assetsDir), 'dist/assets bulunamadı. Build eksik görünüyor.');
const assets = fs.readdirSync(assetsDir);

assert.match(html, /Feraiz|Faraid/i, 'Ana başlık bulunamadı.');
assert.match(html, /meta name="description"/i, 'Meta description bulunamadı.');
assert.match(html, /modulepreload|script type="module"/i, 'Optimize modül yükleme izi bulunamadı.');
assert.ok(assets.some((name) => /knowledge/i.test(name)), 'Bilgi/40 Hal kaynaklari icin knowledge chunk bulunamadi.');
assert.ok(assets.some((name) => /results-engine/i.test(name)), 'Sonuc motoru chunk bulunamadi.');

console.log('PASS e2e-smoke optimized build artifact contains split chunks and metadata');
