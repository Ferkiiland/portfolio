document.addEventListener('DOMContentLoaded', async () => {
  const grid = document.querySelector('.testimonials-grid');
  if (!grid) return;

  const showMessage = (message) => {
    const note = document.createElement('p');
    note.className = 'testimonials-empty';
    note.textContent = message;
    grid.replaceChildren(note);
  };

  try {
    const response = await fetch('./src/data/testimonials.json');
    if (!response.ok) throw new Error(`Could not load testimonials: ${response.status}`);

    const testimonials = await response.json();
    if (!Array.isArray(testimonials) || testimonials.length === 0) {
      showMessage('Client stories will appear here soon.');
      return;
    }

    const cards = testimonials
      .filter((item) => item && item.quote && item.client)
      .map((item) => {
        const card = document.createElement('article');
        card.className = 'testimonial-card';

        const top = document.createElement('div');
        top.className = 'testimonial-card-top';

        const category = document.createElement('span');
        category.className = 'testimonial-category';
        category.textContent = item.category || 'Client review';

        const rating = Math.max(1, Math.min(5, Number(item.rating) || 5));
        const stars = document.createElement('span');
        stars.className = 'testimonial-stars';
        stars.textContent = '★'.repeat(rating) + '☆'.repeat(5 - rating);
        stars.setAttribute('aria-label', `${rating} out of 5 stars`);
        top.append(category, stars);

        const quote = document.createElement('blockquote');
        quote.textContent = `“${item.quote}”`;

        const client = document.createElement('div');
        client.className = 'testimonial-client';

        const avatar = document.createElement('span');
        avatar.className = 'testimonial-avatar';
        avatar.setAttribute('aria-hidden', 'true');
        avatar.textContent = (item.client.trim().charAt(0) || 'C').toUpperCase();

        const details = document.createElement('div');
        const name = document.createElement('p');
        name.className = 'testimonial-name';
        name.textContent = item.client;
        const project = document.createElement('p');
        project.className = 'testimonial-project';
        project.textContent = item.project || '';

        details.append(name, project);
        client.append(avatar, details);
        card.append(top, quote, client);
        return card;
      });

    if (cards.length === 0) {
      showMessage('Client stories will appear here soon.');
      return;
    }

    grid.replaceChildren(...cards);
  } catch (error) {
    console.error('Error loading client testimonials:', error);
    showMessage('Testimonials are temporarily unavailable.');
  }
});
