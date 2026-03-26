/* ── Footer ── */
document.getElementById('currentYear').textContent = new Date().getFullYear();
document.getElementById('lastModified').textContent = document.lastModified;

/* ── Hamburger menu ── */
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mainNav = document.getElementById('mainNav');

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
const themeIcon = themeToggle.querySelector('.theme-icon');

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

/* ── Hidden timestamp ── */
document.getElementById('timestamp').value = new Date().toLocaleString('fr-FR');

/* ── Membership modals ── */
document.querySelectorAll('.level-info-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = document.getElementById(btn.dataset.modal);
        if (modal) {
            modal.showModal();
            document.body.style.overflow = 'hidden';
        }
    });
});

document.querySelectorAll('dialog').forEach(modal => {
    modal.classList.add('modal-membership');

    function closeModal() {
        modal.close();
        document.body.style.overflow = '';
    }

    modal.querySelector('.modal-close').addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
});
