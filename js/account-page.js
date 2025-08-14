/**
 * Account Page Handler
 * This script manages the account page functionality
 */

function initAccountPage() {
    console.log('Initializing account page');
    
    // Hide loading overlay immediately
    const loadingOverlay = document.getElementById('page-loading');
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
    
    // Check if user is logged in
    if (window.AuthService && !window.AuthService.isLoggedIn()) {
        console.error('Access denied: User is not logged in');
        if (window.waveRouter) {
            window.waveRouter.navigate('/');
        }
        return;
    }
    
    // Get user data from auth service
    const currentUser = window.AuthService.getCurrentUser();
    
    // Update profile header with user data
    updateProfileHeader(currentUser);
    
    // Initialize tab navigation
    initTabNavigation();
    
    // Load bookings (default tab)
    loadBookings('upcoming');
    
    // Initialize booking filter
    initBookingFilter();
    
    // Initialize other event listeners
    initEventListeners();
    
    // Populate settings form with user data
    populateSettingsForm(currentUser);
}

/**
 * Update profile header with user data
 * @param {Object} user - User data from auth service
 */
function updateProfileHeader(user) {
    if (!user) return;
    
    // Update user name
    const userName = document.querySelector('.profile-info h1');
    if (userName) {
        userName.textContent = user.name;
    }
    
    // Update member since date
    const memberSince = document.querySelector('.member-since');
    if (memberSince) {
        memberSince.textContent = `Member since ${user.memberSince}`;
    }
    
    // Update user avatar
    const userAvatar = document.querySelector('.profile-avatar img');
    if (userAvatar && user.avatar) {
        userAvatar.src = user.avatar;
        userAvatar.alt = user.name;
    }
}

/**
 * Initialize tab navigation
 */
function initTabNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all tabs
            navItems.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked tab
            item.classList.add('active');
            
            // Hide all tab content
            const tabContents = document.querySelectorAll('.profile-tab-content');
            tabContents.forEach(content => content.classList.add('hidden'));
            
            // Show corresponding tab content
            const tabId = item.getAttribute('data-tab');
            const tabContent = document.getElementById(`${tabId}-tab`);
            if (tabContent) {
                tabContent.classList.remove('hidden');
                
                // Load tab content
                switch (tabId) {
                    case 'bookings':
                        const filter = document.getElementById('booking-filter').value;
                        loadBookings(filter);
                        break;
                    case 'favorites':
                        loadFavorites();
                        break;
                    case 'reviews':
                        loadReviews();
                        break;
                }
            }
        });
    });
}

/**
 * Initialize booking filter
 */
function initBookingFilter() {
    const bookingFilter = document.getElementById('booking-filter');
    
    if (bookingFilter) {
        bookingFilter.addEventListener('change', () => {
            loadBookings(bookingFilter.value);
        });
    }
}

// Sample user bookings data - in a real app, this would come from the server
const userBookings = [
    {
        id: 'booking-1',
        listingId: 'listing-1',
        title: 'Mastercraft X-Star - Perfect for Wakesurfing',
        image: 'images/listings/boat1-1.jpg',
        date: '2023-07-15',
        time: '10:00 AM',
        seats: 3,
        total: 155,
        status: 'upcoming'
    },
    {
        id: 'booking-2',
        listingId: 'listing-2',
        title: 'Malibu Wakesetter - Best Wake in Austin',
        image: 'images/listings/boat2-1.jpg',
        date: '2023-08-22',
        time: '1:00 PM',
        seats: 4,
        total: 250,
        status: 'upcoming'
    },
    {
        id: 'booking-3',
        listingId: 'listing-3',
        title: 'Pro Bass Fishing Boat with Guide',
        image: 'images/listings/boat3-1.jpg',
        date: '2023-06-10',
        time: '6:00 AM',
        seats: 2,
        total: 85,
        status: 'completed'
    }
];

/**
 * Load bookings based on filter
 * @param {string} filter - The filter to apply (upcoming, past, all)
 */
