// ==================== 3D PRINT SHOP - MAIN SCRIPT ====================
// ترکیب و بهبود دو اسکریپت اصلی

document.addEventListener('DOMContentLoaded', function() {
    console.log('🛠️  در حال راه‌اندازی فروشگاه پرینتر سه بعدی...');
    
    // ==================== متغیرهای اصلی ====================
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.querySelector('.main-nav');
    const themeToggle = document.getElementById('themeToggle');
    const cartToggle = document.getElementById('cartToggle');
    const backToTop = document.getElementById('backToTop');
    
    let menuOverlay = null;
    let isMobileMode = false;
    
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
    
    // ==================== سیستم مدیریت تم ====================
    
    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        if (themeToggle) {
            themeToggle.innerHTML = savedTheme === 'light' 
                ? '<i class="fas fa-sun"></i>' 
                : '<i class="fas fa-moon"></i>';
        }
    }
    
    // ==================== سیستم مدیریت منو ====================
    
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
            
            if (menuToggle) {
                menuToggle.style.display = 'flex';
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
            
            if (mainNav) {
                mainNav.style.display = 'none';
            }
            
        } else {
            console.log('🖥️ حالت دسکتاپ');
            
            if (menuToggle) {
                menuToggle.style.display = 'none';
            }
            
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
            
            if (menuOverlay) {
                menuOverlay.remove();
                menuOverlay = null;
            }
        }
    }
    
    // ==================== مدیریت محصولات ====================
    
    // فیلتر محصولات
    function initProductFilters() {
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
    }
    
    // مرتب‌سازی محصولات
    function initProductSorting() {
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
                        case 'newest': return 0;
                        case 'popular': return 0;
                        default: return 0;
                    }
                });
                
                productsGrid.innerHTML = '';
                productCards.forEach(card => {
                    productsGrid.appendChild(card);
                });
            });
        }
    }
    
    // ==================== مدیریت سبد خرید ====================
    
    function initCart() {
        // به‌روزرسانی شمارنده سبد خرید
        updateCartCounter();
        
        // دکمه‌های افزودن به سبد
        const addToCartButtons = document.querySelectorAll('.add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-product');
                addToCart(productId);
            });
        });
        
        // دکمه افزودن در صفحه جزئیات
        const addToCartDetail = document.querySelector('.add-to-cart-detail');
        if (addToCartDetail) {
            addToCartDetail.addEventListener('click', function() {
                const productId = getCurrentProductId();
                const quantity = parseInt(document.getElementById('quantity')?.value || 1);
                addToCart(productId, quantity);
            });
        }
        
        // دکمه خرید سریع
        const buyNowBtn = document.getElementById('buyNowBtn');
        if (buyNowBtn) {
            buyNowBtn.addEventListener('click', function() {
                const productId = getCurrentProductId();
                const quantity = parseInt(document.getElementById('quantity')?.value || 1);
                addToCart(productId, quantity);
                window.location.href = 'checkout.html';
            });
        }
        
        // دکمه نمایش/بستن سبد خرید
        const cartSidebar = document.querySelector('.cart-sidebar');
        const cartClose = document.querySelector('.cart-close');
        
        if (cartToggle && cartSidebar) {
            cartToggle.addEventListener('click', () => {
                cartSidebar.classList.toggle('active');
            });
        }
        
        if (cartClose) {
            cartClose.addEventListener('click', () => {
                cartSidebar.classList.remove('active');
            });
        }
        
        // دکمه پاک کردن سبد
        const clearCartBtn = document.getElementById('clearCartBtn');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', clearCart);
        }
        
        // دکمه تکمیل خرید
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', checkout);
        }
    }
    
    function getCurrentProductId() {
        const path = window.location.pathname;
        if (path.includes('gearbox')) return 'gearbox';
        if (path.includes('pump')) return 'pump';
        if (path.includes('gearset')) return 'gearset';
        if (path.includes('clutch')) return 'clutch';
        if (path.includes('coupling')) return 'coupling';
        if (path.includes('bracket')) return 'bracket';
        return '';
    }
    
    // افزودن محصول به سبد
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
        showNotification(`«${product.name}» به سبد خرید اضافه شد`);
        
        // باز کردن سبد خرید
        const cartSidebar = document.querySelector('.cart-sidebar');
        if (cartSidebar) {
            cartSidebar.classList.add('active');
        }
    }
    
    // حذف از سبد
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('3dprint_cart', JSON.stringify(cart));
        updateCartDisplay();
        showNotification('محصول از سبد خرید حذف شد');
    }
    
    // پاک کردن سبد
    function clearCart() {
        if (cart.length === 0) return;
        
        if (confirm('آیا مطمئن هستید که می‌خواهید سبد خرید را خالی کنید؟')) {
            cart = [];
            localStorage.removeItem('3dprint_cart');
            updateCartDisplay();
            showNotification('سبد خرید خالی شد');
        }
    }
    
    // به‌روزرسانی نمایش سبد
    function updateCartDisplay() {
        updateCartCounter();
        
        const cartItems = document.querySelector('.cart-items');
        if (cartItems) {
            cartItems.innerHTML = '';
            
            if (cart.length === 0) {
                cartItems.innerHTML = '<p class="empty-cart">سبد خرید شما خالی است</p>';
            } else {
                cart.forEach(item => {
                    const itemElement = document.createElement('div');
                    itemElement.className = 'cart-item';
                    itemElement.innerHTML = `
                        <div class="cart-item-image">
                            <img src="${item.image}" alt="${item.name}" 
                                 onerror="this.src='https://via.placeholder.com/60x60/000000/32CD32?text=محصول'">
                        </div>
                        <div class="cart-item-info">
                            <div class="cart-item-title">${item.name}</div>
                            <div class="cart-item-price">${item.price.toLocaleString()} تومان</div>
                            <div class="cart-item-quantity">تعداد: ${item.quantity}</div>
                        </div>
                        <button class="cart-item-remove" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    `;
                    cartItems.appendChild(itemElement);
                });
                
                document.querySelectorAll('.cart-item-remove').forEach(button => {
                    button.addEventListener('click', function() {
                        const productId = this.getAttribute('data-id');
                        removeFromCart(productId);
                    });
                });
            }
        }
        
        const totalPrice = document.querySelector('.total-price');
        if (totalPrice) {
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            totalPrice.textContent = total.toLocaleString() + ' تومان';
        }
    }
    
    // به‌روزرسانی شمارنده
    function updateCartCounter() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }
    
    // تکمیل خرید
    function checkout() {
        if (cart.length === 0) {
            showNotification('سبد خرید شما خالی است', 'error');
            return;
        }
        
        const orderDetails = cart.map(item => 
            `${item.name} × ${item.quantity}: ${(item.price * item.quantity).toLocaleString()} تومان`
        ).join('\n');
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // اطلاعات مشتری
        const customerName = prompt('لطفا نام خود را وارد کنید:');
        if (!customerName) return;
        
        const customerPhone = prompt('لطفا شماره تماس خود را وارد کنید:');
        if (!customerPhone) return;
        
        const customerEmail = prompt('لطفا ایمیل خود را وارد کنید: (اختیاری)') || '';
        const customerAddress = prompt('لطفا آدرس ارسال را وارد کنید:');
        if (!customerAddress) return;
        
        // ذخیره سفارش
        const orderData = {
            products: cart,
            total: total,
            customer: {
                name: customerName,
                phone: customerPhone,
                email: customerEmail,
                address: customerAddress
            },
            date: new Date().toISOString()
        };
        
        // ذخیره سفارش در localStorage
        const orders = JSON.parse(localStorage.getItem('3dprint_orders')) || [];
        orders.push(orderData);
        localStorage.setItem('3dprint_orders', JSON.stringify(orders));
        
        alert(`سفارش شما ثبت شد!\n\n${orderDetails}\n\nجمع کل: ${total.toLocaleString()} تومان\n\nبه زودی با شما تماس گرفته خواهد شد.`);
        
        // پاک کردن سبد خرید
        clearCart();
        
        // بستن سبد خرید
        const cartSidebar = document.querySelector('.cart-sidebar');
        if (cartSidebar) {
            cartSidebar.classList.remove('active');
        }
    }
    
    // ==================== نمایش نوتیفیکیشن ====================
    
    function showNotification(message, type = 'success') {
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }
    
    // استایل نوتیفیکیشن
    const notificationStyle = document.createElement('style');
    notificationStyle.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            left: 20px;
            background: var(--card-bg);
            color: var(--text-color);
            padding: 15px 20px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 15px;
            z-index: 3000;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            transform: translateX(-150%);
            transition: transform 0.3s ease;
            border-right: 4px solid var(--secondary-color);
            max-width: 350px;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification.error {
            border-right-color: #ff4444;
        }
        
        .notification i {
            font-size: 1.5rem;
            color: var(--secondary-color);
        }
        
        .notification.error i {
            color: #ff4444;
        }
    `;
    document.head.appendChild(notificationStyle);
    
    // ==================== مدیریت تب‌ها و گالری ====================
    
    function initProductTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));
                
                this.classList.add('active');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
    
    function initProductGallery() {
        const mainImage = document.getElementById('mainImage');
        const thumbnails = document.querySelectorAll('.thumbnail-images img');
        
        if (mainImage && thumbnails.length > 0) {
            thumbnails.forEach(thumb => {
                thumb.addEventListener('click', function() {
                    const newSrc = this.getAttribute('src');
                    mainImage.src = newSrc;
                    
                    thumbnails.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                });
            });
            
            thumbnails[0].classList.add('active');
        }
    }
    
    // ==================== دکمه بازگشت به بالا ====================
    
    function initBackToTop() {
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
    }
    
    // ==================== مدیریت تصاویر محصولات ====================
    
    function initProductImages() {
        const productImages = document.querySelectorAll('img[src^="photo3dprint/"]');
        productImages.forEach(img => {
            img.onerror = function() {
                const productName = this.alt || 'محصول';
                this.src = `https://via.placeholder.com/300x300/000000/32CD32?text=${encodeURIComponent(productName)}`;
            };
        });
    }
    
    // ==================== رویدادهای منو ====================
    
    function initMenuEvents() {
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
            
            const navLinks = mainNav.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    if (isMobileMode && mainNav.classList.contains('active')) {
                        closeMobileMenu();
                        
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
    }
    
    // ==================== رویداد تغییر تم ====================
    
    function initThemeToggle() {
        if (themeToggle) {
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
                
                console.log('🎨 تغییر تم به:', newTheme);
            });
        }
    }
    
    // ==================== مدیریت تغییر سایز پنجره ====================
    
    function initResizeHandler() {
        let resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                checkViewportMode();
                updateCartCounter();
            }, 100);
        });
    }
    
    // ==================== توابع کمکی ====================
    
    function debugMenu() {
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
    
    // ==================== اجرای اولیه ====================
    
    // اجرای تمام توابع راه‌اندازی
    initTheme();
    checkViewportMode();
    initMenuEvents();
    initThemeToggle();
    initProductFilters();
    initProductSorting();
    initCart();
    initProductTabs();
    initProductGallery();
    initBackToTop();
    initProductImages();
    initResizeHandler();
    
    // راهنمای کنسول برای توسعه
    console.log(`
    🎉 فروشگاه پرینتر سه بعدی با موفقیت راه‌اندازی شد!
    
    🛠️  راهنمای توسعه:
    📱 حالت فعلی: ${isMobileMode ? 'موبایل' : 'دسکتاپ'}
    🎨 تم فعلی: ${document.documentElement.getAttribute('data-theme')}
    📦 تعداد محصولات: ${Object.keys(productsData).length}
    🛒 آیتم‌های سبد خرید: ${cart.reduce((sum, item) => sum + item.quantity, 0)}
    
    📞 پشتیبانی: ۰۹۹۰۲۲۷۹۷۰۲
    ✉️  تلگرام: @mahanenman
    `);
});

// ==================== تابع دیباگ عمومی ====================

function debugShop() {
    console.log('=== وضعیت فروشگاه ===');
    console.log('محصولات:', Object.keys(productsData).length);
    console.log('سبد خرید:', JSON.parse(localStorage.getItem('3dprint_cart')) || []);
    console.log('تم:', localStorage.getItem('theme'));
}
