(() => {
  const grid = document.querySelector('.archive-grid');
  const dialog = document.querySelector('.lightbox');
  const close = () => dialog.close();
  const state = {
    type: '',
    artiste: '',
    annee: '',
    recherche: '',
  };

  let entries = [];
  let resizeTimer;

  dialog.querySelector('.lightbox-close').addEventListener('click', close);
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) {
      close();
    }
  });

  const normalise = (value) =>
    (value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

  const yearOf = (item) =>
    (String(item.date || '').match(/\b(?:19|20)\d{2}\b/) || [])[0] || '';

  const formatDate = (value) => {
    if (!value) return '';
    if (/^\d{4}$/.test(value)) return value;

    const monthOnly = /^\d{4}-\d{2}$/.test(value);
    const date = new Date(`${monthOnly ? `${value}-01` : value}T00:00:00Z`);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat('fr-FR', {
      ...(monthOnly ? {} : { day: 'numeric' }),
      month: 'numeric',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(date);
  };

  const externalUrl = (url) =>
    /^https?:\/\//i.test(url) ? url : `https://${url}`;

  const caption = (item) =>
    [
      item.type && `<span class="meta-type">${item.type}</span>`,
      item.artiste && `<span class="meta-artist">${item.artiste}</span>`,
      item.titre && `<span class="meta-title">${item.titre}</span>`,
      item.date && `<span class="meta-date">${formatDate(item.date)}</span>`,
      item.duree && `<span class="meta-duration">${item.duree}</span>`,
      item.prix && `<span class="meta-price">${item.prix}</span>`,
      item.credit && `<span class="meta-credit">Crédit : ${item.credit}</span>`,
    ]
      .filter(Boolean)
      .join('');

  const columnsForWidth = (width) => {
    if (width < 768) return 2;
    if (width < 1100) return 3;
    if (width < 1280) return 6;
    return 8;
  };

  const layout = () => {
    const items = [...grid.querySelectorAll('.archive-item:not([hidden])')];

    if (!items.length) {
      grid.style.height = '0px';
      return;
    }

    const width = grid.clientWidth;
    const columns = columnsForWidth(innerWidth);
    const gap = innerWidth < 768 ? 6 : 8;
    const rowGap = innerWidth < 768 ? 36 : 56;
    const columnWidth = (width - gap * (columns - 1)) / columns;
    const heights = Array(columns).fill(0);

    items.forEach((item) => {
      const requested = Number(item.dataset.span) || 1;
      const span = innerWidth < 768 ? 1 : Math.min(requested, 2, columns);
      let bestColumn = 0;
      let bestTop = Infinity;

      for (let column = 0; column <= columns - span; column++) {
        const top = Math.max(...heights.slice(column, column + span));
        if (top < bestTop) {
          bestTop = top;
          bestColumn = column;
        }
      }

      item.style.width = `${columnWidth * span + gap * (span - 1)}px`;
      item.style.transform = `translate(${bestColumn * (columnWidth + gap)}px,${bestTop}px)`;

      const bottom = bestTop + item.offsetHeight + rowGap;
      for (let column = bestColumn; column < bestColumn + span; column++) {
        heights[column] = bottom;
      }
    });

    grid.style.height = `${Math.max(...heights) - rowGap}px`;
  };

  const createFilters = () => {
    const uniqueByLabel = (items) =>
      [...new Map(items.filter(Boolean).map((value) => [normalise(value), value])).values()].sort((a, b) =>
        a.localeCompare(b, 'fr')
      );
    const types = uniqueByLabel(entries.map((item) => item.type));
    const artists = uniqueByLabel(entries.map((item) => item.artiste));
    const years = [...new Set(entries.map(yearOf).filter(Boolean))].sort((a, b) => b - a);

    const archiveTools = document.createElement('div');
    archiveTools.className = 'filter-tools archive-tools';
    archiveTools.innerHTML = `
      <button
        class="filter-toggle archive-filter-toggle"
        type="button"
        aria-label="Filtrer l’archive"
        aria-controls="archive-filters"
        aria-expanded="false"
      >
        <svg viewBox="0 0 12 12" aria-hidden="true">
          <path d="M1 2h10L7 6.4V10L5 11V6.4Z"/>
        </svg>
        <span>Filtrer</span>
      </button>
    `;

    grid.parentNode.insertBefore(archiveTools, grid);

    archiveTools.insertAdjacentHTML(
      'beforeend',
      `
        <section class="filter-panel archive-filters" id="archive-filters" aria-label="Filtres de l’archive" hidden>
          <label>
            Type
            <select name="type">
              <option value="">Tous</option>
              ${types.map((value) => `<option value="${value}">${value}</option>`).join('')}
            </select>
          </label>
          <label>
            Artiste
            <select name="artiste">
              <option value="">Tous</option>
              ${artists.map((value) => `<option value="${value}">${value}</option>`).join('')}
            </select>
          </label>
          <label>
            Année
            <select name="annee">
              <option value="">Toutes</option>
              ${years.map((value) => `<option value="${value}">${value}</option>`).join('')}
            </select>
          </label>
          <label>
            Recherche
            <input name="recherche" type="search" autocomplete="off">
          </label>
        </section>
        <div class="archive-filter-status" aria-live="polite" hidden></div>
      `
    );

    const toggle = document.querySelector('.archive-filter-toggle');
    const panel = document.querySelector('.archive-filters');
    const status = document.querySelector('.archive-filter-status');

    const closeFilters = () => {
      panel.hidden = true;
      toggle.setAttribute('aria-expanded', 'false');
    };

    const isInsideFilter = (target) =>
      target instanceof Node && (panel.contains(target) || toggle.contains(target));

    const renderStatus = (count) => {
      const active = Object.entries(state).filter(([, value]) => value);
      status.hidden = !active.length;
      status.innerHTML =
        active
          .map(
            ([key, value]) =>
              `<button type="button" data-clear="${key}">${
                key === 'recherche' ? `“${value}”` : value
              } <span aria-hidden="true">×</span></button>`
          )
          .join('') + `<span>${count} résultat${count > 1 ? 's' : ''}</span>`;
    };

    const applyFilters = () => {
      let count = 0;

      grid.querySelectorAll('.archive-item').forEach((element, index) => {
        const item = entries[index];
        const haystack = normalise(
          [item.type, item.artiste, item.titre, item.date, item.credit]
            .filter(Boolean)
            .join(' ')
        );
        const visible =
          (!state.type || normalise(item.type) === normalise(state.type)) &&
          (!state.artiste || normalise(item.artiste) === normalise(state.artiste)) &&
          (!state.annee || yearOf(item) === state.annee) &&
          (!state.recherche || haystack.includes(normalise(state.recherche)));

        element.hidden = !visible;
        if (visible) count++;
      });

      renderStatus(count);
      layout();
    };

    toggle.addEventListener('click', () => {
      panel.hidden = !panel.hidden;
      toggle.setAttribute('aria-expanded', String(!panel.hidden));
      if (!panel.hidden) {
        panel.querySelector('select,input').focus();
      }
    });

    panel.addEventListener('input', (event) => {
      if (event.target.name) {
        state[event.target.name] = event.target.value;
        applyFilters();
      }
    });

    panel.addEventListener('change', (event) => {
      if (event.target.name) {
        state[event.target.name] = event.target.value;
        applyFilters();
      }
    });

    status.addEventListener('click', (event) => {
      const button = event.target.closest('[data-clear]');
      if (!button) return;

      const key = button.dataset.clear;
      state[key] = '';
      panel.querySelector(`[name="${key}"]`).value = '';
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
  };

  fetch('data/archive.json')
    .then((response) => {
      if (!response.ok) throw Error('Archive indisponible');
      return response.json();
    })
    .then((items) => {
      entries = items;
      grid.innerHTML = items
        .map((item, index) => {
          const alt = [item.type, item.artiste, item.titre].filter(Boolean).join(' — ');
          const content = `
            <img
              src="${item.image}"
              alt="${alt}"
              ${index < 4 ? 'loading="eager"' : 'loading="lazy"'}
              decoding="async"
            >
            <figcaption>${caption(item)}</figcaption>
          `;

          if (item.comportement === 'external' && item.url) {
            return `
              <figure class="archive-item" data-span="${item.span || 1}">
                <a href="${externalUrl(item.url)}" target="_blank" rel="noopener noreferrer">
                  ${content}
                </a>
              </figure>
            `;
          }

          return `
            <figure class="archive-item" data-span="${item.span || 1}">
              <button
                class="archive-open"
                type="button"
                data-image="${item.image}"
                data-alt="${alt}"
                data-caption="${item.credit || ''}"
              >
                ${content}
              </button>
            </figure>
          `;
        })
        .join('');

      grid.querySelectorAll('.archive-open').forEach((button) =>
        button.addEventListener('click', () => {
          const image = dialog.querySelector('img');
          image.src = button.dataset.image;
          image.alt = button.dataset.alt;
          dialog.querySelector('figcaption').textContent = button.dataset.caption;
          dialog.showModal();
        })
      );

      grid.querySelectorAll('img').forEach((image) => {
        if (!image.complete) {
          image.addEventListener('load', layout, { once: true });
        }
      });

      createFilters();
      layout();
    })
    .catch((error) => {
      grid.innerHTML = `<p class="load-error">${error.message}.</p>`;
    });

  addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layout, 100);
  });
})();
