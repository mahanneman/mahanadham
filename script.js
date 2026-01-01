// ==================== MOBILE MENU MANAGEMENT ====================
document.addEventListener('DOMContentLoaded', function() {
    // متغیرهای اصلی
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.querySelector('.main-nav');
    const themeToggle = document.getElementById('themeToggle');
    const cartToggle = document.getElementById('cartToggle');
    const backToTop = document.getElementById('backToTop');
    
    let menuOverlay = null;
    let isMobileMode = false;
    let cart = JSON.parse(localStorage.getItem('3dprint_cart')) || [];
    
    // ==================== سیستم منوی کشویی ====================
    
    // تنظیم حالت اولیه تم
    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        if (themeToggle) {
            themeToggle.innerHTML = savedTheme === 'light' 
                ? '<i class="fas fa-sun"></i>' 
                : '<i class="fas fa-moon"></i>';
        }
    }
    
    // ایجاد overlay برای منو
    function createMenuOverlay() {
        if (menuOverlay) return menuOverlay;
        
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
        
        menuOverlay.addEventListener('click', closeMobileMenu);
        return menuOverlay;
    }
    
    // باز کردن منو در موبایل
    function openMobileMenu() {
        console.log('🔓 باز کردن منو');
        
        // تنظیم استایل منو برای موبایل
        mainNav.style.cssText = `
            position: fixed !important;
            top: 0 !important;
            right: 0 !important;
            width: 85% !important;
            height: 100vh !important;
            background: rgba(20, 20, 20, 0.98) !important;
            backdrop-filter: blur(20px) !important;
            border-left: 1px solid var(--secondary-color) !important;
            border-radius: 0 !important;
            padding: 80px 20px 30px !important;
            flex-direction: column !important;
            gap: 15px !important;
            display: flex !important;
            z-index: 9999 !important;
            transform: translateX(0) !important;
            transition: transform 0.3s ease !important;
            box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5) !important;
        `;
        
        mainNav.classList.add('active');
        menuToggle.innerHTML = '<i class="fas fa-times"></i>';
        document.body.style.overflow = 'hidden';
        
        // نمایش overlay
        menuOverlay = createMenuOverlay();
        menuOverlay.style.display = 'block';
        setTimeout(() => {
            menuOverlay.style.opacity = '1';
        }, 10);
    }
    
    // بستن منو
    function closeMobileMenu() {
        console.log('🔒 بستن منو');
        
        mainNav.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
            mainNav.classList.remove('active');
            mainNav.style.cssText = `
                position: fixed;
                top: 70px;
                right: 20px;
                background: rgba(20, 20, 20, 0.95);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(0, 255, 170, 0.2);
                border-radius: 15px;
                padding: 15px;
                flex-direction: column;
                gap: 10px;
                width: 200px;
                display: none;
                z-index: 1001;
            `;
            
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = 'auto';
            
            // مخفی کردن overlay
            if (menuOverlay) {
                menuOverlay.style.opacity = '0';
                setTimeout(() => {
                    menuOverlay.style.display = 'none';
                }, 300);
            }
        }, 300);
    }
    
    // بررسی حالت موبایل/دسکتاپ
    function checkViewportMode() {
        isMobileMode = window.innerWidth <= 768;
        
        if (isMobileMode) {
            console.log('📱 حالت موبایل');
            
            // تنظیم دکمه منو
            if (menuToggle) {
                menuToggle.style.display = 'flex';
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
            
            // مخفی کردن منو در ابتدا
            if (mainNav) {
                mainNav.style.display = 'none';
            }
            
        } else {
            console.log('🖥️ حالت دسکتاپ');
            
            // مخفی کردن دکمه منو
            if (menuToggle) {
                menuToggle.style.display = 'none';
            }
            
            // نمایش منو در دسکتاپ
            if (mainNav) {
                mainNav.style.cssText = `
                    position: fixed;
                    top: 70px;
                    right: 20px;
                    background: rgba(20, 20, 20, 0.95);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(0, 255, 170, 0.2);
                    border-radius: 15px;
                    padding: 15px;
                    flex-direction: column;
                    gap: 10px;
                    width: 200px;
                    display: none;
                    z-index: 1001;
                `;
                mainNav.classList.remove('active');
            }
            
            // حذف overlay در دسکتاپ
            if (menuOverlay) {
                menuOverlay.remove();
                menuOverlay = null;
            }
        }
    }
    
    // ==================== مدیریت رویدادهای منو ====================
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (isMobileMode) {
                const isActive = mainNav.classList.contains('active');
                if (isActive) {
                    closeMobileMenu();
                } else {
                    openMobileMenu();
                }
            } else {
                // در دسکتاپ: نمایش/مخفی کردن منو
                const isVisible = mainNav.style.display === 'flex';
                if (isVisible) {
                    mainNav.style.display = 'none';
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                } else {
                    mainNav.style.display = 'flex';
                    menuToggle.innerHTML = '<i class="fas fa-times"></i>';
                }
            }
        });
        
        // بستن منو با کلیک روی لینک‌ها
        const navLinks = mainNav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                if (isMobileMode && mainNav.classList.contains('active')) {
                    closeMobileMenu();
                    
                    // اگر لینک داخلی است، اسکرول ملایم
                    if (this.getAttribute('href').startsWith('#')) {
                        e.preventDefault();
                        const targetId = this.getAttribute('href');
                        const targetElement = document.querySelector(targetId);
                        if (targetElement) {
                            setTimeout(() => {
                                window.scrollTo({
                                    top: targetElement.offsetTop - 80,
                                    behavior: 'smooth'
                                });
                            }, 300);
                        }
                    }
                }
            });
        });
    }
    
    // بستن منو با کلیک خارج
    document.addEventListener('click', function(e) {
        if (mainNav && mainNav.classList.contains('active') && isMobileMode) {
            if (!mainNav.contains(e.target) && e.target !== menuToggle) {
                closeMobileMenu();
            }
        }
        
        // در دسکتاپ: بستن منو با کلیک خارج
        if (!isMobileMode && mainNav && mainNav.style.display === 'flex') {
            if (!mainNav.contains(e.target) && e.target !== menuToggle) {
                mainNav.style.display = 'none';
                if (menuToggle) {
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        }
    });
    
    // بستن با کلید ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (isMobileMode && mainNav.classList.contains('active')) {
                closeMobileMenu();
            } else if (!isMobileMode && mainNav.style.display === 'flex') {
                mainNav.style.display = 'none';
                if (menuToggle) {
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }
        }
    });
    
    // ==================== سیستم حالت روز/شب ====================
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            // تغییر تم
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // تغییر آیکون
            if (newTheme === 'light') {
                this.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                this.innerHTML = '<i class="fas fa-moon"></i>';
            }
            
            // انیمیشن چرخش
            this.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                this.style.transform = 'rotate(0deg)';
            }, 300);
            
            console.log('🎨 تغییر تم به:', newTheme);
        });
    }
    
    // ==================== مدیریت سبد خرید ====================
    
    function updateCartCounter() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }
    
    function showCartNotification(productName) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>${productName} به سبد خرید اضافه شد</span>
        `;
        
        document.body.appendChild(notification);
        
        // استایل نوتیفیکیشن
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--card-bg);
            color: var(--text-color);
            padding: 15px 20px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 15px;
            z-index: 10000;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            border-right: 4px solid var(--secondary-color);
            max-width: 350px;
            transform: translateX(150%);
            transition: transform 0.3s ease;
        `;
        
        // نمایش
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // حذف خودکار
        setTimeout(() => {
            notification.style.transform = 'translateX(150%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
    
    // رویداد دکمه سبد خرید
    if (cartToggle) {
        cartToggle.addEventListener('click', function() {
            const cartSidebar = document.querySelector('.cart-sidebar');
            if (cartSidebar) {
                cartSidebar.classList.toggle('active');
            }
        });
    }
    
    // ==================== دکمه بازگشت به بالا ====================
    
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
    
    // ==================== مدیریت تغییر سایز پنجره ====================
    
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            checkViewportMode();
            updateCartCounter();
        }, 100);
    });
    
    // ==================== اجرای اولیه ====================
    
    // اجرای توابع اولیه
    initTheme();
    checkViewportMode();
    updateCartCounter();
    
    // لود تصاویر محصولات
    const productImages = document.querySelectorAll('img[src^="photo3dprint/"]');
    productImages.forEach(img => {
        img.onerror = function() {
            this.src = `https://via.placeholder.com/300x300/000000/32CD32?text=محصول`;
        };
    });
    
    console.log('✅ تمام اسکریپت‌ها با موفقیت لود شدند');
    
    // راهنمای کنسول برای توسعه
    console.log(`
    🛠️  راهنمای توسعه:
    📱 حالت فعلی: ${isMobileMode ? 'موبایل' : 'دسکتاپ'}
    🎨 تم فعلی: ${document.documentElement.getAttribute('data-theme')}
    🛒 تعداد آیتم‌های سبد خرید: ${cart.length}
    📞 پشتیبانی: ۰۹۹۰۲۲۷۹۷۰۲
    ✉️  تلگرام: @mahanenman
    `);
});

