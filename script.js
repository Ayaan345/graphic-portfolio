// ==========================================
// Smooth Scroll & Navigation
// ==========================================
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scroll for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==========================================
// Mobile Menu Toggle
// ==========================================
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
}

// ==========================================
// 3D Portfolio Carousel - Class Implementation
// ==========================================
class ThreeDCarousel {
    constructor(sectionElement) {
        this.section = sectionElement;
        this.grid = this.section.querySelector('.portfolio-grid');
        this.items = this.section.querySelectorAll('.portfolio-item');
        this.currentIndex = 0;
        this.interval = null;

        if (this.items.length > 0 && this.grid) {
            this.init();
        }
    }

    init() {
        console.log('Initializing carousel for section:', this.section.id, 'with', this.items.length, 'items');

        // Remove reveal classes that interfere with carousel
        this.items.forEach(item => {
            item.classList.remove('reveal-up');
            item.classList.add('revealed'); // Add revealed class to prevent observer interference
        });

        this.createControls();
        this.update();
        this.setupEventListeners();
        this.startAutoPlay();
    }

    createControls() {
        // Create prev/next buttons
        const prevBtn = document.createElement('div');
        prevBtn.className = 'carousel-nav prev-btn';
        prevBtn.innerHTML = '‹';
        prevBtn.setAttribute('aria-label', 'Previous project');

        const nextBtn = document.createElement('div');
        nextBtn.className = 'carousel-nav next-btn';
        nextBtn.innerHTML = '›';
        nextBtn.setAttribute('aria-label', 'Next project');

        // Create indicators
        const indicators = document.createElement('div');
        indicators.className = 'carousel-indicators';

        this.items.forEach((_, index) => {
            const indicator = document.createElement('div');
            indicator.className = 'carousel-indicator';
            indicator.setAttribute('data-index', index);
            indicators.appendChild(indicator);
        });

        this.grid.appendChild(prevBtn);
        this.grid.appendChild(nextBtn);
        this.grid.appendChild(indicators);
    }

    update() {
        this.items.forEach((item, index) => {
            // Remove all position classes
            item.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next');

            const diff = index - this.currentIndex;
            const total = this.items.length;

            // Handle wrapping for circular carousel
            let normalizedDiff = diff;
            if (diff > total / 2) normalizedDiff = diff - total;
            if (diff < -total / 2) normalizedDiff = diff + total;

            // Apply appropriate class based on position
            if (normalizedDiff === 0) {
                item.classList.add('active');
            } else if (normalizedDiff === -1) {
                item.classList.add('prev');
            } else if (normalizedDiff === 1) {
                item.classList.add('next');
            } else if (normalizedDiff === -2) {
                item.classList.add('far-prev');
            } else if (normalizedDiff === 2) {
                item.classList.add('far-next');
            } else if (normalizedDiff < -2) {
                item.classList.add('far-prev');
            } else if (normalizedDiff > 2) {
                item.classList.add('far-next');
            }
        });

        // Update indicators
        const indicators = this.grid.querySelectorAll('.carousel-indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
    }

    setupEventListeners() {
        // Navigation buttons (scoped to this carousel)
        const prevBtn = this.grid.querySelector('.carousel-nav.prev-btn');
        const nextBtn = this.grid.querySelector('.carousel-nav.next-btn');

        if (prevBtn) prevBtn.addEventListener('click', () => this.prevSlide());
        if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());

        // Indicator click handlers
        const indicators = this.grid.querySelectorAll('.carousel-indicator');
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // Click on side items to navigate
        this.items.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                // Don't navigate if clicking on the view project button
                if (e.target.classList.contains('view-project')) {
                    return;
                }

                if (!item.classList.contains('active')) {
                    this.goToSlide(index);
                }
            });
        });

        // Pause auto-play on hover
        this.section.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.section.addEventListener('mouseleave', () => this.startAutoPlay());
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.items.length;
        this.update();
        this.resetAutoPlay();
    }

    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        this.update();
        this.resetAutoPlay();
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.update();
        this.resetAutoPlay();
    }

    startAutoPlay() {
        this.interval = setInterval(() => this.nextSlide(), 5000);
    }

    stopAutoPlay() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
}

// Initialize carousels
document.addEventListener('DOMContentLoaded', () => {
    // Initialize carousel after a short delay
    setTimeout(() => {
        const portfolioSections = document.querySelectorAll('.portfolio');
        portfolioSections.forEach(section => new ThreeDCarousel(section));
    }, 500);
});

// ==========================================
// Scroll Reveal Animations
// ==========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, observerOptions);

// Observe all elements with reveal classes
document.addEventListener('DOMContentLoaded', () => {
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    revealElements.forEach(el => observer.observe(el));
});

// ==========================================
// Animated Counters for Stats
// ==========================================
const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += step;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
};

// Create observer for stats
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target;
            animateCounter(statNumber);
            statsObserver.unobserve(statNumber);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => statsObserver.observe(stat));
});

