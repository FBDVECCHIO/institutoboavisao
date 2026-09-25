const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const INDEX_PATH = path.join(ROOT_DIR, 'index.html');
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

console.log('--- Executando Testes da Hero Section (Task 3) ---');

// 1. Validar existência dos arquivos
const indexExists = fs.existsSync(INDEX_PATH);
assert(indexExists, 'index.html deve existir na raiz do projeto');

const cssExists = fs.existsSync(CSS_PATH);
assert(cssExists, 'css/styles.css deve existir');

if (indexExists) {
  const html = fs.readFileSync(INDEX_PATH, 'utf8');

  // 2. Identificação e Posição da Hero Section (#top)
  assert(
    /<section[^>]+id=["']top["']/i.test(html),
    'Deve existir uma <section id="top" ...> para a Hero Section'
  );
  assert(
    html.includes('hero'),
    'A seção Hero deve utilizar classes descritivas de hero'
  );

  // 3. Eyebrow / Badge Superior
  assert(
    html.includes('Centro Oftalmológico em Campinas') &&
    html.includes('CBO') &&
    html.includes('CRM'),
    'Hero deve conter badge superior com menção a Campinas, CBO e CRM'
  );

  // 4. Headline Principal (H1)
  const expectedH1 = 'Cuidar da sua visão começa com quem entende. Exame de refração e consulta médica completa em Campinas.';
  assert(
    html.includes(expectedH1),
    `Hero deve conter H1 com o texto exato: "${expectedH1}"`
  );
  assert(
    /<h1[^>]*>[\s\S]*?(refração|visão)[\s\S]*?<\/h1>/i.test(html),
    'H1 deve destacar refração ou visão no título'
  );

  // 5. Subtítulo com Proposta de Valor Integral
  assert(
    html.includes('óculos') &&
    html.includes('CBO') &&
    html.includes('CRM') &&
    (html.includes('patologia') || html.includes('patologias')),
    'Subtítulo deve mencionar exame de refração para óculos, médicos CBO/CRM e diagnóstico de patologias'
  );
  assert(
    html.includes('Todos os nossos pacientes são atendidos exclusivamente por oftalmologistas credenciados pelo CBO e CRM'),
    'Subtítulo deve enfatizar atendimento 100% exclusivo por oftalmologistas credenciados CBO/CRM'
  );

  // 6. CTAs Duplos
  const WA_URL = 'http://api.whatsapp.com/send?1=pt_BR&phone=5519982036487&text=Olá,%20gostaria%20de%20receber%20mais%20informações%20sobre%20a%20consulta';
  assert(
    html.includes(WA_URL),
    'Hero deve conter botão primário com link exato do WhatsApp'
  );
  assert(
    html.includes('Agendar Consulta pelo WhatsApp'),
    'Botão de CTA primário deve conter o texto "Agendar Consulta pelo WhatsApp"'
  );
  assert(
    html.includes('href="#consulta"') && html.includes('Como funciona a consulta'),
    'Hero deve conter CTA secundário com texto "Como funciona a consulta" apontando para #consulta'
  );

  // 7. Badges de Confiança (Grid de Destaques)
  assert(
    html.includes('Oftalmologistas credenciados pelo CBO'),
    'Hero deve destacar badge "Oftalmologistas credenciados pelo CBO"'
  );
  assert(
    html.includes('Registro médico oficial no CRM'),
    'Hero deve destacar badge "Registro médico oficial no CRM"'
  );
  assert(
    html.includes('Prescrição precisa para seus óculos') || html.includes('Prescrição precisa para óculos'),
    'Hero deve destacar badge sobre prescrição precisa para óculos'
  );
  assert(
    html.includes('Diagnóstico preventivo de patologias'),
    'Hero deve destacar badge "Diagnóstico preventivo de patologias"'
  );

  // 8. Elemento Visual / Moldura com Selo CBO
  assert(
    html.includes('Excelência Médica CBO • Diagnóstico Integral • Campinas/SP') ||
    (html.includes('Excelência Médica CBO') && html.includes('Campinas/SP')),
    'Hero visual deve conter selo de excelência médica CBO e diagnóstico integral em Campinas/SP'
  );
}

// 9. Validações no css/styles.css
if (cssExists) {
  const css = fs.readFileSync(CSS_PATH, 'utf8');

  assert(
    css.includes('.hero') || css.includes('#top'),
    'css/styles.css deve conter seletores para .hero ou #top'
  );
  assert(
    (css.includes('#19431F') || css.includes('#19431f')) &&
    (css.includes('#0E2511') || css.includes('#0e2511')),
    'css/styles.css deve utilizar paleta escura (#19431F e #0E2511) no Hero para contraste'
  );
  assert(
    css.includes('.hero-badges') || css.includes('.hero-features') || css.includes('.hero-trust'),
    'css/styles.css deve estilizar a grade/lista de badges de confiança do Hero'
  );
  assert(
    css.includes('.hero-card') || css.includes('.hero-media') || css.includes('.hero-visual'),
    'css/styles.css deve estilizar o card médico / composição visual do Hero'
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
