# Landing Page Instituto Boa Visão (IBV Campinas) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir uma Landing Page institucional de altíssima conversão, moderna, veloz e 100% responsiva para o Instituto Boa Visão (IBV) de Campinas, destacando o exame de refração especializado para óculos e o atendimento exclusivamente médico credenciado pelo CBO e CRM.

**Architecture:** A aplicação será construída com HTML5 semântico de alta performance, CSS3 moderno baseado em Custom Properties (variáveis de design token derivadas do logo `Bitmap.png`), e JavaScript modular para interações fluidas (menu mobile, carrossel de depoimentos, scroll suave e botão de voltar ao topo). A estrutura será compatível com deploy estático instantâneo na Vercel com zero overhead de build.

**Tech Stack:** HTML5 Semântico, CSS3 Moderno (Flexbox, CSS Grid, Glassmorphism, CSS Variables), Vanilla JavaScript ES6+, SVG Icons, Vercel Static Hosting.

**Spec:** `docs/superpowers/specs/2026-09-25-ibv-landing-page-design.md`

## Global Constraints

- **WhatsApp Link:** O link oficial de agendamento em todos os botões e no float deve ser rigorosamente: `http://api.whatsapp.com/send?1=pt_BR&phone=5519982036487&text=Olá,%20gostaria%20de%20receber%20mais%20informações%20sobre%20a%20consulta`
- **Paleta de Cores:** Primária `#19431F` (Pine Green), Secundária `#A4AA86` (Sage Olive), Dark `#0E2511`, Fundo `#FAFBF9`, Dourado de Destaque `#D4AF37`.
- **Favicon Personalizado:** SVG com formato e silhueta de olho médico, integrado à paleta do site.
- **Menus Obrigatórios:** Quem Somos (`#quem-somos`), Consulta (`#consulta`), Especialidade (Oftalmologia) (`#especialidades`), Sintomas (`#sintomas`), Contato (`#contato`).
- **Botão Subir ao Topo:** Atalho suave com comportamento dinâmico (`window.scrollY > 300`).
- **Credenciais Médicas:** Destacar que 100% dos pacientes são atendidos por oftalmologistas credenciados pelo CBO e CRM oficial, aptos a diagnosticar qualquer patologia ocular.

---

### Task 1: Setup da Identidade Visual, Favicon SVG do Olho, Otimização do Logo e Base de Estilos CSS

**Files:**
- Create: `assets/favicon.svg`
- Create: `assets/logo.png` (cópia otimizada de `Bitmap.png` ou uso direto)
- Create: `css/styles.css`
- Test: `tests/test-assets.js`

**Interfaces:**
- Consumes: Arquivo `Bitmap.png` localizado na raiz do projeto.
- Produces: `assets/favicon.svg`, `css/styles.css` com todas as variáveis `:root` de cores, tipografia, espaçamentos e classes utilitárias.

- [ ] **Step 1: Write test to verify asset and style presence**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement SVG Favicon (Olho), optimize logo asset and write CSS design tokens**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit changes**

---

### Task 2: Cabeçalho Fixo (Header & Navbar Responsiva) com Gatilho WhatsApp

**Files:**
- Create: `index.html` (estrutura inicial, head com meta tags, OpenGraph e header)
- Modify: `css/styles.css` (estilos de header, glassmorphism, links com hover, menu mobile drawer)
- Create: `js/main.js` (toggle de menu mobile)
- Test: `tests/test-header.js`

**Interfaces:**
- Consumes: `assets/favicon.svg`, `assets/logo.png`, `css/styles.css`.
- Produces: Header responsivo com logo IBV, 5 menus de navegação, botão de ação WhatsApp e gaveta mobile.

- [ ] **Step 1: Write failing test for header elements and links**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement Header markup, navigation links and mobile drawer interaction**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit changes**

---

### Task 3: Hero Section com Proposta de Valor, Destaques CBO/CRM e CTAs Duplos

**Files:**
- Modify: `index.html` (inserção da section `#top` / Hero)
- Modify: `css/styles.css` (estilos para hero grid, badges de credibilidade, moldura e sombras)
- Test: `tests/test-hero.js`

