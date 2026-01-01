// ==================== MAIN SCRIPT ====================

document.addEventListener('DOMContentLoaded', function() {
    // تابع اصلی اجرا پس از بارگذاری DOM
    initAll();
});

function initAll() {
    // 1. مدیریت منوی موبایل
    initMobileMenu();
    
    // 2. مدیریت تم سایت
    initTheme();
    
    // 3. مدیریت اسکرول
    initScroll();
    
    // 4. مدیریت فرم تماس
    initContactForm();
    
    // 5. مدیریت عکس‌ها برای موبایل
    initMobileImages();
    
    // 6. مدیریت انیمیشن‌ها
    initAnimations();
    
    // 7. راهنمای کنسول
    consoleGuide();
}

// ==================== MOBILE MENU MANAGEMENT ====================

function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.querySelector('.main-nav');
    const headerActions = document.querySelector('.header-actions');
    
    if (!menuToggle || !mainNav || !headerActions) {
        console.warn('عناصر منو یافت نشدند');
        return;
    }
    
    // تنظیم نمایش اولیه برای موبایل
    const updateMenuForMobile = () => {
        if (window.innerWidth <= 768) {
            mainNav.style.display = 'none';
            headerActions.style.display = 'flex';
        } else {
            mainNav.style.display = 'flex';
            headerActions.style.display = 'none';
        }
    };
    
    // اجرای اولیه
    updateMenuForMobile();
    
    // اجرا در تغییر سایز پنجره
    window.addEventListener('resize', updateMenuForMobile);
    
    // رویداد کلیک برای منو همبرگری
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        
        if (mainNav.style.display === 'flex' || mainNav.classList.contains('active')) {
            mainNav.style.display = 'none';
            mainNav.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        } else {
            mainNav.style.display = 'flex';
            mainNav.classList.add('active');
            menuToggle.innerHTML = '<i class="fas fa-times"></i>';
        }
    });
    
    // بستن منو با کلیک روی لینک‌ها
    const navLinks = mainNav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                mainNav.style.display = 'none';
                mainNav.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
            
            // اسکرول نرم به بخش مورد نظر
            const targetId = link.getAttribute('href');
            if (targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // بستن منو با کلیک خارج از آن
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
                mainNav.style.display = 'none';
                mainNav.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    });
    
    // جلوگیری از bubble up
    mainNav.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

// ==================== THEME MANAGEMENT ====================

function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    // آیکون‌های تم
    const moonIcon = '<i class="fas fa-moon"></i>';
    const sunIcon = '<i class="fas fa-sun"></i>';
    
    // بررسی تم ذخیره شده یا تنظیم پیش‌فرض
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    themeToggle.innerHTML = savedTheme === 'light' ? moonIcon : sunIcon;
    
    // تغییر تم با کلیک
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // اعمال تم جدید
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // تغییر آیکون
        themeToggle.innerHTML = newTheme === 'light' ? moonIcon : sunIcon;
        
        // انیمیشن برای دکمه
        themeToggle.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            themeToggle.style.transform = 'rotate(0deg)';
        }, 300);
    });
    
    // انیمیشن hover برای دکمه
    themeToggle.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1) rotate(15deg)';
    });
    
    themeToggle.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
    });
}

// ==================== SCROLL MANAGEMENT ====================

function initScroll() {
    // دکمه بازگشت به بالا
    const backToTop = document.getElementById('backToTop');
    if (!backToTop) return;
    
    // نمایش/مخفی کردن دکمه بر اساس اسکرول
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTop.style.display = 'flex';
            backToTop.style.opacity = '1';
        } else {
            backToTop.style.opacity = '0';
            setTimeout(() => {
                if (window.pageYOffset <= 300) {
                    backToTop.style.display = 'none';
                }
            }, 300);
        }
    });
    
    // اسکرول به بالا با کلیک
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // هدر ثابت با اسکرول
    const header = document.querySelector('.main-header');
    if (header) {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll <= 0) {
                header.style.boxShadow = 'none';
                return;
            }
            
            if (currentScroll > lastScroll && currentScroll > 100) {
                // اسکرول به پایین - مخفی کردن هدر
                header.style.transform = 'translateY(-100%)';
            } else {
                // اسکرول به بالا - نمایش هدر
                header.style.transform = 'translateY(0)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            }
            
            lastScroll = currentScroll;
        });
    }
    
    // اسکرول نرم برای anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ==================== CONTACT FORM MANAGEMENT ====================

