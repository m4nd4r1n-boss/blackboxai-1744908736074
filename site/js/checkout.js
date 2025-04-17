// Function to update order summary
function updateOrderSummary() {
    const orderItems = document.getElementById('orderItems');
    const cartTotal = document.getElementById('cartTotal');
    const totalElement = document.querySelector('.border-t .text-primary');
    const storedProduct = localStorage.getItem('selectedProduct');

    if (storedProduct) {
        const product = JSON.parse(storedProduct);
        const total = product.price * product.quantity;

        // Update order items
        let drinksHtml = '';
        if (product.drinks && product.drinks.length > 0) {
            const drinksList = product.drinks.map(drink => getDrinkName(drink)).join('<br>');
            drinksHtml = `
                <div class="mt-2">
                    <p class="text-sm text-gray-600">Bebidas:</p>
                    <p class="text-sm">${drinksList}</p>
                </div>
            `;
        }

        orderItems.innerHTML = `
            <div class="flex justify-between items-start border-b pb-4">
                <div>
                    <h3 class="font-semibold">${product.name}</h3>
                    <p class="text-sm text-gray-600">Quantidade: ${product.quantity}</p>
                    ${drinksHtml}
                </div>
                <div class="text-right">
                    <p class="font-semibold">R$ ${total.toFixed(2)}</p>
                    <p class="text-sm text-gray-600">R$ ${product.price.toFixed(2)} cada</p>
                </div>
            </div>
        `;

        // Update all total displays
        cartTotal.textContent = `R$ ${total.toFixed(2)}`;
        if (totalElement) {
            totalElement.textContent = `R$ ${total.toFixed(2)}`;
        }

        // Update Pix QR code with new total
        if (window.pixQRCode) {
            window.pixQRCode.update(total);
        }
    }
}

// Initialize all functionality when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Update order summary with selected product
    updateOrderSummary();

    // Initialize input masks
    const masks = {
        phone: {
            mask: '(00) 00000-0000'
        },
        cep: {
            mask: '00000-000'
        },
        cardNumber: {
            mask: '0000 0000 0000 0000'
        },
        cardCvv: {
            mask: '0000',
            maxLength: 4
        },
        cardExpiry: {
            mask: 'MM/YY',
            blocks: {
                MM: {
                    mask: IMask.MaskedRange,
                    from: 1,
                    to: 12
                },
                YY: {
                    mask: IMask.MaskedRange,
                    from: 23,
                    to: 33
                }
            }
        }
    };

    // Apply masks to inputs
    Object.entries(masks).forEach(([id, maskOptions]) => {
        const element = document.getElementById(id);
        if (element) {
            IMask(element, maskOptions);
        }
    });

    // Initialize Pix QR code with amount from localStorage
    const qrcodeElement = document.getElementById('qrcode');
    const copyPasteElement = document.getElementById('pixCode');
    const storedProduct = localStorage.getItem('selectedProduct');
    const product = storedProduct ? JSON.parse(storedProduct) : null;
    const amount = product ? product.price * product.quantity : 0;
    
    window.pixQRCode = new PixQRCode({
        amount: amount,
        qrCodeElement: qrcodeElement,
        copyPasteElement: copyPasteElement
    });

    // Initialize payment method tabs
    const pixTab = document.querySelector('[onclick="switchPaymentMethod(\'pix\')"]');
    if (pixTab) {
        pixTab.click(); // Start with Pix tab active
    }

    // CEP auto-complete
    document.getElementById('cep').addEventListener('blur', function(e) {
        const cep = e.target.value.replace(/\D/g, '');
        if (cep.length === 8) {
            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(response => response.json())
                .then(data => {
                    if (!data.erro) {
                        document.getElementById('street').value = data.logradouro;
                        document.getElementById('neighborhood').value = data.bairro;
                        document.getElementById('city').value = data.localidade;
                        document.getElementById('state').value = data.uf;
                    }
                });
        }
    });
});

// Function to update cart total and Pix QR code
window.updateTotal = function() {
    const storedProduct = localStorage.getItem('selectedProduct');
    const total = storedProduct ? JSON.parse(storedProduct).price : 0;
    document.getElementById('cartTotal').textContent = `R$ ${total.toFixed(2)}`;
    if (window.pixQRCode) {
        window.pixQRCode.update(total);
    }
};

// Function to switch between payment methods
window.switchPaymentMethod = function(method) {
    const pixTab = document.querySelector('[onclick="switchPaymentMethod(\'pix\')"]');
    const cardTab = document.querySelector('[onclick="switchPaymentMethod(\'card\')"]');
    const pixPayment = document.getElementById('pixPayment');
    const cardPayment = document.getElementById('cardPayment');

    if (method === 'pix') {
        pixTab.classList.add('active');
        cardTab.classList.remove('active');
        pixPayment.classList.remove('hidden');
        cardPayment.classList.add('hidden');
        
        // Update Pix QR code with current total
        const storedProduct = localStorage.getItem('selectedProduct');
        const product = storedProduct ? JSON.parse(storedProduct) : null;
        const total = product ? product.price * product.quantity : 0;
        if (window.pixQRCode) {
            window.pixQRCode.update(total);
            document.getElementById('cartTotal').textContent = `R$ ${total.toFixed(2)}`;
        }
    } else {
        cardTab.classList.add('active');
        pixTab.classList.remove('active');
        cardPayment.classList.remove('hidden');
        pixPayment.classList.add('hidden');
    }
};
