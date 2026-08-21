(() => {
  const SUMUP_PAYMENT_URL = 'https://pay.sumup.com/b2c/QKXMSQHC';
  const list = document.querySelector('.shop-list');
  const state = { type: '', recherche: '' };
  let items = [];

  const normalise = (value) =>
    (value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  const typeLabel = (value) =>
    ({ creator: 'Creator', artist: 'Artist', friends: 'Friends' }[value] || value || 'Tous');
  const matchesFilters = (item) => {
    const typeMatches = !state.type || item.type === state.type;
    const search = normalise(state.recherche);
    const haystack = normalise(
      [item.type, item.artiste, item.categorie, item.date, item.description]
        .filter(Boolean)
        .join(' ')
    );
    return typeMatches && (!search || haystack.includes(search));
  };
  const renderStatus = (count) => {
    const clearButtons = [
      ...(state.type ? [{ key: 'type', value: typeLabel(state.type) }] : []),
      ...(state.recherche ? [{ key: 'recherche', value: `“${state.recherche}”` }] : []),
    ];
    const status = list.querySelector('.shop-filter-status');
    if (!clearButtons.length) {
      status.hidden = true;
      status.innerHTML = '';
      return;
    }
    status.hidden = false;
    status.innerHTML = `${clearButtons
      .map(({ key, value }) => `<button type="button" data-clear="${key}">${value} <span aria-hidden="true">×</span></button>`)
      .join('')}<span>${count} résultat${count > 1 ? 's' : ''}</span>`;
  };
  const applyFilters = () => {
    let visibleCount = 0;
    list.querySelectorAll('.shop-item').forEach((article) => {
      const item = items.find((entry) => entry.id === article.dataset.id);
      const visible = item && matchesFilters(item);
      article.hidden = !visible;
      if (visible) visibleCount++;
    });
    const empty = list.querySelector('.shop-empty');
    if (empty) empty.remove();
    if (!visibleCount) {
      list.insertAdjacentHTML('beforeend', '<p class="shop-empty">Aucun résultat.</p>');
    }
    renderStatus(visibleCount);
  };
  const createFilters = () => {
    const types = [...new Set(items.map((item) => item.type).filter(Boolean))].sort((a, b) =>
      a.localeCompare(b, 'fr')
    );
    list.innerHTML = `<div class="filter-tools shop-tools"><button class="filter-toggle shop-filter-toggle" type="button" aria-label="Filtrer la boutique" aria-controls="shop-filters" aria-expanded="false"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M1 2h10L7 6.4V10L5 11V6.4Z"/></svg><span>Filtrer</span></button><section class="filter-panel shop-filters" id="shop-filters" aria-label="Filtres de la boutique" hidden><label>Type<select name="type"><option value="">Tous</option>${types.map((value) => `<option value="${value}">${typeLabel(value)}</option>`).join('')}</select></label><label>Recherche<input name="recherche" type="search" autocomplete="off" placeholder="Artiste, magazine, titre"></label><button class="shop-reset" type="button" data-reset="all">Réinitialiser</button></section></div><div class="shop-filter-status" aria-live="polite" hidden></div>${items.map((item) => `<article class="shop-item" data-id="${item.id}"><header class="shop-meta"><strong>${item.categorie}</strong><span>${item.artiste}</span><span>${item.date}</span></header><p class="shop-description">${item.description}</p><a class="buy-button" href="${SUMUP_PAYMENT_URL}" target="_blank" rel="noopener noreferrer">Acheter <span aria-hidden="true">🛒</span></a><div class="shop-images">${item.images.map((image, index) => `<img src="${image}" alt="${item.categorie} ${item.artiste} — vue ${index + 1}" loading="lazy" decoding="async">`).join('')}</div></article>`).join('')}`;
    const toggle = list.querySelector('.shop-filter-toggle');
    const panel = list.querySelector('.shop-filters');
    const status = list.querySelector('.shop-filter-status');
    const reset = list.querySelector('[data-reset]');
    const closeFilters = () => {
      panel.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    };
    const syncFromState = () => {
      panel.querySelector('[name="type"]').value = state.type;
      panel.querySelector('[name="recherche"]').value = state.recherche;
    };
    const isInsideFilter = (target) =>
      target instanceof Node && (panel.contains(target) || toggle.contains(target));

    toggle.addEventListener('click', () => {
      panel.hidden = !panel.hidden;
      toggle.setAttribute('aria-expanded', String(!panel.hidden));
      if (!panel.hidden) panel.querySelector('select,input').focus();
    });
    panel.addEventListener('input', (event) => {
      if (!event.target.name) return;
      state[event.target.name] = event.target.value;
      applyFilters();
    });
    panel.addEventListener('change', (event) => {
      if (!event.target.name) return;
      state[event.target.name] = event.target.value;
      applyFilters();
    });
    status.addEventListener('click', (event) => {
      const button = event.target.closest('[data-clear]');
      if (!button) return;
      state[button.dataset.clear] = '';
      syncFromState();
      applyFilters();
    });
    reset.addEventListener('click', () => {
      state.type = '';
      state.recherche = '';
      syncFromState();
      applyFilters();
    });
    document.addEventListener('pointerdown', (event) => {
      if (!panel.hidden && !isInsideFilter(event.target)) closeFilters();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !panel.hidden) {
        closeFilters();
        toggle.focus();
      }
    });
    applyFilters();
  };
  fetch('data/shop.json')
    .then((response) => {
      if (!response.ok) throw new Error('Boutique indisponible');
      return response.json();
    })
    .then((data) => {
      items = data;
      createFilters();
    })
    .catch(() => {
      list.innerHTML = '<p class="load-error">Boutique indisponible.</p>';
    });
})();
