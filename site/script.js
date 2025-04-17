// Countdown Timer
function initializeTimer() {
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    
    if (!minutesElement || !secondsElement) {
        console.error('Timer elements not found');
        return;
    }

    let minutes = parseInt(minutesElement.textContent);
    let seconds = parseInt(secondsElement.textContent);
    
    const timer = setInterval(() => {
        if (seconds > 0) {
            seconds--;
        } else if (minutes > 0) {
            minutes--;
            seconds = 59;
        } else {
            clearInterval(timer);
            const timerContainer = document.querySelector('.promotion-timer');
            if (timerContainer) {
                timerContainer.innerHTML = '<p class="text-xl font-bold">Promoção Encerrada!</p>';
            }
            return;
        }
        
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
    }, 1000);
}

// Smooth scroll function
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// State selection dropdown enhancement
function initializeStateDropdown() {
    const stateDropdown = document.getElementById('state-dropdown');
    if (stateDropdown) {
        stateDropdown.addEventListener('change', (e) => {
            const selectedState = e.target.value;
            console.log('Selected state:', selectedState);
            // Additional functionality can be added here
        });
    }
}

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize timer if the elements exist
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    if (minutesElement && secondsElement) {
        initializeTimer();
    }
    initializeStateDropdown();

    // Add click handlers for promotional buttons
    const promoButtons = document.querySelectorAll('[data-scroll-target]');
    promoButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const target = button.getAttribute('data-scroll-target');
            smoothScroll(target);
        });
    });
});

// Error handling for image loading
function handleImageError(img) {
    img.src = 'images/placeholder.jpg'; // Fallback image
    img.alt = 'Image not available';
    img.classList.add('image-error');
}

// Add error handling to all images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', () => handleImageError(img));
    });
});
