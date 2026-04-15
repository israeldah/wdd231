// storage.js — localStorage module

const FAVORITES_KEY = 'soundpulse_favorites';
const THEME_KEY = 'soundpulse_theme';

export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  } catch {
    return [];
  }
}

export function addFavorite(track) {
  const favs = getFavorites();
  if (!favs.find(f => f.id === track.id)) {
    favs.push(track);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  }
}

export function removeFavorite(trackId) {
  const favs = getFavorites().filter(f => f.id !== trackId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
}

export function isFavorite(trackId) {
  return getFavorites().some(f => f.id === trackId);
}

export function getTheme() {
  return localStorage.getItem(THEME_KEY) || 'light';
}

export function setTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
  document.documentElement.setAttribute('data-theme', theme);
}

export function initTheme() {
  const saved = getTheme();
  document.documentElement.setAttribute('data-theme', saved);
  return saved;
}
