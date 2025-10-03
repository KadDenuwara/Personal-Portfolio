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
        // Add scrolled class to navbar
        if (window.scrollY > 100) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }

        // Update active navigation link
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
                    const offsetTop = targetSection.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }

                // Close mobile menu if open
                this.navMenu.classList.remove('active');
                this.mobileToggle.classList.remove('active');
            });
        });
    }

    handleMobileMenu() {
        this.mobileToggle.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
            this.mobileToggle.classList.toggle('active');
            
            // Change icon
            const icon = this.mobileToggle.querySelector('i');
            icon.className = this.navMenu.classList.contains('active') 
                ? 'fas fa-times' 
                : 'fas fa-bars';
        });

        // Close mobile menu when clicking outside
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

// Animation Manager
class AnimationManager {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.animateCounters();
        this.setupParallaxEffects();
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    entry.target.classList.add('animate-in');
                }
            });
        }, this.observerOptions);

        // Observe all sections and cards
        const elementsToObserve = document.querySelectorAll(`
            .section,
            .identity-card,
            .timeline-item,
            .skill-category,
            .project-card,
            .achievement-card,
            .volunteer-card,
            .contact-item
        `);

        elementsToObserve.forEach(el => {
            observer.observe(el);
        });
    }

    animateCounters() {
        const counters = document.querySelectorAll('[data-count]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.dataset.count);
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
    }

    setupParallaxEffects() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.parallax');
            
            parallaxElements.forEach(element => {
                const speed = element.dataset.speed || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }
}

// Interactive Effects Manager
class InteractiveEffectsManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupHoverEffects();
        this.setupClickEffects();
        this.setupSkillTagAnimation();
        this.setupContactFormValidation();
    }

    setupHoverEffects() {
        // Add magnetic effect to buttons
        const buttons = document.querySelectorAll('.cta-button, .contact-item');
        
        buttons.forEach(button => {
            button.addEventListener('mousemove', (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translate(0px, 0px)';
            });
        });

        // Card tilt effects
        const cards = document.querySelectorAll('.project-card, .achievement-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
            });
        });
    }

    setupClickEffects() {
        // Ripple effect for clickable elements
        const clickableElements = document.querySelectorAll('.cta-button, .skill-tag');
        
        clickableElements.forEach(element => {
            element.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = element.getBoundingClientRect();
                const size = Math.max(rect.height, rect.width);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    left: ${x}px;
                    top: ${y}px;
                    width: ${size}px;
                    height: ${size}px;
                `;
                
                element.style.position = 'relative';
                element.style.overflow = 'hidden';
                element.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });
    }

    setupSkillTagAnimation() {
        const skillTags = document.querySelectorAll('.skill-tag');
        
        skillTags.forEach((tag, index) => {
            tag.style.animationDelay = `${index * 0.1}s`;
            
            tag.addEventListener('mouseenter', () => {
                tag.style.animation = 'none';
                tag.offsetHeight; // Trigger reflow
                tag.style.animation = 'skillTagBounce 0.5s ease';
            });
        });
    }

    setupContactFormValidation() {
        // Add smooth scrolling to contact links
        const contactLinks = document.querySelectorAll('a[href^="tel:"], a[href^="mailto:"]');
        
        contactLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Add a subtle animation
                link.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    link.style.transform = 'scale(1)';
                }, 150);
            });
        });
    }
}

// Typing Animation for Hero Section
class TypingAnimation {
    constructor() {
        this.text = "I am an undergraduate in Chemical and Process Engineering at the University of Moratuwa, while also pursuing an external degree in Information Systems at the same university";
        this.element = document.querySelector('.hero-subtitle');
        this.speed = 50;
        this.currentIndex = 0;
        this.isDeleting = false;
        this.init();
    }

    init() {
        if (this.element) {
            this.element.textContent = '';
            setTimeout(() => this.type(), 2000);
        }
    }

    type() {
        const shouldDelete = this.currentIndex === this.text.length;
        
        if (!this.isDeleting && !shouldDelete) {
            this.element.textContent = this.text.substring(0, this.currentIndex + 1);
            this.currentIndex++;
            setTimeout(() => this.type(), this.speed);
        } else if (!this.isDeleting && shouldDelete) {
            setTimeout(() => this.type(), 2000);
            this.isDeleting = true;
        } else if (this.isDeleting && this.currentIndex > 0) {
            this.element.textContent = this.text.substring(0, this.currentIndex - 1);
            this.currentIndex--;
            setTimeout(() => this.type(), this.speed / 2);
        } else {
            this.isDeleting = false;
            this.currentIndex = 0;
            setTimeout(() => this.type(), 1000);
        }
    }
}

// Performance Manager
class PerformanceManager {
    constructor() {
        this.init();
    }

    init() {
        this.lazyLoadImages();
        this.preloadCriticalResources();
        this.optimizeAnimations();
    }

    lazyLoadImages() {
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    preloadCriticalResources() {
        // Preload fonts
        const fontUrls = [
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
        ];

        fontUrls.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = url;
            document.head.appendChild(link);
        });
    }

    optimizeAnimations() {
        // Reduce motion for users who prefer it
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            document.documentElement.style.setProperty('--transition', 'none');
            const animatedElements = document.querySelectorAll('[class*="animate"]');
            animatedElements.forEach(el => {
                el.style.animation = 'none';
            });
        }
    }
}

// Scroll Progress Indicator
class ScrollProgressIndicator {
    constructor() {
        this.createProgressBar();
        this.init();
    }

    createProgressBar() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.innerHTML = '<div class="scroll-progress-bar"></div>';
        
        const styles = `
            .scroll-progress {
                position: fixed;
                top: 70px;
                left: 0;
                width: 100%;
                height: 3px;
                background: var(--bg-secondary);
                z-index: 999;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .scroll-progress.visible {
                opacity: 1;
            }
            
            .scroll-progress-bar {
                height: 100%;
                background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
                width: 0%;
                transition: width 0.1s ease;
            }
        `;
        
        if (!document.querySelector('#scroll-progress-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'scroll-progress-styles';
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }
        
        document.body.appendChild(progressBar);
        this.progressBar = progressBar;
        this.progressBarFill = progressBar.querySelector('.scroll-progress-bar');
    }

    init() {
        window.addEventListener('scroll', () => this.updateProgress());
    }

    updateProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        if (scrollTop > 100) {
            this.progressBar.classList.add('visible');
        } else {
            this.progressBar.classList.remove('visible');
        }
        
        this.progressBarFill.style.width = scrollPercent + '%';
    }
}

// Dynamic Background Manager
class DynamicBackgroundManager {
    constructor() {
        this.init();
    }

    init() {
        this.createFloatingShapes();
        this.animateShapes();
    }

    createFloatingShapes() {
        const hero = document.querySelector('.hero');
        const shapesContainer = document.createElement('div');
        shapesContainer.className = 'dynamic-shapes';
        
        const styles = `
            .dynamic-shapes {
                position: absolute;
                inset: 0;
                overflow: hidden;
                pointer-events: none;
                z-index: 1;
            }
            
            .floating-shape {
                position: absolute;
                border-radius: 50%;
                background: linear-gradient(45deg, var(--primary-color), var(--secondary-color));
                opacity: 0.1;
                animation: floatShape 20s infinite linear;
            }
            
            @keyframes floatShape {
                0% {
                    transform: translateY(100vh) rotate(0deg);
                }
                100% {
                    transform: translateY(-100px) rotate(360deg);
                }
            }
        `;
        
        if (!document.querySelector('#dynamic-bg-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'dynamic-bg-styles';
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }
        
        for (let i = 0; i < 5; i++) {
            const shape = document.createElement('div');
            shape.className = 'floating-shape';
            shape.style.cssText = `
                width: ${Math.random() * 100 + 50}px;
                height: ${Math.random() * 100 + 50}px;
                left: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 20}s;
                animation-duration: ${15 + Math.random() * 10}s;
            `;
            shapesContainer.appendChild(shape);
        }
        
        hero.appendChild(shapesContainer);
    }

    animateShapes() {
        // Add mouse interaction to shapes
        document.addEventListener('mousemove', (e) => {
            const shapes = document.querySelectorAll('.floating-shape');
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 0.02;
                const translateX = (x - 0.5) * speed * 100;
                const translateY = (y - 0.5) * speed * 100;
                
                shape.style.transform += ` translate(${translateX}px, ${translateY}px)`;
            });
        });
    }
}

// Skills Progress Animation
class SkillsProgressAnimation {
    constructor() {
        this.init();
    }

    init() {
        this.observeSkillsSection();
    }

    observeSkillsSection() {
        const skillsSection = document.querySelector('#skills');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateSkills();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        if (skillsSection) {
            observer.observe(skillsSection);
        }
    }

    animateSkills() {
        const skillTags = document.querySelectorAll('.skill-tag');
        
        skillTags.forEach((tag, index) => {
            setTimeout(() => {
                tag.style.opacity = '0';
                tag.style.transform = 'translateY(20px)';
                tag.style.transition = 'all 0.5s ease';
                
                setTimeout(() => {
                    tag.style.opacity = '1';
                    tag.style.transform = 'translateY(0)';
                }, 50);
            }, index * 100);
        });
    }
}

// Project Filter System
class ProjectFilterSystem {
    constructor() {
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.createFilterButtons();
        this.setupFiltering();
    }

    createFilterButtons() {
        const projectsSection = document.querySelector('#projects');
        const container = projectsSection.querySelector('.container');
        const title = container.querySelector('.section-title');
        
        const filterContainer = document.createElement('div');
        filterContainer.className = 'project-filters';
        filterContainer.innerHTML = `
            <button class="filter-btn active" data-filter="all">All Projects</button>
            <button class="filter-btn" data-filter="chemical">Chemical Engineering</button>
            <button class="filter-btn" data-filter="it">Information Technology</button>
        `;
        
        const styles = `
            .project-filters {
                display: flex;
                justify-content: center;
                gap: 1rem;
                margin-bottom: 3rem;
                flex-wrap: wrap;
            }
            
            .filter-btn {
                padding: 0.75rem 1.5rem;
                border: 2px solid var(--border-color);
                background: var(--bg-card);
                color: var(--text-secondary);
                border-radius: 25px;
                cursor: pointer;
                transition: var(--transition);
                font-weight: 500;
            }
            
            .filter-btn:hover,
            .filter-btn.active {
                border-color: var(--primary-color);
                background: var(--primary-color);
                color: white;
                transform: translateY(-2px);
            }
        `;
        
        if (!document.querySelector('#project-filter-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'project-filter-styles';
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }
        
        title.insertAdjacentElement('afterend', filterContainer);
    }

    setupFiltering() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                
                // Update active button
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter projects
                projectCards.forEach(card => {
                    const show = filter === 'all' || card.classList.contains(`${filter}-project`);
                    
                    if (show) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
}

// Contact Animation Manager
class ContactAnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.animateContactItems();
        this.setupClickToCopy();
    }

    animateContactItems() {
        const contactItems = document.querySelectorAll('.contact-item');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateX(0)';
                    }, index * 200);
                }
            });
        }, { threshold: 0.5 });

        contactItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-50px)';
            item.style.transition = 'all 0.6s ease';
            observer.observe(item);
        });
    }

    setupClickToCopy() {
        const contactDetails = document.querySelectorAll('.contact-details p');
        
        contactDetails.forEach(detail => {
            detail.style.cursor = 'pointer';
            detail.title = 'Click to copy';
            
            detail.addEventListener('click', () => {
                const text = detail.textContent.trim();
                
                if (navigator.clipboard) {
                    navigator.clipboard.writeText(text).then(() => {
                        this.showCopyNotification(detail);
                    });
                } else {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = text;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    this.showCopyNotification(detail);
                }
            });
        });
    }

    showCopyNotification(element) {
        const notification = document.createElement('div');
        notification.textContent = 'Copied!';
        notification.className = 'copy-notification';
        
        const styles = `
            .copy-notification {
                position: absolute;
                background: var(--success-color);
                color: white;
                padding: 0.5rem 1rem;
                border-radius: 4px;
                font-size: 0.8rem;
                z-index: 1000;
                pointer-events: none;
                opacity: 0;
                transform: translateY(-10px);
                transition: all 0.3s ease;
            }
            
            .copy-notification.show {
                opacity: 1;
                transform: translateY(-30px);
            }
        `;
        
        if (!document.querySelector('#copy-notification-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'copy-notification-styles';
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }
        
        const rect = element.getBoundingClientRect();
        notification.style.position = 'fixed';
        notification.style.left = rect.left + 'px';
        notification.style.top = rect.top + 'px';
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 2000);
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
        // Collapse
        expandableContent.classList.remove('expanded');
        card.classList.remove('expanded');
        button.classList.remove('expanded');
        btnText.textContent = 'Read More';
        icon.style.transform = 'rotate(0deg)';
        grid.classList.remove('single-expanded');
        
        // Show all cards again
        const allCards = grid.querySelectorAll('.achievement-card');
        allCards.forEach(card => {
            card.style.display = 'flex';
        });
    } else {
        // Expand
        expandableContent.classList.add('expanded');
        card.classList.add('expanded');
        button.classList.add('expanded');
        btnText.textContent = 'Read Less';
        icon.style.transform = 'rotate(180deg)';
        grid.classList.add('single-expanded');
        
        // Hide other cards
        const allCards = grid.querySelectorAll('.achievement-card');
        allCards.forEach(otherCard => {
            if (otherCard !== card) {
                otherCard.style.display = 'none';
            }
        });
        
        // Smooth scroll to the expanded content
        setTimeout(() => {
            card.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 300);
    }
}

// Contact Form Enhancement
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form');
    const submitBtn = document.querySelector('.submit-btn');
    const formInputs = document.querySelectorAll('.form-input, .form-textarea');
    
    if (contactForm) {
        // Form validation and enhancement
        formInputs.forEach(input => {
            // Add focus effects
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
                validateField(this);
            });
            
            // Real-time validation
            input.addEventListener('input', function() {
                validateField(this);
            });
        });
        
        // Form submission
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate all fields
            let isValid = true;
            formInputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
            
            if (isValid) {
                // Show loading state
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;
                
                // Simulate form submission (replace with actual form handling)
                setTimeout(() => {
                    // Reset form
                    contactForm.reset();
                    formInputs.forEach(input => {
                        input.classList.remove('valid', 'invalid');
                    });
                    
                    // Show success message
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                    submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                    
                    // Reset button after 3 seconds
                    setTimeout(() => {
                        submitBtn.innerHTML = '<span class="btn-text">Send Message</span><i class="fas fa-paper-plane btn-icon"></i>';
                        submitBtn.disabled = false;
                        submitBtn.style.background = 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))';
                    }, 3000);
                }, 2000);
            }
        });
    }
});

// Field validation function
function validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const isRequired = field.hasAttribute('required');
    
    // Remove previous validation classes
    field.classList.remove('valid', 'invalid');
    
    if (isRequired && !value) {
        field.classList.add('invalid');
        return false;
    }
    
    if (value) {
        // Email validation for email fields
        if (fieldType === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                field.classList.add('invalid');
                return false;
            }
        }
        
        // Minimum length validation
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
    // Initialize all components
    new ThemeManager();
    new NavigationManager();
    new AnimationManager();
    new InteractiveEffectsManager();
    new TypingAnimation();
    new PerformanceManager();
    new ScrollProgressIndicator();
    new DynamicBackgroundManager();
    new SkillsProgressAnimation();
    new ProjectFilterSystem();
    new ContactAnimationManager();
    
    // Add custom CSS animations
    const customAnimations = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        @keyframes skillTagBounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        
        .animate-in {
            animation: fadeInUp 0.8s ease forwards;
        }
        
        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }
    `;
    
    if (!document.querySelector('#custom-animations')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'custom-animations';
        styleSheet.textContent = customAnimations;
        document.head.appendChild(styleSheet);
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Resume animations when page becomes visible
        const animatedElements = document.querySelectorAll('[style*="animation-play-state"]');
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'running';
        });
    } else {
        // Pause animations when page is hidden to save resources
        const animatedElements = document.querySelectorAll('[style*="animation"]');
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'paused';
        });
    }
});

// Add smooth scrolling fallback for older browsers
if (!CSS.supports('scroll-behavior', 'smooth')) {
    const smoothScrollPolyfill = () => {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const startPosition = window.pageYOffset;
                    const targetPosition = targetElement.offsetTop - 70;
                    const distance = targetPosition - startPosition;
                    const duration = 800;
                    let start = null;
                    
                    const step = (timestamp) => {
                        if (!start) start = timestamp;
                        const progress = Math.min((timestamp - start) / duration, 1);
                        const ease = 0.5 * (1 - Math.cos(Math.PI * progress));
                        
                        window.scrollTo(0, startPosition + distance * ease);
                        
                        if (progress < 1) {
                            requestAnimationFrame(step);
                        }
                    };
                    
                    requestAnimationFrame(step);
                }
            });
        });
    };
    
    smoothScrollPolyfill();
}
