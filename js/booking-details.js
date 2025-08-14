/**
 * WaveSurf Booking Details
 * Handles the booking details page functionality
 */

// Mock booking data for demo purposes
// In a real app, this would be fetched from the server
if (!window.bookingData) {
    window.bookingData = {
        'booking-1': {
            bookingReference: 'WS-2024-001',
            status: 'confirmed',
            boatName: 'Luxury Yacht Experience',
            location: 'Miami Beach Marina',
            date: '2024-08-20',
            time: '10:00 AM',
            seats: 4,
            pricePerSeat: 120,
            subtotal: 480,
            serviceFee: 24,
            total: 504,
            listingId: 'listing-1',
            host: {
                name: 'Captain Mike',
                avatar: 'images/host-avatar.jpg'
            },
            meetingLocation: 'Dock 12, Miami Beach Marina',
            meetingCoordinates: {
                lat: 25.7617,
                lng: -80.1918
            }
        },
        'booking-2': {
            bookingReference: 'WS-2024-002',
            status: 'pending',
            boatName: 'Sunset Cruise Adventure',
            location: 'Key Biscayne',
            date: '2024-08-25',
            time: '6:00 PM',
            seats: 2,
            pricePerSeat: 90,
            subtotal: 180,
            serviceFee: 9,
            total: 189,
            listingId: 'listing-2',
            host: {
                name: 'Captain Sarah',
                avatar: 'images/host-avatar.jpg'
            },
            meetingLocation: 'Key Biscayne Marina, Slip A-15',
            meetingCoordinates: {
                lat: 25.6926,
                lng: -80.1624
            }
        }
    };
}

/**
 * Initialize booking details page
 * @param {string} bookingId - The booking ID to display
 */
function initBookingDetails(bookingId) {
    console.log(`Initializing booking details for: ${bookingId}`);
    
    // Check if user is logged in
    if (window.AuthService && !window.AuthService.isLoggedIn()) {
        // Show login modal
        const authModal = document.getElementById('authModal');
        if (authModal) {
            const loginTab = authModal.querySelector('[data-tab="login"]');
            if (loginTab) loginTab.click();
            authModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
        
        // Redirect to home
        setTimeout(() => {
            window.waveRouter.navigate('/');
        }, 100);
        
        return;
    }
    
    // Get booking data - use the global bookingData from booking-confirmation.js
    const booking = window.bookingData ? window.bookingData[bookingId] : null;
    if (!booking) {
        console.error(`Booking not found: ${bookingId}`);
        document.querySelector('.booking-details-container').innerHTML = `
            <div class="error-message">
                <h2>Booking Not Found</h2>
                <p>We couldn't find the booking you're looking for.</p>
                <a href="#/account" data-route="/account" class="btn-primary">Return to My Bookings</a>
            </div>
        `;
        // Hide loading overlay
        if (window.toggleLoadingOverlay) {
            window.toggleLoadingOverlay(false);
        }
        return;
    }
    
    // Populate booking details
    document.getElementById('booking-reference').textContent = booking.bookingReference;
    document.getElementById('booking-status').textContent = capitalize(booking.status);
    document.getElementById('booking-status').className = `status-${booking.status}`;
    document.getElementById('boat-title').textContent = booking.boatName;
    document.getElementById('boat-location').textContent = booking.location;
    document.getElementById('booking-date').textContent = formatDate(booking.date);
    document.getElementById('booking-time').textContent = booking.time;
    document.getElementById('booking-seats').textContent = `${booking.seats} ${booking.seats === 1 ? 'seat' : 'seats'}`;
    document.getElementById('price-per-seat').textContent = `$${booking.pricePerSeat}`;
    document.getElementById('number-of-seats').textContent = booking.seats;
    document.getElementById('subtotal-amount').textContent = `$${booking.subtotal}`;
    document.getElementById('service-fee-amount').textContent = `$${booking.serviceFee}`;
    document.getElementById('total-amount').textContent = `$${booking.total}`;
    document.getElementById('host-name').textContent = booking.host.name;
    document.getElementById('meeting-location-text').textContent = booking.meetingLocation;
    
    // Set host avatar
    const hostAvatar = document.getElementById('host-avatar');
    if (hostAvatar && booking.host.avatar) {
        hostAvatar.src = booking.host.avatar;
        hostAvatar.alt = booking.host.name;
    }
    
    // Set boat image
    const boatImage = document.getElementById('boat-image');
    if (boatImage) {
        boatImage.src = `images/listings/${booking.listingId.replace('listing-', 'boat')}-1.jpg`;
        boatImage.alt = booking.boatName;
    }
    
    // Initialize meeting location map
    initMeetingLocationMap(booking.meetingCoordinates);
    
    // Initialize get directions button
    const directionsBtn = document.querySelector('.get-directions-btn');
    if (directionsBtn) {
        directionsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const { lat, lng } = booking.meetingCoordinates;
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
        });
    }
    
    // Initialize cancel booking button
    const cancelBtn = document.getElementById('cancel-booking-btn');
    if (cancelBtn) {
        // Only show cancel button for upcoming bookings
        if (booking.status !== 'confirmed' && booking.status !== 'pending') {
            cancelBtn.style.display = 'none';
        }
        
        cancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (confirm('Are you sure you want to cancel this booking? Cancellation policy may apply.')) {
                // In a real app, this would send a cancellation request to the server
                alert(`Booking ${bookingId} has been cancelled. A confirmation will be sent to your email.`);
                
                // Update booking status locally
                booking.status = 'cancelled';
                document.getElementById('booking-status').textContent = 'Cancelled';
                document.getElementById('booking-status').className = 'status-cancelled';
                
                // Hide cancel and modify buttons
                cancelBtn.style.display = 'none';
                document.getElementById('modify-booking-btn').style.display = 'none';
            }
        });
    }
    
    // Initialize modify booking button
    const modifyBtn = document.getElementById('modify-booking-btn');
    if (modifyBtn) {
        // Only show modify button for upcoming bookings
        if (booking.status !== 'confirmed' && booking.status !== 'pending') {
            modifyBtn.style.display = 'none';
        }
        
        modifyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Open the modify booking modal
            openModifyBookingModal(booking);
        });
    }
    
    // Initialize contact host button
    const contactHostBtn = document.querySelector('.contact-host-btn');
    if (contactHostBtn) {
        contactHostBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Open the contact host modal
            openContactHostModal(booking);
        });
    }
    
    // Hide loading overlay
    if (window.toggleLoadingOverlay) {
        window.toggleLoadingOverlay(false);
    }
}

