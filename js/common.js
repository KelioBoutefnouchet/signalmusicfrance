(()=>{
  const page = document.body.dataset.page;
  const header = document.querySelector('[data-header]');
  const footer = document.querySelector('[data-footer]');

  const nav = (href, desktop, mobile, key) =>
    `<a href="${href}"${page === key ? ' aria-current="page"' : ''}>
      <span class="desktop-label">${desktop}</span>
      <span class="mobile-label">${mobile}</span>
    </a>`;

  const isMobile = window.matchMedia('(max-width: 1099px)').matches;

  const mobileNav = {
    archives: {
      left: nav('actualites.html', 'Actualités', 'Actu', 'actualites'),
      right: nav('boutique.html', 'Boutique', 'Shop', 'boutique'),
    },
    actualites: {
      left: nav('boutique.html', 'Boutique', 'Shop', 'boutique'),
      right: nav('contact.html', 'Contact', 'Contact', 'contact'),
    },
    boutique: {
      left: nav('actualites.html', 'Actualités', 'Actu', 'actualites'),
      right: nav('contact.html', 'Contact', 'Contact', 'contact'),
    },
    contact: {
      left: nav('actualites.html', 'Actualités', 'Actu', 'actualites'),
      right: nav('boutique.html', 'Boutique', 'Shop', 'boutique'),
    },
  };

  header.innerHTML = `
    <a class="skip-link" href="#main-content">Aller au contenu</a>
    ${isMobile ? `
      <nav class="nav-left" aria-label="Navigation principale">
        ${mobileNav[page]?.left || nav('actualites.html', 'Actualités', 'Actu', 'actualites')}
      </nav>
      <a class="signal-logo" href="index.html" aria-label="Signal — retour aux archives">
        <img src="assets/logosignal.png" alt="Signal">
      </a>
      <nav class="nav-right" aria-label="Navigation secondaire">
        ${mobileNav[page]?.right || nav('contact.html', 'Contact', 'Contact', 'contact')}
      </nav>
    ` : `
      <nav class="nav-left" aria-label="Navigation principale">
        ${nav('index.html', 'Archives', 'Archives', 'archives')}
        ${nav('actualites.html', 'Actualités', 'Actu', 'actualites')}
      </nav>
      <a class="signal-logo" href="index.html" aria-label="Signal — retour aux archives">
        <img src="assets/logosignal.png" alt="Signal">
      </a>
      <nav class="nav-right" aria-label="Navigation secondaire">
        ${nav('boutique.html', 'Boutique', 'Shop', 'boutique')}
        ${nav('contact.html', 'Contact', 'Contact', 'contact')}
      </nav>
    `}
  `;

  footer.innerHTML = isMobile ? `
    <span class="copyright">SIGNAL MUSIC FRANCE ©</span>
    <time class="clock" aria-label="Heure locale"></time>
  ` : `
    <span class="copyright">SIGNAL MUSIC FRANCE ©</span>
    <time class="clock" aria-label="Heure locale"></time>
    <div class="radio" data-radio>
      <button class="radio-toggle" type="button" aria-label="Lire la radio">
        <span class="radio-light" aria-hidden="true"></span>
        <span class="radio-status">RADIO READY</span>
      </button>
      <button class="radio-mute" type="button">MUTE</button>
    </div>
    <a class="footer-contact" href="contact.html">Contact</a>
  `;

  const clock = footer.querySelector('.clock');

  const tick = () => {
    if (!clock) return;

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const isSmallScreen = window.matchMedia('(max-width: 1099px)').matches;

    clock.textContent = isSmallScreen ? `${hours}:${minutes}` : `${hours}:${minutes}:${seconds}`;
  };

  tick();
  setInterval(tick, 1000);

  document.body.insertAdjacentHTML('beforeend', `
    <dialog class="contact-dialog" aria-labelledby="contact-title">
      <section class="contact-card">
        <button class="contact-close" type="button" aria-label="Fermer le contact">×</button>
        <h1 id="contact-title">Bienvenue sur Signal.</h1>
        <p>Une archive vivante &amp; numérique</p>
        <p>À chaque numéro, un·e artiste invité·e transforme sa galerie personnelle en mémoire collective.</p>
        <p>Explore l’archive numérique, découvre les éditions et commande ton magazine si tu ne peux pas te déplacer sur les lieux de fête et de diffusion.</p>
        <address>
          <a href="mailto:contact.signalmusic@gmail.com">contact.signalmusic@gmail.com</a><br>
          <a href="https://www.instagram.com/signalmusicfrance/" target="_blank" rel="noopener noreferrer">Instagram</a><br>
          <a href="https://www.youtube.com/@signalmusicfrance" target="_blank" rel="noopener noreferrer">YouTube</a>
        </address>
      </section>
    </dialog>
  `);

  const contactDialog = document.querySelector('.contact-dialog');
  const contactClose = contactDialog?.querySelector('.contact-close');

  const closeContactDialog = () => {
    if (contactDialog?.open) {
      contactDialog.close();
    }
  };

  const openContactDialog = (event) => {
    if (!contactDialog) return;
    event.preventDefault();
    contactDialog.showModal();
  };

  document.querySelectorAll('a[href="contact.html"]').forEach((link) => {
    link.addEventListener('click', openContactDialog);
  });

  contactClose?.addEventListener('click', closeContactDialog);
  contactDialog?.addEventListener('click', (event) => {
    if (event.target === contactDialog) {
      closeContactDialog();
    }
  });
})();
