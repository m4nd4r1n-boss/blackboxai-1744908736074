// Function to save product details to localStorage when clicking "Fazer Pedido"
function saveProductDetails(name, price, quantity = 1) {
    let drinks = [];
    
    // Get drink selections if they exist
    const drinkSelect = document.getElementById('drinkSelect');
    if (drinkSelect) {
        drinks.push(drinkSelect.value);
    }
    const drinkSelect1 = document.getElementById('drinkSelect1');
    if (drinkSelect1) {
        drinks.push(drinkSelect1.value);
    }
    const drinkSelect2 = document.getElementById('drinkSelect2');
    if (drinkSelect2) {
        drinks.push(drinkSelect2.value);
    }

    const product = {
        name: name,
        price: parseFloat(price),
        quantity: quantity,
        drinks: drinks
    };
    localStorage.setItem('selectedProduct', JSON.stringify(product));
}

// Function to get drink name for display
function getDrinkName(value) {
    const drinkNames = {
        'guarana': 'Guaraná Antarctica',
        'fanta': 'Fanta Laranja',
        'coca': 'Coca-Cola',
        'guarana-zero': 'Guaraná Antarctica Zero',
        'fanta-zero': 'Fanta Zero',
        'coca-zero': 'Coca-Cola Zero'
    };
    return drinkNames[value] || value;
}
