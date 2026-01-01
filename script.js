// ==================== 3D PRINT SHOP - ENHANCED SCRIPT ====================
// نسخه پیشرفته و ماژولار

class ShopManager {
    constructor() {
        this.productsData = {
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

        this.cart = JSON.parse(localStorage.getItem('3dprint_cart')) || [];
        this.orders = JSON.parse(localStorage.getItem('3dprint_orders')) || [];
        
        this.init();
    }

    init() {
        console.log('🛠️  در حال راه‌اندازی فروشگاه پیشرفته...');
        this.setupEventListeners();
        this.updateCartCounter();
        this.initTheme();
        this.initProductImages();
    }

    setupEventListeners() {
        // مدیریت تم
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => this.toggleTheme());
        }

        // مدیریت سبد خرید
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-cart')) {
                const productId = e.target.closest('.add-to-cart').dataset.product;
                this.addToCart(productId);
            }

            if (e.target.closest('.cart-item-remove')) {
                const productId = e.target.closest('.cart-item-remove').dataset.id;
                this.removeFromCart(productId);
            }
        });

        // دکمه پاک کردن سبد
        const clearCartBtn = document.getElementById('clearCartBtn');
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => this.clearCart());
        }

        // دکمه تکمیل خرید
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.checkout());
        }

        // مدیریت فیلتر محصولات
        this.initProductFilters();
        
        // مدیریت مرتب‌سازی
        this.initProductSorting();
        
        // مدیریت تب‌ها
        this.initProductTabs();
        
        // مدیریت گالری
        this.initProductGallery();
        
        // مدیریت منو
        this.initMenu();
        
        // بازگشت به بالا
        this.initBackToTop();
    }

    // مدیریت تم
    initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
        
        // انیمیشن تغییر تم
        document.body.classList.add('theme-transition');
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 500);
    }

    updateThemeIcon(theme) {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            if (theme === 'light') {
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            } else {
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            }
        }
    }

    // مدیریت سبد خرید
    addToCart(productId, quantity = 1) {
        const product = this.productsData[productId];
        if (!product) {
            this.showNotification('محصول یافت نشد!', 'error');
            return;
        }

        if (product.stock <= 0) {
            this.showNotification('این محصول در حال حاضر موجود نیست!', 'error');
            return;
        }

        const existingItem = this.cart.find(item => item.id === productId);
        
        if (existingItem) {
            if (existingItem.quantity + quantity > product.stock) {
                this.showNotification(`فقط ${product.stock} عدد از این محصول موجود است!`, 'error');
                return;
            }
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity,
                maxStock: product.stock
            });
        }

        this.saveCart();
        this.updateCartDisplay();
        this.showNotification(`«${product.name}» به سبد خرید اضافه شد`);
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
        this.showNotification('محصول از سبد خرید حذف شد');
    }

    clearCart() {
        if (this.cart.length === 0) return;
        
        if (confirm('آیا مطمئن هستید که می‌خواهید سبد خرید را خالی کنید؟')) {
            this.cart = [];
            this.saveCart();
            this.updateCartDisplay();
            this.showNotification('سبد خرید خالی شد');
        }
    }

    saveCart() {
        localStorage.setItem('3dprint_cart', JSON.stringify(this.cart));
    }

    updateCartCounter() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    updateCartDisplay() {
        this.updateCartCounter();
        
        const cartItems = document.querySelector('.cart-items');
        const totalPrice = document.querySelector('.total-price');
        
        if (cartItems) {
            cartItems.innerHTML = '';
            
            if (this.cart.length === 0) {
                cartItems.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart"></i>
                        <p>سبد خرید شما خالی است</p>
                    </div>
                `;
            } else {
                this.cart.forEach(item => {
                    const itemTotal = item.price * item.quantity;
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
                            <div class="cart-item-quantity">
                                <button class="quantity-btn minus" data-id="${item.id}">-</button>
                                <span>${item.quantity}</span>
                                <button class="quantity-btn plus" data-id="${item.id}">+</button>
                            </div>
                        </div>
                        <div class="cart-item-total">${itemTotal.toLocaleString()} تومان</div>
                        <button class="cart-item-remove" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    `;
                    cartItems.appendChild(itemElement);
                });
                
                // مدیریت دکمه‌های کم و زیاد کردن تعداد
                document.querySelectorAll('.quantity-btn').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const productId = e.target.dataset.id;
                        const isPlus = e.target.classList.contains('plus');
                        this.updateQuantity(productId, isPlus);
                    });
                });
            }
        }
        
        if (totalPrice) {
            const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            totalPrice.textContent = total.toLocaleString() + ' تومان';
        }
    }

    updateQuantity(productId, increase) {
        const item = this.cart.find(item => item.id === productId);
        if (!item) return;
        
        const product = this.productsData[productId];
        if (!product) return;
        
        if (increase) {
            if (item.quantity >= product.stock) {
                this.showNotification(`فقط ${product.stock} عدد از این محصول موجود است!`, 'error');
                return;
            }
            item.quantity++;
        } else {
            if (item.quantity <= 1) {
                this.removeFromCart(productId);
                return;
            }
            item.quantity--;
        }
        
        this.saveCart();
        this.updateCartDisplay();
    }

    async checkout() {
        if (this.cart.length === 0) {
            this.showNotification('سبد خرید شما خالی است!', 'error');
            return;
        }
        
        // نمایش مودال تایید خرید
        const modal = this.createCheckoutModal();
        document.body.appendChild(modal);
        
        modal.showModal();
    }

    createCheckoutModal() {
        const modal = document.createElement('dialog');
        modal.className = 'checkout-modal';
        
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        modal.innerHTML = `
            <div class="modal-header">
                <h3>تکمیل خرید</h3>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <form id="checkoutForm">
                    <div class="form-group">
                        <label for="customerName">نام کامل</label>
                        <input type="text" id="customerName" required placeholder="ماهان ادهم قزوینی">
                    </div>
                    <div class="form-group">
                        <label for="customerPhone">شماره تماس</label>
                        <input type="tel" id="customerPhone" required placeholder="۰۹۹۰۲۲۷۹۷۰۲">
                    </div>
                    <div class="form-group">
                        <label for="customerEmail">ایمیل (اختیاری)</label>
                        <input type="email" id="customerEmail" placeholder="mahan.neman2020@gmail.com">
                    </div>
                    <div class="form-group">
                        <label for="customerAddress">آدرس دقیق</label>
                        <textarea id="customerAddress" rows="3" required placeholder="آدرس پستی خود را وارد کنید"></textarea>
                    </div>
                    <div class="order-summary">
                        <h4>خلاصه سفارش</h4>
                        ${this.cart.map(item => `
                            <div class="order-item">
                                <span>${item.name} × ${item.quantity}</span>
                                <span>${(item.price * item.quantity).toLocaleString()} تومان</span>
                            </div>
                        `).join('')}
                        <div class="order-total">
                            <strong>جمع کل:</strong>
                            <strong>${total.toLocaleString()} تومان</strong>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary modal-cancel">انصراف</button>
                <button class="btn btn-primary modal-confirm">تایید و پرداخت</button>
            </div>
        `;
        
        // رویدادهای مودال
        modal.querySelector('.modal-close').addEventListener('click', () => modal.close());
        modal.querySelector('.modal-cancel').addEventListener('click', () => modal.close());
        
        modal.querySelector('.modal-confirm').addEventListener('click', () => {
            const form = modal.querySelector('#checkoutForm');
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            
            this.processOrder(modal);
        });
        
        modal.addEventListener('close', () => modal.remove());
        
        return modal;
    }

    async processOrder(modal) {
        const customerName = modal.querySelector('#customerName').value;
        const customerPhone = modal.querySelector('#customerPhone').value;
        const customerEmail = modal.querySelector('#customerEmail').value;
        const customerAddress = modal.querySelector('#customerAddress').value;
        
        const orderData = {
            id: 'ORD-' + Date.now(),
            products: [...this.cart],
            total: this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            customer: {
                name: customerName,
                phone: customerPhone,
                email: customerEmail,
                address: customerAddress
            },
            date: new Date().toLocaleString('fa-IR'),
            status: 'در انتظار پرداخت',
            paymentStatus: 'pending'
        };
        
        // ذخیره سفارش
        this.orders.push(orderData);
        localStorage.setItem('3dprint_orders', JSON.stringify(this.orders));
        
        // نمایش رسید
        modal.close();
        this.showReceipt(orderData);
        
        // پاک کردن سبد خرید
        this.cart = [];
        this.saveCart();
        this.updateCartDisplay();
    }

    showReceipt(orderData) {
        const receipt = document.createElement('div');
        receipt.className = 'receipt-modal';
        
        receipt.innerHTML = `
            <div class="receipt-header">
                <i class="fas fa-check-circle"></i>
                <h3>سفارش شما با موفقیت ثبت شد!</h3>
            </div>
            <div class="receipt-body">
                <div class="receipt-info">
                    <p><strong>شماره سفارش:</strong> ${orderData.id}</p>
                    <p><strong>تاریخ سفارش:</strong> ${orderData.date}</p>
                    <p><strong>وضعیت:</strong> ${orderData.status}</p>
                </div>
                <div class="receipt-actions">
                    <button class="btn btn-primary print-receipt">
                        <i class="fas fa-print"></i>
                        چاپ رسید
                    </button>
                    <button class="btn btn-outline close-receipt">
                        بستن
                    </button>
                </div>
                <div class="receipt-note">
                    <i class="fas fa-info-circle"></i>
                    <p>به زودی با شما تماس گرفته خواهد شد. شماره پیگیری: <strong>${orderData.id}</strong></p>
                </div>
            </div>
        `;
        
        document.body.appendChild(receipt);
        
        receipt.querySelector('.print-receipt').addEventListener('click', () => window.print());
        receipt.querySelector('.close-receipt').addEventListener('click', () => receipt.remove());
        
        setTimeout(() => receipt.remove(), 10000);
    }

    // مدیریت فیلتر محصولات
    initProductFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const productCards = document.querySelectorAll('.product-card');
        
        if (filterButtons.length === 0 || productCards.length === 0) return;
        
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filter = button.dataset.filter;
                
                productCards.forEach(card => {
                    const categories = card.dataset.category.split(' ');
                    const shouldShow = filter === 'all' || categories.includes(filter);
                    
                    card.style.display = shouldShow ? 'block' : 'none';
                    
                    if (shouldShow) {
                        card.style.animation = 'fadeIn 0.5s ease';
                    }
                });
            });
        });
    }

    initProductSorting() {
        const sortSelect = document.getElementById('sort');
        if (!sortSelect) return;
        
        sortSelect.addEventListener('change', () => {
            const productsGrid = document.getElementById('productsGrid');
            if (!productsGrid) return;
            
            const productCards = Array.from(document.querySelectorAll('.product-card'));
            
            productCards.sort((a, b) => {
                const priceA = parseInt(a.querySelector('.price')?.textContent.replace(/[^0-9]/g, '') || 0);
                const priceB = parseInt(b.querySelector('.price')?.textContent.replace(/[^0-9]/g, '') || 0);
                
                switch(sortSelect.value) {
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
                card.style.animation = 'fadeIn 0.5s ease';
            });
        });
    }

    initProductTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabPanes = document.querySelectorAll('.tab-pane');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.dataset.tab;
                
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));
                
                button.classList.add('active');
                const targetTab = document.getElementById(tabId);
                if (targetTab) {
                    targetTab.classList.add('active');
                }
            });
        });
    }

    initProductGallery() {
        const mainImage = document.getElementById('mainImage');
        const thumbnails = document.querySelectorAll('.thumbnail-images img');
        
        if (mainImage && thumbnails.length > 0) {
            thumbnails.forEach(thumb => {
                thumb.addEventListener('click', () => {
                    const newSrc = thumb.src;
                    mainImage.src = newSrc;
                    
                    thumbnails.forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                });
            });
        }
    }

    initMenu() {
        const menuToggle = document.getElementById('menuToggle');
        const mainNav = document.getElementById('mainNav');
        const menuOverlay = document.getElementById('menuOverlay');
        
        if (menuToggle && mainNav) {
            menuToggle.addEventListener('click', () => {
                menuToggle.classList.toggle('active');
                mainNav.classList.toggle('active');
                if (menuOverlay) {
                    menuOverlay.classList.toggle('active');
                }
                document.body.classList.toggle('no-scroll');
            });
            
            // بستن منو با کلیک روی overlay
            if (menuOverlay) {
                menuOverlay.addEventListener('click', () => {
                    menuToggle.classList.remove('active');
                    mainNav.classList.remove('active');
                    menuOverlay.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                });
            }
            
            // بستن منو با کلیک روی لینک‌ها
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    menuToggle.classList.remove('active');
                    mainNav.classList.remove('active');
                    if (menuOverlay) {
                        menuOverlay.classList.remove('active');
                    }
                    document.body.classList.remove('no-scroll');
                });
            });
        }
    }

    initBackToTop() {
        const backToTop = document.getElementById('backToTop');
        if (!backToTop) return;
        
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

    initProductImages() {
        const productImages = document.querySelectorAll('img[src^="photo3dprint/"]');
        productImages.forEach(img => {
            img.onerror = () => {
                const productName = img.alt || 'محصول';
                img.src = `https://via.placeholder.com/300x300/000000/32CD32?text=${encodeURIComponent(productName)}`;
            };
        });
    }

    showNotification(message, type = 'success') {
        // حذف نوتیفیکیشن قبلی
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(notification);
        
        // نمایش با انیمیشن
        setTimeout(() => notification.classList.add('show'), 100);
        
        // حذف خودکار
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// راه‌اندازی فروشگاه
document.addEventListener('DOMContentLoaded', () => {
    window.shop = new ShopManager();
    
    console.log(`
    🎉 فروشگاه پرینتر سه بعدی با موفقیت راه‌اندازی شد!
    
    🛠️  قابلیت‌های جدید:
    📱 منوی مدرن و واکنش‌گرا
    🎨 سیستم تم پیشرفته
    🛒 سبد خرید کامل با مدیریت تعداد
    💳 سیستم پرداخت و رسید
    🔔 نوتیفیکیشن‌های تعاملی
    📊 مدیریت موجودی محصولات
    
    📞 پشتیبانی: ۰۹۹۰۲۲۷۹۷۰۲
    ✉️  تلگرام: @mahanenman
    `);
});

// تابع دیباگ
window.debugShop = function() {
    console.log('=== وضعیت فروشگاه ===');
    console.log('محصولات:', Object.keys(window.shop?.productsData || {}).length);
    console.log('سبد خرید:', window.shop?.cart || []);
    console.log('سفارشات:', window.shop?.orders || []);
    console.log('تم:', localStorage.getItem('theme'));
};