function loadBookings(filter = 'upcoming') {
    const bookingsList = document.getElementById('bookings-list');
    
    if (!bookingsList) return;
    
    // Clear current bookings
    bookingsList.innerHTML = '';
    
    // Filter bookings
    let filteredBookings;
    switch (filter) {
        case 'upcoming':
            filteredBookings = userBookings.filter(booking => booking.status === 'upcoming');
            break;
        case 'past':
            filteredBookings = userBookings.filter(booking => booking.status === 'completed');
            break;
        default:
            filteredBookings = userBookings;
            break;
    }
    
    if (filteredBookings.length === 0) {
        bookingsList.innerHTML = '<div class="no-results">No bookings found</div>';
        return;
    }
    
    // Render bookings
    filteredBookings.forEach(booking => {
        const bookingCard = document.createElement('div');
        bookingCard.className = 'booking-card';
        bookingCard.innerHTML = `
            <div class="booking-card-image">
                <img src="${booking.image}" alt="${booking.title}">
            </div>
            <div class="booking-card-content">
                <h3 class="booking-card-title">${booking.title}</h3>
                <p class="booking-card-date">${formatDate(booking.date)} at ${booking.time}</p>
                <span class="booking-status status-${booking.status}">
                    ${capitalize(booking.status)}
                </span>
                <div class="booking-card-details">
                    <div class="booking-detail">
                        <i class="fas fa-users"></i>
                        <span>${booking.seats} seats</span>
                    </div>
                    <div class="booking-detail">
                        <i class="fas fa-dollar-sign"></i>
                        <span>$${booking.total} total</span>
                    </div>
                </div>
                <div class="booking-card-actions">
                    <a href="#/booking-details/${booking.id}" data-route="/booking-details/${booking.id}" class="btn-primary">View Details</a>
                    ${booking.status === 'upcoming' ? '<button class="btn-secondary cancel-booking-btn" data-id="' + booking.id + '">Cancel</button>' : ''}
                </div>
            </div>
        `;
        bookingsList.appendChild(bookingCard);
    });
    
    // Attach event listeners to cancel buttons
    const cancelButtons = document.querySelectorAll('.cancel-booking-btn');
    cancelButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            const bookingId = button.getAttribute('data-id');
            if (confirm('Are you sure you want to cancel this booking? Cancellation policy may apply.')) {
                // In a real app, this would send a cancellation request to the server
                alert(`Booking ${bookingId} has been cancelled. A confirmation will be sent to your email.`);
                
                // Reload bookings
                loadBookings(filter);
            }
        });
    });
}

// Sample user favorites data
const userFavorites = [
    {
        id: 'listing-2',
        title: 'Malibu Wakesetter - Best Wake in Austin',
        image: 'images/listings/boat2-1.jpg',
        price: '$55',
        priceUnit: 'seat',
        rating: '4.92',
        reviews: 78,
        availableSeats: 7
    },
    {
        id: 'listing-3',
        title: 'Pro Bass Fishing Boat with Guide',
        image: 'images/listings/boat3-1.jpg',
        price: '$35',
        priceUnit: 'seat',
        rating: '4.89',
        reviews: 56,
        availableSeats: 3
    }
];

/**
 * Load favorites
 */
