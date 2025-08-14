/**
 * Booking Verification Service
 * Verifies if a user has booked a listing before allowing them to review it
 */
(function() {
    // Mock booking data - in a real app, this would come from the server
    const userBookings = {
        'user-1': [
            {
                id: 'booking-1',
                listingId: 'listing-1',
                date: '2023-07-15',
                status: 'completed'
            },
            {
                id: 'booking-2',
                listingId: 'listing-3',
                date: '2023-06-20',
                status: 'completed'
            }
        ]
    };
    
    // Booking verification service
    const BookingVerification = {
        /**
         * Check if the current user has booked a listing
         * @param {string} listingId - The ID of the listing to check
         * @returns {boolean} - True if the user has booked the listing, false otherwise
         */
        hasUserBookedListing(listingId) {
            // If no auth service or user is not logged in, return false
            if (!window.AuthService || !window.AuthService.isLoggedIn()) {
                return false;
            }
            
            // Get the current user
            const currentUser = window.AuthService.getCurrentUser();
            if (!currentUser) return false;
            
            // Get the user's bookings
            const bookings = userBookings[currentUser.id] || [];
            
            // Check if the user has a completed booking for the listing
            return bookings.some(booking => 
                booking.listingId === listingId && 
                booking.status === 'completed'
            );
        },
        
        /**
         * Get the user's completed bookings
         * @returns {Array} - Array of completed bookings
         */
        getUserCompletedBookings() {
            // If no auth service or user is not logged in, return empty array
            if (!window.AuthService || !window.AuthService.isLoggedIn()) {
                return [];
            }
            
            // Get the current user
            const currentUser = window.AuthService.getCurrentUser();
            if (!currentUser) return [];
            
            // Get the user's bookings
            const bookings = userBookings[currentUser.id] || [];
            
            // Filter completed bookings
            return bookings.filter(booking => booking.status === 'completed');
        },
        
        /**
         * Check if the user is eligible to review a listing
         * @param {string} listingId - The ID of the listing to check
         * @returns {Object} - Object with eligible property and message
         */
        canUserReviewListing(listingId) {
            // If no auth service or user is not logged in, return false
            if (!window.AuthService || !window.AuthService.isLoggedIn()) {
                return {
                    eligible: false,
                    message: 'You need to be logged in to write a review.'
                };
            }
            
            // Check if the user has already reviewed this listing
            if (window.ReviewsService && window.ReviewsService.hasUserReviewedListing(listingId)) {
                return {
                    eligible: false,
                    message: 'You have already reviewed this listing.'
                };
            }
            
            // Check if the user has booked this listing
            if (!this.hasUserBookedListing(listingId)) {
                return {
                    eligible: false,
                    message: 'You can only review listings you have booked and completed.'
                };
            }
            
            // User is eligible to review
            return {
                eligible: true,
                message: 'You can write a review for this listing.'
            };
        }
    };
    
    // Expose to global scope
    window.BookingVerification = BookingVerification;
})();
