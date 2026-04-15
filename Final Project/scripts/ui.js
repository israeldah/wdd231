// ui.js — Shared UI rendering utilities

export function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Build a track card element.
 * @param {object} track - Deezer track object
 * @param {boolean} showFavBtn - show favorite toggle button
 * @param {boolean} isFav - initial favorite state
 */
export function createTrackCard(track, showFavBtn = false, isFav = false) {
  const card = document.createElement('article');
  card.className = 'track-card';
  card.dataset.id = track.id;

  card.innerHTML = `
    <button class="card-click-area" aria-label="Voir les détails de ${track.title}">
      <img src="${track.album?.cover_medium || 'images/placeholder.svg'}"
           alt="Pochette de ${track.title}"
           loading="lazy"
           class="card-cover"
           width="264" height="264">
      <div class="card-info">
        <h3 class="card-title">${track.title}</h3>
        <p class="card-artist">${track.artist?.name || 'Artiste inconnu'}</p>
        <p class="card-album">${track.album?.title || ''}</p>
        <p class="card-duration">${formatDuration(track.duration)}</p>
      </div>
    </button>
    ${showFavBtn ? `
      <button class="btn-fav-icon ${isFav ? 'active' : ''}" data-id="${track.id}"
              aria-label="${isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}"
              title="${isFav ? 'Retirer des favoris' : 'Ajouter aux favoris'}">
        ${isFav ? '♥' : '♡'}
      </button>` : ''}`;

  return card;
}

export function showError(container, message) {
  container.innerHTML = `<p class="error-msg" role="alert">${message}</p>`;
}

export function showLoader(container) {
  container.innerHTML = `
    <div class="loader" aria-live="polite" aria-label="Chargement en cours">
      <span></span><span></span><span></span>
    </div>`;
}

export function showEmpty(container, message = 'Aucun résultat trouvé.') {
  container.innerHTML = `<p class="empty-msg">${message}</p>`;
}

export function initNavToggle() {
  const toggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  if (!toggle || !navMenu) return;

  toggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });

  // Close nav when a link is clicked (mobile)
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

export function setActiveNav() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#nav-menu a').forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    link.classList.toggle('active', href === path);
  });
}
