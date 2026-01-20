// Product Data
const PRODUCTS = [
    {
        id: 1,
        name: "Aurum Classic Watch",
        price: 249.00,
        category: "Watches",
        image: "assets/products/watch.png",
        isNew: true
    },
    {
        id: 2,
        name: "Heritage Leather Bag",
        price: 320.00,
        category: "Accessories",
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1469&auto=format&fit=crop", // Fallback for failed image gen
        isNew: true
    },
    {
        id: 3,
        name: "Nordic Desk Lamp",
        price: 185.00,
        category: "Home Decor",
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=1374&auto=format&fit=crop",
        isNew: false
    },
    {
        id: 4,
        name: "Minimalist Wall Clock",
        price: 95.00,
        category: "Home Decor",
        image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?q=80&w=1470&auto=format&fit=crop",
        isNew: false
    }
];

// Cart State
let cart = JSON.parse(localStorage.getItem('aurum_cart')) || [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    updateCartUI();

    // Inject featured products if on home page
    const featuredGrid = document.getElementById('featured-grid');
    if (featuredGrid) {
        renderProducts(PRODUCTS.slice(0, 4), featuredGrid);
    }

    // Inject all products if on shop page
    const shopGrid = document.getElementById('shop-grid');
    if (shopGrid) {
        renderProducts(PRODUCTS, shopGrid);
        setupFilters();
    }

    setupAnimations();
    setupCartToggle();
});

// Render Products
function renderProducts(items, container) {
    container.innerHTML = items.map(product => `
        <div class="product-card reveal" onclick="location.href='product.html?id=${product.id}'">
            <div class="product-img">
                <img src="${product.image}" alt="${product.name}">
                <div class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${product.id})">
                    Add to Cart
                </div>
            </div>
            <div class="product-info">
                <div>
                    <div class="product-category">${product.category}</div>
                    <div class="product-name">${product.name}</div>
                </div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
            </div>
        </div>
    `).join('');

    // Refresh animations for new elements
    setupAnimations();
}

// Cart Logic
function addToCart(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartUI();
    showToast(`${product.name} added to cart`);
}

function saveCart() {
    localStorage.setItem('aurum_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const counts = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
    counts.forEach(c => c.textContent = totalItems);
}

// Visual feedback
function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.cssText = `
        position: fixed; bottom: 2rem; right: 2rem;
        background: #111; color: #fff; padding: 1rem 2rem;
        z-index: 10000; border-radius: 4px;
        animation: slideIn 0.3s forwards;
    `;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Scroll Animations
function setupAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(el => observer.observe(el));
}

// Simple Shop Filters
function setupFilters() {
    const checkboxes = document.querySelectorAll('.filter-list input');
    checkboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            const activeCats = Array.from(checkboxes)
                .filter(c => c.checked)
                .map(c => c.value);

            const filtered = activeCats.length === 0
                ? PRODUCTS
                : PRODUCTS.filter(p => activeCats.includes(p.category.toLowerCase()));

            renderProducts(filtered, document.getElementById('shop-grid'));
        });
    });
}