function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // تغییر حالت دکمه به در حال ارسال
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> در حال ارسال...';
        submitBtn.disabled = true;
        
        try {
            // جمع‌آوری داده‌ها
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // ارسال درخواست به Formspree
            const response = await fetch(this.action, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: formData
            });
            
            if (response.ok) {
                // موفقیت آمیز
                showNotification('پیام شما با موفقیت ارسال شد! به زودی پاسخگو خواهم بود.', 'success');
                this.reset();
            } else {
                // خطا
                throw new Error('خطا در ارسال پیام');
            }
        } catch (error) {
            showNotification('خطا در ارسال پیام. لطفاً دوباره تلاش کنید.', 'error');
            console.error('خطای ارسال فرم:', error);
        } finally {
            // بازگرداندن دکمه به حالت اول
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ==================== MOBILE IMAGE MANAGEMENT ====================

function initMobileImages() {
    // تنظیمات تصاویر برای موبایل
    const updateImagesForMobile = () => {
        if (window.innerWidth <= 768) {
            // تصاویر پروفایل
            const profileImg = document.querySelector('.profile-img');
            if (profileImg) {
                profileImg.style.maxWidth = '280px';
                profileImg.style.height = 'auto';
                profileImg.style.margin = '0 auto';
            }
            
            // تصاویر کارت‌ها
            const productImages = document.querySelectorAll('.product-card img');
            productImages.forEach(img => {
                img.style.maxWidth = '100%';
                img.style.height = '200px';
                img.style.objectFit = 'cover';
            });
            
            // تصاویر گالری
            const galleryImages = document.querySelectorAll('.thumbnail-images img');
            galleryImages.forEach(img => {
                img.style.width = '60px';
                img.style.height = '60px';
            });
        }
    };
    
    // اجرای اولیه
    updateImagesForMobile();
    
    // اجرا در تغییر سایز
    window.addEventListener('resize', updateImagesForMobile);
    
    // تصحیح عکس‌های شکسته
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            const color = document.documentElement.getAttribute('data-theme') === 'light' ? 'F0FFF0' : '000000';
            const text = this.alt || 'تصویر';
            this.src = `https://via.placeholder.com/400x400/${color}/32CD32?text=${encodeURIComponent(text)}`;
            this.style.objectFit = 'cover';
        });
    });
}

// ==================== ANIMATIONS ====================

function initAnimations() {
    // انیمیشن تایپینگ
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        const text = typingElement.textContent;
        typingElement.textContent = '';
        typingElement.style.borderRight = '3px solid var(--secondary)';
        
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                typingElement.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                // چشمک زدن مکان‌نما
                setInterval(() => {
                    typingElement.style.borderRight = typingElement.style.borderRight === 'none' ? 
                        '3px solid var(--secondary)' : 'none';
                }, 500);
            }
        }
        
        // شروع با تاخیر
        setTimeout(typeWriter, 1000);
    }
    
    // انیمیشن مهارت‌ها هنگام اسکرول
    const skillItems = document.querySelectorAll('.skill-item');
    if (skillItems.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const skillBar = entry.target.querySelector('.skill-progress');
                    const skillLevel = entry.target.querySelector('.skill-level');
                    
                    if (skillBar && skillLevel) {
                        const width = skillLevel.textContent.replace('%', '');
                        skillBar.style.width = '0%';
                        
                        setTimeout(() => {
                            skillBar.style.transition = 'width 1.5s ease-in-out';
                            skillBar.style.width = width + '%';
                        }, 100);
                    }
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });
        
        skillItems.forEach(item => observer.observe(item));
    }
    
    // انیمیشن آمار
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalValue = parseInt(target.textContent);
                    let current = 0;
                    
                    const increment = finalValue / 50; // 50 فریم در 1 ثانیه
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= finalValue) {
                            current = finalValue;
                            clearInterval(timer);
                        }
                        target.textContent = Math.floor(current);
                    }, 20);
                    
                    observer.unobserve(target);
                }
            });
        }, { threshold: 0.5 });
        
        statNumbers.forEach(stat => observer.observe(stat));
    }
}

// ==================== NOTIFICATION SYSTEM ====================

