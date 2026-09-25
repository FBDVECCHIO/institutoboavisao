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
});
