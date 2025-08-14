/**
 * WaveSurf Booking Confirmation
 * Handles the booking confirmation page functionality
 */

// Sample booking data - in a real app, this would come from the server
// Make it available globally for booking details page
window.bookingData = {
    "booking-1": {
        id: "booking-1",
        listingId: "listing-1",
        boatName: "Mastercraft X-Star - Perfect for Wakesurfing",
        location: "Lake Travis, Austin",
        date: "2023-08-15",
        time: "10:00 AM",
        seats: 3,
        pricePerSeat: 45,
        subtotal: 135,
        serviceFee: 20,
        total: 155,
        status: "confirmed",
        meetingLocation: "Lake Travis Marina Dock #5",
        meetingCoordinates: { lat: 30.3884, lng: -97.9462 },
        host: {
            name: "John",
            avatar: "images/host-avatar.jpg"
        },
        bookingReference: "WAVE-123456"
    },
    "booking-2": {
        id: "booking-2",
        listingId: "listing-2",
        boatName: "Malibu Wakesetter - Best Wake in Austin",
        location: "Lake Austin, Texas",
        date: "2023-08-22",
        time: "1:00 PM",
        seats: 4,
        pricePerSeat: 55,
        subtotal: 220,
        serviceFee: 30,
        total: 250,
        status: "confirmed",
        meetingLocation: "Lake Austin Marina Dock #12",
        meetingCoordinates: { lat: 30.2974, lng: -97.7516 },
        host: {
            name: "Jane",
            avatar: "images/host-avatar2.jpg"
        },
        bookingReference: "WAVE-234567"
    },
    "booking-3": {
        id: "booking-3",
        listingId: "listing-3",
        boatName: "Pro Bass Fishing Boat with Guide",
        location: "Lake Conroe, Houston",
        date: "2023-08-10",
        time: "6:00 AM",
        seats: 2,
        pricePerSeat: 35,
        subtotal: 70,
        serviceFee: 15,
        total: 85,
        status: "confirmed",
        meetingLocation: "Lake Conroe Marina Dock #3",
        meetingCoordinates: { lat: 30.3118, lng: -95.6269 },
        host: {
            name: "Mike",
            avatar: "images/host-avatar3.jpg"
        },
        bookingReference: "WAVE-345678"
    }
};

// Create a new booking from listing detail form data
function createBooking(listingId, formData) {
    // Generate a unique booking ID
    const bookingId = `booking-${Date.now()}`;
    
    // Get listing data
    const listingData = window.listingData && window.listingData[listingId];
    if (!listingData) {
        console.error(`Listing data not found for ${listingId}`);
        return null;
    }
    
    // Calculate pricing
    const subtotal = formData.seats * listingData.price;
    const serviceFee = Math.round(subtotal * 0.15); // 15% service fee
    const total = subtotal + serviceFee;
    
    // Create booking object
    const booking = {
        id: bookingId,
        listingId: listingId,
        boatName: listingData.title,
        location: listingData.location,
        date: formData.date,
        time: formData.time,
        seats: formData.seats,
        pricePerSeat: listingData.price,
        subtotal: subtotal,
        serviceFee: serviceFee,
        total: total,
        status: "confirmed",
        meetingLocation: `${listingData.location} Marina Dock`,
        meetingCoordinates: listingData.position || { lat: 30.2672, lng: -97.7431 },
        host: listingData.host,
        bookingReference: `WAVE-${Math.floor(100000 + Math.random() * 900000)}`
    };
    
    // In a real app, this would be sent to the server
    // For demo purposes, we'll add it to our local data
    bookingData[bookingId] = booking;
    
    return bookingId;
}

/**
 * Initialize booking confirmation page
 * @param {string} bookingId - The booking ID to display
 */
function initBookingConfirmation(bookingId) {
    console.log(`Initializing booking confirmation for: ${bookingId}`);
    
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
    
    // Get booking data
    const booking = bookingData[bookingId];
    if (!booking) {
        console.error(`Booking not found: ${bookingId}`);
        document.querySelector('.booking-confirmation-container').innerHTML = `
            <div class="error-message">
                <h2>Booking Not Found</h2>
                <p>We couldn't find the booking you're looking for.</p>
                <a href="#/" data-route="/" class="btn-primary">Return to Home</a>
            </div>
        `;
        return;
    }
    
    // Populate booking details
    document.getElementById('booking-reference').textContent = booking.bookingReference;
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
    
    // Set boat image
    const boatImage = document.getElementById('boat-image');
    if (boatImage) {
        boatImage.onerror = function(){ this.onerror = null; this.src = 'images/placeholder.svg'; };
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

// Make functions available globally
window.initBookingConfirmation = initBookingConfirmation;
window.createBooking = createBooking;
