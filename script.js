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
    let totalAdded = 0; // Track total items added

    // Get selected quantities
    document.querySelectorAll(`#story-popup-${breadType} .quantity`).forEach(element => {
        let storyId = element.id.replace(`quantity-${breadType}-`, '');
        let quantity = parseInt(element.innerText) || 0;

        if (quantity > 0) {
            selectedQuantities[storyId] = quantity;
            totalAdded += quantity;
        }

        // Reset quantity in the popup to 0
        element.innerText = '0';
    });

    if (totalAdded === 0) {
        alert("Please select at least one item.");
        return;
    }

    // Store selections in local storage
    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    cart[breadType] = selectedQuantities;
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update the cart count in the top right corner
    updateCartCount();

    // Close the popup
    closePopup(breadType);
}

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    let totalCount = 0;

    // Sum up all the quantities from the cart
    Object.values(cart).forEach(breadItems => {
        Object.values(breadItems).forEach(quantity => {
            totalCount += quantity;
        });
    });

    // Update the cart icon count
    let cartIcon = document.getElementById('cart-count');
    if (cartIcon) {
        cartIcon.innerText = totalCount;
        cartIcon.style.display = totalCount > 0 ? 'block' : 'none'; // Hide if 0
    }
}

// Call updateCartCount on page load to show the correct number when refreshing
document.addEventListener("DOMContentLoaded", updateCartCount);
