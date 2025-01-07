// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Shopping cart functionality
let cart = [];
const cartPanel = document.createElement('div');
cartPanel.className = 'cart-panel';
document.body.appendChild(cartPanel);

function updateCartPanel() {
    cartPanel.innerHTML = `
        <div class="cart-header">
            <h2>Shopping Cart</h2>
            <span class="cart-close" onclick="toggleCart()">×</span>
        </div>
        <div class="cart-items">
            ${cart.map(item => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p>$${item.price}</p>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="cart-total">
            <h3>Total: $${calculateTotal()}</h3>
        </div>
    `;
}

function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
}

function updateQuantity(itemId, change) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        updateCartPanel();
        updateCartCount();
    }
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
}

function toggleCart() {
    cartPanel.classList.toggle('open');
}

// Handle order buttons
document.querySelectorAll('.order-button').forEach(button => {
    button.addEventListener('click', function() {
        const menuItem = this.closest('.menu-item');
        const itemId = menuItem.dataset.id || Date.now().toString();
        const itemName = menuItem.querySelector('h3').textContent;
        const itemPrice = parseFloat(menuItem.querySelector('.price').textContent.replace('$', ''));
        const itemImage = menuItem.querySelector('img').src;

        const existingItem = cart.find(item => item.id === itemId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: itemId,
                name: itemName,
                price: itemPrice,
                quantity: 1,
                image: itemImage
            });
        }

        updateCartPanel();
        updateCartCount();
        
        // Show notification
        alert(`Added ${itemName} to your cart!`);
    });
});

// Scroll animation
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.menu-item, .about-content, .contact-content').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Add scroll animation class
const scrollAnimation = () => {
    const elements = document.querySelectorAll('.menu-item, .about-content, .contact-content');
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight;
        
        if(elementPosition < screenPosition) {
            element.classList.add('animate');
        }
    });
}

window.addEventListener('scroll', scrollAnimation);

// Mobile menu toggle (if needed in the future)
const createMobileMenu = () => {
    const nav = document.querySelector('nav');
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.classList.add('mobile-menu-btn');
    mobileMenuBtn.innerHTML = '☰';
    
    mobileMenuBtn.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.toggle('show');
    });
    
    nav.appendChild(mobileMenuBtn);
}

// Call mobile menu creation if screen width is below 768px
if (window.innerWidth < 768) {
    createMobileMenu();
}