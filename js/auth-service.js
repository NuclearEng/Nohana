/**
 * Authentication Service for WaveSurf
 * Handles user authentication, registration, and session management
 */

// Mock user data
const mockUsers = [
    {
        id: "user1",
        email: "user@example.com",
        password: "password123", // In a real app, this would be hashed
        name: "John Smith",
        role: "user",
        avatar: "images/user-avatar.jpg",
        memberSince: "January 2023",
        phone: "(555) 123-4567",
        address: "123 Main St, Austin, TX 78701"
    },
    {
        id: "host1",
        email: "host@example.com",
        password: "password123", // In a real app, this would be hashed
        name: "Jane Doe",
        role: "host",
        avatar: "images/host-avatar.jpg",
        memberSince: "March 2022",
        phone: "(555) 987-6543",
        address: "456 Lake Dr, Austin, TX 78703",
        hostSince: "January 2023",
        rating: 4.9,
        reviews: 32
    }
];

// Auth service object
const AuthService = {
    /**
     * Check if a user is logged in
     * @returns {boolean} True if logged in, false otherwise
     */
    isLoggedIn() {
        return localStorage.getItem('auth_token') !== null;
    },

    /**
     * Get the current user data
     * @returns {Object|null} User data or null if not logged in
     */
    getCurrentUser() {
        const token = localStorage.getItem('auth_token');
        if (!token) return null;
        
        try {
            // In a real app, this would decode a JWT token
            // Here we just parse the stored user data
            return JSON.parse(localStorage.getItem('current_user'));
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    },

    /**
     * Check if the current user is a host
     * @returns {boolean} True if the user is a host, false otherwise
     */
    isHost() {
        const user = this.getCurrentUser();
        return user && user.role === 'host';
    },

    /**
     * Login a user
     * @param {string} email User email
     * @param {string} password User password
     * @returns {Object} Result with success flag and message
     */
    login(email, password) {
        // Find user with matching email
        const user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        // Check if user exists and password matches
        if (!user || user.password !== password) {
            return {
                success: false,
                message: "Invalid email or password"
            };
        }
        
        // Create a mock token (in a real app, this would be a JWT)
        const token = btoa(JSON.stringify({ userId: user.id, timestamp: Date.now() }));
        
        // Store token and user data
        localStorage.setItem('auth_token', token);
        localStorage.setItem('current_user', JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            memberSince: user.memberSince,
            // Include host-specific data if user is a host
            ...(user.role === 'host' ? {
                hostSince: user.hostSince,
                rating: user.rating,
                reviews: user.reviews
            } : {})
        }));
        
        return {
            success: true,
            message: "Login successful",
            user: {
                name: user.name,
                role: user.role
            }
        };
    },

    /**
     * Register a new user
     * @param {Object} userData User registration data
     * @returns {Object} Result with success flag and message
     */
    register(userData) {
        // Check if email is already in use
        if (mockUsers.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
            return {
                success: false,
                message: "Email is already in use"
            };
        }
        
        // In a real app, this would create a new user in the database
        // Here we'll actually add the user to our mock users array so they can log in
        const newUser = {
            id: `user${mockUsers.length + 1}`,
            email: userData.email,
            password: userData.password, // In a real app, this would be hashed
            name: userData.name,
            role: "user",
            avatar: "images/user-avatar.jpg",
            memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            phone: "",
            address: ""
        };
        
        // Add the new user to our mock users array
        mockUsers.push(newUser);
        
        return {
            success: true,
            message: "Registration successful. Please log in."
        };
    },

    /**
     * Logout the current user
     */
    logout() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_user');
        
        // Update UI after logout
        setTimeout(() => {
            this.updateUI();
            
            // Reinitialize auth modal handlers
            const loginButton = document.getElementById('login-button');
            const signupButton = document.getElementById('signup-button');
            const authModal = document.getElementById('authModal');
            
            if (loginButton && authModal) {
                loginButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    const loginTab = authModal.querySelector('[data-tab="login"]');
                    if (loginTab) loginTab.click();
                    authModal.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                });
            }
            
            if (signupButton && authModal) {
                signupButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    const signupTab = authModal.querySelector('[data-tab="signup"]');
                    if (signupTab) signupTab.click();
                    authModal.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                });
            }
        }, 100);
    },

    /**
     * Update the user interface based on authentication state
     */
    updateUI() {
        const isLoggedIn = this.isLoggedIn();
        const currentUser = this.getCurrentUser();
        const isHost = this.isHost();
        
        // Update user menu
        const userMenu = document.querySelector('.user-menu .dropdown-menu');
        if (userMenu) {
            if (isLoggedIn && currentUser) {
                // Update dropdown for logged-in user
                userMenu.innerHTML = `
                    <div class="user-info">
                        <img src="${currentUser.avatar}" alt="${currentUser.name}" class="menu-avatar">
                        <div class="user-name">${currentUser.name}</div>
                    </div>
                    <hr>
                    <a href="#/account" data-route="/account">Account</a>
                    <a href="#/bookings" data-route="/bookings">Your bookings</a>
                    <a href="#/favorites" data-route="/favorites">Saved boats</a>
                    <a href="#/messages" data-route="/messages">Messages</a>
                    ${isHost ? '<a href="#/host" data-route="/host">Host Dashboard</a>' : '<a href="#/become-host" data-route="/become-host">Become a Captain</a>'}
                    <hr>
                    <a href="#" id="logout-button">Log out</a>
                    <a href="#">Help</a>
                `;
                
                // Add logout handler
                const logoutButton = document.getElementById('logout-button');
                if (logoutButton) {
                    logoutButton.addEventListener('click', (e) => {
                        e.preventDefault();
                        this.logout();
                        window.location.reload();
                    });
                }
            } else {
                // Default dropdown for logged-out user
                userMenu.innerHTML = `
                    <a href="#" id="login-button">Log in</a>
                    <a href="#" id="signup-button">Sign up</a>
                    <hr>
                    <a href="#/host" data-route="/host">Host your boat</a>
                    <a href="#/bookings" data-route="/bookings">Your bookings</a>
                    <a href="#/favorites" data-route="/favorites">Saved boats</a>
                    <a href="#/account" data-route="/account">Account</a>
                    <a href="#">Help</a>
                `;
                
                // Re-initialize auth modal handlers
                const loginButton = document.getElementById('login-button');
                const signupButton = document.getElementById('signup-button');
                const authModal = document.getElementById('authModal');
                
                if (loginButton && authModal) {
                    loginButton.addEventListener('click', (e) => {
                        e.preventDefault();
                        const loginTab = authModal.querySelector('[data-tab="login"]');
                        if (loginTab) loginTab.click();
                        authModal.style.display = 'flex';
                        document.body.style.overflow = 'hidden';
                    });
                }
                
                if (signupButton && authModal) {
                    signupButton.addEventListener('click', (e) => {
                        e.preventDefault();
                        const signupTab = authModal.querySelector('[data-tab="signup"]');
                        if (signupTab) signupTab.click();
                        authModal.style.display = 'flex';
                        document.body.style.overflow = 'hidden';
                    });
                }
            }
        }
        
        // Update user avatar in the menu
        const userIcon = document.querySelector('.user-menu i.fa-user-circle');
        if (userIcon && isLoggedIn && currentUser) {
            // Replace the icon with user avatar
            const parent = userIcon.parentNode;
            if (parent) {
                userIcon.style.display = 'none';
                
                // Check if avatar already exists
                let avatar = parent.querySelector('.user-avatar-mini');
                if (!avatar) {
                    avatar = document.createElement('img');
                    avatar.className = 'user-avatar-mini';
                    avatar.alt = currentUser.name;
                    parent.appendChild(avatar);
                }
                
                avatar.src = currentUser.avatar;
            }
        } else if (userIcon) {
            // Restore the default icon
            userIcon.style.display = '';
            const avatar = document.querySelector('.user-menu .user-avatar-mini');
            if (avatar) {
                avatar.remove();
            }
        }
    }
};

// Initialize auth service when the page loads
document.addEventListener('DOMContentLoaded', () => {
    AuthService.updateUI();
});

// Export the auth service
window.AuthService = AuthService;