/**
 * Initialize meeting location map
 * @param {Object} coordinates - The coordinates for the meeting location
 */
function initMeetingLocationMap(coordinates) {
    const mapElement = document.getElementById('meeting-location-map');
    if (!mapElement) return;
    
    // Show loading state
    mapElement.innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center; height: 100%; flex-direction: column;">
            <p>Loading map...</p>
        </div>
    `;
    
    // Function to initialize the map once Google Maps is available
    const initMap = function() {
        if (typeof google !== 'undefined' && google.maps) {
            try {
                // Create map
                const map = new google.maps.Map(mapElement, {
                    center: coordinates,
                    zoom: 15,
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
                
                // Create marker
                const useAdvancedMarkers = typeof google?.maps?.marker?.AdvancedMarkerElement === 'function';
                
                if (useAdvancedMarkers) {
                    // Use the new AdvancedMarkerElement
                    new google.maps.marker.AdvancedMarkerElement({
                        position: coordinates,
                        map: map,
                        title: "Meeting Location",
                        content: createCustomMarkerElement()
                    });
                } else {
                    // Fallback to traditional Marker
                    new google.maps.Marker({
                        position: coordinates,
                        map: map,
                        title: "Meeting Location",
                        icon: {
                            path: google.maps.SymbolPath.CIRCLE,
                            scale: 10,
                            fillColor: "#0066ff",
                            fillOpacity: 1,
                            strokeWeight: 2,
                            strokeColor: "#ffffff",
                        }
                    });
                }
            } catch (error) {
                console.error("Error initializing map:", error);
                useStaticMap();
            }
        } else {
            useStaticMap();
        }
    };
    
    // Function to use a static map as fallback
    const useStaticMap = function() {
        mapElement.innerHTML = '';  // Clear any loading message
        const key = window.__CONFIG__?.GOOGLE_MAPS_API_KEY || '';
        const keyParam = key ? `&key=${key}` : '';
        mapElement.style.backgroundImage = `url("https://maps.googleapis.com/maps/api/staticmap?center=${coordinates.lat},${coordinates.lng}&zoom=15&size=600x300&maptype=roadmap&markers=color:blue%7C${coordinates.lat},${coordinates.lng}${keyParam}")`;
        mapElement.style.backgroundSize = 'cover';
        mapElement.style.backgroundPosition = 'center';
        
        // Add a note that this is a static map
        const staticNote = document.createElement('div');
        staticNote.style.position = 'absolute';
        staticNote.style.bottom = '5px';
        staticNote.style.right = '5px';
        staticNote.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        staticNote.style.padding = '3px 6px';
        staticNote.style.borderRadius = '3px';
        staticNote.style.fontSize = '12px';
        staticNote.textContent = 'Static map';
        mapElement.style.position = 'relative';
        mapElement.appendChild(staticNote);
    };
    
    // Check if Google Maps is already loaded
    if (typeof google !== 'undefined' && google.maps) {
        initMap();
    } else {
        // If not loaded yet, set up a callback for when it loads
        window.initGoogleMapsCallback = function() {
            initMap();
        };
        
        // Add a timeout to fall back to static map if Google Maps doesn't load within 3 seconds
        setTimeout(function() {
            if (!(typeof google !== 'undefined' && google.maps)) {
                useStaticMap();
            }
        }, 3000);
        
        // Try to load Google Maps if not already loading
        if (!document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]')) {
            const script = document.createElement('script');
            const key = window.__CONFIG__?.GOOGLE_MAPS_API_KEY || '';
            script.src = `https://maps.googleapis.com/maps/api/js?libraries=places&callback=initGoogleMapsCallback${key ? `&key=${key}` : ''}`;
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
        }
    }
}

