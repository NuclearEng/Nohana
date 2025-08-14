// Router for Nohana Application
let waveRouter;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize router
    waveRouter = new Navigo('/', { hash: true });
    
    // Define routes
    waveRouter
        .on('/', showHomePage)
        .on('/search', showSearchResults)
        .on('/listing/:id', showListingDetail)
        .on('/host', showHostDashboard)
        .on('/help', showStaticPlaceholder)
        .on('/safety', showStaticPlaceholder)
        .on('/cancellation', showStaticPlaceholder)
        .on('/covid', showStaticPlaceholder)
        .on('/host-resources', showStaticPlaceholder)
        .on('/community-forum', showStaticPlaceholder)
        .on('/responsible-hosting', showStaticPlaceholder)
        .on('/about', showStaticPlaceholder)
        .on('/news', showStaticPlaceholder)
        .on('/investors', showStaticPlaceholder)
        .on('/careers', showStaticPlaceholder)
        .on('/privacy', showStaticPlaceholder)
        .on('/terms', showStaticPlaceholder)
        .on('/sitemap', showStaticPlaceholder)
        .on('/become-host', showBecomeHostPage)
        .on('/bookings', showBookings)
        .on('/favorites', showFavoritesPage)
        .on('/account', showAccountPage)
        .on('/booking/:id', showBookingPage)
        .on('/booking-confirmation/:id', showBookingConfirmation)
        .on('/booking-details/:id', showBookingDetails)
        .on('/messages', showMessagesPage)
        .notFound(show404);
    
    // Resolve initial route
    waveRouter.resolve();
    
    // Make router available globally
    window.waveRouter = waveRouter;
    
    // Add event listeners for navigation links
    document.querySelectorAll('[data-route]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const route = this.getAttribute('data-route');
            waveRouter.navigate(route);
        });
    });
});

// Loading overlay helpers
function toggleLoadingOverlay(show, message = 'Loading...') {
    const overlay = document.getElementById('page-loading');
    const messageEl = overlay.querySelector('.loading-message');
    
    if (show) {
        messageEl.textContent = message;
        overlay.style.display = 'flex';
    } else {
        overlay.style.display = 'none';
    }
}

