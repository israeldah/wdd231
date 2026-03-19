
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mainNav = document.getElementById('mainNav');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');
const currentYearEl = document.getElementById('currentYear');
const lastModifiedEl = document.getElementById('lastModified');

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

function setTheme(mode) {
    document.documentElement.setAttribute('data-theme', mode);
    themeIcon.textContent = mode === 'dark' ? '☀️' : '◐';
    localStorage.setItem('theme', mode);
}

const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
});

if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
}

if (lastModifiedEl) {
    const d = new Date(document.lastModified);
    lastModifiedEl.textContent = d.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

function getWeatherEmoji(description) {
    const desc = description.toLowerCase();
    if (desc.includes('thunder') || desc.includes('storm')) return '⛈️';
    if (desc.includes('rain') || desc.includes('drizzle')) return '🌧️';
    if (desc.includes('snow')) return '❄️';
    if (desc.includes('fog') || desc.includes('mist') || desc.includes('haze')) return '🌫️';
    if (desc.includes('cloud') || desc.includes('overcast')) return '☁️';
    if (desc.includes('partly') || desc.includes('few clouds')) return '⛅';
    if (desc.includes('clear') || desc.includes('sun')) return '☀️';
    return '🌤️';
}

const observerOptions = {
    root: null,
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.info-card, .spotlight-card').forEach(card => {
    card.style.animationPlayState = 'paused';
    observer.observe(card);
});
