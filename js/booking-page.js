/**
 * WaveSurf Booking Page Script
 * Handles the booking process from selection to payment
 */

// Store booking data in localStorage for persistence
const BOOKING_STORAGE_KEY = 'wavesurf_current_booking';

// Booking steps
const BOOKING_STEPS = {
    DETAILS: 'details',
    PAYMENT: 'payment',
    CONFIRMATION: 'confirmation'
};

// Initialize the booking page
function initBookingPage(listingId) {
    console.log(`Initializing booking page for listing: ${listingId}`);
    
    // Wait for ListingsService to be available
    const waitForListingsService = () => {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = 10;
            
            const checkService = () => {
                attempts++;
                
                if (window.ListingsService) {
                    resolve();
                } else if (attempts >= maxAttempts) {
                    console.error('ListingsService not available after maximum attempts');
                    reject(new Error('ListingsService not available'));
                } else {
                    setTimeout(checkService, 100);
                }
            };
            
            checkService();
        });
    };
    
    // Check if user is logged in
    if (window.AuthService && !window.AuthService.isLoggedIn()) {
        showLoginRequiredMessage();
        // Hide loading overlay
        if (window.toggleLoadingOverlay) {
            window.toggleLoadingOverlay(false);
        }
        return;
    }
    
    // Wait for ListingsService and then get listing data
    waitForListingsService()
        .then(() => {
            const listing = window.ListingsService.getListingById(listingId);
            
            if (!listing) {
                console.error(`Listing not found: ${listingId}`);
                showErrorMessage('Listing not found. Please try again.');
                // Hide loading overlay
                if (window.toggleLoadingOverlay) {
                    window.toggleLoadingOverlay(false);
                }
                return;
            }
            
            // Continue with booking initialization
            continueBookingInit(listing, listingId);
        })
        .catch(error => {
            console.error('Failed to load ListingsService:', error);
            showErrorMessage('Unable to load booking page. Please try again.');
            if (window.toggleLoadingOverlay) {
                window.toggleLoadingOverlay(false);
            }
        });
}

// Continue booking initialization with listing data
function continueBookingInit(listing, listingId) {
    
    // Template is already loaded by router, proceed with initialization
    
    // Load booking data from storage or create new
    let bookingData = loadBookingData();
    if (!bookingData || bookingData.listingId !== listingId) {
        // Create new booking data
        bookingData = {
            listingId: listingId,
            step: BOOKING_STEPS.DETAILS,
            date: '',
            time: '',
            seats: 1,
            subtotal: 0,
            serviceFee: 0,
            total: 0,
            paymentMethod: null
        };
        saveBookingData(bookingData);
    }
        
    // Initialize the current step
    initBookingStep(bookingData, listing);
    
    // Hide loading overlay
    if (window.toggleLoadingOverlay) {
        window.toggleLoadingOverlay(false);
    }
}

// Initialize the current booking step
function initBookingStep(bookingData, listing) {
    // Update progress indicator
    updateProgressIndicator(bookingData.step);
    
    // Show the appropriate step content
    const stepContainers = document.querySelectorAll('.booking-step-content');
    stepContainers.forEach(container => {
        container.classList.toggle('active', container.dataset.step === bookingData.step);
    });
    
    // Initialize step-specific content
    switch (bookingData.step) {
        case BOOKING_STEPS.DETAILS:
            initDetailsStep(bookingData, listing);
            break;
        case BOOKING_STEPS.PAYMENT:
            initPaymentStep(bookingData, listing);
            break;
        case BOOKING_STEPS.CONFIRMATION:
            initConfirmationStep(bookingData, listing);
            break;
    }
}

