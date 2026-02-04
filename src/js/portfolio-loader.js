// portfolio-loader.js - VERSIÓN MEJORADA
document.addEventListener('DOMContentLoaded', function() {
    const portfolioSection = document.querySelector('.PortfolioSection');
    if (!portfolioSection) return;
    
    // CONFIGURACIÓN DETALLADA DE CADA PROYECTO
    const PROJECTS = [
      {
        image: 'SpinWheel.png',
        title: 'Magic Spin Wheel',
        category: 'UI & UX',
        year: '2025' 
        },
      {
        image: 'Daily Rewards.png',
        title: 'DWF Daily rewards',
        category: 'UI & UX',
        year: '2025' 
        },
        {
        image: 'Codes Ui.png',
        title: 'DWF Codes UI',
        category: 'UI & UX',
        year: '2025' 
        },
        {
        image: 'Drawing UI.png',
        title: 'DWF Drawing UI',
        category: 'UI & UX',
        year: '2025' 
        },
        {
        image: 'Emojis-1.png',
        title: 'DWF emojis',
        category: 'UI & UX',
        year: '2025' 
        },
        {
        image: 'DwfComponents.png',
        title: 'DWF components',
        category: 'UI & UX',
        year: '2025' 
        },
        {
        image: 'Shop.png',
        title: 'Slender Shop Frame',
        category: 'UI & UX',
        year: '2025' 
        },
        {
        image: 'HgMain2.png',
        title: 'Main screen HGames',
        category: 'UI & UX',
        year: '2025' 
        },
        {
        image: 'HgMain3.png',
        title: 'Emote Wheel HGames',
        category: 'UI & UX',
        year: '2025' 
        },
        {
        image: 'Achievements.png',
        title: 'Slender Achievements',
        category: 'UI & UX',
        year: '2025' 
        },
        {
        image: 'FPSConcept1.png',
        title: 'FPS lobby',
        category: 'UI & UX',
        year: '2025' 
        },
        {
        image: 'ThumbnailKaiden2.png',
        title: 'Obby Thumbnail',
        category: 'GFX',
        year: '2025' 
        },
        {
        image: 'Pets2@0,33x.png',
        title: 'Pet pack 2',
        category: 'Modeling',
        year: '2025' 
        },
        {
        image: 'Pets3@0,33x.png',
        title: 'Egg pack',
        category: 'Modeling',
        year: '2025' 
        },
        {
        image: 'Pets4.png',
        title: 'Pet pack',
        category: 'Modeling',
        year: '2025' 
        },
        {
        image: 'NewUIDesigns.png',
        title: 'Car legends shop',
        category: 'UI & UX',
        year: '2025' 
        },
        {
        image: 'Pause.png',
        title: 'Pause UI',
        category: 'UI & UX',
        year: '2025' 
        },
        {
          image: 'Settings.png',
          title: 'BDA settings',
          category: 'UI & UX',
          year: '2025' 
        },
        {
          image: 'BDA MENU.png',
          title: 'BDA Lobby menu',
          category: 'UI & UX',
          year: '2025' 
        },
        {
        image: 'NewUIDesignTemplate3.png',
        title: 'Egg shop',
        category: 'UI & UX',
        year: '2025' 
        },
        {
        image: 'P2.png',
        title: 'Vegeta Thumbnail',
        category: 'GFX',
        year: '2025' 
        },
        {
        image: 'Player Selection.png',
        title: 'Player Selection UI',
        category: 'UI & UX',
        year: '2025' 
        },
        {
        image: 'RyanUIConcept.png',
        title: 'HUD concept',
        category: 'UI & UX',
        year: '2025' 
        },
        {
        image: 'Samplework1.png',
        title: 'Inventory Cartoony UI',
        category: 'UI & UX',
        year: '2025' 
        },
        {
        image: 'Samplework3.png',
        title: 'Clouds Inventory UI',
        category: 'UI & UX',
        year: '2025' 
        },
        {
        image: 'SCPF Emblems.png',
        title: 'SCPF Emblems',
        category: 'UI & UX',
        year: '2025' 
        },
        {
        image: 'ThumnailKaiden.png',
        title: 'Kaiden´s group Thumbnail',
        category: 'GFX',
        year: '2025' 
        },
        {
        image: 'Worlds.png',
        title: 'Manga Heroes',
        category: 'UI & UX',
        year: '2025' 
        },
        {
        image: 'Start screen.png',
        title: 'Manga Heroes',
        category: 'UI & UX',
        year: '2025' 
        },
        {
        image: 'TokensFrame.png',
        title: 'Ryan Shop | TOKENS',
        category: 'UI & UX',
        year: '2025' 
        },
        {
        image: 'RyanUIConceptShop.png',
        title: 'Ryan Shop',
        category: 'UI & UX',
        year: '2025' 
        },
        {
        image: 'WestyEmblemBadges.png',
        title: 'Westy Emblem Badges',
        category: 'UI & UX',
        year: '2025' 
        },
        {
        image: 'RedHood@0,33x.png',
        title: 'RedHood',
        category: 'UGC',
        year: '2025' 
        },
        {
        image: 'Short Hair.png',
        title: 'Short Hair',
        category: 'UGC',
        year: '2025' 
        },
        {
        image: 'Wavy Long Hair@0,33x.png',
        title: 'Wavy Long Hair',
        category: 'UGC',
        year: '2025' 
        },
        {
        image: 'LovelyHeadC3@0,33x.png',
        title: 'LovelyHead',
        category: 'UGC',
        year: '2025' 
        },
        {
        image: 'Kuromi Hat@0,33x.png',
        title: 'Kuromi Hat',
        category: 'UGC',
        year: '2025' 
        },
        {
        image: 'Lava Cracked Fedora@0,33x.png',
        title: 'Lava Cracked Fedora',
        category: 'UGC',
        year: '2025' 
        },
        {
        image: 'Kuromiss Clicker.png',
        title: 'Kuromiss Clicker',
        category: 'UI & UX',
        year: '2025' 
        },
        {
        image: 'Galatic Border Roleplay Main.png',
        title: 'Galactic Border RP',
        category: 'UI & UX',
        year: '2025' 
        },
       {
        image: 'Lobby.png',
        title: 'Nonamed FPS concept',
        category: 'UI & UX',
        year: '2025' 
        },
        {
        image: 'Gamepasses@0,33x.png',
        title: 'My Hotel icons',
        category: 'UI & UX',
        year: '2025' 
        },
        {
        image: 'HxH@0,33x.png',
        title: 'HxH Simulator',
        category: 'GFX',
        year: '2025' 
        },
        {
        image: 'HP HUD.png',
        title: 'Manga Heroes',
        category: 'UI & UX',
        year: '2025' 
        },
        {
        image: 'FPSConcept2.png',
        title: 'FPS Masters',
        category: 'UI & UX',
       year: '2025' 
      },
        {
        image: 'CartoonMain.png',
        title: 'Old CartoonyUI',
        category: 'UI & UX',
       year: '2025'
      },
      {
        image: 'Components.png',
        title: 'StreetBall Simulator',
        category: 'UI & UX',
        year: '2024'
      },
        {
        image: 'Admin Panel start .png',
        title: 'Frk Admin Panel',
        category: 'UI & UX',
        year: '2023'
      },
      {
        image: 'Admin Panel.png',
        title: 'Frk Admin Panel',
        category: 'UI & UX',
        year: '2023'
      },
      // AGREGA MÁS PROYECTOS AQUÍ:
      // {
      //   image: 'nombre_archivo.jpg',
      //   title: 'Título del proyecto',
      //   category: 'Categoría',
      //   description: 'Descripción breve',
      //   technologies: ['Tech1', 'Tech2'],
      //   year: '2024'
      // }
    ];
    
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
    
    function loadPortfolioProjects() {
      const sectionContent = portfolioSection.querySelector('.section-content');
      if (!sectionContent) return;
      
      // Limpiar contenido previo
      sectionContent.innerHTML = '';
      
      // Crear contenedor del grid
      const portfolioGrid = document.createElement('div');
      portfolioGrid.className = 'portfolio-grid';
      portfolioGrid.style.cssText = `
        display: grid;
        grid-template-columns: repeat(${MAX_COLUMNS}, 1fr);
        gap: 10px;
        padding: 10px;
        width: 100%;
      `;
      
      // Crear y agregar cada proyecto
      PROJECTS.forEach((project, index) => {
        const projectItem = createProjectItem(project, index);
        portfolioGrid.appendChild(projectItem);
      });
      
      sectionContent.appendChild(portfolioGrid);
      
      // Agregar estilos CSS dinámicamente
      addPortfolioStyles();
    }
    
    function createProjectItem(project, index) {
      const projectItem = document.createElement('div');
      projectItem.className = 'project-item';
      projectItem.setAttribute('data-category', project.category.toLowerCase().replace(/ & /g, '-').replace(/\s+/g, '-'));
      projectItem.style.cssText = `
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.5s ease, transform 0.5s ease;
        transition-delay: ${index * 0.1}s;
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
      
      // Animar entrada
      setTimeout(() => {
        projectItem.style.opacity = '1';
        projectItem.style.transform = 'translateY(0)';
      }, 100 + (index * 50));
      
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