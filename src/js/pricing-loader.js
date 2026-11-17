document.addEventListener('DOMContentLoaded', async () => {
  const catalog = document.querySelector('#pricing-catalog');
  const categoryNav = document.querySelector('#pricing-categories');
  if (!catalog || !categoryNav) return;

  const slugify = (value) => value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const makeText = (tag, className, value) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = value;
    return element;
  };

  try {
    const response = await fetch('./src/data/pricing.json');
    if (!response.ok) throw new Error(`Could not load pricing: ${response.status}`);
    const categories = await response.json();
    if (!Array.isArray(categories)) throw new Error('Pricing data must be a list.');

    const navItems = [];
    const categorySections = [];

    categories.forEach((categoryData) => {
      if (!categoryData || !categoryData.category) return;
      const slug = slugify(categoryData.category);
      const categorySection = document.createElement('section');
      categorySection.className = 'pricing-category';
      categorySection.id = `pricing-category-${slug}`;

      const heading = makeText('h3', 'pricing-category-title', categoryData.category);
      const plans = document.createElement('div');
      plans.className = 'pricing-plans';

      (Array.isArray(categoryData.tiers) ? categoryData.tiers.slice(0, 3) : []).forEach((tier, index) => {
        const card = document.createElement('article');
        card.className = 'pricing-card';
        if (index === 1) card.classList.add('pricing-card-featured');

        const cardHeading = document.createElement('div');
        cardHeading.className = 'pricing-card-heading';
        cardHeading.appendChild(makeText('h4', 'pricing-tier-name', tier.name || `Level ${index + 1}`));

        const price = makeText('p', 'pricing-price', tier.price || 'Add price');
        const description = makeText(
          'p',
          'pricing-description',
          tier.description || 'Add a short description of this service level.'
        );

        const includesHeading = makeText('h5', 'pricing-includes-title', 'Includes');
        const includes = document.createElement('ul');
        includes.className = 'pricing-includes';
        const items = Array.isArray(tier.includes) ? tier.includes : [];
        (items.length ? items : ['Add included items in pricing.json']).forEach((item) => {
          includes.appendChild(makeText('li', '', item));
        });

        card.append(cardHeading, price, description, includesHeading, includes);
        plans.appendChild(card);
      });

      categorySection.append(heading, plans);
      categorySections.push(categorySection);

      const link = document.createElement('a');
      link.className = 'pricing-category-link';
      link.href = `#pricing-category-${slug}`;
      link.textContent = categoryData.category;
      navItems.push(link);
    });

    if (categorySections.length === 0) {
      catalog.appendChild(makeText('p', 'pricing-empty', 'Add service categories in pricing.json.'));
      return;
    }

    categoryNav.replaceChildren(...navItems);
    catalog.replaceChildren(...categorySections);
  } catch (error) {
    console.error('Error loading pricing categories:', error);
    catalog.replaceChildren(makeText('p', 'pricing-empty', 'Pricing information is temporarily unavailable.'));
  }
});
