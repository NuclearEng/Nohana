/**
 * Reviews Service for WaveSurf
 * Manages boat listing reviews
 */

(function() {
    // Sample reviews data
    const reviewsData = {
        'listing-1': [
            {
                id: 'review-1-1',
                user: {
                    name: 'Sarah M.',
                    avatar: 'images/reviews/avatar1.jpg',
                    date: 'July 2023'
                },
                rating: 5,
                comment: 'Amazing experience! The boat was perfect for wakesurfing and the captain was super helpful with teaching beginners.',
                photos: [
                    { id: 'photo-1', data: 'images/reviews/avatar1.jpg', name: 'Wakesurfing' }
                ],
                hostResponse: {
                    id: 'response-1',
                    host: {
                        name: 'John D.',
                        avatar: 'images/host-avatar.jpg',
                        date: 'July 2023'
                    },
                    comment: 'Thank you for your wonderful review, Sarah! We\'re so glad you enjoyed the wakesurfing experience. Hope to have you aboard again soon!'
                }
            },
            {
                id: 'review-1-2',
                user: {
                    name: 'Michael T.',
                    avatar: 'images/reviews/avatar2.jpg',
                    date: 'June 2023'
                },
                rating: 5,
                comment: 'Had a fantastic day on the water. The boat was clean, well-maintained, and the sound system was awesome.',
                photos: [
                    { id: 'photo-2', data: 'images/reviews/avatar2.jpg', name: 'On the boat' },
                    { id: 'photo-3', data: 'images/reviews/avatar3.jpg', name: 'Lake view' }
                ]
            },
            {
                id: 'review-1-3',
                user: {
                    name: 'Jessica R.',
                    avatar: 'images/reviews/avatar3.jpg',
                    date: 'May 2023'
                },
                rating: 4,
                comment: 'Great boat and captain! The only reason for 4 stars is that we ran out of ice for the cooler.',
                photos: [],
                hostResponse: {
                    id: 'response-3',
                    host: {
                        name: 'John D.',
                        avatar: 'images/host-avatar.jpg',
                        date: 'May 2023'
                    },
                    comment: 'Thanks for your feedback, Jessica. I apologize about the ice situation. We\'ve now added an extra cooler with ice on board to make sure this doesn\'t happen again. Hope to see you back for another trip!'
                }
            }
        ],
        'listing-2': [
            {
                id: 'review-2-1',
                user: {
                    name: 'David L.',
                    avatar: 'images/reviews/avatar4.jpg',
                    date: 'July 2023'
                },
                rating: 5,
                comment: 'The wake on this boat is incredible! Perfect for advanced wakeboarding. Captain was knowledgeable and friendly.',
                photos: [
                    { id: 'photo-4', data: 'images/reviews/avatar4.jpg', name: 'Wakeboarding' }
                ],
                hostResponse: {
                    id: 'response-4',
                    host: {
                        name: 'Mike S.',
                        avatar: 'images/host-avatar2.jpg',
                        date: 'July 2023'
                    },
                    comment: 'Thanks for the great review, David! I\'m glad you enjoyed the wake. Looking forward to having you back for more advanced wakeboarding sessions!'
                }
            },
            {
                id: 'review-2-2',
                user: {
                    name: 'Amanda P.',
                    avatar: 'images/reviews/avatar5.jpg',
                    date: 'June 2023'
                },
                rating: 5,
                comment: 'We had an amazing day on Lake Austin. The boat was spacious and comfortable for our group of 8.',
                photos: []
            }
        ],
        'listing-3': [
            {
                id: 'review-3-1',
                user: {
                    name: 'Robert J.',
                    avatar: 'images/reviews/avatar6.jpg',
                    date: 'July 2023'
                },
                rating: 5,
                comment: 'Best fishing guide in the area! We caught several bass and had a great time. All equipment was provided and in excellent condition.',
                photos: [
                    { id: 'photo-6', data: 'images/reviews/avatar6.jpg', name: 'Big catch' }
                ],
                hostResponse: {
                    id: 'response-6',
                    host: {
                        name: 'Lisa T.',
                        avatar: 'images/host-avatar.jpg',
                        date: 'July 2023'
                    },
                    comment: 'Thank you for your review, Robert! I\'m glad you had a successful fishing trip. That bass was impressive! Hope to see you again soon for another adventure.'
                }
            }
        ]
    };

    // User reviews - reviews created by the current user
    const userReviews = [
        {
            id: 'review-1',
            listingId: 'listing-1',
            title: 'Mastercraft X-Star - Perfect for Wakesurfing',
            date: '2023-06-01',
            rating: 5,
            comment: 'Amazing experience! The boat was clean and well-maintained, and the captain was very friendly and knowledgeable. Will definitely book again!',
            photos: [
                { id: 'photo-7', data: 'images/reviews/avatar1.jpg', name: 'Wakesurfing' },
                { id: 'photo-8', data: 'images/reviews/avatar2.jpg', name: 'Boat view' }
            ],
            hostResponse: {
                id: 'response-7',
                host: {
                    name: 'John D.',
                    avatar: 'images/host-avatar.jpg',
                    date: 'June 2023'
                },
                comment: 'Thank you for your amazing review! We\'re so glad you enjoyed wakesurfing with us. Looking forward to having you back on the water soon!'
            }
        },
        {
            id: 'review-2',
            listingId: 'listing-3',
            title: 'Pro Bass Fishing Boat with Guide',
            date: '2023-05-15',
            rating: 4,
            comment: 'Great fishing trip! The guide was very helpful and knew exactly where to find the fish. The only downside was the weather, but that\'s not their fault.',
            photos: []
        }
    ];

    // Reviews service object
    const ReviewsService = {
        // Get all reviews for a listing
        getReviews(listingId) {
            return reviewsData[listingId] || [];
        },
        
        // Get average rating for a listing
        getAverageRating(listingId) {
            const reviews = this.getReviews(listingId);
            if (reviews.length === 0) return 0;
            
            const sum = reviews.reduce((total, review) => total + review.rating, 0);
            return (sum / reviews.length).toFixed(2);
        },
        
        // Get review count for a listing
        getReviewCount(listingId) {
            return this.getReviews(listingId).length;
        },
        
        // Add a new review
        addReview(listingId, reviewData) {
            if (!reviewsData[listingId]) {
                reviewsData[listingId] = [];
            }
            
            const newReview = {
                id: `review-${listingId}-${Date.now()}`,
                user: {
                    name: reviewData.userName || (window.AuthService ? window.AuthService.getCurrentUser().name : 'Anonymous'),
                    avatar: reviewData.userAvatar || 'images/user-avatar.jpg',
                    date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                },
                rating: reviewData.rating,
                comment: reviewData.comment,
                photos: reviewData.photos || []
            };
            
            reviewsData[listingId].unshift(newReview);
            
            // Also add to user reviews
            const userReview = {
                id: newReview.id,
                listingId: listingId,
                title: reviewData.listingTitle || `Listing ${listingId}`,
                date: new Date().toISOString().split('T')[0],
                rating: reviewData.rating,
                comment: reviewData.comment,
                photos: reviewData.photos || []
            };
            
            userReviews.unshift(userReview);
            
            return newReview;
        },
        
        // Edit an existing review
        editReview(reviewId, reviewData) {
            // Find the review in user reviews
            const userReviewIndex = userReviews.findIndex(review => review.id === reviewId);
            
            if (userReviewIndex !== -1) {
                const userReview = userReviews[userReviewIndex];
                const listingId = userReview.listingId;
                
                // Update user review
                userReviews[userReviewIndex] = {
                    ...userReview,
                    rating: reviewData.rating || userReview.rating,
                    comment: reviewData.comment || userReview.comment,
                    photos: reviewData.photos || userReview.photos || [],
                    date: new Date().toISOString().split('T')[0] // Update date to today
                };
                
                // Also update in listing reviews if it exists there
                if (reviewsData[listingId]) {
                    const listingReviewIndex = reviewsData[listingId].findIndex(review => review.id === reviewId);
                    
                    if (listingReviewIndex !== -1) {
                        const listingReview = reviewsData[listingId][listingReviewIndex];
                        
                        reviewsData[listingId][listingReviewIndex] = {
                            ...listingReview,
                            rating: reviewData.rating || listingReview.rating,
                            comment: reviewData.comment || listingReview.comment,
                            photos: reviewData.photos || listingReview.photos || [],
                            user: {
                                ...listingReview.user,
                                date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                            }
                        };
                    }
                }
                
                return userReviews[userReviewIndex];
            }
            
            return null;
        },
        
        // Delete a review
        deleteReview(reviewId) {
            // Find the review in user reviews
            const userReviewIndex = userReviews.findIndex(review => review.id === reviewId);
            
            if (userReviewIndex !== -1) {
                const userReview = userReviews[userReviewIndex];
                const listingId = userReview.listingId;
                
                // Remove from user reviews
                userReviews.splice(userReviewIndex, 1);
                
                // Also remove from listing reviews if it exists there
                if (reviewsData[listingId]) {
                    const listingReviewIndex = reviewsData[listingId].findIndex(review => review.id === reviewId);
                    
                    if (listingReviewIndex !== -1) {
                        reviewsData[listingId].splice(listingReviewIndex, 1);
                    }
                }
                
                return true;
            }
            
            return false;
        },
        
        // Get a specific review by ID
        getReviewById(reviewId) {
            // First check user reviews
            const userReview = userReviews.find(review => review.id === reviewId);
            if (userReview) return userReview;
            
            // If not found, check all listing reviews
            for (const listingId in reviewsData) {
                const review = reviewsData[listingId].find(review => review.id === reviewId);
                if (review) return review;
            }
            
            return null;
        },
        
        // Get all reviews by the current user
        getUserReviews() {
            return userReviews;
        },
        
        // Check if the current user has reviewed a listing
        hasUserReviewedListing(listingId) {
            return userReviews.some(review => review.listingId === listingId);
        },
        
        // Get the current user's review for a listing
        getUserReviewForListing(listingId) {
            return userReviews.find(review => review.listingId === listingId);
        },
        
        // Add host response to a review
        addHostResponse(reviewId, responseData) {
            // Find the review in all listings
            for (const listingId in reviewsData) {
                const reviewIndex = reviewsData[listingId].findIndex(review => review.id === reviewId);
                if (reviewIndex !== -1) {
                    // Add host response
                    reviewsData[listingId][reviewIndex].hostResponse = {
                        id: 'response-' + Date.now(),
                        host: {
                            name: window.AuthService ? window.AuthService.getCurrentUser().name : 'Host',
                            avatar: 'images/host-avatar.jpg',
                            date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                        },
                        comment: responseData.comment
                    };
                    return true;
                }
            }
            
            // Check user reviews
            const userReviewIndex = userReviews.findIndex(review => review.id === reviewId);
            if (userReviewIndex !== -1) {
                userReviews[userReviewIndex].hostResponse = {
                    id: 'response-' + Date.now(),
                    host: {
                        name: window.AuthService ? window.AuthService.getCurrentUser().name : 'Host',
                        avatar: 'images/host-avatar.jpg',
                        date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                    },
                    comment: responseData.comment
                };
                return true;
            }
            
            return false;
        },
        
        // Edit host response
        editHostResponse(reviewId, responseData) {
            // Find the review in all listings
            for (const listingId in reviewsData) {
                const reviewIndex = reviewsData[listingId].findIndex(review => review.id === reviewId);
                if (reviewIndex !== -1 && reviewsData[listingId][reviewIndex].hostResponse) {
                    // Update host response
                    reviewsData[listingId][reviewIndex].hostResponse.comment = responseData.comment;
                    reviewsData[listingId][reviewIndex].hostResponse.host.date = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                    return true;
                }
            }
            
            // Check user reviews
            const userReviewIndex = userReviews.findIndex(review => review.id === reviewId);
            if (userReviewIndex !== -1 && userReviews[userReviewIndex].hostResponse) {
                userReviews[userReviewIndex].hostResponse.comment = responseData.comment;
                userReviews[userReviewIndex].hostResponse.host.date = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                return true;
            }
            
            return false;
        },
        
        // Delete host response
        deleteHostResponse(reviewId) {
            // Find the review in all listings
            for (const listingId in reviewsData) {
                const reviewIndex = reviewsData[listingId].findIndex(review => review.id === reviewId);
                if (reviewIndex !== -1 && reviewsData[listingId][reviewIndex].hostResponse) {
                    // Delete host response
                    delete reviewsData[listingId][reviewIndex].hostResponse;
                    return true;
                }
            }
            
            // Check user reviews
            const userReviewIndex = userReviews.findIndex(review => review.id === reviewId);
            if (userReviewIndex !== -1 && userReviews[userReviewIndex].hostResponse) {
                delete userReviews[userReviewIndex].hostResponse;
                return true;
            }
            
            return false;
        }
    };
    
    // Expose the service globally
    window.ReviewsService = ReviewsService;
})();
