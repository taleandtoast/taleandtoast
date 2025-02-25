function openPopup(breadType) {
    let popup = document.getElementById(`story-popup-${breadType}`);
    popup.style.display = 'block';

    // Add an event listener to close the popup when clicking outside
    document.addEventListener('click', function(event) {
        if (!popup.contains(event.target) && event.target!== document.querySelector(`button[onclick="openPopup('${breadType}')"]`)) {
            closePopup(breadType);
        }
    });
}

function closePopup(breadType) {
    document.getElementById(`story-popup-${breadType}`).style.display = 'none';
}

function increaseQuantity(breadType, storyId) {
    // Get the current quantity
    let quantityElement = document.getElementById(`quantity-${breadType}-${storyId}`);

    // Check if the element exists
    if (quantityElement) {
        let quantity = parseInt(quantityElement.innerText);
        quantity++;
        quantityElement.innerText = quantity;
    } else {
        console.error(`Quantity element not found for ${breadType} - ${storyId}`);
    }
}

function decreaseQuantity(breadType, storyId) {
    // Get the current quantity
    let quantityElement = document.getElementById(`quantity-${breadType}-${storyId}`);

    // Check if the element exists
    if (quantityElement) {
        let quantity = parseInt(quantityElement.innerText);
        if (quantity > 0) {
            quantity--;
        }
        quantityElement.innerText = quantity;
    } else {
        console.error(`Quantity element not found for ${breadType} - ${storyId}`);
    }
}

function addToCart(breadType) {
    // Get the selected quantities for each story
    let selectedQuantities = {}; // Replace with your actual logic to get quantities

    // Store the selections in local storage
    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    cart[breadType] = selectedQuantities;
    localStorage.setItem('cart', JSON.stringify(cart));

    // Close the pop-up
    closePopup(breadType);

    // Optional: Display a confirmation message
    alert('Items added to cart!');
}
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    let totalCount = 0;
    for (let breadType in cart) {
        for (let storyId in cart[breadType]) {
            totalCount += cart[breadType][storyId];
        }
    }
    document.getElementById('cart-count').innerText = totalCount;
}

// Call the function initially
updateCartCount();

// Call the function whenever the cart is updated (e.g., in addToCart and decreaseQuantity functions)
function addToCart(breadType) {
    //... (your existing code)...
    updateCartCount();
}

function decreaseQuantity(breadType, storyId) {
    //... (your existing code)...
    updateCartCount();
}
