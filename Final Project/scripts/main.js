// main.js — Index page entry point
import { getCharts, searchTracks } from './api.js';
import { createTrackCard, showError, showLoader, showEmpty, initNavToggle, setActiveNav } from './ui.js';
import { initTheme, setTheme, getTheme, isFavorite, addFavorite, removeFavorite } from './storage.js';
import { openModal } from './modal.js';

const grid = document.getElementById('charts-grid');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const themeToggle = document.getElementById('theme-toggle');
const sectionTitle = document.getElementById('section-title');

function handleCardClick(track) {
  openModal(track);
}

function handleFavToggle(e, track) {
  e.stopPropagation();
  const btn = e.currentTarget;
  const id = Number(btn.dataset.id);
  if (isFavorite(id)) {
    removeFavorite(id);
    btn.textContent = '♡';
    btn.classList.remove('active');
    btn.setAttribute('aria-label', 'Ajouter aux favoris');
    btn.title = 'Ajouter aux favoris';
  } else {
    addFavorite(track);
    btn.textContent = '♥';
    btn.classList.add('active');
    btn.setAttribute('aria-label', 'Retirer des favoris');
    btn.title = 'Retirer des favoris';
  }
}

function renderTracks(tracks) {
  grid.innerHTML = '';
  if (!tracks || tracks.length === 0) {
    showEmpty(grid);
    return;
  }
  tracks.forEach(track => {
    const card = createTrackCard(track, true, isFavorite(track.id));
    card.querySelector('.card-click-area').addEventListener('click', () => handleCardClick(track));
    const favBtn = card.querySelector('.btn-fav-icon');
    if (favBtn) favBtn.addEventListener('click', e => handleFavToggle(e, track));
    grid.appendChild(card);
  });
}

async function loadCharts() {
  showLoader(grid);
  try {
    const tracks = await getCharts();
    sectionTitle.textContent = 'Tendances du moment';
    renderTracks(tracks);
  } catch (err) {
    console.error(err);
    showError(grid, 'Impossible de charger les tendances. Vérifiez votre connexion et réessayez.');
  }
}

async function handleSearch(e) {
  e.preventDefault();
  const query = searchInput.value.trim();
  if (!query) return;
  sectionTitle.textContent = `Résultats pour « ${query} »`;
  showLoader(grid);
  try {
    const tracks = await searchTracks(query);
    renderTracks(tracks);
  } catch (err) {
    console.error(err);
    showError(grid, 'La recherche a échoué. Réessayez dans quelques secondes.');
  }
}

function initThemeToggle() {
  const current = initTheme();
  themeToggle.textContent = current === 'dark' ? '☀️' : '🌙';
  themeToggle.setAttribute('aria-label', current === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre');

  themeToggle.addEventListener('click', () => {
    const next = getTheme() === 'dark' ? 'light' : 'dark';
    setTheme(next);
    themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-label', next === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  setActiveNav();
  initThemeToggle();
  searchForm.addEventListener('submit', handleSearch);
  loadCharts();

  // Footer year
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
