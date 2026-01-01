/**
 * رزومه آنلاین مهندس ماهان ادهم قزوینی
 * فایل JavaScript حرفه‌ای با قابلیت‌های پیشرفته
 * @version 1.0.0
 * @author Mahan Adham Ghazvini
 */

// ===========================================
// Module Pattern برای جلوگیری از آلودگی Global Scope
// ===========================================

const PortfolioApp = (function() {
    // ====== Configuration ======
    const config = {
        formEndpoint: 'https://formspree.io/f/xlgeorgj',
        counterSpeed: 200,
        typingSpeed: 50,
        typingBackSpeed: 30,
        scrollOffset: 80,
        themeKey: 'portfolio-theme',
        activeTabKey: 'active-skill-tab',
        // Email validation regex
        emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        phoneRegex: /^[\d\s\-\+\(\)]{10,}$/,
        // Animation delays
        staggerDelay: 50,
        // API endpoints (if any)
        api: {
            projects: '/api/projects',
            contact: '/api/contact'
        }
    };

    // ====== State Management ======
    const state = {
        theme: 'dark',
        isMenuOpen: false,
        isFormSubmitting: false,
        isTypingActive: false,
        currentTab: 'cad',
        scrollPosition: 0,
        lastScrollTop: 0,
        countersAnimated: false,
        // Cache DOM elements
        elements: {},
        // Typing instance
        typingInstance: null,
        // Intersection observers
        observers: []
    };

    // ====== DOM Elements Cache ======
    const selectors = {
        // Navigation
        menuToggle: '#menuToggle',
        mainNav: '#mainNav',
        menuOverlay: '#menuOverlay',
        navLinks: '.nav-link',
        
        // Theme
        themeToggle: '#themeToggle',
        themeFab: '#themeFab',
        
        // Forms
        contactForm: '#contactForm',
        formSuccess: '#formSuccess',
        newsletterForm: '.newsletter-form',
        
        // Sections
        sections: 'section[id]',
        backToTop: '#backToTop',
        scrollIndicator: '.scroll-indicator',
        
        // Skills
        tabBtns: '.tab-btn',
        tabPanes: '.tab-pane',
        
        // FAB
        fabMain: '#fabMain',
        fabContainer: '.fab-container',
        
        // Counters
        counters: '[data-count]',
        
        // Loading
        loadingScreen: '#loadingScreen',
        
        // Tooltips
        tooltips: '[data-tooltip]'
    };

    // ====== Utility Functions ======
    const utils = {
        /**
         * Debounce function for performance optimization
         */
        debounce: (func, wait) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        /**
         * Throttle function for scroll events
         */
        throttle: (func, limit) => {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        /**
         * Smooth scroll to element
         */
        smoothScroll: (target, offset = 0) => {
            const element = document.querySelector(target);
            if (!element) return;

            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        },

        /**
         * Check if element is in viewport
         */
        isInViewport: (element, threshold = 0.1) => {
            const rect = element.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            
            return (
                rect.top <= windowHeight * (1 - threshold) &&
                rect.bottom >= windowHeight * threshold
            );
        },

        /**
         * Format phone number
         */
        formatPhoneNumber: (phone) => {
            return phone.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
        },

        /**
         * Validate email
         */
        validateEmail: (email) => {
            return config.emailRegex.test(email);
        },

        /**
         * Validate phone
         */
        validatePhone: (phone) => {
            return config.phoneRegex.test(phone.replace(/[\s\-\+\(\)]/g, ''));
        },

        /**
         * Show notification
         */
        showNotification: (message, type = 'success') => {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.innerHTML = `
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close"><i class="fas fa-times"></i></button>
            `;

            // Add to DOM
            document.body.appendChild(notification);

            // Add animation
            setTimeout(() => notification.classList.add('show'), 10);

            // Auto remove after 5 seconds
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 5000);

            // Close button event
            notification.querySelector('.notification-close').addEventListener('click', () => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            });
        },

        /**
         * Add CSS class to element
         */
        addClass: (element, className) => {
            if (element) element.classList.add(className);
        },

        /**
         * Remove CSS class from element
         */
        removeClass: (element, className) => {
            if (element) element.classList.remove(className);
        },

        /**
         * Toggle CSS class on element
         */
        toggleClass: (element, className) => {
            if (element) element.classList.toggle(className);
        },

        /**
         * Get element by selector
         */
        getElement: (selector) => {
            return document.querySelector(selector);
        },

        /**
         * Get all elements by selector
         */
        getElements: (selector) => {
            return document.querySelectorAll(selector);
        },

        /**
         * Set localStorage item
         */
        setStorage: (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.warn('LocalStorage is not available:', e);
            }
        },

        /**
         * Get localStorage item
         */
        getStorage: (key) => {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch (e) {
                console.warn('LocalStorage is not available:', e);
                return null;
            }
        }
    };

    // ====== DOM Manipulation ======
    const dom = {
        /**
         * Initialize all DOM elements
         */
        initElements: () => {
            state.elements = {};
            
            Object.keys(selectors).forEach(key => {
                const selector = selectors[key];
                if (selector.startsWith('.')) {
                    state.elements[key] = utils.getElements(selector);
                } else {
                    state.elements[key] = utils.getElement(selector);
                }
            });

            // Cache frequently used elements
            state.elements.body = document.body;
            state.elements.html = document.documentElement;
        },

        /**
         * Create loading screen
         */
        createLoadingScreen: () => {
            if (!state.elements.loadingScreen) {
                const loadingScreen = document.createElement('div');
                loadingScreen.id = 'loadingScreen';
                loadingScreen.className = 'loading-screen';
                loadingScreen.innerHTML = `
                    <div class="spinner">
                        <div class="double-bounce1"></div>
                        <div class="double-bounce2"></div>
                    </div>
                    <p>در حال بارگذاری...</p>
                `;
                document.body.appendChild(loadingScreen);
                state.elements.loadingScreen = loadingScreen;
            }
        },

        /**
         * Create notifications container
         */
        createNotificationsContainer: () => {
            if (!document.querySelector('.notifications-container')) {
                const container = document.createElement('div');
                container.className = 'notifications-container';
                document.body.appendChild(container);
            }
        },

        /**
         * Create tooltip elements
         */
        initTooltips: () => {
            const tooltips = utils.getElements('[data-tooltip]');
            
            tooltips.forEach(tooltip => {
                const text = tooltip.getAttribute('data-tooltip');
                if (!text) return;

                // Create tooltip element
                const tooltipEl = document.createElement('div');
                tooltipEl.className = 'custom-tooltip';
                tooltipEl.textContent = text;
                tooltip.appendChild(tooltipEl);

                // Position tooltip
                const updatePosition = () => {
                    const rect = tooltip.getBoundingClientRect();
                    tooltipEl.style.left = '50%';
                    tooltipEl.style.transform = 'translateX(-50%)';
                    tooltipEl.style.bottom = '100%';
                };

                // Events
                tooltip.addEventListener('mouseenter', () => {
                    utils.addClass(tooltipEl, 'show');
                    updatePosition();
                });

                tooltip.addEventListener('mouseleave', () => {
                    utils.removeClass(tooltipEl, 'show');
                });

                window.addEventListener('resize', updatePosition);
            });
        }
    };

    // ====== Theme Management ======
    const theme = {
        /**
         * Initialize theme
         */
        init: () => {
            const savedTheme = utils.getStorage(config.themeKey) || 'dark';
            state.theme = savedTheme;
            theme.set(savedTheme);
        },

        /**
         * Set theme
         */
        set: (themeName) => {
            state.theme = themeName;
            state.elements.html.setAttribute('data-theme', themeName);
            utils.setStorage(config.themeKey, themeName);
            
            // Add transition class
            utils.addClass(state.elements.body, 'theme-transition');
            setTimeout(() => utils.removeClass(state.elements.body, 'theme-transition'), 500);
        },

        /**
         * Toggle theme
         */
        toggle: () => {
            const newTheme = state.theme === 'dark' ? 'light' : 'dark';
            theme.set(newTheme);
        },

        /**
         * Get current theme
         */
        get: () => state.theme
    };

    // ====== Navigation Management ======
    const navigation = {
        /**
         * Initialize navigation
         */
        init: () => {
            if (!state.elements.menuToggle || !state.elements.mainNav) return;

            // Menu toggle event
            state.elements.menuToggle.addEventListener('click', navigation.toggleMenu);

            // Overlay click event
            if (state.elements.menuOverlay) {
                state.elements.menuOverlay.addEventListener('click', navigation.closeMenu);
            }

            // Nav links click events
            if (state.elements.navLinks) {
                state.elements.navLinks.forEach(link => {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const target = link.getAttribute('href');
                        
                        // Close menu if mobile
                        if (window.innerWidth <= 768) {
                            navigation.closeMenu();
                        }

                        // Update active link
                        navigation.setActiveLink(link);

                        // Smooth scroll to section
                        if (target.startsWith('#')) {
                            utils.smoothScroll(target, config.scrollOffset);
                        }
                    });
                });
            }

            // Close menu on ESC key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && state.isMenuOpen) {
                    navigation.closeMenu();
                }
            });
        },

        /**
         * Toggle mobile menu
         */
        toggleMenu: () => {
            state.isMenuOpen = !state.isMenuOpen;
            utils.toggleClass(state.elements.mainNav, 'active');
            utils.toggleClass(state.elements.menuOverlay, 'active');
            utils.toggleClass(state.elements.body, 'no-scroll');
        },

        /**
         * Close mobile menu
         */
        closeMenu: () => {
            state.isMenuOpen = false;
            utils.removeClass(state.elements.mainNav, 'active');
            utils.removeClass(state.elements.menuOverlay, 'active');
            utils.removeClass(state.elements.body, 'no-scroll');
        },

        /**
         * Set active navigation link
         */
        setActiveLink: (activeLink) => {
            if (!state.elements.navLinks) return;
            
            state.elements.navLinks.forEach(link => {
                utils.removeClass(link, 'active');
            });
            
            utils.addClass(activeLink, 'active');
        },

        /**
         * Update active link on scroll
         */
        updateActiveLinkOnScroll: () => {
            if (!state.elements.navLinks) return;

            const scrollPosition = window.scrollY + 100;
            const sections = utils.getElements('section[id]');

            sections.forEach(section => {
                const sectionTop = section.offsetTop - config.scrollOffset;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    state.elements.navLinks.forEach(link => {
                        const linkHref = link.getAttribute('href');
                        if (linkHref === `#${sectionId}`) {
                            navigation.setActiveLink(link);
                        }
                    });
                }
            });
        }
    };

    // ====== Animation Management ======
    const animation = {
        /**
         * Initialize animations
         */
        init: () => {
            // Initialize typing animation
            animation.initTyping();

            // Initialize counter animation
            animation.initCounters();

            // Initialize scroll animations
            animation.initScrollAnimations();

            // Initialize skill tabs animation
            animation.initSkillTabs();

            // Initialize tooltip animations
            dom.initTooltips();
        },

        /**
         * Initialize typing animation
         */
        initTyping: () => {
            const typingElement = document.querySelector('.typed-text');
            if (!typingElement || state.isTypingActive) return;

            // Check if Typed.js is available
            if (typeof Typed === 'undefined') {
                console.warn('Typed.js not loaded. Using fallback animation.');
                animation.initTypingFallback();
                return;
            }

            state.isTypingActive = true;
            state.typingInstance = new Typed('.typed-text', {
                strings: [
                    'مهندس مکانیک گرایش سیالات',
                    'تحلیل‌گر CFD',
                    'طراح قطعات پرینتر سه بعدی',
                    'متخصص شبیه‌سازی حرارتی',
                    'مشاور مهندسی مکانیک'
                ],
                typeSpeed: config.typingSpeed,
                backSpeed: config.typingBackSpeed,
                backDelay: 2000,
                loop: true,
                showCursor: true,
                cursorChar: '|',
                contentType: 'html'
            });
        },

        /**
         * Fallback typing animation
         */
        initTypingFallback: () => {
            const texts = [
                'مهندس مکانیک گرایش سیالات',
                'تحلیل‌گر CFD',
                'طراح قطعات پرینتر سه بعدی',
                'متخصص شبیه‌سازی حرارتی',
                'مشاور مهندسی مکانیک'
            ];
            let textIndex = 0;
            let charIndex = 0;
            let isDeleting = false;
            const typingElement = document.querySelector('.typing-text');
            
            if (!typingElement) return;

            const type = () => {
                const currentText = texts[textIndex];
                
                if (isDeleting) {
                    // Deleting text
                    typingElement.textContent = currentText.substring(0, charIndex - 1);
                    charIndex--;
                } else {
                    // Adding text
                    typingElement.textContent = currentText.substring(0, charIndex + 1);
                    charIndex++;
                }

                // Determine delay
                let delay = isDeleting ? 50 : 100;

                if (!isDeleting && charIndex === currentText.length) {
                    // Pause at end
                    delay = 2000;
                    isDeleting = true;
                } else if (isDeleting && charIndex === 0) {
                    // Move to next text
                    isDeleting = false;
                    textIndex = (textIndex + 1) % texts.length;
                    delay = 500;
                }

                setTimeout(type, delay);
            };

            // Start typing
            setTimeout(type, 1000);
        },

        /**
         * Initialize counter animation
         */
        initCounters: () => {
            const counters = utils.getElements('[data-count]');
            if (!counters.length || state.countersAnimated) return;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !state.countersAnimated) {
                        animation.animateCounters();
                        state.countersAnimated = true;
                        observer.disconnect();
                    }
                });
            }, { threshold: 0.5 });

            const statsSection = document.querySelector('.hero-stats');
            if (statsSection) {
                observer.observe(statsSection);
            }
        },

        /**
         * Animate counters
         */
        animateCounters: () => {
            const counters = utils.getElements('[data-count]');
            
            counters.forEach(counter => {
                const target = +counter.getAttribute('data-count');
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };

                requestAnimationFrame(updateCounter);
            });
        },

        /**
         * Initialize scroll animations
         */
        initScrollAnimations: () => {
            // Create observer for animate on scroll
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px'
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        utils.addClass(entry.target, 'animate-in');
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            // Observe elements with animation class
            const animatedElements = utils.getElements('.animate-on-scroll');
            animatedElements.forEach(el => observer.observe(el));

            state.observers.push(observer);
        },

        /**
         * Initialize skill tabs animation
         */
        initSkillTabs: () => {
            if (!state.elements.tabBtns || !state.elements.tabPanes) return;

            const savedTab = utils.getStorage(config.activeTabKey) || 'cad';
            state.currentTab = savedTab;
            animation.switchTab(savedTab);

            state.elements.tabBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const tabId = btn.getAttribute('data-tab');
                    animation.switchTab(tabId);
                    utils.setStorage(config.activeTabKey, tabId);
                });
            });
        },

        /**
         * Switch skill tab
         */
        switchTab: (tabId) => {
            // Update buttons
            state.elements.tabBtns.forEach(btn => {
                if (btn.getAttribute('data-tab') === tabId) {
                    utils.addClass(btn, 'active');
                } else {
                    utils.removeClass(btn, 'active');
                }
            });

            // Update panes
            state.elements.tabPanes.forEach(pane => {
                if (pane.id === tabId) {
                    utils.addClass(pane, 'active');
                    // Add animation
                    pane.style.animation = 'fadeIn 0.5s ease';
                    setTimeout(() => pane.style.animation = '', 500);
                } else {
                    utils.removeClass(pane, 'active');
                }
            });

            state.currentTab = tabId;
        }
    };

    // ====== Form Management ======
    const forms = {
        /**
         * Initialize forms
         */
        init: () => {
            // Contact form
            if (state.elements.contactForm) {
                forms.initContactForm();
            }

            // Newsletter form
            if (state.elements.newsletterForm) {
                forms.initNewsletterForm();
            }

            // Resume download tracking
            forms.trackResumeDownloads();
        },

        /**
         * Initialize contact form
         */
        initContactForm: () => {
            const form = state.elements.contactForm;
            
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                if (state.isFormSubmitting) return;
                
                // Validate form
                if (!forms.validateContactForm(form)) {
                    return;
                }

                // Show loading state
                forms.setFormLoading(form, true);

                try {
                    // Prepare form data
                    const formData = new FormData(form);
                    const data = Object.fromEntries(formData);

                    // Simulate API call (replace with actual Formspree fetch)
                    await forms.submitToFormspree(formData);

                    // Show success message
                    forms.showFormSuccess(form);

                    // Reset form
                    setTimeout(() => {
                        form.reset();
                        forms.setFormLoading(form, false);
                    }, 3000);

                    // Track form submission
                    forms.trackFormSubmission('contact');

                } catch (error) {
                    console.error('Form submission error:', error);
                    utils.showNotification('خطا در ارسال پیام. لطفاً مجدداً تلاش کنید.', 'error');
                    forms.setFormLoading(form, false);
                }
            });

            // Add input validation
            forms.addFormValidation(form);
        },

        /**
         * Validate contact form
         */
        validateContactForm: (form) => {
            const name = form.querySelector('#name');
            const email = form.querySelector('#email');
            const message = form.querySelector('#message');
            let isValid = true;

            // Reset previous errors
            forms.clearFormErrors(form);

            // Validate name
            if (!name.value.trim()) {
                forms.showFieldError(name, 'لطفاً نام خود را وارد کنید');
                isValid = false;
            }

            // Validate email
            if (!email.value.trim()) {
                forms.showFieldError(email, 'لطفاً ایمیل خود را وارد کنید');
                isValid = false;
            } else if (!utils.validateEmail(email.value)) {
                forms.showFieldError(email, 'لطفاً ایمیل معتبر وارد کنید');
                isValid = false;
            }

            // Validate message
            if (!message.value.trim()) {
                forms.showFieldError(message, 'لطفاً پیام خود را وارد کنید');
                isValid = false;
            } else if (message.value.trim().length < 10) {
                forms.showFieldError(message, 'پیام باید حداقل ۱۰ کاراکتر باشد');
                isValid = false;
            }

            return isValid;
        },

        /**
         * Add form validation
         */
        addFormValidation: (form) => {
            const inputs = form.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                // Add focus/blur events
                input.addEventListener('focus', () => {
                    utils.addClass(input.parentElement, 'focused');
                    forms.clearFieldError(input);
                });

                input.addEventListener('blur', () => {
                    utils.removeClass(input.parentElement, 'focused');
                    forms.validateField(input);
                });

                // Real-time validation for email
                if (input.type === 'email') {
                    input.addEventListener('input', () => {
                        if (input.value && !utils.validateEmail(input.value)) {
                            forms.showFieldError(input, 'ایمیل معتبر نیست');
                        } else {
                            forms.clearFieldError(input);
                        }
                    });
                }
            });
        },

        /**
         * Validate individual field
         */
        validateField: (field) => {
            if (!field.required) return true;

            let isValid = true;
            let errorMessage = '';

            switch (field.type) {
                case 'email':
                    if (!utils.validateEmail(field.value)) {
                        isValid = false;
                        errorMessage = 'ایمیل معتبر نیست';
                    }
                    break;
                case 'tel':
                    if (field.value && !utils.validatePhone(field.value)) {
                        isValid = false;
                        errorMessage = 'شماره تلفن معتبر نیست';
                    }
                    break;
                default:
                    if (!field.value.trim()) {
                        isValid = false;
                        errorMessage = 'این فیلد الزامی است';
                    }
            }

            if (!isValid) {
                forms.showFieldError(field, errorMessage);
            } else {
                forms.clearFieldError(field);
            }

            return isValid;
        },

        /**
         * Show field error
         */
        showFieldError: (field, message) => {
            forms.clearFieldError(field);
            
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
            
            field.parentElement.appendChild(errorElement);
            utils.addClass(field.parentElement, 'has-error');
        },

        /**
         * Clear field error
         */
        clearFieldError: (field) => {
            const errorElement = field.parentElement.querySelector('.field-error');
            if (errorElement) {
                errorElement.remove();
            }
            utils.removeClass(field.parentElement, 'has-error');
        },

        /**
         * Clear all form errors
         */
        clearFormErrors: (form) => {
            const errors = form.querySelectorAll('.field-error');
            errors.forEach(error => error.remove());
            
            const errorFields = form.querySelectorAll('.has-error');
            errorFields.forEach(field => utils.removeClass(field, 'has-error'));
        },

        /**
         * Set form loading state
         */
        setFormLoading: (form, isLoading) => {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (!submitBtn) return;

            if (isLoading) {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ارسال...';
                submitBtn.disabled = true;
                state.isFormSubmitting = true;
            } else {
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> ارسال پیام';
                submitBtn.disabled = false;
                state.isFormSubmitting = false;
            }
        },

        /**
         * Show form success message
         */
        showFormSuccess: (form) => {
            if (state.elements.formSuccess) {
                form.style.display = 'none';
                state.elements.formSuccess.style.display = 'block';
                
                // Hide after 5 seconds
                setTimeout(() => {
                    form.style.display = 'block';
                    state.elements.formSuccess.style.display = 'none';
                }, 5000);
            } else {
                utils.showNotification('پیام شما با موفقیت ارسال شد!', 'success');
            }
        },

        /**
         * Submit to Formspree
         */
        submitToFormspree: async (formData) => {
            // In a real implementation, you would use fetch to submit to Formspree
            // For demo purposes, we'll simulate a successful submission
            
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    // Simulate network delay
                    if (Math.random() > 0.1) { // 90% success rate for demo
                        resolve();
                    } else {
                        reject(new Error('Network error'));
                    }
                }, 1500);
            });
            
            // Real implementation would be:
            /*
            const response = await fetch(config.formEndpoint, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error('Form submission failed');
            }
            */
        },

        /**
         * Initialize newsletter form
         */
        initNewsletterForm: () => {
            state.elements.newsletterForm.forEach(form => {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const emailInput = form.querySelector('input[type="email"]');
                    
                    if (!emailInput || !emailInput.value) return;
                    
                    if (!utils.validateEmail(emailInput.value)) {
                        utils.showNotification('لطفاً ایمیل معتبر وارد کنید', 'error');
                        return;
                    }
                    
                    // Simulate subscription
                    form.innerHTML = '<div class="subscription-success"><i class="fas fa-check-circle"></i> اشتراک شما ثبت شد!</div>';
                    
                    // Track subscription
                    forms.trackFormSubmission('newsletter');
                });
            });
        },

        /**
         * Track resume downloads
         */
        trackResumeDownloads: () => {
            const downloadLinks = utils.getElements('a[href*="resume.pdf"]');
            
            downloadLinks.forEach(link => {
                link.addEventListener('click', () => {
                    // Send analytics event
                    forms.trackEvent('resume_download', {
                        source: link.getAttribute('data-source') || 'unknown'
                    });
                });
            });
        },

        /**
         * Track form submission
         */
        trackFormSubmission: (formType) => {
            forms.trackEvent('form_submission', {
                form_type: formType,
                timestamp: new Date().toISOString()
            });
        },

        /**
         * Track custom events
         */
        trackEvent: (eventName, data = {}) => {
            // In a real application, you would send this to your analytics service
            console.log('Event tracked:', eventName, data);
            
            // Example: Google Analytics
            /*
            if (typeof gtag !== 'undefined') {
                gtag('event', eventName, data);
            }
            */
        }
    };

    // ====== Scroll Management ======
    const scroll = {
        /**
         * Initialize scroll handlers
         */
        init: () => {
            // Back to top button
            if (state.elements.backToTop) {
                scroll.initBackToTop();
            }

            // Scroll indicator
            if (state.elements.scrollIndicator) {
                scroll.initScrollIndicator();
            }

            // Update active nav link on scroll
            window.addEventListener('scroll', utils.throttle(() => {
                navigation.updateActiveLinkOnScroll();
                scroll.handleScroll();
            }, 100));

            // Handle initial scroll position
            scroll.handleScroll();
        },

        /**
         * Initialize back to top button
         */
        initBackToTop: () => {
            state.elements.backToTop.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        },

        /**
         * Initialize scroll indicator
         */
        initScrollIndicator: () => {
            const indicator = state.elements.scrollIndicator;
            const heroSection = document.querySelector('.hero-section');
            
            if (!indicator || !heroSection) return;

            const checkScroll = () => {
                const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
                if (window.scrollY > heroBottom - 100) {
                    utils.addClass(indicator, 'hidden');
                } else {
                    utils.removeClass(indicator, 'hidden');
                }
            };

            window.addEventListener('scroll', utils.throttle(checkScroll, 100));
            checkScroll(); // Initial check
        },

        /**
         * Handle scroll events
         */
        handleScroll: () => {
            const currentScroll = window.pageYOffset;
            
            // Show/hide back to top button
            if (state.elements.backToTop) {
                if (currentScroll > 300) {
                    utils.addClass(state.elements.backToTop, 'show');
                } else {
                    utils.removeClass(state.elements.backToTop, 'show');
                }
            }

            // Detect scroll direction for header
            if (currentScroll > state.lastScrollTop && currentScroll > 100) {
                // Scrolling down
                utils.addClass(state.elements.menuToggle.closest('.main-header'), 'scrolled-down');
            } else {
                // Scrolling up
                utils.removeClass(state.elements.menuToggle.closest('.main-header'), 'scrolled-down');
            }

            state.lastScrollTop = currentScroll;
        }
    };

    // ====== FAB Management ======
    const fab = {
        /**
         * Initialize Floating Action Button
         */
        init: () => {
            if (!state.elements.fabMain) return;

            state.elements.fabMain.addEventListener('click', fab.toggle);

            // Close FAB when clicking outside
            document.addEventListener('click', (e) => {
                if (!state.elements.fabContainer.contains(e.target) && 
                    state.elements.fabContainer.classList.contains('active')) {
                    fab.close();
                }
            });

            // Initialize FAB options
            fab.initOptions();
        },

        /**
         * Toggle FAB menu
         */
        toggle: () => {
            utils.toggleClass(state.elements.fabContainer, 'active');
        },

        /**
         * Close FAB menu
         */
        close: () => {
            utils.removeClass(state.elements.fabContainer, 'active');
        },

        /**
         * Initialize FAB options
         */
        initOptions: () => {
            const options = state.elements.fabContainer.querySelectorAll('.fab-option');
            
            options.forEach(option => {
                option.addEventListener('click', (e) => {
                    e.preventDefault();
                    fab.close();
                    
                    const href = option.getAttribute('href');
                    const title = option.getAttribute('title');
                    
                    if (href) {
                        if (href.startsWith('#')) {
                            utils.smoothScroll(href, config.scrollOffset);
                        } else if (href.endsWith('.pdf')) {
                            // Resume download
                            forms.trackResumeDownloads();
                            window.open(href, '_blank');
                        }
                    }
                    
                    // Track FAB interaction
                    if (title) {
                        forms.trackEvent('fab_interaction', { action: title });
                    }
                });
            });
        }
    };

    // ====== Performance Optimization ======
    const performance = {
        /**
         * Initialize performance optimizations
         */
        init: () => {
            // Lazy load images
            performance.lazyLoadImages();

            // Defer non-critical CSS
            performance.deferNonCriticalCSS();

            // Optimize animations
            performance.optimizeAnimations();

            // Monitor performance
            performance.monitorPerformance();
        },

        /**
         * Lazy load images
         */
        lazyLoadImages: () => {
            const images = utils.getElements('img[data-src]');
            
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.getAttribute('data-src');
                            img.removeAttribute('data-src');
                            imageObserver.unobserve(img);
                        }
                    });
                });

                images.forEach(img => imageObserver.observe(img));
            } else {
                // Fallback for older browsers
                images.forEach(img => {
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                });
            }
        },

        /**
         * Defer non-critical CSS
         */
        deferNonCriticalCSS: () => {
            // In a real implementation, you would load non-critical CSS here
            // This is just a placeholder
        },

        /**
         * Optimize animations
         */
        optimizeAnimations: () => {
            // Use will-change for animated elements
            const animatedElements = utils.getElements('.animate-on-scroll, .skill-item, .project-card');
            
            animatedElements.forEach(el => {
                el.style.willChange = 'transform, opacity';
            });
        },

        /**
         * Monitor performance
         */
        monitorPerformance: () => {
            // Monitor long tasks
            if ('PerformanceObserver' in window) {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.duration > 50) {
                            console.warn('Long task detected:', entry);
                        }
                    }
                });

                observer.observe({ entryTypes: ['longtask'] });
            }

            // Report page load time
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const timing = performance.timing;
                    const loadTime = timing.loadEventEnd - timing.navigationStart;
                    
                    if (loadTime > 3000) {
                        console.warn(`Page load took ${loadTime}ms`);
                    }
                }, 0);
            });
        }
    };

    // ====== Error Handling ======
    const errorHandler = {
        /**
         * Initialize error handling
         */
        init: () => {
            // Global error handler
            window.addEventListener('error', errorHandler.handleGlobalError);
            
            // Unhandled promise rejections
            window.addEventListener('unhandledrejection', errorHandler.handlePromiseRejection);
            
            // Network error monitoring
            errorHandler.monitorNetworkErrors();
        },

        /**
         * Handle global errors
         */
        handleGlobalError: (event) => {
            console.error('Global error:', event.error);
            
            // Don't show error notification for minor errors
            if (event.error instanceof TypeError && event.message.includes('undefined')) {
                return;
            }
            
            // Show user-friendly error message
            utils.showNotification('خطایی رخ داده است. لطفاً صفحه را رفرش کنید.', 'error');
            
            // Log to analytics (in real implementation)
            errorHandler.logError(event.error);
        },

        /**
         * Handle promise rejections
         */
        handlePromiseRejection: (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            errorHandler.logError(event.reason);
        },

        /**
         * Monitor network errors
         */
        monitorNetworkErrors: () => {
            const originalFetch = window.fetch;
            
            window.fetch = function(...args) {
                return originalFetch.apply(this, args)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                        }
                        return response;
                    })
                    .catch(error => {
                        console.error('Fetch error:', error);
                        errorHandler.logError(error);
                        throw error;
                    });
            };
        },

        /**
         * Log errors to server
         */
        logError: (error) => {
            // In a real application, you would send errors to your error tracking service
            const errorData = {
                message: error.message,
                stack: error.stack,
                url: window.location.href,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent
            };

            // Example: Send to error tracking service
            /*
            fetch('/api/log-error', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(errorData)
            });
            */
        }
    };

    // ====== Analytics ======
    const analytics = {
        /**
         * Initialize analytics
         */
        init: () => {
            // Page view tracking
            analytics.trackPageView();

            // Event tracking
            analytics.setupEventTracking();

            // Performance tracking
            analytics.trackPerformance();
        },

        /**
         * Track page view
         */
        trackPageView: () => {
            const pageData = {
                page_title: document.title,
                page_url: window.location.href,
                referrer: document.referrer,
                timestamp: new Date().toISOString()
            };

            forms.trackEvent('page_view', pageData);
        },

        /**
         * Setup event tracking
         */
        setupEventTracking: () => {
            // Track section views
            const sections = utils.getElements('section[id]');
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const sectionId = entry.target.id;
                        forms.trackEvent('section_view', { section: sectionId });
                    }
                });
            }, { threshold: 0.5 });

            sections.forEach(section => sectionObserver.observe(section));

            // Track external link clicks
            const externalLinks = utils.getElements('a[href^="http"]');
            externalLinks.forEach(link => {
                link.addEventListener('click', () => {
                    forms.trackEvent('external_link_click', {
                        url: link.href,
                        text: link.textContent.substring(0, 100)
                    });
                });
            });
        },

        /**
         * Track performance metrics
         */
        trackPerformance: () => {
            if ('PerformanceObserver' in window) {
                const observer = new PerformanceObserver((list) => {
                    list.getEntries().forEach(entry => {
                        if (entry.entryType === 'paint') {
                            forms.trackEvent('performance_metric', {
                                metric: entry.name,
                                value: entry.startTime,
                                unit: 'ms'
                            });
                        }
                    });
                });

                observer.observe({ entryTypes: ['paint'] });
            }
        }
    };

    // ====== Public API ======
    return {
        /**
         * Initialize the application
         */
        init: function() {
            try {
                // Initialize DOM elements
                dom.initElements();
                
                // Create necessary DOM elements
                dom.createLoadingScreen();
                dom.createNotificationsContainer();
                
                // Initialize modules
                theme.init();
                navigation.init();
                animation.init();
                forms.init();
                scroll.init();
                fab.init();
                performance.init();
                errorHandler.init();
                analytics.init();
                
                // Initialize event listeners
                this.initEventListeners();
                
                // Show page after initialization
                setTimeout(() => {
                    if (state.elements.loadingScreen) {
                        state.elements.loadingScreen.style.opacity = '0';
                        setTimeout(() => {
                            if (state.elements.loadingScreen) {
                                state.elements.loadingScreen.style.display = 'none';
                            }
                        }, 500);
                    }
                }, 1000);
                
                console.log('Portfolio App initialized successfully');
                
            } catch (error) {
                console.error('Failed to initialize Portfolio App:', error);
                errorHandler.handleGlobalError({ error });
            }
        },

        /**
         * Initialize event listeners
         */
        initEventListeners: function() {
            // Theme toggle
            if (state.elements.themeToggle) {
                state.elements.themeToggle.addEventListener('click', theme.toggle);
            }
            
            if (state.elements.themeFab) {
                state.elements.themeFab.addEventListener('click', theme.toggle);
            }
            
            // Smooth scroll for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    const target = this.getAttribute('href');
                    if (target === '#') return;
                    
                    utils.smoothScroll(target, config.scrollOffset);
                });
            });
            
            // Window resize handler
            window.addEventListener('resize', utils.debounce(() => {
                if (window.innerWidth > 768 && state.isMenuOpen) {
                    navigation.closeMenu();
                }
            }, 250));
            
            // Before unload - save state
            window.addEventListener('beforeunload', () => {
                utils.setStorage('portfolio-scroll-position', window.pageYOffset);
            });
            
            // Restore scroll position
            window.addEventListener('load', () => {
                const savedPosition = utils.getStorage('portfolio-scroll-position');
                if (savedPosition && savedPosition > 0) {
                    window.scrollTo(0, savedPosition);
                }
            });
        },

        /**
         * Public method to change theme
         */
        setTheme: function(themeName) {
            theme.set(themeName);
        },

        /**
         * Public method to get current theme
         */
        getTheme: function() {
            return theme.get();
        },

        /**
         * Public method to submit contact form programmatically
         */
        submitContactForm: function(formData) {
            return forms.submitToFormspree(formData);
        },

        /**
         * Public method to show notification
         */
        showNotification: function(message, type = 'success') {
            utils.showNotification(message, type);
        },

        /**
         * Public method to track custom events
         */
        trackEvent: function(eventName, data = {}) {
            forms.trackEvent(eventName, data);
        },

        /**
         * Get application state (for debugging)
         */
        getState: function() {
            return { ...state };
        },

        /**
         * Get application configuration
         */
        getConfig: function() {
            return { ...config };
        }
    };
})();

