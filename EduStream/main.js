// Course Data
const COURSES = [
    {
        id: "ui-ux-design",
        title: "Master UI/UX Design from Scratch",
        category: "Design",
        instructor: "Sarah Jenkins",
        rating: 4.8,
        reviews: 1250,
        price: 89.99,
        image: "https://images.unsplash.com/photo-1559028012-481c04fa702d?q=80&w=1472&auto=format&fit=crop",
        enrolled: 4500,
        progress: 65,
        modules: [
            { id: 1, title: "Introduction to User Experience", lessons: ["What is UX?", "History of Design", "The UX Process"] },
            { id: 2, title: "User Research", lessons: ["User Personas", "Empathy Mapping", "Interview Techniques"] },
            { id: 3, title: "Wireframing & Prototyping", lessons: ["Low-Fi Sketching", "Figma Basics", "Interactive Prototyping"] }
        ]
    },
    {
        id: "fullstack-dev",
        title: "Modern Full-Stack Web Development",
        category: "Development",
        instructor: "Mark Chen",
        rating: 4.9,
        reviews: 2100,
        price: 129.99,
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1472&auto=format&fit=crop",
        enrolled: 8200,
        progress: 10,
        modules: [
            { id: 1, title: "Environment Setup", lessons: ["Installing Node.js", "VS Code Extensions", "Git & GitHub"] },
            { id: 2, title: "Frontend Mastery", lessons: ["Semantic HTML", "CSS Grid & Flexbox", "React Components"] }
        ]
    },
    {
        id: "digital-marketing",
        title: "Digital Marketing Strategy 2026",
        category: "Business",
        instructor: "Elena Rodriguez",
        rating: 4.7,
        reviews: 850,
        price: 59.99,
        image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?q=80&w=1474&auto=format&fit=crop",
        enrolled: 3200,
        progress: 0,
        modules: [
            { id: 1, title: "Foundation", lessons: ["Market Research", "Brand Identity", "SEO Principles"] }
        ]
    },
    {
        id: "data-science",
        title: "Python for Data Science Masterclass",
        category: "Development",
        instructor: "Dr. James Wilson",
        rating: 4.9,
        reviews: 1800,
        price: 149.99,
        image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=1470&auto=format&fit=crop",
        enrolled: 5400,
        progress: 45,
        modules: [
            { id: 1, title: "Python Basics", lessons: ["Syntax & Types", "Control Flow", "Functions"] }
        ]
    }
];

// App State Management
const State = {
    isLoggedIn: localStorage.getItem('edustream_auth') === 'true',
    currentUser: { name: "Riyan", email: "riyan@example.com" },
    userProgress: JSON.parse(localStorage.getItem('edustream_progress')) || {}
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    updateAuthUI();

    // Page Initializations
    if (document.getElementById('featured-courses')) {
        renderCourseGrid(COURSES.slice(0, 3), 'featured-courses');
    }

    if (document.getElementById('catalog-grid')) {
        renderCourseGrid(COURSES, 'catalog-grid');
        setupCatalogFilters();
    }

    if (document.getElementById('dashboard-courses')) {
        initDashboard();
    }

    if (document.getElementById('learning-container')) {
        initLearningApp();
    }
});

function updateAuthUI() {
    const authContainer = document.querySelector('.auth-btns');
    if (!authContainer) return;

    if (State.isLoggedIn) {
        authContainer.innerHTML = `
            <a href="dashboard.html" class="btn btn-secondary btn-sm">Dashboard</a>
            <div style="width: 35px; height: 35px; background: #6366F1; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700;">R</div>
            <a href="#" onclick="logout(); return false;" style="font-size: 0.8rem; color: var(--text-muted);">Sign out</a>
        `;
    } else {
        authContainer.innerHTML = `
            <a href="auth.html" class="btn btn-secondary btn-sm">Log in</a>
            <a href="auth.html" class="btn btn-primary btn-sm">Get Started</a>
        `;
    }
}

function renderCourseGrid(items, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = items.map(course => `
        <div class="course-card" onclick="location.href='course-view.html?id=${course.id}'" style="cursor: pointer;">
            <div class="course-thumb">
                <img src="${course.image}" alt="${course.title}">
            </div>
            <div class="course-body">
                <span class="course-cat">${course.category}</span>
                <h3 class="course-title">${course.title}</h3>
                <div class="course-meta">
                    <span class="rating">
                        <i data-lucide="star" style="width:14px; fill:currentColor;"></i> ${course.rating}
                    </span>
                    <span>${course.instructor}</span>
                </div>
                ${State.isLoggedIn && course.progress > 0 ? `
                    <div class="progress-container">
                        <div class="progress-bar" style="width: ${course.progress}%"></div>
                    </div>
                ` : `
                    <div style="margin-top: 1rem; font-weight: 700; color: var(--primary);">$${course.price}</div>
                `}
            </div>
        </div>
    `).join('');

    lucide.createIcons();
}

function setupCatalogFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const cat = btn.dataset.category;
            const filtered = cat === 'all' ? COURSES : COURSES.filter(c => c.category.toLowerCase() === cat);
            renderCourseGrid(filtered, 'catalog-grid');
        });
    });
}

function initDashboard() {
    const enrolled = COURSES.filter(c => c.progress > 0);
    renderCourseGrid(enrolled, 'dashboard-courses');

    // Update dashboard stats
    const totalProg = enrolled.reduce((acc, c) => acc + c.progress, 0) / enrolled.length;
    document.getElementById('overall-progress').textContent = `${Math.round(totalProg || 0)}%`;
}

function initLearningApp() {
    const params = new URLSearchParams(window.location.search);
    const courseId = params.get('id');
    const course = COURSES.find(c => c.id === courseId) || COURSES[0];

    document.getElementById('course-title-header').textContent = course.title;

    const sidebar = document.getElementById('curriculum-sidebar');
    sidebar.innerHTML = course.modules.map(mod => `
        <div class="module-item">
            <div class="module-title">
                Module ${mod.id}: ${mod.title}
                <i data-lucide="chevron-down" style="width:16px;"></i>
            </div>
            <div class="lessons-list">
                ${mod.lessons.map((lesson, idx) => `
                    <div class="lesson-item ${idx === 0 && mod.id === 1 ? 'active' : ''}" onclick="switchLesson(this, '${lesson}')">
                        <i data-lucide="play-circle"></i>
                        ${lesson}
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');

    lucide.createIcons();
}

function switchLesson(el, title) {
    document.querySelectorAll('.lesson-item').forEach(item => item.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('current-lesson-title').textContent = title;
}

function logout() {
    localStorage.removeItem('edustream_auth');
    location.reload();
}

function login() {
    localStorage.setItem('edustream_auth', 'true');
    location.href = 'dashboard.html';
}
