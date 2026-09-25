# Guia de Configuração de DNS — INSTITUTOBOAVISAO.COM.BR (Registro.br & Vercel)

Este documento fornece o passo a passo completo, detalhado e validado para realizar o apontamento de domínio da landing page do **Instituto Boa Visão (IBV)** para a plataforma **Vercel**, utilizando a gestão de DNS do **Registro.Br**.

---

## 1. Visão Geral da Arquitetura DNS

| Entrada | Tipo | Nome / Host | Destino / Valor | TTL | Finalidade |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Apex / Raiz** | `A` | `@` (ou em branco) | `76.76.21.21` | Padrão (1h) | Direciona o domínio raiz (`institutoboavisao.com.br`) aos servidores Anycast da Vercel |
| **Subdomínio** | `CNAME` | `www` | `cname.vercel-dns.com` | Padrão (1h) | Direciona `www.institutoboavisao.com.br` para o resolvedor global da Vercel |

---

## 2. Passo a Passo no Registro.br

### Pré-requisito
Certifique-se de que o domínio está utilizando os **Servidores DNS do Registro.br** (modo padrão gratuito do Registro.br). Caso o domínio utilize servidores DNS externos (como Cloudflare ou provedor de hospedagem), a zona DNS deve ser gerenciada no respectivo provedor.

### Etapas de Configuração:
1. Acesse o portal oficial [Registro.br](https://registro.br) e efetue login com o seu usuário/CPF/CNPJ e senha.
2. No Painel de Controle, clique sobre o domínio **`INSTITUTOBOAVISAO.COM.BR`**.
3. Role a página até o bloco **DNS**.
   - Se os servidores já forem os do Registro.br, clique em **"Editar Zona"** ou **"Configurar Endereçamento"**.
   - Se estiver no modo básico, clique em **"Modo Avançado"** para liberar a inserção de registros A e CNAME.
4. **Adicionar o Registro A (Domínio Raiz):**
   - Clique em **"Nova Entrada"** (ou **Adicionar Record**).
   - Campo **Nome**: Deixe em branco ou informe `@` (o Registro.br aceita deixar o campo de entrada em branco para o domínio raiz).
   - Tipo de Registro: Selecione **`A`**.
   - Dados / Endereço IP: Digite exatamente `76.76.21.21`
   - Clique em salvar/adicionar.
5. **Adicionar o Registro CNAME (Subdomínio WWW):**
   - Clique novamente em **"Nova Entrada"**.
   - Campo **Nome**: Digite `www`
   - Tipo de Registro: Selecione **`CNAME`**.
   - Dados / Destino: Digite `cname.vercel-dns.com`
   - Clique em salvar/adicionar.
6. Clique no botão verde **"Salvar Alterações"** no rodapé do bloco de DNS.

---

## 3. Passo a Passo no Painel da Vercel

1. Acesse o painel da [Vercel](https://vercel.com) e selecione o projeto correspondente à landing page (**ibv-lp** ou nome configurado).
2. No menu superior do projeto, acesse **Settings** > **Domains**.
3. No campo **Domain**, digite:
   ```text
   institutoboavisao.com.br
   ```
   e clique em **Add**.
4. A Vercel perguntará se deseja adicionar automaticamente a variante recomendada com `www` e criar o redirecionamento:
   - Escolha a opção: **"Add institutoboavisao.com.br and redirect www.institutoboavisao.com.br to it"** (ou vice-versa, conforme a preferência da diretoria do IBV).
5. O painel exibirá o status de validação:
   - **Valid Configuration**: Ícone verde indicando que os registros A e CNAME foram propagados e reconhecidos.
   - **Generating SSL Certificate**: A Vercel emite automaticamente e sem custo um certificado SSL/TLS (Let's Encrypt), garantindo HTTPS para o domínio.

---

## 4. Prazos de Propagação e Verificação

### Tempo de Propagação
- No Registro.br, a publicação da zona para os servidores de nomes brasileiros leva normalmente entre **15 minutos e 2 horas**.
- A propagação global para provedores de internet (Claro, Vivo, Starlink, etc.) pode levar até **24 horas**.

### Como Validar via Terminal (Windows / Linux / macOS)

Abra o prompt de comando (PowerShell ou Bash) e execute:

```powershell
# 1. Verificar o Apontamento Tipo A (Domínio Raiz)
nslookup institutoboavisao.com.br
# Resposta esperada: Address: 76.76.21.21

# 2. Verificar o Apontamento Tipo CNAME (WWW)
nslookup -type=cname www.institutoboavisao.com.br
# Resposta esperada: canonical name = cname.vercel-dns.com

# 3. Teste de requisição HTTP/HTTPS com Headers de Segurança
curl -I https://institutoboavisao.com.br
```

### Ferramentas Web Recomendadas para Acompanhar a Propagação:
- [DNSChecker.org - Registro A](https://dnschecker.org/#A/institutoboavisao.com.br)
- [DNSChecker.org - Registro CNAME](https://dnschecker.org/#CNAME/www.institutoboavisao.com.br)

---

## 5. Resolução de Problemas Comuns (Troubleshooting)

1. **"Conflicting Records" no Registro.br:**
   - Se já existirem registros anteriores do tipo A ou CNAME apontando para servidores antigos de hospedagem, exclua-os antes de adicionar os valores da Vercel.
2. **DNSSEC Ativo:**
   - Caso o domínio tenha DNSSEC ativado com chaves antigas, a resolução pode falhar. Verifique na seção DNSSEC do Registro.br se está desativado ou sincronizado.
3. **Certificado SSL pendente:**
   - A emissão do certificado Let's Encrypt na Vercel só ocorre após a detecção e propagação completa do registro DNS. Se após 2 horas o SSL estiver pendente, clique no botão **"Refresh"** ao lado do domínio no dashboard da Vercel.
