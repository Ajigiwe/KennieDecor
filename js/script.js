// Elements
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const closeMenuBtn = document.getElementById('close-menu-btn');
const mobileLinks = document.querySelectorAll('.mobile-link');
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;
const backToTopBtn = document.getElementById('back-to-top');

// --- Mobile Menu Logic ---
function toggleMenu() {
    if (!mobileMenu) return;
    const isOpen = mobileMenu.classList.contains('translate-x-0');
    if (isOpen) {
        mobileMenu.classList.remove('translate-x-0');
        mobileMenu.classList.add('translate-x-full');
        document.body.style.overflow = 'auto'; // Enable scrolling
    } else {
        mobileMenu.classList.remove('translate-x-full');
        mobileMenu.classList.add('translate-x-0');
        document.body.style.overflow = 'hidden'; // Disable scrolling
    }
}

if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMenu);
if (closeMenuBtn) closeMenuBtn.addEventListener('click', toggleMenu);
mobileLinks.forEach(link => link.addEventListener('click', toggleMenu));

// --- Theme Logic ---
function setTheme(isDark) {
    if (isDark) {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
}

const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    setTheme(true);
} else {
    setTheme(false);
}

if (themeToggle) themeToggle.addEventListener('click', () => {
    const isDark = html.classList.contains('dark');
    setTheme(!isDark);
});

// --- Back to Top Logic ---
if (backToTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.remove('translate-y-20', 'opacity-0');
        } else {
            backToTopBtn.classList.add('translate-y-20', 'opacity-0');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// --- Scroll Animations (Intersection Observer) ---
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));
});

// --- Portfolio Filtering Logic (if present) ---
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => {
                b.classList.remove('active', 'bg-primary', 'text-white', 'border-primary');
                b.classList.add('border-gray-200');
            });
            // Add active to clicked
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');

                // Animate out
                item.style.opacity = '0';
                item.style.transform = 'scale(0.9)';

                setTimeout(() => {
                    if (filter === 'all' || category === filter) {
                        item.classList.remove('hidden');
                        // Animate in
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.classList.add('hidden');
                    }
                }, 300);
            });
        });
    });
}

// --- Lightbox Logic ---
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxDesc = document.getElementById('lightbox-desc');
const lightboxClose = document.getElementById('lightbox-close');

if (lightbox) {
    // Open Lightbox
    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const desc = item.getAttribute('data-description');

            if (img && desc) {
                lightboxImg.src = img.src;
                lightboxImg.alt = img.alt;
                lightboxDesc.textContent = desc;

                lightbox.classList.remove('hidden');
                // Small timeout to allow display:flex to apply before opacity transition
                setTimeout(() => {
                    lightbox.classList.remove('opacity-0');
                    document.body.style.overflow = 'hidden'; // Disable scroll
                }, 10);
            }
        });
    });

    // Close Lightbox Function
    const closeLightbox = () => {
        lightbox.classList.add('opacity-0');
        setTimeout(() => {
            lightbox.classList.add('hidden');
            lightboxImg.src = ''; // Clear source
            document.body.style.overflow = 'auto'; // Enable scroll
        }, 300); // Match transition duration
    };

    // Event Listeners for Closing
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

    // Close on clicking outside image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) {
            closeLightbox();
        }
    });
}