// ==========================================
// Contact Form Handling
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            console.log('Form submitted:', formData);
            alert('Thank you for your message! I\'ll get back to you soon.');
            contactForm.reset();
        });
    }
});

// ==========================================
// Parallax Effect for Hero Background
// ==========================================
window.addEventListener('scroll', () => {
    const heroBackground = document.querySelector('.hero-background');
    const scrolled = window.pageYOffset;
    const rate = scrolled * 0.5;

    if (heroBackground) {
        heroBackground.style.transform = `translateY(${rate}px)`;
    }
});

// ==========================================
// Active Section Highlighting in Nav
// ==========================================
const highlightNavLink = () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
};

window.addEventListener('scroll', highlightNavLink);

// ==========================================
// Additional Effects
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Smooth Page Load Animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);

    // Add Hover Effects to Skill Cards
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Tool Badge Animations
    const toolBadges = document.querySelectorAll('.tool-badge');
    toolBadges.forEach((badge, index) => {
        badge.style.animationDelay = `${index * 0.1}s`;
    });

    // Dynamic Year in Footer
    const footerYear = document.querySelector('.footer p');
    if (footerYear) {
        const currentYear = new Date().getFullYear();
        footerYear.innerHTML = footerYear.innerHTML.replace('2025', currentYear);
    }
});

/* ==========================================
   Project Preview Modal Implementation
   ========================================== */
class ProjectModal {
    constructor() {
        this.modal = document.getElementById('project-modal');
        if (!this.modal) return;

        this.closeBtn = this.modal.querySelector('.modal-close');
        this.mainImage = this.modal.querySelector('.modal-main-image');
        this.prevBtn = this.modal.querySelector('.modal-prev');
        this.nextBtn = this.modal.querySelector('.modal-next');
        this.thumbnailsContainer = this.modal.querySelector('.modal-thumbnails');

        this.images = [];
        this.currentIndex = 0;

        this.init();
    }

    init() {
        // Event delegation for view buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('view-project')) {
                e.preventDefault();
                this.openModal(e.target);
            }
        });

        // Close events
        if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.closeModal());

        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });

        // Navigation events
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.prevImage();
            });
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.nextImage();
            });
        }
    }

    openModal(button) {
        // 1. Get Images
        const imagesData = button.getAttribute('data-project-images');
        // Fallback if no images are set but button is clicked - implementation detail
        const fallbackImage = button.closest('.portfolio-item')?.querySelector('.project-image')?.src;

        if (imagesData) {
            this.images = imagesData.split(',').map(src => src.trim()).filter(src => src.length > 0);
        } else if (fallbackImage) {
            this.images = [fallbackImage];
        } else {
            return;
        }

        this.currentIndex = 0;

        if (this.images.length === 0) return;

        // 2. Determine Style (Logo vs Thumbnail)
        // Check which section the button belongs to
        const section = button.closest('section');
        const isThumbnailSection = section && section.id === 'more-work';

        // Reset classes
        this.modal.classList.remove('modal-logo', 'modal-thumbnail');

        if (isThumbnailSection) {
            this.modal.classList.add('modal-thumbnail');
        } else {
            this.modal.classList.add('modal-logo'); // Default to logo/square
        }

        // 3. Populate Content
        this.updateImage();
        this.generateThumbnails();

        // 4. Show Modal
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';

        // Clear content after animation
        setTimeout(() => {
            if (this.mainImage) this.mainImage.src = '';
            if (this.thumbnailsContainer) this.thumbnailsContainer.innerHTML = '';
        }, 300);
    }

    updateImage() {
        if (!this.mainImage) return;

        this.mainImage.src = this.images[this.currentIndex];

        // Update nav buttons visibility
        if (this.prevBtn) this.prevBtn.style.display = this.images.length > 1 ? 'flex' : 'none';
        if (this.nextBtn) this.nextBtn.style.display = this.images.length > 1 ? 'flex' : 'none';

        // Update active thumbnail
        if (this.thumbnailsContainer) {
            const thumbs = this.thumbnailsContainer.querySelectorAll('.modal-thumb');
            thumbs.forEach((thumb, index) => {
                if (index === this.currentIndex) {
                    thumb.classList.add('active');
                    thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                } else {
                    thumb.classList.remove('active');
                }
            });
        }
    }

    generateThumbnails() {
        if (!this.thumbnailsContainer) return;

        this.thumbnailsContainer.innerHTML = '';

        if (this.images.length <= 1) return; // Don't show thumbnails if only 1 image

        this.images.forEach((src, index) => {
            const thumb = document.createElement('img');
            thumb.src = src;
            thumb.className = 'modal-thumb';
            thumb.addEventListener('click', (e) => {
                e.stopPropagation();
                this.currentIndex = index;
                this.updateImage();
            });
            this.thumbnailsContainer.appendChild(thumb);
        });
    }

    nextImage() {
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        this.updateImage();
    }

    prevImage() {
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        this.updateImage();
    }
}

// Initialize Modal
document.addEventListener('DOMContentLoaded', () => {
    new ProjectModal();
});