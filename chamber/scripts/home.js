
document.getElementById('currentYear').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = document.lastModified;

/* ── Hamburger menu ── */
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mainNav      = document.getElementById('mainNav');

hamburgerBtn.addEventListener('click', () => {
    const isOpen = hamburgerBtn.classList.toggle('open');
    mainNav.classList.toggle('open');
    hamburgerBtn.setAttribute('aria-expanded', isOpen);
});

mainNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('open');
        mainNav.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
    });
});

/* ── Dark / Light theme toggle ── */
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = themeToggle.querySelector('.theme-icon');

function setTheme(mode) {
    document.documentElement.setAttribute('data-theme', mode);
    themeIcon.textContent = mode === 'dark' ? '☀️' : '◐';
    localStorage.setItem('chamber-theme', mode);
}

setTheme(localStorage.getItem('chamber-theme') || 'light');

themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
});

/* ============================================================
   WEATHER  –  Yamoussoukro: 6.8276°N, 5.2893°W
   Uses two OpenWeatherMap endpoints:
     • /weather   → current conditions
     • /forecast  → 3-hour step data → derive 3-day forecast
   ============================================================ */

const WEATHER_KEY     = '1a28de2444c6be74f551dc4b0b0f1ad1';
const LAT             = 6.8276;
const LON             = -5.2893;
const CURRENT_URL     = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=metric&appid=${WEATHER_KEY}`;
const FORECAST_URL    = `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=metric&cnt=24&appid=${WEATHER_KEY}`;
const ICON_BASE       = 'https://openweathermap.org/img/wn/';

/* Short weekday labels in French */
const DAY_NAMES = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

async function loadWeather() {
    try {
        const [curRes, fcRes] = await Promise.all([
            fetch(CURRENT_URL),
            fetch(FORECAST_URL)
        ]);

        if (!curRes.ok) throw new Error(await curRes.text());
        if (!fcRes.ok)  throw new Error(await fcRes.text());

        const cur = await curRes.json();
        const fc  = await fcRes.json();

        /* ── Current conditions ── */
        document.getElementById('weather-temp').innerHTML =
            `${Math.round(cur.main.temp)}&deg;C`;
        document.getElementById('weather-desc').textContent =
            cur.weather[0].description;
        document.getElementById('weather-humidity').textContent =
            `Humidité : ${cur.main.humidity}%`;
        document.getElementById('weather-wind').textContent =
            `Vent : ${Math.round(cur.wind.speed * 3.6)} km/h`;

        const icon = document.getElementById('weather-icon');
        icon.src = `${ICON_BASE}${cur.weather[0].icon}@2x.png`;
        icon.alt = cur.weather[0].description;

        /* 3-day forecast */
        const todayStr = new Date().toISOString().slice(0, 10);
        const byDay    = {};

        fc.list.forEach(slot => {
            const dateStr = slot.dt_txt.slice(0, 10);
            if (dateStr === todayStr) return;
            if (!byDay[dateStr]) byDay[dateStr] = [];
            byDay[dateStr].push(slot);
        });

        /* Take the first three future days */
        const forecastDays = Object.entries(byDay).slice(0, 3);

        const forecastEl = document.getElementById('weatherForecast');
        forecastEl.innerHTML = '';

        forecastDays.forEach(([dateStr, slots]) => {
            const temps  = slots.map(s => s.main.temp);
            const high   = Math.round(Math.max(...temps));
            const low    = Math.round(Math.min(...temps));

            /* Pick the noon slot icon if available, else first slot */
            const noonSlot = slots.find(s => s.dt_txt.includes('12:00')) || slots[0];
            const fcIcon   = noonSlot.weather[0].icon;
            const fcDesc   = noonSlot.weather[0].description;

            const dayName  = DAY_NAMES[new Date(dateStr + 'T12:00:00').getDay()];

            const day = document.createElement('div');
            day.className = 'forecast-day';
            day.innerHTML = `
                <span class="forecast-label">${dayName}</span>
                <img src="${ICON_BASE}${fcIcon}.png" alt="${fcDesc}" width="40" height="40">
                <span class="forecast-high">${high}&deg;</span>
                <span class="forecast-low">${low}&deg;</span>
            `;
            forecastEl.appendChild(day);
        });

    } catch (err) {
        document.getElementById('weather-desc').textContent = 'Données météo indisponibles.';
        console.error('Weather error:', err);
    }
}


const LEVEL_INFO = {
    3: { label: 'Gold',   cssClass: 'badge-gold'   },
    2: { label: 'Silver', cssClass: 'badge-silver' }
};

async function loadSpotlights() {
    try {
        const res = await fetch('../members.json');
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        const { members } = await res.json();

        const picks = members
            .filter(m => m.membershipLevel >= 2)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);

        const grid = document.getElementById('spotlightsGrid');
        grid.innerHTML = '';

        picks.forEach(m => {
            const { label, cssClass } = LEVEL_INFO[m.membershipLevel];
            const siteDomain = m.website.replace(/^https?:\/\//, '').split('/')[0];

            const card = document.createElement('article');
            card.className = 'spotlight-card';
            card.innerHTML = `
                <img src="../images/${m.image}"
                     alt="Logo de ${m.name}"
                     class="spotlight-img"
                     width="300" height="160">
                <div class="spotlight-body">
                    <div class="spotlight-top">
                        <h3 class="spotlight-name">${m.name}</h3>
                        <span class="member-badge ${cssClass}">${label}</span>
                    </div>
                    <p class="spotlight-address">
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                        </svg>
                        ${m.address}
                    </p>
                    <p class="spotlight-phone">
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
                            <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z"/>
                        </svg>
                        <a href="tel:${m.phone.replace(/\s/g, '')}">${m.phone}</a>
                    </p>
                    <p class="spotlight-website">
                        <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
                            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95a15.65 15.65 0 00-1.38-3.56A8.03 8.03 0 0118.92 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.987 7.987 0 015.08 16zm2.95-8H5.08a7.987 7.987 0 014.33-3.56A15.65 15.65 0 008.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 01-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/>
                        </svg>
                        <a href="${m.website}" target="_blank" rel="noopener noreferrer">${siteDomain}</a>
                    </p>
                </div>
            `;
            grid.appendChild(card);
        });

    } catch (err) {
        console.error('Spotlights error:', err);
    }
}

loadWeather();
loadSpotlights();
