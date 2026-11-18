document.addEventListener('DOMContentLoaded', async () => {
  const currentNodes = document.querySelectorAll('.active-orders-badge .current, .waitlist-current');
  if (!currentNodes.length) return;

  try {
    const response = await fetch('./active-orders.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`Could not load active orders: ${response.status}`);
    const orders = await response.json();
    if (!Array.isArray(orders)) throw new Error('Active orders data must be a list.');

    const current = String(orders.length);
    currentNodes.forEach(node => { node.textContent = current; });

    const badge = document.querySelector('.active-orders-badge');
    if (badge) {
      const total = badge.querySelector('.total')?.textContent || '5';
      badge.setAttribute('aria-label', `${current} of ${total} active orders`);
    }
  } catch (error) {
    console.error('Could not update the active order count:', error);
  }
});
