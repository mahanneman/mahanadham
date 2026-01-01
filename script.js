// ==================== MOBILE MENU FIX ====================

document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM Loaded');
    
    // 1. ابتدا منو و دکمه‌ها رو پیدا کنیم
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.querySelector('.main-nav');
    const themeToggle = document.getElementById('themeToggle');
    
    console.log('Menu Toggle:', menuToggle);
    console.log('Main Nav:', mainNav);
    console.log('Theme Toggle:', themeToggle);
    
    // 2. اول مطمئن بشیم دکمه منو در موبایل نمایش داده بشه
    function checkMobileMenu() {
        if (window.innerWidth <= 768) {
            console.log('📱 Mobile Mode');
            
            // نمایش دکمه منو
            if (menuToggle) {
                menuToggle.style.display = 'flex';
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
            
            // مخفی کردن منوی اصلی
            if (mainNav) {
                mainNav.style.display = 'none';
                mainNav.style.position = 'fixed';
                mainNav.style.top = '0';
                mainNav.style.right = '-100%';
                mainNav.style.width = '85%';
                mainNav.style.height = '100vh';
                mainNav.style.backgroundColor = 'var(--darker)';
                mainNav.style.backdropFilter = 'blur(20px)';
                mainNav.style.borderLeft = '1px solid var(--border-light)';
                mainNav.style.padding = '80px 20px 30px';
                mainNav.style.flexDirection = 'column';
                mainNav.style.gap = '5px';
                mainNav.style.transition = 'right 0.3s ease';
                mainNav.style.zIndex = '9999';
                mainNav.style.overflowY = 'auto';
                mainNav.style.boxShadow = '-10px 0 30px rgba(0, 0, 0, 0.3)';
                mainNav.style.borderRadius = '0';
            }
        } else {
            console.log('🖥️ Desktop Mode');
            
            // مخفی کردن دکمه منو
            if (menuToggle) {
                menuToggle.style.display = 'none';
            }
            
            // نمایش منوی اصلی
            if (mainNav) {
                mainNav.style.display = 'flex';
                mainNav.style.position = 'static';
                mainNav.style.width = 'auto';
                mainNav.style.height = 'auto';
                mainNav.style.backgroundColor = '';
                mainNav.style.padding = '4px';
                mainNav.style.flexDirection = 'row';
                mainNav.style.gap = '2px';
                mainNav.style.transition = 'none';
            }
        }
    }
    
    // 3. مدیریت رویداد کلیک روی دکمه منو
    if (menuToggle && mainNav) {
        console.log('🎯 Setting up menu click event');
        
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎯 Menu button clicked');
            
            // بررسی وضعیت فعلی منو
            const isActive = mainNav.style.right === '0px' || mainNav.classList.contains('active');
            console.log('Is menu active?', isActive);
            
            if (isActive) {
                // بستن منو
                mainNav.style.right = '-100%';
                mainNav.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                document.body.style.overflow = 'auto';
                console.log('🔒 Closing menu');
            } else {
                // باز کردن منو
                mainNav.style.right = '0';
                mainNav.classList.add('active');
                menuToggle.innerHTML = '<i class="fas fa-times"></i>';
                mainNav.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                console.log('🔓 Opening menu');
            }
        });
        
        // 4. بستن منو با کلیک روی لینک‌ها
        const navLinks = mainNav.querySelectorAll('.nav-link');
        console.log('Found nav links:', navLinks.length);
        
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                console.log('🔗 Nav link clicked:', this.href);
                
                // اگر لینک خارجی است یا به صفحه دیگری می‌رود
                if (this.getAttribute('href').includes('http') || 
                    this.getAttribute('href').includes('.html') ||
                    this.getAttribute('href').startsWith('#')) {
                    
                    // بستن منو
                    mainNav.style.right = '-100%';
                    mainNav.classList.remove('active');
                    if (menuToggle) {
                        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                    document.body.style.overflow = 'auto';
                    
                    console.log('🔒 Closing menu after link click');
                    
                    // اگر لینک داخلی است، اسکرول کن
                    if (this.getAttribute('href').startsWith('#')) {
                        e.preventDefault();
                        const targetId = this.getAttribute('href');
                        const targetElement = document.querySelector(targetId);
                        if (targetElement) {
                            window.scrollTo({
                                top: targetElement.offsetTop - 80,
                                behavior: 'smooth'
                            });
                        }
                    }
                }
            });
        });
        
        // 5. بستن منو با کلیک روی overlay
        // ایجاد overlay دینامیک
        let menuOverlay = document.querySelector('.menu-overlay');
        if (!menuOverlay) {
            menuOverlay = document.createElement('div');
            menuOverlay.className = 'menu-overlay';
            document.body.appendChild(menuOverlay);
            
            // استایل overlay
            menuOverlay.style.position = 'fixed';
            menuOverlay.style.top = '0';
            menuOverlay.style.left = '0';
            menuOverlay.style.width = '100%';
            menuOverlay.style.height = '100%';
            menuOverlay.style.background = 'rgba(0, 0, 0, 0.7)';
            menuOverlay.style.zIndex = '9998';
            menuOverlay.style.backdropFilter = 'blur(5px)';
            menuOverlay.style.display = 'none';
            menuOverlay.style.transition = 'opacity 0.3s ease';
            
            // رویداد کلیک روی overlay
            menuOverlay.addEventListener('click', function() {
                mainNav.style.right = '-100%';
                mainNav.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                this.style.display = 'none';
                document.body.style.overflow = 'auto';
                console.log('🔒 Closing menu via overlay');
            });
        }
        
        // 6. به‌روزرسانی overlay هنگام باز شدن منو
        menuToggle.addEventListener('click', function() {
            setTimeout(() => {
                const isActive = mainNav.style.right === '0px' || mainNav.classList.contains('active');
                if (menuOverlay) {
                    if (isActive) {
                        menuOverlay.style.display = 'block';
                        setTimeout(() => {
                            menuOverlay.style.opacity = '1';
                        }, 10);
                    } else {
                        menuOverlay.style.opacity = '0';
                        setTimeout(() => {
                            menuOverlay.style.display = 'none';
                        }, 300);
                    }
                }
            }, 10);
        });
    }
    
    // 7. مدیریت تغییر تم
    if (themeToggle) {
        console.log('🌙 Setting up theme toggle');
        
        // تنظیم تم اولیه
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        // آیکون تم
        if (savedTheme === 'light') {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
        
        // رویداد تغییر تم
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            console.log('Changing theme from', currentTheme, 'to', newTheme);
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            if (newTheme === 'light') {
                this.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                this.innerHTML = '<i class="fas fa-moon"></i>';
            }
            
            // انیمیشن
            this.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                this.style.transform = 'rotate(0deg)';
            }, 300);
        });
    }
    
    // 8. دکمه بازگشت به بالا
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        console.log('⬆️ Setting up back to top');
        
        window.addEventListener('scroll', function() {
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
        
        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // 9. اجرای اولیه برای موبایل
    checkMobileMenu();
    
    // 10. بررسی دوباره هنگام تغییر سایز پنجره
    window.addEventListener('resize', function() {
        console.log('🔄 Window resized:', window.innerWidth);
        checkMobileMenu();
    });
    
    // 11. بستن منو با کلید ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mainNav && mainNav.classList.contains('active')) {
            mainNav.style.right = '-100%';
            mainNav.classList.remove('active');
            if (menuToggle) {
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
            document.body.style.overflow = 'auto';
            
            // مخفی کردن overlay
            const menuOverlay = document.querySelector('.menu-overlay');
            if (menuOverlay) {
                menuOverlay.style.opacity = '0';
                setTimeout(() => {
                    menuOverlay.style.display = 'none';
                }, 300);
            }
            
            console.log('🔒 Closing menu via ESC key');
        }
    });
    
    // 12. تصحیح مشکل badge روی عکس در موبایل
    function fixMobileBadge() {
        if (window.innerWidth <= 768) {
            const imageBadge = document.querySelector('.image-badge');
            if (imageBadge) {
                imageBadge.style.position = 'relative';
                imageBadge.style.bottom = 'auto';
                imageBadge.style.right = 'auto';
                imageBadge.style.margin = '15px auto 30px';
                imageBadge.style.width = 'auto';
                imageBadge.style.maxWidth = '250px';
                imageBadge.style.display = 'inline-flex';
                imageBadge.style.fontSize = '0.9rem';
                imageBadge.style.padding = '10px 20px';
                imageBadge.style.transform = 'none';
            }
        }
    }
    
    // اجرای اولیه
    fixMobileBadge();
    window.addEventListener('resize', fixMobileBadge);
    
    console.log('✅ All scripts loaded successfully');
});

// 13. تابع برای دیباگ کردن
function debugMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.querySelector('.main-nav');
    
    console.log('=== MENU DEBUG ===');
    console.log('Window width:', window.innerWidth);
    console.log('Menu toggle exists:', !!menuToggle);
    console.log('Main nav exists:', !!mainNav);
    
    if (menuToggle) {
        console.log('Menu toggle display:', menuToggle.style.display);
        console.log('Menu toggle HTML:', menuToggle.innerHTML);
    }
    
    if (mainNav) {
        console.log('Main nav display:', mainNav.style.display);
        console.log('Main nav position:', mainNav.style.position);
        console.log('Main nav right:', mainNav.style.right);
        console.log('Main nav classes:', mainNav.classList);
    }
    
    // تست کلیک
    if (menuToggle) {
        console.log('Clicking menu toggle...');
        menuToggle.click();
        setTimeout(() => {
            console.log('After click - Main nav right:', mainNav.style.right);
        }, 100);
    }
}

// 14. تست سریع
setTimeout(() => {
    console.log('🧪 Running quick test...');
    debugMenu();
}, 1000);