function loadFavorites() {
    const favoritesList = document.getElementById('favorites-list');
    
    if (!favoritesList) return;
    
    // Clear current favorites
    favoritesList.innerHTML = '';
    
    if (userFavorites.length === 0) {
        favoritesList.innerHTML = '<div class="no-results">No favorites found</div>';
        return;
    }
    
    // Render favorites
    userFavorites.forEach(favorite => {
        const favoriteCard = document.createElement('div');
        favoriteCard.className = 'listing-card';
        favoriteCard.innerHTML = `
            <a href="#/listing/${favorite.id}" data-route="/listing/${favorite.id}" class="listing-link">
                <div class="listing-images">
                    <div class="image-slider">
                        <img src="${favorite.image}" alt="${favorite.title}">
                    </div>
                </div>
                <div class="listing-info">
                    <div class="listing-title">${favorite.title}</div>
                    <div class="listing-meta">
                        <div class="rating">
                            <i class="fas fa-star"></i>
                            <span>${favorite.rating}</span>
                            <span class="reviews">(${favorite.reviews})</span>
                        </div>
                    </div>
                    <div class="listing-price">
                        <span class="price">${favorite.price}</span> / ${favorite.priceUnit}
                    </div>
                    <div class="seat-availability">
                        <i class="fas fa-user"></i> <span class="available-seats">${favorite.availableSeats}</span> seats available
                    </div>
                </div>
            </a>
            <button class="favorite active">
                <i class="fas fa-heart"></i>
            </button>
        `;
        favoritesList.appendChild(favoriteCard);
    });
    
    // Attach event listeners to favorite buttons
    const favoriteButtons = document.querySelectorAll('.favorite');
    favoriteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            button.classList.toggle('active');
            
            // In a real app, this would update the favorite status on the server
            const isFavorite = button.classList.contains('active');
            const card = button.closest('.listing-card');
            const id = card.querySelector('.listing-link').getAttribute('href').split('/').pop();
            
            alert(`${isFavorite ? 'Added to' : 'Removed from'} favorites: ${id}`);
            
            // If we're on the favorites page and removing a favorite, remove the card
            if (!isFavorite && document.getElementById('favorites-tab').classList.contains('profile-tab-content') && 
                !document.getElementById('favorites-tab').classList.contains('hidden')) {
                card.remove();
                
                // Check if there are any favorites left
                if (document.querySelectorAll('#favorites-list .listing-card').length === 0) {
                    document.getElementById('favorites-list').innerHTML = '<div class="no-results">No favorites found</div>';
                }
            }
        });
    });
}

// Sample user reviews data
const userReviews = [
    {
        id: 'review-1',
        listingId: 'listing-1',
        title: 'Mastercraft X-Star - Perfect for Wakesurfing',
        date: '2023-06-01',
        rating: 5,
        comment: 'Amazing experience! The boat was clean and well-maintained, and the captain was very friendly and knowledgeable. Will definitely book again!'
    },
    {
        id: 'review-2',
        listingId: 'listing-3',
        title: 'Pro Bass Fishing Boat with Guide',
        date: '2023-05-15',
        rating: 4,
        comment: 'Great fishing trip! The guide was very helpful and knew exactly where to find the fish. The only downside was the weather, but that\'s not their fault.'
    }
];

/**
 * Load reviews
 */
function loadReviews() {
    const reviewsList = document.getElementById('profile-reviews-list');
    
    if (!reviewsList) return;
    
    // Clear current reviews
    reviewsList.innerHTML = '';
    
    if (userReviews.length === 0) {
        reviewsList.innerHTML = '<div class="no-results">No reviews found</div>';
        return;
    }
    
    // Render reviews
    userReviews.forEach(review => {
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        reviewItem.innerHTML = `
            <div class="review-header">
                <h3>${review.title}</h3>
                <div class="review-date">${formatDate(review.date)}</div>
            </div>
            <div class="review-rating">
                ${getRatingStars(review.rating)}
                <span class="rating-value">${review.rating}.0</span>
            </div>
            <div class="review-comment">${review.comment}</div>
            <div class="review-actions">
                <button class="edit-review-btn" data-id="${review.id}">
                    <i class="fas fa-pen"></i>
                    Edit
                </button>
            </div>
        `;
        reviewsList.appendChild(reviewItem);
    });
    
    // Attach event listeners to edit buttons
    const editButtons = document.querySelectorAll('.edit-review-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const reviewId = button.getAttribute('data-id');
            
            // Get the review data
            const review = window.ReviewsService.getReviewById(reviewId);
            
            if (review && window.ReviewModal) {
                // Open the review modal in edit mode
                window.ReviewModal.open('edit', { review });
            } else {
                console.error('Review not found or ReviewModal not available');
            }
        });
    });
    
    // Add delete buttons to reviews
    const reviewItems = document.querySelectorAll('.review-item');
    reviewItems.forEach(item => {
        const actionsDiv = item.querySelector('.review-actions');
        const reviewId = item.querySelector('.edit-review-btn').getAttribute('data-id');
        
        // Add delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-review-btn';
        deleteButton.setAttribute('data-id', reviewId);
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>Delete';
        
        deleteButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
                const success = window.ReviewsService.deleteReview(reviewId);
                
                if (success) {
                    // Remove the review item from the DOM
                    item.remove();
                    
                    // Check if there are any reviews left
                    if (document.querySelectorAll('#profile-reviews-list .review-item').length === 0) {
                        document.getElementById('profile-reviews-list').innerHTML = '<div class="no-results">No reviews found</div>';
                    }
                }
            }
        });
        
        actionsDiv.appendChild(deleteButton);
    });
    
    // Listen for review updated event
    document.addEventListener('reviewUpdated', (event) => {
        const { review } = event.detail;
        
        // Find the review item in the DOM
        const reviewItem = document.querySelector(`.review-item .edit-review-btn[data-id="${review.id}"]`).closest('.review-item');
        
        if (reviewItem) {
            // Update the review content
            reviewItem.querySelector('.review-rating').innerHTML = `
                ${getRatingStars(review.rating)}
                <span class="rating-value">${review.rating}.0</span>
            `;
            reviewItem.querySelector('.review-comment').textContent = review.comment;
            reviewItem.querySelector('.review-date').textContent = formatDate(review.date);
        }
    });
}