/**
 * Create custom marker element for Google Maps Advanced Markers
 * @returns {HTMLElement} The marker element
 */
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

/**
 * Format a date string (YYYY-MM-DD) to a more readable format
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @returns {string} Formatted date string (e.g., "August 15, 2023")
 */
function formatDate(dateStr) {
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateStr;
    }
}

/**
 * Capitalize first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Open the modify booking modal
 * @param {Object} booking - The booking data
 */
function openModifyBookingModal(booking) {
    const modal = document.getElementById('modifyBookingModal');
    if (!modal) return;
    
    // Set booking ID
    document.getElementById('booking-id').value = booking.id;
    
    // Set current date
    const dateInput = document.getElementById('modify-date');
    dateInput.value = booking.date;
    
    // Set min date to today
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
    
    // Set current time
    const timeSelect = document.getElementById('modify-time');
    const timeOptions = timeSelect.options;
    for (let i = 0; i < timeOptions.length; i++) {
        if (timeOptions[i].value === booking.time) {
            timeSelect.selectedIndex = i;
            break;
        }
    }
    
    // Set current seats
    document.getElementById('modify-seats').value = booking.seats;
    document.getElementById('modify-number-of-seats').textContent = booking.seats;
    
    // Set price details
    document.getElementById('modify-price-per-seat').textContent = `$${booking.pricePerSeat}`;
    updateModifyBookingPrice(booking);
    
    // Show the modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Initialize seat adjustment buttons
    initSeatAdjustButtons(booking);
    
    // Initialize close button
    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModifyBookingModal);
    }
    
    // Initialize cancel button
    const cancelBtn = modal.querySelector('.cancel-modify-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModifyBookingModal);
    }
    
    // Initialize form submission
    const form = document.getElementById('modify-booking-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const date = document.getElementById('modify-date').value;
            const time = document.getElementById('modify-time').value;
            const seats = parseInt(document.getElementById('modify-seats').value);
            
            // Update booking data
            booking.date = date;
            booking.time = time;
            booking.seats = seats;
            booking.subtotal = booking.pricePerSeat * seats;
            booking.serviceFee = Math.round(booking.subtotal * 0.15); // 15% service fee
            booking.total = booking.subtotal + booking.serviceFee;
            
            // Update UI
            document.getElementById('booking-date').textContent = formatDate(date);
            document.getElementById('booking-time').textContent = time;
            document.getElementById('booking-seats').textContent = `${seats} ${seats === 1 ? 'seat' : 'seats'}`;
            document.getElementById('price-per-seat').textContent = `$${booking.pricePerSeat}`;
            document.getElementById('number-of-seats').textContent = seats;
            document.getElementById('subtotal-amount').textContent = `$${booking.subtotal}`;
            document.getElementById('service-fee-amount').textContent = `$${booking.serviceFee}`;
            document.getElementById('total-amount').textContent = `$${booking.total}`;
            
            // Close modal
            closeModifyBookingModal();
            
            // Show success message
            alert('Your booking has been updated successfully!');
        });
    }
}

