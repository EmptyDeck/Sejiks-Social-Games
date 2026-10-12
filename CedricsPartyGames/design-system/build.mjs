// Build: esbuild -> dist/index.es.js (react external), tsc -> dist/*.d.ts, css -> dist/styles.css
import { build } from 'esbuild';
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
rmSync('dist', { recursive: true, force: true }); mkdirSync('dist', { recursive: true });
await build({ entryPoints: ['src/index.ts'], bundle: true, format: 'esm', outfile: 'dist/index.es.js', external: ['react', 'react-dom', 'react/jsx-runtime'], jsx: 'automatic', target: 'es2020' });
execSync('npx tsc -p tsconfig.json', { stdio: 'inherit' });
const css = ['fonts.css', 'styles.css', 'themes.css'].map(f => readFileSync('src/' + f, 'utf8')).join('\n');
writeFileSync('dist/styles.css', css);
console.log('built dist/ (%d bytes css)', css.length);