**Interfaces:**
- Consumes: Identidade visual da Task 1 e Header da Task 2.
- Produces: Seção Hero com headline de impacto, subtítulo com foco em refração para óculos + diagnóstico completo CBO, badges de confiança e botão WhatsApp oficial.

- [ ] **Step 1: Write failing test for Hero elements, headlines and CTA link**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement Hero section markup and responsive styles**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit changes**

---

### Task 4: Seções de Sintomas Oculares e Especialidade Oftalmológica (Diferencial CBO)

**Files:**
- Modify: `index.html` (seções `#sintomas` e `#especialidades`)
- Modify: `css/styles.css` (grid de cards com ícones médicos, selo CBO em destaque)
- Test: `tests/test-sintomas-especialidades.js`

**Interfaces:**
- Consumes: Variáveis de CSS e convenções de seções.
- Produces: Seção `#sintomas` (5 sinais claros do dia a dia) e Seção `#especialidades` (por que uma consulta médica com oftalmologista CBO é essencial e diagnostica qualquer patologia).

- [ ] **Step 1: Write failing test for Sintomas e Especialidade sections**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement markup and styling for Sintomas and Especialidade**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit changes**

---

### Task 5: Seções de Consulta (Passo a Passo do Exame de Refração), Quem Somos e Depoimentos

**Files:**
- Modify: `index.html` (seções `#consulta`, `#quem-somos`, `#depoimentos`)
- Modify: `css/styles.css` (estilos para timeline de passos, grid sobre o IBV, cards de depoimentos 5 estrelas)
- Modify: `js/main.js` (slider/controles de depoimentos)
- Test: `tests/test-consulta-depoimentos.js`

**Interfaces:**
- Consumes: Estrutura base de `index.html`.
- Produces: Seções `#consulta`, `#quem-somos` e `#depoimentos` com prova social e botões de agendamento WhatsApp ao final dos blocos.

- [ ] **Step 1: Write failing test for Consulta, Quem Somos and Depoimentos**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement Consulta, Quem Somos, Depoimentos and carousel logic**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit changes**

---

### Task 6: Seção de Contato, Rodapé Completo, Botão Flutuante WhatsApp e Atalho 'Subir ao Topo'

**Files:**
- Modify: `index.html` (seção `#contato`, `footer`, botões flutuantes)
- Modify: `css/styles.css` (estilos para contato, mapa, footer institucional, botão flutuante com animação de pulso, botão subir ao topo)
- Modify: `js/main.js` (comportamento de scroll para subir ao topo e detecção de visibilidade)
- Test: `tests/test-contato-footer.js`

**Interfaces:**
- Consumes: Todas as âncoras da página.
- Produces: Seção `#contato` detalhada, rodapé profissional com créditos e conformidade CBO/CRM, botão flutuante de WhatsApp e botão de volta ao topo.

- [ ] **Step 1: Write failing test for Contato, Footer, Floating WhatsApp and Back to Top button**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement Contato, Footer, Floating WhatsApp and Back to Top script**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit changes**

---

### Task 7: Configuração de Deploy Vercel, Documentação DNS Registro.Br e Validação E2E com /agent-browser

**Files:**
- Create: `vercel.json` (configurações de headers de cache, segurança e rotas limpas)
- Create: `DNS_CONFIG.md` (guia passo a passo pronto para zona DNS no Registro.Br com domínio `INSTITUTOBOAVISAO.COM.BR`)
- Create: `tests/e2e-validate.js`
- Test: Execução com `agent-browser` para validação visual e interativa completa.

**Interfaces:**
- Consumes: Aplicação completa construída nas Tasks 1 a 6.
- Produces: Repositório validado, pronto para GitHub/Vercel, guia DNS e relatório de testes visuais do `agent-browser`.

- [ ] **Step 1: Create vercel.json and DNS_CONFIG.md**
- [ ] **Step 2: Run local web server and launch agent-browser**
- [ ] **Step 3: Test navigation, scroll-to-top, mobile view, and WhatsApp links**
- [ ] **Step 4: Capture screenshots with agent-browser**
- [ ] **Step 5: Commit final state to git**