// Script loading helper
function loadScript(src) {
    return new Promise((resolve, reject) => {
        // Check if script is already loaded
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Navigation helpers
function navigateToHome() {
    waveRouter.navigate('/');
}

/**
 * Show the home page
 */
function showHomePage() {
    console.log('Home page loaded');
    document.title = 'Nohana - Book Boat Activities';
    
    // Get the main content container
    const mainContent = document.getElementById('main-content');
    if (!mainContent) {
        console.error('Main content container not found');
        return;
    }
    
    toggleLoadingOverlay(true, 'Loading home page...');
    
    // Set the content from templates
    if (window.templates && window.templates['home']) {
        mainContent.innerHTML = window.templates['home'];
    } else {
        mainContent.innerHTML = '<div class="error-message"><h2>Error Loading Page</h2><p>Home content is temporarily unavailable. Please try again later.</p></div>';
        console.error('Home template not found');
        toggleLoadingOverlay(false);
        return;
    }
    
    // Initialize sliders
    initSliders();
    
    // Initialize favorite buttons
    initFavoriteButtons();
    
    // Hide loading overlay
    toggleLoadingOverlay(false);
}

/**
 * Show the search results page
 */
function showSearchResults() {
    console.log('Search results page loaded');
    document.title = 'Search Results - Nohana';
    
    toggleLoadingOverlay(true, 'Loading search results...');
    
    // Get the main content container
    const mainContent = document.getElementById('main-content');
    if (!mainContent) {
        console.error('Main content container not found');
        toggleLoadingOverlay(false);
        return;
    }
    
    // Load search results template
    fetch('js/search-results-template.html')
        .then(response => response.text())
        .then(template => {
            // Set the template as the content
            mainContent.innerHTML = template;
            
            // Load search results script
            return loadScript('js/search-results.js');
        })
        .then(() => {
            if (typeof initSearchResults === 'function') {
                initSearchResults();
            } else {
                console.error('Search results initialization function not found');
                toggleLoadingOverlay(false);
            }
        })
        .catch(error => {
            console.error('Failed to load search results:', error);
            mainContent.innerHTML = '<div class="error-message"><h2>Error Loading Search</h2><p>Search results are temporarily unavailable. Please try again later.</p></div>';
            toggleLoadingOverlay(false);
        });
}

/**
 * Show the listing detail page
 * @param {Object} match - The route match object
 */
function showListingDetail(match) {
    console.log('Listing detail page loaded');
    
    // Get listing ID from URL
    const listingId = match.data.id;
    if (!listingId) {
        console.error('Listing ID not found in URL');
        navigateToHome();
        return;
    }
    
    toggleLoadingOverlay(true, 'Loading listing details...');

    // Ensure the listing detail template is injected so required containers exist
    const mainContentEl = document.getElementById('main-content');
    if (mainContentEl && window.templates && window.templates['listing-detail']) {
        mainContentEl.innerHTML = window.templates['listing-detail'];
    }
    
    // Load listings service and listing detail scripts if not already loaded
    Promise.all([
        loadScript('js/listings-service.js'),
        loadScript('js/listing-detail-functions.js'),
        loadScript('js/listing-detail.js')
    ])
        .then(() => {
            if (typeof initListingDetail === 'function') {
                initListingDetail(listingId);
            } else {
                console.error('Listing detail initialization function not found');
                navigateToHome();
            }
        })
        .catch(error => {
            console.error('Failed to load listing detail script:', error);
            navigateToHome();
        });
}

/**
 * Show the host dashboard
 */
function showHostDashboard() {
    console.log('Host dashboard loaded');
    document.title = 'Host Dashboard - Nohana';
    
    toggleLoadingOverlay(true, 'Loading host dashboard...');
    
    // Check if user is logged in and is a host
    if (window.AuthService && !window.AuthService.isHost()) {
        // Redirect to become-host page
        toggleLoadingOverlay(false);
        waveRouter.navigate('/become-host');
        return;
    }
    
    // Get the main content container
    const mainContent = document.getElementById('main-content');
    if (!mainContent) {
        console.error('Main content container not found');
        toggleLoadingOverlay(false);
        return;
    }

    // Load host dashboard template then script
    fetch('js/host-dashboard-template.html')
        .then(response => response.text())
        .then(template => {
            mainContent.innerHTML = template;
            return loadScript('js/host-dashboard.js');
        })
        .then(() => {
            if (typeof initHostDashboard === 'function') {
                initHostDashboard();
            } else {
                console.error('Host dashboard initialization function not found');
                navigateToHome();
            }
        })
        .catch(error => {
            console.error('Failed to load host dashboard:', error);
            navigateToHome();
        });
}

/**
 * Show the become a captain page
 */
function showBecomeHostPage() {
    console.log('Become a captain page loaded');
    document.title = 'Become a Captain - Nohana';
    
    // Check if user is already a host
    if (window.AuthService && window.AuthService.isHost()) {
        // Redirect to host dashboard
        waveRouter.navigate('/host');
        return;
    }
    
    toggleLoadingOverlay(true, 'Loading...');
    
    // Get the main content container
    const mainContent = document.getElementById('main-content');
    if (!mainContent) {
        console.error('Main content container not found');
        toggleLoadingOverlay(false);
        return;
    }
    
    // Load become host template
    fetch('js/become-host-template.html')
        .then(response => response.text())
        .then(template => {
            // Set the template as the content
            mainContent.innerHTML = template;
            
            // Load become host script
            return loadScript('js/become-host.js');
        })
        .then(() => {
            if (typeof initBecomeHostPage === 'function') {
                initBecomeHostPage();
            } else {
                console.error('Become captain page initialization function not found');
                toggleLoadingOverlay(false);
            }
        })
        .catch(error => {
            console.error('Failed to load become captain page:', error);
            mainContent.innerHTML = '<div class="error-message"><h2>Error Loading Page</h2><p>This page is temporarily unavailable. Please try again later.</p></div>';
            toggleLoadingOverlay(false);
        });
}

/**
 * Show the favorites page
 */
function showFavoritesPage() {
    console.log('Favorites page loaded');
    document.title = 'My Favorites - Nohana';
    
    // Check if user is logged in
    if (window.AuthService && !window.AuthService.isLoggedIn()) {
        alert('You need to be logged in to view your favorites');
        navigateToHome();
        return;
    }
    
    toggleLoadingOverlay(true, 'Loading your favorites...');
    
    // Get the main content container
    const mainContent = document.getElementById('main-content');
    if (!mainContent) {
        console.error('Main content container not found');
        toggleLoadingOverlay(false);
        return;
    }
    
    // Set the content from templates
    if (window.templates && window.templates['favorites-page']) {
        mainContent.innerHTML = window.templates['favorites-page'];
        
        // Load favorites page script
        loadScript('js/favorites-page.js')
            .then(() => {
                if (typeof initFavoritesPage === 'function') {
                    initFavoritesPage();
                } else {
                    console.error('Favorites page initialization function not found');
                    toggleLoadingOverlay(false);
                }
            })
            .catch(error => {
                console.error('Failed to load favorites page script:', error);
                toggleLoadingOverlay(false);
                navigateToHome();
            });
    } else {
        mainContent.innerHTML = '<div class="error-message"><h2>Error Loading Favorites</h2><p>Your favorites page is temporarily unavailable. Please try again later.</p></div>';
        console.error('Favorites page template not found');
        toggleLoadingOverlay(false);
    }
}

/**
 * Show the account page
 */
function showAccountPage() {
    console.log('Account page loaded');
    document.title = 'My Account - Nohana';
    
    // Check if user is logged in
    if (window.AuthService && !window.AuthService.isLoggedIn()) {
        alert('You need to be logged in to view your account');
        navigateToHome();
        return;
    }
    
    toggleLoadingOverlay(true, 'Loading your account...');
    
    // Get the main content container
    const mainContent = document.getElementById('main-content');
    if (!mainContent) {
        console.error('Main content container not found');
        toggleLoadingOverlay(false);
        return;
    }
    
    // Load user profile template
    fetch('js/user-profile-template.html')
        .then(response => response.text())
        .then(template => {
            // Set the template as the content
            mainContent.innerHTML = template;
            
            // Hide loading overlay immediately after template is loaded
            toggleLoadingOverlay(false);
            
            // Load account page script
            return loadScript('js/account-page.js');
        })
        .then(() => {
            if (typeof initAccountPage === 'function') {
                initAccountPage();
            } else {
                console.error('Account page initialization function not found');
            }
        })
        .catch(error => {
            console.error('Failed to load account page:', error);
            toggleLoadingOverlay(false);
            navigateToHome();
        });
}

/**
 * Show the messages page
 */
function showMessagesPage() {
    console.log('Messages page loaded');
    document.title = 'Messages - Nohana';
    
    // Check if user is logged in
    if (window.AuthService && !window.AuthService.isLoggedIn()) {
        alert('You need to be logged in to view your messages');
        navigateToHome();
        return;
    }
    
    toggleLoadingOverlay(true, 'Loading your messages...');
    
    // Get the main content container
    const mainContent = document.getElementById('main-content');
    if (!mainContent) {
        console.error('Main content container not found');
        toggleLoadingOverlay(false);
        return;
    }
    
    // Load CSS if not already loaded
    if (!document.querySelector('link[href="css/messaging.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'css/messaging.css';
        document.head.appendChild(link);
    }
    
    // Load messages template
    fetch('js/messages-template.html')
        .then(response => response.text())
        .then(template => {
            // Set the template as the content
            mainContent.innerHTML = template;
            
            // Hide loading overlay immediately after template is loaded
            toggleLoadingOverlay(false);
            
            // Load messages page script
            return loadScript('js/messages-page.js');
        })
        .then(() => {
            if (typeof initMessagesPage === 'function') {
                initMessagesPage();
            } else {
                console.error('Messages page initialization function not found');
            }
        })
        .catch(error => {
            console.error('Failed to load messages page:', error);
            toggleLoadingOverlay(false);
            navigateToHome();
        });
}

/**
 * Show the bookings page
 */
function showBookings() {
    console.log('Bookings page loaded');
    document.title = 'Your Bookings - Nohana';
    
    // Check if user is logged in
    if (window.AuthService && !window.AuthService.isLoggedIn()) {
        alert('You need to be logged in to view your bookings');
        navigateToHome();
        return;
    }
    
    toggleLoadingOverlay(true, 'Loading your bookings...');
    
    // Get the main content container
    const mainContent = document.getElementById('main-content');
    if (!mainContent) {
        console.error('Main content container not found');
        toggleLoadingOverlay(false);
        return;
    }
    
    // Load bookings template
    fetch('js/bookings-template.html')
        .then(response => response.text())
        .then(template => {
            // Set the template as the content
            mainContent.innerHTML = template;
            
            // Load bookings page script
            return loadScript('js/bookings-page.js');
        })
        .then(() => {
            if (typeof initBookingsPage === 'function') {
                initBookingsPage();
            } else {
                console.error('Bookings page initialization function not found');
                toggleLoadingOverlay(false);
            }
        })
        .catch(error => {
            console.error('Failed to load bookings page:', error);
            toggleLoadingOverlay(false);
            navigateToHome();
        });
}

/**
 * Show the booking page
 * @param {Object} match - The route match object
 */
function showBookingPage(match) {
    console.log('Booking page loaded');
    document.title = 'Book a Seat - Nohana';
    
    // Get listing ID from URL
    const listingId = match.data.id;
    if (!listingId) {
        console.error('Listing ID not found in URL');
        navigateToHome();
        return;
    }
    
    toggleLoadingOverlay(true, 'Loading booking page...');
    
    // Get the main content container
    const mainContent = document.getElementById('main-content');
    if (!mainContent) {
        console.error('Main content container not found');
        toggleLoadingOverlay(false);
        return;
    }
    
    // Set the content from templates
    if (window.templates && window.templates['booking-page']) {
        mainContent.innerHTML = window.templates['booking-page'];
        
        // Load listings service first, then booking page script
        Promise.all([
            loadScript('js/listings-service.js'),
            loadScript('js/booking-page.js')
        ])
            .then(() => {
                if (typeof initBookingPage === 'function') {
                    // Get query parameters
                    const params = new URLSearchParams(window.location.hash.split('?')[1]);
                    const date = params.get('date');
                    const time = params.get('time');
                    const seats = params.get('seats');
                    
                    initBookingPage(listingId, date, time, seats);
                } else {
                    console.error('Booking page initialization function not found');
                    toggleLoadingOverlay(false);
                    navigateToHome();
                }
            })
            .catch(error => {
                console.error('Failed to load booking page script:', error);
                toggleLoadingOverlay(false);
                navigateToHome();
            });
    } else {
        console.error('Booking page template not found');
        toggleLoadingOverlay(false);
        navigateToHome();
    }
}

/**
 * Show the booking confirmation page
 * @param {Object} match - The route match object
 */
function showBookingConfirmation(match) {
    console.log('Booking confirmation page loaded');
    document.title = 'Booking Confirmation - Nohana';
    
    // Get booking ID from URL
    const bookingId = match.data.id;
    if (!bookingId) {
        console.error('Booking ID not found in URL');
        navigateToHome();
        return;
    }
    
    toggleLoadingOverlay(true, 'Loading booking confirmation...');
    
    // Get the main content container
    const mainContent = document.getElementById('main-content');
    if (!mainContent) {
        console.error('Main content container not found');
        toggleLoadingOverlay(false);
        return;
    }
    
    // Set the content from templates
    if (window.templates && window.templates['booking-confirmation']) {
        mainContent.innerHTML = window.templates['booking-confirmation'];
        
        // Initialize booking confirmation
        if (typeof initBookingConfirmation === 'function') {
            initBookingConfirmation(bookingId);
        } else {
            console.error('Booking confirmation initialization function not found');
            toggleLoadingOverlay(false);
            navigateToHome();
        }
    } else {
        console.error('Booking confirmation template not found');
        toggleLoadingOverlay(false);
        navigateToHome();
    }
}

/**
 * Show the booking details page
 * @param {Object} match - The route match object
 */
function showBookingDetails(match) {
    console.log('Booking details page loaded');
    document.title = 'Booking Details - Nohana';
    
    // Get booking ID from URL
    const bookingId = match.data.id;
    if (!bookingId) {
        console.error('Booking ID not found in URL');
        navigateToHome();
        return;
    }
    
    toggleLoadingOverlay(true, 'Loading booking details...');
    
    // Get the main content container
    const mainContent = document.getElementById('main-content');
    if (!mainContent) {
        console.error('Main content container not found');
        toggleLoadingOverlay(false);
        return;
    }
    
    // Load booking details template
    fetch('js/booking-details-template.html')
        .then(response => response.text())
        .then(template => {
            // Set the template as the content
            mainContent.innerHTML = template;
            
            // Load booking details script
            return loadScript('js/booking-details.js');
        })
        .then(() => {
            if (typeof initBookingDetails === 'function') {
                initBookingDetails(bookingId);
            } else {
                console.error('Booking details initialization function not found');
                toggleLoadingOverlay(false);
                navigateToHome();
            }
        })
        .catch(error => {
            console.error('Failed to load booking details:', error);
            toggleLoadingOverlay(false);
            navigateToHome();
        });
}

/**
 * Show 404 page
 */
function show404() {
    console.log('Page not found');
    document.title = 'Page Not Found - Nohana';
    
    // Get the main content container
    const mainContent = document.getElementById('main-content');
    if (!mainContent) {
        console.error('Main content container not found');
        return;
    }
    
    // Create 404 content
    const content = `
        <div class="error-page">
            <h1>404</h1>
            <h2>Page Not Found</h2>
            <p>The page you are looking for does not exist.</p>
            <a href="#/" data-route="/" class="btn-primary">Return to Home</a>
        </div>
    `;
    
    // Set the content
    mainContent.innerHTML = content;
    
    // Hide loading overlay
    toggleLoadingOverlay(false);
}

/**
 * Generic static placeholder route handler for not-yet-implemented pages
 */
function showStaticPlaceholder() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;
    mainContent.innerHTML = `
        <div class="surface card-body">
            <h1>Coming soon</h1>
            <p>This page is not available in the demo. All primary flows (home, search, listing, booking, account, favorites, host) are fully functional.</p>
            <a href="#/" data-route="/" class="btn-primary">Return to Home</a>
        </div>
    `;
    toggleLoadingOverlay(false);
}

// Helper functions
function initSliders() {
    const sliders = document.querySelectorAll('.image-slider');
    
    sliders.forEach(slider => {
        const slides = slider.querySelectorAll('.slide');
        const dotsContainer = slider.querySelector('.slider-dots');
        
        if (slides.length <= 1) return;
        
        // Create dots
        dotsContainer.innerHTML = '';
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.setAttribute('data-index', index);
            dotsContainer.appendChild(dot);
            
            dot.addEventListener('click', () => {
                showSlide(slider, index);
            });
        });
        
        // Add navigation buttons
        const prevBtn = slider.querySelector('.prev-slide');
        const nextBtn = slider.querySelector('.next-slide');
        
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                const currentIndex = getCurrentIndex(slider);
                const newIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
                showSlide(slider, newIndex);
            });
            
            nextBtn.addEventListener('click', () => {
                const currentIndex = getCurrentIndex(slider);
                const newIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
                showSlide(slider, newIndex);
            });
        }
    });
}

function getCurrentIndex(slider) {
    const activeSlide = slider.querySelector('.slide.active');
    return Array.from(slider.querySelectorAll('.slide')).indexOf(activeSlide);
}

function showSlide(slider, index) {
    const slides = slider.querySelectorAll('.slide');
    const dots = slider.querySelectorAll('.dot');
    
    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    
    // Show selected slide
    slides[index].classList.add('active');
    
    // Update dots
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
}

function initFavoriteButtons() {
    const favoriteButtons = document.querySelectorAll('.favorite');
    
    favoriteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const listingId = button.getAttribute('data-id');
            
            // Check if Favorites service is available
            if (window.Favorites) {
                const isFavorite = window.Favorites.toggle(listingId);
                
                // Update button state
                if (isFavorite) {
                    button.classList.add('active');
                    button.querySelector('i').classList.remove('far');
                    button.querySelector('i').classList.add('fas');
                } else {
                    button.classList.remove('active');
                    button.querySelector('i').classList.remove('fas');
                    button.querySelector('i').classList.add('far');
                }
            }
        });
    });
}