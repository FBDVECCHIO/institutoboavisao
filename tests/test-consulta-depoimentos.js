const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const INDEX_PATH = path.join(ROOT_DIR, 'index.html');
const CSS_PATH = path.join(ROOT_DIR, 'css', 'styles.css');
const JS_PATH = path.join(ROOT_DIR, 'js', 'main.js');

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

console.log('--- Executando Testes de Consulta, Quem Somos e Depoimentos (Task 5) ---');

// 1. Validar existência dos arquivos
const indexExists = fs.existsSync(INDEX_PATH);
assert(indexExists, 'index.html deve existir na raiz do projeto');

const cssExists = fs.existsSync(CSS_PATH);
assert(cssExists, 'css/styles.css deve existir');

const jsExists = fs.existsSync(JS_PATH);
assert(jsExists, 'js/main.js deve existir');

const WA_URL = 'http://api.whatsapp.com/send?1=pt_BR&phone=5519982036487&text=Olá,%20gostaria%20de%20receber%20mais%20informações%20sobre%20a%20consulta';

function checkWaUrl(str) {
  return str.includes(WA_URL) || str.includes(encodeURI(WA_URL));
}

if (indexExists) {
  const html = fs.readFileSync(INDEX_PATH, 'utf8');

  // ==========================================
  // 2. Seção de Consulta (#consulta)
  // ==========================================
  assert(
    /<section[^>]+id=["']consulta["']/i.test(html),
    'Deve existir uma <section id="consulta" ...>'
  );

  // Header da seção Consulta
  assert(
    html.includes('Consulta & Exame de Refração') || html.includes('Consulta e Exame de Refração'),
    'Seção Consulta deve conter a tag/título "Consulta & Exame de Refração"'
  );
  assert(
    html.includes('Como é realizada a sua consulta no Instituto Boa Visão'),
    'Seção Consulta deve conter o subtítulo/H2 sobre como é realizada a consulta'
  );

  // 4 Passos do Exame de Refração
  assert(
    html.includes('Anamnese') && (html.includes('estilo de vida') || html.includes('queixas visuais') || html.includes('telas')),
    'Passo 1: Anamnese Individualizada detalhando estilo de vida, queixas e telas'
  );

  assert(
    (html.includes('Refração Especializada') || html.includes('Refração especializada')) &&
    (html.includes('grau exato') || html.includes('conforto') || html.includes('precisão')),
    'Passo 2: Refração Especializada com refinamento do médico oftalmologista'
  );

  assert(
    html.includes('Lâmpada de Fenda') && (html.includes('córnea') || html.includes('cristalino') || html.includes('superfície ocular')),
    'Passo 3: Exame Clínico com Lâmpada de Fenda avaliando superfície ocular, córnea e cristalino'
  );

  assert(
    (html.includes('Prescrição Médica') || html.includes('Prescrição e Orientação')) &&
    (html.includes('CRM') || html.includes('receita oftalmológica') || html.includes('lentes')),
    'Passo 4: Prescrição Médica e Orientações com receita oficial CRM e escolha ideal de lentes'
  );

  // CTA WhatsApp na seção Consulta
  const consultaSectionMatch = html.match(/<section[^>]+id=["']consulta["'][\s\S]*?<\/section>/i);
  if (consultaSectionMatch) {
    const consultaHtml = consultaSectionMatch[0];
    assert(
      checkWaUrl(consultaHtml),
      'Seção Consulta deve conter botão CTA com link oficial do WhatsApp'
    );
    assert(
      consultaHtml.includes('Agende sua Consulta') || consultaHtml.includes('Agendar Consulta'),
      'Botão de CTA na seção Consulta deve convidar ao agendamento'
    );
  } else {
    assert(false, 'Não foi possível extrair a seção Consulta para validação');
  }

  // ==========================================
  // 3. Seção Quem Somos (#quem-somos)
  // ==========================================
  assert(
    /<section[^>]+id=["']quem-somos["']/i.test(html),
    'Deve existir uma <section id="quem-somos" ...>'
  );

  // Header Quem Somos
  assert(
    html.includes('Quem Somos'),
    'Seção Quem Somos deve conter a tag/título "Quem Somos"'
  );
  assert(
    html.includes('Instituto Boa Visão') && html.includes('Campinas'),
    'Seção Quem Somos deve mencionar "Instituto Boa Visão" e "Campinas"'
  );

  // Conteúdo institucional e compromisso ético
  assert(
    html.includes('CBO') && (html.includes('CRM') || html.includes('médicos oftalmologistas')),
    'Seção Quem Somos deve destacar atendimento 100% realizado por médicos oftalmologistas CBO'
  );

  // 3 Destaques visuais
  assert(
    html.includes('Corpo Clínico Especializado') || (html.includes('Corpo Clínico') && html.includes('CBO')),
    'Destaque 1: Corpo Clínico Especializado com CRM e título CBO'
  );
  assert(
    html.includes('Equipamentos de Precisão') || (html.includes('Tecnologia') && html.includes('precisão')),
    'Destaque 2: Equipamentos de Precisão para refração e diagnóstico'
  );
  assert(
    html.includes('Atendimento Humanizado') || html.includes('humanizado e acolhedor'),
    'Destaque 3: Atendimento Humanizado dedicado para ouvir e esclarecer cada dúvida'
  );

  // ==========================================
  // 4. Seção Depoimentos (#depoimentos)
  // ==========================================
  assert(
    /<section[^>]+id=["']depoimentos["']/i.test(html),
    'Deve existir uma <section id="depoimentos" ...>'
  );

  // Header Depoimentos
  assert(
    html.includes('Depoimentos'),
    'Seção Depoimentos deve conter a tag/título "Depoimentos"'
  );
  assert(
    html.includes('O que dizem os pacientes') || html.includes('pacientes atendidos'),
    'Seção Depoimentos deve conter o subtítulo/H2 sobre a opinião dos pacientes'
  );

  // 4 Pacientes de Campinas
  assert(
    html.includes('Sandra M.') && html.includes('Cambuí'),
    'Depoimento 1: Sandra M. de Cambuí, Campinas'
  );
  assert(
    html.includes('Ricardo S.') && html.includes('Centro'),
    'Depoimento 2: Ricardo S. do Centro, Campinas'
  );
  assert(
    html.includes('Patrícia N.') && html.includes('Barão Geraldo'),
    'Depoimento 3: Patrícia N. de Barão Geraldo, Campinas'
  );
  assert(
    html.includes('João V.') && html.includes('Taquaral'),
    'Depoimento 4: João V. do Taquaral, Campinas'
  );

  // Avaliação 5 estrelas
  assert(
    html.includes('★★★★★') || (html.includes('5.0') && html.includes('estrela')),
    'Depoimentos devem exibir avaliações 5 estrelas'
  );

  // Controles de navegação (botões anterior/próximo e dots)
  const depoimentosSectionMatch = html.match(/<section[^>]+id=["']depoimentos["'][\s\S]*?<\/section>/i);
  if (depoimentosSectionMatch) {
    const depoimentosHtml = depoimentosSectionMatch[0];

    assert(
      depoimentosHtml.includes('carousel-prev') || depoimentosHtml.includes('prev-btn') || depoimentosHtml.includes('btn-prev') || depoimentosHtml.includes('depoimento-prev'),
      'Seção Depoimentos deve conter botão de navegação anterior'
    );
    assert(
      depoimentosHtml.includes('carousel-next') || depoimentosHtml.includes('next-btn') || depoimentosHtml.includes('btn-next') || depoimentosHtml.includes('depoimento-next'),
      'Seção Depoimentos deve conter botão de navegação próximo'
    );
    assert(
      depoimentosHtml.includes('carousel-dots') || depoimentosHtml.includes('dots-container') || depoimentosHtml.includes('depoimento-dots') || depoimentosHtml.includes('carousel-dot'),
      'Seção Depoimentos deve conter dots/indicadores de navegação'
    );

    // Botão CTA após os depoimentos
    assert(
      checkWaUrl(depoimentosHtml),
      'Seção Depoimentos deve conter botão CTA com link oficial do WhatsApp'
    );
    assert(
      depoimentosHtml.includes('Agende sua Consulta') || depoimentosHtml.includes('Agendar Consulta'),
      'Botão de CTA na seção Depoimentos deve convidar ao agendamento'
    );
  } else {
    assert(false, 'Não foi possível extrair a seção Depoimentos para validação');
  }
}

// ==========================================
// 5. Validações de Estilização em css/styles.css
// ==========================================
if (cssExists) {
  const css = fs.readFileSync(CSS_PATH, 'utf8');

  assert(
    css.includes('#consulta') || css.includes('.consulta') || css.includes('.passo-card'),
    'css/styles.css deve conter estilos para a seção de Consulta'
  );
  assert(
    css.includes('#quem-somos') || css.includes('.quem-somos') || css.includes('.sobre-'),
    'css/styles.css deve conter estilos para a seção Quem Somos'
  );
  assert(
    css.includes('#depoimentos') || css.includes('.depoimentos') || css.includes('.testimonial'),
    'css/styles.css deve conter estilos para a seção de Depoimentos'
  );
  assert(
    css.includes('.passo-') || css.includes('.etapa-') || css.includes('.steps-grid') || css.includes('.passos-grid'),
    'css/styles.css deve conter componentes para os 4 passos da consulta'
  );
  assert(
    css.includes('.carousel-') || css.includes('.testimonials-') || css.includes('.depoimento-'),
    'css/styles.css deve conter estilos para o carrossel/slider de depoimentos'
  );
}

// ==========================================
// 6. Validações de Interatividade em js/main.js
// ==========================================
if (jsExists) {
  const js = fs.readFileSync(JS_PATH, 'utf8');

  assert(
    js.includes('carousel') || js.includes('depoimento') || js.includes('testimonial'),
    'js/main.js deve conter lógica de controle para o carrossel de depoimentos'
  );
  assert(
    js.includes('addEventListener') && (js.includes('next') || js.includes('prev') || js.includes('dot')),
    'js/main.js deve ter ouvintes de eventos para avançar, retroceder ou clicar nos dots do carrossel'
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