// ==================== PRODUCT MANAGEMENT ====================
// اطلاعات محصولات
const productsData = {
    gearbox: {
        id: 1,
        name: "گیربکس 20x20",
        price: 150000,
        oldPrice: 180000,
        image: "photo3dprint/gearbox.png",
        category: ["gearbox", "pla", "mechanical"],
        specs: {
            material: "PLA",
            ratio: "1:20",
            size: "20x20x30mm",
            torque: "2Nm"
        },
        stock: 15
    },
    pump: {
        id: 2,
        name: "پمپ آب ۱۲ ولت",
        price: 250000,
        image: "photo3dprint/pump.png",
        category: ["pump", "pla", "mechanical"],
        specs: {
            material: "PLA+",
            voltage: "12V",
            flow: "5L/min",
            torque: "2Nm"
        },
        stock: 8
    },
    gearset: {
        id: 3,
        name: "مجموعه چرخدنده",
        price: 90000,
        image: "photo3dprint/gearset.png",
        category: ["gearbox", "abs", "mechanical"],
        specs: {
            material: "ABS",
            pieces: "5",
            strength: "High"
        },
        stock: 20
    },
    clutch: {
        id: 4,
        name: "کلاچ مکانیکی",
        price: 120000,
        image: "photo3dprint/clutch.png",
        category: ["mechanical", "abs"],
        specs: {
            material: "ABS",
            diameter: "30mm",
            torque: "1.5Nm"
        },
        stock: 12
    },
    coupling: {
        id: 5,
        name: "کوپلینگ محوری",
        price: 75000,
        oldPrice: 90000,
        image: "photo3dprint/coupling.png",
        category: ["mechanical", "pla"],
        specs: {
            material: "PLA",
            diameter: "8mm",
            length: "25mm"
        },
        stock: 25
    },
    bracket: {
        id: 6,
        name: "براکت نصب موتور",
        price: 50000,
        image: "photo3dprint/bracket.png",
        category: ["mechanical", "abs"],
        specs: {
            material: "ABS",
            size: "40x40mm",
            holes: "M3 x4"
        },
        stock: 30
    }
};

