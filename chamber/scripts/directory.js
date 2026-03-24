/* dates.js — Dynamic footer dates */

const currentYearEl = document.getElementById('currentYear');
if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
}

const lastModifiedEl = document.getElementById('lastModified');
if (lastModifiedEl) {
    lastModifiedEl.textContent = document.lastModified;
}


/* directory.js — Fetch members JSON and display as grid or list */

const membersContainer = document.getElementById('membersContainer');
const gridViewBtn = document.getElementById('gridViewBtn');
const listViewBtn = document.getElementById('listViewBtn');

// Membership level mapping
const levelMap = {
    1: { label: 'Member', cssClass: 'badge-member' },
    2: { label: 'Silver', cssClass: 'badge-silver' },
    3: { label: 'Gold', cssClass: 'badge-gold' }
};

// Fetch and display members
async function loadMembers() {
    try {
        const response = await fetch('../members.json');
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        displayMembers(data.members);
    } catch (error) {
        membersContainer.innerHTML = `<p style="color:var(--clr-accent);padding:1rem;">Unable to load member data. ${error.message}</p>`;
        console.error('Error loading members:', error);
    }
}

// Render member cards
function displayMembers(members) {
    membersContainer.innerHTML = '';

    members.forEach(member => {
        const level = levelMap[member.membershipLevel] || levelMap[1];

        const card = document.createElement('article');
        card.className = 'member-card';

        card.innerHTML = `
            <img src="../images/${member.image}" alt="${member.name}" class="member-card-img" width="400" height="160">
            <div class="member-card-body">
                <div class="member-card-top">
                    <h2 class="member-name">${member.name}</h2>
                    <span class="member-badge ${level.cssClass}">${level.label}</span>
                </div>
                <p class="member-description">${member.description}</p>
                <div class="member-details">
                    <p><strong>Address: </strong>${member.address}</p>
                    <p><strong>Phone: </strong><a href="tel:${member.phone.replace(/\s/g, '')}">${member.phone}</a></p>
                    <p><strong>Website: </strong><a href="${member.website}" target="_blank" rel="noopener noreferrer">${member.website.replace('https://', '')}</a></p>
                </div>
            </div>
        `;

        membersContainer.appendChild(card);
    });
}

// Toggle between grid and list views
gridViewBtn.addEventListener('click', () => {
    membersContainer.classList.remove('list-view');
    gridViewBtn.classList.add('active');
    listViewBtn.classList.remove('active');
    gridViewBtn.setAttribute('aria-pressed', 'true');
    listViewBtn.setAttribute('aria-pressed', 'false');
});

listViewBtn.addEventListener('click', () => {
    membersContainer.classList.add('list-view');
    listViewBtn.classList.add('active');
    gridViewBtn.classList.remove('active');
    listViewBtn.setAttribute('aria-pressed', 'true');
    gridViewBtn.setAttribute('aria-pressed', 'false');
});

// Initialize
loadMembers();


/* navigation.js — Hamburger menu toggle & dark mode */

// ---- Hamburger Menu ----
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mainNav = document.getElementById('mainNav');

hamburgerBtn.addEventListener('click', () => {
    const isOpen = hamburgerBtn.classList.toggle('open');
    mainNav.classList.toggle('open');
    hamburgerBtn.setAttribute('aria-expanded', isOpen);
});

// Close nav on link click (mobile)
mainNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('open');
        mainNav.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
    });
});

// ---- Dark / Light Theme Toggle ----
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');

function setTheme(mode) {
    document.documentElement.setAttribute('data-theme', mode);
    themeIcon.textContent = mode === 'dark' ? '☀️' : '◐';
    localStorage.setItem('chamber-theme', mode);
}

// Load saved theme
const savedTheme = localStorage.getItem('chamber-theme') || 'light';
setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
});