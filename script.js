// script.js

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initLoadingScreen();
    initThemeToggle();
    initMobileMenu();
    initSmoothScroll();
    initBackToTop();
    initFloatingButtons();
    initSkillsTabs();
    initProjectsFilter();
    initContactForm();
    initNewsletterForm();
    initCounters();
    initTypingAnimation();
    initTooltips();
    initLazyLoading();
    initFormValidation();
    initScrollAnimations();
    initProjectGallery();
});

// ==========================================================================
// Loading Screen
// ==========================================================================
function initLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (!loadingScreen) return;

    // Simulate loading progress
    let progress = 0;
    const progressBar = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    const interval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress > 100) progress = 100;
        
        if (progressBar) progressBar.style.width = progress + '%';
        if (progressText) progressText.textContent = Math.round(progress) + '%';
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 500);
        }
    }, 50);

    // Hide loading screen after max 3 seconds
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 3000);
}

// ==========================================================================
// Theme Toggle
// ==========================================================================
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeFab = document.getElementById('themeFab');
    
    // Get current theme from localStorage or default to dark
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Update theme toggle button state
    updateThemeToggleIcon(currentTheme);
    
    // Toggle theme function
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add transition class for smooth theme change
        document.body.classList.add('theme-transition');
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 500);
        
        // Update toggle button icon
        updateThemeToggleIcon(newTheme);
        
        // Dispatch custom event for other components
        document.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: newTheme } 
        }));
    }
    
    function updateThemeToggleIcon(theme) {
        const moonIcon = document.querySelector('.fa-moon');
        const sunIcon = document.querySelector('.fa-sun');
        
        if (theme === 'dark') {
            moonIcon.style.opacity = '1';
            sunIcon.style.opacity = '0';
        } else {
            moonIcon.style.opacity = '0';
            sunIcon.style.opacity = '1';
        }
    }
    
    // Add event listeners
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    if (themeFab) {
        themeFab.addEventListener('click', toggleTheme);
    }
}

// ==========================================================================
// Mobile Menu
// ==========================================================================
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    const menuOverlay = document.getElementById('menuOverlay');
    const navClose = document.getElementById('navClose');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (!menuToggle || !mainNav) return;
    
    // Toggle menu function
    function toggleMenu() {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        mainNav.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        document.body.classList.toggle('no-scroll');
    }
    
    // Close menu function
    function closeMenu() {
        menuToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.classList.remove('no-scroll');
    }
    
    // Event listeners
    menuToggle.addEventListener('click', toggleMenu);
    
    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeMenu);
    }
    
    if (navClose) {
        navClose.addEventListener('click', closeMenu);
    }
    
    // Close menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mainNav.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Close menu on window resize (if resized to desktop)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024 && mainNav.classList.contains('active')) {
            closeMenu();
        }
    });
}

// ==========================================================================
// Smooth Scroll
// ==========================================================================
function initSmoothScroll() {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                
                // Get header height for offset
                const headerHeight = document.querySelector('.main-header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL hash without scrolling
                history.pushState(null, null, href);
            }
        });
    });
    
    // Update active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveNavLink() {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = sectionId;
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Initial call
}

// ==========================================================================
// Back to Top Button
// ==========================================================================
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;
    
    // Show/hide button based on scroll position
    function toggleBackToTop() {
        if (window.scrollY > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }
    
    // Scroll to top function
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // Event listeners
    window.addEventListener('scroll', toggleBackToTop);
    backToTop.addEventListener('click', scrollToTop);
    
    // Initial check
    toggleBackToTop();
}

// ==========================================================================
// Floating Action Buttons
// ==========================================================================
function initFloatingButtons() {
    const fabMain = document.getElementById('fabMain');
    const fabContainer = document.querySelector('.fab-container');
    
    if (!fabMain || !fabContainer) return;
    
    // Toggle FAB menu
    function toggleFAB() {
        fabContainer.classList.toggle('active');
        
        // Toggle aria-expanded
        const isExpanded = fabMain.getAttribute('aria-expanded') === 'true';
        fabMain.setAttribute('aria-expanded', !isExpanded);
    }
    
    // Close FAB menu when clicking outside
    document.addEventListener('click', (e) => {
        if (fabContainer.classList.contains('active') && 
            !fabContainer.contains(e.target) && 
            e.target !== fabMain) {
            fabContainer.classList.remove('active');
            fabMain.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && fabContainer.classList.contains('active')) {
            fabContainer.classList.remove('active');
            fabMain.setAttribute('aria-expanded', 'false');
        }
    });
    
    fabMain.addEventListener('click', toggleFAB);
}