// سبد خرید
let cart = JSON.parse(localStorage.getItem('3dprint_cart')) || [];

// فیلتر و مرتب‌سازی محصولات
document.addEventListener('DOMContentLoaded', function() {
    // فیلتر محصولات
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            productCards.forEach(card => {
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
        });
    });
    
    // مرتب‌سازی محصولات
    const sortSelect = document.getElementById('sort');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const productsGrid = document.getElementById('productsGrid');
            const productCards = Array.from(document.querySelectorAll('.product-card'));
            
            productCards.sort((a, b) => {
                const priceA = parseInt(a.querySelector('.price').textContent.replace(/[^0-9]/g, ''));
                const priceB = parseInt(b.querySelector('.price').textContent.replace(/[^0-9]/g, ''));
                
                switch(this.value) {
                    case 'price-low': return priceA - priceB;
                    case 'price-high': return priceB - priceA;
                    default: return 0;
                }
            });
            
            productsGrid.innerHTML = '';
            productCards.forEach(card => {
                productsGrid.appendChild(card);
            });
        });
    }
});

// ==================== FUNCTIONS FOR PRODUCT PAGES ====================

// افزودن به سبد خرید
function addToCart(productId, quantity = 1) {
    const product = productsData[productId];
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    localStorage.setItem('3dprint_cart', JSON.stringify(cart));
    updateCartDisplay();
    
    // نمایش نوتیفیکیشن
    const event = new CustomEvent('showCartNotification', { detail: product.name });
    document.dispatchEvent(event);
}

// حذف از سبد خرید
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('3dprint_cart', JSON.stringify(cart));
    updateCartDisplay();
}

// به‌روزرسانی نمایش سبد خرید
function updateCartDisplay() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    // رویداد برای به‌روزرسانی صفحه
    const event = new CustomEvent('cartUpdated', { detail: { cart: cart, totalItems: totalItems } });
    document.dispatchEvent(event);
}

// رویداد برای نمایش نوتیفیکیشن
document.addEventListener('showCartNotification', function(e) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${e.detail} به سبد خرید اضافه شد</span>
    `;
    
    document.body.appendChild(notification);
    
    // استایل و نمایش نوتیفیکیشن
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--card-bg);
        color: var(--text-color);
        padding: 15px 20px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 15px;
        z-index: 10000;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        border-right: 4px solid var(--secondary-color);
        max-width: 350px;
        transform: translateX(150%);
        transition: transform 0.3s ease;
    `;
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
});

// ==================== UTILITY FUNCTIONS ====================

// تابع دیباگ برای منو
function debugMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.querySelector('.main-nav');
    
    console.log('=== دیباگ منو ===');
    console.log('عرض پنجره:', window.innerWidth);
    console.log('دکمه منو:', menuToggle ? 'موجود' : 'مفقود');
    console.log('ناوبری اصلی:', mainNav ? 'موجود' : 'مفقود');
    
    if (menuToggle) {
        console.log('نمایش دکمه:', menuToggle.style.display);
        console.log('آیکون:', menuToggle.innerHTML);
    }
    
    if (mainNav) {
        console.log('نمایش منو:', mainNav.style.display);
        console.log('کلاس‌ها:', mainNav.classList);
    }
}

// تابع برای لود عکس‌های جایگزین
function loadFallbackImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.onerror = function() {
            const altText = this.alt || 'تصویر محصول';
            this.src = `https://via.placeholder.com/400x300/000000/32CD32?text=${encodeURIComponent(altText)}`;
        };
    });
}

// اجرای اولیه
window.addEventListener('load', function() {
    loadFallbackImages();
    updateCartDisplay();
});
