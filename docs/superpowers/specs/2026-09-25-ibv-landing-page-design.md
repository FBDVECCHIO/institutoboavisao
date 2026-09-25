# Especificação de Design: Landing Page Instituto Boa Visão (IBV Campinas)

**Data:** 2026-09-25  
**Projeto:** Landing Page Institucional de Alta Conversão  
**Cliente:** Instituto Boa Visão de Campinas (IBV)  
**Domínio:** INSTITUTOBOAVISAO.COM.BR  
**Repositório Local:** `C:\Users\fbdv1\.gemini\antigravity\scratch\ibv-lp`

---

## 1. Visão Geral e Posicionamento

O **Instituto Boa Visão (IBV)** é um centro oftalmológico de excelência localizado em Campinas/SP. O objetivo desta Landing Page é consolidar a presença digital institucional do Instituto e impulsionar o agendamento de consultas especializadas com foco primordial no **exame de refração para óculos**.

### Diferencial Competitivo e Mensagem Central:
- **Exame de Refração Especializado:** Prescrição minuciosa e de alta precisão para óculos de grau (miopia, hipermetropia, astigmatismo, presbiopia).
- **Corpo Clínico 100% CBO e CRM:** Todos os pacientes são atendidos exclusivamente por médicos oftalmologistas credenciados pelo **Conselho Brasileiro de Oftalmologia (CBO)** e com registro ativo no **CRM**.
- **Diagnóstico Integral de Patologias:** Mais do que apenas medir o grau, a consulta médica oftalmológica avalia a saúde global dos olhos, diagnosticando precocemente patologias como glaucoma, catarata, alterações na retina, ceratocone, olho seco e retinopatia diabética.
- **Acessibilidade e Atendimento Humanizado:** Medicina de ponta acessível para a população de Campinas e região metropolitana, com agendamento imediato e descomplicado via WhatsApp.

---

## 2. Identidade Visual e Paleta de Cores

A identidade visual foi calibrada a partir do logotipo oficial (`Bitmap.png`), garantindo equilíbrio entre a autoridade médica e uma atmosfera moderna, acolhedora e confiável:

- **Pine Green (Verde Pinheiro / Primária):** `#19431F`  
  Utilizada no cabeçalho, tipografia principal, fundos escuros de destaque e elementos de contraste.
- **Sage / Olive Green (Verde Oliva Suave / Secundária):** `#A4AA86`  
  Utilizada em badges, detalhes ornamentais, bordas e ícones auxiliares.
- **Deep Forest Dark (Verde Profundo Escuro):** `#0E2511` / `#133418`  
  Para o rodapé e seções de contraste premium.
- **Warm Gold Accent (Dourado de Destaque / Ação):** `#C89B3C` / `#D4AF37`  
  Para selos CBO, estrelas de avaliação e botões secundários ou badges de urgência positiva.
- **Backgrounds e Superfícies:**  
  - Fundo principal: `#FAFBF9` (off-white limpo com nuance verde suave)  
  - Fundo de cartões: `#FFFFFF` com sombras suaves (`box-shadow: 0 10px 30px rgba(25, 67, 31, 0.06)`)  
  - Fundo de seções alternadas: `#F0F4EC`
- **Favicon:** Ícone SVG personalizado representando um olho estilizado e harmônico com as curvas do logotipo, integrado nas cores `#19431F` e `#A4AA86`.

---

## 3. Estrutura de Menus e Navegação

A navegação superior fixa é composta por:
1. **Logotipo IBV** (com link para o topo `#top`)
2. **Quem Somos** (`#quem-somos`)
3. **Consulta** (`#consulta`)
4. **Especialidade (Oftalmologia)** (`#especialidades`)
5. **Sintomas** (`#sintomas`)
6. **Contato** (`#contato`)
7. **Botão de Ação (CTA WhatsApp):** "Agende sua Consulta" (com ícone do WhatsApp)
8. **Botão Flutuante 'Voltar ao Topo':** Atalho discreto que surge após a rolagem da página para levar o usuário com suavidade de volta ao topo.

---

## 4. Seções da Landing Page

### 4.1. Header Fixo & Topbar Informativa
- Barra superior informativa com aviso de atendimento CBO em Campinas.
- Header com efeito glassmorphism suave (`backdrop-filter: blur(12px)`), logo à esquerda, navegação central e botão de CTA destacado à direita.
- Menu mobile responsivo estilo "drawer" / offcanvas acessível com toque.

### 4.2. Hero Section (Banner Principal)
- **Título de Alto Impacto:** "Cuidar da sua visão começa com quem entende. Exame de refração e consulta médica completa em Campinas."
- **Subtítulo:** "Tenha a precisão que seus olhos merecem com médicos oftalmologistas credenciados pelo CBO e CRM. Diagnóstico completo para óculos e saúde ocular."
- **CTAs Duplos:**
  - Primário: "Agendar Consulta pelo WhatsApp" (Gatilho oficial)
  - Secundário: "Conhecer a Consulta Completa" (âncora interna para `#consulta`)
