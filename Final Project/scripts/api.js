// api.js — Deezer API module (uses allorigins CORS proxy)

const PROXY = 'https://api.allorigins.win/get?url=';
const BASE = 'https://api.deezer.com';

async function deezerFetch(endpoint) {
  const url = `${BASE}${endpoint}`;
  const res = await fetch(`${PROXY}${encodeURIComponent(url)}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const wrapper = await res.json();
  return JSON.parse(wrapper.contents);
}

export async function getCharts() {
  const data = await deezerFetch('/chart/0/tracks?limit=25');
  return data.data;
}

export async function searchTracks(query) {
  const data = await deezerFetch(`/search?q=${encodeURIComponent(query)}&limit=20`);
  return data.data;
}

export async function getGenres() {
  const data = await deezerFetch('/genre');
  // Remove genre id=0 (All) to keep list clean
  return data.data.filter(g => g.id !== 0);
}

export async function getTracksByGenre(genreId) {
  // Get artists for the genre, then chart tracks
  const data = await deezerFetch(`/genre/${genreId}/artists?limit=6`);
  if (!data.data || data.data.length === 0) return [];
  // Fetch top tracks for first 3 artists
  const artists = data.data.slice(0, 3);
  const trackPromises = artists.map(a => deezerFetch(`/artist/${a.id}/top?limit=6`));
  const results = await Promise.all(trackPromises);
  return results.flatMap(r => r.data || []);
}

export async function getTrack(trackId) {
  return await deezerFetch(`/track/${trackId}`);
}
