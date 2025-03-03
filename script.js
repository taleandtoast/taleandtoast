document.addEventListener('click', function(event) {
    let popups = document.querySelectorAll('.story-popup');
    popups.forEach(popup => {
        if (!popup.contains(event.target) && !event.target.classList.contains('buy-button')) {
            popup.style.display = 'none';
        }
    });
});

function openPopup(breadType) {
    let popup = document.getElementById(`story-popup-${breadType}`);
    if (popup) {
        popup.style.display = 'block';
        setTimeout(() => {
            document.addEventListener('click', closePopupOnOutsideClick);
        }, 100);
    } else {
        console.error('Popup not found:', `story-popup-${breadType}`);
    }
}

function closePopup(breadType) {
    let popup = document.getElementById(`story-popup-${breadType}`);
    if (popup) {
        popup.style.display = 'none';
        document.removeEventListener('click', closePopupOnOutsideClick);
    }
}

function closePopupOnOutsideClick(event) {
    let popups = document.querySelectorAll('.story-popup');
    popups.forEach(popup => {
        if (!popup.contains(event.target) && !event.target.classList.contains('buy-button')) {
            popup.style.display = 'none';
        }
    });
}

function increaseQuantity(breadType, storyId) {
    let quantityElement = document.getElementById(`quantity-${breadType}-${storyId}`);
    if (quantityElement) {
        let quantity = parseInt(quantityElement.innerText) || 0;
        quantityElement.innerText = quantity + 1;
        updateCartCount();
    }
}

function decreaseQuantity(breadType, storyId) {
    let quantityElement = document.getElementById(`quantity-${breadType}-${storyId}`);
    if (quantityElement) {
        let quantity = parseInt(quantityElement.innerText) || 0;
        if (quantity > 0) {
            quantityElement.innerText = quantity - 1;
            updateCartCount();
        }
    }
}

function addToCart(breadType) {
    let selectedQuantities = {};
    let totalAdded = 0;
    document.querySelectorAll(`#story-popup-${breadType} .quantity`).forEach(element => {
        let storyId = element.id.replace(`quantity-${breadType}-`, '');
        let quantity = parseInt(element.innerText) || 0;
        if (quantity > 0) {
            selectedQuantities[storyId] = quantity;
            totalAdded += quantity;
        }
        element.innerText = '0';
    });
    if (totalAdded === 0) {
        alert("Please select at least one item.");
        return;
    }
    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    cart[breadType] = selectedQuantities;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    closePopup(breadType);
}

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    let totalCount = 0;
    Object.values(cart).forEach(breadItems => {
        Object.values(breadItems).forEach(quantity => {
            totalCount += quantity;
        });
    });
    let cartIcon = document.getElementById('cart-count');
    if (cartIcon) {
        cartIcon.innerText = totalCount;
        cartIcon.style.display = totalCount > 0 ? 'block' : 'none';
    }
}

document.addEventListener("DOMContentLoaded", function() {
    updateCartCount();
    updateCartDisplay();
});

function updateCartDisplay() {
    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    let cartItemsDiv = document.getElementById('cart-items');
    cartItemsDiv.innerHTML = "";
    let hasItems = false;
    let totalPrice = 0;
    const prices = { 'Sourdough': 7.00, 'Multigrain': 8.00, 'Rye': 8.50 };

    for (let breadType in cart) {
        let itemDiv = document.createElement('div');
        itemDiv.innerHTML = `<h3>${breadType}</h3>`;
        for (let storyId in cart[breadType]) {
            let quantity = cart[breadType][storyId];
            if (quantity > 0) {
                let itemPrice = (prices[breadType] || 0) * quantity;
                totalPrice += itemPrice;
                itemDiv.innerHTML += `<p>${storyId}: ${quantity} - CAD ${itemPrice.toFixed(2)}</p>`;
                hasItems = true;
            }
        }
        cartItemsDiv.appendChild(itemDiv);
    }
    if (!hasItems) {
        cartItemsDiv.innerHTML = "<p>Your cart is empty.</p>";
    } else {
        let totalDiv = document.createElement('div');
        totalDiv.innerHTML = `<h3>Total Price: CAD ${totalPrice.toFixed(2)}</h3>`;
        cartItemsDiv.appendChild(totalDiv);
    }
    updateCartCount();
}

function submitOrder() {
    let email = prompt("Please enter your email address:");
    if (!email) {
        alert("Email is required to place an order.");
        return;
    }
    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    if (Object.keys(cart).length === 0) {
        alert("Your cart is empty.");
        return;
    }
    let cartDetails = "";
    let totalPrice = 0;
    const prices = { 'sourdough': 7.00, 'multigrain': 8.00, 'rye': 8.50 };
    for (let breadType in cart) {
        cartDetails += `<h3>${breadType}</h3>`;
        for (let storyId in cart[breadType]) {
            let quantity = cart[breadType][storyId];
            if (quantity > 0) {
                let itemPrice = (prices[breadType] || 0) * quantity;
                totalPrice += itemPrice;
                cartDetails += `<p>${storyId}: ${quantity} - CAD ${itemPrice.toFixed(2)}</p>`;
            }
        }
    }
    cartDetails += `<h3>Total Price: CAD ${totalPrice.toFixed(2)}</h3>`;
    let templateParams = {
        to_email: 'taleandtoast@gmail.com',
        from_name: email,
        cart_details: cartDetails
    };
    emailjs.send('service_6qmoq6g', 'template_porl14s', templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            alert('Order submitted successfully!');
            localStorage.removeItem('cart');
            updateCartCount();
            window.location.href = "index.html";
        }, function(error) {
            console.error('FAILED...', error);
            alert('Error submitting order. Please try again later.');
        });
}
