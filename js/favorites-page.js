/**
 * Favorites Page for WaveSurf
 */

// Sample listing data for demonstration
const listingData = {
    'listing-1': {
        id: 'listing-1',
        title: 'Mastercraft X-Star - Perfect for Wakesurfing',
        location: 'Lake Travis, Texas',
        price: '$45',
        priceUnit: 'seat',
        rating: '4.98',
        reviews: 43,
        availableSeats: 5,
        totalSeats: 8,
        images: ['images/listings/boat1-1.jpg', 'images/listings/boat1-2.jpg', 'images/listings/boat1-3.jpg', 'images/listings/boat1-4.jpg']
    },
    'listing-2': {
        id: 'listing-2',
        title: 'Malibu Wakesetter - Best Wake in Austin',
        location: 'Lake Austin, Texas',
        price: '$55',
        priceUnit: 'seat',
        rating: '4.92',
        reviews: 78,
        availableSeats: 7,
        totalSeats: 10,
        images: ['images/listings/boat2-1.jpg', 'images/listings/boat2-2.jpg', 'images/listings/boat2-3.jpg', 'images/listings/boat2-4.jpg']
    },
    'listing-3': {
        id: 'listing-3',
        title: 'Pro Bass Fishing Boat with Guide',
        location: 'Lake Conroe, Houston',
        price: '$35',
        priceUnit: 'seat',
        rating: '4.89',
        reviews: 56,
        availableSeats: 3,
        totalSeats: 4,
        images: ['images/listings/boat3-1.jpg', 'images/listings/boat3-2.jpg', 'images/listings/boat3-3.jpg', 'images/listings/boat3-4.jpg']
    }
};

function getListingById(listingId) {
    return listingData[listingId] || null;
}

function createListingCard(listing) {
    if (!listing) return '';
    
    // Handle missing images gracefully
    const hasImages = listing.images && listing.images.length > 0;
    const imageContent = hasImages 
        ? `<img src="${listing.images[0]}" alt="${listing.title}">`
        : `<div class="placeholder-image">
             <i class="fas fa-ship"></i>
             <span>${listing.title}</span>
           </div>`;
           
    // Create dots for image slider only if there are multiple images
    const dots = hasImages && listing.images.length > 1 
        ? listing.images.map((_, index) => 
            `<span class="dot${index === 0 ? ' active' : ''}"></span>`
          ).join('')
        : '';
    
    const showSliderControls = hasImages && listing.images.length > 1;
    
    return `
        <div class="listing-card" data-listing-id="${listing.id}">
            <a href="#/listing/${listing.id}" data-route="/listing/${listing.id}" class="listing-link">
                <div class="listing-images">
                    <div class="image-slider">
                        ${imageContent}
                        ${showSliderControls ? `
                            <div class="slider-controls">
                                <button class="prev"><i class="fas fa-chevron-left"></i></button>
                                <button class="next"><i class="fas fa-chevron-right"></i></button>
                            </div>
                        ` : ''}
                        ${dots ? `<div class="slider-dots">${dots}</div>` : ''}
                    </div>
                </div>
                <div class="listing-info">
                    <div class="listing-header">
                        <h3>${listing.title}</h3>
                        <div class="rating">
                            <i class="fas fa-star"></i>
                            <span>${listing.rating || '4.5'}</span>
                            <span class="reviews">(${listing.reviews || 0})</span>
                        </div>
                    </div>
                    <p class="listing-description">📍 ${listing.location}</p>
                    <div class="listing-price">
                        <span class="price">${listing.price || '$45'}</span> / ${listing.priceUnit || 'seat'}
                    </div>
                    <div class="seat-availability">
                        <i class="fas fa-user"></i> <span class="available-seats">${listing.availableSeats || 8}</span> seats available
                    </div>
                    <div class="favorites-actions">
                        <span class="saved-date">💙 Saved 3 days ago</span>
                    </div>
                </div>
            </a>
            <button class="favorite active" aria-label="Remove from favorites" data-listing-id="${listing.id}">
                <i class="fas fa-heart"></i>
            </button>
        </div>
    `;
}

function initFavoritesPage() {
    const favoritesGrid = document.getElementById('favorites-list');
    const noFavorites = document.getElementById('no-favorites');
    const favoritesCount = document.getElementById('favorites-count');
    
    if (!favoritesGrid || !noFavorites) {
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
            mainContent.innerHTML += '<div class="error-message">Error loading favorites. Please refresh the page.</div>';
        }
        console.error('Required elements not found on favorites page');
        // Hide loading overlay
        if (window.toggleLoadingOverlay) {
            window.toggleLoadingOverlay(false);
        }
        return;
    }
    
    // Get favorites from service
    const favorites = window.Favorites ? window.Favorites.getAll() : [];
    
    // Update count if element exists
    if (favoritesCount) {
        favoritesCount.textContent = favorites.length;
    }
    
    if (favorites.length === 0) {
        // Show no favorites message
        noFavorites.classList.remove('hidden');
        favoritesGrid.classList.add('hidden');
    } else {
        // Hide no favorites message
        noFavorites.classList.add('hidden');
        favoritesGrid.classList.remove('hidden');
        
        // Create listing cards for each favorite
        let cardsHTML = '';
        
        favorites.forEach(listingId => {
            const listing = getListingById(listingId);
            if (listing) {
                cardsHTML += createListingCard(listing);
            }
        });
        
        favoritesGrid.innerHTML = cardsHTML;
        
        // Initialize sliders
        initFavoriteSliders();
        
        // Initialize favorite buttons
        initFavoriteButtons();
    }
    
    // Hide loading overlay
    if (window.toggleLoadingOverlay) {
        window.toggleLoadingOverlay(false);
    }
    
    // Initialize browse all button
    const browseAllBtn = document.getElementById('browse-all-btn');
    if (browseAllBtn) {
        browseAllBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.waveRouter.navigate('/');
        });
    }
}

function initFavoriteSliders() {
    const sliders = document.querySelectorAll('.image-slider');
    
    sliders.forEach(slider => {
        const prevButton = slider.querySelector('.prev');
        const nextButton = slider.querySelector('.next');
        const dots = slider.querySelectorAll('.dot');
        const imageContainer = slider.querySelector('img');
        
        let currentIndex = 0;
        const listingId = slider.closest('.listing-card').getAttribute('data-listing-id');
        const listing = getListingById(listingId);
        
        if (!listing) return;
        
        const images = listing.images;
        
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
    });
}

function initFavoriteButtons() {
    const favoriteButtons = document.querySelectorAll('.favorite');
    
    favoriteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const card = button.closest('.listing-card');
            const listingId = card.getAttribute('data-listing-id');
            
            if (window.Favorites) {
                // Remove from favorites
                window.Favorites.remove(listingId);
                
                // Remove card with animation
                card.classList.add('removing');
                setTimeout(() => {
                    card.remove();
                    
                    // Update count
                    const favorites = window.Favorites.getAll();
                    const favoritesCount = document.getElementById('favorites-count');
                    if (favoritesCount) {
                        favoritesCount.textContent = favorites.length;
                    }
                    
                    // Show no favorites message if needed
                    if (favorites.length === 0) {
                        const noFavorites = document.getElementById('no-favorites');
                        const favoritesGrid = document.getElementById('favorites-list'); // Changed from favorites-grid to favorites-list
                        if (noFavorites && favoritesGrid) {
                            noFavorites.classList.remove('hidden');
                            favoritesGrid.classList.add('hidden');
                        }
                    }
                }, 300);
            }
        });
    });
}

// Export the initialization function
window.initFavoritesPage = initFavoritesPage;