// ==========================================================================
// Skills Tabs
// ==========================================================================
function initSkillsTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    if (tabBtns.length === 0) return;
    
    // Switch tab function
    function switchTab(e) {
        e.preventDefault();
        const tabId = this.getAttribute('data-tab');
        
        // Remove active class from all buttons and panes
        tabBtns.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        });
        
        tabPanes.forEach(pane => {
            pane.classList.remove('active');
            pane.setAttribute('aria-hidden', 'true');
        });
        
        // Add active class to current button and pane
        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');
        
        const activePane = document.getElementById(tabId);
        if (activePane) {
            activePane.classList.add('active');
            activePane.setAttribute('aria-hidden', 'false');
            
            // Trigger animation for skill bars
            setTimeout(() => {
                animateSkillBars(activePane);
            }, 300);
        }
    }
    
    // Animate skill bars in active tab
    function animateSkillBars(container) {
        const skillBars = container.querySelectorAll('.skill-progress .progress');
        skillBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }
    
    // Add event listeners
    tabBtns.forEach(btn => {
        btn.addEventListener('click', switchTab);
    });
    
    // Initialize first tab
    if (tabBtns[0]) {
        tabBtns[0].click();
    }
}

// ==========================================================================
// Projects Filter
// ==========================================================================
function initProjectsFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (filterBtns.length === 0 || projectCards.length === 0) return;
    
    // Filter projects function
    function filterProjects(e) {
        e.preventDefault();
        const filter = this.getAttribute('data-filter');
        
        // Update active filter button
        filterBtns.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Filter and animate projects
        projectCards.forEach(card => {
            const categories = card.getAttribute('data-category').split(' ');
            
            if (filter === 'all' || categories.includes(filter)) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        // Update project count
        updateProjectCount(filter);
    }
    
    // Update project count display
    function updateProjectCount(filter) {
        const count = filter === 'all' ? 
            projectCards.length : 
            Array.from(projectCards).filter(card => {
                const categories = card.getAttribute('data-category').split(' ');
                return categories.includes(filter);
            }).length;
        
        const countElement = document.querySelector('.filter-stats strong');
        if (countElement) {
            countElement.textContent = count;
        }
    }
    
    // Add event listeners
    filterBtns.forEach(btn => {
        btn.addEventListener('click', filterProjects);
    });
    
    // Initialize with "all" filter
    updateProjectCount('all');
}

// ==========================================================================
// Contact Form
// ==========================================================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const closeSuccess = document.getElementById('closeSuccess');
    const messageTextarea = document.getElementById('message');
    const charCount = document.getElementById('charCount');
    
    if (!contactForm) return;
    
    // Character count for message textarea
    if (messageTextarea && charCount) {
        messageTextarea.addEventListener('input', function() {
            const count = this.value.length;
            charCount.textContent = count;
            
            // Limit to 500 characters
            if (count > 500) {
                this.value = this.value.substring(0, 500);
                charCount.textContent = 500;
            }
            
            // Add warning class near limit
            if (count > 450) {
                charCount.classList.add('warning');
            } else {
                charCount.classList.remove('warning');
            }
        });
    }
    
    // Form submission
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('.btn-submit');
        const formData = new FormData(this);
        
        // Validate form
        if (!validateContactForm()) {
            return;
        }
        
        // Show loading state
        submitBtn.classList.add('loading');
        
        try {
            // Simulate API call (replace with actual Formspree fetch)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            this.style.display = 'none';
            if (formSuccess) {
                formSuccess.style.display = 'flex';
            }
            
            // Reset form after 5 seconds
            setTimeout(() => {
                this.reset();
                if (charCount) charCount.textContent = '0';
                this.style.display = 'block';
                if (formSuccess) {
                    formSuccess.style.display = 'none';
                }
                submitBtn.classList.remove('loading');
            }, 5000);
            
        } catch (error) {
            console.error('Form submission error:', error);
            submitBtn.classList.remove('loading');
            showFormError('خطا در ارسال پیام. لطفاً مجدداً تلاش کنید.');
        }
    });
    
    // Form validation
    function validateContactForm() {
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');
        let isValid = true;
        
        // Reset error states
        [name, email, subject, message].forEach(field => {
            field.classList.remove('error');
            const feedback = field.closest('.form-group').querySelector('.form-feedback');
            if (feedback) feedback.textContent = '';
        });
        
        // Validate name
        if (!name.value.trim()) {
            showFieldError(name, 'لطفاً نام خود را وارد کنید');
            isValid = false;
        }
        
        // Validate email
        if (!email.value.trim()) {
            showFieldError(email, 'لطفاً ایمیل خود را وارد کنید');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showFieldError(email, 'لطفاً یک ایمیل معتبر وارد کنید');
            isValid = false;
        }
        
        // Validate subject
        if (!subject.value) {
            showFieldError(subject, 'لطفاً موضوع را انتخاب کنید');
            isValid = false;
        }
        
        // Validate message
        if (!message.value.trim()) {
            showFieldError(message, 'لطفاً پیام خود را بنویسید');
            isValid = false;
        } else if (message.value.length > 500) {
            showFieldError(message, 'پیام نمی‌تواند بیشتر از ۵۰۰ کاراکتر باشد');
            isValid = false;
        }
        
        return isValid;
    }
    
    function showFieldError(field, message) {
        field.classList.add('error');
        const feedback = field.closest('.form-group').querySelector('.form-feedback');
        if (feedback) {
            feedback.textContent = message;
            feedback.style.color = 'var(--accent-red)';
        }
    }
    
    function showFormError(message) {
        // Create error alert
        const alert = document.createElement('div');
        alert.className = 'form-error-alert';
        alert.innerHTML = `
            <div class="alert-icon">
                <i class="fas fa-exclamation-circle"></i>
            </div>
            <div class="alert-content">
                <p>${message}</p>
            </div>
            <button class="alert-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Style the alert
        alert.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--accent-red);
            color: white;
            padding: var(--spacing-md);
            border-radius: var(--radius-md);
            display: flex;
            align-items: center;
            gap: var(--spacing-md);
            box-shadow: var(--shadow-lg);
            z-index: var(--z-modal);
            max-width: 400px;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(alert);
        
        // Close button functionality
        const closeBtn = alert.querySelector('.alert-close');
        closeBtn.addEventListener('click', () => {
            alert.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => alert.remove(), 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alert.parentNode) {
                alert.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => alert.remove(), 300);
            }
        }, 5000);
    }
    
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email.toLowerCase());
    }
    
    // Close success message
    if (closeSuccess) {
        closeSuccess.addEventListener('click', function() {
            if (formSuccess) {
                formSuccess.style.display = 'none';
            }
            if (contactForm) {
                contactForm.style.display = 'block';
            }
        });
    }
}

// ==========================================================================
// Newsletter Form
// ==========================================================================
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (!newsletterForm) return;
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const input = this.querySelector('.newsletter-input');
        const btn = this.querySelector('.newsletter-btn');
        
        if (!input.value.trim() || !isValidEmail(input.value)) {
            showNewsletterError('لطفاً یک ایمیل معتبر وارد کنید');
            return;
        }
        
        // Simulate subscription
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        btn.disabled = true;
        
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-check"></i>';
            btn.style.background = 'var(--secondary-color)';
            input.value = 'عضویت شما با موفقیت انجام شد!';
            input.disabled = true;
            
            // Reset after 3 seconds
            setTimeout(() => {
                btn.innerHTML = '<i class="fas fa-paper-plane"></i>';
                btn.style.background = '';
                btn.disabled = false;
                input.value = '';
                input.disabled = false;
            }, 3000);
        }, 1500);
    });
    
    function showNewsletterError(message) {
        const input = newsletterForm.querySelector('.newsletter-input');
        input.style.borderColor = 'var(--accent-red)';
        input.style.boxShadow = '0 0 0 2px rgba(239, 68, 68, 0.2)';
        
        setTimeout(() => {
            input.style.borderColor = '';
            input.style.boxShadow = '';
        }, 3000);
    }
}

// ==========================================================================
// Counters Animation
// ==========================================================================
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    if (counters.length === 0) return;
    
    // Check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.9 &&
            rect.bottom >= 0
        );
    }
    
    // Animate counter
    function animateCounter(counter) {
        const target = parseInt(counter.getAttribute('data-count'));
        const speed = parseInt(counter.getAttribute('data-speed')) || 200;
        const increment = target / speed;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 20);
    }
    
    // Initialize counters when in viewport
    function initCountersOnScroll() {
        counters.forEach(counter => {
            if (isInViewport(counter) && !counter.classList.contains('animated')) {
                counter.classList.add('animated');
                animateCounter(counter);
            }
        });
    }
    
    // Listen for scroll events
    window.addEventListener('scroll', initCountersOnScroll);
    
    // Initial check
    initCountersOnScroll();
}

// ==========================================================================
// Typing Animation
// ==========================================================================
function initTypingAnimation() {
    const typedText = document.querySelector('.typed-text');
    if (!typedText) return;
    
    // Check if Typed.js is loaded
    if (typeof Typed === 'undefined') {
        // Fallback: simple typing effect
        const strings = [
            'مهندس مکانیک گرایش سیالات',
            'تحلیل‌گر CFD',
            'طراح قطعات پرینتر سه بعدی',
            'متخصص شبیه‌سازی حرارتی',
            'مشاور مهندسی مکانیک'
        ];
        
        let stringIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;
        
        function type() {
            const currentString = strings[stringIndex];
            
            if (isDeleting) {
                // Deleting text
                typedText.textContent = currentString.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                // Typing text
                typedText.textContent = currentString.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }
            
            // Check if string is complete
            if (!isDeleting && charIndex === currentString.length) {
                // Pause at end
                typingSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                // Move to next string
                isDeleting = false;
                stringIndex = (stringIndex + 1) % strings.length;
                typingSpeed = 500;
            }
            
            setTimeout(type, typingSpeed);
        }
        
        // Start typing animation
        setTimeout(type, 1000);
    } else {
        // Use Typed.js if available
        new Typed('.typed-text', {
            strings: [
                'مهندس مکانیک گرایش سیالات',
                'تحلیل‌گر CFD',
                'طراح قطعات پرینتر سه بعدی',
                'متخصص شبیه‌سازی حرارتی',
                'مشاور مهندسی مکانیک'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|',
            contentType: 'html'
        });
    }
}

// ==========================================================================
// Tooltips
// ==========================================================================
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', createTooltip);
        element.addEventListener('mouseleave', removeTooltip);
        element.addEventListener('focus', createTooltip);
        element.addEventListener('blur', removeTooltip);
    });
    
    function createTooltip(e) {
        const element = e.target;
        const tooltipText = element.getAttribute('data-tooltip');
        
        // Don't create if tooltip already exists
        if (element.querySelector('.custom-tooltip')) return;
        
        const tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        tooltip.textContent = tooltipText;
        
        // Position tooltip
        const rect = element.getBoundingClientRect();
        tooltip.style.position = 'absolute';
        tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
        tooltip.style.right = (rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2)) + 'px';
        
        element.appendChild(tooltip);
    }
    
    function removeTooltip(e) {
        const element = e.target;
        const tooltip = element.querySelector('.custom-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }
}

// ==========================================================================
// Lazy Loading
// ==========================================================================
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img.lazy');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for browsers without IntersectionObserver
        lazyImages.forEach(img => {
            const src = img.getAttribute('data-src');
            if (src) {
                img.src = src;
                img.removeAttribute('data-src');
            }
            img.classList.remove('lazy');
        });
    }
}

// ==========================================================================
// Form Validation
// ==========================================================================
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Add validation on blur
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            // Remove error on focus
            input.addEventListener('focus', function() {
                this.classList.remove('error');
                const feedback = this.closest('.form-group')?.querySelector('.form-feedback');
                if (feedback) feedback.textContent = '';
            });
        });
    });
    
    function validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Required validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'این فیلد اجباری است';
        }
        
        // Email validation
        if (field.type === 'email' && value && !isValidEmail(value)) {
            isValid = false;
            errorMessage = 'لطفاً یک ایمیل معتبر وارد کنید';
        }
        
        // Phone validation (simple)
        if (field.type === 'tel' && value && !/^[\d\s\-\(\)]+$/.test(value)) {
            isValid = false;
            errorMessage = 'لطفاً شماره تلفن معتبر وارد کنید';
        }
        
        // Update field state
        if (!isValid) {
            field.classList.add('error');
            const feedback = field.closest('.form-group')?.querySelector('.form-feedback');
            if (feedback) {
                feedback.textContent = errorMessage;
                feedback.style.color = 'var(--accent-red)';
            }
        } else {
            field.classList.remove('error');
            field.classList.add('valid');
            const feedback = field.closest('.form-group')?.querySelector('.form-feedback');
            if (feedback) feedback.textContent = '';
        }
        
        return isValid;
    }
}

// ==========================================================================
// Scroll Animations
// ==========================================================================
function initScrollAnimations() {
    // Initialize AOS if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100,
            easing: 'ease-in-out',
            delay: 100,
            disable: window.innerWidth < 768
        });
    }
    
    // Parallax effect for hero background
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroBg.style.transform = `translateY(${rate}px)`;
        });
    }
    
    // Header scroll effect
    const header = document.querySelector('.main-header');
    if (header) {
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            // Add/remove scrolled class
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Hide/show header on scroll
            if (currentScroll > lastScroll && currentScroll > 100) {
                // Scrolling down
                header.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                header.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        });
    }
}

// ==========================================================================
// Project Gallery
// ==========================================================================
function initProjectGallery() {
    const projectViewBtns = document.querySelectorAll('.project-view');
    const projectGalleryBtns = document.querySelectorAll('.project-gallery');
    
    // View project details
    projectViewBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const projectCard = this.closest('.project-card');
            const projectTitle = projectCard.querySelector('.project-title').textContent;
            
            // Create modal for project details
            createProjectModal(projectCard, projectTitle);
        });
    });
    
    // View project gallery
    projectGalleryBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            // In a real implementation, this would open a gallery
            alert('گالری پروژه در حال توسعه است...');
        });
    });
    
    function createProjectModal(projectCard, title) {
        // Create modal overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.style.cssText = `
            position: fixed;
            top: 0;
            right: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: var(--z-modal);
            padding: var(--spacing-lg);
            backdrop-filter: blur(10px);
        `;
        
        // Create modal content
        const modal = document.createElement('div');
        modal.className = 'project-modal';
        modal.style.cssText = `
            background: var(--bg-primary);
            border-radius: var(--radius-xl);
            max-width: 800px;
            width: 100%;
            max-height: 90vh;
            overflow-y: auto;
            animation: modalFadeIn 0.3s ease;
        `;
        
        // Get project details
        const imageSrc = projectCard.querySelector('.project-img').src;
        const description = projectCard.querySelector('.project-description').textContent;
        const techTags = projectCard.querySelectorAll('.tech-tag');
        const details = projectCard.querySelectorAll('.detail');
        
        // Build modal HTML
        modal.innerHTML = `
            <div class="modal-header" style="padding: var(--spacing-xl); border-bottom: 1px solid var(--border-color);">
                <h3 style="margin: 0;">${title}</h3>
                <button class="modal-close" style="background: none; border: none; font-size: 1.5rem; color: var(--text-secondary); cursor: pointer;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body" style="padding: var(--spacing-xl);">
                <div class="modal-image" style="margin-bottom: var(--spacing-xl);">
                    <img src="${imageSrc}" alt="${title}" style="width: 100%; border-radius: var(--radius-lg);">
                </div>
                <div class="modal-description" style="margin-bottom: var(--spacing-xl);">
                    <h4 style="margin-bottom: var(--spacing-md);">توضیحات پروژه</h4>
                    <p>${description}</p>
                </div>
                <div class="modal-tech" style="margin-bottom: var(--spacing-xl);">
                    <h4 style="margin-bottom: var(--spacing-md);">تکنولوژی‌های استفاده شده</h4>
                    <div class="tech-tags" style="display: flex; flex-wrap: wrap; gap: var(--spacing-sm);">
                        ${Array.from(techTags).map(tag => `<span class="tech-tag">${tag.innerHTML}</span>`).join('')}
                    </div>
                </div>
                <div class="modal-details">
                    <h4 style="margin-bottom: var(--spacing-md);">جزییات پروژه</h4>
                    <div class="details-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--spacing-lg);">
                        ${Array.from(details).map(detail => `
                            <div class="detail-item">
                                ${detail.innerHTML}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            <div class="modal-footer" style="padding: var(--spacing-xl); border-top: 1px solid var(--border-color); text-align: left;">
                <button class="btn btn-primary" style="padding: var(--spacing-md) var(--spacing-xl);">
                    <i class="fas fa-paper-plane"></i>
                    درخواست پروژه مشابه
                </button>
            </div>
        `;
        
        // Add modal to overlay
        modalOverlay.appendChild(modal);
        document.body.appendChild(modalOverlay);
        document.body.classList.add('no-scroll');
        
        // Close modal functionality
        const closeBtn = modalOverlay.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            modalOverlay.style.animation = 'modalFadeOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(modalOverlay);
                document.body.classList.remove('no-scroll');
            }, 300);
        });
        
        // Close on escape key
        document.addEventListener('keydown', function closeOnEscape(e) {
            if (e.key === 'Escape') {
                modalOverlay.style.animation = 'modalFadeOut 0.3s ease';
                setTimeout(() => {
                    document.body.removeChild(modalOverlay);
                    document.body.classList.remove('no-scroll');
                    document.removeEventListener('keydown', closeOnEscape);
                }, 300);
            }
        });
        
        // Close on overlay click
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                modalOverlay.style.animation = 'modalFadeOut 0.3s ease';
                setTimeout(() => {
                    document.body.removeChild(modalOverlay);
                    document.body.classList.remove('no-scroll');
                }, 300);
            }
        });
        
        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes modalFadeIn {
                from {
                    opacity: 0;
                    transform: scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
            
            @keyframes modalFadeOut {
                from {
                    opacity: 1;
                    transform: scale(1);
                }
                to {
                    opacity: 0;
                    transform: scale(0.9);
                }
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ==========================================================================
// Utility Functions
// ==========================================================================

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for resize events
function throttle(func, limit) {
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
}

// Update copyright year
function updateCopyrightYear() {
    const copyrightElement = document.querySelector('.copyright');
    if (copyrightElement) {
        const currentYear = new Date().getFullYear();
        const persianYear = currentYear - 621;
        copyrightElement.innerHTML = copyrightElement.innerHTML.replace('۱۴۰۳', persianYear);
    }
}

// ==========================================================================
// Window Load Event
// ==========================================================================
window.addEventListener('load', function() {
    // Remove loading screen if still visible
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen && loadingScreen.style.display !== 'none') {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
    
    // Update copyright year
    updateCopyrightYear();
    
    // Initialize any additional components
    initLoadMoreProjects();
    
    // Dispatch loaded event
    document.dispatchEvent(new Event('pageLoaded'));
});

// ==========================================================================
// Load More Projects
// ==========================================================================
function initLoadMoreProjects() {
    const loadMoreBtn = document.getElementById('loadMoreProjects');
    if (!loadMoreBtn) return;
    
    loadMoreBtn.addEventListener('click', function() {
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال بارگذاری...';
        this.disabled = true;
        
        // Simulate loading more projects
        setTimeout(() => {
            // In a real implementation, you would fetch more projects from server
            this.innerHTML = originalText;
            this.disabled = false;
            
            // Show message
            showToast('پروژه‌های بیشتری به زودی اضافه خواهند شد');
        }, 2000);
    });
}

// ==========================================================================
// Toast Notifications
// ==========================================================================
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--secondary-color)' : 'var(--bg-secondary)'};
        color: ${type === 'success' ? 'white' : 'var(--text-primary)'};
        padding: var(--spacing-md) var(--spacing-lg);
        border-radius: var(--radius-md);
        box-shadow: var(--shadow-lg);
        z-index: var(--z-tooltip);
        animation: slideInRight 0.3s ease;
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        max-width: 300px;
    `;
    
    // Add icon based on type
    const icon = document.createElement('i');
    icon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-info-circle';
    toast.prepend(icon);
    
    document.body.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, 5000);
}

// ==========================================================================
// Service Worker Registration (for PWA)
// ==========================================================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

// ==========================================================================
// Error Handling
// ==========================================================================
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// ==========================================================================
// Export for module usage (if needed)
// ==========================================================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initLoadingScreen,
        initThemeToggle,
        initMobileMenu,
        initSmoothScroll,
        initBackToTop,
        initFloatingButtons,
        initSkillsTabs,
        initProjectsFilter,
        initContactForm,
        initNewsletterForm,
        initCounters,
        initTypingAnimation,
        initTooltips,
        initLazyLoading,
        initFormValidation,
        initScrollAnimations,
        initProjectGallery,
        debounce,
        throttle,
        updateCopyrightYear,
        showToast
    };
}

