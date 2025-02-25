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
    } else {
        console.error('Popup not found:', `story-popup-${breadType}`);
    }
}

function closePopup(breadType) {
    let popup = document.getElementById(`story-popup-${breadType}`);
    if (popup) popup.style.display = 'none';
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
    document.querySelectorAll(`#story-popup-${breadType} .quantity`).forEach(element => {
        let storyId = element.id.replace(`quantity-${breadType}-`, '');
        selectedQuantities[storyId] = parseInt(element.innerText) || 0;
    });

    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    cart[breadType] = selectedQuantities;
    localStorage.setItem('cart', JSON.stringify(cart));

    closePopup(breadType);
}
