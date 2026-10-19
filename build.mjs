import * as esbuild from 'esbuild';
import { cpSync, mkdirSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
const watch = process.argv.includes('--watch');
rmSync('dist', { recursive: true, force: true });
mkdirSync('dist', { recursive: true });
cpSync('public', 'dist', { recursive: true });
const stamp = Date.now().toString(36);
const opts = { entryPoints: ['src/main.tsx'], bundle: true, outfile: 'dist/app.js', format: 'esm', target: 'es2022', jsx: 'automatic', sourcemap: true, minify: !watch, loader: { '.css': 'text' }, define: { 'process.env.NODE_ENV': watch ? '"development"' : '"production"' } };
if (watch) { const ctx = await esbuild.context(opts); await ctx.watch(); console.log('watching…'); }
else { await esbuild.build(opts); }
const sw = readFileSync('dist/sw.js', 'utf8').replace('__BUILD__', stamp);
writeFileSync('dist/sw.js', sw);
console.log('BarONE build OK');
