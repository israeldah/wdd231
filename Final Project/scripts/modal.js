// modal.js — Accessible modal module

import { isFavorite, addFavorite, removeFavorite } from './storage.js';

const modal = document.getElementById('track-modal');
const modalContent = modal?.querySelector('.modal-content');
let currentAudio = null;

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function openModal(track) {
  if (!modal) return;

  const fav = isFavorite(track.id);

  modal.innerHTML = `
    <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button class="modal-close" aria-label="Fermer">&times;</button>
      <div class="modal-body">
        <img src="${track.album?.cover_big || track.album?.cover_medium || 'images/placeholder.svg'}"
             alt="Pochette de ${track.album?.title || 'album'}"
             class="modal-cover">
        <div class="modal-info">
          <h2 id="modal-title">${track.title}</h2>
          <p class="modal-artist"><strong>Artiste :</strong> ${track.artist?.name || 'Inconnu'}</p>
          <p class="modal-album"><strong>Album :</strong> ${track.album?.title || 'Inconnu'}</p>
          <p class="modal-duration"><strong>Durée :</strong> ${formatDuration(track.duration)}</p>
          ${track.rank ? `<p class="modal-rank"><strong>Popularité :</strong> ${track.rank.toLocaleString()}</p>` : ''}
          <div class="modal-actions">
            ${track.preview ? `
              <audio id="modal-audio" controls aria-label="Prévisualisation 30 secondes">
                <source src="${track.preview}" type="audio/mpeg">
                Votre navigateur ne supporte pas l'audio.
              </audio>
            ` : '<p class="no-preview">Aucune prévisualisation disponible.</p>'}
            <button class="btn-favorite ${fav ? 'active' : ''}" data-id="${track.id}" aria-label="${fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}">
              ${fav ? '♥ Dans les favoris' : '♡ Ajouter aux favoris'}
            </button>
          </div>
        </div>
      </div>
    </div>`;

  modal.classList.add('open');
  modal.removeAttribute('hidden');
  document.body.style.overflow = 'hidden';

  // Focus trap — focus close button
  modal.querySelector('.modal-close').focus();

  // Close handlers
  modal.querySelector('.modal-close').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  // Favorite toggle
  modal.querySelector('.btn-favorite').addEventListener('click', function () {
    const id = Number(this.dataset.id);
    if (isFavorite(id)) {
      removeFavorite(id);
      this.textContent = '♡ Ajouter aux favoris';
      this.classList.remove('active');
      this.setAttribute('aria-label', 'Ajouter aux favoris');
    } else {
      addFavorite(track);
      this.textContent = '♥ Dans les favoris';
      this.classList.add('active');
      this.setAttribute('aria-label', 'Retirer des favoris');
    }
    // Refresh favorites panel if on contact page
    if (typeof window.refreshFavorites === 'function') window.refreshFavorites();
  });

  // Keyboard trap
  modal.addEventListener('keydown', handleKeyDown);
}

export function closeModal() {
  if (!modal) return;
  const audio = modal.querySelector('#modal-audio');
  if (audio) audio.pause();
  modal.classList.remove('open');
  modal.setAttribute('hidden', '');
  document.body.style.overflow = '';
  modal.removeEventListener('keydown', handleKeyDown);
}

function handleKeyDown(e) {
  if (e.key === 'Escape') closeModal();
  // Basic focus trap
  if (e.key === 'Tab') {
    const focusable = modal.querySelectorAll('button, audio, a[href], [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }
}
