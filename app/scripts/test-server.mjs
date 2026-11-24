import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const url = new URL(process.env.DB_URL || 'postgresql://localhost/missing');
if (url.pathname !== '/fretta_test' || !['localhost','127.0.0.1'].includes(url.hostname)) throw new Error('Use um banco local exclusivo chamado fretta_test.');
function files(dir) { return readdirSync(dir,{withFileTypes:true}).flatMap(entry => entry.isDirectory() ? files(`${dir}/${entry.name}`) : entry.name.endsWith('.test.ts') ? [`${dir}/${entry.name}`] : []); }
const result = spawnSync(process.execPath,['--import','tsx','--test','--test-concurrency=1',...files('src/server')],{stdio:'inherit'});
process.exit(result.status ?? 1);
