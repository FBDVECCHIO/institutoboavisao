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

console.log('--- Executando Testes de Sintomas e Especialidades (Task 4) ---');

// 1. Validar existência dos arquivos
const indexExists = fs.existsSync(INDEX_PATH);
assert(indexExists, 'index.html deve existir na raiz do projeto');

const cssExists = fs.existsSync(CSS_PATH);
assert(cssExists, 'css/styles.css deve existir');

const WA_URL = 'http://api.whatsapp.com/send?1=pt_BR&phone=5519982036487&text=Olá,%20gostaria%20de%20receber%20mais%20informações%20sobre%20a%20consulta';

if (indexExists) {
  const html = fs.readFileSync(INDEX_PATH, 'utf8');

  // ==========================================
  // 2. Seção de Sintomas (#sintomas)
  // ==========================================
  assert(
    /<section[^>]+id=["']sintomas["']/i.test(html),
    'Deve existir uma <section id="sintomas" ...>'
  );

  // Header da seção Sintomas
  assert(
    html.includes('Você anda sentindo isso?'),
    'Seção Sintomas deve conter a tag superior "Você anda sentindo isso?"'
  );
  assert(
    html.includes('Seus olhos podem estar pedindo mais do que novos óculos'),
    'Seção Sintomas deve conter o H2: "Seus olhos podem estar pedindo mais do que novos óculos"'
  );
  assert(
    html.includes('Sinais comuns do cotidiano indicam que sua visão e a saúde dos seus olhos merecem uma avaliação médica aprofundada'),
    'Seção Sintomas deve conter o subtítulo explicativo correto'
  );

  // 5 Queixas Frequentes
  assert(
    html.includes('Dores de cabeça no fim do dia') &&
    (html.includes('grau desatualizado') || html.includes('não corrigido')),
    'Sintoma 1: "Dores de cabeça no fim do dia" com menção a grau desatualizado/não corrigido'
  );

  assert(
    html.includes('Visão embaçada ou oscilante') &&
    (html.includes('foco') || html.includes('ler de perto')),
    'Sintoma 2: "Visão embaçada ou oscilante" com foco de perto/placas/telas'
  );

  assert(
    (html.includes('Fadiga ocular') || html.includes('Cansaço visual')) &&
    (html.includes('telas') || html.includes('computador')),
    'Sintoma 3: "Fadiga ocular e ardência com telas" (celular e computador)'
  );

  assert(
    (html.includes('Dificuldade para enxergar à noite') || html.includes('Dificuldade à noite')) &&
    (html.includes('faróis') || html.includes('escuro') || html.includes('dirigir')),
    'Sintoma 4: "Dificuldade para enxergar à noite ou dirigir" com perda de nitidez/halos'
  );

  assert(
    (html.includes('Sensação de peso nos olhos') || html.includes('afastar objetos')) &&
    (html.includes('foco') || html.includes('apertar os olhos') || html.includes('afastar objetos')),
    'Sintoma 5: "Sensação de peso nos olhos" / necessidade de afastar objetos ou forçar foco'
  );

  // CTA da seção Sintomas
  assert(
    html.includes('Identificou algum desses sintomas? Não adie o cuidado com a sua visão'),
    'Seção Sintomas deve conter a frase de incentivo ao diagnóstico preventivo'
  );

  // Validar link de WhatsApp na seção Sintomas
  const sintomasSectionMatch = html.match(/<section[^>]+id=["']sintomas["'][\s\S]*?<\/section>/i);
  if (sintomasSectionMatch) {
    const sintomasHtml = sintomasSectionMatch[0];
    assert(
      sintomasHtml.includes(WA_URL),
      'Seção Sintomas deve conter botão CTA com link oficial do WhatsApp'
    );
    assert(
      sintomasHtml.includes('Agende sua Consulta') || sintomasHtml.includes('Agendar Consulta'),
      'Botão de CTA na seção Sintomas deve conter texto convidando ao agendamento'
    );
  } else {
    assert(false, 'Não foi possível extrair a seção Sintomas para validação detalhada');
  }

  // ==========================================
  // 3. Seção de Especialidade Médica (#especialidades)
  // ==========================================
  assert(
    /<section[^>]+id=["']especialidades["']/i.test(html),
    'Deve existir uma <section id="especialidades" ...>'
  );

  // Header da seção Especialidades
  assert(
    html.includes('Especialidade Médica'),
    'Seção Especialidades deve conter a tag superior "Especialidade Médica"'
  );
  assert(
    html.includes('Por que uma consulta com oftalmologista CBO faz toda a diferença?'),
    'Seção Especialidades deve conter o H2: "Por que uma consulta com oftalmologista CBO faz toda a diferença?"'
  );
  assert(
    html.includes('A medição de grau para óculos deve ser sempre acompanhada de uma avaliação oftalmológica completa'),
    'Seção Especialidades deve conter o subtítulo destacando avaliação completa'
  );

  // Autoridade Médica 100% CBO e CRM
  assert(
    html.includes('CBO') && html.includes('CRM') &&
    (html.includes('Conselho Brasileiro de Oftalmologia') || html.includes('credenciados pelo CBO')),
    'Seção Especialidades deve destacar Corpo Clínico credenciado pelo CBO e CRM'
  );
  assert(
    html.includes('residência médica') || html.includes('prova de títulos'),
    'Seção Especialidades deve citar rigor da formação (residência médica / prova de títulos CBO)'
  );

  // Rastreio e Diagnóstico Precoce de Patologias
  assert(
    html.includes('Glaucoma') &&
    (html.includes('pressão intraocular') || html.includes('nervo óptico')),
    'Seção Especialidades deve detalhar detecção de Glaucoma (pressão intraocular e nervo óptico)'
  );
  assert(
    html.includes('Catarata') &&
    (html.includes('cristalino') || html.includes('opacidade')),
    'Seção Especialidades deve detalhar detecção de Catarata (opacidade do cristalino)'
  );
  assert(
    html.includes('Ceratocone') || html.includes('córnea'),
    'Seção Especialidades deve detalhar Ceratocone / alterações na córnea'
  );
  assert(
    html.includes('Retinopatia') || html.includes('diabética'),
    'Seção Especialidades deve detalhar detecção de Retinopatia diabética ou hipertensiva'
  );
  assert(
    html.includes('olho seco') || html.includes('Olho Seco') || html.includes('alergias oculares'),
    'Seção Especialidades deve detalhar Síndrome do Olho Seco ou alergias oculares'
  );

  // Diferencial prático: medição comercial vs consulta médica
  assert(
    html.includes('medição') &&
    (html.includes('doenças silenciosas') || html.includes('doença silenciosa') || html.includes('silenciosas')),
    'Seção Especialidades deve contrapor simples medição comercial com detecção de doenças silenciosas'
  );

  // Validar link de WhatsApp na seção Especialidades
  const especialidadesSectionMatch = html.match(/<section[^>]+id=["']especialidades["'][\s\S]*?<\/section>/i);
  if (especialidadesSectionMatch) {
    const especialidadesHtml = especialidadesSectionMatch[0];
    assert(
      especialidadesHtml.includes(WA_URL),
      'Seção Especialidades deve conter botão CTA com link oficial do WhatsApp'
    );
    assert(
      especialidadesHtml.includes('Agende sua Consulta com Especialista CBO') ||
      especialidadesHtml.includes('Agendar Consulta com Especialista CBO') ||
      especialidadesHtml.includes('Agende sua Consulta'),
      'Botão de CTA na seção Especialidades deve convidar ao agendamento com especialista CBO'
    );
  } else {
    assert(false, 'Não foi possível extrair a seção Especialidades para validação detalhada');
  }
}

// ==========================================
// 4. Validações de Estilização em css/styles.css
// ==========================================
if (cssExists) {
  const css = fs.readFileSync(CSS_PATH, 'utf8');

  assert(
    css.includes('#sintomas') || css.includes('.sintomas') || css.includes('.sintoma-card'),
    'css/styles.css deve conter estilos para a seção de Sintomas'
  );
  assert(
    css.includes('#especialidades') || css.includes('.especialidades') || css.includes('.especialidade-'),
    'css/styles.css deve conter estilos para a seção de Especialidades'
  );
  assert(
    css.includes('.sintomas-grid') || css.includes('.sintomas-cards') || css.includes('.sintoma-card'),
    'css/styles.css deve conter grid ou cards para apresentação dos sintomas'
  );
  assert(
    css.includes('.patologias') || css.includes('.patologia-card') || css.includes('.patologia-item') || css.includes('.cbo-banner') || css.includes('.especialidade-card'),
    'css/styles.css deve conter componentes para patologias e diferencial CBO'
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
