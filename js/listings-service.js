/**
 * Listings Service for WaveSurf
 * Handles listing data management and operations
 */

const ListingsService = (function() {
    // Mock listings data
    const mockListings = [
        {
            id: "listing-1",
            title: "Mastercraft X-Star",
            price: 599,
            priceUnit: "day",
            location: "Lake Travis, Austin, TX",
            rating: 4.9,
            reviewCount: 27,
            description: "Experience the ultimate wakeboarding and wakesurfing adventure with this premium Mastercraft X-Star. Perfect for a day on Lake Travis with family and friends.",
            capacity: 12,
            year: 2022,
            length: 23,
            enginePower: 430,
            activities: ["Wakeboarding", "Wakesurfing", "Cruising"],
            features: ["Bluetooth Sound System", "Tower Speakers", "Ballast System", "Bimini Top", "Swim Platform", "Cooler"],
            rules: ["No smoking", "No pets", "No overnight stays", "Fuel not included"],
            cancellation: "Free cancellation up to 48 hours before your trip starts. After that, 50% refund.",
            host: {
                id: "host1",
                name: "Jane Doe",
                avatar: "images/host-avatar.jpg",
                rating: 4.9,
                responseTime: "within an hour",
                responseRate: 99,
                verified: true,
                superHost: true
            },
            images: [
                "images/listings/boat1-1.jpg",
                "images/listings/boat1-2.jpg",
                "images/listings/boat1-3.jpg",
                "images/listings/boat1-4.jpg"
            ],
            timeSlots: ["9:00 AM", "12:00 PM", "3:00 PM", "6:00 PM"],
            availableSeats: 12,
            availability: {
                // Mock availability data
                booked: [
                    "2023-07-15",
                    "2023-07-16",
                    "2023-07-22",
                    "2023-07-23"
                ]
            }
        },
        {
            id: "listing-2",
            title: "Malibu Wakesetter",
            price: 549,
            priceUnit: "day",
            location: "Lake Austin, TX",
            rating: 4.8,
            reviewCount: 18,
            description: "Enjoy a day of wakesurfing and wakeboarding on this beautiful Malibu Wakesetter. Perfect for water sports enthusiasts.",
            capacity: 10,
            year: 2021,
            length: 22,
            enginePower: 410,
            activities: ["Wakeboarding", "Wakesurfing", "Tubing"],
            features: ["Premium Sound System", "Tower Speakers", "Ballast System", "Bimini Top", "Swim Platform"],
            rules: ["No smoking", "No pets", "No overnight stays", "Fuel not included"],
            cancellation: "Free cancellation up to 48 hours before your trip starts. After that, 50% refund.",
            host: {
                id: "host2",
                name: "Mike Johnson",
                avatar: "images/host-avatar.jpg",
                rating: 4.7,
                responseTime: "within a day",
                responseRate: 95,
                verified: true,
                superHost: false
            },
            images: [
                "images/listings/boat2-1.jpg",
                "images/listings/boat2-2.jpg",
                "images/listings/boat2-3.jpg",
                "images/listings/boat2-4.jpg"
            ],
            timeSlots: ["8:00 AM", "11:00 AM", "2:00 PM", "5:00 PM"],
            availableSeats: 8,
            availability: {
                // Mock availability data
                booked: [
                    "2023-07-18",
                    "2023-07-19",
                    "2023-07-25",
                    "2023-07-26"
                ]
            }
        },
        {
            id: "listing-3",
            title: "Bass Tracker Pro",
            price: 299,
            priceUnit: "day",
            location: "Lake Georgetown, TX",
            rating: 4.7,
            reviewCount: 12,
            description: "Perfect fishing boat for a day on Lake Georgetown. Fully equipped with fish finder, trolling motor, and live well.",
            capacity: 4,
            year: 2020,
            length: 18,
            enginePower: 150,
            activities: ["Fishing", "Cruising"],
            features: ["Fish Finder", "Trolling Motor", "Live Well", "Rod Holders", "Bimini Top"],
            rules: ["No smoking", "Pets allowed", "No overnight stays", "Fuel not included"],
            cancellation: "Free cancellation up to 24 hours before your trip starts. After that, no refund.",
            host: {
                id: "host3",
                name: "Robert Chen",
                avatar: "images/host-avatar.jpg",
                rating: 4.6,
                responseTime: "within a few hours",
                responseRate: 90,
                verified: true,
                superHost: false
            },
            images: [
                "images/listings/boat3-1.jpg",
                "images/listings/boat3-2.jpg",
                "images/listings/boat3-3.jpg",
                "images/listings/boat3-4.jpg"
            ],
            timeSlots: ["7:00 AM", "10:00 AM", "1:00 PM", "4:00 PM"],
            availableSeats: 4,
            availability: {
                // Mock availability data
                booked: [
                    "2023-07-20",
                    "2023-07-21",
                    "2023-07-27",
                    "2023-07-28"
                ]
            }
        }
    ];

    /**
     * Get all listings
     * @returns {Array} Array of listing objects
     */
    function getListings() {
        return [...mockListings];
    }

    /**
     * Get a listing by ID
     * @param {string} id - The listing ID
     * @returns {Object|null} The listing object or null if not found
     */
    function getListingById(id) {
        return mockListings.find(listing => listing.id === id) || null;
    }

    /**
     * Search listings by criteria
     * @param {Object} criteria - Search criteria
     * @returns {Array} Array of matching listing objects
     */
    function searchListings(criteria = {}) {
        let results = [...mockListings];
        
        // Filter by location if provided
        if (criteria.location) {
            const locationLower = criteria.location.toLowerCase();
            results = results.filter(listing => 
                listing.location.toLowerCase().includes(locationLower)
            );
        }
        
        // Filter by activity/category if provided
        if (criteria.category) {
            const categoryLower = criteria.category.toLowerCase();
            results = results.filter(listing => 
                listing.activities.some(activity => 
                    activity.toLowerCase().includes(categoryLower)
                )
            );
        }
        
        // Filter by price range if provided
        if (criteria.minPrice !== undefined) {
            results = results.filter(listing => listing.price >= criteria.minPrice);
        }
        if (criteria.maxPrice !== undefined) {
            results = results.filter(listing => listing.price <= criteria.maxPrice);
        }
        
        // Filter by capacity if provided
        if (criteria.capacity !== undefined) {
            results = results.filter(listing => listing.capacity >= criteria.capacity);
        }
        
        // Filter by date availability if provided
        if (criteria.date) {
            results = results.filter(listing => 
                !listing.availability.booked.includes(criteria.date)
            );
        }
        
        return results;
    }

    /**
     * Get featured listings
     * @param {number} limit - Maximum number of listings to return
     * @returns {Array} Array of featured listing objects
     */
    function getFeaturedListings(limit = 3) {
        // In a real app, this would use criteria like rating, popularity, etc.
        return mockListings.slice(0, limit);
    }

    /**
     * Get listings by host ID
     * @param {string} hostId - The host ID
     * @returns {Array} Array of listing objects owned by the host
     */
    function getListingsByHost(hostId) {
        return mockListings.filter(listing => listing.host.id === hostId);
    }

    // Public API
    return {
        getListings,
        getListingById,
        searchListings,
        getFeaturedListings,
        getListingsByHost
    };
})();

// Expose to global scope
window.ListingsService = ListingsService;
