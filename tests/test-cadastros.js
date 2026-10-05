// tests/test-cadastros.js
const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- TESTANDO CADASTRO DE LOJAS E VENDEDORES NO PAINEL ADMIN IBV ---');

const htmlPath = path.join(__dirname, '../index.html');
const jsPath = path.join(__dirname, '../js/main.js');
const cssPath = path.join(__dirname, '../css/styles.css');

assert(fs.existsSync(htmlPath), 'index.html deve existir');
assert(fs.existsSync(jsPath), 'js/main.js deve existir');
assert(fs.existsSync(cssPath), 'css/styles.css deve existir');

const html = fs.readFileSync(htmlPath, 'utf8');
const js = fs.readFileSync(jsPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

// 1. Aba de navegação "Lojas & Vendedores"
assert(html.includes('id="tabCadastrosView"'), 'Deve existir o botão #tabCadastrosView no index.html');
assert(html.includes('Lojas & Vendedores') || html.includes('Lojas e Vendedores'), 'Aba deve conter o texto "Lojas & Vendedores"');
console.log(' PASS: Aba #tabCadastrosView presente no alternador de visão.');

// 2. Seção de visualização e elementos de cadastro
assert(html.includes('id="adminCadastrosViewSection"'), 'Deve existir a seção #adminCadastrosViewSection no index.html');
assert(html.includes('id="novaLojaNome"'), 'Deve existir o campo #novaLojaNome');
assert(html.includes('id="btnAddLoja"'), 'Deve existir o botão #btnAddLoja');
assert(html.includes('id="adminLojasList"'), 'Deve existir a lista #adminLojasList');

assert(html.includes('id="novoVendedorNome"'), 'Deve existir o campo #novoVendedorNome');
assert(html.includes('id="btnAddVendedor"'), 'Deve existir o botão #btnAddVendedor');
assert(html.includes('id="adminVendedoresList"'), 'Deve existir a lista #adminVendedoresList');
console.log(' PASS: Estrutura HTML dos módulos de Lojas e Vendedores validada.');

// 3. Integração no JavaScript
assert(js.includes('tabCadastrosView'), 'main.js deve gerenciar a alternância da aba #tabCadastrosView');
assert(js.includes('getLojas') && js.includes('saveLojas'), 'main.js deve implementar getLojas e saveLojas');
assert(js.includes('getVendedores') && js.includes('saveVendedores'), 'main.js deve implementar getVendedores e saveVendedores');
assert(js.includes('renderLojasList') && js.includes('renderVendedoresList'), 'main.js deve renderizar as listas de lojas e vendedores');
assert(js.includes('field-loja') && js.includes('field-vendedor'), 'main.js deve alimentar as colunas Loja e Vendedor dos leads');
console.log(' PASS: Funções de CRUD e alimentação de leads no main.js validadas.');

// 4. Estilos no CSS
assert(css.includes('admin-cadastros-grid') || css.includes('admin-cadastro-card'), 'css/styles.css deve conter estilos para a tela de cadastros');
console.log(' PASS: Estilos CSS da tela de cadastros validados.');

console.log('\n--- TODOS OS TESTES DE CADASTRO DE LOJAS E VENDEDORES PASSARAM COM SUCESSO! ---');
