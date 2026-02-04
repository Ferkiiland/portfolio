document.addEventListener('DOMContentLoaded', function() {
  // Mapeo de botones a secciones
  const navConfig = {
    'Home': '.Aboutme',
    'Reviews': '.ReviewsSection',
    'Works': '.PortfolioSection',
    'Waitlist': '.WaitlistSection',
    'Prices': '.PricingSection'
  };

  const navButtons = {
    'Home': document.querySelector('.Home'),
    'Reviews': document.querySelector('.Reviews'),
    'Works': document.querySelector('.Works'),
    'Waitlist': document.querySelector('.Waitlist'),
    'Prices': document.querySelector('.Prices')
  };

  const mainSection = document.querySelector('.About');
  const logoText = document.querySelector('.logo'); // Seleccionar el logo con texto
  let currentSection = null;
  let currentActiveButton = null;
  let isAnimating = false;

  // Inicializar todas las secciones
  function initializeSections() {
    Object.values(navConfig).forEach(selector => {
      const section = document.querySelector(selector);
      if (section) {
        section.style.display = 'none';
        section.style.opacity = '0';
        section.style.transform = 'translate(-50%, 100vh)';
        section.style.transition = 'none';
        section.style.position = 'fixed';
        section.style.top = '50%';
        section.style.left = '50%';
        section.style.zIndex = '10';
      }
    });

    // Remover color activo de todos los botones al inicio
    Object.values(navButtons).forEach(button => {
      if (button) {
        button.style.color = ''; // Resetear al color por defecto
        button.classList.remove('active');
      }
    });

    mainSection.style.display = 'flex';
    mainSection.style.opacity = '1';
    isAnimating = false;
    currentSection = null;
    currentActiveButton = null;
  }

  // Función para actualizar el botón activo
  function updateActiveButton(buttonElement, sectionElement) {
    // Remover color activo del botón anterior
    if (currentActiveButton) {
      currentActiveButton.style.color = '';
      currentActiveButton.classList.remove('active');
    }

    // Si estamos cerrando la sección actual (no hay nueva sección)
    if (!sectionElement) {
      currentActiveButton = null;
      return;
    }

    // Aplicar color activo al nuevo botón
    if (buttonElement) {
      buttonElement.style.color = '#5865f2';
      buttonElement.classList.add('active');
      currentActiveButton = buttonElement;
    }
  }

  // Mostrar una sección específica
  function showSection(sectionElement, buttonElement) {
    if (isAnimating) return;
    
    isAnimating = true;
    const wasSectionOpen = currentSection !== null;

    // Si hay una sección abierta, cerrarla primero
    if (wasSectionOpen) {
      hideCurrentSection(() => {
        if (currentSection === sectionElement) {
          // Si se hizo clic en la misma sección, solo cerrarla
          updateActiveButton(null, null); // Remover color activo
          currentSection = null;
          isAnimating = false;
          showMainContent();
        } else {
          // Mostrar la nueva sección
          updateActiveButton(buttonElement, sectionElement);
          openNewSection(sectionElement);
        }
      });
    } else {
      // No hay sección abierta, mostrar la nueva
      updateActiveButton(buttonElement, sectionElement);
      openNewSection(sectionElement);
    }
  }

  function openNewSection(sectionElement) {
    hideMainContent(() => {
      sectionElement.style.display = 'flex';
      sectionElement.style.alignItems = 'center';
      sectionElement.style.justifyContent = 'center';
      
      // Forzar reflow
      void sectionElement.offsetWidth;
      
      sectionElement.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
      sectionElement.style.opacity = '1';
      sectionElement.style.transform = 'translate(-50%, -50%)';
      
      setTimeout(() => {
        currentSection = sectionElement;
        isAnimating = false;
      }, 800);
    });
  }

  function hideCurrentSection(callback) {
    if (!currentSection) {
      callback();
      return;
    }

    currentSection.style.opacity = '0';
    currentSection.style.transform = 'translate(-50%, 100vh)';
    
    setTimeout(() => {
      currentSection.style.display = 'none';
      callback();
    }, 800);
  }

  function hideMainContent(callback) {
    document.querySelector('.title-container')?.classList.remove('visible');
    document.querySelector('.active-orders-badge')?.classList.remove('visible');
    document.querySelector('.T2026')?.classList.remove('visible');
    
    mainSection.style.transition = 'opacity 0.5s ease';
    mainSection.style.opacity = '0';
    
    setTimeout(() => {
      mainSection.style.display = 'none';
      callback();
    }, 500);
  }

  function showMainContent() {
    mainSection.style.display = 'flex';
    
    void mainSection.offsetWidth;
    
    mainSection.style.opacity = '0';
    mainSection.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    
    setTimeout(() => {
      mainSection.style.opacity = '1';
      
      setTimeout(() => {
        document.querySelector('.title-container')?.classList.add('visible');
        document.querySelector('.active-orders-badge')?.classList.add('visible');
        document.querySelector('.T2026')?.classList.add('visible');
      }, 300);
      
    }, 10);
  }

  // Función para regresar a la sección principal
  function returnToMain() {
    if (isAnimating) return;
    
    // Si hay una sección abierta, cerrarla
    if (currentSection) {
      hideCurrentSection(() => {
        // Remover color activo del botón
        if (currentActiveButton) {
          currentActiveButton.style.color = '';
          currentActiveButton.classList.remove('active');
        }
        
        currentSection = null;
        currentActiveButton = null;
        isAnimating = false;
        showMainContent();
      });
    } else if (!mainSection.style.display || mainSection.style.display === 'none') {
      // Si por alguna razón el contenido principal no está visible, mostrarlo
      showMainContent();
    }
  }

  // Configurar event listeners para todos los botones
  Object.keys(navButtons).forEach(key => {
    const button = navButtons[key];
    const sectionSelector = navConfig[key];
    
    if (button && sectionSelector) {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const section = document.querySelector(sectionSelector);
        if (section) {
          showSection(section, button);
        }
      });
    }
  });

  // Configurar event listener para el logo/texto FERKII
  if (logoText) {
    logoText.style.cursor = 'pointer'; // Cambiar cursor para indicar que es clickeable
    
    logoText.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      returnToMain();
    });
  }

  // Cerrar sección al hacer clic fuera del contenido
  Object.values(navConfig).forEach(selector => {
    const section = document.querySelector(selector);
    if (section) {
      section.addEventListener('click', function(e) {
        if (e.target === section && !isAnimating) {
          hideCurrentSection(() => {
            // Remover color activo al cerrar haciendo clic fuera
            if (currentActiveButton) {
              currentActiveButton.style.color = '';
              currentActiveButton.classList.remove('active');
            }
            
            currentSection = null;
            currentActiveButton = null;
            isAnimating = false;
            showMainContent();
          });
        }
      });
    }
  });

  // Inicializar
  initializeSections();

  // Hacer funciones disponibles globalmente si es necesario
  window.closeCurrentSection = function() {
    if (!isAnimating && currentSection) {
      hideCurrentSection(() => {
        // Remover color activo
        if (currentActiveButton) {
          currentActiveButton.style.color = '';
          currentActiveButton.classList.remove('active');
        }
        
        currentSection = null;
        currentActiveButton = null;
        isAnimating = false;
        showMainContent();
      });
    }
  };

  window.showSectionByName = function(sectionName) {
    const section = document.querySelector(navConfig[sectionName]);
    const button = navButtons[sectionName];
    
    if (section && button && !isAnimating) {
      showSection(section, button);
    }
  };

  window.returnToMain = returnToMain; // Hacer disponible globalmente
});