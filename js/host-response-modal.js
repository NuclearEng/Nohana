(function() {
    // Host Response Modal functionality
    const HostResponseModal = {
        modal: null,
        form: null,
        reviewId: null,
        reviewElement: null,
        responseTextarea: null,
        currentResponse: null,
        isEdit: false,
        
        init() {
            // Create modal if it doesn't exist
            if (!document.getElementById('hostResponseModal')) {
                this.createModal();
            }
            
            this.modal = document.getElementById('hostResponseModal');
            this.form = this.modal.querySelector('#host-response-form');
            this.responseTextarea = this.modal.querySelector('#host-response-text');
            
            // Initialize form submission
            this.initFormSubmission();
            
            // Initialize close button
            this.initCloseButton();
        },
        
        createModal() {
            const modalHTML = `
                <div class="modal host-response-modal" id="hostResponseModal">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button class="close-modal"><i class="fas fa-times"></i></button>
                            <h3 id="host-response-title">Respond to Review</h3>
                        </div>
                        <div class="modal-body">
                            <div class="review-preview" id="review-preview"></div>
                            <form id="host-response-form">
                                <input type="hidden" id="review-id" name="review-id">
                                
                                <div class="form-group">
                                    <label for="host-response-text">Your Response</label>
                                    <textarea id="host-response-text" name="response" rows="5" placeholder="Write your response to this review..." required></textarea>
                                    <span class="error-message"></span>
                                </div>
                                
                                <div class="form-actions">
                                    <button type="button" class="btn-secondary cancel-response-btn">Cancel</button>
                                    <button type="submit" class="btn-primary submit-response-btn">Submit Response</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        },
        
        initFormSubmission() {
            if (!this.form) return;
            
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // Validate form
                if (!this.validateForm()) return;
                
                // Get form data
                const responseData = {
                    comment: this.responseTextarea.value
                };
                
                // Submit response
                this.submitResponse(responseData);
            });
            
            // Cancel button
            const cancelButton = this.form.querySelector('.cancel-response-btn');
            if (cancelButton) {
                cancelButton.addEventListener('click', () => {
                    this.close();
                });
            }
        },
        
        validateForm() {
            let isValid = true;
            
            // Check response text
            const responseError = this.responseTextarea.nextElementSibling;
            
            if (!this.responseTextarea.value.trim()) {
                responseError.textContent = 'Please enter your response';
                this.responseTextarea.classList.add('error');
                isValid = false;
            } else {
                responseError.textContent = '';
                this.responseTextarea.classList.remove('error');
            }
            
            return isValid;
        },
        
        submitResponse(responseData) {
            // If we have ReviewsService, use it to submit the response
            if (window.ReviewsService) {
                let success = false;
                
                if (this.isEdit) {
                    // Edit existing response
                    success = window.ReviewsService.editHostResponse(this.reviewId, responseData);
                } else {
                    // Create new response
                    success = window.ReviewsService.addHostResponse(this.reviewId, responseData);
                }
                
                if (success) {
                    this.close();
                    
                    // Update the review element with the new response
                    if (this.reviewElement) {
                        this.updateReviewElement();
                    }
                    
                    // Dispatch event for response update
                    document.dispatchEvent(new CustomEvent('hostResponseUpdated', {
                        detail: {
                            reviewId: this.reviewId,
                            isNew: !this.isEdit
                        }
                    }));
                    
                    alert(this.isEdit ? 'Response updated successfully!' : 'Response submitted successfully!');
                } else {
                    alert('There was an error submitting your response. Please try again.');
                }
            } else {
                console.error('ReviewsService not found');
                alert('There was an error submitting your response. Please try again.');
            }
        },
        
        updateReviewElement() {
            // Get the updated review
            const review = window.ReviewsService.getReviewById(this.reviewId);
            if (!review || !review.hostResponse) return;
            
            // Check if there's already a host response element
            let hostResponseElement = this.reviewElement.querySelector('.host-response');
            
            if (hostResponseElement) {
                // Update existing response
                const contentElement = hostResponseElement.querySelector('.host-response-content');
                if (contentElement) {
                    contentElement.textContent = review.hostResponse.comment;
                }
            } else {
                // Create new response element
                hostResponseElement = document.createElement('div');
                hostResponseElement.className = 'host-response';
                
                const headerElement = document.createElement('div');
                headerElement.className = 'host-response-header';
                
                const avatarElement = document.createElement('img');
                avatarElement.className = 'host-response-avatar';
                avatarElement.src = review.hostResponse.host.avatar;
                avatarElement.alt = 'Host';
                
                const nameElement = document.createElement('div');
                nameElement.className = 'host-response-name';
                nameElement.textContent = review.hostResponse.host.name;
                
                const titleElement = document.createElement('span');
                titleElement.className = 'host-response-title';
                titleElement.textContent = ' (Host)';
                
                const contentElement = document.createElement('div');
                contentElement.className = 'host-response-content';
                contentElement.textContent = review.hostResponse.comment;
                
                // Assemble elements
                nameElement.appendChild(titleElement);
                headerElement.appendChild(avatarElement);
                headerElement.appendChild(nameElement);
                hostResponseElement.appendChild(headerElement);
                hostResponseElement.appendChild(contentElement);
                
                // Add to review element
                this.reviewElement.appendChild(hostResponseElement);
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
        
        open(reviewId, reviewElement, isEdit = false) {
            if (!this.modal) this.init();
            
            this.reviewId = reviewId;
            this.reviewElement = reviewElement;
            this.isEdit = isEdit;
            
            // Reset form
            this.resetForm();
            
            // Get the review
            const review = window.ReviewsService.getReviewById(reviewId);
            if (!review) {
                alert('Review not found');
                return;
            }
            
            // Set review preview
            const previewElement = this.modal.querySelector('#review-preview');
            if (previewElement) {
                previewElement.innerHTML = `
                    <div class="review-header">
                        <img src="${review.user ? review.user.avatar : 'images/user-avatar.jpg'}" alt="User" class="review-avatar">
                        <div class="review-info">
                            <div class="review-name">${review.user ? review.user.name : 'User'}</div>
                            <div class="review-date">${review.user ? review.user.date : review.date}</div>
                        </div>
                    </div>
                    <div class="review-rating">
                        ${Array(5).fill().map((_, i) => `<i class="${i < review.rating ? 'fas' : 'far'} fa-star"></i>`).join('')}
                        <span class="rating-value">${review.rating}.0</span>
                    </div>
                    <div class="review-comment">${review.comment}</div>
                `;
            }
            
            // Set form data for edit mode
            if (isEdit && review.hostResponse) {
                this.currentResponse = review.hostResponse;
                this.responseTextarea.value = review.hostResponse.comment;
                this.modal.querySelector('#host-response-title').textContent = 'Edit Response';
                this.modal.querySelector('.submit-response-btn').textContent = 'Update Response';
            } else {
                this.currentResponse = null;
                this.modal.querySelector('#host-response-title').textContent = 'Respond to Review';
                this.modal.querySelector('.submit-response-btn').textContent = 'Submit Response';
            }
            
            // Set review ID
            this.form.querySelector('#review-id').value = reviewId;
            
            // Show modal
            this.modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        },
        
        close() {
            if (!this.modal) return;
            
            this.modal.style.display = 'none';
            document.body.style.overflow = '';
            this.resetForm();
            
            this.reviewId = null;
            this.reviewElement = null;
            this.currentResponse = null;
            this.isEdit = false;
        },
        
        resetForm() {
            if (!this.form) return;
            
            // Reset form fields
            this.form.reset();
            
            // Reset error messages
            const errorMessages = this.form.querySelectorAll('.error-message');
            errorMessages.forEach(error => {
                error.textContent = '';
            });
            
            // Remove error class
            this.responseTextarea.classList.remove('error');
        }
    };
    
    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        HostResponseModal.init();
    });
    
    // Expose to global scope
    window.HostResponseModal = HostResponseModal;
})();
