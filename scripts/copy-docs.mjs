import { cpSync } from 'fs';
// Copy everything from docs/ into dist/, without overwriting Astro-generated files (blog/, _astro/, etc.)
cpSync('docs', 'dist', { recursive: true, force: false });
