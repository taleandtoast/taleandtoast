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
    let quantityElement = document.getElementById(`quantity-<span class="math-inline">\{breadType\}\-</span>{storyId}`);

    // Check if the element exists
    if (quantityElement) {
        let quantity = parseInt(quantityElement.innerText);
        quantity++;
        quantityElement.innerText = quantity;

        // Update cart count
        updateCartCount();
    } else {
        console.error(`Quantity element not found for ${breadType} - ${storyId}`);
    }
}

function decreaseQuantity(breadType, storyId) {
    // Get the current quantity
    let quantityElement = document.getElementById(`quantity-<span class="math-inline">\{breadType\}\-</span>{storyId}`);

    // Check if the element exists
    if (quantityElement) {
        let quantity = parseInt(quantityElement.innerText);
        if (quantity > 0) {
            quantity--;
            quantityElement.innerText = quantity;

            // Update cart count
            updateCartCount();
        }
    } else {
        console.error(`Quantity element not found for ${breadType} - ${storyId}`);
    }
}

function addToCart(breadType) {
    // Get the selected quantities for each story
    let selectedQuantities = {};
    // Example:
    selectedQuantities['story1'] = parseInt(document.getElementById('quantity-sourdough-story1').innerText);
    selectedQuantities['story2'] = parseInt(document.getElementById('quantity-sourdough-story2').innerText);
    //... get quantities for other stories...

    // Store the selections in local storage
    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    cart[breadType] = selectedQuantities;
    localStorage.setItem('cart', JSON.stringify(cart));

    // Reset the quantities in the pop-up
    let quantityElements = document.querySelectorAll(`#story-popup-${breadType}.quantity`);
    quantityElements.forEach(element => {
        element.innerText =
