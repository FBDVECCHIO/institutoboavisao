const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const FAVICON_PATH = path.join(ROOT_DIR, 'assets', 'favicon.svg');
const LOGO_PATH = path.join(ROOT_DIR, 'assets', 'logo.png');
const CSS_PATH = path.join(ROOT_DIR, 'css', 'styles.css');

let passed = true;
const results = [];

function assert(condition, message) {
  if (condition) {
    results.push(` PASS: ${message}`);
  } else {
    results.push(` FAIL: ${message}`);
    passed = false;
  }
}

console.log('--- Executando Testes de Assets (Task 1) ---');

// 1. Validar assets/favicon.svg
const faviconExists = fs.existsSync(FAVICON_PATH);
assert(faviconExists, 'assets/favicon.svg deve existir');

if (faviconExists) {
  const faviconContent = fs.readFileSync(FAVICON_PATH, 'utf8');
  assert(faviconContent.includes('<svg'), 'assets/favicon.svg deve conter tag <svg');
  assert(
    faviconContent.includes('<path') || faviconContent.includes('<circle'),
    'assets/favicon.svg deve conter elementos <path> ou <circle>'
  );
  assert(
    faviconContent.toLowerCase().includes('#19431f') || faviconContent.includes('#19431F'),
    'assets/favicon.svg deve conter a cor primária #19431F'
  );
}

// 2. Validar assets/logo.png
const logoExists = fs.existsSync(LOGO_PATH);
assert(logoExists, 'assets/logo.png deve existir');

if (logoExists) {
  const logoStats = fs.statSync(LOGO_PATH);
  assert(logoStats.size > 0, `assets/logo.png deve ter tamanho > 0 bytes (tamanho atual: ${logoStats.size} bytes)`);
}

// 3. Validar css/styles.css
const cssExists = fs.existsSync(CSS_PATH);
assert(cssExists, 'css/styles.css deve existir');

if (cssExists) {
  const cssContent = fs.readFileSync(CSS_PATH, 'utf8');
  assert(
    cssContent.toLowerCase().includes('#19431f') || cssContent.includes('#19431F'),
    'css/styles.css deve declarar a cor primária #19431F'
  );
  assert(
    cssContent.toLowerCase().includes('#a4aa86') || cssContent.includes('#A4AA86'),
    'css/styles.css deve declarar a cor secundária #A4AA86'
  );
  assert(
    cssContent.includes('--font-heading') && cssContent.includes('--font-body'),
    'css/styles.css deve definir as variáveis de tipografia (--font-heading, --font-body)'
  );
}

results.forEach(res => console.log(res));

if (!passed) {
  console.error('\n Testes FALHARAM.');
  process.exit(1);
} else {
  console.log('\n Todos os testes passaram com sucesso! (100% de aprovação)');
  process.exit(0);
}
