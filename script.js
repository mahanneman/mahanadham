// مدیریت محصولات پرینتر سه بعدی

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

// فیلتر محصولات
document.addEventListener('DOMContentLoaded', function() {
    // فیلتر محصولات در صفحه لیست
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // حذف کلاس active از همه دکمه‌ها
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // اضافه کردن کلاس active به دکمه کلیک شده
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
            sortProducts(this.value);
        });
    }
    
    // مدیریت سبد خرید
    initCart();
    
    // مدیریت تب‌ها در صفحه جزئیات
    initProductTabs();
    
    // مدیریت گالری تصاویر
    initProductGallery();
});

// مرتب‌سازی محصولات
function sortProducts(sortBy) {
    const productsGrid = document.getElementById('productsGrid');
    const productCards = Array.from(document.querySelectorAll('.product-card'));
    
    productCards.sort((a, b) => {
        const priceA = parseInt(a.querySelector('.price').textContent.replace(/[^0-9]/g, ''));
        const priceB = parseInt(b.querySelector('.price').textContent.replace(/[^0-9]/g, ''));
        
        switch(sortBy) {
            case 'price-low':
                return priceA - priceB;
            case 'price-high':
                return priceB - priceA;
            case 'newest':
                return 0; // در حالت واقعی باید timestamp محصولات را مقایسه کرد
            case 'popular':
                return 0; // در حالت واقعی باید تعداد فروش را مقایسه کرد
            default:
                return 0;
        }
    });
    
    // حذف و اضافه کردن مجدد محصولات با ترتیب جدید
    productsGrid.innerHTML = '';
    productCards.forEach(card => {
        productsGrid.appendChild(card);
    });
}

// مدیریت سبد خرید
function initCart() {
    // دکمه‌های افزودن به سبد
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.getAttribute('data-product');
            addToCart(productId);
        });
    });
    
    // دکمه افزودن به سبد در صفحه جزئیات
    const addToCartDetail = document.querySelector('.add-to-cart-detail');
    if (addToCartDetail) {
        addToCartDetail.addEventListener('click', function() {
            const productId = window.location.pathname.includes('gearbox') ? 'gearbox' :
                             window.location.pathname.includes('pump') ? 'pump' :
                             window.location.pathname.includes('gearset') ? 'gearset' :
                             window.location.pathname.includes('clutch') ? 'clutch' :
                             window.location.pathname.includes('coupling') ? 'coupling' :
                             window.location.pathname.includes('bracket') ? 'bracket' : '';
            
            const quantity = parseInt(document.getElementById('quantity')?.value || 1);
            addToCart(productId, quantity);
        });
    }
    
    // دکمه خرید سریع
    const buyNowBtn = document.getElementById('buyNowBtn');
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', function() {
            const productId = window.location.pathname.includes('gearbox') ? 'gearbox' :
                             window.location.pathname.includes('pump') ? 'pump' :
                             window.location.pathname.includes('gearset') ? 'gearset' :
                             window.location.pathname.includes('clutch') ? 'clutch' :
                             window.location.pathname.includes('coupling') ? 'coupling' :
                             window.location.pathname.includes('bracket') ? 'bracket' : '';
            
            const quantity = parseInt(document.getElementById('quantity')?.value || 1);
            addToCart(productId, quantity);
            window.location.href = 'checkout.html';
        });
    }
    
    // دکمه نمایش/بستن سبد خرید
    const cartToggle = document.getElementById('cartToggle');
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
    
    // به‌روزرسانی نمایش سبد
    updateCartDisplay();
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
    
    // ذخیره در localStorage
    localStorage.setItem('3dprint_cart', JSON.stringify(cart));
    
    // به‌روزرسانی نمایش
    updateCartDisplay();
    
    // نمایش پیام موفقیت
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
    // به‌روزرسانی شمارنده
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
    
    // به‌روزرسانی لیست آیتم‌ها
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
            
            // اضافه کردن رویداد برای دکمه‌های حذف
            document.querySelectorAll('.cart-item-remove').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = this.getAttribute('data-id');
                    removeFromCart(productId);
                });
            });
        }
    }
    
    // به‌روزرسانی جمع کل
    const totalPrice = document.querySelector('.total-price');
    if (totalPrice) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalPrice.textContent = total.toLocaleString() + ' تومان';
    }
}

