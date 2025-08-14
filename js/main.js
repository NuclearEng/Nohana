// Initialize the map
window.initMap = function() {
    try {
        // Check if Google Maps Advanced Markers is available
        const useAdvancedMarkers = typeof google?.maps?.marker?.AdvancedMarkerElement === 'function';
        
        // Sample coordinates for Austin, TX
        const center = { lat: 30.2672, lng: -97.7431 };
        
        // Create the map
        const mapContainer = document.getElementById("map");
        if (!mapContainer) {
            console.warn('Map container #map not found. Skipping initMap.');
            return;
        }

        const map = new google.maps.Map(mapContainer, {
            center: center,
            zoom: 12,
            disableDefaultUI: true,
            styles: [
                {
                    featureType: "poi",
                    stylers: [{ visibility: "off" }],
                },
                {
                    featureType: "transit",
                    elementType: "labels.icon",
                    stylers: [{ visibility: "off" }],
                }
            ],
        });
        
        // Sample boat listing data
        const listings = [
            {
                position: { lat: 30.3884, lng: -97.9462 },
                title: "Mastercraft X-Star - Perfect for Wakesurfing",
                price: "$45",
                priceUnit: "seat",
                rating: "4.98",
                reviews: 43,
                availableSeats: 5,
                totalSeats: 8,
                image: "images/listings/boat1-1.jpg",
                id: "listing-1"
            },
            {
                position: { lat: 30.2974, lng: -97.7516 },
                title: "Malibu Wakesetter - Best Wake in Austin",
                price: "$55",
                priceUnit: "seat",
                rating: "4.92",
                reviews: 78,
                availableSeats: 7,
                totalSeats: 10,
                image: "images/listings/boat2-1.jpg",
                id: "listing-2"
            },
            {
                position: { lat: 30.3118, lng: -95.6269 },
                title: "Pro Bass Fishing Boat with Guide",
                price: "$35",
                priceUnit: "seat",
                rating: "4.89",
                reviews: 56,
                availableSeats: 3,
                totalSeats: 4,
                image: "images/listings/boat3-1.jpg",
                id: "listing-3"
            }
        ];
        
        // Create markers for each listing
        listings.forEach(listing => {
            // Create info window content
            const content = `
                <div class="map-popup">
                    <img src="${listing.image}" alt="${listing.title}">
                    <div class="popup-info">
                        <div class="popup-rating">
                            <i class="fas fa-star"></i>
                            <span>${listing.rating}</span>
                            <span class="popup-reviews">(${listing.reviews})</span>
                        </div>
                        <h4>${listing.title}</h4>
                        <div class="popup-price">
                            <span class="price">${listing.price}</span> / ${listing.priceUnit}
                        </div>
                        <div class="popup-seats">
                            <i class="fas fa-user"></i> ${listing.availableSeats} seats available
                        </div>
                    </div>
                </div>
            `;
            
            // Create info window
            const infoWindow = new google.maps.InfoWindow({
                content: content,
                maxWidth: 300
            });
            
            if (useAdvancedMarkers) {
                // Use the new AdvancedMarkerElement
                const markerView = new google.maps.marker.AdvancedMarkerElement({
                    position: listing.position,
                    map: map,
                    title: listing.title,
                    content: createCustomMarkerElement()
                });
                
                // Add click event to marker
                markerView.addListener("click", () => {
                    infoWindow.open({
                        anchor: markerView,
                        map: map
                    });
                });
            } else {
                // Fallback to traditional Marker
                const marker = new google.maps.Marker({
                    position: listing.position,
                    map: map,
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 10,
                        fillColor: "#0066ff",
                        fillOpacity: 1,
                        strokeWeight: 2,
                        strokeColor: "#ffffff",
                    }
                });
                
                // Add click event to marker
                marker.addListener("click", () => {
                    infoWindow.open({
                        anchor: marker,
                        map: map
                    });
                });
            }
        });
    } catch (error) {
        console.error("Error initializing map:", error);
        // Display a friendly error message
        const mapElement = document.getElementById("map");
        if (mapElement) {
            mapElement.innerHTML = `
                <div style="display: flex; justify-content: center; align-items: center; height: 100%; flex-direction: column;">
                    <p>Could not load the map.</p>
                    <p>Please try again later.</p>
                </div>
            `;
        }
    }
    
    // Add zoom controls functionality
    const zoomIn = document.querySelector('.zoom-in');
    const zoomOut = document.querySelector('.zoom-out');
    
    if (zoomIn) {
        zoomIn.addEventListener('click', () => {
            if (map && typeof map.getZoom === 'function') {
                map.setZoom(map.getZoom() + 1);
            }
        });
    }
    
    if (zoomOut) {
        zoomOut.addEventListener('click', () => {
            if (map && typeof map.getZoom === 'function') {
                map.setZoom(map.getZoom() - 1);
            }
        });
    }
}

