// Глобальные переменные
let cart = [];
let currentDish = null;
let yandexMap = null;
let cartState = 'cart'; // 'cart' или 'confirmClear'

// Конфигурация Telegram  
const TELEGRAM_CONFIG = {
    apiUrl: '/api/send-order', // Ваш серверный эндпоинт
    botToken: '8847713556:AAHYCcfK4nxIRZaH7G3Ag9DmMwLbnBYBCYw', // Только для демо!
    chatId: '-1004343025374'
};

// Данные меню
const menuData = {
    soups: {
        title: 'Супы',
        dishes: [
            {
                id: 'soup1',
                name: 'Борщ',
                price: 450,
                description: 'Классический борщ с говядиной, свеклой и сметаной',
                image: 'img/Борщ.jpg',
                options: [
                    { name: 'С чесночными гренками', price: 50 },
                    { name: 'Двойная порция мяса', price: 120 },
                    { name: 'Со сметаной', price: 30 }
                ]
            },
            {
                id: 'soup2',
                name: 'Солянка',
                price: 480,
                description: 'Сборная мясная солянка с копченостями и оливками',
                image: 'img/Солянка.jpg',
                options: [
                    { name: 'С лимоном', price: 20 },
                    { name: 'С каперсами', price: 40 },
                    { name: 'Дополнительные копчености', price: 100 }
                ]
            },
            {
                id: 'soup3',
                name: 'Уха',
                price: 520,
                description: 'Наваристая уха из свежей речной рыбы',
                image: 'img/Уха.jpg',
                options: [
                    { name: 'С расстегаем', price: 80 },
                    { name: 'С красной икрой', price: 150 },
                    { name: 'Двойная порция рыбы', price: 130 }
                ]
            }
        ]
    },
    'main-dishes': {
        title: 'Основные блюда',
        dishes: [
            {
                id: 'main1',
                name: 'Котлета по-киевски',
                price: 680,
                description: 'Нежное куриное филе с маслом в хрустящей панировке',
                image: 'img/Котлета по киевски.jpg',
                options: [
                    { name: 'С картофельным пюре', price: 90 },
                    { name: 'С овощным гарниром', price: 70 },
                    { name: 'С грибным соусом', price: 60 }
                ]
            },
            {
                id: 'main2',
                name: 'Бефстроганов',
                price: 750,
                description: 'Говядина в сливочном соусе с шампиньонами',
                image: 'img/Бефстроганов.jpg',
                options: [
                    { name: 'С картофелем фри', price: 80 },
                    { name: 'С рисом', price: 50 },
                    { name: 'С гречневой кашей', price: 45 }
                ]
            },
            {
                id: 'main3',
                name: 'Пельмени сибирские',
                price: 550,
                description: 'Домашние пельмени ручной лепки с тремя видами мяса',
                image: 'img/Пельмени сибирские.jpg',
                options: [
                    { name: 'Со сметаной', price: 30 },
                    { name: 'С уксусом', price: 20 },
                    { name: 'С маслом', price: 25 }
                ]
            }
        ]
    },
    appetizers: {
        title: 'Закуски',
        dishes: [
            {
                id: 'appetizer1',
                name: 'Сельдь под шубой',
                price: 380,
                description: 'Классический слоеный салат с селедкой и овощами',
                image: 'img/Сельдь под шубой.jpg',
                options: [
                    { name: 'С яйцом', price: 25 },
                    { name: 'С красной икрой', price: 100 },
                    { name: 'Порция больше', price: 150 }
                ]
            },
            {
                id: 'appetizer2',
                name: 'Оливье',
                price: 350,
                description: 'Традиционный салат с колбасой и майонезом',
                image: 'img/Оливье.jpg',
                options: [
                    { name: 'С курицей', price: 70 },
                    { name: 'С раковыми шейками', price: 200 },
                    { name: 'Без майонеза', price: 0 }
                ]
            }
        ]
    },
    desserts: {
        title: 'Десерты',
        dishes: [
            {
                id: 'dessert1',
                name: 'Медовик',
                price: 320,
                description: 'Нежный медовый торт со сметанным кремом',
                image: 'img/Медовик.jpg',
                options: [
                    { name: 'С орехами', price: 40 },
                    { name: 'С шоколадной крошкой', price: 50 },
                    { name: 'С ягодами', price: 60 }
                ]
            },
            {
                id: 'dessert2',
                name: 'Сырники',
                price: 280,
                description: 'Румяные сырники из творога со сметаной и вареньем',
                image: 'img/Сырники.jpg',
                options: [
                    { name: 'Со сметаной', price: 30 },
                    { name: 'С вишневым вареньем', price: 35 },
                    { name: 'С медом', price: 40 }
                ]
            }
        ]
    },
    drinks: {
        title: 'Напитки',
        dishes: [
            {
                id: 'drink1',
                name: 'Морс клюквенный',
                price: 180,
                description: 'Освежающий напиток из лесной клюквы',
                image: 'img/Морс клюквенный.jpg',
                options: [
                    { name: 'С мятой', price: 20 },
                    { name: 'С медом', price: 30 },
                    { name: 'Большой стакан', price: 70 }
                ]
            },
            {
                id: 'drink2',
                name: 'Квас домашний',
                price: 150,
                description: 'Натуральный квас, приготовленный по старинному рецепту',
                image: 'img/Квас домашний.jpg',
                options: [
                    { name: 'С хреном', price: 15 },
                    { name: 'С изюмом', price: 20 },
                    { name: 'Большой стакан', price: 60 }
                ]
            }
        ]
    }
};