/**
 * Close the modify booking modal
 */
function closeModifyBookingModal() {
    const modal = document.getElementById('modifyBookingModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

/**
 * Update the price in the modify booking modal
 * @param {Object} booking - The booking data
 */
function updateModifyBookingPrice(booking) {
    const seats = parseInt(document.getElementById('modify-seats').value);
    const pricePerSeat = booking.pricePerSeat;
    const subtotal = pricePerSeat * seats;
    const serviceFee = Math.round(subtotal * 0.15); // 15% service fee
    const total = subtotal + serviceFee;
    
    document.getElementById('modify-number-of-seats').textContent = seats;
    document.getElementById('modify-subtotal').textContent = `$${subtotal}`;
    document.getElementById('modify-service-fee').textContent = `$${serviceFee}`;
    document.getElementById('modify-total').textContent = `$${total}`;
}

/**
 * Initialize seat adjustment buttons in the modify booking modal
 * @param {Object} booking - The booking data
 */
function initSeatAdjustButtons(booking) {
    const seatAdjustBtns = document.querySelectorAll('.seat-adjust');
    const seatsInput = document.getElementById('modify-seats');
    
    seatAdjustBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');
            let seats = parseInt(seatsInput.value);
            
            if (action === 'increase' && seats < 10) {
                seats++;
            } else if (action === 'decrease' && seats > 1) {
                seats--;
            }
            
            seatsInput.value = seats;
            updateModifyBookingPrice(booking);
        });
    });
}

/**
 * Open the contact host modal
 * @param {Object} booking - The booking data
 */
function openContactHostModal(booking) {
    const modal = document.getElementById('contactHostModal');
    if (!modal) return;
    
    // Set booking ID
    document.getElementById('contact-booking-id').value = booking.id;
    
    // Set host details
    document.getElementById('contact-host-name').textContent = booking.host.name;
    const hostAvatar = document.getElementById('contact-host-avatar');
    if (hostAvatar && booking.host.avatar) {
        hostAvatar.src = booking.host.avatar;
        hostAvatar.alt = booking.host.name;
    }
    
    // Show the modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Initialize close button
    const closeBtn = modal.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeContactHostModal);
    }
    
    // Initialize cancel button
    const cancelBtn = modal.querySelector('.cancel-contact-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeContactHostModal);
    }
    
    // Initialize form submission
    const form = document.getElementById('contact-host-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const subject = document.getElementById('message-subject').value;
            const message = document.getElementById('message-text').value;
            
            // Close modal
            closeContactHostModal();
            
            // Show success message
            alert(`Your message has been sent to ${booking.host.name}. They will respond to you shortly.`);
            
            // Reset form
            form.reset();
        });
    }
}

/**
 * Close the contact host modal
 */
function closeContactHostModal() {
    const modal = document.getElementById('contactHostModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

/**
 * Show access denied message for non-host users
 */
function showAccessDeniedMessage() {
    toggleLoadingOverlay(false);
    
    const container = document.querySelector('.booking-details-container');
    if (container) {
        container.innerHTML = `
            <div class="access-denied">
                <div class="access-denied-icon">
                    <i class="fas fa-lock"></i>
                </div>
                <h2>Host Access Required</h2>
                <p>You need to be logged in as a host to access this page.</p>
                <p>This feature is only available to boat owners and hosts.</p>
                <div class="access-denied-actions">
                    <a href="#/" data-route="/" class="btn-primary">Return to Home</a>
                    <a href="#/account" data-route="/account" class="btn-secondary">Go to My Account</a>
                </div>
            </div>
        `;
    }
}

// Make functions available globally
window.initBookingDetails = initBookingDetails;
// Make sure it's also available without the window prefix
if (typeof initBookingDetails === 'undefined') {
    initBookingDetails = window.initBookingDetails;
}