// Initialize the details step
function initDetailsStep(bookingData, listing) {
    // Set listing details
    document.getElementById('booking-listing-title').textContent = listing.title;
    document.getElementById('booking-listing-location').textContent = listing.location;
    (function(){
        const imgEl = document.getElementById('booking-listing-image');
        if (imgEl) {
            imgEl.onerror = function(){ this.onerror = null; this.src = 'images/placeholder.svg'; };
            imgEl.src = (listing.images && listing.images[0]) ? listing.images[0] : 'images/placeholder.svg';
            imgEl.alt = listing.title;
        }
    })();
    document.getElementById('booking-price-per-seat').textContent = `$${listing.price}`;
    document.getElementById('booking-available-seats').textContent = listing.availableSeats;
    
    // Initialize date picker
    const dateInput = document.getElementById('booking-date-input');
    if (dateInput && typeof flatpickr === 'function') {
        // Set minimum date to today
        const today = new Date();
        
        const datePicker = flatpickr(dateInput, {
            dateFormat: "Y-m-d",
            minDate: "today",
            disableMobile: true,
            static: true,
            onChange: function(selectedDates) {
                if (selectedDates.length > 0) {
                    bookingData.date = selectedDates[0].toISOString().split('T')[0];
                    saveBookingData(bookingData);
                    updateSummary(bookingData, listing);
                }
            }
        });
        
        // Set initial date if available
        if (bookingData.date) {
            datePicker.setDate(bookingData.date);
        }
    }
    
    // Initialize time slots
    const timeOptions = document.querySelectorAll('.time-option');
    timeOptions.forEach((option, index) => {
        if (index < listing.timeSlots.length) {
            option.textContent = listing.timeSlots[index];
            option.dataset.time = listing.timeSlots[index];
            option.style.display = 'block';
            
            // Set active if matches stored time
            if (bookingData.time === listing.timeSlots[index]) {
                option.classList.add('selected');
            }
            
            // Add click handler
            option.addEventListener('click', () => {
                timeOptions.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                bookingData.time = option.dataset.time;
                saveBookingData(bookingData);
                updateSummary(bookingData, listing);
            });
        } else {
            option.style.display = 'none';
        }
    });
    
    // Initialize seat selector
    const seatCount = document.getElementById('booking-seat-count');
    const decrementBtn = document.querySelector('.seat-decrement');
    const incrementBtn = document.querySelector('.seat-increment');
    
    // Set initial seat count
    seatCount.textContent = bookingData.seats;
    
    // Update buttons state
    function updateSeatButtons() {
        decrementBtn.disabled = bookingData.seats <= 1;
        decrementBtn.classList.toggle('disabled', bookingData.seats <= 1);
        
        incrementBtn.disabled = bookingData.seats >= listing.availableSeats;
        incrementBtn.classList.toggle('disabled', bookingData.seats >= listing.availableSeats);
    }
    
    // Initial update
    updateSeatButtons();
    
    // Decrement button
    decrementBtn.addEventListener('click', () => {
        if (bookingData.seats > 1) {
            bookingData.seats--;
            seatCount.textContent = bookingData.seats;
            updateSeatButtons();
            saveBookingData(bookingData);
            updateSummary(bookingData, listing);
        }
    });
    
    // Increment button
    incrementBtn.addEventListener('click', () => {
        if (bookingData.seats < listing.availableSeats) {
            bookingData.seats++;
            seatCount.textContent = bookingData.seats;
            updateSeatButtons();
            saveBookingData(bookingData);
            updateSummary(bookingData, listing);
        }
    });
    
    // Continue button
    const continueBtn = document.getElementById('booking-continue-btn');
    continueBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Validate inputs
        if (!bookingData.date) {
            alert('Please select a date');
            return;
        }
        
        if (!bookingData.time) {
            alert('Please select a time');
            return;
        }
        
        // Update step and save
        bookingData.step = BOOKING_STEPS.PAYMENT;
        saveBookingData(bookingData);
        
        // Initialize next step
        initBookingStep(bookingData, listing);
    });
    
    // Update summary
    updateSummary(bookingData, listing);
}

// Initialize the payment step
function initPaymentStep(bookingData, listing) {
    // Set booking summary
    document.getElementById('payment-listing-title').textContent = listing.title;
    document.getElementById('payment-listing-location').textContent = listing.location;
    document.getElementById('payment-date').textContent = formatDate(bookingData.date);
    document.getElementById('payment-time').textContent = bookingData.time;
    document.getElementById('payment-seats').textContent = `${bookingData.seats} ${bookingData.seats === 1 ? 'seat' : 'seats'}`;
    document.getElementById('payment-subtotal').textContent = `$${bookingData.subtotal}`;
    document.getElementById('payment-service-fee').textContent = `$${bookingData.serviceFee}`;
    document.getElementById('payment-total').textContent = `$${bookingData.total}`;
    
    // Payment method selection
    const paymentMethods = document.querySelectorAll('.payment-method');
    paymentMethods.forEach(method => {
        // Set active if matches stored method
        if (bookingData.paymentMethod === method.dataset.method) {
            method.classList.add('active');
        }
        
        // Add click handler
        method.addEventListener('click', () => {
            paymentMethods.forEach(m => m.classList.remove('active'));
            method.classList.add('active');
            bookingData.paymentMethod = method.dataset.method;
            saveBookingData(bookingData);
            
            // Show appropriate payment form
            const paymentForms = document.querySelectorAll('.payment-form');
            paymentForms.forEach(form => {
                form.classList.toggle('active', form.dataset.method === method.dataset.method);
            });
        });
    });
    
    // Show appropriate payment form initially
    if (bookingData.paymentMethod) {
        const paymentForms = document.querySelectorAll('.payment-form');
        paymentForms.forEach(form => {
            form.classList.toggle('active', form.dataset.method === bookingData.paymentMethod);
        });
    }
    
    // Back button
    const backBtn = document.getElementById('payment-back-btn');
    backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Update step and save
        bookingData.step = BOOKING_STEPS.DETAILS;
        saveBookingData(bookingData);
        
        // Initialize previous step
        initBookingStep(bookingData, listing);
    });
    
    // Confirm button
    const confirmBtn = document.getElementById('payment-confirm-btn');
    confirmBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Validate payment method
        if (!bookingData.paymentMethod) {
            alert('Please select a payment method');
            return;
        }
        
        // Validate payment form
        const activeForm = document.querySelector('.payment-form.active');
        if (activeForm) {
            const requiredFields = activeForm.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value) {
                    isValid = false;
                    field.classList.add('error');
                } else {
                    field.classList.remove('error');
                }
            });
            
            if (!isValid) {
                alert('Please fill in all required fields');
                return;
            }
        }
        
        // Create booking
        if (window.createBooking) {
            const formData = {
                date: bookingData.date,
                time: bookingData.time,
                seats: bookingData.seats
            };
            
            const bookingId = window.createBooking(listing.id, formData);
            
            if (bookingId) {
                // Clear booking data
                clearBookingData();
                
                // Navigate to confirmation page
                if (window.waveRouter) {
                    window.waveRouter.navigate(`/booking-confirmation/${bookingId}`);
                }
            } else {
                alert('There was an error creating your booking. Please try again.');
            }
        } else {
            alert('Booking service not available. Please try again later.');
        }
    });
}

