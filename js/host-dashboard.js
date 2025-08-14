/**
 * WaveSurf Host Dashboard
 * Handles the host dashboard functionality
 */

// Sample host listings data - in a real app, this would come from the server
const hostListings = [
    {
        id: 'listing-1',
        title: 'Mastercraft X-Star - Perfect for Wakesurfing',
        location: 'Lake Travis, Austin',
        price: 45,
        priceUnit: 'seat',
        rating: 4.98,
        reviews: 43,
        availableSeats: 5,
        totalSeats: 8,
        image: 'images/listings/boat1-1.jpg',
        images: ['images/listings/boat1-1.jpg', 'images/listings/boat1-2.jpg', 'images/listings/boat1-3.jpg'],
        status: 'active',
        bookings: 8,
        earnings: 1250
    },
    {
        id: 'listing-2',
        title: 'Malibu Wakesetter - Best Wake in Austin',
        location: 'Lake Austin, Texas',
        price: 55,
        priceUnit: 'seat',
        rating: 4.92,
        reviews: 78,
        availableSeats: 7,
        totalSeats: 10,
        image: 'images/listings/boat2-1.jpg',
        images: ['images/listings/boat2-1.jpg', 'images/listings/boat2-2.jpg', 'images/listings/boat2-3.jpg'],
        status: 'active',
        bookings: 12,
        earnings: 2450
    },
    {
        id: 'listing-3',
        title: 'Pro Bass Fishing Boat with Guide',
        location: 'Lake Conroe, Houston',
        price: 35,
        priceUnit: 'seat',
        rating: 4.89,
        reviews: 56,
        availableSeats: 3,
        totalSeats: 4,
        image: 'images/listings/boat3-1.jpg',
        images: ['images/listings/boat3-1.jpg', 'images/listings/boat3-2.jpg', 'images/listings/boat3-3.jpg'],
        status: 'inactive',
        bookings: 6,
        earnings: 750
    }
];

// Sample host bookings data
const hostBookings = [
    {
        id: 'booking-1',
        listingId: 'listing-1',
        boatName: 'Mastercraft X-Star',
        guestName: 'Michael Johnson',
        date: '2023-07-15',
        time: '10:00 AM',
        seats: 3,
        total: 155,
        status: 'upcoming'
    },
    {
        id: 'booking-2',
        listingId: 'listing-2',
        boatName: 'Malibu Wakesetter',
        guestName: 'Sarah Williams',
        date: '2023-07-22',
        time: '1:00 PM',
        seats: 4,
        total: 250,
        status: 'upcoming'
    },
    {
        id: 'booking-3',
        listingId: 'listing-1',
        boatName: 'Mastercraft X-Star',
        guestName: 'David Brown',
        date: '2023-06-10',
        time: '2:00 PM',
        seats: 2,
        total: 110,
        status: 'completed'
    },
    {
        id: 'booking-4',
        listingId: 'listing-2',
        boatName: 'Malibu Wakesetter',
        guestName: 'Jennifer Davis',
        date: '2023-06-18',
        time: '11:00 AM',
        seats: 6,
        total: 360,
        status: 'completed'
    },
    {
        id: 'booking-5',
        listingId: 'listing-3',
        boatName: 'Pro Bass Fishing Boat',
        guestName: 'Robert Wilson',
        date: '2023-06-05',
        time: '6:00 AM',
        seats: 2,
        total: 85,
        status: 'completed'
    }
];

// Sample transactions data
const transactions = [
    {
        id: 'trans-1',
        date: '2023-07-01',
        description: 'Payout for June bookings',
        bookingId: '',
        amount: 1200,
        status: 'completed'
    },
    {
        id: 'trans-2',
        date: '2023-06-15',
        description: 'Booking payment',
        bookingId: 'booking-3',
        amount: 110,
        status: 'completed'
    },
    {
        id: 'trans-3',
        date: '2023-06-18',
        description: 'Booking payment',
        bookingId: 'booking-4',
        amount: 360,
        status: 'completed'
    },
    {
        id: 'trans-4',
        date: '2023-06-05',
        description: 'Booking payment',
        bookingId: 'booking-5',
        amount: 85,
        status: 'completed'
    },
    {
        id: 'trans-5',
        date: '2023-07-15',
        description: 'Booking payment',
        bookingId: 'booking-1',
        amount: 155,
        status: 'pending'
    },
    {
        id: 'trans-6',
        date: '2023-07-22',
        description: 'Booking payment',
        bookingId: 'booking-2',
        amount: 250,
        status: 'pending'
    }
];