function showNotification(message, type = 'success') {
    // حذف نوتیفیکیشن قبلی
    const existing = document.querySelector('.custom-notification');
    if (existing) existing.remove();
    
    // ایجاد نوتیفیکیشن جدید
    const notification = document.createElement('div');
    notification.className = `custom-notification ${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    notification.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // استایل‌دهی داینامیک
    const style = document.createElement('style');
    style.textContent = `
        .custom-notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--card-bg);
            border: 1px solid var(--border-light);
            border-right: 4px solid ${type === 'success' ? 'var(--secondary)' : '#ff4444'};
            color: var(--text);
            padding: 15px 20px;
            border-radius: var(--radius);
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 9999;
            box-shadow: var(--shadow-hover);
            transform: translateX(150%);
            transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            max-width: 350px;
            backdrop-filter: blur(10px);
        }
        
        .custom-notification.show {
            transform: translateX(0);
        }
        
        .custom-notification i {
            font-size: 1.2rem;
            color: ${type === 'success' ? 'var(--secondary)' : '#ff4444'};
        }
        
        .custom-notification span {
            flex: 1;
            font-size: 0.9rem;
        }
        
        .notification-close {
            background: transparent;
            border: none;
            color: var(--text-muted);
            cursor: pointer;
            padding: 5px;
            border-radius: 50%;
            transition: var(--transition);
        }
        
        .notification-close:hover {
            background: var(--card-hover);
            color: var(--text);
        }
        
        @media (max-width: 768px) {
            .custom-notification {
                top: 80px;
                right: 10px;
                left: 10px;
                max-width: calc(100% - 20px);
                transform: translateY(-150%);
            }
            
            .custom-notification.show {
                transform: translateY(0);
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // نمایش با تاخیر
    setTimeout(() => notification.classList.add('show'), 10);
    
    // بستن با کلیک
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    });
    
    // بستن خودکار
    setTimeout(() => {
        if (notification.parentNode) {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// ==================== UTILITY FUNCTIONS ====================

function consoleGuide() {
    console.log(`
    🚀 وبسایت مهندس ماهان ادهم قزوینی
    📧 ایمیل: mahan.neman2020@gmail.com
    📱 تلفن: ۰۹۹۰۲۲۷۹۷۰۲
    ✨ ویژگی‌ها:
    - طراحی واکنش‌گرا (Responsive)
    - حالت تاریک/روشن
    - انیمیشن‌های تعاملی
    - فرم تماس هوشمند
    - بهینه‌شده برای موبایل
    `);
}

// ==================== PERFORMANCE OPTIMIZATIONS ====================

// Debounce function برای بهینه‌سازی eventها
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

// Lazy loading برای تصاویر
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback برای مرورگرهای قدیمی
        images.forEach(img => {
            img.src = img.dataset.src;
        });
        // مدیریت منوی موبایل
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.querySelector('.main-nav');
    const themeToggle = document.getElementById('themeToggle');
    
    // مدیریت منوی موبایل
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = mainNav.classList.contains('active');
            
            if (isActive) {
                mainNav.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            } else {
                mainNav.classList.add('active');
                menuToggle.innerHTML = '<i class="fas fa-times"></i>';
            }
        });
        
        // بستن منو با کلیک روی لینک‌ها
        const navLinks = mainNav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
        
        // بستن منو با کلیک خارج از آن
        document.addEventListener('click', function(e) {
            if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
                mainNav.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
        
        // جلوگیری از bubble up
        mainNav.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // مدیریت تغییر تم
    if (themeToggle) {
        // بررسی تم ذخیره شده
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            updateThemeIcon(savedTheme);
        }
        
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            updateThemeIcon(newTheme);
            
            // انیمیشن برای دکمه
            this.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                this.style.transform = 'rotate(0deg)';
            }, 300);
        });
        
        function updateThemeIcon(theme) {
            if (theme === 'light') {
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            }
        }
    }
    
    // مدیریت دکمه بازگشت به بالا
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTop.style.display = 'flex';
            } else {
                backToTop.style.display = 'none';
            }
        });
        
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // مدیریت تصاویر برای موبایل
    function fixMobileImages() {
        if (window.innerWidth <= 768) {
            const profileImg = document.querySelector('.profile-img');
            if (profileImg) {
                profileImg.style.maxWidth = '280px';
                profileImg.style.height = 'auto';
            }
            
            const badges = document.querySelectorAll('.image-badge');
            badges.forEach(badge => {
                badge.style.position = 'relative';
                badge.style.bottom = 'auto';
                badge.style.right = 'auto';
                badge.style.margin = '-20px auto 20px';
                badge.style.width = '90%';
            });
        }
    }
    
    // اجرای اولیه
    fixMobileImages();
    
    // اجرا در تغییر سایز
    window.addEventListener('resize', fixMobileImages);
});
    }
}

// مدیریت حافظه - پاک کردن event listeners هنگام خروج از صفحه
window.addEventListener('beforeunload', function() {
    // پاک کردن timeoutها
    const highestTimeoutId = setTimeout(() => {}, 0);
    for (let i = 0; i < highestTimeoutId; i++) {
        clearTimeout(i);
    }
    
    // پاک کردن intervalها
    const highestIntervalId = setInterval(() => {}, 0);
    for (let i = 0; i < highestIntervalId; i++) {
        clearInterval(i);
    }
    
});