//ИНИЦИАЛИЗАЦИЯ
document.addEventListener('DOMContentLoaded', function() {
    renderMenu();
    setupCategoryLinks();
    setupSearch();
    initYandexMap();
    setupFormSubmission();
    initCarousel();
});

//КАРУСЕЛЬ
function initCarousel() {
    let currentSlide = 0;
    let slideInterval = null;
    const slides = document.querySelectorAll('.carousel-slide');
    const dotsContainer = document.getElementById('carouselDots');

    if (slides.length > 0 && dotsContainer) {
        dotsContainer.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.className = 'dot' + (index === 0 ? ' active' : '');
            dot.dataset.index = index;
            dot.addEventListener('click', function() {
                goToSlide(parseInt(this.dataset.index));
            });
            dotsContainer.appendChild(dot);
        });
    }

    function goToSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));
        
        if (slides[index]) {
            slides[index].classList.add('active');
            currentSlide = index;
        }
        
        const dots = document.querySelectorAll('.dot');
        if (dots[index]) {
            dots[index].classList.add('active');
        }
    }

    window.nextSlide = function() {
        const next = (currentSlide + 1) % slides.length;
        goToSlide(next);
        resetInterval();
    };

    window.prevSlide = function() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(prev);
        resetInterval();
    };

    function resetInterval() {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
        startAutoSlide();
    }

    function startAutoSlide() {
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = setInterval(() => {
            const next = (currentSlide + 1) % slides.length;
            goToSlide(next);
        }, 5000);
    }

    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', function() {
            if (slideInterval) {
                clearInterval(slideInterval);
                slideInterval = null;
            }
        });
        
        carouselContainer.addEventListener('mouseleave', function() {
            startAutoSlide();
        });
    }

    startAutoSlide();
}

//ОТРИСОВКА МЕНЮ
function renderMenu() {
    const menuContent = document.getElementById('menuContent');
    if (!menuContent) return;
    
    menuContent.innerHTML = '';
    
    Object.entries(menuData).forEach(([categoryId, category]) => {
        const section = document.createElement('div');
        section.id = categoryId;
        section.className = 'menu-section';
        
        section.innerHTML = `
            <h2 class="menu-section-title">${category.title}</h2>
            <div class="menu-grid">
                ${category.dishes.map(dish => `
                    <div class="dish-card" onclick="openDishDetail('${dish.id}', '${categoryId}')">
                        <img src="${dish.image}" alt="${dish.name}" class="dish-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22%3E%3Crect width=%22200%22 height=%22200%22 fill=%22%23f0f0f0%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2216%22 fill=%22%23999%22%3EНет фото%3C/text%3E%3C/svg%3E'">
                        <div class="dish-info">
                            <h3 class="dish-name">${dish.name}</h3>
                            <p class="dish-description">${dish.description}</p>
                            <div class="dish-price">${dish.price} ₽</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        menuContent.appendChild(section);
    });
}

//КАТЕГОРИИ
function setupCategoryLinks() {
    const categoryLinks = document.querySelectorAll('.category-link');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            categoryLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    window.addEventListener('scroll', highlightCategory);
}

