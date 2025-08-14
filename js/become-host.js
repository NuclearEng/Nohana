/**
 * WaveSurf Become a Captain Page
 * Handles the become a captain page functionality
 */

(function() {
    /**
     * Initialize the become a captain page
     */
    function initBecomeHostPage() {
        console.log('Initializing become a captain page');
        
        // Hide loading overlay
        if (typeof toggleLoadingOverlay === 'function') {
            toggleLoadingOverlay(false);
        }
        
        // Initialize FAQ accordions
        initFaqAccordions();
        
        // Initialize CTA buttons
        initCtaButtons();
    }
    
    /**
     * Initialize FAQ accordions
     */
    function initFaqAccordions() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', () => {
                // Toggle active class on the clicked item
                item.classList.toggle('active');
                
                // Close other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
            });
        });
    }
    
    /**
     * Initialize CTA buttons
     */
    function initCtaButtons() {
        const startHostingBtn = document.getElementById('start-hosting-btn');
        const becomeHostCtaBtn = document.getElementById('become-host-cta-btn');
        
        if (startHostingBtn) {
            startHostingBtn.addEventListener('click', handleBecomeHost);
        }
        
        if (becomeHostCtaBtn) {
            becomeHostCtaBtn.addEventListener('click', handleBecomeHost);
        }
    }
    
    /**
     * Handle become a captain button click
     */
    function handleBecomeHost() {
        // Check if user is logged in
        if (window.AuthService && !window.AuthService.isLoggedIn()) {
            // Show login modal
            const authModal = document.getElementById('authModal');
            if (authModal) {
                const loginTab = authModal.querySelector('[data-tab="login"]');
                if (loginTab) loginTab.click();
                authModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
                
                // Add message to login modal
                const modalMessage = document.createElement('div');
                modalMessage.className = 'auth-modal-message';
                modalMessage.textContent = 'Log in or sign up to become a captain';
                
                const modalHeader = authModal.querySelector('.modal-header');
                if (modalHeader && !modalHeader.querySelector('.auth-modal-message')) {
                    modalHeader.appendChild(modalMessage);
                }
            }
            return;
        }
        
        // For demo purposes, show a modal or alert
        alert('Thank you for your interest in becoming a host! This feature is coming soon. In a real app, this would start the host onboarding process.');
    }
    
    // Make functions available globally
    window.initBecomeHostPage = initBecomeHostPage;
})();
