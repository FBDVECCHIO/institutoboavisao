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
});