// Helper function to create a custom marker element
function createCustomMarkerElement() {
    const markerElement = document.createElement("div");
    markerElement.style.width = "20px";
    markerElement.style.height = "20px";
    markerElement.style.borderRadius = "50%";
    markerElement.style.backgroundColor = "#0066ff";
    markerElement.style.border = "2px solid white";
    markerElement.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.3)";
    return markerElement;
}

// Wait for DOM to be loaded
document.addEventListener("DOMContentLoaded", function() {
    // Initialize sliders
    initSliders();
    
    // Initialize filter modal
    initFilterModal();
    
    // Initialize auth modal
    initAuthModal();
    
    // Initialize search tabs
    initSearchTabs();
    
    // Initialize category tabs
    initCategoryTabs();
    
    // Initialize show list button
    initShowListButton();
    
    // Initialize user menu dropdown
    initUserMenu();
});

// Initialize image sliders
function initSliders() {
    const sliders = document.querySelectorAll('.image-slider');
    
    sliders.forEach(slider => {
        const prevButton = slider.querySelector('.prev');
        const nextButton = slider.querySelector('.next');
        const dots = slider.querySelectorAll('.dot');
        const imageContainer = slider.querySelector('img');
        
        let currentIndex = 0;
        const images = [
            imageContainer.src,
            imageContainer.src.replace('-1.jpg', '-2.jpg'),
            imageContainer.src.replace('-1.jpg', '-3.jpg'),
            imageContainer.src.replace('-1.jpg', '-4.jpg')
        ];
        
        // Update image and dots
        function updateSlider() {
            imageContainer.src = images[currentIndex];
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }
        
        // Next slide
        nextButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            currentIndex = (currentIndex + 1) % images.length;
            updateSlider();
        });
        
        // Previous slide
        prevButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateSlider();
        });
        
        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                currentIndex = index;
                updateSlider();
            });
        });
        
        // Favorite button (persist with Favorites service)
        const card = slider.closest('.listing-card');
        const favoriteButton = card && card.querySelector('.favorite');
        if (favoriteButton && card) {
            const listingId = card.getAttribute('data-listing-id');
            if (window.Favorites && listingId) {
                // Initialize icon state
                const icon = favoriteButton.querySelector('i');
                const isFav = window.Favorites.isFavorite(listingId);
                icon.classList.toggle('fas', isFav);
                icon.classList.toggle('far', !isFav);
                favoriteButton.classList.toggle('active', isFav);

                favoriteButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const nowFav = window.Favorites.toggle(listingId);
                    icon.classList.toggle('fas', nowFav);
                    icon.classList.toggle('far', !nowFav);
                    favoriteButton.classList.toggle('active', nowFav);
                });
            }
        }
    });
}

