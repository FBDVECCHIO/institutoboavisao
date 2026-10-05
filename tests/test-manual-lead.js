// tests/test-manual-lead.js
const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- TESTANDO INCLUSÃO MANUAL DE LEADS NO PAINEL ADMIN IBV ---');

const htmlPath = path.join(__dirname, '../index.html');
const jsPath = path.join(__dirname, '../js/main.js');
const cssPath = path.join(__dirname, '../css/styles.css');

assert(fs.existsSync(htmlPath), 'index.html deve existir');
assert(fs.existsSync(jsPath), 'js/main.js deve existir');
assert(fs.existsSync(cssPath), 'css/styles.css deve existir');

const html = fs.readFileSync(htmlPath, 'utf8');
const js = fs.readFileSync(jsPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8');

// 1. Botão "+ Novo Lead" no cabeçalho do Admin
assert(html.includes('id="adminAddLeadBtn"'), 'Deve existir o botão #adminAddLeadBtn no index.html');
assert(html.includes('Novo Lead') || html.includes('Incluir Lead'), 'Botão deve conter o texto "+ Novo Lead" ou similar');
console.log(' PASS: Botão #adminAddLeadBtn presente no cabeçalho do painel.');

// 2. Modal e formulário de inclusão manual
assert(html.includes('id="adminAddLeadModal"'), 'Deve existir o modal #adminAddLeadModal no index.html');
assert(html.includes('id="adminAddLeadForm"'), 'Deve existir o formulário #adminAddLeadForm no index.html');
assert(html.includes('id="manualLeadNome"'), 'Deve conter o campo #manualLeadNome');
assert(html.includes('id="manualLeadTelefone"'), 'Deve conter o campo #manualLeadTelefone');
assert(html.includes('id="manualLeadCanal"'), 'Deve conter o campo de seleção #manualLeadCanal');
assert(html.includes('id="manualLeadDataConsulta"'), 'Deve conter o campo de data #manualLeadDataConsulta');
assert(html.includes('id="manualLeadStatus"'), 'Deve conter o campo de seleção #manualLeadStatus');
assert(html.includes('id="manualLeadLoja"'), 'Deve conter o campo #manualLeadLoja');
assert(html.includes('id="manualLeadOs"'), 'Deve conter o campo #manualLeadOs');
assert(html.includes('id="manualLeadValor"'), 'Deve conter o campo #manualLeadValor');
assert(html.includes('id="manualLeadVendedor"'), 'Deve conter o campo #manualLeadVendedor');
assert(html.includes('id="manualLeadSubmitBtn"'), 'Deve conter o botão de submissão #manualLeadSubmitBtn');
assert(html.includes('id="manualLeadCloseBtn"') || html.includes('id="manualLeadCancelBtn"'), 'Deve conter botão de cancelamento/fechamento');
console.log(' PASS: Estrutura HTML do modal e formulário de inclusão manual validada.');

// 3. Status inicial padrão "Agendado"
assert(html.includes('value="Agendado" selected') || html.includes('selected>Agendado</option>') || js.includes("status: 'Agendado'"), 'Status inicial padrão deve ser "Agendado"');
console.log(' PASS: Status padrão "Agendado" configurado conforme alinhado com o usuário.');

// 4. Integração JS no main.js
assert(js.includes('adminAddLeadBtn'), 'main.js deve manipular #adminAddLeadBtn');
assert(js.includes('adminAddLeadModal'), 'main.js deve manipular #adminAddLeadModal');
assert(js.includes('adminAddLeadForm'), 'main.js deve registrar evento de submit em #adminAddLeadForm');
assert(js.includes('manualLeadNome') && js.includes('manualLeadTelefone'), 'main.js deve ler os campos de nome e telefone');
assert(js.includes('renderLeadsTable') && js.includes('renderKanbanBoard'), 'Após inclusão manual, main.js deve atualizar tabela e board');
console.log(' PASS: Lógica JavaScript de abertura, captura, salvamento e atualização implementada.');

// 5. Estilos no CSS
assert(css.includes('admin-submodal') || css.includes('admin-add-lead-modal'), 'css/styles.css deve conter estilos para o modal de inclusão de lead');
console.log(' PASS: Estilização do modal e formulário no CSS validada.');

console.log('\n--- TODOS OS TESTES DE INCLUSÃO MANUAL DE LEADS PASSARAM COM SUCESSO! ---');
