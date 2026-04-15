// contact.js — Contact & Favorites page entry point
import { initTheme, setTheme, getTheme, getFavorites, removeFavorite } from './storage.js';
import { initNavToggle, setActiveNav, formatDuration } from './ui.js';
import { openModal } from './modal.js';

const themeToggle = document.getElementById('theme-toggle');
const favGrid = document.getElementById('favorites-grid');
const favCount = document.getElementById('fav-count');
const clearFavsBtn = document.getElementById('clear-favorites');

// ── Favorites rendering ───────────────────────────────────────────────────────

function renderFavorites() {
  const favs = getFavorites();
  favCount.textContent = favs.length;

  if (favs.length === 0) {
    favGrid.innerHTML = '<p class="empty-msg">Vous n\'avez pas encore de morceaux favoris.<br>Explorez la musique et cliquez sur ♡ pour en ajouter !</p>';
    return;
  }

  favGrid.innerHTML = '';
  favs.forEach(track => {
    const card = document.createElement('article');
    card.className = 'fav-card';
    card.innerHTML = `
      <img src="${track.album?.cover_medium || 'images/placeholder.svg'}"
           alt="Pochette de ${track.title}"
           loading="lazy" class="fav-cover" width="80" height="80">
      <div class="fav-info">
        <h3 class="fav-title">${track.title}</h3>
        <p class="fav-artist">${track.artist?.name || 'Artiste inconnu'}</p>
        <p class="fav-album">${track.album?.title || ''}</p>
        <p class="fav-duration">${formatDuration(track.duration)}</p>
      </div>
      <div class="fav-actions">
        <button class="btn-play-modal" aria-label="Écouter ${track.title}">▶ Écouter</button>
        <button class="btn-remove-fav" data-id="${track.id}" aria-label="Retirer ${track.title} des favoris">✕ Retirer</button>
      </div>`;

    card.querySelector('.btn-play-modal').addEventListener('click', () => openModal(track));
    card.querySelector('.btn-remove-fav').addEventListener('click', () => {
      removeFavorite(track.id);
      renderFavorites();
    });

    favGrid.appendChild(card);
  });
}

// Expose for modal.js to call after favorite toggle
window.refreshFavorites = renderFavorites;

// ── Theme ─────────────────────────────────────────────────────────────────────

function initThemeToggle() {
  const current = initTheme();
  themeToggle.textContent = current === 'dark' ? '☀️' : '🌙';
  themeToggle.addEventListener('click', () => {
    const next = getTheme() === 'dark' ? 'light' : 'dark';
    setTheme(next);
    themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
  });
}

// ── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  setActiveNav();
  initThemeToggle();
  renderFavorites();

  clearFavsBtn?.addEventListener('click', () => {
    if (confirm('Supprimer tous les favoris ?')) {
      localStorage.removeItem('soundpulse_favorites');
      renderFavorites();
    }
  });

  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