// Update booking summary
function updateSummary(bookingData, listing) {
    // Calculate pricing
    const subtotal = bookingData.seats * listing.price;
    const serviceFee = Math.round(subtotal * 0.15); // 15% service fee
    const total = subtotal + serviceFee;
    
    // Update booking data
    bookingData.subtotal = subtotal;
    bookingData.serviceFee = serviceFee;
    bookingData.total = total;
    saveBookingData(bookingData);
    
    // Update UI
    document.getElementById('booking-subtotal').textContent = `$${subtotal}`;
    document.getElementById('booking-service-fee').textContent = `$${serviceFee}`;
    document.getElementById('booking-total').textContent = `$${total}`;
    document.getElementById('booking-seat-summary').textContent = bookingData.seats;
}

// Update progress indicator
function updateProgressIndicator(step) {
    const steps = document.querySelectorAll('.booking-progress-step');
    steps.forEach(stepEl => {
        const isActive = stepEl.dataset.step === step;
        const isCompleted = getStepIndex(stepEl.dataset.step) < getStepIndex(step);
        
        stepEl.classList.toggle('active', isActive);
        stepEl.classList.toggle('completed', isCompleted);
    });
}

// Get step index for comparison
function getStepIndex(step) {
    const steps = [BOOKING_STEPS.DETAILS, BOOKING_STEPS.PAYMENT, BOOKING_STEPS.CONFIRMATION];
    return steps.indexOf(step);
}

// Format date for display
function formatDate(dateStr) {
    try {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return dateStr;
    }
}

// Show login required message
function showLoginRequiredMessage() {
    const mainContent = document.querySelector('.main-content .container');
    if (!mainContent) return;
    
    mainContent.innerHTML = `
        <div class="login-required-message">
            <i class="fas fa-lock"></i>
            <h2>Login Required</h2>
            <p>Please log in or sign up to book this boat.</p>
            <button id="login-prompt-btn" class="btn-primary">Log in</button>
        </div>
    `;
    
    // Add login button handler
    const loginBtn = document.getElementById('login-prompt-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            // Show login modal
            const authModal = document.getElementById('authModal');
            if (authModal) {
                const loginTab = authModal.querySelector('[data-tab="login"]');
                if (loginTab) loginTab.click();
                authModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    }
}

// Show error message
function showErrorMessage(message) {
    const mainContent = document.querySelector('.main-content .container');
    if (!mainContent) return;
    
    mainContent.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <h2>Error</h2>
            <p>${message}</p>
            <a href="#/" data-route="/" class="btn-primary">Return to Home</a>
        </div>
    `;
}

// Load booking data from storage
function loadBookingData() {
    try {
        const data = localStorage.getItem(BOOKING_STORAGE_KEY);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error loading booking data:', error);
        return null;
    }
}

// Save booking data to storage
function saveBookingData(data) {
    try {
        localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving booking data:', error);
    }
}

// Clear booking data from storage
function clearBookingData() {
    try {
        localStorage.removeItem(BOOKING_STORAGE_KEY);
    } catch (error) {
        console.error('Error clearing booking data:', error);
    }
}

// Make function available globally
window.initBookingPage = initBookingPage;