// تکمیل خرید
function checkout() {
    if (cart.length === 0) {
        showNotification('سبد خرید شما خالی است', 'error');
        return;
    }
    
    // در اینجا معمولاً به صفحه پرداخت هدایت می‌شوید
    // برای نمونه، یک فرم ساده نمایش می‌دهیم
    
    const orderDetails = cart.map(item => 
        `${item.name} × ${item.quantity}: ${(item.price * item.quantity).toLocaleString()} تومان`
    ).join('\n');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // ارسال به موتور جستجوی داک (Doc)
    // این بخش باید با API داک یکپارچه شود
    const docOrderData = {
        products: cart,
        total: total,
        customer: {
            name: prompt('لطفا نام خود را وارد کنید:'),
            phone: prompt('لطفا شماره تماس خود را وارد کنید:'),
            email: prompt('لطفا ایمیل خود را وارد کنید: (اختیاری)') || '',
            address: prompt('لطفا آدرس ارسال را وارد کنید:')
        }
    };
    
    // نمایش اطلاعات سفارش
    alert(`سفارش شما ثبت شد!\n\n${orderDetails}\n\nجمع کل: ${total.toLocaleString()} تومان\n\nبه زودی با شما تماس گرفته خواهد شد.`);
    
    // پاک کردن سبد خرید
    clearCart();
    
    // بستن سبد خرید
    const cartSidebar = document.querySelector('.cart-sidebar');
    if (cartSidebar) {
        cartSidebar.classList.remove('active');
    }
}

// نمایش نوتیفیکیشن
function showNotification(message, type = 'success') {
    // حذف نوتیفیکیشن قبلی اگر وجود دارد
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // ایجاد نوتیفیکیشن جدید
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // نمایش
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // حذف خودکار بعد از 3 ثانیه
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// مدیریت تب‌های صفحه جزئیات
function initProductTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // حذف کلاس active از همه دکمه‌ها و تب‌ها
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // اضافه کردن کلاس active به تب انتخاب شده
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// مدیریت گالری تصاویر
function initProductGallery() {
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail-images img');
    
    if (mainImage && thumbnails.length > 0) {
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', function() {
                const newSrc = this.getAttribute('src');
                mainImage.src = newSrc;
                
                // حذف کلاس active از همه thumbnail ها
                thumbnails.forEach(t => t.classList.remove('active'));
                // اضافه کردن کلاس active به thumbnail کلیک شده
                this.classList.add('active');
            });
        });
        
        // فعال کردن اولین thumbnail
        thumbnails[0].classList.add('active');
    }
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

// بررسی فایل‌های عکس
function checkProductImages() {
    const productImages = document.querySelectorAll('img[src^="photo3dprint/"]');
    productImages.forEach(img => {
        img.onerror = function() {
            const productName = this.alt || 'محصول';
            this.src = `https://via.placeholder.com/300x300/000000/32CD32?text=${encodeURIComponent(productName)}`;
        };
    });
}

// بارگذاری اولیه
window.addEventListener('DOMContentLoaded', () => {
    checkProductImages();
    
    // راهنمای کنسول
    console.log(`
    🛍️  فروشگاه محصولات پرینتر سه بعدی
    📦 تعداد محصولات: ${Object.keys(productsData).length}
    🛒 آیتم‌های سبد خرید: ${cart.length}
    📞 پشتیبانی: ۰۹۹۰۲۲۷۹۷۰۲
    ✉️  تلگرام: @mahanenman
    `);
});