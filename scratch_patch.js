const fs = require('fs');
const path = require('path');
const dirs = fs.readdirSync('src/modules');

dirs.forEach(dir => {
    const indexPath = path.join('src/modules', dir, 'index.ts');
    if (fs.existsSync(indexPath)) {
        let content = fs.readFileSync(indexPath, 'utf-8');
        
        // Remove eventBus import
        content = content.replace(/import \{ eventBus \} from '@\/core\/events';\n?/g, '');
        
        // Remove contract imports
        content = content.replace(/import \{ [a-zA-Z]+Contract \} from '@\/types\/contracts\/[a-zA-Z]+\.contract';\n?/g, '');
        
        // Remove explicitly typed return contracts
        content = content.replace(/export function use([A-Za-z]+)\((.*?)\): [A-Za-z]+Contract \{/g, 'export function use$1($2) {');
        
        // Remove eventBus calls
        content = content.replace(/[\t ]*eventBus\.emit\(.*?\);\n?/g, '');
        
        fs.writeFileSync(indexPath, content);
    }

    const repoPath = path.join('src/modules', dir, dir + '.repo.ts');
    if (fs.existsSync(repoPath)) {
        let repoContent = fs.readFileSync(repoPath, 'utf-8');
        repoContent = repoContent.replace(/import \{ executeQuery \} from '@\/core\/db';\n?/g, 'import { runQuery as executeQuery } from \'@/lib/db\';\n');
        repoContent = repoContent.replace(/from '@\/core\/db'/g, 'from \'@/lib/db\'');
        fs.writeFileSync(repoPath, repoContent);
    }
});

// Specifically fix sanskriti index.ts
const sanskritiIndex = 'src/modules/sanskriti/index.ts';
if (fs.existsSync(sanskritiIndex)) {
    let sContent = fs.readFileSync(sanskritiIndex, 'utf-8');
    sContent = sContent.replace(/from '@\/core\/db'/g, 'from \'@/lib/db\'');
    sContent = sContent.replace(/import \{ saveVault \} from '@\/lib\/db';/, 'import { saveVault } from \'@/lib/vault\';');
    sContent = sContent.replace(/: [A-Za-z]+Contract/g, '');
    fs.writeFileSync(sanskritiIndex, sContent);
}

// Fix Saman repo bindParams
const samanRepo = 'src/modules/saman/saman.repo.ts';
if (fs.existsSync(samanRepo)) {
    let sRepo = fs.readFileSync(samanRepo, 'utf-8');
    sRepo = sRepo.replace(/item\.checked \|\| false,/g, 'item.checked ? 1 : 0,');
    fs.writeFileSync(samanRepo, sRepo);
}

console.log('Fixed modules');
