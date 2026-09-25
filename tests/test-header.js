const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const INDEX_PATH = path.join(ROOT_DIR, 'index.html');
const JS_PATH = path.join(ROOT_DIR, 'js', 'main.js');
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

console.log('--- Executando Testes de Header e Navegação (Task 2) ---');

// 1. Validar existência dos arquivos essenciais
const indexExists = fs.existsSync(INDEX_PATH);
assert(indexExists, 'index.html deve existir na raiz do projeto');

const jsExists = fs.existsSync(JS_PATH);
assert(jsExists, 'js/main.js deve existir');

const cssExists = fs.existsSync(CSS_PATH);
assert(cssExists, 'css/styles.css deve existir');

// 2. Validações no index.html
if (indexExists) {
  const html = fs.readFileSync(INDEX_PATH, 'utf8');

  // Head & Metatags
  assert(
    html.includes('<!DOCTYPE html>') || html.includes('<!doctype html>'),
    'index.html deve ter doctype html'
  );
  assert(
    /lang=["']pt-BR["']/i.test(html),
    'index.html deve ter lang="pt-BR"'
  );
  assert(
    /<meta\s+charset=["']UTF-8["']/i.test(html),
    'index.html deve declarar charset UTF-8'
  );
  assert(
    html.includes('name="viewport"') && html.includes('width=device-width'),
    'index.html deve conter meta viewport responsivo'
  );
  assert(
    html.includes('Instituto Boa Visão — Oftalmologia Especializada em Campinas'),
    'index.html deve conter o título oficial correto no <title>'
  );
  assert(
    /name=["']description["']/i.test(html) &&
    (html.includes('refração') || html.includes('óculos')) &&
    (html.includes('CBO') || html.includes('CRM')),
    'index.html deve conter meta description destacando refração para óculos e médicos CBO/CRM'
  );
  assert(
    html.includes('assets/favicon.svg') && html.includes('image/svg+xml'),
    'index.html deve referenciar assets/favicon.svg com type="image/svg+xml"'
  );
  assert(
    html.includes('css/styles.css'),
    'index.html deve carregar css/styles.css'
  );
  assert(
    html.includes('js/main.js'),
    'index.html deve carregar o script js/main.js'
  );

  // Topbar Informativa
  assert(
    html.includes('Atendimento oftalmológico especializado em Campinas') &&
    html.includes('CBO') &&
    html.includes('CRM'),
    'index.html deve conter Topbar informativa com menção a Campinas, CBO e CRM'
  );

  // Logo no Header
  assert(
    html.includes('assets/logo.png') &&
    /alt=["']Instituto Boa Visão["']/i.test(html),
    'Header deve conter imagem do logotipo assets/logo.png com alt descritivo'
  );
  assert(
    html.includes('href="#top"') || html.includes('href="#"'),
    'Logotipo deve ter link apontando para o topo (#top)'
  );

  // 5 Menus de Navegação Obrigatórios
  assert(
    html.includes('href="#quem-somos"') && /Quem Somos/i.test(html),
    'Navegação deve conter menu "Quem Somos" com href="#quem-somos"'
  );
  assert(
    html.includes('href="#consulta"') && /Consulta/i.test(html),
    'Navegação deve conter menu "Consulta" com href="#consulta"'
  );
  assert(
    html.includes('href="#especialidades"') && /Especialidade/i.test(html),
    'Navegação deve conter menu "Especialidade" com href="#especialidades"'
  );
  assert(
    html.includes('href="#sintomas"') && /Sintomas/i.test(html),
    'Navegação deve conter menu "Sintomas" com href="#sintomas"'
  );
  assert(
    html.includes('href="#contato"') && /Contato/i.test(html),
    'Navegação deve conter menu "Contato" com href="#contato"'
  );

  // Botão CTA WhatsApp no Header
  const WA_URL = 'http://api.whatsapp.com/send?1=pt_BR&phone=5519982036487&text=Olá,%20gostaria%20de%20receber%20mais%20informações%20sobre%20a%20consulta';
  assert(
    html.includes(WA_URL),
    'Header deve conter link oficial do WhatsApp com parâmetros obrigatórios exatos'
  );
  assert(
    html.includes('Agende sua Consulta'),
    'Botão de CTA no header deve conter o texto "Agende sua Consulta"'
  );
  assert(
    html.includes('target="_blank"') && html.includes('rel="noopener'),
    'Link do WhatsApp deve ter target="_blank" e rel com noopener'
  );

  // Botão Mobile Hamburger & Drawer
  assert(
    html.includes('mobile-menu-toggle') || html.includes('hamburger') || html.includes('nav-toggle'),
    'Header deve conter botão de alternância do menu mobile (hambúrguer)'
  );
  assert(
    html.includes('mobile-nav') || html.includes('nav-drawer') || html.includes('mobile-menu'),
    'index.html deve conter estrutura do menu mobile drawer'
  );
}

// 3. Validações no js/main.js
if (jsExists) {
  const jsContent = fs.readFileSync(JS_PATH, 'utf8');
  assert(
    jsContent.includes('addEventListener') &&
    (jsContent.includes('click') || jsContent.includes('DOMContentLoaded')),
    'js/main.js deve registrar event listeners para interatividade'
  );
  assert(
    jsContent.includes('classList') || jsContent.includes('setAttribute') || jsContent.includes('toggle'),
    'js/main.js deve manipular classes ou atributos para abrir/fechar o menu mobile'
  );
}

// 4. Validações no css/styles.css
if (cssExists) {
  const cssContent = fs.readFileSync(CSS_PATH, 'utf8');
  assert(
    cssContent.includes('.header') || cssContent.includes('header') || cssContent.includes('.navbar'),
    'css/styles.css deve conter regras para estilização do cabeçalho'
  );
  assert(
    cssContent.includes('position: sticky') || cssContent.includes('position: fixed'),
    'css/styles.css deve definir header com posicionamento sticky ou fixed'
  );
  assert(
    cssContent.includes('backdrop-filter') || cssContent.includes('-webkit-backdrop-filter'),
    'css/styles.css deve implementar efeito glassmorphism no header'
  );
  assert(
    cssContent.includes('.topbar') || cssContent.includes('topbar'),
    'css/styles.css deve estilizar a barra superior informativa (.topbar)'
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
