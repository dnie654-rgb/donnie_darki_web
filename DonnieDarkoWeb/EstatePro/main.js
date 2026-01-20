// Property Data
const PROPERTIES = [
    {
        id: 1,
        title: "Modern Glass Villa",
        price: 5250000,
        location: "Beverly Hills, CA",
        beds: 5,
        baths: 6,
        sqft: 6500,
        type: "Villa",
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=1471&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Skyline Penthouse",
        price: 3100000,
        location: "Manhattan, NY",
        beds: 3,
        baths: 4,
        sqft: 3200,
        type: "Penthouse",
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1470&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "Coastal Zen Retreat",
        price: 8900000,
        location: "Malibu, CA",
        beds: 6,
        baths: 8,
        sqft: 9200,
        type: "Modern Mansion",
        image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1470&auto=format&fit=crop"
    },
    {
        id: 4,
        title: "Aspen Snow Manor",
        price: 4750000,
        location: "Aspen, CO",
        beds: 4,
        baths: 5,
        sqft: 5100,
        type: "Villa",
        image: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=1470&auto=format&fit=crop"
    },
    {
        id: 5,
        title: "Miami Beach Estate",
        price: 12500000,
        location: "Miami, FL",
        beds: 7,
        baths: 10,
        sqft: 14000,
        type: "Modern Mansion",
        image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1470&auto=format&fit=crop"
    }
];

// Initialize UI
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    setupAnimations();

    // Injected featured listings
    const featuredGrid = document.getElementById('featured-grid');
    if (featuredGrid) {
        renderProperties(PROPERTIES.slice(0, 3), featuredGrid);
    }

    // Listing page grid
    const listingsGrid = document.getElementById('listings-grid');
    if (listingsGrid) {
        renderProperties(PROPERTIES, listingsGrid);
        setupSearchFilters();
    }
});

function renderProperties(items, container) {
    container.innerHTML = items.map(p => `
        <div class="property-card reveal" onclick="location.href='property.html?id=${p.id}'">
            <div class="property-img">
                <img src="${p.image}" alt="${p.title}">
                <div class="property-tag">${p.type}</div>
            </div>
            <div class="property-info">
                <div class="property-price">$${p.price.toLocaleString()}</div>
                <h3 class="property-title">${p.title}</h3>
                <div class="property-location"><i data-lucide="map-pin"></i> ${p.location}</div>
                <div class="property-specs">
                    <div class="spec-item"><i data-lucide="bed"></i> ${p.beds} Beds</div>
                    <div class="spec-item"><i data-lucide="bath"></i> ${p.baths} Baths</div>
                    <div class="spec-item"><i data-lucide="maximize"></i> ${p.sqft.toLocaleString()} sqft</div>
                </div>
            </div>
        </div>
    `).join('');

    lucide.createIcons(); // Re-init icons for new cards
    setupAnimations(); // Re-init animations
}

function setupAnimations() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(el => observer.observe(el));
}

function setupSearchFilters() {
    const rangeInput = document.getElementById('price-range');
    const rangeValue = document.getElementById('range-value');

    if (rangeInput) {
        rangeInput.addEventListener('input', (e) => {
            const val = e.target.value;
            rangeValue.textContent = `$${parseInt(val).toLocaleString()}`;

            const filtered = PROPERTIES.filter(p => p.price <= val);
            renderProperties(filtered, document.getElementById('listings-grid'));
        });
    }

    const typeFilters = document.querySelectorAll('.filter-group input[type="checkbox"]');
    typeFilters.forEach(cb => {
        cb.addEventListener('change', () => {
            const activeTypes = Array.from(typeFilters)
                .filter(c => c.checked)
                .map(c => c.value.toLowerCase());

            const filtered = activeTypes.length === 0
                ? PROPERTIES
                : PROPERTIES.filter(p => activeTypes.includes(p.type.toLowerCase()));

            renderProperties(filtered, document.getElementById('listings-grid'));
        });
    });
}
