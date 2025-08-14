(function() {
    // Review Modal functionality
    const ReviewModal = {
        modal: null,
        form: null,
        starRating: null,
        ratingInput: null,
        ratingText: null,
        titleElement: null,
        photoInput: null,
        photoPreview: null,
        uploadedPhotos: [],
        maxPhotos: 5,
        
        init() {
            this.modal = document.getElementById('reviewModal');
            if (!this.modal) return;
            
            this.form = this.modal.querySelector('#review-form');
            this.starRating = this.modal.querySelector('.star-rating');
            this.ratingInput = this.modal.querySelector('#review-rating');
            this.ratingText = this.modal.querySelector('.rating-text');
            this.titleElement = this.modal.querySelector('#review-modal-title');
            this.photoInput = this.modal.querySelector('#review-photos');
            this.photoPreview = this.modal.querySelector('#photo-preview');
            
            // Initialize star rating
            this.initStarRating();
            
            // Initialize form submission
            this.initFormSubmission();
            
            // Initialize close button
            this.initCloseButton();
            
            // Initialize photo upload
            this.initPhotoUpload();
        },
        
        initStarRating() {
            if (!this.starRating) return;
            
            const stars = this.starRating.querySelectorAll('i');
            
            stars.forEach(star => {
                star.addEventListener('mouseover', () => {
                    const rating = parseInt(star.getAttribute('data-rating'));
                    this.updateStars(rating, false);
                });
                
                star.addEventListener('click', () => {
                    const rating = parseInt(star.getAttribute('data-rating'));
                    this.ratingInput.value = rating;
                    this.updateStars(rating, true);
                    this.updateRatingText(rating);
                });
            });
            
            this.starRating.addEventListener('mouseout', () => {
                const currentRating = parseInt(this.ratingInput.value) || 0;
                this.updateStars(currentRating, true);
            });
        },
        
        updateStars(rating, permanent = false) {
            const stars = this.starRating.querySelectorAll('i');
            
            stars.forEach(star => {
                const starRating = parseInt(star.getAttribute('data-rating'));
                
                if (starRating <= rating) {
                    star.classList.remove('far');
                    star.classList.add('fas');
                } else {
                    if (permanent) {
                        star.classList.remove('fas');
                        star.classList.add('far');
                    }
                }
            });
        },
        
        updateRatingText(rating) {
            const ratingTexts = [
                'Select a rating',
                'Terrible',
                'Poor',
                'Average',
                'Very Good',
                'Excellent'
            ];
            
            this.ratingText.textContent = rating > 0 ? ratingTexts[rating] : ratingTexts[0];
        },
        
        initFormSubmission() {
            if (!this.form) return;
            
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Validate form
                if (!this.validateForm()) return;
                
                // Get form data
                const formData = {
                    id: this.form.querySelector('#review-id').value || null,
                    listingId: this.form.querySelector('#listing-id').value,
                    listingTitle: this.form.querySelector('#listing-title').value,
                    rating: parseInt(this.ratingInput.value),
                    comment: this.form.querySelector('#review-comment').value,
                    photos: this.uploadedPhotos,
                    date: new Date().toISOString()
                };
                
                // Submit review
                this.submitReview(formData);
            });
            
            // Cancel button
            const cancelButton = this.form.querySelector('.cancel-review-btn');
            if (cancelButton) {
                cancelButton.addEventListener('click', () => {
                    this.close();
                });
            }
        },
        
        validateForm() {
            let isValid = true;
            
            // Check rating
            if (!this.ratingInput.value) {
                this.ratingText.textContent = 'Please select a rating';
                this.ratingText.style.color = 'red';
                isValid = false;
            }
            
            // Check comment
            const commentInput = this.form.querySelector('#review-comment');
            const commentError = commentInput.nextElementSibling;
            
            if (!commentInput.value.trim()) {
                commentError.textContent = 'Please enter your review';
                commentInput.classList.add('error');
                isValid = false;
            } else {
                commentError.textContent = '';
                commentInput.classList.remove('error');
            }
            
            return isValid;
        },
        
        submitReview(formData) {
            // If we have ReviewsService, use it to submit the review
            if (window.ReviewsService) {
                let success = false;
                let reviewId = formData.id;
                
                if (formData.id) {
                    // Edit existing review
                    success = window.ReviewsService.editReview(formData.id, {
                        rating: formData.rating,
                        comment: formData.comment,
                        photos: formData.photos
                    });
                    
                    if (success) {
                        // Dispatch event for review update
                        document.dispatchEvent(new CustomEvent('reviewUpdated', {
                            detail: {
                                review: window.ReviewsService.getReviewById(formData.id)
                            }
                        }));
                    }
                } else {
                    // Create new review
                    reviewId = window.ReviewsService.addReview(formData.listingId, {
                        rating: formData.rating,
                        comment: formData.comment,
                        photos: formData.photos
                    });
                    
                    success = !!reviewId;
                    
                    if (success) {
                        // Dispatch event for review creation
                        document.dispatchEvent(new CustomEvent('reviewCreated', {
                            detail: {
                                review: window.ReviewsService.getReviewById(reviewId),
                                listingId: formData.listingId
                            }
                        }));
                    }
                }
                
                if (success) {
                    this.close();
                    alert(formData.id ? 'Review updated successfully!' : 'Review submitted successfully!');
                } else {
                    alert('There was an error submitting your review. Please try again.');
                }
            } else {
                console.error('ReviewsService not found');
                alert('There was an error submitting your review. Please try again.');
            }
        },
        
        initCloseButton() {
            const closeButton = this.modal.querySelector('.close-modal');
            if (closeButton) {
                closeButton.addEventListener('click', () => {
                    this.close();
                });
            }
        },
        
        initPhotoUpload() {
            if (!this.photoInput || !this.photoPreview) return;
            
            this.photoInput.addEventListener('change', (e) => {
                const files = Array.from(e.target.files);
                
                // Check if adding these files would exceed the limit
                if (this.uploadedPhotos.length + files.length > this.maxPhotos) {
                    alert(`You can only upload up to ${this.maxPhotos} photos.`);
                    return;
                }
                
                // Process each file
                files.forEach(file => {
                    // Check if it's an image
                    if (!file.type.startsWith('image/')) {
                        alert(`File ${file.name} is not an image.`);
                        return;
                    }
                    
                    // Create a preview
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const photoId = Date.now() + Math.random().toString(36).substring(2, 15);
                        
                        // Store the photo data
                        this.uploadedPhotos.push({
                            id: photoId,
                            data: e.target.result,
                            name: file.name
                        });
                        
                        // Create preview element
                        this.createPhotoPreview(photoId, e.target.result);
                    };
                    reader.readAsDataURL(file);
                });
                
                // Reset the input so the same file can be selected again
                this.photoInput.value = '';
            });
        },
        
        createPhotoPreview(id, src) {
            const photoDiv = document.createElement('div');
            photoDiv.className = 'photo-preview';
            photoDiv.dataset.id = id;
            
            const img = document.createElement('img');
            img.src = src;
            img.alt = 'Review photo';
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-photo';
            removeBtn.innerHTML = '<i class="fas fa-times"></i>';
            removeBtn.addEventListener('click', () => {
                // Remove from DOM
                photoDiv.remove();
                
                // Remove from array
                this.uploadedPhotos = this.uploadedPhotos.filter(photo => photo.id !== id);
            });
            
            photoDiv.appendChild(img);
            photoDiv.appendChild(removeBtn);
            this.photoPreview.appendChild(photoDiv);
        },
        
        open(mode = 'create', data = {}) {
            if (!this.modal) this.init();
            
            // Reset form
            this.resetForm();
            
            if (mode === 'edit' && data.review) {
                // Edit mode
                this.titleElement.textContent = 'Edit your review';
                
                // Set form data
                this.form.querySelector('#review-id').value = data.review.id;
                this.form.querySelector('#listing-id').value = data.review.listingId;
                this.form.querySelector('#listing-title').value = data.review.listingTitle || '';
                this.form.querySelector('#review-comment').value = data.review.comment;
                
                // Set rating
                this.ratingInput.value = data.review.rating;
                this.updateStars(data.review.rating, true);
                this.updateRatingText(data.review.rating);
                
                // Set photos if any
                if (data.review.photos && data.review.photos.length > 0) {
                    this.uploadedPhotos = [...data.review.photos];
                    data.review.photos.forEach(photo => {
                        this.createPhotoPreview(photo.id, photo.data);
                    });
                }
            } else {
                // Create mode
                this.titleElement.textContent = 'Write a review';
                
                // Set listing data if provided
                if (data.listingId) {
                    this.form.querySelector('#listing-id').value = data.listingId;
                }
                
                if (data.listingTitle) {
                    this.form.querySelector('#listing-title').value = data.listingTitle;
                }
            }
            
            // Show modal
            this.modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        },
        
        close() {
            if (!this.modal) return;
            
            this.modal.style.display = 'none';
            document.body.style.overflow = '';
            this.resetForm();
        },
        
        resetForm() {
            if (!this.form) return;
            
            // Reset form fields
            this.form.reset();
            
            // Reset hidden inputs
            this.form.querySelector('#review-id').value = '';
            this.form.querySelector('#listing-id').value = '';
            this.form.querySelector('#listing-title').value = '';
            
            // Reset rating
            this.ratingInput.value = '';
            this.updateStars(0, true);
            this.updateRatingText(0);
            
            // Reset error messages
            const errorMessages = this.form.querySelectorAll('.error-message');
            errorMessages.forEach(error => {
                error.textContent = '';
            });
            
            // Reset photo preview
            if (this.photoPreview) {
                this.photoPreview.innerHTML = '';
            }
            
            // Reset uploaded photos array
            this.uploadedPhotos = [];
        }
    };
    
    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        ReviewModal.init();
    });
    
    // Expose to global scope
    window.ReviewModal = ReviewModal;
})();