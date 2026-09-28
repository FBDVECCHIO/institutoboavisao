/**
 * tests/e2e-validate.js
 * 
 * Suíte de Testes End-to-End e Validação Integral do DOM e Configurações
 * Landing Page - Instituto Boa Visão (IBV)
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const INDEX_PATH = path.join(ROOT_DIR, 'index.html');
const CSS_PATH = path.join(ROOT_DIR, 'css', 'styles.css');
const JS_PATH = path.join(ROOT_DIR, 'js', 'main.js');
const VERCEL_JSON_PATH = path.join(ROOT_DIR, 'vercel.json');
const DNS_CONFIG_PATH = path.join(ROOT_DIR, 'DNS_CONFIG.md');
const FAVICON_PATH = path.join(ROOT_DIR, 'assets', 'favicon.svg');
const LOGO_PATH = path.join(ROOT_DIR, 'assets', 'logo.png');

let passed = true;
let totalAssertions = 0;
let passedAssertions = 0;
const results = [];

function assert(condition, message) {
  totalAssertions++;
  if (condition) {
    passedAssertions++;
    results.push(` PASS: ${message}`);
  } else {
    results.push(` FAIL: ${message}`);
    passed = false;
  }
}

console.log('===============================================================');
console.log('   E2E & FULL DOM VALIDATION SUITE — INSTITUTO BOA VISÃO (IBV)   ');
console.log('===============================================================\n');

// -----------------------------------------------------------------
// 1. Arquivos Essenciais e Configurações de Deploy/DNS
// -----------------------------------------------------------------
console.log('--- 1. Estrutura de Arquivos e Configurações de Deploy ---');

assert(fs.existsSync(INDEX_PATH), 'index.html deve existir na raiz do projeto');
assert(fs.existsSync(CSS_PATH), 'css/styles.css deve existir');
assert(fs.existsSync(JS_PATH), 'js/main.js deve existir');
assert(fs.existsSync(FAVICON_PATH), 'assets/favicon.svg deve existir');
assert(fs.existsSync(LOGO_PATH), 'assets/logo.png deve existir');
assert(fs.existsSync(VERCEL_JSON_PATH), 'vercel.json deve existir na raiz');
assert(fs.existsSync(DNS_CONFIG_PATH), 'DNS_CONFIG.md deve existir na raiz');

// Validação de vercel.json
if (fs.existsSync(VERCEL_JSON_PATH)) {
  try {
    const vercelConfig = JSON.parse(fs.readFileSync(VERCEL_JSON_PATH, 'utf8'));
    assert(vercelConfig.cleanUrls === true, 'vercel.json deve configurar cleanUrls: true');
    assert(Array.isArray(vercelConfig.headers), 'vercel.json deve conter array de headers');

    // Validação dos security headers
    const allHeaders = vercelConfig.headers.flatMap(h => h.headers || []);
    const hasContentType = allHeaders.some(h => h.key === 'X-Content-Type-Options' && h.value === 'nosniff');
    const hasFrameOptions = allHeaders.some(h => h.key === 'X-Frame-Options' && h.value === 'DENY');
    const hasXssProtection = allHeaders.some(h => h.key === 'X-XSS-Protection' && h.value.includes('1'));
    const hasCacheControl = allHeaders.some(h => h.key === 'Cache-Control' && h.value.includes('max-age=31536000'));

    assert(hasContentType, 'vercel.json deve incluir header X-Content-Type-Options: nosniff');
    assert(hasFrameOptions, 'vercel.json deve incluir header X-Frame-Options: DENY');
    assert(hasXssProtection, 'vercel.json deve incluir header X-XSS-Protection: 1; mode=block');
    assert(hasCacheControl, 'vercel.json deve incluir política de cache imutável (31536000s) para assets');
  } catch (err) {
    assert(false, `Erro ao validar vercel.json: ${err.message}`);
  }
}

// Validação de DNS_CONFIG.md
if (fs.existsSync(DNS_CONFIG_PATH)) {
  const dnsContent = fs.readFileSync(DNS_CONFIG_PATH, 'utf8');
  assert(dnsContent.includes('INSTITUTOBOAVISAO.COM.BR'), 'DNS_CONFIG.md deve citar o domínio INSTITUTOBOAVISAO.COM.BR');
  assert(dnsContent.includes('76.76.21.21'), 'DNS_CONFIG.md deve especificar o IP Anycast da Vercel (76.76.21.21) para o Registro A');
  assert(dnsContent.includes('cname.vercel-dns.com'), 'DNS_CONFIG.md deve especificar o host cname.vercel-dns.com para o CNAME www');
  assert(dnsContent.includes('Registro.br') || dnsContent.includes('Registro.Br'), 'DNS_CONFIG.md deve detalhar o passo a passo no Registro.Br');
  assert(dnsContent.includes('Vercel'), 'DNS_CONFIG.md deve detalhar os passos no painel da Vercel');
}

// -----------------------------------------------------------------
// 2. DOM Completo — Head, Metas e Acessibilidade
// -----------------------------------------------------------------
console.log('\n--- 2. Validação do DOM: Cabeçalho & Metatags ---');

if (fs.existsSync(INDEX_PATH)) {
  const html = fs.readFileSync(INDEX_PATH, 'utf8');

  assert(/<!doctype html>/i.test(html), 'index.html deve iniciar com declaração <!DOCTYPE html>');
  assert(/<html[^>]*lang=["']pt-BR["']/i.test(html), 'Elemento <html> deve declarar lang="pt-BR"');
  assert(/<meta[^>]*charset=["']UTF-8["']/i.test(html), 'Documento deve conter meta charset UTF-8');
  assert(/name=["']viewport["']/i.test(html) && /width=device-width/i.test(html), 'Documento deve conter meta viewport responsivo');
  assert(html.includes('Instituto Boa Visão — Oftalmologia Especializada em Campinas'), 'Título da página deve conter o título oficial completo');
  assert(/name=["']description["']/i.test(html), 'Documento deve conter meta description');
  assert(html.includes('assets/favicon.svg'), 'Documento deve vincular o favicon oficial em SVG');
  assert(html.includes('css/styles.css'), 'Documento deve carregar css/styles.css');
  assert(html.includes('js/main.js'), 'Documento deve carregar js/main.js');

  // -----------------------------------------------------------------
  // 3. DOM — Topbar, Header e Navegação
  // -----------------------------------------------------------------
  console.log('\n--- 3. Validação do DOM: Topbar & Navegação ---');

  assert(html.includes('Atendimento oftalmológico especializado em Campinas'), 'Topbar deve destacar atendimento oftalmológico em Campinas');
  assert(html.includes('CBO') && html.includes('CRM'), 'Topbar deve destacar títulos de especialistas CBO e CRM');
  assert(html.includes('assets/logo.png'), 'Header deve renderizar o logotipo do Instituto');
  assert(/href=["']#top["']|href=["']#["']/i.test(html), 'Logotipo deve conter link de retorno ao topo');

  const navMenus = [
    { href: '#quem-somos', label: 'Quem Somos' },
    { href: '#consulta', label: 'Consulta' },
    { href: '#especialidades', label: 'Especialidades' },
    { href: '#sintomas', label: 'Sintomas' },
    { href: '#contato', label: 'Contato' }
  ];

  navMenus.forEach(menu => {
    assert(
      html.includes(`href="${menu.href}"`) && new RegExp(menu.label, 'i').test(html),
      `Navegação deve conter menu "${menu.label}" com âncora "${menu.href}"`
    );
  });

  const WA_URL = 'http://api.whatsapp.com/send?1=pt_BR&phone=5519982036487&text=Olá,%20gostaria%20de%20receber%20mais%20informações%20sobre%20a%20consulta';
  assert(html.includes(WA_URL), 'Header deve conter o link oficial do WhatsApp com parâmetros corretos');
  assert(html.includes('Agende sua Consulta'), 'Header deve ter botão CTA "Agende sua Consulta"');
  assert(html.includes('mobile-menu-toggle') || html.includes('hamburger'), 'Header deve possuir botão alternador do menu mobile');
  assert(html.includes('mobile-nav') || html.includes('nav-drawer'), 'Header deve conter menu drawer mobile');

  // -----------------------------------------------------------------
  // 4. DOM — Seção Hero
  // -----------------------------------------------------------------
  console.log('\n--- 4. Validação do DOM: Hero Section ---');

  assert(
    /<section[^>]+id=["']top["']/i.test(html) && html.includes('hero'),
    'Deve conter seção Hero (#top / .hero)'
  );
  assert(
    html.includes('Cuidar da sua visão começa com quem entende!'),
    'Hero deve conter H1 com o texto exato "Cuidar da sua visão começa com quem entende!"'
  );
  assert(
    html.includes('A precisão que seus novos óculos exigem com a segurança de um diagnóstico médico completo.'),
    'Hero deve conter o subtítulo atualizado e objetivo'
  );
  assert(
    html.includes('id="heroLeadForm"'),
    'Hero deve conter formulário de captura de lead (#heroLeadForm)'
  );
  assert(
    html.includes('id="leadNome"') && html.includes('id="leadTelefone"') && html.includes('name="formaContato"'),
    'Hero form deve conter campos Nome Completo, Telefone com DDD e Forma de Contato'
  );
  assert(
    html.includes('id="heroLeadSubmitBtn"'),
    'Hero form deve conter botão de agendamento via WhatsApp (#heroLeadSubmitBtn)'
  );
  assert(
    html.includes('Oftalmologistas credenciados pelo CBO') && html.includes('Registro médico oficial no CRM'),
    'Hero deve exibir badges de credenciamento CBO e CRM'
  );
  assert(
    html.includes('Prescrição precisa') && html.includes('Diagnóstico preventivo de patologias'),
    'Hero deve exibir badges de precisão na prescrição e diagnóstico de patologias'
  );
  assert(
    html.includes('Agendar Consulta pelo WhatsApp') && html.includes(WA_URL),
    'Hero deve conter botão primário com link exato do WhatsApp'
  );
  assert(
    html.includes('href="#consulta"') && html.includes('Como funciona a consulta'),
    'Hero deve conter botão secundário apontando para #consulta'
  );

  // -----------------------------------------------------------------
  // 5. DOM — Seção Sintomas
  // -----------------------------------------------------------------
  console.log('\n--- 5. Validação do DOM: Seção Sintomas ---');

  assert(html.includes('id="sintomas"'), 'Deve existir elemento com id="sintomas"');
  assert(html.includes('Você anda sentindo isso?'), 'Seção Sintomas deve conter a tag introdutória');
  assert(html.includes('Seus olhos podem estar pedindo mais do que novos óculos'), 'Seção Sintomas deve conter H2 de conscientização');

  const sintomasObrigatorios = [
    'Dores de cabeça no fim do dia',
    'Visão embaçada ou oscilante',
    'Fadiga ocular e ardência com telas',
    'Dificuldade para enxergar à noite ou dirigir',
    'Sensação de peso nos olhos'
  ];

  sintomasObrigatorios.forEach(sintoma => {
    assert(html.includes(sintoma), `Seção Sintomas deve apresentar o sintoma: "${sintoma}"`);
  });

  // -----------------------------------------------------------------
  // 6. DOM — Seção Especialidades Médicas (Diferencial CBO)
  // -----------------------------------------------------------------
  console.log('\n--- 6. Validação do DOM: Seção Especialidades Médicas ---');

  assert(html.includes('id="especialidades"'), 'Deve existir elemento com id="especialidades"');
  assert(html.includes('Por que uma consulta com oftalmologista CBO faz toda a diferença?'), 'Especialidades deve conter H2 enfatizando a diferença do especialista CBO');
  assert(html.includes('Simples Medição Comercial de Grau'), 'Especialidades deve conter alerta sobre medição comercial de grau');
  assert(html.includes('Consulta com Oftalmologista CBO no IBV'), 'Especialidades deve conter diferencial da consulta médica CBO');
  assert(html.includes('Refração especializada'), 'Especialidades deve citar Refração especializada');
  assert(html.includes('biomicroscopia') && html.includes('tonometria') && html.includes('fundoscopia'), 'Especialidades deve citar exames clínicos completos');
  assert(html.includes('Prescrição médica oficial') && html.includes('CRM'), 'Especialidades deve citar prescrição médica oficial com CRM');

  // -----------------------------------------------------------------
  // 7. DOM — Seção Consulta & Exame de Refração
  // -----------------------------------------------------------------
  console.log('\n--- 7. Validação do DOM: Seção Consulta em 4 Passos ---');

  assert(html.includes('id="consulta"'), 'Deve existir elemento com id="consulta"');
  assert(html.includes('Anamnese Individualizada'), 'Passo 1 deve ser Anamnese Individualizada');
  assert(html.includes('Refração Especializada'), 'Passo 2 deve ser Refração Especializada');
  assert(html.includes('Lâmpada de Fenda'), 'Passo 3 deve incluir Exame com Lâmpada de Fenda');
  assert(html.includes('Prescrição Médica'), 'Passo 4 deve ser Prescrição Médica e Orientações');

  // -----------------------------------------------------------------
  // 8. DOM — Seção Quem Somos
  // -----------------------------------------------------------------
  console.log('\n--- 8. Validação do DOM: Seção Quem Somos ---');

  assert(html.includes('id="quem-somos"'), 'Deve existir elemento com id="quem-somos"');
  assert(html.includes('Corpo Clínico Especializado') || (html.includes('Corpo Clínico') && html.includes('CBO')), 'Quem Somos deve destacar Corpo Clínico Especializado');
  assert(html.includes('Equipamentos de Precisão') || (html.includes('Tecnologia') && html.includes('precisão')), 'Quem Somos deve destacar Equipamentos de Precisão');
  assert(html.includes('Atendimento Humanizado') || html.includes('humanizado e acolhedor'), 'Quem Somos deve destacar Atendimento Humanizado');

  // -----------------------------------------------------------------
  // 9. DOM — Seção Depoimentos
  // -----------------------------------------------------------------
  console.log('\n--- 9. Validação do DOM: Seção Depoimentos & Slider ---');

  assert(html.includes('id="depoimentos"'), 'Deve existir elemento com id="depoimentos"');
  assert(html.includes('Sandra M.') && html.includes('Cambuí'), 'Depoimento 1: Sandra M. de Cambuí, Campinas');
  assert(html.includes('Ricardo S.') && html.includes('Centro'), 'Depoimento 2: Ricardo S. do Centro, Campinas');
  assert(html.includes('Patrícia N.') && html.includes('Barão Geraldo'), 'Depoimento 3: Patrícia N. de Barão Geraldo');
  assert(html.includes('João V.') && html.includes('Taquaral'), 'Depoimento 4: João V. do Taquaral');
  assert(html.includes('carousel-prev'), 'Controle de carrossel: botão anterior (carousel-prev) deve existir');
  assert(html.includes('carousel-next'), 'Controle de carrossel: botão próximo (carousel-next) deve existir');
  assert(html.includes('carousel-dots') || html.includes('carousel-dot'), 'Indicadores de dots do carrossel (carousel-dots) devem existir');

  // -----------------------------------------------------------------
  // 10. DOM — Seção Contato
  // -----------------------------------------------------------------
  console.log('\n--- 10. Validação do DOM: Seção Contato ---');

  assert(html.includes('id="contato"'), 'Deve existir elemento com id="contato"');
  assert(html.includes('Rua Barão de Jaguara, 1121') && html.includes('sala 63'), 'Contato deve informar endereço na Rua Barão de Jaguara, 1121 - 6° Andar, sala 63 - Centro');
  assert(html.includes('maps.google.com') || html.includes('google.com/maps'), 'Contato deve conter link direto do Google Maps para rotas');
  assert(html.includes('(19) 98203-6487'), 'Contato deve exibir o WhatsApp Oficial formatado (19) 98203-6487 como canal único');
  assert(html.includes('contato@institutoboavisao.com.br'), 'Contato deve exibir o e-mail oficial');
  assert(html.includes('08h às 18h') || html.includes('08h - 18h'), 'Contato deve exibir horários de funcionamento');

  // -----------------------------------------------------------------
  // 11. DOM — Footer & Conformidade Ética
  // -----------------------------------------------------------------
  console.log('\n--- 11. Validação do DOM: Footer Institucional ---');

  assert(html.includes('<footer') && html.includes('</footer>'), 'Deve existir tag <footer> estruturada');
  assert(html.includes('Responsável Técnico') && html.includes('CRM-SP'), 'Footer deve apresentar conformidade ética com Responsável Técnico e CRM-SP');
  assert(html.includes('INSTITUTOBOAVISAO.COM.BR'), 'Footer deve exibir o domínio em caixa alta INSTITUTOBOAVISAO.COM.BR');
  assert(html.includes('2026'), 'Footer deve exibir o copyright atualizado de 2026');
  assert(html.includes('id="adminGearBtn"'), 'Footer deve conter botão discreto de engrenagem para acesso admin (#adminGearBtn)');

  // -----------------------------------------------------------------
  // 12. Elementos Flutuantes & Área Administrativa
  // -----------------------------------------------------------------
  console.log('\n--- 12. Elementos Flutuantes & Modal Admin ---');

  assert(html.includes('floating-whatsapp') || html.includes('whatsapp-floating') || html.includes('btn-whatsapp-fixed'), 'Botão flutuante do WhatsApp deve existir');
  assert(html.includes('back-to-top') || html.includes('btn-top'), 'Botão de atalho para voltar ao topo deve existir');
  assert(html.includes('id="adminModal"'), 'Modal administrativo (#adminModal) deve existir no documento');
  assert(html.includes('id="adminLoginForm"') && html.includes('id="adminDashboardView"'), 'Admin deve possuir visão de login e visão de dashboard');
  assert(html.includes('id="adminLeadsTable"'), 'Admin deve possuir tabela estruturada para gestão de leads (#adminLeadsTable)');
  assert(html.includes('id="tabTableView"') && html.includes('id="tabBoardView"'), 'Admin deve possuir alternador de visão com Tabela e Board Kanban');
  assert(html.includes('<th>Data Consulta</th>'), 'Tabela de leads deve conter coluna "Data Consulta"');
  assert(html.includes('id="adminBoardContainer"'), 'Admin deve possuir container para o Board Kanban (#adminBoardContainer)');
}

// -----------------------------------------------------------------
// 13. Validações de Estilos CSS e Scripts JS
// -----------------------------------------------------------------
console.log('\n--- 13. Integridade do CSS e JS ---');

if (fs.existsSync(CSS_PATH)) {
  const css = fs.readFileSync(CSS_PATH, 'utf8');
  assert(css.includes('--color-primary:') || css.includes('#19431F'), 'CSS deve definir a cor primária #19431F');
  assert(css.includes('--color-secondary:') || css.includes('#A4AA86'), 'CSS deve definir a cor de apoio #A4AA86');
  assert(css.includes('@keyframes waPulse') || css.includes('waPulse') || css.includes('pulse'), 'CSS deve incluir animação de pulso para CTA');
  assert(css.includes('@media (max-width:') || css.includes('@media (min-width:'), 'CSS deve conter media queries para responsividade mobile/desktop');
  assert(css.includes('100vw') && css.includes('100vh'), 'CSS do painel admin deve configurar modal em full screen (100vw x 100vh)');
  assert(css.includes('.field-data-consulta'), 'CSS deve estilizar o campo de data de consulta (.field-data-consulta)');
  assert(css.includes('.admin-board-container') && css.includes('.kanban-column'), 'CSS deve conter estilos para o Board Kanban de leads');
}

if (fs.existsSync(JS_PATH)) {
  const js = fs.readFileSync(JS_PATH, 'utf8');
  assert(js.includes('DOMContentLoaded'), 'JS deve inicializar após DOMContentLoaded');
  assert(js.includes('addEventListener'), 'JS deve registrar interatividade de cliques e scroll');
  assert(js.includes('scrollTo') || js.includes('scrollIntoView') || js.includes('scrollTop'), 'JS deve conter rotina de scroll suave para o topo');
  assert(js.includes('dataConsulta'), 'JS deve gerenciar o campo dataConsulta nos leads');
  assert(js.includes('renderKanbanBoard'), 'JS deve conter função renderKanbanBoard para organizar cards por status');
  assert(js.includes('tabBoardView'), 'JS deve conter alternador de visão para o Board Kanban');
}

// -----------------------------------------------------------------
// Relatório Final e Encerramento
// -----------------------------------------------------------------
console.log('\n===============================================================');
console.log(` RESULTADOS DOS TESTES E2E & DOM:`);
console.log(` Total de Asserções: ${totalAssertions}`);
console.log(` Asserções Aprovadas: ${passedAssertions}`);
console.log(` Asserções Reprovadas: ${totalAssertions - passedAssertions}`);
console.log('===============================================================\n');

results.forEach(res => console.log(res));

if (!passed) {
  console.error('\n❌ TESTES E2E FALHARAM.');
  process.exit(1);
} else {
  console.log('\n🎉 TODOS OS TESTES E2E E DO DOM PASSARAM COM 100% DE SUCESSO!');
  process.exit(0);
}
