/**
 * Instituto Boa Visão (IBV Campinas) - Script Principal
 * Funcionalidades: Controle de Menu Mobile Drawer, Sticky Header Glassmorphism e Gatilhos de Interação
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Elementos do Cabeçalho e Menu Mobile
  const mainHeader = document.getElementById('mainHeader');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerClose = document.getElementById('drawerClose');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const desktopNavLinks = document.querySelectorAll('.nav-link');

  // 2. Controle de Abertura e Fechamento do Menu Mobile Drawer
  function openMobileMenu() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('is-open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    if (mobileMenuToggle) {
      mobileMenuToggle.setAttribute('aria-expanded', 'true');
      mobileMenuToggle.classList.add('is-active');
    }
    document.body.classList.add('menu-open');
  }

  function closeMobileMenu() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('is-open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    if (mobileMenuToggle) {
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
      mobileMenuToggle.classList.remove('is-active');
    }
    document.body.classList.remove('menu-open');
  }

  function toggleMobileMenu() {
    const isOpen = mobileDrawer && mobileDrawer.classList.contains('is-open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  // 3. Event Listeners para o Menu Mobile
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  if (drawerClose) {
    drawerClose.addEventListener('click', (e) => {
      e.stopPropagation();
      closeMobileMenu();
    });
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', () => {
      closeMobileMenu();
    });
  }

  // Fechar gaveta ao clicar em qualquer link da navegação mobile
  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Fechar gaveta ao pressionar a tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('is-open')) {
      closeMobileMenu();
    }
  });

  // 4. Efeito de Scroll no Header (Glassmorphism & Sombra Suave)
  function handleHeaderScroll() {
    if (!mainHeader) return;
    if (window.scrollY > 20) {
      mainHeader.classList.add('header-scrolled');
    } else {
      mainHeader.classList.remove('header-scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // Execução inicial para checar posição pós-reload

  // 5. Carrossel Interativo de Depoimentos (#depoimentos)
  const testimonialsCarousel = document.getElementById('testimonialsCarousel');
  const testimonialsTrack = document.getElementById('testimonialsTrack');
  const carouselPrevBtn = document.getElementById('carouselPrevBtn');
  const carouselNextBtn = document.getElementById('carouselNextBtn');
  const carouselDots = document.querySelectorAll('.carousel-dot');
  const testimonialCards = document.querySelectorAll('.testimonial-card');

  if (testimonialsTrack && testimonialCards.length > 0) {
    let currentSlide = 0;
    const totalSlides = testimonialCards.length;
    let autoPlayInterval = null;

    function goToSlide(index) {
      if (index < 0) {
        currentSlide = totalSlides - 1;
      } else if (index >= totalSlides) {
        currentSlide = 0;
      } else {
        currentSlide = index;
      }

      // Desloca o track horizontalmente
      testimonialsTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

      // Atualiza estado ativo dos dots
      carouselDots.forEach((dot, dotIdx) => {
        const isActive = dotIdx === currentSlide;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      // Atualiza visibilidade acessível dos cards
      testimonialCards.forEach((card, cardIdx) => {
        card.setAttribute('aria-hidden', cardIdx === currentSlide ? 'false' : 'true');
      });
    }

    function nextSlide() {
      goToSlide(currentSlide + 1);
    }

    function prevSlide() {
      goToSlide(currentSlide - 1);
    }

    // Ouvintes dos botões de navegação
    if (carouselNextBtn) {
      carouselNextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
      });
    }

    if (carouselPrevBtn) {
      carouselPrevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
      });
    }

    // Ouvintes para cada dot indicador
    carouselDots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const targetIndex = parseInt(dot.getAttribute('data-index'), 10);
        if (!isNaN(targetIndex)) {
          goToSlide(targetIndex);
          resetAutoPlay();
        }
      });
    });

    // Suporte a Navegação por Teclado (Setas Esquerda/Direita) quando em foco
    if (testimonialsCarousel) {
      testimonialsCarousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          prevSlide();
          resetAutoPlay();
        } else if (e.key === 'ArrowRight') {
          nextSlide();
          resetAutoPlay();
        }
      });
    }

    // Suporte a Gesto Touch/Swipe em Smartphones
    let touchStartX = 0;
    let touchEndX = 0;

    testimonialsTrack.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    testimonialsTrack.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const swipeThreshold = 45;
      if (touchStartX - touchEndX > swipeThreshold) {
        nextSlide();
        resetAutoPlay();
      } else if (touchEndX - touchStartX > swipeThreshold) {
        prevSlide();
        resetAutoPlay();
      }
    }

    // Autoplay suave com pausa no hover / foco
    function startAutoPlay() {
      stopAutoPlay();
      autoPlayInterval = setInterval(() => {
        nextSlide();
      }, 7000);
    }

    function stopAutoPlay() {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
      }
    }

    function resetAutoPlay() {
      stopAutoPlay();
      startAutoPlay();
    }

    if (testimonialsCarousel) {
      testimonialsCarousel.addEventListener('mouseenter', stopAutoPlay);
      testimonialsCarousel.addEventListener('mouseleave', startAutoPlay);
      testimonialsCarousel.addEventListener('focusin', stopAutoPlay);
      testimonialsCarousel.addEventListener('focusout', startAutoPlay);
    }

    // Inicialização da posição e autoplay
    goToSlide(0);
    startAutoPlay();
  }

  // 6. Botão de Atalho "Subir ao Topo" (#backToTop)
  const backToTopBtn = document.getElementById('backToTop');

  function handleBackToTopVisibility() {
    if (!backToTopBtn) return;
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('is-visible');
    } else {
      backToTopBtn.classList.remove('is-visible');
    }
  }

  if (backToTopBtn) {
    window.addEventListener('scroll', handleBackToTopVisibility, { passive: true });
    handleBackToTopVisibility();

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ==========================================================================
  // 7. Formulário de Captura de Lead no Hero (WhatsApp)
  // ==========================================================================
  function formatPhoneNumber(value) {
    const digits = (value || '').replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) {
      return digits ? `(${digits}` : '';
    }
    if (digits.length <= 6) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    if (digits.length <= 10) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  }

  const heroLeadForm = document.getElementById('heroLeadForm');
  const leadNomeInput = document.getElementById('leadNome');
  const leadTelefoneInput = document.getElementById('leadTelefone');
  const leadNomeError = document.getElementById('leadNomeError');
  const leadTelefoneError = document.getElementById('leadTelefoneError');

  if (leadTelefoneInput) {
    leadTelefoneInput.addEventListener('input', (e) => {
      e.target.value = formatPhoneNumber(e.target.value);
      if (leadTelefoneError) leadTelefoneError.textContent = '';
      leadTelefoneInput.classList.remove('is-invalid');
    });
  }

  if (leadNomeInput) {
    leadNomeInput.addEventListener('input', () => {
      if (leadNomeError) leadNomeError.textContent = '';
      leadNomeInput.classList.remove('is-invalid');
    });
  }

  if (heroLeadForm) {
    heroLeadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const nomeVal = (leadNomeInput ? leadNomeInput.value : '').trim();
      const telefoneVal = (leadTelefoneInput ? leadTelefoneInput.value : '').trim();
      const digits = telefoneVal.replace(/\D/g, '');

      if (!nomeVal || nomeVal.length < 2) {
        if (leadNomeError) leadNomeError.textContent = 'Por favor, informe seu nome completo.';
        if (leadNomeInput) leadNomeInput.classList.add('is-invalid');
        isValid = false;
      }

      if (!digits || digits.length < 10) {
        if (leadTelefoneError) leadTelefoneError.textContent = 'Informe um telefone com DDD válido.';
        if (leadTelefoneInput) leadTelefoneInput.classList.add('is-invalid');
        isValid = false;
      }

      if (!isValid) return;

      const selectedForma = heroLeadForm.querySelector('input[name="formaContato"]:checked');
      const formaContatoVal = selectedForma ? selectedForma.value : 'WhatsApp';

      // 1. Salvar lead no localStorage
      const newLead = {
        id: 'lead_' + Date.now(),
        dataHora: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
        timestamp: Date.now(),
        dataConsulta: '',
        nome: nomeVal,
        telefone: telefoneVal,
        formaContato: formaContatoVal,
        loja: '',
        os: '',
        valor: '',
        vendedor: '',
        status: 'Pendente'
      };

      const leadsList = getLeads();
      leadsList.unshift(newLead);
      saveLeads(leadsList);

      // 2. Montar mensagem oficial e abrir WhatsApp
      const waMsg = `Olá, gostaria de receber mais informações sobre a consulta. Meu nome é ${nomeVal}, telefone ${telefoneVal} e prefiro contato por ${formaContatoVal}.`;
      const waUrl = `http://api.whatsapp.com/send?1=pt_BR&phone=5519982036487&text=${encodeURIComponent(waMsg)}`;

      // Resetar formulário
      heroLeadForm.reset();

      // Abrir WhatsApp em nova aba
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // ==========================================================================
  // 8. Área Administrativa IBV (Gestão de Leads & Contato Ativo)
  // ==========================================================================
  const adminGearBtn = document.getElementById('adminGearBtn');
  const adminModal = document.getElementById('adminModal');
  const adminModalBackdrop = document.getElementById('adminModalBackdrop');
  const adminCloseBtn = document.getElementById('adminCloseBtn');
  const adminDashCloseBtn = document.getElementById('adminDashCloseBtn');
  const adminLoginForm = document.getElementById('adminLoginForm');
  const adminUser = document.getElementById('adminUser');
  const adminPass = document.getElementById('adminPass');
  const adminLoginError = document.getElementById('adminLoginError');
  const adminLoginView = document.getElementById('adminLoginView');
  const adminDashboardView = document.getElementById('adminDashboardView');
  const adminLeadsTbody = document.getElementById('adminLeadsTbody');
  const adminExportCsvBtn = document.getElementById('adminExportCsvBtn');
  const adminLogoutBtn = document.getElementById('adminLogoutBtn');
  const adminResetDemoBtn = document.getElementById('adminResetDemoBtn');
  const adminClearAllBtn = document.getElementById('adminClearAllBtn');
  const kpiTotalLeads = document.getElementById('kpiTotalLeads');
  const kpiEmContato = document.getElementById('kpiEmContato');
  const kpiConvertidos = document.getElementById('kpiConvertidos');
  const kpiTotalValor = document.getElementById('kpiTotalValor');
  const adminLeadsCountNote = document.getElementById('adminLeadsCountNote');

  // Inclusão Manual de Leads (Modal e Formulário)
  const adminAddLeadBtn = document.getElementById('adminAddLeadBtn');
  const adminAddLeadModal = document.getElementById('adminAddLeadModal');
  const adminAddLeadBackdrop = document.getElementById('adminAddLeadBackdrop');
  const manualLeadCloseBtn = document.getElementById('manualLeadCloseBtn');
  const manualLeadCancelBtn = document.getElementById('manualLeadCancelBtn');
  const adminAddLeadForm = document.getElementById('adminAddLeadForm');
  const manualLeadNome = document.getElementById('manualLeadNome');
  const manualLeadTelefone = document.getElementById('manualLeadTelefone');
  const manualLeadCanal = document.getElementById('manualLeadCanal');
  const manualLeadDataConsulta = document.getElementById('manualLeadDataConsulta');
  const manualLeadStatus = document.getElementById('manualLeadStatus');
  const manualLeadLoja = document.getElementById('manualLeadLoja');
  const manualLeadOs = document.getElementById('manualLeadOs');
  const manualLeadValor = document.getElementById('manualLeadValor');
  const manualLeadVendedor = document.getElementById('manualLeadVendedor');
  const manualLeadNomeError = document.getElementById('manualLeadNomeError');
  const manualLeadTelefoneError = document.getElementById('manualLeadTelefoneError');

  // Alternador de Visão (Tabela vs Board vs Cadastros)
  const tabTableView = document.getElementById('tabTableView');
  const tabBoardView = document.getElementById('tabBoardView');
  const tabCadastrosView = document.getElementById('tabCadastrosView');
  const adminTableViewSection = document.getElementById('adminTableViewSection');
  const adminBoardViewSection = document.getElementById('adminBoardViewSection');
  const adminCadastrosViewSection = document.getElementById('adminCadastrosViewSection');
  const adminBoardContainer = document.getElementById('adminBoardContainer');

  // Gestão de Lojas e Vendedores
  const formAddLoja = document.getElementById('formAddLoja');
  const novaLojaNome = document.getElementById('novaLojaNome');
  const adminLojasList = document.getElementById('adminLojasList');
  const adminLojasCount = document.getElementById('adminLojasCount');

  const formAddVendedor = document.getElementById('formAddVendedor');
  const novoVendedorNome = document.getElementById('novoVendedorNome');
  const adminVendedoresList = document.getElementById('adminVendedoresList');
  const adminVendedoresCount = document.getElementById('adminVendedoresCount');

  const DB_LOJAS_KEY = 'ibv_lojas';
  const DB_VENDEDORES_KEY = 'ibv_vendedores';

  function getLojas() {
    try {
      const stored = localStorage.getItem(DB_LOJAS_KEY);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Erro ao ler lojas:', e);
    }
    const defaultLojas = ['Loja Centro', 'Loja Barão'];
    localStorage.setItem(DB_LOJAS_KEY, JSON.stringify(defaultLojas));
    return defaultLojas;
  }

  function saveLojas(lojas) {
    try {
      localStorage.setItem(DB_LOJAS_KEY, JSON.stringify(lojas));
    } catch (e) {
      console.error('Erro ao salvar lojas:', e);
    }
  }

  function getVendedores() {
    try {
      const stored = localStorage.getItem(DB_VENDEDORES_KEY);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Erro ao ler vendedores:', e);
    }
    const defaultVendedores = ['Camila', 'Lucas'];
    localStorage.setItem(DB_VENDEDORES_KEY, JSON.stringify(defaultVendedores));
    return defaultVendedores;
  }

  function saveVendedores(vendedores) {
    try {
      localStorage.setItem(DB_VENDEDORES_KEY, JSON.stringify(vendedores));
    } catch (e) {
      console.error('Erro ao salvar vendedores:', e);
    }
  }

  // Credenciais Oficiais
  const ADMIN_USER = 'admin';
  const ADMIN_PASS = 'ibv2026';

  function formatDatePtBr(isoDate) {
    if (!isoDate) return '';
    const parts = isoDate.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return isoDate;
  }

  // ==========================================================================
  // Banco de Dados Local (LocalStorage com Persistência Definitiva)
  // ==========================================================================
  const DB_STORAGE_KEY = 'ibv_leads';
  const DB_SEEDED_KEY = 'ibv_leads_seeded_v2';

  function getLeads() {
    try {
      const stored = localStorage.getItem(DB_STORAGE_KEY);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error('Erro ao ler banco de leads:', e);
    }
    return [];
  }

  function saveLeads(leads) {
    try {
      localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(leads));
      // Marca o banco como inicializado definitivamente para nunca re-injetar leads deletados após F5
      localStorage.setItem(DB_SEEDED_KEY, 'true');
    } catch (e) {
      console.error('Erro ao salvar no banco de leads:', e);
    }
  }

  function initDatabaseOnce() {
    try {
      const isSeeded = localStorage.getItem(DB_SEEDED_KEY);
      const storedData = localStorage.getItem(DB_STORAGE_KEY);

      // SÓ popula se for o primeiro acesso absoluto neste navegador
      if (isSeeded === null && storedData === null) {
        const demoLeads = [
          {
            id: 'lead_demo_1',
            dataHora: '28/09/2026 09:15',
            dataConsulta: '2026-09-30',
            timestamp: Date.now() - 3600000,
            nome: 'Carlos Eduardo Souza',
            telefone: '(19) 98112-3456',
            formaContato: 'WhatsApp',
            loja: 'Loja Centro',
            os: '1084',
            valor: '350,00',
            vendedor: 'Camila',
            status: 'Agendado'
          },
          {
            id: 'lead_demo_2',
            dataHora: '28/09/2026 08:40',
            dataConsulta: '2026-10-02',
            timestamp: Date.now() - 7200000,
            nome: 'Mariana Alencar',
            telefone: '(19) 99234-7890',
            formaContato: 'Telefone',
            loja: 'Loja Barão',
            os: '1091',
            valor: '420,00',
            vendedor: 'Lucas',
            status: 'Em Contato'
          }
        ];
        localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(demoLeads));
        localStorage.setItem(DB_SEEDED_KEY, 'true');
      } else if (isSeeded === null && storedData !== null) {
        // Se o usuário já tinha dados gravados anteriormente, garante a flag para evitar re-seeding
        localStorage.setItem(DB_SEEDED_KEY, 'true');
      }
    } catch (e) {
      console.error('Erro na inicialização do banco de leads:', e);
    }
  }

  // Inicializa o banco de dados uma única vez na carga da página
  initDatabaseOnce();

  function updateKpis(leads) {
    if (!kpiTotalLeads) return;
    const total = leads.length;
    let emContatoCount = 0;
    let convertidosCount = 0;
    let totalValor = 0;

    leads.forEach((l) => {
      const st = (l.status || '').toLowerCase();
      if (st === 'em contato' || st === 'agendado') emContatoCount++;
      if (st === 'convertido' || st === 'concluído' || st === 'concluido') convertidosCount++;
      if (l.valor) {
        const cleanVal = parseFloat(String(l.valor).replace('R$', '').replace(/\./g, '').replace(',', '.').trim());
        if (!isNaN(cleanVal)) totalValor += cleanVal;
      }
    });

    kpiTotalLeads.textContent = total;
    kpiEmContato.textContent = emContatoCount;
    kpiConvertidos.textContent = convertidosCount;
    kpiTotalValor.textContent = totalValor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    if (adminLeadsCountNote) {
      adminLeadsCountNote.textContent = total === 1 ? '1 lead cadastrado.' : `${total} leads cadastrados.`;
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderLeadsTable() {
    if (!adminLeadsTbody) return;
    const leads = getLeads();
    const lojas = getLojas();
    const vendedores = getVendedores();
    updateKpis(leads);

    if (leads.length === 0) {
      adminLeadsTbody.innerHTML = `
        <tr>
          <td colspan="11" style="text-align: center; padding: 2.5rem 1rem; color: var(--color-text-muted);">
            Nenhum lead coletado ainda. Aguardando novos agendamentos via formulário.
          </td>
        </tr>
      `;
      return;
    }

    adminLeadsTbody.innerHTML = leads.map((lead) => {
      const channelClass = lead.formaContato === 'Telefone' ? 'channel-telefone' : lead.formaContato === 'E-mail' ? 'channel-email' : 'channel-whatsapp';
      const cleanPhone = (lead.telefone || '').replace(/\D/g, '');
      const waDirectUrl = `http://api.whatsapp.com/send?1=pt_BR&phone=55${cleanPhone}&text=${encodeURIComponent('Olá ' + lead.nome + ', tudo bem? Aqui é do Instituto Boa Visão de Campinas. Recebemos sua solicitação de consulta!')}`;

      // Opções dinâmicas de Lojas
      const lojaOptions = ['<option value="">Selecione...</option>'];
      let matchedLoja = false;
      lojas.forEach((l) => {
        const isSel = (lead.loja || '').toLowerCase() === l.toLowerCase();
        if (isSel) matchedLoja = true;
        lojaOptions.push(`<option value="${escapeHtml(l)}" ${isSel ? 'selected' : ''}>${escapeHtml(l)}</option>`);
      });
      if (lead.loja && !matchedLoja) {
        lojaOptions.push(`<option value="${escapeHtml(lead.loja)}" selected>${escapeHtml(lead.loja)}</option>`);
      }

      // Opções dinâmicas de Vendedores
      const vendedorOptions = ['<option value="">Selecione...</option>'];
      let matchedVendedor = false;
      vendedores.forEach((v) => {
        const isSel = (lead.vendedor || '').toLowerCase() === v.toLowerCase();
        if (isSel) matchedVendedor = true;
        vendedorOptions.push(`<option value="${escapeHtml(v)}" ${isSel ? 'selected' : ''}>${escapeHtml(v)}</option>`);
      });
      if (lead.vendedor && !matchedVendedor) {
        vendedorOptions.push(`<option value="${escapeHtml(lead.vendedor)}" selected>${escapeHtml(lead.vendedor)}</option>`);
      }

      return `
        <tr data-lead-id="${lead.id}">
          <td class="lead-date">${lead.dataHora || '—'}</td>
          <td>
            <input type="date" class="table-input field-data-consulta" value="${lead.dataConsulta || ''}" title="Data agendada da consulta">
          </td>
          <td class="lead-name">${escapeHtml(lead.nome || '—')}</td>
          <td>
            <div class="lead-phone-wrap">
              <a href="tel:${cleanPhone}" class="lead-phone-link" title="Ligar para ${lead.telefone}">${lead.telefone || '—'}</a>
              ${cleanPhone ? `<a href="${waDirectUrl}" target="_blank" rel="noopener noreferrer" class="lead-wa-direct-btn" title="Conversar no WhatsApp"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg></a>` : ''}
            </div>
          </td>
          <td><span class="lead-badge-channel ${channelClass}">${lead.formaContato || 'WhatsApp'}</span></td>
          <td>
            <select class="table-select field-loja" title="Loja responsável">
              ${lojaOptions.join('')}
            </select>
          </td>
          <td><input type="text" class="table-input field-os" value="${escapeHtml(lead.os || '')}" placeholder="OS"></td>
          <td><input type="text" class="table-input field-valor" value="${escapeHtml(lead.valor || '')}" placeholder="R$ 0,00"></td>
          <td>
            <select class="table-select field-vendedor" title="Vendedor / Atendente">
              ${vendedorOptions.join('')}
            </select>
          </td>
          <td>
            <select class="table-select field-status">
              <option value="Pendente" ${lead.status === 'Pendente' ? 'selected' : ''}>Pendente</option>
              <option value="Em Contato" ${lead.status === 'Em Contato' ? 'selected' : ''}>Em Contato</option>
              <option value="Agendado" ${lead.status === 'Agendado' ? 'selected' : ''}>Agendado</option>
              <option value="Convertido" ${lead.status === 'Convertido' ? 'selected' : ''}>Convertido</option>
              <option value="Cancelado" ${lead.status === 'Cancelado' ? 'selected' : ''}>Cancelado</option>
            </select>
          </td>
          <td>
            <div class="table-actions-cell">
              <button type="button" class="btn-table-action btn-table-save" data-action="save" title="Salvar alterações desta linha">Salvar</button>
              <button type="button" class="btn-table-action btn-table-delete" data-action="delete" title="Excluir este lead">✕</button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  // Ouvinte de cliques na tabela de leads (Salvar / Excluir)
  if (adminLeadsTbody) {
    adminLeadsTbody.addEventListener('click', (e) => {
      const saveBtn = e.target.closest('button[data-action="save"]');
      const delBtn = e.target.closest('button[data-action="delete"]');
      const row = e.target.closest('tr');
      if (!row) return;

      const leadId = row.getAttribute('data-lead-id');
      const leads = getLeads();
      const leadIndex = leads.findIndex((l) => l.id === leadId);

      if (saveBtn && leadIndex !== -1) {
        const dataConsultaInput = row.querySelector('.field-data-consulta');
        const lojaInput = row.querySelector('.field-loja');
        const osInput = row.querySelector('.field-os');
        const valorInput = row.querySelector('.field-valor');
        const vendedorInput = row.querySelector('.field-vendedor');
        const statusSelect = row.querySelector('.field-status');

        leads[leadIndex].dataConsulta = dataConsultaInput ? dataConsultaInput.value.trim() : '';
        leads[leadIndex].loja = lojaInput ? lojaInput.value.trim() : '';
        leads[leadIndex].os = osInput ? osInput.value.trim() : '';
        leads[leadIndex].valor = valorInput ? valorInput.value.trim() : '';
        leads[leadIndex].vendedor = vendedorInput ? vendedorInput.value.trim() : '';
        leads[leadIndex].status = statusSelect ? statusSelect.value : 'Pendente';

        saveLeads(leads);
        updateKpis(leads);
        renderKanbanBoard();

        saveBtn.classList.add('is-saved');
        saveBtn.textContent = '✓ Salvo';
        setTimeout(() => {
          saveBtn.classList.remove('is-saved');
          saveBtn.textContent = 'Salvar';
        }, 1800);
      }

      if (delBtn && leadIndex !== -1) {
        if (confirm(`Excluir permanentemente o lead "${leads[leadIndex].nome}"?`)) {
          leads.splice(leadIndex, 1);
          saveLeads(leads);
          renderLeadsTable();
          renderKanbanBoard();
        }
      }
    });
  }

  // ==========================================================================
  // Renderização do Board (Kanban por Status)
  // ==========================================================================
  function renderKanbanBoard() {
    if (!adminBoardContainer) return;
    const leads = getLeads();

    const KANBAN_COLUMNS = [
      { key: 'Pendente', label: 'Pendente', className: 'kanban-col-pendente' },
      { key: 'Em Contato', label: 'Em Contato', className: 'kanban-col-em-contato' },
      { key: 'Agendado', label: 'Agendado', className: 'kanban-col-agendado' },
      { key: 'Convertido', label: 'Convertido', className: 'kanban-col-convertido' },
      { key: 'Cancelado', label: 'Cancelado', className: 'kanban-col-cancelado' }
    ];

    adminBoardContainer.innerHTML = KANBAN_COLUMNS.map((col) => {
      const colLeads = leads.filter((l) => (l.status || 'Pendente') === col.key);

      const cardsHtml = colLeads.length === 0
        ? `<div class="kanban-empty-hint">Nenhum lead nesta etapa</div>`
        : colLeads.map((lead) => {
            const cleanPhone = (lead.telefone || '').replace(/\D/g, '');
            const waDirectUrl = `http://api.whatsapp.com/send?1=pt_BR&phone=55${cleanPhone}&text=${encodeURIComponent('Olá ' + lead.nome + ', tudo bem? Aqui é do Instituto Boa Visão!')}`;
            const channelClass = lead.formaContato === 'Telefone' ? 'channel-telefone' : lead.formaContato === 'E-mail' ? 'channel-email' : 'channel-whatsapp';
            const formattedConsulta = formatDatePtBr(lead.dataConsulta);
            const dateBadgeHtml = formattedConsulta
              ? `<span class="kanban-card-date-badge has-date" title="Data da Consulta Agendada">📅 Consulta: ${formattedConsulta}</span>`
              : `<span class="kanban-card-date-badge" title="Consulta ainda não agendada">📅 Sem data agendada</span>`;

            return `
              <div class="kanban-card" data-lead-id="${lead.id}">
                <div class="kanban-card-top">
                  <h4 class="kanban-card-name">${escapeHtml(lead.nome || 'Sem nome')}</h4>
                  <span class="lead-badge-channel ${channelClass}">${lead.formaContato || 'WhatsApp'}</span>
                </div>

                <div class="kanban-card-phone">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <a href="tel:${cleanPhone}">${lead.telefone || '—'}</a>
                  ${cleanPhone ? `<a href="${waDirectUrl}" target="_blank" rel="noopener noreferrer" class="lead-wa-direct-btn" title="Chamar no WhatsApp"><svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg></a>` : ''}
                </div>

                ${dateBadgeHtml}

                <div class="kanban-card-grid">
                  <div class="kanban-field-item">
                    <span class="kanban-field-label">Loja</span>
                    <span class="kanban-field-val">${escapeHtml(lead.loja || '—')}</span>
                  </div>
                  <div class="kanban-field-item">
                    <span class="kanban-field-label">OS</span>
                    <span class="kanban-field-val">${escapeHtml(lead.os || '—')}</span>
                  </div>
                  <div class="kanban-field-item">
                    <span class="kanban-field-label">Valor</span>
                    <span class="kanban-field-val">${escapeHtml(lead.valor ? 'R$ ' + lead.valor : '—')}</span>
                  </div>
                  <div class="kanban-field-item">
                    <span class="kanban-field-label">Vendedor</span>
                    <span class="kanban-field-val">${escapeHtml(lead.vendedor || '—')}</span>
                  </div>
                </div>

                <div class="kanban-card-bottom">
                  <select class="kanban-status-select" data-lead-id="${lead.id}" title="Mover status do lead">
                    <option value="Pendente" ${lead.status === 'Pendente' ? 'selected' : ''}>Status: Pendente</option>
                    <option value="Em Contato" ${lead.status === 'Em Contato' ? 'selected' : ''}>Status: Em Contato</option>
                    <option value="Agendado" ${lead.status === 'Agendado' ? 'selected' : ''}>Status: Agendado</option>
                    <option value="Convertido" ${lead.status === 'Convertido' ? 'selected' : ''}>Status: Convertido</option>
                    <option value="Cancelado" ${lead.status === 'Cancelado' ? 'selected' : ''}>Status: Cancelado</option>
                  </select>
                  <button type="button" class="btn-card-delete" data-action="delete" data-lead-id="${lead.id}" title="Excluir este lead permanentemente">✕</button>
                </div>
              </div>
            `;
          }).join('');

      return `
        <div class="kanban-column ${col.className}">
          <div class="kanban-col-header">
            <div class="kanban-col-title-wrap">
              <span class="kanban-col-dot"></span>
              <h3 class="kanban-col-title">${col.label}</h3>
            </div>
            <span class="kanban-col-count">${colLeads.length}</span>
          </div>
          <div class="kanban-cards-list">
            ${cardsHtml}
          </div>
        </div>
      `;
    }).join('');
  }

  // Ouvinte de eventos no Board (Mover status e Excluir card)
  if (adminBoardContainer) {
    adminBoardContainer.addEventListener('click', (e) => {
      const delBtn = e.target.closest('button[data-action="delete"]');
      if (!delBtn) return;
      const leadId = delBtn.getAttribute('data-lead-id');
      const leads = getLeads();
      const leadIndex = leads.findIndex((l) => l.id === leadId);
      if (leadIndex !== -1) {
        if (confirm(`Excluir permanentemente o lead "${leads[leadIndex].nome}"?`)) {
          leads.splice(leadIndex, 1);
          saveLeads(leads);
          renderLeadsTable();
          renderKanbanBoard();
        }
      }
    });

    adminBoardContainer.addEventListener('change', (e) => {
      const select = e.target.closest('.kanban-status-select');
      if (!select) return;
      const leadId = select.getAttribute('data-lead-id');
      const newStatus = select.value;
      const leads = getLeads();
      const leadIndex = leads.findIndex((l) => l.id === leadId);
      if (leadIndex !== -1) {
        leads[leadIndex].status = newStatus;
        saveLeads(leads);
        updateKpis(leads);
        renderKanbanBoard();
        renderLeadsTable();
      }
    });
  }

  // ==========================================================================
  // Gestão de Lojas e Vendedores (CRUD)
  // ==========================================================================
  function populateManualLeadDropdowns() {
    if (manualLeadLoja) {
      const currentLoja = manualLeadLoja.value;
      const lojas = getLojas();
      manualLeadLoja.innerHTML = '<option value="">Selecione a loja...</option>' +
        lojas.map(l => `<option value="${escapeHtml(l)}">${escapeHtml(l)}</option>`).join('');
      if (currentLoja && lojas.includes(currentLoja)) {
        manualLeadLoja.value = currentLoja;
      }
    }
    if (manualLeadVendedor) {
      const currentVendedor = manualLeadVendedor.value;
      const vendedores = getVendedores();
      manualLeadVendedor.innerHTML = '<option value="">Selecione o vendedor...</option>' +
        vendedores.map(v => `<option value="${escapeHtml(v)}">${escapeHtml(v)}</option>`).join('');
      if (currentVendedor && vendedores.includes(currentVendedor)) {
        manualLeadVendedor.value = currentVendedor;
      }
    }
  }

  function renderLojasList() {
    if (!adminLojasList) return;
    const lojas = getLojas();
    if (adminLojasCount) {
      adminLojasCount.textContent = lojas.length === 1 ? '1 loja cadastrada' : `${lojas.length} lojas cadastradas`;
    }
    if (lojas.length === 0) {
      adminLojasList.innerHTML = '<li class="admin-cadastro-empty">Nenhuma loja cadastrada.</li>';
      return;
    }
    adminLojasList.innerHTML = lojas.map((loja, idx) => `
      <li class="admin-cadastro-item" data-index="${idx}">
        <div class="admin-cadastro-name-wrap">
          <span class="admin-cadastro-dot"></span>
          <span class="admin-cadastro-name">${escapeHtml(loja)}</span>
        </div>
        <div class="admin-cadastro-item-actions">
          <button type="button" class="btn-item-edit" data-action="edit-loja" data-index="${idx}" title="Alterar nome da loja">Editar</button>
          <button type="button" class="btn-item-delete" data-action="delete-loja" data-index="${idx}" title="Excluir loja">✕</button>
        </div>
      </li>
    `).join('');
  }

  function renderVendedoresList() {
    if (!adminVendedoresList) return;
    const vendedores = getVendedores();
    if (adminVendedoresCount) {
      adminVendedoresCount.textContent = vendedores.length === 1 ? '1 vendedor cadastrado' : `${vendedores.length} vendedores cadastrados`;
    }
    if (vendedores.length === 0) {
      adminVendedoresList.innerHTML = '<li class="admin-cadastro-empty">Nenhum vendedor cadastrado.</li>';
      return;
    }
    adminVendedoresList.innerHTML = vendedores.map((vendedor, idx) => `
      <li class="admin-cadastro-item" data-index="${idx}">
        <div class="admin-cadastro-name-wrap">
          <span class="admin-cadastro-dot"></span>
          <span class="admin-cadastro-name">${escapeHtml(vendedor)}</span>
        </div>
        <div class="admin-cadastro-item-actions">
          <button type="button" class="btn-item-edit" data-action="edit-vendedor" data-index="${idx}" title="Alterar nome do vendedor">Editar</button>
          <button type="button" class="btn-item-delete" data-action="delete-vendedor" data-index="${idx}" title="Excluir vendedor">✕</button>
        </div>
      </li>
    `).join('');
  }

  // Ouvintes de Cadastro de Loja
  if (formAddLoja) {
    formAddLoja.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = (novaLojaNome ? novaLojaNome.value : '').trim();
      if (!nome) return;
      const lojas = getLojas();
      if (lojas.some(l => l.toLowerCase() === nome.toLowerCase())) {
        alert(`A loja "${nome}" já está cadastrada.`);
        return;
      }
      lojas.push(nome);
      saveLojas(lojas);
      if (novaLojaNome) novaLojaNome.value = '';
      renderLojasList();
      populateManualLeadDropdowns();
      renderLeadsTable();
    });
  }

  if (adminLojasList) {
    adminLojasList.addEventListener('click', (e) => {
      const editBtn = e.target.closest('button[data-action="edit-loja"]');
      const delBtn = e.target.closest('button[data-action="delete-loja"]');
      const lojas = getLojas();

      if (editBtn) {
        const idx = parseInt(editBtn.getAttribute('data-index'), 10);
        if (isNaN(idx) || idx < 0 || idx >= lojas.length) return;
        const antigoNome = lojas[idx];
        const novoNome = prompt('Editar nome da loja / unidade:', antigoNome);
        if (novoNome !== null) {
          const clean = novoNome.trim();
          if (clean && clean !== antigoNome) {
            lojas[idx] = clean;
            saveLojas(lojas);

            // Atualiza leads associados
            const leads = getLeads();
            let updated = false;
            leads.forEach(l => {
              if (l.loja === antigoNome) {
                l.loja = clean;
                updated = true;
              }
            });
            if (updated) saveLeads(leads);

            renderLojasList();
            populateManualLeadDropdowns();
            renderLeadsTable();
            renderKanbanBoard();
          }
        }
      }

      if (delBtn) {
        const idx = parseInt(delBtn.getAttribute('data-index'), 10);
        if (isNaN(idx) || idx < 0 || idx >= lojas.length) return;
        const nomeLoja = lojas[idx];
        if (confirm(`Tem certeza que deseja excluir a loja "${nomeLoja}"?`)) {
          lojas.splice(idx, 1);
          saveLojas(lojas);
          renderLojasList();
          populateManualLeadDropdowns();
          renderLeadsTable();
        }
      }
    });
  }

  // Ouvintes de Cadastro de Vendedor
  if (formAddVendedor) {
    formAddVendedor.addEventListener('submit', (e) => {
      e.preventDefault();
      const nome = (novoVendedorNome ? novoVendedorNome.value : '').trim();
      if (!nome) return;
      const vendedores = getVendedores();
      if (vendedores.some(v => v.toLowerCase() === nome.toLowerCase())) {
        alert(`O vendedor "${nome}" já está cadastrado.`);
        return;
      }
      vendedores.push(nome);
      saveVendedores(vendedores);
      if (novoVendedorNome) novoVendedorNome.value = '';
      renderVendedoresList();
      populateManualLeadDropdowns();
      renderLeadsTable();
    });
  }

  if (adminVendedoresList) {
    adminVendedoresList.addEventListener('click', (e) => {
      const editBtn = e.target.closest('button[data-action="edit-vendedor"]');
      const delBtn = e.target.closest('button[data-action="delete-vendedor"]');
      const vendedores = getVendedores();

      if (editBtn) {
        const idx = parseInt(editBtn.getAttribute('data-index'), 10);
        if (isNaN(idx) || idx < 0 || idx >= vendedores.length) return;
        const antigoNome = vendedores[idx];
        const novoNome = prompt('Editar nome do vendedor / atendente:', antigoNome);
        if (novoNome !== null) {
          const clean = novoNome.trim();
          if (clean && clean !== antigoNome) {
            vendedores[idx] = clean;
            saveVendedores(vendedores);

            // Atualiza leads associados
            const leads = getLeads();
            let updated = false;
            leads.forEach(l => {
              if (l.vendedor === antigoNome) {
                l.vendedor = clean;
                updated = true;
              }
            });
            if (updated) saveLeads(leads);

            renderVendedoresList();
            populateManualLeadDropdowns();
            renderLeadsTable();
            renderKanbanBoard();
          }
        }
      }

      if (delBtn) {
        const idx = parseInt(delBtn.getAttribute('data-index'), 10);
        if (isNaN(idx) || idx < 0 || idx >= vendedores.length) return;
        const nomeVendedor = vendedores[idx];
        if (confirm(`Tem certeza que deseja excluir o vendedor "${nomeVendedor}"?`)) {
          vendedores.splice(idx, 1);
          saveVendedores(vendedores);
          renderVendedoresList();
          populateManualLeadDropdowns();
          renderLeadsTable();
        }
      }
    });
  }

  // Ouvintes de Alternador de Visão (Tabela vs Board vs Cadastros)
  function switchAdminTab(viewName) {
    if (tabTableView) {
      tabTableView.classList.toggle('is-active', viewName === 'tabela');
      tabTableView.setAttribute('aria-selected', viewName === 'tabela' ? 'true' : 'false');
    }
    if (tabBoardView) {
      tabBoardView.classList.toggle('is-active', viewName === 'board');
      tabBoardView.setAttribute('aria-selected', viewName === 'board' ? 'true' : 'false');
    }
    if (tabCadastrosView) {
      tabCadastrosView.classList.toggle('is-active', viewName === 'cadastros');
      tabCadastrosView.setAttribute('aria-selected', viewName === 'cadastros' ? 'true' : 'false');
    }

    if (adminTableViewSection) adminTableViewSection.style.display = viewName === 'tabela' ? 'flex' : 'none';
    if (adminBoardViewSection) adminBoardViewSection.style.display = viewName === 'board' ? 'flex' : 'none';
    if (adminCadastrosViewSection) adminCadastrosViewSection.style.display = viewName === 'cadastros' ? 'block' : 'none';

    if (viewName === 'tabela') renderLeadsTable();
    if (viewName === 'board') renderKanbanBoard();
    if (viewName === 'cadastros') {
      renderLojasList();
      renderVendedoresList();
    }
  }

  if (tabTableView) {
    tabTableView.addEventListener('click', () => switchAdminTab('tabela'));
  }
  if (tabBoardView) {
    tabBoardView.addEventListener('click', () => switchAdminTab('board'));
  }
  if (tabCadastrosView) {
    tabCadastrosView.addEventListener('click', () => switchAdminTab('cadastros'));
  }

  // Abrir / Fechar Modal
  function openAdminModal() {
    if (!adminModal) return;
    initDatabaseOnce();
    const isLogged = sessionStorage.getItem('ibv_admin_logged') === 'true';

    if (isLogged) {
      if (adminLoginView) adminLoginView.style.display = 'none';
      if (adminDashboardView) adminDashboardView.style.display = 'flex';
      renderLeadsTable();
      renderKanbanBoard();
    } else {
      if (adminLoginView) adminLoginView.style.display = 'flex';
      if (adminDashboardView) adminDashboardView.style.display = 'none';
      if (adminLoginError) adminLoginError.style.display = 'none';
      if (adminUser) adminUser.focus();
    }

    adminModal.classList.add('is-open');
    adminModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
  }

  function closeAdminModal() {
    if (!adminModal) return;
    adminModal.classList.remove('is-open');
    adminModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
  }

  if (adminGearBtn) {
    adminGearBtn.addEventListener('click', openAdminModal);
  }

  if (adminCloseBtn) {
    adminCloseBtn.addEventListener('click', closeAdminModal);
  }

  if (adminDashCloseBtn) {
    adminDashCloseBtn.addEventListener('click', closeAdminModal);
  }

  if (adminModalBackdrop) {
    adminModalBackdrop.addEventListener('click', closeAdminModal);
  }

  // Login Submit
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = adminUser ? adminUser.value.trim() : '';
      const pass = adminPass ? adminPass.value : '';

      if (user === ADMIN_USER && pass === ADMIN_PASS) {
        sessionStorage.setItem('ibv_admin_logged', 'true');
        if (adminLoginError) adminLoginError.style.display = 'none';
        adminLoginForm.reset();
        if (adminLoginView) adminLoginView.style.display = 'none';
        if (adminDashboardView) adminDashboardView.style.display = 'flex';
        renderLeadsTable();
        renderKanbanBoard();
      } else {
        if (adminLoginError) {
          adminLoginError.textContent = 'Usuário ou senha incorretos.';
          adminLoginError.style.display = 'block';
        }
      }
    });
  }

  // Logout
  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('ibv_admin_logged');
      if (adminDashboardView) adminDashboardView.style.display = 'none';
      if (adminLoginView) adminLoginView.style.display = 'flex';
      if (adminLoginError) adminLoginError.style.display = 'none';
    });
  }

  // Exportar CSV (Excel)
  if (adminExportCsvBtn) {
    adminExportCsvBtn.addEventListener('click', () => {
      const leads = getLeads();
      if (leads.length === 0) {
        alert('Nenhum lead disponível para exportar.');
        return;
      }

      const headers = ['ID', 'Data Cadastro', 'Data Consulta', 'Nome Completo', 'Telefone', 'Forma de Contato', 'Loja', 'OS', 'Valor (R$)', 'Vendedor', 'Status'];
      const rows = leads.map((l) => [
        `"${l.id || ''}"`,
        `"${l.dataHora || ''}"`,
        `"${l.dataConsulta || ''}"`,
        `"${(l.nome || '').replace(/"/g, '""')}"`,
        `"${(l.telefone || '').replace(/"/g, '""')}"`,
        `"${(l.formaContato || '').replace(/"/g, '""')}"`,
        `"${(l.loja || '').replace(/"/g, '""')}"`,
        `"${(l.os || '').replace(/"/g, '""')}"`,
        `"${(l.valor || '').replace(/"/g, '""')}"`,
        `"${(l.vendedor || '').replace(/"/g, '""')}"`,
        `"${(l.status || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\r\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `leads_ibv_campinas_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }

  // Reset / Adicionar Demo
  if (adminResetDemoBtn) {
    adminResetDemoBtn.addEventListener('click', () => {
      const leads = getLeads();
      const novoExemplo = {
        id: 'lead_manual_' + Date.now(),
        dataHora: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
        dataConsulta: '2026-10-05',
        timestamp: Date.now(),
        nome: 'Paciente Exemplo ' + (leads.length + 1),
        telefone: '(19) 98765-4321',
        formaContato: 'WhatsApp',
        loja: 'Loja Centro',
        os: String(1100 + leads.length),
        valor: '280,00',
        vendedor: 'Atendente',
        status: 'Pendente'
      };
      leads.unshift(novoExemplo);
      saveLeads(leads);
      renderLeadsTable();
      renderKanbanBoard();
    });
  }

  // Limpar Todos os Leads
  if (adminClearAllBtn) {
    adminClearAllBtn.addEventListener('click', () => {
      const leads = getLeads();
      if (leads.length === 0) {
        alert('A base de leads já está vazia.');
        return;
      }
      if (confirm(`Tem certeza que deseja excluir TODOS os ${leads.length} leads cadastrados? Esta ação não pode ser desfeita.`)) {
        saveLeads([]);
        renderLeadsTable();
        renderKanbanBoard();
      }
    });
  }

  // ==========================================================================
  // Controle de Inclusão Manual de Leads (Modal & Form)
  // ==========================================================================
  function openAddLeadModal() {
    if (!adminAddLeadModal) return;
    if (adminAddLeadForm) adminAddLeadForm.reset();
    if (manualLeadNomeError) manualLeadNomeError.textContent = '';
    if (manualLeadTelefoneError) manualLeadTelefoneError.textContent = '';
    if (manualLeadNome) manualLeadNome.classList.remove('is-invalid');
    if (manualLeadTelefone) manualLeadTelefone.classList.remove('is-invalid');

    // Preenche valores padrão alinhados com o usuário
    if (manualLeadStatus) manualLeadStatus.value = 'Agendado';
    if (manualLeadCanal) manualLeadCanal.value = 'WhatsApp';

    // Popula dropdowns com lojas e vendedores cadastrados
    populateManualLeadDropdowns();

    adminAddLeadModal.classList.add('is-open');
    adminAddLeadModal.setAttribute('aria-hidden', 'false');
    setTimeout(() => {
      if (manualLeadNome) manualLeadNome.focus();
    }, 80);
  }

  function closeAddLeadModal() {
    if (!adminAddLeadModal) return;
    adminAddLeadModal.classList.remove('is-open');
    adminAddLeadModal.setAttribute('aria-hidden', 'true');
  }

  if (adminAddLeadBtn) {
    adminAddLeadBtn.addEventListener('click', openAddLeadModal);
  }
  if (manualLeadCloseBtn) {
    manualLeadCloseBtn.addEventListener('click', closeAddLeadModal);
  }
  if (manualLeadCancelBtn) {
    manualLeadCancelBtn.addEventListener('click', closeAddLeadModal);
  }
  if (adminAddLeadBackdrop) {
    adminAddLeadBackdrop.addEventListener('click', closeAddLeadModal);
  }

  // Máscara de Telefone do Lead Manual
  if (manualLeadTelefone) {
    manualLeadTelefone.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.length > 11) val = val.slice(0, 11);
      if (val.length > 10) {
        e.target.value = `(${val.slice(0, 2)}) ${val.slice(2, 7)}-${val.slice(7)}`;
      } else if (val.length > 6) {
        e.target.value = `(${val.slice(0, 2)}) ${val.slice(2, 6)}-${val.slice(6)}`;
      } else if (val.length > 2) {
        e.target.value = `(${val.slice(0, 2)}) ${val.slice(2)}`;
      } else if (val.length > 0) {
        e.target.value = `(${val}`;
      } else {
        e.target.value = '';
      }
      if (manualLeadTelefoneError) manualLeadTelefoneError.textContent = '';
      manualLeadTelefone.classList.remove('is-invalid');
    });
  }

  // Envio do Formulário de Lead Manual
  if (adminAddLeadForm) {
    adminAddLeadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const nomeVal = (manualLeadNome ? manualLeadNome.value : '').trim();
      const telVal = (manualLeadTelefone ? manualLeadTelefone.value : '').trim();
      const digits = telVal.replace(/\D/g, '');

      if (!nomeVal || nomeVal.length < 2) {
        if (manualLeadNomeError) manualLeadNomeError.textContent = 'Informe o nome completo do paciente.';
        if (manualLeadNome) manualLeadNome.classList.add('is-invalid');
        isValid = false;
      }

      if (!digits || digits.length < 10) {
        if (manualLeadTelefoneError) manualLeadTelefoneError.textContent = 'Informe um telefone com DDD válido.';
        if (manualLeadTelefone) manualLeadTelefone.classList.add('is-invalid');
        isValid = false;
      }

      if (!isValid) return;

      const newLead = {
        id: 'lead_manual_' + Date.now(),
        dataHora: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
        dataConsulta: manualLeadDataConsulta ? manualLeadDataConsulta.value.trim() : '',
        timestamp: Date.now(),
        nome: nomeVal,
        telefone: telVal,
        formaContato: manualLeadCanal ? manualLeadCanal.value : 'WhatsApp',
        loja: manualLeadLoja ? manualLeadLoja.value.trim() : '',
        os: manualLeadOs ? manualLeadOs.value.trim() : '',
        valor: manualLeadValor ? manualLeadValor.value.trim() : '',
        vendedor: manualLeadVendedor ? manualLeadVendedor.value.trim() : '',
        status: manualLeadStatus ? manualLeadStatus.value : 'Agendado'
      };

      const leads = getLeads();
      leads.unshift(newLead);
      saveLeads(leads);
      renderLeadsTable();
      renderKanbanBoard();
      updateKpis(leads);

      closeAddLeadModal();

      // Feedback temporário no botão + Novo Lead
      if (adminAddLeadBtn) {
        const originalHtml = adminAddLeadBtn.innerHTML;
        adminAddLeadBtn.innerHTML = '<span>✓ Lead Cadastrado!</span>';
        adminAddLeadBtn.style.backgroundColor = '#15803D';
        setTimeout(() => {
          adminAddLeadBtn.innerHTML = originalHtml;
          adminAddLeadBtn.style.backgroundColor = '';
        }, 1800);
      }
    });
  }

  // Fechar modais no ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (adminAddLeadModal && adminAddLeadModal.classList.contains('is-open')) {
        closeAddLeadModal();
        return;
      }
      if (adminModal && adminModal.classList.contains('is-open')) {
        closeAdminModal();
      }
    }
  });
});