/**
 * Initialize additional event listeners
 */
function initEventListeners() {
    // Edit profile button
    const editProfileBtn = document.querySelector('.edit-profile-btn');
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            // Navigate to settings tab
            document.querySelector('.nav-item[data-tab="settings"]').click();
        });
    }
    
    // Profile settings form
    const profileSettingsForm = document.getElementById('profile-settings-form');
    if (profileSettingsForm) {
        profileSettingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // In a real app, this would send the updated profile data to the server
            alert('Profile updated successfully!');
        });
    }
    
    // Cancel button in settings form
    const cancelButton = document.querySelector('.form-actions .btn-secondary');
    if (cancelButton) {
        cancelButton.addEventListener('click', () => {
            // Navigate back to bookings tab
            document.querySelector('.nav-item[data-tab="bookings"]').click();
        });
    }
    
    // Change password button
    const changePasswordBtn = document.querySelector('.change-password-btn');
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', () => {
            // In a real app, this would open a modal to change password
            alert('Change password - This feature is not implemented yet');
        });
    }
    
    // Change photo button
    const changePhotoBtn = document.querySelector('.change-photo-btn');
    if (changePhotoBtn) {
        changePhotoBtn.addEventListener('click', () => {
            // In a real app, this would open a file picker to change the photo
            alert('Change photo - This feature is not implemented yet');
        });
    }
}

/**
 * Populate settings form with user data
 * @param {Object} user - User data from auth service
 */
function populateSettingsForm(user) {
    if (!user) return;
    
    // Populate form fields
    const nameInput = document.getElementById('profile-name');
    const emailInput = document.getElementById('profile-email');
    const phoneInput = document.getElementById('profile-phone');
    const addressInput = document.getElementById('profile-address');
    
    if (nameInput) nameInput.value = user.name || '';
    if (emailInput) emailInput.value = user.email || '';
    if (phoneInput) phoneInput.value = user.phone || '';
    if (addressInput) addressInput.value = user.address || '';
}

/**
 * Format a date string (YYYY-MM-DD) to a more readable format
 * @param {string} dateStr - Date string in YYYY-MM-DD format
 * @returns {string} Formatted date string (e.g., "July 15, 2023")
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
 * Get HTML for rating stars
 * @param {number} rating - Rating (1-5)
 * @returns {string} HTML for rating stars
 */
function getRatingStars(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    let starsHtml = '';
    
    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        starsHtml += '<i class="fas fa-star"></i>';
    }
    
    // Add half star if needed
    if (halfStar) {
        starsHtml += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHtml += '<i class="far fa-star"></i>';
    }
    
    return starsHtml;
}

// Make initAccountPage available globally
window.initAccountPage = initAccountPage;
