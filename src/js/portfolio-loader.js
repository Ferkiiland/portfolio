// portfolio-loader.js - VERSIÓN MEJORADA
document.addEventListener('DOMContentLoaded', function() {
    const portfolioSection = document.querySelector('.PortfolioSection');
    if (!portfolioSection) return;
    
    let PROJECTS = [];
    const projectsPromise = fetch('./src/data/projects.json')
      .then(response => {
        if (!response.ok) throw new Error(`Could not load projects: ${response.status}`);
        return response.json();
      })
      .then(projects => {
        if (!Array.isArray(projects)) throw new Error('Portfolio data must be a list.');
        PROJECTS = projects;
        return projects;
      });

    const IMAGES_FOLDER = './src/images/PortfolioPreview/';
    const MAX_COLUMNS = 2;
    
    // Inicializar cuando la sección se abra
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          if (portfolioSection.style.display === 'flex' && portfolioSection.style.opacity === '1') {
            // La sección se abrió, cargar imágenes
            setTimeout(loadPortfolioProjects, 500);
          }
        }
      });
    });
    
    observer.observe(portfolioSection, { attributes: true, attributeFilter: ['style'] });
    
    async function loadPortfolioProjects() {
      const sectionContent = portfolioSection.querySelector('.section-content');
      if (!sectionContent) return;

      try {
        await projectsPromise;
      } catch (error) {
        console.error('Error loading portfolio projects:', error);
        sectionContent.replaceChildren(document.createTextNode('Portfolio projects are temporarily unavailable.'));
        return;
      }

      sectionContent.innerHTML = '';

      const filterBar = document.createElement('div');
      filterBar.className = 'portfolio-filters';
      filterBar.setAttribute('role', 'group');
      filterBar.setAttribute('aria-label', 'Filter portfolio by category');

      const portfolioGrid = document.createElement('div');
      portfolioGrid.className = 'portfolio-grid';
      portfolioGrid.setAttribute('aria-live', 'polite');
      portfolioGrid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(${MAX_COLUMNS}, 1fr);
        gap: 10px;
        padding: 10px;
        width: 100%;
      `;

      sectionContent.append(filterBar, portfolioGrid);
      addPortfolioStyles();

      const categories = [...new Set(PROJECTS.map(project => project.category).filter(Boolean))];
      const filterOptions = [{ label: 'All', value: 'all' }, ...categories.map(category => ({
        label: category,
        value: category.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-')
      }))];

      const filterButtons = filterOptions.map(option => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'portfolio-filter';
        button.textContent = option.label;
        button.dataset.filter = option.value;
        button.setAttribute('aria-pressed', 'false');
        button.addEventListener('click', () => setPortfolioFilter(option.value));
        filterBar.appendChild(button);
        return button;
      });

      PROJECTS.forEach((project, index) => {
        portfolioGrid.appendChild(createProjectItem(project, index));
      });

      portfolioGrid.addEventListener('animationend', (event) => {
        if (event.animationName === 'portfolioCardFadeIn') {
          event.target.classList.remove('portfolio-card-enter');
          event.target.style.removeProperty('--portfolio-enter-delay');
        }
      });

      let activeFilter = 'all';
      let filterTimer = null;
      let transitionId = 0;

      function setPortfolioFilter(nextFilter, initial = false) {
        if (!initial && nextFilter === activeFilter) return;
        activeFilter = nextFilter;
        transitionId += 1;
        const currentTransition = transitionId;
        if (filterTimer) window.clearTimeout(filterTimer);

        filterButtons.forEach(button => {
          const selected = button.dataset.filter === nextFilter;
          button.classList.toggle('is-selected', selected);
          button.setAttribute('aria-pressed', String(selected));
        });

        const items = [...portfolioGrid.children];
        items.forEach(item => item.classList.remove('portfolio-card-enter', 'portfolio-card-exit'));

        if (initial) {
          let visibleIndex = 0;
          items.forEach(item => {
            const matches = nextFilter === 'all' || item.dataset.category === nextFilter;
            item.style.display = matches ? '' : 'none';
            if (matches) {
              item.style.setProperty('--portfolio-enter-delay', `${Math.min(visibleIndex, 8) * 35}ms`);
              item.classList.add('portfolio-card-enter');
              visibleIndex += 1;
            }
          });
          return;
        }

        items.forEach(item => {
          if (item.style.display !== 'none') item.classList.add('portfolio-card-exit');
        });

        filterTimer = window.setTimeout(() => {
          if (currentTransition !== transitionId) return;
          let visibleIndex = 0;
          items.forEach(item => {
            const matches = nextFilter === 'all' || item.dataset.category === nextFilter;
            item.style.display = matches ? '' : 'none';
            if (matches) {
              item.classList.remove('portfolio-card-exit', 'portfolio-card-enter');
              void item.offsetWidth;
              item.style.setProperty('--portfolio-enter-delay', `${Math.min(visibleIndex, 8) * 35}ms`);
              item.classList.add('portfolio-card-enter');
              visibleIndex += 1;
            }
          });
        }, 190);
      }

      setPortfolioFilter('all', true);
    }

    function createProjectItem(project, index) {
      const projectItem = document.createElement('div');
      projectItem.className = 'project-item';
      projectItem.setAttribute('data-category', project.category.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-'));
      projectItem.style.cssText = `
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        background: rgba(30, 30, 40, 0.6);
        border-radius: 12px;
        overflow: hidden;
        aspect-ratio: 16/9;
        position: relative;
        cursor: pointer;
      `;
      
      // Crear imagen
      const img = document.createElement('img');
      img.src = IMAGES_FOLDER + project.image;
      img.alt = project.title;
      img.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      `;
      
      // Crear overlay con información
      const overlay = document.createElement('div');
      overlay.className = 'project-overlay';
      overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.3) 100%);
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding: 20px;
        opacity: 0;
        transition: opacity 0.3s ease;
      `;
      
      // Contenedor principal de información
      const infoContainer = document.createElement('div');
      infoContainer.style.cssText = `
        transform: translateY(20px);
        transition: transform 0.3s ease;
      `;
      
      // Título del proyecto
      const title = document.createElement('h3');
      title.textContent = project.title;
      title.style.cssText = `
        color: white;
        font-family: 'Fredoka', sans-serif;
        font-size: 1.4rem;
        margin-bottom: 8px;
        font-weight: 600;
      `;
      
      // Categoría
      const category = document.createElement('div');
      category.textContent = project.category;
      category.style.cssText = `
        color: #5865f2;
        font-family: 'Fredoka', sans-serif;
        font-size: 0.9rem;
        font-weight: 500;
        margin-bottom: 10px;
        background: rgba(88, 101, 242, 0.1);
        padding: 4px 12px;
        border-radius: 20px;
        display: inline-block;
      `;
      
      // Descripción (opcional)
      const description = document.createElement('p');
      description.textContent = project.description;
      description.style.cssText = `
        color: rgba(255, 255, 255, 0.8);
        font-family: 'Fredoka', sans-serif;
        font-size: 0.9rem;
        margin: 8px 0;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      `;
      
      // Tecnologías (opcional)
      let technologiesHtml = '';
      if (project.technologies && project.technologies.length > 0) {
        const techContainer = document.createElement('div');
        techContainer.style.cssText = `
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 8px;
        `;
        
        project.technologies.forEach(tech => {
          const techTag = document.createElement('span');
          techTag.textContent = tech;
          techTag.style.cssText = `
            color: rgba(255, 255, 255, 0.7);
            font-family: 'Fredoka', sans-serif;
            font-size: 0.75rem;
            background: rgba(255, 255, 255, 0.1);
            padding: 2px 8px;
            border-radius: 12px;
          `;
          techContainer.appendChild(techTag);
        });
        
        infoContainer.appendChild(techContainer);
      }
      
      // Año (opcional)
      if (project.year) {
        const year = document.createElement('div');
        year.textContent = project.year;
        year.style.cssText = `
          color: rgba(255, 255, 255, 0.6);
          font-family: 'Fredoka', sans-serif;
          font-size: 0.8rem;
          margin-top: 8px;
          font-style: italic;
        `;
        infoContainer.appendChild(year);
      }
      
      // Agregar elementos al contenedor de información
      infoContainer.appendChild(title);
      infoContainer.appendChild(category);
      if (project.description) {
        infoContainer.appendChild(description);
      }
      
      overlay.appendChild(infoContainer);
      
      // Efectos hover
      projectItem.addEventListener('mouseenter', function() {
        img.style.transform = 'scale(1.05)';
        overlay.style.opacity = '1';
        infoContainer.style.transform = 'translateY(0)';
      });
      
      projectItem.addEventListener('mouseleave', function() {
        img.style.transform = 'scale(1)';
        overlay.style.opacity = '0';
        infoContainer.style.transform = 'translateY(20px)';
      });
      
      // Click para abrir vista detallada (opcional)
      projectItem.addEventListener('click', function() {
        openProjectDetail(project);
      });
      
      projectItem.appendChild(img);
      projectItem.appendChild(overlay);
      
      return projectItem;
    }
    
    // Función para abrir vista detallada (puedes expandir esta función)
    function openProjectDetail(project) {
      console.log('Proyecto clickeado:', project);
      // Aquí puedes implementar un modal o vista detallada
      // alert(`Proyecto: ${project.title}\nCategoría: ${project.category}\nDescripción: ${project.description}`);
    }
    
    function addPortfolioStyles() {
      // Solo agregar estilos si no existen
      if (document.querySelector('#portfolio-styles')) return;
      
      const styleElement = document.createElement('style');
      styleElement.id = 'portfolio-styles';
      styleElement.textContent = `
        .portfolio-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 0px;
          padding: 10px;
          width: 100%;
        }
        
        .project-item {
          background: rgba(30, 30, 40, 0.6);
          border-radius: 5px;
          overflow: hidden;
          aspect-ratio: 16/9;
          position: relative;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .project-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }
        
        .project-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        
        .project-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.3) 100%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 20px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .project-item:hover .project-overlay {
          opacity: 1;
        }
        
        /* Responsive */
        @media (max-width: 1200px) {
          .portfolio-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 768px) {
          .portfolio-grid {
            grid-template-columns: 1fr;
            gap: 15px;
            padding: 15px;
          }
          
          .project-item {
            aspect-ratio: 4/3;
          }
        }
        
        @media (max-width: 480px) {
          .portfolio-grid {
            gap: 10px;
            padding: 10px;
          }
        }
      `;
      
      document.head.appendChild(styleElement);
    }
  });