// Initialize Lucide icons
lucide.createIcons();

// Header scroll effect
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Reveal animations on scroll
const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealOnScroll = () => {
    reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const revealTop = el.getBoundingClientRect().top;
        const revealPoint = 100;

        if (revealTop < windowHeight - revealPoint) {
            el.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// Reservation Form Handling
const reservationForm = document.querySelector('.form-container form');
if (reservationForm) {
    reservationForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = reservationForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';

        setTimeout(() => {
            submitBtn.textContent = 'Table Reserved!';
            submitBtn.style.backgroundColor = '#28a745';
            reservationForm.reset();

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                submitBtn.style.backgroundColor = '';
            }, 3000);
        }, 1500);
    });
}

// Menu Category Filtering (Menu Page)
const categoryBtns = document.querySelectorAll('.cat-btn');
const menuItems = document.querySelectorAll('.menu-item');

if (categoryBtns.length > 0) {
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const category = btn.getAttribute('data-category');

            menuItems.forEach(item => {
                if (category === 'all' || item.getAttribute('data-category') === category) {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Mobile Menu Toggle
const mobileToggle = document.querySelector('.mobile-toggle');
if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        alert('Welcome to Gourmet Haven! Our mobile navigation is being prepared.');
    });
}
