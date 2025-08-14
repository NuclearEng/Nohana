/**
 * UI Enhancements and Micro-interactions for WaveSurf
 * Adds polish and premium feel to the application
 */

// Enhanced notification system
function showNotification(message, type = 'success', duration = 3000) {
    // Remove existing notifications
    const existing = document.querySelectorAll('.notification');
    existing.forEach(notif => notif.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <i class="fas ${getNotificationIcon(type)}" style="font-size: 1.2rem;"></i>
            <span style="font-weight: 500;">${message}</span>
        </div>
    `;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Show with animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto-hide
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

// Enhanced favorite button interactions
function initEnhancedFavorites() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.favorite')) {
            e.preventDefault();
            e.stopPropagation();
            
            const button = e.target.closest('.favorite');
            const listingId = button.dataset.listingId || button.closest('.listing-card')?.dataset.listingId;
            
            // Add animation
            button.style.transform = 'scale(0.8)';
            setTimeout(() => {
                button.style.transform = '';
                button.classList.toggle('active');
                
                // Show notification
                const isActive = button.classList.contains('active');
                const message = isActive ? 'Added to favorites! 💙' : 'Removed from favorites';
                showNotification(message, isActive ? 'success' : 'warning', 2000);
                
                // Store in localStorage
                updateFavoritesStorage(listingId, isActive);
            }, 150);
        }
    });
}

// Enhanced form interactions
function initEnhancedForms() {
    // Add floating label effect
    document.addEventListener('focusin', function(e) {
        if (e.target.matches('input, textarea, select')) {
            e.target.closest('.form-group')?.classList.add('focused');
        }
    });
    
    document.addEventListener('focusout', function(e) {
        if (e.target.matches('input, textarea, select')) {
            const formGroup = e.target.closest('.form-group');
            if (formGroup && !e.target.value) {
                formGroup.classList.remove('focused');
            }
        }
    });
    
    // Add validation feedback
    document.addEventListener('input', function(e) {
        if (e.target.matches('input[required], textarea[required]')) {
            validateField(e.target);
        }
    });
}

function validateField(field) {
    const isValid = field.checkValidity();
    field.classList.toggle('valid', isValid && field.value);
    field.classList.toggle('invalid', !isValid && field.value);
}

// Enhanced loading states
function addLoadingStates() {
    // Add skeleton loaders for cards
    const listingGrids = document.querySelectorAll('.featured-grid, .favorites-grid, #search-results');
    
    listingGrids.forEach(grid => {
        if (grid.children.length === 0) {
            addSkeletonCards(grid, 3);
        }
    });
}

function addSkeletonCards(container, count) {
    for (let i = 0; i < count; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'listing-card loading-skeleton';
        skeleton.innerHTML = `
            <div style="height: 200px; background: var(--background-lighter); border-radius: var(--border-radius);"></div>
            <div style="padding: 16px;">
                <div style="height: 20px; background: var(--background-lighter); border-radius: 4px; margin-bottom: 8px;"></div>
                <div style="height: 16px; background: var(--background-lighter); border-radius: 4px; width: 60%; margin-bottom: 12px;"></div>
                <div style="height: 24px; background: var(--background-lighter); border-radius: 4px; width: 40%;"></div>
            </div>
        `;
        container.appendChild(skeleton);
    }
}

// Enhanced button interactions
function initEnhancedButtons() {
    document.addEventListener('click', function(e) {
        if (e.target.matches('.btn, button') && !e.target.disabled) {
            createRippleEffect(e.target, e);
        }
    });
}

function createRippleEffect(button, event) {
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.style.cssText = `
        position: absolute;
        top: ${y}px;
        left: ${x}px;
        width: ${size}px;
        height: ${size}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
        z-index: 1;
    `;
    
    // Ensure button has relative positioning
    if (getComputedStyle(button).position === 'static') {
        button.style.position = 'relative';
    }
    
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// Add ripple animation CSS
function addRippleCSS() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple-animation {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Enhanced hover effects for cards
function initEnhancedCardHovers() {
    document.addEventListener('mouseenter', function(e) {
        if (e.target.closest('.listing-card, .category-item, .prop-item')) {
            const card = e.target.closest('.listing-card, .category-item, .prop-item');
            card.style.transform = 'translateY(-8px) scale(1.02)';
        }
    }, true);
    
    document.addEventListener('mouseleave', function(e) {
        if (e.target.closest('.listing-card, .category-item, .prop-item')) {
            const card = e.target.closest('.listing-card, .category-item, .prop-item');
            card.style.transform = '';
        }
    }, true);
}

// Storage helpers
function updateFavoritesStorage(listingId, isActive) {
    const favorites = JSON.parse(localStorage.getItem('wavesurf-favorites') || '[]');
    
    if (isActive && !favorites.includes(listingId)) {
        favorites.push(listingId);
    } else if (!isActive) {
        const index = favorites.indexOf(listingId);
        if (index > -1) favorites.splice(index, 1);
    }
    
    localStorage.setItem('wavesurf-favorites', JSON.stringify(favorites));
    
    // Update favorites count
    const countElement = document.getElementById('favorites-count');
    if (countElement) {
        countElement.textContent = favorites.length;
    }
}

// Enhanced page transitions
function initPageTransitions() {
    // Add smooth transition for page changes
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[data-route]');
        if (link && !e.defaultPrevented) {
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.style.opacity = '0.7';
                mainContent.style.transform = 'translateY(10px)';
                
                setTimeout(() => {
                    mainContent.style.opacity = '';
                    mainContent.style.transform = '';
                }, 100);
            }
        }
    });
}

// Initialize all enhancements
function initUIEnhancements() {
    addRippleCSS();
    initEnhancedFavorites();
    initEnhancedForms();
    initEnhancedButtons();
    initEnhancedCardHovers();
    initPageTransitions();
    addLoadingStates();
    
    // Show welcome notification
    setTimeout(() => {
        showNotification('Welcome to Nohana! 🌊', 'success', 4000);
    }, 1000);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUIEnhancements);
} else {
    initUIEnhancements();
}

// Expose functions globally
window.showNotification = showNotification;
window.initUIEnhancements = initUIEnhancements;
