/**
 * Search Results Page for WaveSurf
 */

// Sample listing data for demonstration
const allListings = [
    {
        id: 'listing-1',
        title: 'Mastercraft X-Star - Perfect for Wakesurfing',
        location: 'Lake Travis, Texas',
        price: '$45',
        priceUnit: 'seat',
        rating: '4.98',
        reviews: 43,
        availableSeats: 5,
        totalSeats: 8,
        images: ['images/listings/boat1-1.jpg', 'images/listings/boat1-2.jpg', 'images/listings/boat1-3.jpg', 'images/listings/boat1-4.jpg'],
        position: { lat: 30.3884, lng: -97.9462 },
        amenities: ['Captain included', 'Wakesurfing gear', 'Bluetooth audio', 'Cooler'],
        activities: ['wakesurfing', 'wakeboarding']
    },
    {
        id: 'listing-2',
        title: 'Malibu Wakesetter - Best Wake in Austin',
        location: 'Lake Austin, Texas',
        price: '$55',
        priceUnit: 'seat',
        rating: '4.92',
        reviews: 78,
        availableSeats: 7,
        totalSeats: 10,
        images: ['images/listings/boat2-1.jpg', 'images/listings/boat2-2.jpg', 'images/listings/boat2-3.jpg', 'images/listings/boat2-4.jpg'],
        position: { lat: 30.2974, lng: -97.7516 },
        amenities: ['Captain included', 'All equipment', 'Bluetooth audio', 'Bathroom', 'Cooler'],
        activities: ['wakesurfing', 'wakeboarding', 'skiing']
    },
    {
        id: 'listing-3',
        title: 'Pro Bass Fishing Boat with Guide',
        location: 'Lake Conroe, Houston',
        price: '$35',
        priceUnit: 'seat',
        rating: '4.89',
        reviews: 56,
        availableSeats: 3,
        totalSeats: 4,
        images: ['images/listings/boat3-1.jpg', 'images/listings/boat3-2.jpg', 'images/listings/boat3-3.jpg', 'images/listings/boat3-4.jpg'],
        position: { lat: 30.3118, lng: -95.6269 },
        amenities: ['Professional guide', 'Fishing equipment', 'Cooler'],
        activities: ['fishing']
    }
];

function initSearchResults() {
    console.log('Initializing search results');
    
    // Get the query parameters
    const params = new URLSearchParams(window.location.hash.split('?')[1]);
    const activity = params.get('activity');
    
    // Set page title based on activity
    if (activity) {
        document.title = `${capitalizeFirstLetter(activity)} Boats - WaveSurf`;
        
        // Set active category tab
        const categoryTabs = document.querySelectorAll('.category-tab');
        categoryTabs.forEach(tab => {
            const tabActivity = tab.getAttribute('data-route').split('=')[1];
            tab.classList.toggle('active', tabActivity === activity);
        });
    } else {
        document.title = 'Search Results - WaveSurf';
    }
    
    // Filter listings based on activity using ListingsService if available
    let filteredListings = [];
    
    if (window.ListingsService) {
        // Use the ListingsService to get and filter listings
        const criteria = activity ? { category: activity } : {};
        filteredListings = window.ListingsService.searchListings(criteria);
    } else {
        // Fallback to using the local allListings array
        filteredListings = activity 
            ? allListings.filter(listing => listing.activities.includes(activity))
            : allListings;
    }
    
    // Update the map with filtered listings
    updateMap(filteredListings);
    
    // Update the listings with filtered results
    updateListings(filteredListings);
    
    // Initialize favorite buttons
    initFavoriteButtons();
    
    // Hide loading overlay
    toggleLoadingOverlay(false);
}

