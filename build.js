const { execSync } = require('child_process');
const path = require('path');

// Navega até a pasta do cliente
process.chdir(path.join(__dirname, 'client'));

// Executa o build do frontend
console.log('Iniciando build do frontend...');
execSync('npm run build', { stdio: 'inherit' });

console.log('Build do frontend concluído!'); 