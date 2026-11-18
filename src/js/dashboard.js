(() => {
  const OWNER = 'Ferkiiland';
  const REPOSITORY = 'portfolio';
  const BRANCH = 'main';
  const PORTFOLIO_CATEGORIES = ['UI & UX', 'GFX', 'Modeling', 'UGC', 'Building'];
  const API_ROOT = `https://api.github.com/repos/${OWNER}/${REPOSITORY}`;
  const CONTENTS = {
    projects: { path: 'src/data/projects.json', data: null, sha: null },
    pricing: { path: 'src/data/pricing.json', data: null, sha: null },
    testimonials: { path: 'src/data/testimonials.json', data: null, sha: null },
    waitlist: { path: 'active-orders.json', data: null, sha: null }
  };

  let token = '';
  let activeTab = 'portfolio';
  let selectedProject = -1;
  let selectedPricingCategory = 0;
  let selectedTestimonial = -1;
  let selectedWaitlistEntry = -1;
  let toastTimer = null;

  const connectPanel = document.querySelector('#connect-panel');
  const workspace = document.querySelector('#workspace');
  const workspaceContent = document.querySelector('#workspace-content');
  const connectForm = document.querySelector('#connect-form');
  const tokenInput = document.querySelector('#github-token');
  const connectButton = document.querySelector('#connect-button');
  const connectError = document.querySelector('#connect-error');
  const disconnectButton = document.querySelector('#disconnect-button');
  const toast = document.querySelector('#toast');

  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const button = (text, className = 'button button-secondary', type = 'button') => {
    const node = element('button', className, text);
    node.type = type;
    return node;
  };

  const field = (labelText, value, options = {}) => {
    const wrapper = element('label', 'field');
    wrapper.appendChild(element('span', 'field-label', labelText));
    let control;
    if (options.type === 'textarea') {
      control = element('textarea');
      control.value = value || '';
      if (options.rows) control.rows = options.rows;
    } else if (options.type === 'select') {
      control = element('select');
      (options.options || []).forEach((optionData) => {
        const option = element('option', '', optionData.label);
        option.value = String(optionData.value);
        if (String(optionData.value) === String(value)) option.selected = true;
        control.appendChild(option);
      });
    } else {
      control = element('input');
      control.type = options.type || 'text';
      control.value = value || '';
      if (options.accept) control.accept = options.accept;
      if (options.placeholder) control.placeholder = options.placeholder;
      if (options.list) control.setAttribute('list', options.list);
    }
    if (options.required) control.required = true;
    if (options.field) control.dataset.field = options.field;
    wrapper.appendChild(control);
    if (options.help) wrapper.appendChild(element('span', 'field-help-inline', options.help));
    return wrapper;
  };

  const actions = (...nodes) => {
    const wrap = element('div', 'form-actions');
    nodes.forEach((node) => wrap.appendChild(node));
    return wrap;
  };

  const actionGroup = (...nodes) => {
    const wrap = element('div', 'action-group');
    nodes.forEach((node) => wrap.appendChild(node));
    return wrap;
  };

  const showToast = (message, isError = false) => {
    toast.textContent = message;
    toast.classList.toggle('is-error', isError);
    toast.classList.add('is-visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 4200);
  };

  const setConnectError = (message) => {
    connectError.textContent = message;
    connectError.hidden = !message;
  };

  const encodeBase64 = (bytes) => {
    let binary = '';
    const chunkSize = 0x8000;
    for (let offset = 0; offset < bytes.length; offset += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
    }
    return btoa(binary);
  };

  const encodeText = (value) => encodeBase64(new TextEncoder().encode(value));

  const decodeText = (value) => {
    const binary = atob((value || '').replace(/\s/g, ''));
    const bytes = Uint8Array.from(binary, character => character.charCodeAt(0));
    return new TextDecoder('utf-8').decode(bytes);
  };

  const apiPath = (path) => path.split('/').map(encodeURIComponent).join('/');

  const githubRequest = async (path, options = {}) => {
    const headers = {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.body ? { 'Content-Type': 'application/json' } : {})
    };
    const response = await fetch(`${API_ROOT}${path ? `/${path}` : ''}`, {
      ...options,
      headers: { ...headers, ...(options.headers || {}) }
    });
    let result = {};
    try { result = await response.json(); } catch (_) {}
    if (!response.ok) {
      if (response.status === 401) throw new Error(`GitHub respondió 401: ${result.message || 'el token no es válido o caducó'}. Vuelve a conectar con un token vigente.`);
      if (response.status === 403) throw new Error(`GitHub respondió 403: ${result.message || 'el token no tiene permiso de escritura'}. Crea un fine-grained token para Ferkiiland/portfolio con Contents: Read and write; si cambiaste permisos, genera un token nuevo.`);
      if (response.status === 404) throw new Error(`GitHub respondió 404: ${result.message || 'el token no puede acceder a este archivo'}. Confirma que el token incluya Ferkiiland/portfolio y permiso Contents.`);
      if (response.status === 409 || response.status === 422) throw new Error('GitHub no pudo guardar el cambio. El archivo pudo cambiar en otro lugar; desconéctate, vuelve a conectar e inténtalo otra vez.');
      throw new Error(result.message || `Falló la solicitud a GitHub (${response.status}).`);
    }
    return result;
  };

  const loadJsonFile = async (key) => {
    const file = CONTENTS[key];
    const response = await githubRequest(`contents/${apiPath(file.path)}?ref=${BRANCH}`);
    const data = JSON.parse(decodeText(response.content));
    if (!Array.isArray(data)) throw new Error(`${file.path} must contain a JSON list.`);
    file.data = data;
    file.sha = response.sha;
  };

  const saveJsonFile = async (key, nextData, message) => {
    const file = CONTENTS[key];
    const result = await githubRequest(`contents/${apiPath(file.path)}`, {
      method: 'PUT',
      body: JSON.stringify({
        message,
        content: encodeText(JSON.stringify(nextData, null, 2) + '\n'),
        sha: file.sha,
        branch: BRANCH
      })
    });
    file.data = nextData;
    file.sha = result.content.sha;
  };

  const uploadProjectImage = async (file, title) => {
    const allowed = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) throw new Error('Elige una imagen PNG, JPG, WebP o GIF.');
    if (file.size > 8 * 1024 * 1024) throw new Error('Las imágenes deben pesar 8 MB o menos.');

    const extension = (file.name.split('.').pop() || 'png').toLowerCase().replace(/[^a-z0-9]/g, '');
    const slug = (title || 'portfolio-item')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'portfolio-item';
    const imageName = `${slug}-${Date.now()}.${extension}`;
    const path = `src/images/PortfolioPreview/${imageName}`;
    const bytes = new Uint8Array(await file.arrayBuffer());
    await githubRequest(`contents/${apiPath(path)}`, {
      method: 'PUT',
      body: JSON.stringify({
        message: `Agregar imagen del portfolio: ${title || imageName}`,
        content: encodeBase64(bytes),
        branch: BRANCH
      })
    });
    return imageName;
  };

  const switchView = (name) => {
    activeTab = name;
    document.querySelectorAll('.workspace-tab').forEach((tab) => {
      const selected = tab.dataset.tab === name;
      tab.classList.toggle('is-active', selected);
      tab.setAttribute('aria-selected', String(selected));
    });
    if (name === 'portfolio') renderPortfolioView();
    if (name === 'pricing') renderPricingView();
    if (name === 'testimonials') renderTestimonialsView();
    if (name === 'waitlist') renderWaitlistView();
  };

  document.querySelectorAll('.workspace-tab').forEach((tab) => {
    tab.addEventListener('click', () => switchView(tab.dataset.tab));
  });

  const makeViewHeading = (title, description, action) => {
    const wrap = element('div', 'view-heading');
    const text = element('div');
    text.append(element('h2', '', title), element('p', '', description));
    wrap.appendChild(text);
    if (action) wrap.appendChild(action);
    return wrap;
  };

  const renderPortfolioView = () => {
    const projects = CONTENTS.projects.data || [];
    workspaceContent.replaceChildren();

    const addButton = button('+ Agregar trabajo', 'button button-primary');
    addButton.addEventListener('click', () => {
      selectedProject = -1;
      drawPortfolioEditor();
    });

    const heading = makeViewHeading('Trabajos del portfolio', 'Agrega trabajos, asigna una categoría y carga una imagen.', addButton);
    const layout = element('div', 'editor-layout');
    const sidebar = element('aside', 'editor-sidebar');
    const sideHead = element('p', 'sidebar-heading', `${projects.length} trabajos`);
    const list = element('div', 'item-list project-category-list');
    const projectCategories = [...new Set([...PORTFOLIO_CATEGORIES, ...projects.map(project => project.category || 'Sin categoría')])];
    const selectedCategory = selectedProject >= 0
      ? (projects[selectedProject]?.category || 'Sin categoría')
      : projectCategories[0];
    projectCategories.forEach((category) => {
      const categoryProjects = projects
        .map((project, index) => ({ project, index }))
        .filter(entry => (entry.project.category || 'Sin categoría') === category);
      const group = element('details', 'project-category-group');
      group.open = category === selectedCategory;
      const summary = element('summary', 'project-category-heading');
      summary.append(
        element('span', '', category),
        element('span', 'project-category-count', String(categoryProjects.length))
      );
      const groupItems = element('div', 'project-category-items');
      categoryProjects.forEach(({ project, index }) => {
        const item = button('', `list-item${selectedProject === index ? ' is-active' : ''}`);
        item.append(element('strong', '', project.title || 'Trabajo sin título'));
        item.append(element('span', '', `${project.year || '—'}`));
        item.addEventListener('click', () => {
          selectedProject = index;
          renderPortfolioView();
        });
        groupItems.appendChild(item);
      });
      group.append(summary, groupItems);
      list.appendChild(group);
    });
    sidebar.append(sideHead, list);
    const editor = element('div', 'editor-card');
    layout.append(sidebar, editor);
    workspaceContent.append(heading, layout);

    const drawPortfolioEditor = () => {
      const current = selectedProject >= 0 ? projects[selectedProject] : null;
      editor.replaceChildren();
      editor.appendChild(element('h3', '', current ? 'Editar trabajo' : 'Nuevo trabajo'));

      const form = element('form', 'editor-form');
      form.noValidate = false;
      const formGrid = element('div', 'form-grid');
      const projectCategories = [...new Set([...PORTFOLIO_CATEGORIES, ...projects.map(project => project.category).filter(Boolean)])];
      const categoryOptions = projectCategories.map(category => ({ value: category, label: category }));
      formGrid.append(
        field('Título del trabajo', current?.title || '', { field: 'title', required: true, placeholder: 'Nombre del trabajo' }),
        field('Categoría', current?.category || projectCategories[0] || '', {
          type: 'select',
          field: 'category',
          required: true,
          options: categoryOptions
        }),
        field('Año', current?.year || String(new Date().getFullYear()), { field: 'year', placeholder: '2026' })
      );

      const imageField = element('div', 'field');
      imageField.appendChild(element('span', 'field-label', 'Imagen de portada'));
      const fileInput = element('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/png,image/jpeg,image/webp,image/gif';
      fileInput.dataset.field = 'image';
      fileInput.setAttribute('aria-label', 'Elegir imagen para el trabajo');
      imageField.append(fileInput, element('span', 'field-help-inline', 'PNG, JPG, WebP o GIF · hasta 8 MB'));

      const previewWrap = element('div', 'image-preview-wrap');
      const preview = element('img', 'image-preview');
      preview.alt = 'Vista previa del trabajo';
      const previewPlaceholder = element('span', 'image-preview-placeholder', current?.image ? `Imagen actual: ${current.image}` : 'Elige una imagen para verla aquí.');
      if (current?.image) preview.src = `./src/images/PortfolioPreview/${encodeURIComponent(current.image)}`;
      else preview.hidden = true;
      previewWrap.append(preview, previewPlaceholder);
      imageField.appendChild(previewWrap);
      fileInput.addEventListener('change', () => {
        const file = fileInput.files?.[0];
        if (!file) return;
        preview.src = URL.createObjectURL(file);
        preview.hidden = false;
        previewPlaceholder.textContent = file.name;
      });

      const saveButton = button(current ? 'Guardar trabajo' : 'Agregar trabajo', 'button button-primary', 'submit');
      const deleteButton = current ? button('Eliminar trabajo', 'button button-danger') : null;
      if (deleteButton) {
        deleteButton.addEventListener('click', async () => {
          if (!window.confirm(`¿Eliminar “${current.title}” del portfolio?`)) return;
          const next = projects.filter((_, index) => index !== selectedProject);
          deleteButton.disabled = true;
          try {
            await saveJsonFile('projects', next, `Quitar portfolio project: ${current.title}`);
            selectedProject = -1;
            renderPortfolioView();
            showToast('Trabajo eliminado del portfolio.');
          } catch (error) {
            deleteButton.disabled = false;
            showToast(error.message, true);
          }
        });
      }

      form.append(formGrid, imageField, actions(actionGroup(
        ...(deleteButton ? [deleteButton] : []),
        saveButton
      )));
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const title = form.querySelector('[data-field="title"]').value.trim();
        const category = form.querySelector('[data-field="category"]').value.trim();
        const year = form.querySelector('[data-field="year"]').value.trim();
        const selectedFile = fileInput.files?.[0];
        if (!title || !category) {
          showToast('Escribe primero el título y la categoría.', true);
          return;
        }
        if (!selectedFile && !current?.image) {
          showToast('Elige una imagen de portada para este trabajo.', true);
          return;
        }

        saveButton.disabled = true;
        saveButton.textContent = selectedFile ? 'Subiendo imagen…' : 'Guardando…';
        try {
          let image = current?.image || '';
          if (selectedFile) image = await uploadProjectImage(selectedFile, title);
          const entry = { image, title, category, year };
          const next = projects.slice();
          const targetIndex = selectedProject < 0 ? next.length : selectedProject;
          if (selectedProject < 0) next.push(entry);
          else next[selectedProject] = entry;
          await saveJsonFile('projects', next, `${current ? 'Update' : 'Add'} portfolio project: ${title}`);
          selectedProject = targetIndex;
          renderPortfolioView();
          showToast('Trabajo guardado. GitHub Pages publicará el cambio en breve.');
        } catch (error) {
          saveButton.disabled = false;
          saveButton.textContent = current ? 'Guardar trabajo' : 'Agregar trabajo';
          showToast(error.message, true);
        }
      });

      editor.appendChild(form);
    };

    drawPortfolioEditor();
  };

  const renderPricingView = () => {
    const categories = CONTENTS.pricing.data || [];
    workspaceContent.replaceChildren();

    const addCategoryButton = button('+ Agregar categoría', 'button button-primary');
    addCategoryButton.addEventListener('click', () => {
      categories.push({
        category: 'Nueva categoría',
        tiers: [{ name: 'Básico', price: '', description: '', includes: [] }]
      });
      selectedPricingCategory = categories.length - 1;
      renderPricingView();
    });

    const heading = makeViewHeading('Paquetes de precios', 'Edita hasta tres niveles de servicio por categoría.', addCategoryButton);
    const layout = element('div', 'editor-layout');
    const sidebar = element('aside', 'editor-sidebar');
    sidebar.appendChild(element('p', 'sidebar-heading', 'Categorías de servicio'));
    const categoryList = element('div', 'item-list');
    categories.forEach((category, index) => {
      const item = button(category.category || 'Categoría sin nombre', `list-item${selectedPricingCategory === index ? ' is-active' : ''}`);
      item.addEventListener('click', () => {
        selectedPricingCategory = index;
        renderPricingView();
      });
      categoryList.appendChild(item);
    });
    sidebar.appendChild(categoryList);

    const editor = element('div', 'editor-card');
    layout.append(sidebar, editor);
    workspaceContent.append(heading, layout);

    if (categories.length === 0) {
      editor.appendChild(element('p', 'empty-state', 'Agrega una categoría de servicio para empezar.'));
      return;
    }

    const current = categories[selectedPricingCategory] || categories[0];
    const form = element('form', 'editor-form');
    const categoryField = field('Categoría name', current.category, { field: 'category', required: true });
    form.appendChild(categoryField);

    const tierWrap = element('div', 'tier-editors');
    const drawTiers = (tiers) => {
      tierWrap.replaceChildren();
      tiers.slice(0, 3).forEach((tier, index) => {
        const card = element('section', 'tier-editor');
        const head = element('div', 'sidebar-heading');
        head.appendChild(element('strong', '', `Nivel ${index + 1}`));
        const removeTier = button('Quitar', 'button button-quiet');
        removeTier.addEventListener('click', () => {
          collectPricingDraft();
          current.tiers.splice(index, 1);
          drawTiers(current.tiers);
        });
        head.appendChild(removeTier);
        card.appendChild(head);
        card.append(
          field('Nombre del nivel', tier.name, { field: 'name', required: true }),
          field('Precio', tier.price, { field: 'price', placeholder: 'Desde $…' }),
          field('Descripción', tier.description, { type: 'textarea', field: 'description' }),
          field('Elementos incluidos', Array.isArray(tier.includes) ? tier.includes.join('\n') : '', {
            type: 'textarea',
            field: 'includes',
            help: 'Un elemento por línea.'
          })
        );
        tierWrap.appendChild(card);
      });
    };

    const collectPricingDraft = () => {
      const tierEditors = [...tierWrap.querySelectorAll('.tier-editor')];
      current.category = categoryField.querySelector('input').value.trim() || current.category;
      current.tiers = tierEditors.map((card) => ({
        name: card.querySelector('[data-field="name"]').value.trim(),
        price: card.querySelector('[data-field="price"]').value.trim(),
        description: card.querySelector('[data-field="description"]').value.trim(),
        includes: card.querySelector('[data-field="includes"]').value
          .split('\n')
          .map(item => item.trim())
          .filter(Boolean)
      }));
    };

    drawTiers(Array.isArray(current.tiers) ? current.tiers : []);
    const addTierButton = button('+ Agregar nivel', 'button button-secondary');
    addTierButton.addEventListener('click', () => {
      collectPricingDraft();
      if (current.tiers.length >= 3) return;
      current.tiers.push({ name: 'Nuevo nivel', price: '', description: '', includes: [] });
      drawTiers(current.tiers);
    });

    const saveButton = button('Guardar precios', 'button button-primary', 'submit');
    const deleteCategoryButton = button('Eliminar categoría', 'button button-danger');
    deleteCategoryButton.disabled = categories.length <= 1;
    deleteCategoryButton.title = categories.length <= 1 ? 'Debe quedar al menos una categoría de precios.' : '';
    deleteCategoryButton.addEventListener('click', async () => {
      if (categories.length <= 1) return;
      if (!window.confirm(`¿Eliminar la categoría de precios “${current.category}”?`)) return;
      const next = categories.filter((_, index) => index !== selectedPricingCategory);
      deleteCategoryButton.disabled = true;
      try {
        await saveJsonFile('pricing', next, `Quitar pricing category: ${current.category}`);
        selectedPricingCategory = Math.max(0, selectedPricingCategory - 1);
        renderPricingView();
        showToast('Categoría de precios eliminada.');
      } catch (error) {
        deleteCategoryButton.disabled = false;
        showToast(error.message, true);
      }
    });

    form.append(tierWrap, actions(
      actionGroup(deleteCategoryButton, addTierButton),
      saveButton
    ));
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      collectPricingDraft();
      if (!current.category.trim()) {
        showToast('Escribe el nombre de la categoría.', true);
        return;
      }
      if (current.tiers.length > 3) {
        showToast('Cada categoría puede tener hasta tres niveles.', true);
        return;
      }
      if (current.tiers.some(tier => !tier.name)) {
        showToast('Ponle un nombre a cada nivel de precios.', true);
        return;
      }
      const names = categories.map((category, index) => index === selectedPricingCategory ? current.category.toLowerCase() : category.category.toLowerCase());
      if (new Set(names).size !== names.length) {
        showToast('Cada categoría de precios debe tener un nombre único.', true);
        return;
      }

      saveButton.disabled = true;
      saveButton.textContent = 'Guardando…';
      try {
        await saveJsonFile('pricing', categories, `Actualizar precios: ${current.category}`);
        renderPricingView();
        showToast('Precios guardados. El sitio se actualizará en breve.');
      } catch (error) {
        saveButton.disabled = false;
        saveButton.textContent = 'Guardar precios';
        showToast(error.message, true);
      }
    });
    editor.appendChild(form);
  };

  const renderTestimonialsView = () => {
    const testimonials = CONTENTS.testimonials.data || [];
    workspaceContent.replaceChildren();

    const addButton = button('+ Agregar testimonio', 'button button-primary');
    addButton.addEventListener('click', () => {
      selectedTestimonial = -1;
      renderTestimonialsView();
    });
    const heading = makeViewHeading('Testimonios de clientes', 'Publica las reseñas que te han compartido tus clientes.', addButton);
    const layout = element('div', 'editor-layout');
    const sidebar = element('aside', 'editor-sidebar');
    sidebar.appendChild(element('p', 'sidebar-heading', `${testimonials.length} testimonios`));
    const list = element('div', 'item-list');
    testimonials.forEach((testimonial, index) => {
      const item = button('', `list-item${selectedTestimonial === index ? ' is-active' : ''}`);
      item.append(element('strong', '', testimonial.client || 'Cliente sin nombre'));
      item.append(element('span', '', `${testimonial.project || 'Sin proyecto'} · ${testimonial.rating || 5}★`));
      item.addEventListener('click', () => {
        selectedTestimonial = index;
        renderTestimonialsView();
      });
      list.appendChild(item);
    });
    sidebar.appendChild(list);

    const editor = element('div', 'editor-card testimonial-editor');
    layout.append(sidebar, editor);
    workspaceContent.append(heading, layout);
    const current = selectedTestimonial >= 0 ? testimonials[selectedTestimonial] : null;
    editor.appendChild(element('h3', '', current ? 'Editar testimonio' : 'Nuevo testimonio'));
    const form = element('form', 'editor-form');
    const grid = element('div', 'form-grid');
    grid.append(
      field('Nombre del cliente', current?.client || '', { field: 'client', required: true }),
      field('Trabajo', current?.project || '', { field: 'project' }),
      field('Categoría', current?.category || '', { field: 'category', placeholder: 'UI & UX, GFX…' }),
      field('Calificación', current?.rating || 5, {
        type: 'select',
        field: 'rating',
        options: [5, 4, 3, 2, 1].map(value => ({ value, label: `${value} estrellas` }))
      })
    );
    const quote = field('Reseña del cliente', current?.quote || '', {
      type: 'textarea',
      field: 'quote',
      required: true,
      help: 'Usa las palabras exactas del cliente y obtén su aprobación antes de publicarlas.'
    });
    const saveButton = button(current ? 'Guardar testimonio' : 'Agregar testimonio', 'button button-primary', 'submit');
    const deleteButton = current ? button('Eliminar testimonio', 'button button-danger') : null;
    if (deleteButton) {
      deleteButton.addEventListener('click', async () => {
        if (!window.confirm(`¿Eliminar el testimonio de ${current.client}?`)) return;
        const next = testimonials.filter((_, index) => index !== selectedTestimonial);
        deleteButton.disabled = true;
        try {
          await saveJsonFile('testimonials', next, `Quitar testimonial: ${current.client}`);
          selectedTestimonial = -1;
          renderTestimonialsView();
          showToast('Testimonio eliminado.');
        } catch (error) {
          deleteButton.disabled = false;
          showToast(error.message, true);
        }
      });
    }
    form.append(grid, quote, actions(actionGroup(
      ...(deleteButton ? [deleteButton] : []),
      saveButton
    )));
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const entry = {
        client: form.querySelector('[data-field="client"]').value.trim(),
        project: form.querySelector('[data-field="project"]').value.trim(),
        category: form.querySelector('[data-field="category"]').value.trim(),
        rating: Number(form.querySelector('[data-field="rating"]').value),
        quote: form.querySelector('[data-field="quote"]').value.trim()
      };
      if (!entry.client || !entry.quote) {
        showToast('Agrega el nombre del cliente y su reseña.', true);
        return;
      }
      const next = testimonials.slice();
      const targetIndex = selectedTestimonial < 0 ? next.length : selectedTestimonial;
      if (selectedTestimonial < 0) next.push(entry);
      else next[selectedTestimonial] = entry;

      saveButton.disabled = true;
      saveButton.textContent = 'Guardando…';
      try {
        await saveJsonFile('testimonials', next, `${current ? 'Update' : 'Add'} testimonial: ${entry.client}`);
        selectedTestimonial = targetIndex;
        renderTestimonialsView();
        showToast('Testimonio guardado. El sitio se actualizará en breve.');
      } catch (error) {
        saveButton.disabled = false;
        saveButton.textContent = current ? 'Guardar testimonio' : 'Agregar testimonio';
        showToast(error.message, true);
      }
    });
    editor.appendChild(form);
  };

  const generateOrderKey = (entries) => {
    const existing = new Set(entries.map(entry => String(entry.key || '').toLowerCase()));
    let key = '';
    do {
      const bytes = new Uint8Array(4);
      crypto.getRandomValues(bytes);
      key = [...bytes].map(value => value.toString(16).padStart(2, '0')).join('');
    } while (existing.has(key));
    return key;
  };

  const renderWaitlistView = () => {
    const entries = CONTENTS.waitlist.data || [];
    workspaceContent.replaceChildren();

    const addButton = button('+ Agregar entrada', 'button button-primary');
    addButton.addEventListener('click', () => {
      selectedWaitlistEntry = -1;
      renderWaitlistView();
    });
    const heading = makeViewHeading(
      'Waitlist / Active orders',
      'Administra los pedidos activos. Cada cambio actualiza el contador público de Active orders.',
      addButton
    );
    const layout = element('div', 'editor-layout');
    const sidebar = element('aside', 'editor-sidebar');
    sidebar.appendChild(element('p', 'sidebar-heading', `${entries.length} pedidos activos`));
    const list = element('div', 'item-list');
    entries.forEach((entry, index) => {
      const item = button('', `list-item${selectedWaitlistEntry === index ? ' is-active' : ''}`);
      item.append(element('strong', '', entry.userName || 'Cliente sin nombre'));
      item.append(element('span', '', `${entry.title || 'Pedido sin título'} · ${entry.category || 'Sin categoría'}`));
      item.addEventListener('click', () => {
        selectedWaitlistEntry = index;
        renderWaitlistView();
      });
      list.appendChild(item);
    });
    sidebar.appendChild(list);

    const editor = element('div', 'editor-card');
    layout.append(sidebar, editor);
    workspaceContent.append(heading, layout);

    const current = selectedWaitlistEntry >= 0 ? entries[selectedWaitlistEntry] : null;
    editor.appendChild(element('h3', '', current ? 'Editar pedido' : 'Nueva entrada'));
    const form = element('form', 'editor-form');
    const categoryOptions = [...new Set([
      ...(CONTENTS.projects.data || []).map(project => project.category),
      ...entries.map(entry => entry.category)
    ].filter(Boolean))].map(category => ({ value: category, label: category }));
    const grid = element('div', 'form-grid');
    grid.append(
      field('Nombre del cliente', current?.userName || '', { field: 'userName', required: true, placeholder: 'Nombre o usuario' }),
      field('Título del pedido', current?.title || '', { field: 'title', required: true }),
      field('Categoría', current?.category || categoryOptions[0]?.value || '', {
        type: 'select', field: 'category', required: true, options: categoryOptions
      }),
      field('Clave para reseña', current?.key || generateOrderKey(entries), {
        field: 'key', required: true, help: 'La clave permite enviar una reseña desde Reviewpanel.'
      })
    );
    const description = field('Descripción', current?.description || '', {
      type: 'textarea', field: 'description', help: 'Opcional.'
    });

    const saveButton = button(current ? 'Guardar pedido' : 'Agregar a la waitlist', 'button button-primary', 'submit');
    const deleteButton = current ? button('Eliminar pedido', 'button button-danger') : null;
    if (deleteButton) {
      deleteButton.addEventListener('click', async () => {
        if (!window.confirm(`¿Eliminar el pedido de ${current.userName || current.title}?`)) return;
        const next = entries.filter((_, index) => index !== selectedWaitlistEntry);
        deleteButton.disabled = true;
        try {
          await saveJsonFile('waitlist', next, `Remove active order: ${current.title}`);
          selectedWaitlistEntry = -1;
          renderWaitlistView();
          showToast('Pedido eliminado y contador Active orders actualizado.');
        } catch (error) {
          deleteButton.disabled = false;
          showToast(error.message, true);
        }
      });
    }

    form.append(grid, description, actions(actionGroup(
      ...(deleteButton ? [deleteButton] : []),
      saveButton
    )));
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const entry = {
        ...(current || {}),
        userName: form.querySelector('[data-field="userName"]').value.trim(),
        title: form.querySelector('[data-field="title"]').value.trim(),
        category: form.querySelector('[data-field="category"]').value,
        key: form.querySelector('[data-field="key"]').value.trim(),
        description: form.querySelector('[data-field="description"]').value.trim(),
        createdAt: current?.createdAt || new Date().toISOString(),
        createdBy: current?.createdBy || ''
      };
      if (!entry.userName || !entry.title || !entry.category || !entry.key) {
        showToast('Completa cliente, pedido, categoría y clave.', true);
        return;
      }
      const keyAlreadyUsed = entries.some((item, index) =>
        index !== selectedWaitlistEntry && String(item.key).toLowerCase() === entry.key.toLowerCase()
      );
      if (keyAlreadyUsed) {
        showToast('Esa clave ya está asignada a otro pedido.', true);
        return;
      }

      const next = entries.slice();
      const targetIndex = selectedWaitlistEntry < 0 ? next.length : selectedWaitlistEntry;
      if (selectedWaitlistEntry < 0) {
        entry.orderImage = null;
        entry.userAvatar = '';
        next.push(entry);
      } else {
        next[selectedWaitlistEntry] = entry;
      }

      saveButton.disabled = true;
      saveButton.textContent = 'Guardando…';
      try {
        await saveJsonFile('waitlist', next, `${current ? 'Update' : 'Add'} active order: ${entry.title}`);
        selectedWaitlistEntry = targetIndex;
        renderWaitlistView();
        showToast('Pedido guardado y contador Active orders actualizado.');
      } catch (error) {
        saveButton.disabled = false;
        saveButton.textContent = current ? 'Guardar pedido' : 'Agregar a la waitlist';
        showToast(error.message, true);
      }
    });
    editor.appendChild(form);
  };

  connectForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    token = tokenInput.value.trim();
    if (!token) return;
    setConnectError('');
    connectButton.disabled = true;
    connectButton.textContent = 'Conectando…';
    try {
      await Promise.all(Object.keys(CONTENTS).map(loadJsonFile));
      connectPanel.hidden = true;
      workspace.hidden = false;
      disconnectButton.hidden = false;
      switchView('portfolio');
      showToast('Conexión lista. Ya puedes editar el contenido.');
    } catch (error) {
      token = '';
      setConnectError(error.message || 'No se pudo conectar con GitHub.');
    } finally {
      tokenInput.value = '';
      connectButton.disabled = false;
      connectButton.textContent = 'Conectar y cargar contenido';
    }
  });

  disconnectButton.addEventListener('click', () => {
    token = '';
    Object.values(CONTENTS).forEach(file => {
      file.data = null;
      file.sha = null;
    });
    workspace.hidden = true;
    disconnectButton.hidden = true;
    connectPanel.hidden = false;
    setConnectError('');
    showToast('Desconectado. El token se eliminó de la memoria.');
  });
})();