// Sample reviews data
const hostReviews = [
    {
        id: 'review-1',
        listingId: 'listing-1',
        boatName: 'Mastercraft X-Star',
        guestName: 'Emily Clark',
        date: '2023-06-12',
        rating: 5,
        comment: 'Amazing experience! John was an excellent captain and made sure we had a fantastic time wakesurfing. The boat was clean, well-maintained, and had all the amenities we needed. Will definitely book again!'
    },
    {
        id: 'review-2',
        listingId: 'listing-2',
        boatName: 'Malibu Wakesetter',
        guestName: 'Thomas Lee',
        date: '2023-06-08',
        rating: 4,
        comment: 'Great boat and excellent wake for wakeboarding. John was knowledgeable and friendly. The only reason I\'m not giving 5 stars is because we started a bit late, but overall it was a great experience.'
    },
    {
        id: 'review-3',
        listingId: 'listing-1',
        boatName: 'Mastercraft X-Star',
        guestName: 'Jessica Miller',
        date: '2023-05-30',
        rating: 5,
        comment: 'Perfect day on the water! The boat was amazing and John was an excellent host. He taught us how to wakesurf and was very patient with beginners. Highly recommend!'
    }
];

// Current filter states
let listingFilter = 'all';
let bookingFilter = 'upcoming';
let earningsPeriod = 'month';

/**
 * Initialize host dashboard
 */
function initHostDashboard() {
    console.log('Initializing host dashboard');
    
    // Check if user is logged in and is a host
    if (!window.AuthService || !window.AuthService.isLoggedIn()) {
        console.error('Access denied: User is not logged in');
        window.waveRouter.navigate('/');
        return;
    }
    
    if (!window.AuthService.isHost()) {
        console.error('Access denied: User is not a host');
        // Redirect to become-host page
        window.waveRouter.navigate('/become-host');
        return;
    }
    
    // Get host data from auth service
    const currentUser = window.AuthService.getCurrentUser();
    
    // Update host profile in sidebar
    updateHostProfile(currentUser);
    
    // Initialize tab navigation
    initTabNavigation();
    
    // Load listings (default tab)
    loadListings(listingFilter);
    
    // Initialize listing filter
    initListingFilter();
    
    // Initialize booking filter
    initBookingFilter();
    
    // Initialize earnings period filter
    initEarningsPeriod();
    
    // Initialize add listing button
    initAddListingButton();
    
    // Initialize listing modal
    initListingModal();
}

/**
 * Update host profile in sidebar with user data
 * @param {Object} user - User data from auth service
 */
function updateHostProfile(user) {
    if (!user) return;
    
    // Update host name
    const hostName = document.querySelector('.host-info h3');
    if (hostName) {
        hostName.textContent = user.name;
    }
    
    // Update host since date
    const hostSince = document.querySelector('.host-info p');
    if (hostSince) {
        hostSince.textContent = `Host since ${user.hostSince || 'January 2023'}`;
    }
    
    // Update host rating
    const hostRating = document.querySelector('.host-rating span:first-child');
    if (hostRating) {
        hostRating.textContent = user.rating || '4.9';
    }
    
    // Update host reviews count
    const hostReviews = document.querySelector('.host-rating .reviews');
    if (hostReviews) {
        hostReviews.textContent = `(${user.reviews || 32} reviews)`;
    }
    
    // Update host avatar
    const hostAvatar = document.querySelector('.host-avatar img');
    if (hostAvatar && user.avatar) {
        hostAvatar.src = user.avatar;
        hostAvatar.alt = user.name;
    }
}

/**
 * Initialize tab navigation
 */
