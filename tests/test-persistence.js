// tests/test-persistence.js
const assert = require('assert');

const storage = {};
global.localStorage = {
  getItem: (key) => (key in storage ? storage[key] : null),
  setItem: (key, val) => { storage[key] = String(val); },
  removeItem: (key) => { delete storage[key]; },
  clear: () => { Object.keys(storage).forEach(k => delete storage[k]); }
};

const DB_STORAGE_KEY = 'ibv_leads';
const DB_SEEDED_KEY = 'ibv_leads_seeded_v2';

function getLeads() {
  try {
    const stored = localStorage.getItem(DB_STORAGE_KEY);
    if (stored !== null) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return [];
}

function saveLeads(leads) {
  localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(leads));
  localStorage.setItem(DB_SEEDED_KEY, 'true');
}

function initDatabaseOnce() {
  const isSeeded = localStorage.getItem(DB_SEEDED_KEY);
  const storedData = localStorage.getItem(DB_STORAGE_KEY);

  if (isSeeded === null && storedData === null) {
    const demoLeads = [
      { id: 'lead_demo_1', nome: 'Carlos Eduardo Souza', status: 'Agendado' },
      { id: 'lead_demo_2', nome: 'Mariana Alencar', status: 'Em Contato' }
    ];
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(demoLeads));
    localStorage.setItem(DB_SEEDED_KEY, 'true');
  } else if (isSeeded === null && storedData !== null) {
    localStorage.setItem(DB_SEEDED_KEY, 'true');
  }
}

console.log('--- TESTANDO PERSISTENCIA E F5 / CTRL+F5 ---');

// Cenario 1: Primeiro acesso
initDatabaseOnce();
let leads = getLeads();
assert.strictEqual(leads.length, 2, 'No primeiro acesso deve semear 2 demo leads');
assert.strictEqual(localStorage.getItem(DB_SEEDED_KEY), 'true');
console.log('OK Cenario 1: Semeou inicial.');

// Cenario 2: Deleta 1 lead
leads.splice(0, 1);
saveLeads(leads);
assert.strictEqual(getLeads().length, 1);
console.log('OK Cenario 2: Deletou 1 lead.');

// Cenario 3: F5
initDatabaseOnce();
leads = getLeads();
assert.strictEqual(leads.length, 1);
console.log('OK Cenario 3: F5 manteve 1 lead (nao ressuscitou).');

// Cenario 4: Deleta todos os leads
saveLeads([]);
assert.strictEqual(getLeads().length, 0);
console.log('OK Cenario 4: Limpou todos os leads.');

// Cenario 5: F5 com 0 leads
initDatabaseOnce();
leads = getLeads();
assert.strictEqual(leads.length, 0, 'F5 com zero leads NAO DEVE semear novamente');
console.log('OK Cenario 5: F5 com 0 leads permaneceu com 0 leads!');

// Cenario 6: Adiciona lead manual via botao "+ Inserir Exemplo"
leads.unshift({ id: 'manual_1', nome: 'Lead Teste' });
saveLeads(leads);
assert.strictEqual(getLeads().length, 1);
initDatabaseOnce();
assert.strictEqual(getLeads().length, 1);
console.log('OK Cenario 6: Lead manual e F5 subsequente funcionando perfeitamente.');

console.log('--- SUCESSO: TESTE DE PERSISTENCIA APROVADO! ---');