- **Badges de Confiança Imediata:**
  - [✓] Oftalmologistas credenciados pelo CBO
  - [✓] CRM ativo e diagnóstico completo
  - [✓] Tecnologia de precisão para seus óculos
  - [✓] Agendamento rápido sem burocracia
- **Composição Visual:** Elemento ilustrativo/fotográfico de alta qualidade com selo flutuante de autoridade médica.

### 4.3. Sintomas (Você Anda Sentindo Isso?)
Identificação de queixas frequentes que exigem exame de refração ou avaliação médica:
1. **Dores de cabeça no fim do dia:** esforço muscular contínuo para focar.
2. **Visão embaçada ou duplicada:** dificuldade para ler placas ou textos no celular.
3. **Fadiga ocular com telas:** ardência, olhos vermelhos e lacrimejamento pós-computador.
4. **Dificuldade para enxergar à noite:** perda de contraste ou halos ao dirigir no escuro.
5. **Necessidade de afastar ou aproximar objetos:** sinal claro de presbiopia ("vista cansada").
- CTA contextual ao final do bloco direcionando para o WhatsApp.

### 4.4. Especialidade: Oftalmologia Especializada & CBO
- Explicação clara da diferença vital entre uma simples medição comercial de grau e uma consulta médica oftalmológica com médico CBO.
- O oftalmologista não só afere o grau com precisão nanométrica, mas também:
  - Avalia fundo de olho e pressão intraocular (prevenção do glaucoma)
  - Identifica início de catarata
  - Detecta ceratocone e astigmatismos irregulares
  - Examina a saúde da retina e córnea
- Selo de destaque: **100% Médicos Especialistas CBO & CRM Oficial**.

### 4.5. Consulta: Como Funciona o Exame de Refração
- Passo a passo da consulta no IBV:
  1. **Anamnese e Queixa Visual:** escuta atenta das necessidades do seu dia a dia (leitura, computador, direção).
  2. **Refração Computadorizada & Subjetiva:** teste minucioso das lentes para encontrar o grau ideal e confortável.
  3. **Avaliação Clínica da Saúde Ocular:** exame com lâmpada de fenda e checagem de estruturas oculares.
  4. **Prescrição e Orientação Médica:** receita oftalmológica oficial carimbada e assinada com CRM, com orientações personalizadas para confecção das lentes.
- Bloco de facilidade de agendamento com botão de CTA.

### 4.6. Quem Somos (O Instituto Boa Visão de Campinas)
- A história e o compromisso do IBV em Campinas: democratizar o acesso à medicina oftalmológica de alta qualidade.
- Ambiente confortável, equipamentos modernos de refração e localização central de fácil acesso em Campinas.
- Equipe ética, acolhedora e dedicada ao bem-estar da sua família.

### 4.7. Depoimentos e Prova Social
- Avaliações reais de pacientes de Campinas destacando a atenção médica, a precisão da receita de óculos e a rapidez do agendamento.
- Exibição com estrelas 5 estrelas e formato carrossel/grid limpo e legível.

### 4.8. Seção de Contato e Localização
- Endereço físico e orientações de chegada em Campinas/SP.
- Botão direto para traçar rota no Google Maps.
- Horários de atendimento (Segunda a Sexta, Sábado).
- Link oficial do WhatsApp, telefone e e-mail.

### 4.9. Rodapé Institucional
- Logotipo oficial IBV com cores harmonizadas.
- Links rápidos para todas as seções da página.
- Informações regulatórias de saúde (menção a médicos com CRM e CBO).
- Copyright © 2026 Instituto Boa Visão - Todos os direitos reservados.

### 4.10. Elementos Flutuantes
- **Botão Flutuante do WhatsApp:** Canto inferior direito, com animação pulsante discreta e link direto.
- **Botão Subir ao Topo:** Canto inferior direito (ao lado do WhatsApp), surge após scroll de 300px.

---

## 5. Requisitos de Conversão e Links

O link de gatilho do WhatsApp em **todos** os botões da página (Header, Banners, Seções e Float) deve ser exatamente:
`http://api.whatsapp.com/send?1=pt_BR&phone=5519982036487&text=Olá,%20gostaria%20de%20receber%20mais%20informações%20sobre%20a%20consulta`

---

## 6. Preparação para Domínio e Vercel

- **Domínio Registro.Br:** `INSTITUTOBOAVISAO.COM.BR`
- **Arquivo de Configuração Vercel:** `vercel.json` com cabeçalhos de segurança (X-Content-Type-Options, X-Frame-Options, Cache-Control).
- **Instruções DNS inclusas:** Apontamento Tipo A (`76.76.21.21`) e CNAME (`cname.vercel-dns.com`) para o Registro.br.
