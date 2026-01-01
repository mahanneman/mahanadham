// ==================== ENHANCED MENU SYSTEM ====================
class MenuManager {
    constructor() {
        this.menuToggle = document.getElementById('menuToggle');
        this.mainNav = document.getElementById('mainNav');
        this.menuOverlay = document.getElementById('menuOverlay');
        this.isOpen = false;
        
        this.init();
    }
    
    init() {
        if (!this.menuToggle || !this.mainNav) {
            console.error('عناصر منو یافت نشدند');
            return;
        }
        
        this.setupEventListeners();
        this.handleResize();
    }
    
    setupEventListeners() {
        // کلیک روی دکمه هامبورگر
        this.menuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleMenu();
        });
        
        // کلیک روی overlay
        if (this.menuOverlay) {
            this.menuOverlay.addEventListener('click', () => {
                this.closeMenu();
            });
        }
        
        // کلیک روی لینک‌های منو
        const navLinks = this.mainNav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });
        
        // تغییر سایز پنجره
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // کلیک خارج از منو
        document.addEventListener('click', (e) => {
            if (this.isOpen && !this.mainNav.contains(e.target) && e.target !== this.menuToggle) {
                this.closeMenu();
            }
        });
        
        // کلید ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
    }
    
    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }
    
    openMenu() {
        this.isOpen = true;
        this.menuToggle.classList.add('active');
        this.mainNav.classList.add('active');
        if (this.menuOverlay) this.menuOverlay.classList.add('active');
        document.body.classList.add('menu-open');
        document.body.style.overflow = 'hidden';
        
        console.log('منو باز شد');
    }
    
    closeMenu() {
        this.isOpen = false;
        this.menuToggle.classList.remove('active');
        this.mainNav.classList.remove('active');
        if (this.menuOverlay) this.menuOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
        
        console.log('منو بسته شد');
    }
    
    handleResize() {
        if (window.innerWidth > 768) {
            // حالت دسکتاپ
            this.closeMenu();
            this.mainNav.style.display = 'flex';
            this.menuToggle.style.display = 'none';
            document.body.style.overflow = '';
        } else {
            // حالت موبایل
            this.menuToggle.style.display = 'flex';
            if (!this.isOpen) {
                this.mainNav.style.display = 'none';
            }
        }
    }
}

// ==================== SOFTWARE SKILLS MANAGER ====================
class SkillsManager {
    constructor() {
        this.skillsData = {
            cad: [
                { name: 'CATIA V5/V6', level: 90, experience: '۴ سال', type: 'پیشرفته' },
                { name: 'SolidWorks', level: 85, experience: '۳ سال', type: 'حرفه‌ای' },
                { name: 'AutoCAD', level: 95, experience: '۵ سال', type: 'پیشرفته' },
                { name: 'Autodesk Inventor', level: 75, experience: '۲ سال', type: 'متوسط' },
                { name: 'PowerMill', level: 70, experience: '۲ سال', type: 'متوسط' }
            ],
            cae: [
                { name: 'Ansys Workbench', level: 85, experience: '۳ سال', type: 'پیشرفته' },
                { name: 'Ansys Mechanical', level: 80, experience: '۳ سال', type: 'پیشرفته' },
                { name: 'Ansys Fluent', level: 80, experience: '۳ سال', type: 'پیشرفته' }
            ]
        };
        
        this.init();
    }
    
    init() {
        this.animateSkills();
        this.setupFilterButtons();
    }
    
    animateSkills() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBars = entry.target.querySelectorAll('.progress');
                    progressBars.forEach(bar => {
                        const width = bar.style.width;
                        bar.style.width = '0';
                        setTimeout(() => {
                            bar.style.width = width;
                        }, 100);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        const skillsSection = document.getElementById('software-skills');
        if (skillsSection) observer.observe(skillsSection);
    }
    
    setupFilterButtons() {
        const filterButtons = document.querySelectorAll('.skill-filter');
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.filter;
                this.filterSkills(category);
                
                // آپدیت دکمه‌های فعال
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            });
        });
    }
    
    filterSkills(category) {
        const skillItems = document.querySelectorAll('.skill-item');
        skillItems.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.style.display = 'flex';
                item.style.animation = 'fadeIn 0.5s ease';
            } else {
                item.style.display = 'none';
            }
        });
    }
}

// ==================== INITIALIZE EVERYTHING ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 راه‌اندازی سیستم...');
    
    // راه‌اندازی منو
    window.menuManager = new MenuManager();
    
    // راه‌اندازی مهارت‌ها
    window.skillsManager = new SkillsManager();
    
    // تایپینگ انیمیشن
    if (typeof Typed !== 'undefined' && document.querySelector('.typed-text')) {
        new Typed('.typed-text', {
            strings: [
                'مهندس مکانیک گرایش سیالات',
                'متخصص تحلیل CFD',
                'طراح قطعات پرینتر سه‌بعدی',
                'مسلط به Ansys و CATIA'
            ],
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }
    
    // انیمیشن شمارنده‌ها
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-count');
            const count = +counter.innerText.replace(/,/g, '');
            const increment = target / 100;
            
            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(animateCounters, 20);
            } else {
                counter.innerText = target.toLocaleString();
            }
        });
    }
    
    // فعال کردن شمارنده‌ها هنگام اسکرول
    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }
    
    // تم تیره/روشن
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // انیمیشن تغییر تم
            document.body.style.transition = 'background-color 0.5s ease';
            setTimeout(() => {
                document.body.style.transition = '';
            }, 500);
        });
    }
    
    // بازگشت به بالا
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('show');
            } else {
                backToTop.classList.remove('show');
            }
        });
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // فرم تماس
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // شبیه‌سازی ارسال
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ارسال...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                const successMsg = document.getElementById('formSuccess');
                if (successMsg) {
                    successMsg.style.display = 'block';
                    this.style.display = 'none';
                }
                
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // ریست فرم بعد از 5 ثانیه
                setTimeout(() => {
                    this.reset();
                    this.style.display = 'block';
                    if (successMsg) successMsg.style.display = 'none';
                }, 5000);
            }, 2000);
        });
    }
    
    console.log('✅ سیستم با موفقیت راه‌اندازی شد');
});

// ==================== DEBUG FUNCTIONS ====================
window.debugMenu = function() {
    console.log('=== وضعیت منو ===');
    console.log('دکمه منو:', document.getElementById('menuToggle'));
    console.log('منو اصلی:', document.getElementById('mainNav'));
    console.log('Overlay:', document.getElementById('menuOverlay'));
    console.log('آیا باز است؟', window.menuManager?.isOpen);
    console.log('عرض پنجره:', window.innerWidth);
};

window.resetMenu = function() {
    if (window.menuManager) {
        window.menuManager.closeMenu();
        console.log('منو ریست شد');
    }
};