function updateListings(listings) {
    const listingsContainer = document.querySelector('#search-results');
    
    if (!listingsContainer) {
        console.error('Search results container not found');
        return;
    }
    
    // Update results count
    const resultsCount = document.getElementById('results-count');
    if (resultsCount) {
        resultsCount.textContent = listings.length;
    }
    
    // Clear existing listings
    listingsContainer.innerHTML = '';
    
    if (listings.length === 0) {
        // Show no results message
        listingsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No boats found</h3>
                <p>Try adjusting your search filters or try a different location.</p>
                <button class="btn-primary clear-filters-btn">Clear all filters</button>
            </div>
        `;
        return;
    }
    
    // Create listing cards
    listings.forEach(listing => {
        const card = createListingCard(listing);
        listingsContainer.innerHTML += card;
    });
    
    // Initialize sliders for the new cards
    initSliders();
    initFavoriteButtons();
}

function createListingCard(listing) {
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
    
    // Handle amenities display safely
    const amenitiesText = listing.amenities && listing.amenities.length > 0
        ? `Up to ${listing.totalSeats || 8} guests • ${listing.amenities.slice(0, 2).join(' • ')}`
        : `Up to ${listing.totalSeats || 8} guests • Fully equipped`;
    
    // Format price safely
    const priceDisplay = listing.price 
        ? (listing.price.toString().startsWith('$') ? listing.price : `$${listing.price}`)
        : '$45';
    
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
                    <p class="listing-details">${amenitiesText}</p>
                    <div class="listing-price">
                        <span class="price">${priceDisplay}</span> / ${listing.priceUnit || 'seat'}
                    </div>
                    <div class="seat-availability">
                        <i class="fas fa-user"></i> <span class="available-seats">${listing.availableSeats || 8}</span> seats available
                    </div>
                </div>
            </a>
            <button class="favorite" aria-label="Add to favorites" data-listing-id="${listing.id}">
                <i class="far fa-heart"></i>
            </button>
        </div>
    `;
}

function updateMap(listings) {
    if (!window.google || !window.google.maps) {
        console.warn('Google Maps not loaded yet');
        return;
    }
    
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
        console.warn('Map container not found');
            return;
        }
        
    // Clear existing map
    mapContainer.innerHTML = '';
    
    // Create new map
    const map = new google.maps.Map(mapContainer, {
        center: listings.length > 0 ? listings[0].position : { lat: 30.2672, lng: -97.7431 },
        zoom: 10,
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
        
    // Add markers for each listing
    listings.forEach(listing => {
        // Create info window content
        const content = `
            <div class="map-popup">
                <img src="${listing.images[0]}" alt="${listing.title}">
                <div class="popup-info">
                    <div class="popup-rating">
                        <i class="fas fa-star"></i>
                        <span>${listing.rating}</span>
                        <span class="popup-reviews">(${listing.reviews})</span>
                    </div>
                    <h4>${listing.title}</h4>
                    <div class="popup-price">
                        <span class="price">${listing.price}</span> / ${listing.priceUnit}
                    </div>
                    <div class="popup-seats">
                        <i class="fas fa-user"></i> ${listing.availableSeats} seats available
                    </div>
                </div>
            </div>
        `;
        
        // Create info window
        const infoWindow = new google.maps.InfoWindow({
            content: content,
            maxWidth: 300
        });
        
        // Create marker
        const marker = new google.maps.Marker({
                position: listing.position,
            map: map,
                title: listing.title,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: "#0066ff",
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: "#ffffff",
                }
            });
            
        // Add click event to marker
            marker.addListener('click', () => {
                infoWindow.open({
                    anchor: marker,
                map: map
            });
        });
    });
    
    // Add zoom controls
    const zoomIn = document.querySelector('.zoom-in');
    const zoomOut = document.querySelector('.zoom-out');
    
    if (zoomIn) {
        zoomIn.addEventListener('click', () => {
            map.setZoom(map.getZoom() + 1);
        });
    }
    
    if (zoomOut) {
        zoomOut.addEventListener('click', () => {
            map.setZoom(map.getZoom() - 1);
        });
    }
    
    // Add show list button functionality
    const showListButton = document.querySelector('.show-list');
    if (showListButton) {
        showListButton.addEventListener('click', () => {
            const contentContainer = document.querySelector('.content-container');
            contentContainer.classList.toggle('show-map-only');
            
            // Update button text
            const isMapOnly = contentContainer.classList.contains('show-map-only');
            showListButton.querySelector('span').textContent = isMapOnly ? 'Show list' : 'Show map';
            showListButton.querySelector('i').className = isMapOnly ? 'fas fa-list' : 'fas fa-map-marker-alt';
        });
    }
}

function initSliders() {
    const sliders = document.querySelectorAll('.image-slider');
    
    sliders.forEach(slider => {
        const prevButton = slider.querySelector('.prev');
        const nextButton = slider.querySelector('.next');
        const dots = slider.querySelectorAll('.dot');
        const imageContainer = slider.querySelector('img');
        
        if (!imageContainer) return;
        
        let currentIndex = 0;
        const images = [
            imageContainer.src,
            imageContainer.src.replace('-1.jpg', '-2.jpg'),
            imageContainer.src.replace('-1.jpg', '-3.jpg'),
            imageContainer.src.replace('-1.jpg', '-4.jpg')
        ];
        
        // Update image and dots
        function updateSlider() {
            imageContainer.src = images[currentIndex];
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }
        
        // Next slide
        if (nextButton) {
            nextButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                currentIndex = (currentIndex + 1) % images.length;
                updateSlider();
            });
        }
        
        // Previous slide
        if (prevButton) {
            prevButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                currentIndex = (currentIndex - 1 + images.length) % images.length;
                updateSlider();
            });
        }
        
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
        // Set initial state from Favorites service
        const listingId = button.closest('.listing-card').getAttribute('data-listing-id');
        const icon = button.querySelector('i');
        
        if (window.Favorites && listingId) {
            const isFav = window.Favorites.isFavorite(listingId);
            icon.classList.toggle('fas', isFav);
            icon.classList.toggle('far', !isFav);
            button.classList.toggle('active', isFav);
        }
        
        // Add click handler
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Toggle favorite state with Favorites service
            if (window.Favorites) {
                const nowFav = window.Favorites.toggle(listingId);
                icon.classList.toggle('fas', nowFav);
                icon.classList.toggle('far', !nowFav);
                button.classList.toggle('active', nowFav);
            }
        });
    });
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Export the initialization function
window.initSearchResults = initSearchResults;
