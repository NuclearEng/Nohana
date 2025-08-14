(function() {
    // Listing detail page functionality
    function initListingDetail(listingId) {
        console.log(`Initializing listing detail for: ${listingId}`);
        
        // Get the listing data
        if (!window.ListingsService) {
            console.error('ListingsService not found');
            return;
        }
        
        const listing = window.ListingsService.getListingById(listingId);
    if (!listing) {
        console.error(`Listing not found: ${listingId}`);
        return;
    }
    
        // Set page title
        document.title = `${listing.title} - Nohana`;
        
        // Get the main content container
        let mainContent = document.querySelector('.main-content .container');
        if (!mainContent) {
            // Fallback to #listing-content if router injected listing-detail container
            mainContent = document.getElementById('listing-content');
        }
        if (!mainContent) {
            console.error('Main content container not found');
            return;
        }
        
        // Create listing detail HTML
        const listingDetailHTML = createListingDetailHTML(listing);
        
        // Set the content
        mainContent.innerHTML = listingDetailHTML;
        
        // Initialize image gallery
        initImageGallery();
        
        // Initialize date picker
        initDatePicker();
    
    // Initialize booking form
    initBookingForm(listing);
    
        // Initialize reviews
        initReviews(listing);
        
        // Initialize favorite button
        initFavoriteButton(listing);
        
        // Hide loading overlay
        if (typeof toggleLoadingOverlay === 'function') {
            toggleLoadingOverlay(false);
        }
    }
    
    // ... (existing functions)
    
    function initReviews(listing) {
        const reviewsList = document.getElementById('reviews-list');
        if (!reviewsList) return;
        
        // Get reviews for this listing
        let reviews = [];
        if (window.ReviewsService) {
            reviews = window.ReviewsService.getReviews(listing.id);
        }
        
        // If no reviews, show message
        if (reviews.length === 0) {
            reviewsList.innerHTML = '<p>No reviews yet</p>';
            return;
        }
        
        // Create HTML for each review
        const reviewsHTML = reviews.map(review => {
            // Create stars HTML
            const starsHTML = Array(5).fill().map((_, i) => {
                return `<i class="${i < review.rating ? 'fas' : 'far'} fa-star"></i>`;
            }).join('');
            
            // Create photos HTML if any
            let photosHTML = '';
            if (review.photos && review.photos.length > 0) {
                photosHTML = `
                    <div class="review-photos">
                        ${review.photos.map(photo => `
                            <div class="review-photo">
                                <img src="${photo.data}" alt="${photo.name || 'Review photo'}">
                            </div>
                        `).join('')}
                    </div>
                `;
            }
            
            // Create host response HTML if any
            let hostResponseHTML = '';
            if (review.hostResponse) {
                hostResponseHTML = `
                    <div class="host-response">
                        <div class="host-response-header">
                            <img src="${review.hostResponse.host.avatar}" alt="Host" class="host-response-avatar" onerror="this.onerror=null;this.src='images/host-avatar.jpg'">
                            <div class="host-response-name">${review.hostResponse.host.name}<span class="host-response-title"> (Host)</span></div>
                        </div>
                        <div class="host-response-content">${review.hostResponse.comment}</div>
                    </div>
                `;
            }
            
            // Create review HTML
            return `
                <div class="review-item" data-id="${review.id}">
                    <div class="review-header">
                        <img src="${review.user.avatar}" alt="${review.user.name}" class="review-avatar" onerror="this.onerror=null;this.src='images/user-avatar.jpg'">
                        <div class="review-info">
                            <div class="review-name">${review.user.name}</div>
                            <div class="review-date">${review.user.date}</div>
                        </div>
                    </div>
                    <div class="review-rating">
                        ${starsHTML}
                        <span class="rating-value">${review.rating}.0</span>
                    </div>
                    <div class="review-comment">${review.comment}</div>
                    ${photosHTML}
                    ${hostResponseHTML}
                    ${window.AuthService && window.AuthService.isHost() ? `
                        <div class="host-actions">
                            ${review.hostResponse ? `
                                <button class="edit-response-btn" data-id="${review.id}">
                                    <i class="fas fa-pen"></i> Edit response
                                </button>
                            ` : `
                                <button class="add-response-btn" data-id="${review.id}">
                                    <i class="fas fa-reply"></i> Respond
                                </button>
                            `}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
        
        // Set reviews HTML
        reviewsList.innerHTML = reviewsHTML;
        
        // Add review button
        const reviewsHeader = document.querySelector('.reviews-header');
        const addReviewBtn = document.createElement('button');
        addReviewBtn.className = 'add-review-btn';
        addReviewBtn.innerHTML = '<i class="fas fa-plus"></i> Write a review';
        
        // Check if user can review this listing using BookingVerification
        let canReview = { eligible: false, message: '' };
        if (window.BookingVerification) {
            canReview = window.BookingVerification.canUserReviewListing(listing.id);
        } else {
            // Fallback to old logic if BookingVerification is not available
            canReview = {
                eligible: window.AuthService && window.AuthService.isLoggedIn() && 
                         !(window.ReviewsService && window.ReviewsService.hasUserReviewedListing(listing.id)),
                message: 'You need to be logged in to write a review.'
            };
        }
        
        const userHasReviewed = window.ReviewsService && window.ReviewsService.hasUserReviewedListing(listing.id);
        
        if (canReview.eligible) {
            // User can write a review
            reviewsHeader.appendChild(addReviewBtn);
            
            addReviewBtn.addEventListener('click', () => {
                if (window.ReviewModal) {
                    window.ReviewModal.open('create', {
                        listingId: listing.id,
                        listingTitle: listing.title
                    });
                }
            });
        } else if (userHasReviewed) {
            // User has already reviewed - show edit button instead
            const userReview = window.ReviewsService.getUserReviewForListing(listing.id);
            if (userReview) {
                addReviewBtn.innerHTML = '<i class="fas fa-pen"></i> Edit your review';
                reviewsHeader.appendChild(addReviewBtn);
                
                addReviewBtn.addEventListener('click', () => {
                    if (window.ReviewModal) {
                        window.ReviewModal.open('edit', { review: userReview });
                    }
                });
            }
        } else if (window.AuthService && window.AuthService.isLoggedIn()) {
            // User is logged in but can't review - show message button
            addReviewBtn.innerHTML = '<i class="fas fa-info-circle"></i> Review eligibility';
            reviewsHeader.appendChild(addReviewBtn);
            
            addReviewBtn.addEventListener('click', () => {
                alert(canReview.message);
            });
        }
        
        // Initialize host response buttons
        if (window.AuthService && window.AuthService.isHost()) {
            const addResponseBtns = document.querySelectorAll('.add-response-btn');
            const editResponseBtns = document.querySelectorAll('.edit-response-btn');
            
            addResponseBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const reviewId = btn.getAttribute('data-id');
                    const reviewElement = btn.closest('.review-item');
                    
                    if (window.HostResponseModal) {
                        window.HostResponseModal.open(reviewId, reviewElement);
                    }
                });
            });
            
            editResponseBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const reviewId = btn.getAttribute('data-id');
                    const reviewElement = btn.closest('.review-item');
                    
                    if (window.HostResponseModal) {
                        window.HostResponseModal.open(reviewId, reviewElement, true);
                    }
                });
            });
        }
        
        // Listen for review events
        document.addEventListener('reviewCreated', (event) => {
            if (event.detail.listingId === listing.id) {
                // Reload the page to show the new review
                window.location.reload();
            }
        });
        
        document.addEventListener('reviewUpdated', () => {
            // Reload the page to show the updated review
            window.location.reload();
        });
        
        document.addEventListener('hostResponseUpdated', (event) => {
            const { reviewId, isNew } = event.detail;
            const reviewElement = document.querySelector(`.review-item[data-id="${reviewId}"]`);
            
            if (reviewElement) {
                // Update the host actions buttons
                const hostActions = reviewElement.querySelector('.host-actions');
                if (hostActions) {
                    hostActions.innerHTML = `
                        <button class="edit-response-btn" data-id="${reviewId}">
                            <i class="fas fa-pen"></i> Edit response
                        </button>
                    `;
                    
                    // Re-attach event listener
                    const editResponseBtn = hostActions.querySelector('.edit-response-btn');
                    if (editResponseBtn) {
                        editResponseBtn.addEventListener('click', () => {
                            if (window.HostResponseModal) {
                                window.HostResponseModal.open(reviewId, reviewElement, true);
            }
        });
    }
}
            }
        });
    }
    
    // ... (other existing functions)
    
    // Expose to global scope
    window.initListingDetail = initListingDetail;
})();
