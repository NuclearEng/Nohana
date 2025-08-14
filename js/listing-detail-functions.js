/**
 * Additional functions for the listing detail page
 */

/**
 * Creates the HTML for the listing detail page
 * @param {Object} listing - The listing object
 * @returns {string} HTML for the listing detail page
 */
function createListingDetailHTML(listing) {
    // Create image gallery HTML
    const imagesHTML = listing.images.map(image => 
        `<div class="gallery-image"><img src="${image}" alt="${listing.title}"></div>`
    ).join('');
    
    // Create features HTML
    const featuresHTML = listing.features.map(feature => 
        `<li><i class="fas fa-check"></i> ${feature}</li>`
    ).join('');
    
    // Create rules HTML
    const rulesHTML = listing.rules.map(rule => 
        `<li><i class="fas fa-exclamation-circle"></i> ${rule}</li>`
    ).join('');
    
    // Create activities HTML
    const activitiesHTML = listing.activities.map(activity => 
        `<span class="activity-tag">${activity}</span>`
    ).join('');
    
    // Create HTML for the entire listing detail page
    return `
        <div class="listing-detail">
            <div class="listing-gallery">
                <div class="gallery-container">
                    ${imagesHTML}
                </div>
                <div class="gallery-nav">
                    <button class="gallery-prev"><i class="fas fa-chevron-left"></i></button>
                    <div class="gallery-dots"></div>
                    <button class="gallery-next"><i class="fas fa-chevron-right"></i></button>
                </div>
            </div>
            
            <div class="listing-content">
                <div class="listing-main">
                    <div class="listing-header">
                        <h1>${listing.title}</h1>
                        <div class="listing-meta">
                            <div class="rating">
                                <i class="fas fa-star"></i>
                                <span>${listing.rating}</span>
                                <span class="reviews">(${listing.reviewCount} reviews)</span>
                            </div>
                            <div class="location">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${listing.location}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="listing-activities">
                        ${activitiesHTML}
                    </div>
                    
                    <div class="listing-details">
                        <div class="detail-item">
                            <i class="fas fa-users"></i>
                            <div>
                                <h3>Capacity</h3>
                                <p>${listing.capacity} guests</p>
                            </div>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-calendar-alt"></i>
                            <div>
                                <h3>Year</h3>
                                <p>${listing.year}</p>
                            </div>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-ruler-horizontal"></i>
                            <div>
                                <h3>Length</h3>
                                <p>${listing.length} ft</p>
                            </div>
                        </div>
                        <div class="detail-item">
                            <i class="fas fa-tachometer-alt"></i>
                            <div>
                                <h3>Engine</h3>
                                <p>${listing.enginePower} HP</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="listing-description">
                        <h2>About this boat</h2>
                        <p>${listing.description}</p>
                    </div>
                    
                    <div class="listing-features">
                        <h2>Features</h2>
                        <ul class="features-list">
                            ${featuresHTML}
                        </ul>
                    </div>
                    
                    <div class="listing-rules">
                        <h2>Rules</h2>
                        <ul class="rules-list">
                            ${rulesHTML}
                        </ul>
                    </div>
                    
                    <div class="listing-cancellation">
                        <h2>Cancellation policy</h2>
                        <p>${listing.cancellation}</p>
                    </div>
                    
                    <div class="listing-host">
                        <h2>About the host</h2>
                        <div class="host-info">
                            <img src="${listing.host.avatar}" alt="${listing.host.name}" class="host-avatar">
                            <div class="host-details">
                                <h3>${listing.host.name}</h3>
                                <div class="host-rating">
                                    <i class="fas fa-star"></i>
                                    <span>${listing.host.rating}</span>
                                </div>
                                <div class="host-meta">
                                    <p><i class="fas fa-check-circle"></i> Verified</p>
                                    <p><i class="fas fa-clock"></i> Responds ${listing.host.responseTime}</p>
                                    <p><i class="fas fa-reply"></i> ${listing.host.responseRate}% response rate</p>
                                </div>
                            </div>
                        </div>
                        <button class="contact-host-btn">Contact Host</button>
                    </div>
                    
                    <div class="listing-reviews">
                        <div class="reviews-header">
                            <h2>Reviews</h2>
                            <div class="rating">
                                <i class="fas fa-star"></i>
                                <span>${listing.rating}</span>
                                <span class="reviews">(${listing.reviewCount} reviews)</span>
                            </div>
                        </div>
                        <div id="reviews-list" class="reviews-list">
                            <!-- Reviews will be added here -->
                        </div>
                    </div>
                    
                    <div class="listing-location">
                        <h2>Location</h2>
                        <p>${listing.location}</p>
                        <div id="listing-map" class="listing-map"></div>
                    </div>
                </div>
                
                <div class="listing-sidebar">
                    <div class="booking-card">
                        <div class="booking-price">
                            <span class="price">$${listing.price}</span> / ${listing.priceUnit}
                        </div>
                        <div class="booking-rating">
                            <i class="fas fa-star"></i>
                            <span>${listing.rating}</span>
                            <span class="reviews">(${listing.reviewCount} reviews)</span>
                        </div>
                        <form id="booking-form" class="booking-form">
                            <div class="booking-dates">
                                <div class="date-picker">
                                    <label for="booking-date">Date</label>
                                    <input type="text" id="booking-date" placeholder="Select date">
                                </div>
                            </div>
                            <div class="booking-guests">
                                <label for="booking-guests">Guests</label>
                                <div class="guest-selector">
                                    <button type="button" class="guest-decrease"><i class="fas fa-minus"></i></button>
                                    <input type="number" id="booking-guests" value="1" min="1" max="${listing.capacity}">
                                    <button type="button" class="guest-increase"><i class="fas fa-plus"></i></button>
                                </div>
                            </div>
                            <div class="booking-summary">
                                <div class="booking-line">
                                    <span>$${listing.price} x 1 day</span>
                                    <span>$${listing.price}</span>
                                </div>
                                <div class="booking-line">
                                    <span>Service fee</span>
                                    <span>$${Math.round(listing.price * 0.1)}</span>
                                </div>
                                <div class="booking-total">
                                    <span>Total</span>
                                    <span>$${listing.price + Math.round(listing.price * 0.1)}</span>
                                </div>
                            </div>
                            <button type="submit" class="booking-submit">Book Now</button>
                        </form>
                        <div class="booking-note">
                            <p>You won't be charged yet</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Initializes the image gallery
 */
function initImageGallery() {
    const galleryContainer = document.querySelector('.gallery-container');
    const galleryDots = document.querySelector('.gallery-dots');
    const prevButton = document.querySelector('.gallery-prev');
    const nextButton = document.querySelector('.gallery-next');
    
    if (!galleryContainer || !galleryDots || !prevButton || !nextButton) return;
    
    const images = galleryContainer.querySelectorAll('.gallery-image');
    if (images.length === 0) return;
    
    // Create dots
    images.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = 'gallery-dot' + (index === 0 ? ' active' : '');
        dot.addEventListener('click', () => {
            currentIndex = index;
            updateGallery();
        });
        galleryDots.appendChild(dot);
    });
    
    let currentIndex = 0;
    
    // Update gallery display
    function updateGallery() {
        // Update images
        images.forEach((image, index) => {
            image.style.transform = `translateX(${(index - currentIndex) * 100}%)`;
        });
        
        // Update dots
        const dots = galleryDots.querySelectorAll('.gallery-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }
    
    // Initialize gallery
    updateGallery();
    
    // Add event listeners for navigation
    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateGallery();
    });
    
    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % images.length;
        updateGallery();
    });
}

/**
 * Initializes the date picker
 */
function initDatePicker() {
    const dateInput = document.getElementById('booking-date');
    if (!dateInput) return;
    
    // Check if flatpickr is available
    if (typeof flatpickr === 'function') {
        flatpickr(dateInput, {
            minDate: "today",
            dateFormat: "Y-m-d",
            disable: [
                function(date) {
                    // Get the listing ID from the URL
                    const listingId = window.location.hash.split('/')[2];
                    
                    // Get the listing from the ListingsService
                    if (window.ListingsService) {
                        const listing = window.ListingsService.getListingById(listingId);
                        if (listing && listing.availability && listing.availability.booked) {
                            // Format the date to match the booked dates format
                            const formattedDate = date.toISOString().split('T')[0];
                            return listing.availability.booked.includes(formattedDate);
                        }
                    }
                    return false;
                }
            ],
            onChange: function(selectedDates, dateStr) {
                // Update booking summary when date changes
                updateBookingSummary();
            }
        });
    } else {
        // Fallback for when flatpickr is not available
        dateInput.type = 'date';
        dateInput.min = new Date().toISOString().split('T')[0];
        dateInput.addEventListener('change', updateBookingSummary);
    }
}

/**
 * Initializes the booking form
 * @param {Object} listing - The listing object
 */
function initBookingForm(listing) {
    const form = document.getElementById('booking-form');
    const guestsInput = document.getElementById('booking-guests');
    const decreaseBtn = document.querySelector('.guest-decrease');
    const increaseBtn = document.querySelector('.guest-increase');
    
    if (!form || !guestsInput || !decreaseBtn || !increaseBtn) return;
    
    // Initialize guest count controls
    decreaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(guestsInput.value);
        if (currentValue > 1) {
            guestsInput.value = currentValue - 1;
            updateBookingSummary();
        }
    });
    
    increaseBtn.addEventListener('click', () => {
        const currentValue = parseInt(guestsInput.value);
        if (currentValue < listing.capacity) {
            guestsInput.value = currentValue + 1;
            updateBookingSummary();
        }
    });
    
    // Initialize form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const date = document.getElementById('booking-date').value;
        const guests = parseInt(guestsInput.value);
        
        if (!date) {
            alert('Please select a date');
            return;
        }
        
        // Check if user is logged in
        if (window.AuthService && !window.AuthService.isLoggedIn()) {
            // Show login modal
            if (typeof showLoginModal === 'function') {
                showLoginModal('Please log in to book this boat');
            } else {
                alert('Please log in to book this boat');
            }
            return;
        }
        
        // Proceed with booking
        const bookingData = {
            listingId: listing.id,
            date: date,
            guests: guests,
            price: listing.price,
            serviceFee: Math.round(listing.price * 0.1),
            total: listing.price + Math.round(listing.price * 0.1)
        };
        
        // Navigate to booking confirmation page
        if (window.waveRouter) {
            // Store booking data in session storage
            sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
            window.waveRouter.navigate('/booking-confirmation');
        }
    });
    
    // Initialize booking summary
    updateBookingSummary();
}

/**
 * Updates the booking summary based on current form values
 */
function updateBookingSummary() {
    // Get the listing ID from the URL
    const listingId = window.location.hash.split('/')[2];
    
    // Get the listing from the ListingsService
    if (window.ListingsService) {
        const listing = window.ListingsService.getListingById(listingId);
        if (!listing) return;
        
        const guestsInput = document.getElementById('booking-guests');
        const dateInput = document.getElementById('booking-date');
        
        if (!guestsInput || !dateInput) return;
        
        const guests = parseInt(guestsInput.value) || 1;
        const days = 1; // For now, we only support single-day bookings
        
        const basePrice = listing.price * days;
        const serviceFee = Math.round(basePrice * 0.1);
        const total = basePrice + serviceFee;
        
        // Update the booking summary
        const summaryLines = document.querySelectorAll('.booking-line');
        if (summaryLines.length >= 2) {
            summaryLines[0].innerHTML = `
                <span>$${listing.price} x ${days} day${days > 1 ? 's' : ''}</span>
                <span>$${basePrice}</span>
            `;
            
            summaryLines[1].innerHTML = `
                <span>Service fee</span>
                <span>$${serviceFee}</span>
            `;
        }
        
        const totalElement = document.querySelector('.booking-total');
        if (totalElement) {
            totalElement.innerHTML = `
                <span>Total</span>
                <span>$${total}</span>
            `;
        }
    }
}

/**
 * Initializes the favorite button
 * @param {Object} listing - The listing object
 */
function initFavoriteButton(listing) {
    const favoriteBtn = document.createElement('button');
    favoriteBtn.className = 'favorite-btn';
    
    // Check if Favorites service exists and if the listing is a favorite
    let isFavorite = false;
    if (window.Favorites) {
        isFavorite = window.Favorites.isFavorite(listing.id);
    }
    
    // Set initial state
    favoriteBtn.innerHTML = `<i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>`;
    favoriteBtn.classList.toggle('active', isFavorite);
    
    // Add to the page
    const listingHeader = document.querySelector('.listing-header');
    if (listingHeader) {
        listingHeader.appendChild(favoriteBtn);
    }
    
    // Add click event
    favoriteBtn.addEventListener('click', () => {
        if (window.Favorites) {
            isFavorite = window.Favorites.toggle(listing.id);
            favoriteBtn.innerHTML = `<i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>`;
            favoriteBtn.classList.toggle('active', isFavorite);
        }
    });
}

// Export functions to global scope
window.createListingDetailHTML = createListingDetailHTML;
window.initImageGallery = initImageGallery;
window.initDatePicker = initDatePicker;
window.initBookingForm = initBookingForm;
window.initFavoriteButton = initFavoriteButton;
window.updateBookingSummary = updateBookingSummary;