function initTabNavigation() {
    const navItems = document.querySelectorAll('.dashboard-nav .nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all tabs
            navItems.forEach(tab => tab.classList.remove('active'));
            
            // Add active class to clicked tab
            item.classList.add('active');
            
            // Hide all tab content
            const tabContents = document.querySelectorAll('.dashboard-tab-content');
            tabContents.forEach(content => content.classList.add('hidden'));
            
            // Show corresponding tab content
            const tabId = item.getAttribute('data-tab');
            const tabContent = document.getElementById(`${tabId}-tab`);
            if (tabContent) {
                tabContent.classList.remove('hidden');
                
                // Load tab content
                switch (tabId) {
                    case 'listings':
                        loadListings(listingFilter);
                        break;
                    case 'bookings':
                        loadBookings(bookingFilter);
                        break;
                    case 'earnings':
                        loadEarnings(earningsPeriod);
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
 * Initialize listing filter
 */
function initListingFilter() {
    const listingFilterSelect = document.getElementById('listing-filter');
    
    if (listingFilterSelect) {
        listingFilterSelect.addEventListener('change', () => {
            listingFilter = listingFilterSelect.value;
            loadListings(listingFilter);
        });
    }
}

/**
 * Initialize booking filter
 */
function initBookingFilter() {
    const bookingFilterSelect = document.getElementById('host-booking-filter');
    
    if (bookingFilterSelect) {
        bookingFilterSelect.addEventListener('change', () => {
            bookingFilter = bookingFilterSelect.value;
            loadBookings(bookingFilter);
        });
    }
}

/**
 * Initialize earnings period filter
 */
function initEarningsPeriod() {
    const earningsPeriodSelect = document.getElementById('earnings-period');
    
    if (earningsPeriodSelect) {
        earningsPeriodSelect.addEventListener('change', () => {
            earningsPeriod = earningsPeriodSelect.value;
            loadEarnings(earningsPeriod);
        });
    }
}

/**
 * Initialize add listing button
 */
function initAddListingButton() {
    const addListingBtn = document.querySelector('.add-listing-btn');
    
    if (addListingBtn) {
        addListingBtn.addEventListener('click', () => {
            showListingModal();
        });
    }
}

/**
 * Load listings based on filter
 * @param {string} filter - The filter to apply (all, active, inactive, pending)
 */
function loadListings(filter = 'all') {
    const listingsGrid = document.getElementById('host-listings-grid');
    
    if (!listingsGrid) return;
    
    // Clear current listings
    listingsGrid.innerHTML = '';
    
    // Filter listings
    let filteredListings;
    switch (filter) {
        case 'active':
            filteredListings = hostListings.filter(listing => listing.status === 'active');
            break;
        case 'inactive':
            filteredListings = hostListings.filter(listing => listing.status === 'inactive');
            break;
        case 'pending':
            filteredListings = hostListings.filter(listing => listing.status === 'pending');
            break;
        default:
            filteredListings = hostListings;
            break;
    }
    
    if (filteredListings.length === 0) {
        listingsGrid.innerHTML = '<div class="no-results">No listings found</div>';
        return;
    }
    
    // Render listings
    filteredListings.forEach(listing => {
        const listingCard = document.createElement('div');
        listingCard.className = 'host-listing-card';
        listingCard.innerHTML = `
            <div class="host-listing-image">
                <img src="${listing.image}" alt="${listing.title}" onerror="this.onerror=null;this.src='images/placeholder.svg'">
                <div class="listing-status status-${listing.status}">${capitalize(listing.status)}</div>
            </div>
            <div class="host-listing-content">
                <h3 class="host-listing-title">${listing.title}</h3>
                <p class="host-listing-location">${listing.location}</p>
                <div class="host-listing-stats">
                    <div class="host-listing-stat">
                        <div class="stat-number">$${listing.price}</div>
                        <div class="stat-text">per seat</div>
                    </div>
                    <div class="host-listing-stat">
                        <div class="stat-number">${listing.bookings}</div>
                        <div class="stat-text">bookings</div>
                    </div>
                    <div class="host-listing-stat">
                        <div class="stat-number">$${listing.earnings}</div>
                        <div class="stat-text">earned</div>
                    </div>
                </div>
                <div class="host-listing-actions">
                    <button class="btn-primary edit-listing-btn" data-id="${listing.id}">Edit</button>
                    <button class="btn-secondary toggle-status-btn" data-id="${listing.id}" data-status="${listing.status}">
                        ${listing.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                </div>
            </div>
        `;
        
        listingsGrid.appendChild(listingCard);
    });
    
    // Attach event listeners to edit buttons
    const editButtons = document.querySelectorAll('.edit-listing-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', () => {
            const listingId = button.getAttribute('data-id');
            const listing = hostListings.find(l => l.id === listingId);
            if (listing) {
                showListingModal(listing);
            }
        });
    });
    
    // Attach event listeners to toggle status buttons
    const toggleButtons = document.querySelectorAll('.toggle-status-btn');
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const listingId = button.getAttribute('data-id');
            const currentStatus = button.getAttribute('data-status');
            const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
            
            // In a real app, this would update the status on the server
            // For demo purposes, we'll just update the UI
            button.setAttribute('data-status', newStatus);
            button.textContent = newStatus === 'active' ? 'Deactivate' : 'Activate';
            
            const statusBadge = button.closest('.host-listing-card').querySelector('.listing-status');
            statusBadge.className = `listing-status status-${newStatus}`;
            statusBadge.textContent = capitalize(newStatus);
            
            // Show confirmation message
            alert(`Listing ${listingId} has been ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
        });
    });
}

/**
 * Load bookings based on filter
 * @param {string} filter - The filter to apply (upcoming, past, all)
 */
function loadBookings(filter = 'upcoming') {
    const bookingsList = document.getElementById('host-bookings-list');
    
    if (!bookingsList) return;
    
    // Clear current bookings
    bookingsList.innerHTML = '';
    
    // Filter bookings
    let filteredBookings;
    switch (filter) {
        case 'upcoming':
            filteredBookings = hostBookings.filter(booking => booking.status === 'upcoming');
            break;
        case 'past':
            filteredBookings = hostBookings.filter(booking => booking.status === 'completed');
            break;
        default:
            filteredBookings = hostBookings;
            break;
    }
    
    if (filteredBookings.length === 0) {
        bookingsList.innerHTML = '<tr><td colspan="9" class="no-results">No bookings found</td></tr>';
        return;
    }
    
    // Render bookings
    filteredBookings.forEach(booking => {
        const bookingRow = document.createElement('tr');
        bookingRow.innerHTML = `
            <td>${booking.id}</td>
            <td>${booking.boatName}</td>
            <td>${booking.guestName}</td>
            <td>${formatDate(booking.date)}</td>
            <td>${booking.time}</td>
            <td>${booking.seats}</td>
            <td>$${booking.total}</td>
            <td><span class="status-${booking.status}">${capitalize(booking.status)}</span></td>
            <td>
                <div class="booking-actions">
                    <button class="btn-primary view-booking-btn" data-id="${booking.id}">View</button>
                    ${booking.status === 'upcoming' ? `<button class="btn-secondary cancel-booking-btn" data-id="${booking.id}">Cancel</button>` : ''}
                </div>
            </td>
        `;
        
        bookingsList.appendChild(bookingRow);
    });
    
    // Attach event listeners to view buttons
    const viewButtons = document.querySelectorAll('.view-booking-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const bookingId = button.getAttribute('data-id');
            // In a real app, this would navigate to the booking details page
            alert(`View booking details for ${bookingId}`);
        });
    });
    
    // Attach event listeners to cancel buttons
    const cancelButtons = document.querySelectorAll('.cancel-booking-btn');
    cancelButtons.forEach(button => {
        button.addEventListener('click', () => {
            const bookingId = button.getAttribute('data-id');
            if (confirm(`Are you sure you want to cancel booking ${bookingId}?`)) {
                // In a real app, this would send a cancellation request to the server
                alert(`Booking ${bookingId} has been cancelled`);
                
                // Reload bookings
                loadBookings(filter);
            }
        });
    });
}

/**
 * Load earnings data based on period
 * @param {string} period - The period to show (month, quarter, year, all)
 */
function loadEarnings(period = 'month') {
    // In a real app, this would fetch earnings data from the server based on the period
    // For demo purposes, we'll just update the UI with static data
    
    // Update transactions table
    const transactionsList = document.getElementById('transactions-list');
    
    if (!transactionsList) return;
    
    // Clear current transactions
    transactionsList.innerHTML = '';
    
    // Render transactions
    transactions.forEach(transaction => {
        const transactionRow = document.createElement('tr');
        transactionRow.innerHTML = `
            <td>${formatDate(transaction.date)}</td>
            <td>${transaction.description}</td>
            <td>${transaction.bookingId || '-'}</td>
            <td>$${transaction.amount}</td>
            <td><span class="status-${transaction.status}">${capitalize(transaction.status)}</span></td>
        `;
        
        transactionsList.appendChild(transactionRow);
    });
}

/**
 * Load reviews
 */
function loadReviews() {
    const reviewsList = document.getElementById('host-reviews-list');
    
    if (!reviewsList) return;
    
    // Clear current reviews
    reviewsList.innerHTML = '';
    
    // Render reviews
    hostReviews.forEach(review => {
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        reviewItem.innerHTML = `
            <div class="review-header">
                <div>
                    <h3>${review.boatName}</h3>
                    <div class="review-meta">
                        <span class="review-author">${review.guestName}</span>
                        <span class="review-date">${formatDate(review.date)}</span>
                    </div>
                </div>
                <div class="review-rating">
                    ${getRatingStars(review.rating)}
                    <span class="rating-value">${review.rating}.0</span>
                </div>
            </div>
            <div class="review-comment">${review.comment}</div>
            <div class="review-actions">
                <button class="btn-secondary reply-review-btn" data-id="${review.id}">
                    <i class="fas fa-reply"></i>
                    Reply
                </button>
            </div>
        `;
        
        reviewsList.appendChild(reviewItem);
    });
    
    // Attach event listeners to reply buttons
    const replyButtons = document.querySelectorAll('.reply-review-btn');
    replyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const reviewId = button.getAttribute('data-id');
            // In a real app, this would open a reply form
            alert(`Reply to review ${reviewId}`);
        });
    });
}

/**
 * Show listing modal for adding or editing a listing
 * @param {Object} listing - The listing to edit (null for new listing)
 */
function showListingModal(listing = null) {
    const modal = document.getElementById('listingModal');
    const modalTitle = document.getElementById('listing-modal-title');
    const form = document.getElementById('listing-form');
    
    if (!modal || !modalTitle || !form) return;
    
    // Set modal title
    modalTitle.textContent = listing ? 'Edit Listing' : 'Add New Listing';
    
    // Populate form fields if editing
    if (listing) {
        document.getElementById('listing-title').value = listing.title;
        document.getElementById('listing-description').value = 'This is a fantastic boat for wakesurfing with a perfect wake and all the amenities you need for a great day on the water.';
        document.getElementById('listing-location').value = listing.location;
        document.getElementById('boat-type').value = 'wake';
        document.getElementById('boat-length').value = '24';
        document.getElementById('boat-capacity').value = listing.totalSeats;
        document.getElementById('boat-power').value = '350';
        document.getElementById('price-per-seat').value = listing.price;
        
        // Check activities
        document.querySelectorAll('input[name="activity"]').forEach(checkbox => {
            checkbox.checked = listing.activities && listing.activities.includes(checkbox.value);
        });
        
        // Check amenities
        document.querySelectorAll('input[name="amenity"]').forEach(checkbox => {
            checkbox.checked = listing.amenities && listing.amenities.includes(checkbox.value);
        });
        
        // Simulate uploaded photos
        const uploadedPhotos = document.getElementById('uploaded-photos');
        if (uploadedPhotos) {
            uploadedPhotos.innerHTML = '';
            
            listing.images.forEach((image, index) => {
                const photoDiv = document.createElement('div');
                photoDiv.className = 'uploaded-photo';
                photoDiv.innerHTML = `
                    <img src="${image}" alt="Boat photo ${index + 1}" onerror="this.onerror=null;this.src='images/placeholder.svg'">
                    <button type="button" class="remove-photo">
                        <i class="fas fa-times"></i>
                    </button>
                `;
                uploadedPhotos.appendChild(photoDiv);
            });
            
            // Attach event listeners to remove buttons
            const removeButtons = document.querySelectorAll('.remove-photo');
            removeButtons.forEach(button => {
                button.addEventListener('click', () => {
                    button.closest('.uploaded-photo').remove();
                });
            });
        }
    } else {
        // Reset form for new listing
        form.reset();
        
        // Clear uploaded photos
        const uploadedPhotos = document.getElementById('uploaded-photos');
        if (uploadedPhotos) {
            uploadedPhotos.innerHTML = '';
        }
    }
    
    // Show modal
    modal.style.display = 'flex';
    
    // Initialize close button
    const closeButton = modal.querySelector('.close-modal');
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    // Initialize cancel button
    const cancelButton = modal.querySelector('.cancel-listing-btn');
    if (cancelButton) {
        cancelButton.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }
    
    // Initialize form submission
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // In a real app, this would send the form data to the server
            alert(`Listing ${listing ? 'updated' : 'created'} successfully!`);
            
            // Close modal
            modal.style.display = 'none';
            
            // Reload listings
            loadListings(listingFilter);
        });
    }
    
    // Initialize photo upload
    const uploadBtn = modal.querySelector('.upload-btn');
    const photoInput = document.getElementById('photo-upload');
    
    if (uploadBtn && photoInput) {
        uploadBtn.addEventListener('click', () => {
            photoInput.click();
        });
        
        photoInput.addEventListener('change', () => {
            // In a real app, this would upload the files to the server
            // For demo purposes, we'll just show a message
            alert(`${photoInput.files.length} files selected for upload`);
        });
    }
}

/**
 * Initialize listing modal
 */
function initListingModal() {
    const modal = document.getElementById('listingModal');
    
    if (!modal) return;
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
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

(function wrapDashboardScaffold(){
  const root = document.querySelector('.host-dashboard-container');
  if (root && !root.classList.contains('surface')) {
    root.classList.add('surface');
    const header = root.querySelector('.dashboard-header');
    if (header) header.classList.add('page-header');
    const main = root.querySelector('.dashboard-content');
    if (main && !main.classList.contains('card-body')) main.classList.add('card-body');
  }
})();

// Make initHostDashboard available globally
window.initHostDashboard = initHostDashboard;
