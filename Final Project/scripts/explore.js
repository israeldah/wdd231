// explore.js — Explore page entry point
import { getGenres, getTracksByGenre, getCharts } from './api.js';
import { createTrackCard, showError, showLoader, showEmpty, initNavToggle, setActiveNav } from './ui.js';
import { initTheme, setTheme, getTheme, isFavorite, addFavorite, removeFavorite } from './storage.js';
import { openModal } from './modal.js';

const genreList = document.getElementById('genre-list');
const resultsGrid = document.getElementById('results-grid');
const sortSelect = document.getElementById('sort-select');
const filterInput = document.getElementById('filter-input');
const themeToggle = document.getElementById('theme-toggle');
const resultsTitle = document.getElementById('results-title');

let allTracks = [];   // raw data
let activeGenreId = null;

// ── Rendering ────────────────────────────────────────────────────────────────

function getFilteredSorted() {
  const query = filterInput.value.trim().toLowerCase();
  const sortVal = sortSelect.value;

  let tracks = allTracks
    .filter(t => t.title && t.artist && t.album && t.duration)   // ensure required fields
    .filter(t =>
      !query ||
      t.title.toLowerCase().includes(query) ||
      t.artist.name.toLowerCase().includes(query) ||
      t.album.title.toLowerCase().includes(query)
    );

  // Sort using .sort()
  tracks = tracks.sort((a, b) => {
    if (sortVal === 'title-asc')  return a.title.localeCompare(b.title);
    if (sortVal === 'title-desc') return b.title.localeCompare(a.title);
    if (sortVal === 'duration-asc')  return a.duration - b.duration;
    if (sortVal === 'duration-desc') return b.duration - a.duration;
    if (sortVal === 'artist-asc')  return a.artist.name.localeCompare(b.artist.name);
    if (sortVal === 'artist-desc') return b.artist.name.localeCompare(a.artist.name);
    return 0;
  });

  return tracks;
}

function renderTracks() {
  const tracks = getFilteredSorted();
  resultsGrid.innerHTML = '';

  if (tracks.length === 0) {
    showEmpty(resultsGrid, 'Aucun morceau ne correspond à votre recherche.');
    return;
  }

  // Use .map() to build cards, then append
  tracks.map(track => {
    const card = createTrackCard(track, true, isFavorite(track.id));
    card.querySelector('.card-click-area').addEventListener('click', () => openModal(track));
    const favBtn = card.querySelector('.btn-fav-icon');
    if (favBtn) {
      favBtn.addEventListener('click', e => {
        e.stopPropagation();
        const id = Number(favBtn.dataset.id);
        if (isFavorite(id)) {
          removeFavorite(id);
          favBtn.textContent = '♡';
          favBtn.classList.remove('active');
        } else {
          addFavorite(track);
          favBtn.textContent = '♥';
          favBtn.classList.add('active');
        }
      });
    }
    return card;
  }).forEach(card => resultsGrid.appendChild(card));
}

// ── Genre tabs ────────────────────────────────────────────────────────────────

async function loadGenre(genreId, genreName) {
  activeGenreId = genreId;
  resultsTitle.textContent = genreName === 'Top Charts' ? 'Top Charts' : `Genre : ${genreName}`;
  showLoader(resultsGrid);
  filterInput.value = '';
  try {
    allTracks = genreId === 0 ? await getCharts() : await getTracksByGenre(genreId);
    renderTracks();
  } catch (err) {
    console.error(err);
    showError(resultsGrid, 'Impossible de charger les morceaux. Réessayez plus tard.');
  }
}

async function buildGenreTabs() {
  genreList.innerHTML = '<li><button class="genre-tab loading">Chargement…</button></li>';
  try {
    const genres = await getGenres();

    // Add "Top Charts" first
    const allGenres = [{ id: 0, name: 'Top Charts' }, ...genres.slice(0, 10)];

    genreList.innerHTML = allGenres
      .map(g => `<li><button class="genre-tab" data-id="${g.id}" data-name="${g.name}">${g.name}</button></li>`)
      .join('');

    genreList.querySelectorAll('.genre-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        genreList.querySelectorAll('.genre-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        loadGenre(Number(btn.dataset.id), btn.dataset.name);
      });
    });

    // Load default (Top Charts)
    genreList.querySelector('.genre-tab').classList.add('active');
    loadGenre(0, 'Top Charts');

  } catch (err) {
    genreList.innerHTML = '<li><span class="error-msg">Erreur de chargement des genres.</span></li>';
    showError(resultsGrid, 'Impossible de charger les genres.');
  }
}

// ── Init ──────────────────────────────────────────────────────────────────────

function initThemeToggle() {
  const current = initTheme();
  themeToggle.textContent = current === 'dark' ? '☀️' : '🌙';

  themeToggle.addEventListener('click', () => {
    const next = getTheme() === 'dark' ? 'light' : 'dark';
    setTheme(next);
    themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  setActiveNav();
  initThemeToggle();
  buildGenreTabs();

  sortSelect.addEventListener('change', renderTracks);
  filterInput.addEventListener('input', renderTracks);

  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
