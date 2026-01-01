// ==================== PROFESSIONAL MOBILE MENU ====================

class MobileMenu {
    constructor() {
        this.hamburgerMenu = document.getElementById('hamburgerMenu');
        this.mainNav = document.getElementById('mainNav');
        this.closeMenu = document.getElementById('closeMenu');
        this.menuOverlay = document.getElementById('menuOverlay');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.themeToggle = document.getElementById('themeToggle');
        this.desktopThemeToggle = document.getElementById('desktopThemeToggle');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupTheme();
        this.setupSmoothScroll();
        this.setupActiveLink();
        this.setupResizeHandler();
        this.setupEscKey();
        this.setupTouchGestures();
    }
    
    setupEventListeners() {
        // باز کردن منو
        if (this.hamburgerMenu) {
            this.hamburgerMenu.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openMenu();
            });
        }
        
        // بستن منو با دکمه X
        if (this.closeMenu) {
            this.closeMenu.addEventListener('click', () => this.closeMenuHandler());
        }
        
        // بستن منو با کلیک روی overlay
        if (this.menuOverlay) {
            this.menuOverlay.addEventListener('click', () => this.closeMenuHandler());
        }
        
        // بستن منو با کلیک روی لینک‌ها
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // فقط لینک‌های داخلی (hash) منو را می‌بندند
                if (link.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    this.closeMenuHandler();
                    
                    // تاخیر برای اسکرول نرم
                    setTimeout(() => {
                        const targetId = link.getAttribute('href');
                        const targetElement = document.querySelector(targetId);
                        if (targetElement) {
                            const headerHeight = document.querySelector('.main-header').offsetHeight;
                            const targetPosition = targetElement.offsetTop - headerHeight - 20;
                            
                            window.scrollTo({
                                top: targetPosition,
                                behavior: 'smooth'
                            });
                        }
                    }, 300);
                }
            });
        });
    }
    
    setupTheme() {
        const themeButtons = [this.themeToggle, this.desktopThemeToggle];
        
        // بارگذاری تم ذخیره شده
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcons(savedTheme);
        
        // اضافه کردن event listeners برای تمام دکمه‌های تغییر تم
        themeButtons.forEach(button => {
            if (button) {
                button.addEventListener('click', () => {
                    const currentTheme = document.documentElement.getAttribute('data-theme');
                    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                    
                    document.documentElement.setAttribute('data-theme', newTheme);
                    localStorage.setItem('theme', newTheme);
                    
                    this.updateThemeIcons(newTheme);
                    
                    // انیمیشن
                    if (button === this.themeToggle) {
                        button.style.transform = 'rotate(360deg)';
                        setTimeout(() => {
                            button.style.transform = 'rotate(0deg)';
                        }, 300);
                    }
                });
            }
        });
    }
    
    updateThemeIcons(theme) {
        const icons = document.querySelectorAll('.theme-toggle i');
        icons.forEach(icon => {
            if (theme === 'light') {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }
        });
    }
    
    setupSmoothScroll() {
        // اسکرول نرم برای تمام لینک‌های داخلی
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '') return;
                
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();
                    const headerHeight = document.querySelector('.main-header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    setupActiveLink() {
        // ردیابی اسکرول برای هایلایت کردن لینک فعال
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '-100px 0px -100px 0px'
        });
        
        sections.forEach(section => observer.observe(section));
    }
    
    setupResizeHandler() {
        // بستن منو در تغییر سایز به دسکتاپ
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024 && this.mainNav.classList.contains('active')) {
                this.closeMenuHandler();
            }
        });
    }
    
    setupEscKey() {
        // بستن منو با کلید ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.mainNav.classList.contains('active')) {
                this.closeMenuHandler();
            }
        });
    }
    
    setupTouchGestures() {
        // تشخیص سوایپ (کشیدن) برای بستن منو
        let touchStartX = 0;
        let touchEndX = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            
            // اگر منو باز است و کاربر از راست به چپ سوایپ کرد، منو را ببند
            if (this.mainNav.classList.contains('active') && 
                touchStartX - touchEndX > 100) {
                this.closeMenuHandler();
            }
        }, { passive: true });
    }
    
    openMenu() {
        this.mainNav.classList.add('active');
        this.hamburgerMenu.classList.add('active');
        this.menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // انیمیشن overlay
        setTimeout(() => {
            this.menuOverlay.style.opacity = '1';
        }, 10);
    }
    
    closeMenuHandler() {
        this.mainNav.classList.remove('active');
        this.hamburgerMenu.classList.remove('active');
        this.menuOverlay.style.opacity = '0';
        document.body.style.overflow = 'auto';
        
        // تاخیر برای پنهان کردن overlay
        setTimeout(() => {
            if (!this.mainNav.classList.contains('active')) {
                this.menuOverlay.classList.remove('active');
            }
        }, 300);
    }
}

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
    // راه‌اندازی منو
    new MobileMenu();
    
    // دکمه بازگشت به بالا
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.style.display = 'flex';
                setTimeout(() => {
                    backToTop.style.opacity = '1';
                }, 10);
            } else {
                backToTop.style.opacity = '0';
                setTimeout(() => {
                    if (window.pageYOffset <= 300) {
                        backToTop.style.display = 'none';
                    }
                }, 300);
            }
        });
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // راهنمای کنسول برای توسعه‌دهندگان
    console.log(`
    🌟 وبسایت مهندس ماهان ادهم قزوینی
    📧 ایمیل: mahan.neman2020@gmail.com
    📱 تلفن: ۰۹۹۰۲۲۷۹۷۰۲
    ✨ سیستم منوی موبایل فعال شد
    👆 برای تست: روی دکمه همبرگر کلیک کنید
    `);
});