// Initialize filter modal
function initFilterModal() {
    const filterButton = document.querySelector('.filter-button');
    const filterModal = document.getElementById('filterModal');
    const closeModal = filterModal.querySelector('.close-modal');
    const applyFilters = filterModal.querySelector('.apply-filters');
    const clearFilters = filterModal.querySelector('.clear-filters');
    
    // Seat selector functionality
    const seatDecrement = filterModal.querySelector('.seat-decrement');
    const seatIncrement = filterModal.querySelector('.seat-increment');
    const seatCount = filterModal.querySelector('.seat-count');
    let currentSeatCount = 2; // Default value
    
    seatDecrement.addEventListener('click', () => {
        if (currentSeatCount > 1) {
            currentSeatCount--;
            seatCount.textContent = currentSeatCount;
        }
    });
    
    seatIncrement.addEventListener('click', () => {
        if (currentSeatCount < 10) { // Max seats per booking
            currentSeatCount++;
            seatCount.textContent = currentSeatCount;
        }
    });
    
    // Open modal
    filterButton.addEventListener('click', () => {
        filterModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
    
    // Close modal
    closeModal.addEventListener('click', () => {
        filterModal.style.display = 'none';
        document.body.style.overflow = '';
    });
    
    // Close on click outside
    filterModal.addEventListener('click', (e) => {
        if (e.target === filterModal) {
            filterModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    
    // Apply filters
    applyFilters.addEventListener('click', () => {
        // Get filter values
        const minPrice = document.getElementById('min-price').value;
        const maxPrice = document.getElementById('max-price').value;
        const seats = currentSeatCount;
        
        // Get selected activities
        const selectedActivities = [];
        document.querySelectorAll('input[name="activity"]:checked').forEach(checkbox => {
            selectedActivities.push(checkbox.value);
        });
        
        // Get selected amenities
        const selectedAmenities = [];
        document.querySelectorAll('input[name="amenities"]:checked').forEach(checkbox => {
            selectedAmenities.push(checkbox.value);
        });
        
        // Apply filters (for demo purposes, just close the modal)
        filterModal.style.display = 'none';
        document.body.style.overflow = '';
        
        // Add filter tags (example)
        if (selectedActivities.length > 0) {
            addFilterTag(selectedActivities[0]);
        }
        
        if (selectedAmenities.length > 0) {
            addFilterTag(selectedAmenities[0]);
        }
        
        // Add seats filter tag
        addFilterTag(`${seats} seats`);
        
        // In a real application, we would filter the listings based on seats available
        console.log(`Filtering for ${seats} seats, price range: $${minPrice}-$${maxPrice}`);
    });
    
    // Clear filters
    clearFilters.addEventListener('click', () => {
        // Reset price range
        document.getElementById('min-price').value = 50;
        document.getElementById('max-price').value = 500;
        
        // Reset seat count
        currentSeatCount = 2;
        seatCount.textContent = currentSeatCount;
        
        // Uncheck all checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
    });
    
    // Price range input handling
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    const minPriceSlider = document.querySelector('.range-min');
    const maxPriceSlider = document.querySelector('.range-max');
    
    minPriceInput.addEventListener('input', () => {
        minPriceSlider.value = minPriceInput.value;
    });
    
    maxPriceInput.addEventListener('input', () => {
        maxPriceSlider.value = maxPriceInput.value;
    });
    
    minPriceSlider.addEventListener('input', () => {
        minPriceInput.value = minPriceSlider.value;
    });
    
    maxPriceSlider.addEventListener('input', () => {
        maxPriceInput.value = maxPriceSlider.value;
    });
}

// Initialize search tabs
function initSearchTabs() {
    const searchTabs = document.querySelectorAll('.search-tab');
    
    // Initialize location autocomplete
    const locationInput = document.querySelector('[data-tab="location"] input');
    if (locationInput && typeof google !== 'undefined' && google.maps && google.maps.places) {
        try {
            // Initialize Google Places Autocomplete
            const autocomplete = new google.maps.places.Autocomplete(locationInput, {
                types: ['(cities)'], // Restrict to cities
                fields: ['name', 'geometry']
            });
            
            // Prevent form submission when selecting a place with Enter key
            locationInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && document.querySelector('.pac-container:visible')) {
                    e.preventDefault();
                }
            });
            
            // Handle place selection
            autocomplete.addListener('place_changed', function() {
                const place = autocomplete.getPlace();
                if (place.name) {
                    locationInput.value = place.name;
                    // Optional: Store coordinates for later use
                    if (place.geometry && place.geometry.location) {
                        locationInput.dataset.lat = place.geometry.location.lat();
                        locationInput.dataset.lng = place.geometry.location.lng();
                    }
                }
            });
        } catch (error) {
            console.error('Error initializing Places Autocomplete:', error);
        }
    }
    
    // Initialize date picker for the date tab
    const dateInput = document.querySelector('[data-tab="date"] input');
    if (dateInput && typeof flatpickr === 'function') {
        const datePicker = flatpickr(dateInput, {
            mode: "range",
            dateFormat: "Y-m-d",
            minDate: "today",
            disableMobile: true,
            static: true,
            onChange: function(selectedDates, dateStr) {
                if (selectedDates.length > 0) {
                    // Format the date(s) in a more readable format
                    let formattedDate = '';
                    if (selectedDates.length === 1) {
                        formattedDate = formatDate(selectedDates[0]);
                    } else if (selectedDates.length === 2) {
                        formattedDate = formatDate(selectedDates[0]) + ' - ' + formatDate(selectedDates[1]);
                    }
                    dateInput.value = formattedDate;
                }
            }
        });
        
        // Helper function to format dates
        function formatDate(date) {
            const options = { month: 'short', day: 'numeric' };
            return date.toLocaleDateString('en-US', options);
        }
    }
    
    // Initialize guest counter
    const guestTab = document.querySelector('[data-tab="guests"]');
    const guestCountInput = document.getElementById('guest-count');
    const decrementBtn = guestTab.querySelector('.guest-decrement');
    const incrementBtn = guestTab.querySelector('.guest-increment');
    
    if (guestCountInput && decrementBtn && incrementBtn) {
        let guestCount = parseInt(guestCountInput.value) || 1;
        
        // Update the UI based on guest count
        function updateGuestCount() {
            guestCountInput.value = guestCount;
            decrementBtn.disabled = guestCount <= 1;
            
            // Update the placeholder text
            const guestText = guestCount === 1 ? '1 guest' : `${guestCount} guests`;
            guestTab.querySelector('span').textContent = 'Guests';
        }
        
        // Initialize
        updateGuestCount();
        
        // Decrement button
        decrementBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent tab switching
            if (guestCount > 1) {
                guestCount--;
                updateGuestCount();
            }
        });
        
        // Increment button
        incrementBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent tab switching
            if (guestCount < 16) { // Set a reasonable maximum
                guestCount++;
                updateGuestCount();
            }
        });
    }
    
    searchTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            searchTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Focus the input if it exists directly under the tab
            const input = tab.querySelector('input:not([readonly])');
            if (input) {
                input.focus();
            }
            
            // Open date picker if date tab is clicked
            if (tab.getAttribute('data-tab') === 'date' && dateInput && typeof flatpickr === 'function') {
                setTimeout(() => {
                    dateInput._flatpickr.open();
                }, 100);
            }
        });
    });
}

