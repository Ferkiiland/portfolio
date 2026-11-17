document.addEventListener('DOMContentLoaded', async () => {
  const catalog = document.querySelector('#pricing-catalog');
  const categoryNav = document.querySelector('#pricing-categories');
  if (!catalog || !categoryNav) return;

  const makeText = (tag, className, value) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = value;
    return element;
  };

  const createTierCard = (tier, index) => {
    const card = document.createElement('article');
    card.className = 'pricing-card';
    if (index === 1) card.classList.add('pricing-card-featured');

    const cardHeading = document.createElement('div');
    cardHeading.className = 'pricing-card-heading';
    cardHeading.appendChild(makeText('h3', 'pricing-tier-name', tier.name || `Level ${index + 1}`));

    const price = makeText('p', 'pricing-price', tier.price || 'Add price');
    const description = makeText(
      'p',
      'pricing-description',
      tier.description || 'Add a short description of this service level.'
    );

    const includesHeading = makeText('h4', 'pricing-includes-title', 'Includes');
    const includes = document.createElement('ul');
    includes.className = 'pricing-includes';
    const items = Array.isArray(tier.includes) ? tier.includes : [];
    (items.length ? items : ['Add included items in pricing.json']).forEach((item) => {
      includes.appendChild(makeText('li', '', item));
    });

    card.append(cardHeading, price, description, includesHeading, includes);
    return card;
  };

  const renderCategory = (categories, selectedIndex, buttons) => {
    catalog.scrollLeft = 0;
    buttons.forEach((button, index) => {
      const selected = index === selectedIndex;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
    });

    const tiers = Array.isArray(categories[selectedIndex]?.tiers)
      ? categories[selectedIndex].tiers.slice(0, 3)
      : [];
    const cards = tiers.map(createTierCard);

    if (cards.length === 0) {
      catalog.replaceChildren(makeText('p', 'pricing-empty', 'Add up to three service levels in pricing.json.'));
      return;
    }
    const plans = document.createElement('div');
    plans.className = 'pricing-plans';
    if (cards.length === 1) plans.classList.add('has-single-plan');
    plans.replaceChildren(...cards);
    catalog.replaceChildren(plans);
  };

  try {
    const response = await fetch('./src/data/pricing.json');
    if (!response.ok) throw new Error(`Could not load pricing: ${response.status}`);
    const categories = await response.json();
    if (!Array.isArray(categories) || categories.length === 0) {
      throw new Error('Pricing data must contain at least one category.');
    }

    const availableCategories = categories.filter((item) => item && item.category);
    const buttons = availableCategories.map((item, index) => {
      const button = makeText('button', 'pricing-category-link', item.category);
      button.type = 'button';
      button.setAttribute('aria-controls', 'pricing-catalog');
      button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', () => renderCategory(availableCategories, index, buttons));
      return button;
    });

    if (buttons.length === 0) throw new Error('No valid pricing categories were found.');
    categoryNav.replaceChildren(...buttons);
    renderCategory(availableCategories, 0, buttons);
  } catch (error) {
    console.error('Error loading pricing categories:', error);
    categoryNav.replaceChildren();
    catalog.replaceChildren(makeText('p', 'pricing-empty', 'Pricing information is temporarily unavailable.'));
  }
});
