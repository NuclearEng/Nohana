/**
 * WaveSurf Bookings Page
 * Handles the bookings page functionality
 */

(function() {
    // Sample bookings data - in a real app, this would come from the server
    const bookingsData = [
        {
            id: "booking-1",
            listingId: "boat-1",
            title: "Luxury Wakesurfing Boat",
            location: "Lake Travis, Austin, TX",
            image: "images/listings/boat1-1.jpg",
            date: "2025-08-20",
            time: "10:00 AM - 2:00 PM",
            guests: 4,
            price: 299,
            status: "confirmed",
            meetingPoint: {
                address: "Marina Point, Lake Travis",
                lat: 30.3884,
                lng: -97.9465
            },
            host: {
                id: "host1",
                name: "Jane Doe",
                avatar: "images/host-avatar.jpg",
                phone: "(555) 987-6543"
            },
            created: "2025-07-30"
        },
        {
            id: "booking-2",
            listingId: "boat-2",
            title: "Fishing Adventure Boat",
            location: "Lake Austin, TX",
            image: "images/listings/boat2-1.jpg",
            date: "2025-09-05",
            time: "6:00 AM - 12:00 PM",
            guests: 2,
            price: 199,
            status: "confirmed",
            meetingPoint: {
                address: "Austin Boat Dock, Lake Austin",
                lat: 30.2910,
                lng: -97.7851
            },
            host: {
                id: "host1",
                name: "Jane Doe",
                avatar: "images/host-avatar.jpg",
                phone: "(555) 987-6543"
            },
            created: "2025-08-01"
        },
        {
            id: "booking-3",
            listingId: "boat-3",
            title: "Party Pontoon Boat",
            location: "Lake Travis, Austin, TX",
            image: "images/listings/boat3-1.jpg",
            date: "2025-07-15",
            time: "3:00 PM - 7:00 PM",
            guests: 6,
            price: 399,
            status: "past",
            meetingPoint: {
                address: "Lakeway Marina, Lake Travis",
                lat: 30.3641,
                lng: -97.9722
            },
            host: {
                id: "host1",
                name: "Jane Doe",
                avatar: "images/host-avatar.jpg",
                phone: "(555) 987-6543"
            },
            created: "2025-06-30"
        },
        {
            id: "booking-4",
            listingId: "boat-1",
            title: "Luxury Wakesurfing Boat",
            location: "Lake Travis, Austin, TX",
            image: "images/listings/boat1-1.jpg",
            date: "2025-07-10",
            time: "1:00 PM - 5:00 PM",
            guests: 3,
            price: 249,
            status: "cancelled",
            meetingPoint: {
                address: "Marina Point, Lake Travis",
                lat: 30.3884,
                lng: -97.9465
            },
            host: {
                id: "host1",
                name: "Jane Doe",
                avatar: "images/host-avatar.jpg",
                phone: "(555) 987-6543"
            },
            created: "2025-06-15",
            cancelledOn: "2025-06-20"
        }
    ];

    /**
     * Initialize the bookings page
     */
    function initBookingsPage() {
        console.log('Initializing bookings page');
        
        // Hide loading overlay
        if (typeof toggleLoadingOverlay === 'function') {
            toggleLoadingOverlay(false);
        }
        
        // Initialize tabs
        initTabs();
        
        // Load bookings
        loadBookings();
    }
    
    /**
     * Initialize tab functionality
     */
    function initTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons and content
                document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Show corresponding content
                const tabName = button.getAttribute('data-tab');
                document.getElementById(`${tabName}-bookings`).classList.add('active');
            });
        });
    }
    
    /**
     * Load and display bookings
     */
    function loadBookings() {
        // In a real app, this would fetch data from the server
        setTimeout(() => {
            // Filter bookings by status
            const upcomingBookings = bookingsData.filter(booking => booking.status === 'confirmed');
            const pastBookings = bookingsData.filter(booking => booking.status === 'past');
            const cancelledBookings = bookingsData.filter(booking => booking.status === 'cancelled');
            
            // Render bookings
            renderBookings('upcoming-bookings-list', upcomingBookings);
            renderBookings('past-bookings-list', pastBookings);
            renderBookings('cancelled-bookings-list', cancelledBookings);
            
            // Show no bookings message if needed
            const hasBookings = bookingsData.length > 0;
            document.querySelector('.no-bookings-message').style.display = hasBookings ? 'none' : 'block';
            
            // Hide loading spinner
            document.querySelectorAll('.loading-spinner').forEach(spinner => {
                spinner.style.display = 'none';
            });
        }, 1000);
    }
    
    /**
     * Render bookings to the specified container
     * @param {string} containerId - The ID of the container element
     * @param {Array} bookings - Array of booking objects
     */
    function renderBookings(containerId, bookings) {
        const container = document.getElementById(containerId);
        
        if (!container) {
            console.error(`Container not found: ${containerId}`);
            return;
        }
        
        // Clear container (except loading spinner)
        const loadingSpinner = container.querySelector('.loading-spinner');
        container.innerHTML = '';
        if (loadingSpinner) {
            container.appendChild(loadingSpinner);
        }
        
        // Show message if no bookings
        if (bookings.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-list-message';
            emptyMessage.textContent = 'No bookings found';
            container.appendChild(emptyMessage);
            return;
        }
        
        // Render each booking
        bookings.forEach(booking => {
            const bookingCard = createBookingCard(booking);
            container.appendChild(bookingCard);
        });
    }
    
    /**
     * Create a booking card element
     * @param {Object} booking - Booking data
     * @returns {HTMLElement} - The booking card element
     */
    function createBookingCard(booking) {
        const bookingCard = document.createElement('div');
        bookingCard.className = 'booking-card';
        
        // Format date
        const bookingDate = new Date(booking.date);
        const formattedDate = bookingDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        
        bookingCard.innerHTML = `
            <div class="booking-card-header">
                <div class="booking-card-image">
                    <img src="${booking.image}" alt="${booking.title}">
                </div>
                <div class="booking-card-title">
                    <h3>${booking.title}</h3>
                    <p>${booking.location}</p>
                </div>
                <div class="booking-card-status status-${booking.status}">
                    ${capitalizeFirstLetter(booking.status)}
                </div>
            </div>
            <div class="booking-card-content">
                <div class="booking-details">
                    <div class="booking-detail-item">
                        <i class="far fa-calendar"></i>
                        ${formattedDate}
                    </div>
                    <div class="booking-detail-item">
                        <i class="far fa-clock"></i>
                        ${booking.time}
                    </div>
                    <div class="booking-detail-item">
                        <i class="fas fa-user-friends"></i>
                        ${booking.guests} ${booking.guests === 1 ? 'guest' : 'guests'}
                    </div>
                    <div class="booking-detail-item">
                        <i class="fas fa-dollar-sign"></i>
                        $${booking.price.toFixed(2)}
                    </div>
                </div>
                <div class="booking-card-actions">
                    <a href="#/booking-details/${booking.id}" data-route="/booking-details/${booking.id}" class="btn-primary">View Details</a>
                    ${booking.status === 'confirmed' ? `<button class="btn-secondary cancel-booking-btn" data-id="${booking.id}">Cancel</button>` : ''}
                </div>
            </div>
        `;
        
        // Add event listener for cancel button
        const cancelBtn = bookingCard.querySelector('.cancel-booking-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                handleCancelBooking(booking.id);
            });
        }
        
        return bookingCard;
    }
    
    /**
     * Handle booking cancellation
     * @param {string} bookingId - The ID of the booking to cancel
     */
    function handleCancelBooking(bookingId) {
        if (confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
            // In a real app, this would send a request to the server
            console.log(`Cancelling booking: ${bookingId}`);
            
            // For demo purposes, update the booking in our local data
            const bookingIndex = bookingsData.findIndex(b => b.id === bookingId);
            if (bookingIndex !== -1) {
                bookingsData[bookingIndex].status = 'cancelled';
                bookingsData[bookingIndex].cancelledOn = new Date().toISOString().split('T')[0];
                
                // Reload bookings to reflect the change
                loadBookings();
                
                // Show success message
                alert('Booking cancelled successfully');
            }
        }
    }
    
    /**
     * Capitalize the first letter of a string
     * @param {string} string - The string to capitalize
     * @returns {string} - The capitalized string
     */
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    // Make functions available globally
    window.initBookingsPage = initBookingsPage;
})();
