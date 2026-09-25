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

console.log('--- Executando Testes de Contato, Footer, Floating WhatsApp e Back to Top (Task 6) ---');

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
  // 2. Seção de Contato (#contato)
  // ==========================================
  assert(
    /<section[^>]+id=["']contato["']/i.test(html),
    'Deve existir uma <section id="contato" ...>'
  );

  // Headers da seção Contato
  assert(
    html.includes('Entre em Contato'),
    'Seção Contato deve conter o cabeçalho/tag "Entre em Contato"'
  );
  assert(
    html.includes('Estamos prontos para cuidar da sua visão em Campinas'),
    'Seção Contato deve conter o subtítulo/H2 "Estamos prontos para cuidar da sua visão em Campinas"'
  );

  // Informações de Contato
  assert(
    html.includes('Campinas') && (html.includes('Região Central') || html.includes('Centro')) && html.includes('estacionamento'),
    'Contato deve conter localização em Campinas (Região Central com estacionamento)'
  );

  assert(
    html.includes('(19) 98203-6487'),
    'Contato deve informar o WhatsApp Oficial (19) 98203-6487'
  );

  assert(
    html.includes('(19) 3000-0000'),
    'Contato deve informar o telefone fixo (19) 3000-0000'
  );

  assert(
    html.includes('contato@institutoboavisao.com.br'),
    'Contato deve informar o e-mail contato@institutoboavisao.com.br'
  );

  assert(
    (html.includes('Segunda a Sexta') || html.includes('Segunda à Sexta')) && html.includes('08h às 18h') &&
    html.includes('Sábado') && html.includes('08h às 12h'),
    'Contato deve informar horários de atendimento (Segunda a Sexta 08h-18h e Sábados 08h-12h)'
  );

  // Card de ação direta com CTA WhatsApp
  const contatoMatch = html.match(/<section[^>]+id=["']contato["'][\s\S]*?<\/section>/i);
  if (contatoMatch) {
    const contatoHtml = contatoMatch[0];
    assert(
      contatoHtml.includes('Agende sua Consulta em Segundos pelo WhatsApp') ||
      (contatoHtml.includes('Agende sua Consulta') && contatoHtml.includes('WhatsApp')),
      'Card de ação em Contato deve convidar ao agendamento rápido por WhatsApp'
    );
    assert(
      checkWaUrl(contatoHtml),
      'Seção Contato deve conter link oficial do WhatsApp no botão CTA'
    );
  } else {
    assert(false, 'Não foi possível extrair a seção Contato para validação');
  }

  // ==========================================
  // 3. Rodapé Completo (footer)
  // ==========================================
  assert(
    /<footer[\s\S]*?<\/footer>/i.test(html),
    'Deve existir a tag <footer> no documento'
  );

  const footerMatch = html.match(/<footer[\s\S]*?<\/footer>/i);
  if (footerMatch) {
    const footerHtml = footerMatch[0];

    assert(
      footerHtml.includes('assets/logo.png'),
      'Footer deve conter o logotipo oficial (assets/logo.png)'
    );

    assert(
      footerHtml.includes('Atendimento Médico Especializado') || (footerHtml.includes('CBO') && footerHtml.includes('CRM')),
      'Footer deve conter selo de atendimento médico especializado CBO e CRM'
    );

    // Links dos 5 menus
    assert(
      footerHtml.includes('href="#quem-somos"') &&
      footerHtml.includes('href="#consulta"') &&
      footerHtml.includes('href="#especialidades"') &&
      footerHtml.includes('href="#sintomas"') &&
      footerHtml.includes('href="#contato"'),
      'Footer deve conter links rápidos para os 5 menus (#quem-somos, #consulta, #especialidades, #sintomas, #contato)'
    );

    // Conformidade ética e médica
    assert(
      footerHtml.includes('Responsável Técnico') && footerHtml.includes('CRM-SP') && footerHtml.includes('hora marcada'),
      'Footer deve conter conformidade ética com Responsável Técnico Oftalmologista, CRM-SP e atendimento com hora marcada'
    );

    // Copyright e domínio institucional
    assert(
      footerHtml.includes('2026') &&
      footerHtml.includes('Instituto Boa Visão') &&
      footerHtml.includes('Campinas') &&
      footerHtml.includes('INSTITUTOBOAVISAO.COM.BR'),
      'Footer deve conter copyright 2026, menção a Campinas e domínio INSTITUTOBOAVISAO.COM.BR em maiúsculas'
    );
  } else {
    assert(false, 'Não foi possível extrair o footer para validação');
  }

  // ==========================================
  // 4. Botão Flutuante do WhatsApp
  // ==========================================
  assert(
    html.includes('floating-wa') || html.includes('whatsapp-float') || html.includes('floating-whatsapp') || html.includes('btn-float-wa'),
    'Deve existir o botão flutuante do WhatsApp no index.html'
  );

  // Validar link no botão flutuante
  const waFloatMatch = html.match(/<(?:a|button)[^>]+(?:floating-wa|whatsapp-float|floating-whatsapp|btn-float-wa)[^>]*>[\s\S]*?<\/(?:a|button)>/i);
  if (waFloatMatch) {
    const waFloatHtml = waFloatMatch[0];
    assert(
      checkWaUrl(waFloatHtml),
      'Botão flutuante do WhatsApp deve conter o link oficial correto'
    );
    assert(
      waFloatHtml.includes('Agende sua Consulta') || waFloatHtml.includes('Agendar Consulta'),
      'Botão flutuante do WhatsApp deve ter tooltip ou texto acessível com Agende sua Consulta'
    );
  } else {
    assert(false, 'Não foi possível extrair o botão flutuante do WhatsApp');
  }

  // ==========================================
  // 5. Botão de Atalho "Subir ao Topo"
  // ==========================================
  assert(
    html.includes('id="backToTop"') || html.includes('id="scrollTop"') || html.includes('class="back-to-top"') || html.includes('class="scroll-top-btn"'),
    'Deve existir o botão de atalho "Subir ao Topo" no index.html'
  );
}

// ==========================================
// 6. Validações de Estilização em css/styles.css
// ==========================================
if (cssExists) {
  const css = fs.readFileSync(CSS_PATH, 'utf8');

  assert(
    css.includes('#contato') || css.includes('.contato-section') || css.includes('.contato-grid'),
    'css/styles.css deve conter estilos para a seção #contato'
  );

  assert(
    css.includes('footer') || css.includes('.footer') || css.includes('.site-footer'),
    'css/styles.css deve conter estilos para o footer'
  );

  assert(
    css.includes('#0E2511') || css.includes('var(--color-primary-dark)'),
    'css/styles.css deve aplicar fundo escuro elegante (#0E2511 ou --color-primary-dark) no footer'
  );

  assert(
    css.includes('waPulse') || css.includes('@keyframes waPulse'),
    'css/styles.css deve conter a animação @keyframes waPulse para o botão flutuante do WhatsApp'
  );

  assert(
    css.includes('.floating-wa') || css.includes('.whatsapp-float') || css.includes('.floating-whatsapp') || css.includes('.btn-float-wa'),
    'css/styles.css deve conter regras de estilo para o botão flutuante de WhatsApp com position: fixed'
  );

  assert(
    css.includes('#backToTop') || css.includes('.back-to-top') || css.includes('.scroll-top-btn'),
    'css/styles.css deve conter regras para o botão subir ao topo'
  );
}

// ==========================================
// 7. Validações de Interatividade em js/main.js
// ==========================================
if (jsExists) {
  const js = fs.readFileSync(JS_PATH, 'utf8');

  assert(
    js.includes('backToTop') || js.includes('scrollTop') || js.includes('scroll-to-top') || js.includes('back-to-top'),
    'js/main.js deve selecionar e controlar o botão de subir ao topo'
  );

  assert(
    js.includes('300') && (js.includes('scrollY') || js.includes('pageYOffset')),
    'js/main.js deve controlar a exibição do botão ao rolar mais de 300px'
  );

  assert(
    js.includes('scrollTo') && js.includes('smooth'),
    'js/main.js deve realizar scroll suave (smooth) para o topo ao clicar'
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