function highlightCategory() {
    const sections = document.querySelectorAll('.menu-section');
    const categoryLinks = document.querySelectorAll('.category-link');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        
        if (window.pageYOffset >= sectionTop - 150) {
            currentSection = section.getAttribute('id');
        }
    });
    
    categoryLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

//ПОИСК
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchDishes();
        }, 300);
    });
}

function searchDishes() {
    const input = document.getElementById('searchInput');
    const query = input.value.trim().toLowerCase();
    const resultsContainer = document.getElementById('searchResults');
    
    if (!resultsContainer) return;
    
    if (!query) {
        resultsContainer.innerHTML = '';
        return;
    }
    
    let allDishes = [];
    Object.entries(menuData).forEach(([categoryId, category]) => {
        category.dishes.forEach(dish => {
            allDishes.push({
                ...dish,
                categoryId: categoryId,
                categoryTitle: category.title
            });
        });
    });
    
    const results = allDishes.filter(dish => 
        dish.name.toLowerCase().includes(query)
    );
    
    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <p>😕 Ничего не найдено</p>
                <p style="font-size: 12px; margin-top: 5px;">Попробуйте изменить запрос</p>
            </div>
        `;
    } else {
        resultsContainer.innerHTML = results.map(dish => `
            <div class="search-result-item" onclick="openDishDetail('${dish.id}', '${dish.categoryId}')">
                <div>
                    <div class="search-result-name">${dish.name}</div>
                    <div class="search-result-category">${dish.categoryTitle}</div>
                </div>
                <div class="search-result-price">${dish.price} ₽</div>
            </div>
        `).join('');
    }
}

//ДЕТАЛИ БЛЮДА
function openDishDetail(dishId, categoryId) {
    const category = menuData[categoryId];
    if (!category) return;
    
    const dish = category.dishes.find(d => d.id === dishId);
    if (!dish) return;
    
    currentDish = { ...dish, category: category.title, categoryId: categoryId };
    
    const modal = document.getElementById('dishModal');
    const title = document.getElementById('dishModalTitle');
    const content = document.getElementById('dishDetailContent');
    
    if (!modal || !title || !content) return;
    
    title.textContent = dish.name;
    
    content.innerHTML = `
        <img src="${dish.image}" alt="${dish.name}" class="dish-detail-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22%3E%3Crect width=%22300%22 height=%22300%22 fill=%22%23f0f0f0%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2220%22 fill=%22%23999%22%3EНет фото%3C/text%3E%3C/svg%3E'">
        <div class="dish-detail-info">
            <p class="dish-description">${dish.description}</p>
            <div class="dish-detail-price">${dish.price} ₽</div>
            
            <div class="options-group">
                <h4>Дополнительные услуги</h4>
                ${dish.options.map(option => `
                    <div class="option-item">
                        <label>
                            <input type="checkbox" class="option-checkbox" data-name="${option.name}" data-price="${option.price}">
                            ${option.name} (+${option.price} ₽)
                        </label>
                    </div>
                `).join('')}
            </div>
            
            <div class="service-type">
                <h4>Тип обслуживания</h4>
                <select id="serviceType">
                    <option value="dine-in">В зале</option>
                    <option value="takeaway">На вынос</option>
                </select>
            </div>
            
            <button class="add-to-cart-btn" onclick="addToCartFromDetail()">
                Добавить в корзину - ${dish.price} ₽
            </button>
        </div>
    `;
    
    modal.classList.add('active');
    
    const checkboxes = content.querySelectorAll('.option-checkbox');
    const priceButton = content.querySelector('.add-to-cart-btn');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateTotalPrice);
    });
    
    function updateTotalPrice() {
        let totalPrice = dish.price;
        checkboxes.forEach(cb => {
            if (cb.checked) {
                totalPrice += parseInt(cb.dataset.price);
            }
        });
        priceButton.textContent = `Добавить в корзину - ${totalPrice} ₽`;
    }
}

function closeDishModal() {
    const modal = document.getElementById('dishModal');
    if (modal) modal.classList.remove('active');
    currentDish = null;
}

//КОРЗИНА
function addToCartFromDetail() {
    if (!currentDish) return;
    
    const checkboxes = document.querySelectorAll('.option-checkbox');
    const serviceTypeSelect = document.getElementById('serviceType');
    const serviceType = serviceTypeSelect ? serviceTypeSelect.value : 'dine-in';
    
    let options = [];
    let totalPrice = currentDish.price;
    
    checkboxes.forEach(cb => {
        if (cb.checked) {
            options.push({
                name: cb.dataset.name,
                price: parseInt(cb.dataset.price)
            });
            totalPrice += parseInt(cb.dataset.price);
        }
    });
    
    const existingItemIndex = cart.findIndex(item => 
        item.dishId === currentDish.id && 
        item.serviceType === serviceType &&
        JSON.stringify(item.options) === JSON.stringify(options)
    );
    
    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        const cartItem = {
            id: Date.now(),
            dishId: currentDish.id,
            name: currentDish.name,
            image: currentDish.image,
            basePrice: currentDish.price,
            totalPrice: totalPrice,
            options: options,
            serviceType: serviceType,
            category: currentDish.category,
            quantity: 1
        };
        
        cart.push(cartItem);
    }
    
    updateCartDisplay();
    closeDishModal();
}

function changeQuantity(itemId, delta) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    
    if (itemIndex !== -1) {
        cart[itemIndex].quantity += delta;
        
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        
        updateCartDisplay();
    }
}

function showClearConfirmation() {
    cartState = 'confirmClear';
    updateCartDisplay();
}

function backToCart() {
    cartState = 'cart';
    updateCartDisplay();
}

function confirmClearCart() {
    cart = [];
    cartState = 'cart';
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');
    const cartContent = document.getElementById('cartContent');
    const cartModalTitle = document.getElementById('cartModalTitle');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0);
    
    if (cartCount) cartCount.textContent = totalItems;
    if (cartTotal) cartTotal.textContent = `${totalPrice} ₽`;
    
    if (cartState === 'confirmClear') {
        if (cartModalTitle) cartModalTitle.textContent = 'Очистка корзины';
        if (cartContent) {
            cartContent.innerHTML = `
                <div class="confirm-clear-content">
                    <p class="confirm-clear-text">Вы уверены, что хотите очистить корзину?</p>
                    <div class="confirm-actions">
                        <button class="confirm-no-btn" onclick="backToCart()">Нет, вернуться</button>
                        <button class="confirm-yes-btn" onclick="confirmClearCart()">Да, очистить</button>
                    </div>
                </div>
            `;
        }
        return;
    }
    
    if (cartModalTitle) cartModalTitle.textContent = 'Корзина';
    
    if (!cartContent) return;
    
    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#999" stroke-width="2">
                    <circle cx="9" cy="21" r="1"/>
                    <circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
                </svg>
                <p style="font-size: 18px; margin-bottom: 10px;">Ваша корзина пуста</p>
                <p>Добавьте блюда из меню</p>
            </div>
        `;
    } else {
        cartContent.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2250%22 height=%2250%22%3E%3Crect width=%2250%22 height=%2250%22 fill=%22%23f0f0f0%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2212%22 fill=%22%23999%22%3EНет фото%3C/text%3E%3C/svg%3E'">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-options">
                        ${item.options.map(opt => `${opt.name} (+${opt.price}₽)`).join(', ')}
                        <br>
                        <small>${item.serviceType === 'dine-in' ? 'В зале' : 'На вынос'}</small>
                    </div>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="changeQuantity(${item.id}, -1)">−</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                </div>
                <div class="cart-item-price">${item.totalPrice * item.quantity} ₽</div>
            </div>
        `).join('') + `
            <div class="cart-summary">
                <div class="cart-total">Итого: ${totalPrice} ₽</div>
                <div class="cart-actions">
                    <button class="clear-cart-btn" onclick="showClearConfirmation()">Очистить корзину</button>
                    <button class="checkout-btn" onclick="proceedToCheckout()">Продолжить оформление</button>
                </div>
            </div>
        `;
    }
}

function toggleCart() {
    const cartModal = document.getElementById('cartModal');
    const checkoutModal = document.getElementById('checkoutModal');
    
    if (!cartModal) return;
    
    if (checkoutModal && checkoutModal.classList.contains('active')) {
        checkoutModal.classList.remove('active');
        cartModal.classList.add('active');
    } else {
        cartModal.classList.toggle('active');
    }
    
    cartState = 'cart';
    updateCartDisplay();
}

function closeAllModals() {
    const cartModal = document.getElementById('cartModal');
    const checkoutModal = document.getElementById('checkoutModal');
    if (cartModal) cartModal.classList.remove('active');
    if (checkoutModal) checkoutModal.classList.remove('active');
    cartState = 'cart';
}

function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Добавьте блюда в корзину');
        return;
    }
    
    const cartModal = document.getElementById('cartModal');
    const checkoutModal = document.getElementById('checkoutModal');
    
    if (cartModal) cartModal.classList.remove('active');
    if (checkoutModal) checkoutModal.classList.add('active');
    cartState = 'cart';
}

//ЯНДЕКС КАРТА
function initYandexMap() {
    const mapElement = document.getElementById('yandexMap');
    if (!mapElement) return;
    
    if (typeof ymaps !== 'undefined') {
        ymaps.ready(function() {
            try {
                yandexMap = new ymaps.Map('yandexMap', {
                    center: [55.7558, 37.6176],
                    zoom: 10,
                    controls: ['zoomControl', 'fullscreenControl']
                });
                
                const restaurants = [
                    { coordinates: [55.7558, 37.6176], name: 'Ёлки-Иголки - Центр' },
                    { coordinates: [55.7649, 37.6384], name: 'Ёлки-Иголки - Басманный' },
                    { coordinates: [55.7415, 37.6253], name: 'Ёлки-Иголки - Якиманка' }
                ];
                
                restaurants.forEach(restaurant => {
                    const placemark = new ymaps.Placemark(restaurant.coordinates, {
                        hintContent: restaurant.name,
                        balloonContent: restaurant.name
                    }, {
                        preset: 'islands#redIcon'
                    });
                    yandexMap.geoObjects.add(placemark);
                });
            } catch(e) {
                console.error('Ошибка инициализации карты:', e);
                showMapError();
            }
        });
    } else {
        showMapError();
    }
}

function showMapError() {
    const mapElement = document.getElementById('yandexMap');
    if (mapElement) {
        mapElement.innerHTML = '<p style="text-align: center; padding: 20px; color: #666;">Карта временно недоступна</p>';
    }
}

// ОТПРАВКА ЗАКАЗА 
function setupFormSubmission() {
    const form = document.getElementById('orderForm');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (cart.length === 0) {
            alert('Корзина пуста!');
            return;
        }
        
        const submitBtn = form.querySelector('.submit-order-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Отправка...';
        submitBtn.disabled = true;
        
        const formData = new FormData(form);
        const orderData = {
            name: formData.get('name') || 'Не указано',
            phone: formData.get('phone') || 'Не указан',
            comment: formData.get('comment') || '',
            order: cart.map(item => ({
                name: item.name,
                price: item.totalPrice,
                quantity: item.quantity,
                options: item.options.map(opt => opt.name),
                serviceType: item.serviceType === 'dine-in' ? 'В зале' : 'На вынос'
            })),
            totalAmount: cart.reduce((sum, item) => sum + (item.totalPrice * item.quantity), 0)
        };
        
        const success = await sendOrderToTelegram(orderData);
        
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        if (success) {
            alert('✅ Заказ успешно отправлен! Мы свяжемся с вами в ближайшее время.');
            cart = [];
            cartState = 'cart';
            updateCartDisplay();
            
            const checkoutModal = document.getElementById('checkoutModal');
            const cartModal = document.getElementById('cartModal');
            if (checkoutModal) checkoutModal.classList.remove('active');
            if (cartModal) cartModal.classList.remove('active');
            form.reset();
        }
    });
}

// 🔧 ОТПРАВКА В TELEGRAM - ИСПРАВЛЕННАЯ ВЕРСИЯ С ПОДДЕРЖКОЙ CORS
async function sendOrderToTelegram(orderData) {
    const orderText = formatOrderMessage(orderData);
    
    console.log('📤 Отправка заказа...');
    
    // СПОСОБ 1: Через серверный прокси (РЕКОМЕНДУЕТСЯ)
    try {
        // Если у вас есть серверный эндпоинт:
        const response = await fetch('/api/send-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: orderText,
                chatId: TELEGRAM_CONFIG.chatId
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                console.log('✅ Заказ успешно отправлен через сервер');
                return true;
            }
        }
    } catch (serverError) {
        console.warn('⚠️ Серверный метод недоступен, пробуем прямой запрос...');
    }
    
    // СПОСОБ 2: Прямой запрос с использованием CORS-прокси (для тестирования)
    try {
        // Используем публичный CORS-прокси (только для тестирования!)
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`;
        
        const response = await fetch(proxyUrl + url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': window.location.origin
            },
            body: JSON.stringify({
                chat_id: TELEGRAM_CONFIG.chatId,
                text: orderText,
                parse_mode: 'HTML'
            })
        });
        
        const data = await response.json();
        
        if (data.ok) {
            console.log('✅ Заказ успешно отправлен через прокси');
            return true;
        } else {
            console.error('❌ Ошибка Telegram API:', data.description);
            throw new Error(data.description);
        }
    } catch (error) {
        console.error('❌ Ошибка отправки:', error);
        
        // СПОСОБ 3: Использование iframe (альтернативный метод)
        try {
            await sendViaIframe(orderText);
            return true;
        } catch (iframeError) {
            console.error('❌ Все методы отправки не удались');
            
            // Показываем пользователю сообщение с заказом для ручной отправки
            showManualOrderMessage(orderText);
            return false;
        }
    }
}

