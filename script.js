// ==================== MOBILE MENU FIX ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ DOM Loaded');
    
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.querySelector('.main-nav');
    const themeToggle = document.getElementById('themeToggle');
    
    console.log('Menu Toggle:', menuToggle);
    console.log('Main Nav:', mainNav);
    console.log('Theme Toggle:', themeToggle);
    
    // ایجاد overlay برای بستن منو
    let menuOverlay = null;
    
    function createOverlay() {
        menuOverlay = document.createElement('div');
        menuOverlay.className = 'menu-overlay';
        menuOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            backdrop-filter: blur(5px);
            z-index: 9998;
            display: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(menuOverlay);
        
        menuOverlay.addEventListener('click', closeMenu);
        return menuOverlay;
    }
    
    function openMenu() {
        console.log('🔓 Opening menu');
        mainNav.style.right = '0';
        mainNav.classList.add('active');
        menuToggle.innerHTML = '<i class="fas fa-times"></i>';
        document.body.style.overflow = 'hidden';
        
        if (!menuOverlay) {
            menuOverlay = createOverlay();
        }
        menuOverlay.style.display = 'block';
        setTimeout(() => {
            menuOverlay.style.opacity = '1';
        }, 10);
    }
    
    function closeMenu() {
        console.log('🔒 Closing menu');
        mainNav.style.right = '-100%';
        mainNav.classList.remove('active');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.style.overflow = 'auto';
        
        if (menuOverlay) {
            menuOverlay.style.opacity = '0';
            setTimeout(() => {
                menuOverlay.style.display = 'none';
            }, 300);
        }
    }
    
    function checkMobileMenu() {
        if (window.innerWidth <= 768) {
            console.log('📱 Mobile Mode');
            
            if (menuToggle) {
                menuToggle.style.display = 'flex';
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
            
            if (mainNav) {
                // فقط در صورت نیاز استایل‌ها را تنظیم کن
                if (!mainNav.hasAttribute('data-mobile-styled')) {
                    mainNav.style.cssText = `
                        display: flex !important;
                        position: fixed;
                        top: 0;
                        right: -100%;
                        width: 85%;
                        height: 100vh;
                        background-color: var(--darker);
                        backdrop-filter: blur(20px);
                        border-left: 1px solid var(--border-light);
                        padding: 80px 20px 30px;
                        flex-direction: column;
                        gap: 5px;
                        transition: right 0.3s ease;
                        z-index: 9999;
                        overflow-y: auto;
                        box-shadow: -10px 0 30px rgba(0, 0, 0, 0.3);
                        border-radius: 0;
                    `;
                    mainNav.setAttribute('data-mobile-styled', 'true');
                }
                
                // اضافه کردن event listener برای لینک‌ها
                const navLinks = mainNav.querySelectorAll('.nav-link');
                navLinks.forEach(link => {
                    link.addEventListener('click', function(e) {
                        if (window.innerWidth <= 768) {
                            // اگر لینک داخلی است
                            if (this.getAttribute('href') && this.getAttribute('href').startsWith('#')) {
                                e.preventDefault();
                                const targetId = this.getAttribute('href');
                                const targetElement = document.querySelector(targetId);
                                if (targetElement) {
                                    closeMenu();
                                    setTimeout(() => {
                                        window.scrollTo({
                                            top: targetElement.offsetTop - 80,
                                            behavior: 'smooth'
                                        });
                                    }, 300);
                                }
                            } else {
                                // برای لینک‌های دیگر
                                closeMenu();
                            }
                        }
                    });
                });
            }
        } else {
            console.log('🖥️ Desktop Mode');
            
            if (menuToggle) {
                menuToggle.style.display = 'none';
            }
            
            if (mainNav) {
                mainNav.style.cssText = `
                    display: flex !important;
                    position: static;
                    width: auto;
                    height: auto;
                    background-color: transparent;
                    padding: 4px;
                    flex-direction: row;
                    gap: 2px;
                    transition: none;
                    z-index: auto;
                    overflow-y: visible;
                    box-shadow: none;
                    border-radius: 0;
                    right: auto;
                `;
                mainNav.classList.remove('active');
                mainNav.removeAttribute('data-mobile-styled');
                document.body.style.overflow = 'auto';
            }
            
            // پاک کردن overlay در حالت دسکتاپ
            if (menuOverlay) {
                menuOverlay.remove();
                menuOverlay = null;
            }
        }
    }
    
    // رویداد کلیک برای دکمه منو
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = mainNav.classList.contains('active') || mainNav.style.right === '0px';
            
            if (isActive) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }
    
    // بستن منو با کلیک خارج از منو
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && mainNav && mainNav.classList.contains('active')) {
            if (!mainNav.contains(e.target) && e.target !== menuToggle && 
                !menuToggle.contains(e.target)) {
                closeMenu();
            }
        }
    });
    
    // بستن منو با کلید ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mainNav && mainNav.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // تغییر سایز پنجره
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            checkMobileMenu();
        }, 100);
    });
    
    // تم تیره/روشن
    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        if (savedTheme === 'light') {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
        
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            if (newTheme === 'light') {
                this.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                this.innerHTML = '<i class="fas fa-moon"></i>';
            }
            
            this.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                this.style.transform = 'rotate(0deg)';
            }, 300);
        });
    }
    
    // دکمه بازگشت به بالا
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
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
    
    // اجرای اولیه
    checkMobileMenu();
    
    console.log('✅ All scripts loaded successfully');
});
