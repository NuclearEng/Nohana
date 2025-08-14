/**
 * Template system for WaveSurf
 * Contains HTML templates for dynamic content
 */

window.templates = {
    // Home page template
    'home': `<div class="home-container">
        <!-- Hero Section -->
        <div class="hero-section">
            <h1>Book Your Perfect<br>Boat Adventure</h1>
            <p>Discover amazing boats and water activities from verified hosts. From wakesurfing to fishing, your next adventure awaits.</p>
            <a href="#/search" class="hero-cta btn-lg">Start Exploring</a>
    </div>

        <!-- Categories Section -->
        <div class="categories-section">
            <h2>Popular Activities</h2>
            <div class="categories-container">
                <a href="#/search?category=wakesurfing" class="category-item">
                    <div class="category-image">
                        <div class="category-icon">🏄‍♂️</div>
            </div>
                    <span>Wakesurfing</span>
                </a>
                <a href="#/search?category=fishing" class="category-item">
                    <div class="category-image">
                        <div class="category-icon">🎣</div>
                </div>
                    <span>Fishing</span>
                </a>
                <a href="#/search?category=skiing" class="category-item">
                    <div class="category-image">
                        <div class="category-icon">🎿</div>
                            </div>
                    <span>Water Skiing</span>
                </a>
                <a href="#/search?category=wakeboarding" class="category-item">
                    <div class="category-image">
                        <div class="category-icon">🏂</div>
                        </div>
                    <span>Wakeboarding</span>
                </a>
                <a href="#/search?category=cruising" class="category-item">
                    <div class="category-image">
                        <div class="category-icon">⛵</div>
                            </div>
                    <span>Cruising</span>
                </a>
                <a href="#/search?category=party" class="category-item">
                    <div class="category-image">
                        <div class="category-icon">🎉</div>
                        </div>
                    <span>Party Boats</span>
                </a>
                </div>
            </div>
            
        <!-- Featured Listings Section -->
        <div class="featured-listings">
            <h2>Featured Boats</h2>
            <div class="featured-grid">
                <div class="listing-card" data-listing-id="listing-1">
                    <a href="#/listing/listing-1" data-route="/listing/listing-1" class="listing-link">
                        <div class="listing-images">
                            <div class="image-slider">
                                <div class="placeholder-image">
                                    <i class="fas fa-ship"></i>
                                    <span>Mastercraft X-Star</span>
                </div>
                </div>
                </div>
                        <div class="listing-info">
                            <div class="listing-header">
                                <h3>Mastercraft X-Star - Perfect for Wakesurfing</h3>
                                <div class="rating">
                                    <i class="fas fa-star"></i>
                                    <span>4.98</span>
                                    <span class="reviews">(43)</span>
                </div>
                </div>
                            <p class="listing-description">🏖️ Lake Travis, Texas</p>
                            <p class="listing-details">👥 Up to 8 guests • 👨‍✈️ Captain included • 🏄‍♂️ Wakesurfing gear</p>
                            <div class="listing-price">
                                <span class="price">$45</span> / seat
                </div>
            </div>
                    </a>
                    <button class="favorite" aria-label="Add to favorites"><i class="far fa-heart"></i></button>
        </div>
        
                <div class="listing-card" data-listing-id="listing-2">
                    <a href="#/listing/listing-2" data-route="/listing/listing-2" class="listing-link">
                        <div class="listing-images">
                            <div class="image-slider">
                                <div class="placeholder-image">
                                    <i class="fas fa-ship"></i>
                                    <span>Malibu Wakesetter</span>
        </div>
    </div>
    </div>
                        <div class="listing-info">
            <div class="listing-header">
                                <h3>Malibu Wakesetter - Best Wake in Austin</h3>
                    <div class="rating">
                        <i class="fas fa-star"></i>
                                    <span>4.92</span>
                                    <span class="reviews">(78)</span>
                    </div>
                </div>
                            <p class="listing-description">🏖️ Lake Austin, Texas</p>
                            <p class="listing-details">👥 Up to 10 guests • 🎯 All equipment included</p>
                            <div class="listing-price">
                                <span class="price">$55</span> / seat
            </div>
                </div>
                    </a>
                    <button class="favorite" aria-label="Add to favorites"><i class="far fa-heart"></i></button>
            </div>
            
                <div class="listing-card" data-listing-id="listing-3">
                    <a href="#/listing/listing-3" data-route="/listing/listing-3" class="listing-link">
                        <div class="listing-images">
                            <div class="image-slider">
                                <div class="placeholder-image">
                        <i class="fas fa-ship"></i>
                                    <span>Pro Bass Fishing Boat</span>
                        </div>
                    </div>
                        </div>
                        <div class="listing-info">
                            <div class="listing-header">
                                <h3>Pro Bass Fishing Boat with Guide</h3>
                    <div class="rating">
                        <i class="fas fa-star"></i>
                                    <span>4.89</span>
                                    <span class="reviews">(56)</span>
                    </div>
                </div>
                            <p class="listing-description">🏖️ Lake Conroe, Houston</p>
                            <p class="listing-details">👨‍🏫 Professional guide • 🎣 All fishing equipment</p>
                            <div class="listing-price">
                                <span class="price">$35</span> / seat
                        </div>
                    </div>
                    </a>
                    <button class="favorite" aria-label="Add to favorites"><i class="far fa-heart"></i></button>
                        </div>
                    </div>
                </div>
                
        <!-- Value Proposition Section -->
        <div class="value-props">
            <h2>Why Choose Nohana?</h2>
            <div class="props-grid">
                <div class="prop-item">
                    <div class="prop-icon">✅</div>
                    <h3>Verified Hosts</h3>
                    <p>All boat owners are verified and vetted for your safety and peace of mind.</p>
                </div>
                <div class="prop-item">
                    <div class="prop-icon">💰</div>
                    <h3>Best Prices</h3>
                    <p>Compare prices and find the best deals on boat rentals and water activities.</p>
            </div>
                <div class="prop-item">
                    <div class="prop-icon">🛡️</div>
                    <h3>Secure Booking</h3>
                    <p>Your payment is protected and you can cancel free up to 48 hours before.</p>
        </div>
                <div class="prop-item">
                    <div class="prop-icon">⭐</div>
                    <h3>Quality Guarantee</h3>
                    <p>Read real reviews and enjoy experiences rated highly by our community.</p>
                    </div>
                    </div>
                </div>
    </div>`,

    // Listing detail page template
    'listing-detail': `<div class="listing-detail-container">
        <div class="back-button">
            <a href="#/" data-route="/" class="back-link">
                <i class="fas fa-arrow-left"></i>
                <span>Back to listings</span>
            </a>
                    </div>
                    
        <div id="listing-content">
            <!-- Content will be populated by listing-detail.js -->
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <span>Loading listing details...</span>
        </div>
    </div>
</div>`,

    // Search results template
    'search-results': `<div class="search-results-container">
        <div class="search-results-header">
            <div class="search-summary">
                <h1>Boats in <span id="search-location">your area</span></h1>
                <div class="results-count"><span id="results-count">0</span> boats found</div>
            </div>
            <div class="search-actions">
                <button class="toggle-map-btn">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>Show map</span>
            </button>
                <div class="sort-dropdown">
                    <label for="sort-select">Sort by:</label>
                    <select id="sort-select">
                        <option value="price-asc">Price (lowest first)</option>
                        <option value="price-desc">Price (highest first)</option>
                        <option value="rating">Rating</option>
                        <option value="seats">Available seats</option>
                    </select>
                    </div>
                </div>
            </div>
            
        <div class="search-results-content">
            <div class="filters-sidebar">
                <div class="filters-header">
                    <h2>Filters</h2>
                    <button class="clear-filters-btn">Clear all</button>
            </div>
            
                <div class="filter-section">
                    <h3>Price range</h3>
                    <div class="price-inputs">
                        <div class="price-input">
                            <label for="min-price">Min price</label>
                            <div class="input-wrapper">
                                <span class="currency">$</span>
                                <input type="number" id="min-price" value="0">
                </div>
                </div>
                        <div class="price-input">
                            <label for="max-price">Max price</label>
                            <div class="input-wrapper">
                                <span class="currency">$</span>
                                <input type="number" id="max-price" value="500">
                </div>
            </div>
        </div>
                    <div class="range-slider">
                        <input type="range" id="price-range-min" min="0" max="500" value="0">
                        <input type="range" id="price-range-max" min="0" max="500" value="500">
                    </div>
                </div>
                
                <div class="filter-section">
                    <h3>Activities</h3>
                    <div class="checkbox-group">
                        <label class="checkbox">
                            <input type="checkbox" name="activity" value="wakesurfing">
                            <span>Wakesurfing</span>
                        </label>
                        <label class="checkbox">
                            <input type="checkbox" name="activity" value="fishing">
                            <span>Fishing</span>
                        </label>
                        <label class="checkbox">
                            <input type="checkbox" name="activity" value="skiing">
                            <span>Water Skiing</span>
                        </label>
                        <label class="checkbox">
                            <input type="checkbox" name="activity" value="wakeboarding">
                            <span>Wakeboarding</span>
                        </label>
                        <label class="checkbox">
                            <input type="checkbox" name="activity" value="cruising">
                            <span>Cruising</span>
                        </label>
                        <label class="checkbox">
                            <input type="checkbox" name="activity" value="party">
                            <span>Party Boats</span>
                        </label>
                </div>
            </div>
            
                <div class="filter-section">
                    <h3>Rating</h3>
                    <div class="rating-filter">
                        <label class="radio">
                            <input type="radio" name="rating" value="any" checked>
                            <span>Any rating</span>
                        </label>
                        <label class="radio">
                            <input type="radio" name="rating" value="4.5">
                            <span><i class="fas fa-star"></i> 4.5+</span>
                        </label>
                        <label class="radio">
                            <input type="radio" name="rating" value="4.0">
                            <span><i class="fas fa-star"></i> 4.0+</span>
                        </label>
                        <label class="radio">
                            <input type="radio" name="rating" value="3.5">
                            <span><i class="fas fa-star"></i> 3.5+</span>
                        </label>
                    </div>
                </div>
                
                <div class="filter-section">
                    <h3>Amenities</h3>
                    <div class="checkbox-group">
                        <label class="checkbox">
                            <input type="checkbox" name="amenities" value="captain">
                            <span>Captain included</span>
                        </label>
                        <label class="checkbox">
                            <input type="checkbox" name="amenities" value="equipment">
                            <span>Equipment included</span>
                        </label>
                        <label class="checkbox">
                            <input type="checkbox" name="amenities" value="bluetooth">
                            <span>Bluetooth audio</span>
                        </label>
                        <label class="checkbox">
                            <input type="checkbox" name="amenities" value="bathroom">
                            <span>Bathroom on board</span>
                        </label>
                </div>
            </div>
            
                <div class="filter-actions">
                    <button class="apply-filters-btn btn-primary">Apply filters</button>
                    </div>
                </div>
                
            <div class="results-container">
                <div id="search-results" class="results-grid">
                    <!-- Results will be populated by search-results.js -->
                </div>
                
                <div class="no-results hidden">
                    <div class="no-results-content">
                        <i class="fas fa-search"></i>
                        <h2>No boats found</h2>
                        <p>Try adjusting your search filters or try a different location.</p>
                        <button class="btn-primary">Clear all filters</button>
                    </div>
                </div>
                
                <div class="loading-results hidden">
                    <div class="loading-spinner"></div>
                    <p>Searching for boats...</p>
                </div>
            </div>
                </div>
    </div>`,
    
    // Booking page template
    'booking': `<div class="booking-container">
        <div class="booking-header">
            <div class="back-button">
                <a href="#/listing/listing-1" data-route="/listing/listing-1" class="back-link">
                    <i class="fas fa-arrow-left"></i>
                    <span>Back to listing</span>
                </a>
                        </div>
            <h1>Book Your Experience</h1>
                    </div>
                    
        <div class="booking-content">
            <div class="booking-form-column">
                <div class="booking-steps">
                    <div class="booking-step active" data-step="1">
                        <div class="step-number">1</div>
                        <div class="step-label">Choose date & time</div>
                            </div>
                    <div class="booking-step" data-step="2">
                        <div class="step-number">2</div>
                        <div class="step-label">Guest information</div>
                        </div>
                    <div class="booking-step" data-step="3">
                        <div class="step-number">3</div>
                        <div class="step-label">Payment</div>
                    </div>
                </div>
                
                <div class="booking-form-step active" data-step="1">
                    <h2>Select date and time</h2>
                            
                            <div class="form-group">
                        <label for="booking-date">Date</label>
                        <input type="date" id="booking-date" required>
                            </div>
                            
                            <div class="form-group">
                        <label>Available time slots</label>
                        <div class="time-slots">
                            <button class="time-slot">9:00 AM</button>
                            <button class="time-slot">10:00 AM</button>
                            <button class="time-slot">11:00 AM</button>
                            <button class="time-slot">12:00 PM</button>
                            <button class="time-slot">1:00 PM</button>
                            <button class="time-slot">2:00 PM</button>
                            <button class="time-slot">3:00 PM</button>
                            <button class="time-slot">4:00 PM</button>
                        </div>
                            </div>
                            
                            <div class="form-group">
                        <label for="booking-seats">Number of seats</label>
                        <div class="seats-selector">
                            <button type="button" class="seat-adjust" data-action="decrease">-</button>
                            <input type="number" id="booking-seats" min="1" max="10" value="1" readonly>
                            <button type="button" class="seat-adjust" data-action="increase">+</button>
                        </div>
                        <div class="seats-available">
                            <span id="available-seats">8</span> seats available
                        </div>
                            </div>
                            
                    <div class="booking-form-actions">
                        <button id="date-continue-btn" class="btn-primary">Continue</button>
                            </div>
                        </div>
                        
                <div class="booking-form-step" data-step="2">
                    <h2>Guest information</h2>
                            
                            <div class="form-group">
                        <label for="guest-name">Full name</label>
                        <input type="text" id="guest-name" required>
                            </div>
                            
                            <div class="form-group">
                        <label for="guest-email">Email</label>
                        <input type="email" id="guest-email" required>
                            </div>
                            
                            <div class="form-group">
                        <label for="guest-phone">Phone number</label>
                        <input type="tel" id="guest-phone" required>
                            </div>
                            
                            <div class="form-group">
                        <label for="special-requests">Special requests (optional)</label>
                        <textarea id="special-requests" rows="3"></textarea>
                        </div>
                        
                    <div class="booking-form-actions">
                        <button id="guest-back-btn" class="btn-secondary">Back</button>
                        <button id="guest-continue-btn" class="btn-primary">Continue to payment</button>
                            </div>
                        </div>
                        
                <div class="booking-form-step" data-step="3">
                    <h2>Payment information</h2>
                    
                    <div class="form-group">
                        <label for="card-name">Name on card</label>
                        <input type="text" id="card-name" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="card-number">Card number</label>
                        <input type="text" id="card-number" placeholder="1234 5678 9012 3456" required>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group half">
                            <label for="card-expiry">Expiration date</label>
                            <input type="text" id="card-expiry" placeholder="MM/YY" required>
                        </div>
                        <div class="form-group half">
                            <label for="card-cvc">CVC</label>
                            <input type="text" id="card-cvc" placeholder="123" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="billing-zip">Billing ZIP code</label>
                        <input type="text" id="billing-zip" required>
                        </div>
                        
                    <div class="booking-form-actions">
                        <button id="payment-back-btn" class="btn-secondary">Back</button>
                        <button id="payment-confirm-btn" class="btn-primary">Confirm and pay</button>
                    </div>
                </div>
                
                <div class="booking-summary-column">
                    <div class="booking-summary-card">
                        <div class="booking-listing-info">
                            <div class="booking-listing-image">
                                <img id="payment-listing-image" src="" alt="Boat image" onerror="this.onerror=null;this.src='images/placeholder.svg'">
                        </div>
                            <div class="booking-listing-details">
                                <h3 id="payment-listing-title"></h3>
                                <p id="payment-listing-location"></p>
                    </div>
                </div>
                
                        <div class="booking-summary-divider"></div>
                        
                        <div class="booking-details-summary">
                            <h4>Booking details</h4>
                            <div class="detail-row">
                                <i class="far fa-calendar"></i>
                                <span id="payment-date"></span>
                    </div>
                            <div class="detail-row">
                                <i class="far fa-clock"></i>
                                <span id="payment-time"></span>
                </div>
                            <div class="detail-row">
                                <i class="fas fa-user"></i>
                                <span id="payment-guests"></span>
                    </div>
                </div>
                
                        <div class="booking-summary-divider"></div>
                        
                        <div class="price-breakdown">
                            <div class="price-row">
                                <span><span id="payment-price-per-seat">$45</span> × <span id="payment-number-of-seats">1</span> seats</span>
                                <span id="payment-subtotal">$45</span>
                        </div>
                            <div class="price-row">
                                <span>Service fee</span>
                                <span id="payment-service-fee">$10</span>
                        </div>
                            <div class="price-row total">
                                <span>Total</span>
                                <span id="payment-total">$55</span>
                    </div>
                </div>
                        </div>
                    </div>
                        </div>
                        </div>
    </div>`,
    
    // Booking confirmation template
    'booking-confirmation': `<div class="booking-confirmation-container">
        <div class="confirmation-header">
            <div class="confirmation-icon">
                <i class="fas fa-check-circle"></i>
                </div>
            <h1>Booking Confirmed!</h1>
            <p>Your booking has been successfully confirmed. Check your email for details.</p>
        </div>
        
        <div class="confirmation-details">
            <div class="confirmation-card">
                <div class="booking-id-section">
                    <div>
                        <span class="detail-label">Booking ID</span>
                        <span id="booking-id">WS-12345678</span>
        </div>
                    <button class="btn-secondary">
                        <i class="far fa-file-alt"></i>
                        <span>Download receipt</span>
            </button>
    </div>
    
                <div class="confirmation-summary">
                    <div class="confirmation-image">
                        <img id="confirmation-image" src="images/listings/boat1-1.jpg" alt="Boat image" onerror="this.onerror=null;this.src='images/placeholder.svg'">
            </div>
                    <div class="confirmation-info">
                        <h2 id="confirmation-title">Mastercraft X-Star - Perfect for Wakesurfing</h2>
                        <p class="location" id="confirmation-location">Lake Travis, Austin, TX</p>
                        <div class="detail-row">
                            <div class="detail-item">
                                <i class="far fa-calendar"></i>
                                <div>
                                    <span class="detail-label">Date</span>
                                    <span class="detail-value" id="confirmation-date">July 15, 2023</span>
                            </div>
                        </div>
                            <div class="detail-item">
                                <i class="far fa-clock"></i>
                                <div>
                                    <span class="detail-label">Time</span>
                                    <span class="detail-value" id="confirmation-time">10:00 AM</span>
                            </div>
                        </div>
                            <div class="detail-item">
                                <i class="fas fa-user"></i>
                                <div>
                                    <span class="detail-label">Guests</span>
                                    <span class="detail-value" id="confirmation-guests">2 seats</span>
                    </div>
                            </div>
                    </div>
                </div>
            </div>
            
                <div class="payment-summary">
                    <h3>Payment summary</h3>
                    <div class="payment-detail">
                        <span><span id="confirmation-price">$45</span> × <span id="confirmation-seats">2</span> seats</span>
                        <span id="confirmation-subtotal">$90</span>
                </div>
                    <div class="payment-detail">
                        <span>Service fee</span>
                        <span id="confirmation-fee">$15</span>
            </div>
                    <div class="payment-detail total">
                        <span>Total paid</span>
                        <span id="confirmation-total">$105</span>
                </div>
                    <p class="payment-note">Your payment has been processed successfully. You will see a charge from WaveSurf on your statement.</p>
            </div>
            
                <div class="cancellation-policy">
                    <h3>Cancellation policy</h3>
                    <p>Free cancellation up to 48 hours before your booking. After that, a 50% refund is available up to 24 hours before the booking time.</p>
            </div>
            
                <div class="host-contact">
                    <h3>Host contact</h3>
                    <div class="host-info">
                        <div class="host-avatar">
                            <img src="images/host-avatar.jpg" alt="Host" onerror="this.onerror=null;this.src='images/host-avatar.jpg'">
                </div>
                        <div class="host-details">
                            <h4>John</h4>
                            <p>You can message your host through the WaveSurf app</p>
            </div>
                </div>
            </div>
            
                <div class="booking-actions">
                    <a href="#/bookings" data-route="/bookings" class="btn-secondary">View all bookings</a>
                    <a href="#/messages" data-route="/messages" class="btn-primary">Message host</a>
            </div>
        </div>
        
            <div class="meeting-location-card">
                <h3>Meeting location</h3>
                <p>Your host will meet you at the following location:</p>
                <div class="meeting-location-map">
                    <!-- Map will be loaded with JavaScript -->
                </div>
                <p id="meeting-address">Lake Travis Marina, Dock 5<br>Austin, TX 78732</p>
                <a href="https://maps.google.com" target="_blank" class="get-directions-btn">
                    <i class="fas fa-directions"></i>
                    <span>Get directions</span>
                </a>
            </div>
            
            <div class="what-to-bring-card">
                <h3>What to bring</h3>
                <ul class="what-to-bring-list">
                    <li><i class="fas fa-tshirt"></i> Swimwear and towels</li>
                    <li><i class="fas fa-sun"></i> Sunscreen</li>
                    <li><i class="fas fa-glasses"></i> Sunglasses</li>
                    <li><i class="fas fa-wine-bottle"></i> Water and snacks</li>
                    <li><i class="fas fa-id-card"></i> Valid ID</li>
                </ul>
                </div>
            </div>
    </div>`,
    
    // Favorites page template
    'favorites-page': `<div class="favorites-container surface">
        <div class="page-header">
            <h1 class="page-title">Saved Boats (<span id="favorites-count">0</span>)</h1>
            <a href="#/" data-route="/" class="btn-secondary">Explore boats</a>
            </div>
        
        <div class="favorites-content card-body">
            <div id="favorites-list" class="favorites-grid">
                <!-- Will be populated by favorites-page.js -->
        </div>
        
            <div id="no-favorites" class="no-favorites hidden empty-state">
                <div class="no-favorites-content" style="border:none;">
                    <i class="far fa-heart"></i>
                    <h2>No saved boats yet</h2>
                    <p>Click the heart icon on any boat listing to save it for later.</p>
                    <a href="#/" data-route="/" class="btn-primary">Explore boats</a>
            </div>
        </div>
    </div>
</div>`,

    // Booking page template
    'booking-page': `<div class="booking-container">
        <div class="booking-header">
            <h1>Book Your Boat Experience</h1>
            
            <!-- Progress Indicator -->
            <div class="booking-progress">
                <div class="booking-progress-step active" data-step="details">
                    <span class="step-number">1</span>
                    <span class="step-label">Details</span>
                </div>
                <div class="booking-progress-step" data-step="payment">
                    <span class="step-number">2</span>
                    <span class="step-label">Payment</span>
                </div>
                <div class="booking-progress-step" data-step="confirmation">
                    <span class="step-number">3</span>
                    <span class="step-label">Confirmation</span>
                </div>
            </div>
        </div>
        
        <div class="booking-content">
            <!-- Details Step -->
            <div class="booking-step-content active" data-step="details">
                <div class="booking-details-section">
                    <div class="listing-summary">
                        <img id="booking-listing-image" src="" alt="" class="listing-image" onerror="this.onerror=null;this.src='images/placeholder.svg'">
                        <div class="listing-info">
                            <h3 id="booking-listing-title">Loading...</h3>
                            <p id="booking-listing-location">Loading...</p>
                            <p class="price">$<span id="booking-price-per-seat">0</span> per seat</p>
                            <p class="availability"><span id="booking-available-seats">0</span> seats available</p>
        </div>
    </div>
    
                    <div class="booking-form">
                        <div class="form-group">
                            <label for="booking-date-input">Select Date</label>
                            <input type="date" id="booking-date-input" required>
        </div>
                        
                        <div class="form-group">
                            <label>Select Time</label>
                            <div class="time-options">
                                <button type="button" class="time-option" data-time="9:00 AM">9:00 AM</button>
                                <button type="button" class="time-option" data-time="12:00 PM">12:00 PM</button>
                                <button type="button" class="time-option" data-time="3:00 PM">3:00 PM</button>
                                <button type="button" class="time-option" data-time="6:00 PM">6:00 PM</button>
        </div>
        </div>
                        
                        <div class="form-group">
                            <label>Number of Seats</label>
                            <div class="seat-selector">
                                <button type="button" class="seat-decrement">-</button>
                                <span id="booking-seat-count">1</span>
                                <button type="button" class="seat-increment">+</button>
        </div>
    </div>
    
                        <div class="booking-summary">
                            <div class="summary-row">
                                <span>Subtotal (<span id="booking-seat-summary">1</span> seats)</span>
                                <span id="booking-subtotal">$0</span>
                </div>
                            <div class="summary-row">
                                <span>Service Fee</span>
                                <span id="booking-service-fee">$0</span>
            </div>
                            <div class="summary-row total">
                                <span>Total</span>
                                <span id="booking-total">$0</span>
            </div>
        </div>
        
                        <button id="booking-continue-btn" class="btn-primary">Continue to Payment</button>
            </div>
            </div>
        </div>
        
            <!-- Payment Step -->
            <div class="booking-step-content" data-step="payment">
                <div class="payment-section">
                    <div class="booking-summary-card">
                        <h3 id="payment-listing-title">Booking Summary</h3>
                        <p id="payment-listing-location"></p>
                        <div class="booking-details">
                            <p><strong>Date:</strong> <span id="payment-date"></span></p>
                            <p><strong>Time:</strong> <span id="payment-time"></span></p>
                            <p><strong>Seats:</strong> <span id="payment-seats"></span></p>
            </div>
                        <div class="payment-summary">
                            <div class="summary-row">
                                <span>Subtotal</span>
                                <span id="payment-subtotal">$0</span>
                            </div>
                            <div class="summary-row">
                                <span>Service Fee</span>
                                <span id="payment-service-fee">$0</span>
                            </div>
                            <div class="summary-row total">
                                <span>Total</span>
                                <span id="payment-total">$0</span>
                            </div>
            </div>
        </div>
        
                    <div class="payment-methods">
                        <h3>Payment Method</h3>
                        <div class="payment-method" data-method="card">
                            <input type="radio" id="payment-card" name="payment-method" value="card" checked>
                            <label for="payment-card">Credit/Debit Card</label>
                        </div>
                        <div class="payment-method" data-method="paypal">
                            <input type="radio" id="payment-paypal" name="payment-method" value="paypal">
                            <label for="payment-paypal">PayPal</label>
                        </div>
            </div>
            
                    <div class="payment-forms">
                        <div class="payment-form active" data-method="card">
                    <div class="form-group">
                                <label>Card Number</label>
                                <input type="text" placeholder="1234 5678 9012 3456" required>
                    </div>
                            <div class="form-row">
                    <div class="form-group">
                                    <label>Expiry Date</label>
                                    <input type="text" placeholder="MM/YY" required>
                    </div>
                    <div class="form-group">
                                    <label>CVV</label>
                                    <input type="text" placeholder="123" required>
                    </div>
                            </div>
                    <div class="form-group">
                                <label>Cardholder Name</label>
                                <input type="text" placeholder="John Doe" required>
                            </div>
                    </div>
                    
                        <div class="payment-form" data-method="paypal">
                            <p>You will be redirected to PayPal to complete your payment.</p>
                        </div>
                    </div>
                    
                    <div class="payment-actions">
                        <button id="payment-back-btn" class="btn-secondary">Back</button>
                        <button id="payment-confirm-btn" class="btn-primary">Confirm Booking</button>
                    </div>
                        </div>
                    </div>
                    
            <!-- Confirmation Step -->
            <div class="booking-step-content" data-step="confirmation">
                <div class="confirmation-section">
                    <div class="confirmation-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h2>Booking Confirmed!</h2>
                    <p>Your booking has been successfully confirmed. You will receive a confirmation email shortly.</p>
                    
                    <div class="confirmation-actions">
                        <a href="#/account" class="btn-primary">View My Bookings</a>
                        <a href="#/" class="btn-secondary">Back to Home</a>
                    </div>
            </div>
        </div>
    </div>
</div>`,

    // Booking confirmation template
    'booking-confirmation': `<div class="booking-confirmation-container">
        <div class="confirmation-header">
            <h1>Booking Confirmed!</h1>
        </div>
        <div class="confirmation-content">
            <div id="confirmation-details" class="confirmation-details">
                <!-- Will be populated by booking-confirmation.js -->
            </div>
    </div>
</div>`
};