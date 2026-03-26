/* ── Footer ── */
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

/* ── Theme toggle ── */
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

/* ── Display submitted form data from URL params ── */
const membershipLabels = {
    np:     'NP – Non Lucratif (Gratuit)',
    bronze: 'Bronze',
    silver: 'Silver',
    gold:   'Gold'
};

const fieldLabels = {
    fname:      'Prénom',
    lname:      'Nom',
    email:      'Adresse e-mail',
    phone:      'Téléphone mobile',
    org:        'Organisation',
    membership: 'Niveau d\'adhésion',
    timestamp:  'Date de soumission'
};

const params    = new URLSearchParams(window.location.search);
const summaryEl = document.getElementById('summaryList');

const displayFields = ['fname', 'lname', 'email', 'phone', 'org', 'membership', 'timestamp'];

displayFields.forEach(key => {
    const raw = params.get(key);
    if (!raw) return;

    const value = key === 'membership' ? (membershipLabels[raw] || raw) : raw;
    const label = fieldLabels[key] || key;

    const dt = document.createElement('dt');
    dt.textContent = label;

    const dd = document.createElement('dd');
    dd.textContent = value;

    summaryEl.appendChild(dt);
    summaryEl.appendChild(dd);
});

/* If no data found (direct navigation), show a notice */
if (summaryEl.children.length === 0) {
    const notice = document.createElement('p');
    notice.textContent = 'Aucune donnée de formulaire trouvée.';
    notice.style.color = 'var(--clr-text-muted)';
    summaryEl.replaceWith(notice);
}