// Initialize category tabs
function initCategoryTabs() {
    const categoryTabs = document.querySelectorAll('.category-tab');
    
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            categoryTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
        });
    });
}

// Initialize show list button
function initShowListButton() {
    const showListButton = document.querySelector('.show-list');
    
    showListButton.addEventListener('click', () => {
        const contentContainer = document.querySelector('.content-container');
        contentContainer.classList.toggle('show-map-only');
    });
}

// Add filter tag
function addFilterTag(text) {
    const filterOptions = document.querySelector('.filter-options');
    const filterButton = document.querySelector('.filter-button');
    
    // Create new filter tag
    const filterTag = document.createElement('div');
    filterTag.className = 'filter-tag';
    filterTag.innerHTML = `
        <span>${text}</span>
        <i class="fas fa-times"></i>
    `;
    
    // Insert after filter button
    filterButton.insertAdjacentElement('afterend', filterTag);
    
    // Add remove event
    const removeButton = filterTag.querySelector('i');
    removeButton.addEventListener('click', () => {
        filterTag.remove();
    });
}

// Initialize authentication modal
function initAuthModal() {
    const authModal = document.getElementById('authModal');
    const closeModalButton = authModal.querySelector('.close-modal');
    const authTabs = authModal.querySelectorAll('.auth-tab');
    const authForms = authModal.querySelectorAll('.auth-form');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    
    // Initialize login/signup buttons
    const setupAuthButtons = () => {
        const loginButton = document.getElementById('login-button');
        const signupButton = document.getElementById('signup-button');
        
        if (loginButton) {
            loginButton.addEventListener('click', (e) => {
                e.preventDefault();
                showTab('login');
                authModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });
        }
        
        if (signupButton) {
            signupButton.addEventListener('click', (e) => {
                e.preventDefault();
                showTab('signup');
                authModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });
        }
    };
    
    // Initial setup
    setupAuthButtons();
    
    // Close modal
    closeModalButton.addEventListener('click', () => {
        authModal.style.display = 'none';
        document.body.style.overflow = '';
        resetForms();
    });
    
    // Close on click outside
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.style.display = 'none';
            document.body.style.overflow = '';
            resetForms();
        }
    });
    
    // Tab switching
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            showTab(tabName);
        });
    });
    
    // Show tab and associated form
    function showTab(tabName) {
        // Update active tab
        authTabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });
        
        // Show active form
        authForms.forEach(form => {
            form.classList.toggle('active', form.id === `${tabName}-form`);
        });
    }
    
    // Form validation and submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('login-email');
        const password = document.getElementById('login-password');
        let isValid = true;
        
        // Simple validation
        if (!validateEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        } else {
            clearError(email);
        }
        
        if (password.value.length < 6) {
            showError(password, 'Password must be at least 6 characters');
            isValid = false;
        } else {
            clearError(password);
        }
        
        // Process login if valid
        if (isValid && window.AuthService) {
            const result = window.AuthService.login(email.value, password.value);
            
            if (result.success) {
                // Login successful
                // Clear any existing success message
                const existingMessage = loginForm.querySelector('.success-message');
                if (existingMessage) {
                    existingMessage.remove();
                }
                
                // Create success message
                const message = document.createElement('div');
                message.className = 'success-message';
                message.textContent = `Welcome back, ${result.user.name}!`;
                loginForm.appendChild(message);
                
                // Close modal after a short delay
                setTimeout(() => {
                    authModal.style.display = 'none';
                    document.body.style.overflow = '';
                    
                    // Update UI based on authentication state
                    window.AuthService.updateUI();
                    
                    // Redirect to appropriate page based on role
                    if (result.user.role === 'host') {
                        window.waveRouter.navigate('/host');
                    } else {
                        window.waveRouter.navigate('/account');
                    }
                    
                    // Reset forms after navigation
                    setTimeout(() => {
                        resetForms();
                    }, 500);
                }, 1000);
            } else {
                // Login failed
                showError(email, result.message);
            }
        }
    });
    
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('signup-name');
        const email = document.getElementById('signup-email');
        const password = document.getElementById('signup-password');
        const confirmPassword = document.getElementById('signup-confirm-password');
        const terms = document.querySelector('input[name="terms"]');
        let isValid = true;
        
        // Simple validation
        if (name.value.trim() === '') {
            showError(name, 'Please enter your name');
            isValid = false;
        } else {
            clearError(name);
        }
        
        if (!validateEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        } else {
            clearError(email);
        }
        
        if (password.value.length < 6) {
            showError(password, 'Password must be at least 6 characters');
            isValid = false;
        } else {
            clearError(password);
        }
        
        if (password.value !== confirmPassword.value) {
            showError(confirmPassword, 'Passwords do not match');
            isValid = false;
        } else {
            clearError(confirmPassword);
        }
        
        if (!terms.checked) {
            alert('Please agree to the Terms and Conditions');
            isValid = false;
        }
        
        // Process signup if valid
        if (isValid && window.AuthService) {
            const userData = {
                name: name.value,
                email: email.value,
                password: password.value
            };
            
            const result = window.AuthService.register(userData);
            
            if (result.success) {
                // Registration successful
                const message = document.createElement('div');
                message.className = 'success-message';
                message.textContent = result.message;
                signupForm.appendChild(message);
                
                // Switch to login tab after a short delay
                setTimeout(() => {
                    showTab('login');
                    resetForms();
                    
                    // Pre-fill the email field
                    document.getElementById('login-email').value = email.value;
                    document.getElementById('login-password').focus();
                }, 1500);
            } else {
                // Registration failed
                showError(email, result.message);
            }
        }
    });
    
    // Helper functions for form validation
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }
    
    function showError(input, message) {
        const errorElement = input.nextElementSibling;
        errorElement.textContent = message;
        input.classList.add('error');
    }
    
    function clearError(input) {
        const errorElement = input.nextElementSibling;
        errorElement.textContent = '';
        input.classList.remove('error');
    }
    
    function resetForms() {
        loginForm.reset();
        signupForm.reset();
        
        // Clear all error messages
        document.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
        });
        
        // Clear success messages
        document.querySelectorAll('.success-message').forEach(message => {
            message.remove();
        });
    }
}

// Initialize user menu dropdown
function initUserMenu() {
    const userMenu = document.querySelector('.user-menu');
    const dropdownMenu = userMenu.querySelector('.dropdown-menu');
    
    // Toggle dropdown when clicking on the user menu
    userMenu.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdownMenu.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!userMenu.contains(e.target)) {
            dropdownMenu.classList.remove('active');
        }
    });
    
    // Prevent dropdown from closing when clicking inside it
    dropdownMenu.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}