// Альтернативный метод через iframe
function sendViaIframe(message) {
    return new Promise((resolve, reject) => {
        try {
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
            
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = `https://api.telegram.org/bot${TELEGRAM_CONFIG.botToken}/sendMessage`;
            form.target = iframe.name || 'telegramFrame';
            
            const chatIdInput = document.createElement('input');
            chatIdInput.type = 'hidden';
            chatIdInput.name = 'chat_id';
            chatIdInput.value = TELEGRAM_CONFIG.chatId;
            form.appendChild(chatIdInput);
            
            const textInput = document.createElement('input');
            textInput.type = 'hidden';
            textInput.name = 'text';
            textInput.value = message;
            form.appendChild(textInput);
            
            const parseModeInput = document.createElement('input');
            parseModeInput.type = 'hidden';
            parseModeInput.name = 'parse_mode';
            parseModeInput.value = 'HTML';
            form.appendChild(parseModeInput);
            
            document.body.appendChild(form);
            form.submit();
            
            setTimeout(() => {
                document.body.removeChild(iframe);
                document.body.removeChild(form);
                resolve(true);
            }, 1000);
        } catch (error) {
            reject(error);
        }
    });
}

// Показываем сообщение для ручной отправки
function showManualOrderMessage(orderText) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            max-width: 500px;
            width: 100%;
            padding: 30px;
            border-radius: 12px;
            max-height: 80vh;
            overflow-y: auto;
        ">
            <h3 style="margin-bottom: 15px; color: #c0392b;">⚠️ Не удалось отправить заказ автоматически</h3>
            <p style="margin-bottom: 15px; color: #666;">Пожалуйста, скопируйте заказ и отправьте его вручную:</p>
            <pre style="
                background: #f5f5f5;
                padding: 15px;
                border-radius: 8px;
                white-space: pre-wrap;
                word-wrap: break-word;
                font-size: 14px;
                max-height: 300px;
                overflow-y: auto;
            ">${orderText}</pre>
            <button onclick="this.closest('div[style]').remove()" style="
                margin-top: 15px;
                padding: 10px 20px;
                background: #2ecc71;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                width: 100%;
            ">Закрыть</button>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function formatOrderMessage(orderData) {
    let message = `🛒 <b>Новый заказ!</b>\n\n`;
    message += `👤 <b>Имя:</b> ${orderData.name}\n`;
    message += `📞 <b>Телефон:</b> ${orderData.phone}\n`;
    
    if (orderData.comment) {
        message += `💬 <b>Комментарий:</b> ${orderData.comment}\n`;
    }
    
    message += `\n📋 <b>Заказ:</b>\n`;
    
    orderData.order.forEach((item, index) => {
        message += `${index + 1}. ${item.name} x${item.quantity} - ${item.price * item.quantity}₽\n`;
        if (item.options.length > 0) {
            message += `   Дополнительно: ${item.options.join(', ')}\n`;
        }
        message += `   ${item.serviceType}\n`;
    });
    
    message += `\n💰 <b>Итого:</b> ${orderData.totalAmount}₽`;
    message += `\n📅 <b>Дата:</b> ${new Date().toLocaleString('ru-RU')}`;
    
    return message;
}

//ЗАКРЫТИЕ МОДАЛЬНЫХ ОКОН
window.addEventListener('click', function(e) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (e.target === modal) {
            modal.classList.remove('active');
            if (modal.id === 'cartModal') {
                cartState = 'cart';
            }
        }
    });
});
