/* date.js — Dynamic footer dates */

// Current year
const currentYearEl = document.getElementById('currentYear');
if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
}

// Last modified date
const lastModifiedEl = document.getElementById('lastModified');
if (lastModifiedEl) {
    lastModifiedEl.textContent = document.lastModified;
}


/* navigation.js — Responsive hamburger menu toggle */

const hamburgerBtn = document.getElementById('hamburgerBtn');
const mainNav = document.getElementById('mainNav');

hamburgerBtn.addEventListener('click', () => {
    const isOpen = hamburgerBtn.classList.toggle('open');
    mainNav.classList.toggle('open');
    hamburgerBtn.setAttribute('aria-expanded', isOpen);
});

// Close nav when a link is clicked (mobile)
mainNav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('open');
        mainNav.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
    });
});


const courses = [
    {
        subject: 'CSE',
        number: 110,
        title: 'Introduction to Programming',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.',
        technology: ['Python'],
        completed: true
    },
    {
        subject: 'WDD',
        number: 130,
        title: 'Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course introduces students to the World Wide Web and to careers in web site design and development.',
        technology: ['HTML', 'CSS'],
        completed: true
    },
    {
        subject: 'CSE',
        number: 111,
        title: 'Programming with Functions',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions written by others.',
        technology: ['Python'],
        completed: true
    },
    {
        subject: 'CSE',
        number: 210,
        title: 'Programming with Classes',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce the notion of classes and objects. It will present encapsulation at a conceptual level.',
        technology: ['C#'],
        completed: false
    },
    {
        subject: 'WDD',
        number: 131,
        title: 'Dynamic Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience in Web Fundamentals and Programming. Students will learn to create dynamic websites.',
        technology: ['HTML', 'CSS', 'JavaScript'],
        completed: true
    },
    {
        subject: 'WDD',
        number: 231,
        title: 'Frontend Web Development I',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience with dynamic web fundamentals and programming. Students will focus on user interactions with the Document Object Model (DOM) events.',
        technology: ['HTML', 'CSS', 'JavaScript'],
        completed: false
    }
];


const coursesList = document.getElementById('coursesList');
const creditsCount = document.getElementById('creditsCount');
const filterButtons = document.querySelectorAll('.filter-btn');


function renderCourses(filter = 'all') {
    const filtered = filter === 'all'
        ? courses
        : courses.filter(c => c.subject === filter);

    coursesList.innerHTML = '';

    filtered.forEach(course => {
        const div = document.createElement('div');
        div.className = `course-item ${course.completed ? 'completed' : 'not-completed'}`;
        div.textContent = `${course.subject} ${course.number}`;
        div.title = `${course.title} — ${course.credits} credits${course.completed ? ' ✓ Completed' : ''}`;
        coursesList.appendChild(div);
    });

    const totalCredits = filtered.reduce((sum, course) => sum + course.credits, 0);
    creditsCount.textContent = totalCredits;
}

filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {

        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        renderCourses(btn.dataset.filter);
    });
});

renderCourses('all');