// ===========================================
// Initialize application when DOM is ready
// ===========================================

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => PortfolioApp.init());
} else {
    PortfolioApp.init();
}

// ===========================================
// Global error handler for initialization errors
// ===========================================

window.addEventListener('error', function(event) {
    console.error('Uncaught error:', event.error);
    
    // Try to show user-friendly message
    const errorContainer = document.createElement('div');
    errorContainer.className = 'global-error';
    errorContainer.innerHTML = `
        <div class="error-content">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>خطا در بارگذاری صفحه</h3>
            <p>متأسفیم، در بارگذاری صفحه مشکلی پیش آمده است.</p>
            <button onclick="window.location.reload()">
                <i class="fas fa-redo"></i>
                بارگذاری مجدد
            </button>
        </div>
    `;
    
    document.body.appendChild(errorContainer);
    
    // Remove loading screen if exists
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }
});

// ===========================================
// Make PortfolioApp available globally for debugging
// ===========================================

if (process.env.NODE_ENV === 'development') {
    window.PortfolioApp = PortfolioApp;
}

// ===========================================
// CSS برای نوتیفیکیشن‌ها و خطاها (اضافه کردن به صورت داینامیک)
// ===========================================

const dynamicStyles = `
/* Notifications */
.notifications-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-width: 400px;
}

.notification {
    background: var(--card);
    border-radius: var(--border-radius);
    padding: var(--spacing-md) var(--spacing-lg);
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    box-shadow: var(--shadow-xl);
    border-left: 4px solid;
    transform: translateX(400px);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.notification.show {
    transform: translateX(0);
    opacity: 1;
}

.notification-success {
    border-left-color: #10b981;
}

.notification-error {
    border-left-color: #ef4444;
}

.notification i {
    font-size: 1.2rem;
}

.notification-success i {
    color: #10b981;
}

.notification-error i {
    color: #ef4444;
}

.notification span {
    flex: 1;
    color: var(--text);
}

.notification-close {
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: var(--transition-fast);
}

.notification-close:hover {
    color: var(--accent);
    background: rgba(0,0,0,0.05);
}

/* Form Errors */
.field-error {
    color: #ef4444;
    font-size: var(--font-size-sm);
    margin-top: var(--spacing-xs);
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    animation: slideDown 0.3s ease;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.field-error i {
    font-size: 0.9em;
}

.has-error input,
.has-error textarea,
.has-error select {
    border-color: #ef4444 !important;
    background: rgba(239, 68, 68, 0.05) !important;
}

/* Loading states */
button:disabled {
    opacity: 0.7;
    cursor: not-allowed !important;
}

.fa-spin {
    animation: fa-spin 1s infinite linear;
}

@keyframes fa-spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Global Error */
.global-error {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--bg);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 99999;
    padding: var(--spacing-xl);
}

.error-content {
    background: var(--card);
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-2xl);
    text-align: center;
    max-width: 500px;
    box-shadow: var(--shadow-xl);
    border: 1px solid var(--border);
}

.error-content i {
    font-size: 3rem;
    color: var(--accent);
    margin-bottom: var(--spacing-lg);
}

.error-content h3 {
    color: var(--text);
    margin-bottom: var(--spacing-md);
}

.error-content p {
    color: var(--text-secondary);
    margin-bottom: var(--spacing-xl);
}

.error-content button {
    background: var(--gradient);
    color: white;
    border: none;
    padding: var(--spacing-md) var(--spacing-xl);
    border-radius: var(--border-radius);
    font-family: var(--font-primary);
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-sm);
    transition: var(--transition);
}

.error-content button:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-lg);
}

/* Tooltips */
.custom-tooltip {
    position: absolute;
    background: var(--primary);
    color: white;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--border-radius-sm);
    font-size: var(--font-size-sm);
    white-space: nowrap;
    z-index: 1000;
    opacity: 0;
    visibility: hidden;
    transform: translateY(10px);
    transition: all 0.3s ease;
    pointer-events: none;
    filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));
}

.custom-tooltip.show {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
}

.custom-tooltip::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: var(--primary);
}

/* Scroll indicator hidden state */
.scroll-indicator.hidden {
    opacity: 0;
    visibility: hidden;
    transform: translateX(-50%) translateY(20px);
}

/* Header scroll state */
.main-header.scrolled-down {
    transform: translateY(-100%);
}

/* Animation classes */
.animate-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
}

.animate-on-scroll.animate-in {
    opacity: 1;
    transform: translateY(0);
}

/* Focus states for accessibility */
:focus {
    outline: 2px solid var(--secondary);
    outline-offset: 2px;
}

:focus:not(:focus-visible) {
    outline: none;
}

/* Print styles enhancements */
@media print {
    .notification,
    .global-error,
    .custom-tooltip {
        display: none !important;
    }
}
`;

// Add dynamic styles to document
const styleElement = document.createElement('style');
styleElement.textContent = dynamicStyles;
document.head.appendChild(styleElement);
