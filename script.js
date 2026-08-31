// Theme Management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.themeToggle = document.getElementById('theme-toggle');
        this.init();
    }

    init() {
        this.setTheme(this.theme);
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    setTheme(theme) {
        this.theme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateThemeIcon();
    }

    toggleTheme() {
        const newTheme = this.theme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    updateThemeIcon() {
        const icon = this.themeToggle.querySelector('i');
        icon.className = this.theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

// Navigation Manager
class NavigationManager {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.mobileToggle = document.getElementById('mobile-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.sections = document.querySelectorAll('section[id]');
        this.init();
    }

    init() {
        this.handleScroll();
        this.handleNavigation();
        this.handleMobileMenu();
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('resize', () => this.handleResize());
    }

    handleScroll() {
        if (window.scrollY > 20) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }

        this.updateActiveNavLink();
    }

    updateActiveNavLink() {
        let current = '';

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    handleNavigation() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 64;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }

                this.navMenu.classList.remove('active');
                this.mobileToggle.classList.remove('active');
            });
        });
    }

    handleMobileMenu() {
        this.mobileToggle.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
            this.mobileToggle.classList.toggle('active');

            const icon = this.mobileToggle.querySelector('i');
            icon.className = this.navMenu.classList.contains('active')
                ? 'fas fa-times'
                : 'fas fa-bars';
        });

        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target)) {
                this.navMenu.classList.remove('active');
                this.mobileToggle.classList.remove('active');
                const icon = this.mobileToggle.querySelector('i');
                icon.className = 'fas fa-bars';
            }
        });
    }

    handleResize() {
        if (window.innerWidth > 768) {
            this.navMenu.classList.remove('active');
            this.mobileToggle.classList.remove('active');
            const icon = this.mobileToggle.querySelector('i');
            icon.className = 'fas fa-bars';
        }
    }
}

// Reveal-on-scroll animation (lightweight, no extra visual noise)
class RevealManager {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);

        const elementsToObserve = document.querySelectorAll(
            '.pillar-card, .education-card, .skill-category, .certificate-card, .project-card, .achievement-card, .volunteer-card'
        );

        elementsToObserve.forEach(el => observer.observe(el));
    }
}

// Read More Functionality for Achievements
function toggleReadMore(button) {
    const card = button.closest('.achievement-card');
    const expandableContent = card.querySelector('.expandable-content');
    const btnText = button.querySelector('.btn-text');
    const icon = button.querySelector('i');
    const grid = card.closest('.achievements-grid');

    if (expandableContent.classList.contains('expanded')) {
        expandableContent.classList.remove('expanded');
        card.classList.remove('expanded');
        button.classList.remove('expanded');
        btnText.textContent = 'Read More';
        grid.classList.remove('single-expanded');

        const allCards = grid.querySelectorAll('.achievement-card');
        allCards.forEach(c => {
            c.style.display = 'flex';
        });
    } else {
        expandableContent.classList.add('expanded');
        card.classList.add('expanded');
        button.classList.add('expanded');
        btnText.textContent = 'Read Less';
        grid.classList.add('single-expanded');

        const allCards = grid.querySelectorAll('.achievement-card');
        allCards.forEach(otherCard => {
            if (otherCard !== card) {
                otherCard.style.display = 'none';
            }
        });

        setTimeout(() => {
            card.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 200);
    }
}

// Contact Form Enhancement
document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.querySelector('.contact-form');
    const submitBtn = document.querySelector('.submit-btn');
    const formInputs = document.querySelectorAll('.form-input, .form-textarea');

    if (contactForm) {
        formInputs.forEach(input => {
            input.addEventListener('blur', function () {
                validateField(this);
            });

            input.addEventListener('input', function () {
                validateField(this);
            });
        });

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            let isValid = true;
            formInputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });

            if (isValid) {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;

                setTimeout(() => {
                    contactForm.reset();
                    formInputs.forEach(input => {
                        input.classList.remove('valid', 'invalid');
                    });

                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';

                    setTimeout(() => {
                        submitBtn.innerHTML = '<span class="btn-text">Send Message</span><i class="fas fa-paper-plane btn-icon"></i>';
                        submitBtn.disabled = false;
                    }, 3000);
                }, 1200);
            }
        });
    }
});

// Field validation function
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const isRequired = field.hasAttribute('required');

    field.classList.remove('valid', 'invalid');

    if (isRequired && !value) {
        field.classList.add('invalid');
        return false;
    }

    if (value) {
        if (fieldType === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                field.classList.add('invalid');
                return false;
            }
        }

        if (field.hasAttribute('minlength')) {
            const minLength = parseInt(field.getAttribute('minlength'));
            if (value.length < minLength) {
                field.classList.add('invalid');
                return false;
            }
        }

        field.classList.add('valid');
        return true;
    }

    return true;
}

// Initialize all managers when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
    new NavigationManager();
    new RevealManager();
});
