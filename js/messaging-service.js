/**
 * Messaging Service for WaveSurf
 * Handles messaging between guests and hosts
 */
(function() {
    // Mock conversation data
    const conversations = {
        'user-1': {
            'host-1': {
                id: 'conv-1',
                messages: [
                    {
                        id: 'msg-1',
                        sender: 'user-1',
                        receiver: 'host-1',
                        content: 'Hi, I\'m interested in booking your boat for wakesurfing. Do you provide any lessons for beginners?',
                        timestamp: '2023-08-10T14:30:00Z',
                        read: true
                    },
                    {
                        id: 'msg-2',
                        sender: 'host-1',
                        receiver: 'user-1',
                        content: 'Hello! Yes, I offer beginner lessons at no extra charge. I have all the equipment you\'ll need and can teach you the basics in about 30 minutes.',
                        timestamp: '2023-08-10T15:15:00Z',
                        read: true
                    },
                    {
                        id: 'msg-3',
                        sender: 'user-1',
                        receiver: 'host-1',
                        content: 'That sounds perfect! I\'ll book for next Saturday then. Thanks!',
                        timestamp: '2023-08-10T15:45:00Z',
                        read: true
                    },
                    {
                        id: 'msg-4',
                        sender: 'host-1',
                        receiver: 'user-1',
                        content: 'Great! Looking forward to it. Let me know if you have any other questions.',
                        timestamp: '2023-08-10T16:00:00Z',
                        read: false
                    }
                ],
                lastUpdated: '2023-08-10T16:00:00Z',
                unreadCount: 1
            },
            'host-3': {
                id: 'conv-2',
                messages: [
                    {
                        id: 'msg-5',
                        sender: 'user-1',
                        receiver: 'host-3',
                        content: 'Hi, I\'m looking to book a fishing trip for 4 people. Do you provide fishing equipment?',
                        timestamp: '2023-08-05T10:00:00Z',
                        read: true
                    },
                    {
                        id: 'msg-6',
                        sender: 'host-3',
                        receiver: 'user-1',
                        content: 'Hello! Yes, I provide all fishing equipment including rods, reels, tackle, and bait. You don\'t need to bring anything except sunscreen and a hat!',
                        timestamp: '2023-08-05T10:30:00Z',
                        read: true
                    }
                ],
                lastUpdated: '2023-08-05T10:30:00Z',
                unreadCount: 0
            }
        },
        'host-1': {
            'user-1': {
                id: 'conv-1',
                messages: [
                    {
                        id: 'msg-1',
                        sender: 'user-1',
                        receiver: 'host-1',
                        content: 'Hi, I\'m interested in booking your boat for wakesurfing. Do you provide any lessons for beginners?',
                        timestamp: '2023-08-10T14:30:00Z',
                        read: true
                    },
                    {
                        id: 'msg-2',
                        sender: 'host-1',
                        receiver: 'user-1',
                        content: 'Hello! Yes, I offer beginner lessons at no extra charge. I have all the equipment you\'ll need and can teach you the basics in about 30 minutes.',
                        timestamp: '2023-08-10T15:15:00Z',
                        read: true
                    },
                    {
                        id: 'msg-3',
                        sender: 'user-1',
                        receiver: 'host-1',
                        content: 'That sounds perfect! I\'ll book for next Saturday then. Thanks!',
                        timestamp: '2023-08-10T15:45:00Z',
                        read: true
                    },
                    {
                        id: 'msg-4',
                        sender: 'host-1',
                        receiver: 'user-1',
                        content: 'Great! Looking forward to it. Let me know if you have any other questions.',
                        timestamp: '2023-08-10T16:00:00Z',
                        read: true
                    }
                ],
                lastUpdated: '2023-08-10T16:00:00Z',
                unreadCount: 0
            }
        },
        'host-3': {
            'user-1': {
                id: 'conv-2',
                messages: [
                    {
                        id: 'msg-5',
                        sender: 'user-1',
                        receiver: 'host-3',
                        content: 'Hi, I\'m looking to book a fishing trip for 4 people. Do you provide fishing equipment?',
                        timestamp: '2023-08-05T10:00:00Z',
                        read: true
                    },
                    {
                        id: 'msg-6',
                        sender: 'host-3',
                        receiver: 'user-1',
                        content: 'Hello! Yes, I provide all fishing equipment including rods, reels, tackle, and bait. You don\'t need to bring anything except sunscreen and a hat!',
                        timestamp: '2023-08-05T10:30:00Z',
                        read: true
                    }
                ],
                lastUpdated: '2023-08-05T10:30:00Z',
                unreadCount: 0
            }
        }
    };
    
    // Mock user and host data
    const users = {
        'user-1': {
            id: 'user-1',
            name: 'John Doe',
            avatar: 'images/user-avatar.jpg'
        },
        'host-1': {
            id: 'host-1',
            name: 'John D.',
            avatar: 'images/host-avatar.jpg'
        },
        'host-3': {
            id: 'host-3',
            name: 'Lisa T.',
            avatar: 'images/host-avatar.jpg'
        }
    };
    
    // Messaging service
    const MessagingService = {
        /**
         * Get all conversations for the current user
         * @returns {Array} Array of conversations
         */
        getConversations() {
            // Check if user is logged in
            if (!window.AuthService || !window.AuthService.isLoggedIn()) {
                return [];
            }
            
            // Get current user
            const currentUser = window.AuthService.getCurrentUser();
            if (!currentUser) return [];
            
            // Get conversations for this user
            const userConversations = conversations[currentUser.id] || {};
            
            // Convert to array and add user info
            return Object.keys(userConversations).map(userId => {
                const conversation = userConversations[userId];
                const otherUser = users[userId];
                
                return {
                    id: conversation.id,
                    user: otherUser,
                    lastMessage: conversation.messages[conversation.messages.length - 1],
                    lastUpdated: conversation.lastUpdated,
                    unreadCount: conversation.unreadCount
                };
            }).sort((a, b) => {
                // Sort by last updated timestamp (newest first)
                return new Date(b.lastUpdated) - new Date(a.lastUpdated);
            });
        },
        
        /**
         * Get messages for a specific conversation
         * @param {string} userId - ID of the other user in the conversation
         * @returns {Array} Array of messages
         */
        getMessages(userId) {
            // Check if user is logged in
            if (!window.AuthService || !window.AuthService.isLoggedIn()) {
                return [];
            }
            
            // Get current user
            const currentUser = window.AuthService.getCurrentUser();
            if (!currentUser) return [];
            
            // Get conversation
            const userConversations = conversations[currentUser.id] || {};
            const conversation = userConversations[userId];
            
            if (!conversation) return [];
            
            // Mark messages as read
            conversation.messages.forEach(message => {
                if (message.receiver === currentUser.id && !message.read) {
                    message.read = true;
                }
            });
            
            // Update unread count
            conversation.unreadCount = 0;
            
            // Also update the other user's view of the conversation
            if (conversations[userId] && conversations[userId][currentUser.id]) {
                const otherConversation = conversations[userId][currentUser.id];
                otherConversation.messages.forEach(message => {
                    if (message.sender === currentUser.id) {
                        message.read = true;
                    }
                });
            }
            
            return conversation.messages;
        },
        
        /**
         * Send a message to another user
         * @param {string} receiverId - ID of the receiver
         * @param {string} content - Message content
         * @returns {Object} The sent message
         */
        sendMessage(receiverId, content) {
            // Check if user is logged in
            if (!window.AuthService || !window.AuthService.isLoggedIn()) {
                return null;
            }
            
            // Get current user
            const currentUser = window.AuthService.getCurrentUser();
            if (!currentUser) return null;
            
            // Create message
            const message = {
                id: `msg-${Date.now()}`,
                sender: currentUser.id,
                receiver: receiverId,
                content: content,
                timestamp: new Date().toISOString(),
                read: false
            };
            
            // Get or create conversation for current user
            if (!conversations[currentUser.id]) {
                conversations[currentUser.id] = {};
            }
            
            if (!conversations[currentUser.id][receiverId]) {
                conversations[currentUser.id][receiverId] = {
                    id: `conv-${Date.now()}`,
                    messages: [],
                    lastUpdated: message.timestamp,
                    unreadCount: 0
                };
            }
            
            // Add message to conversation
            conversations[currentUser.id][receiverId].messages.push(message);
            conversations[currentUser.id][receiverId].lastUpdated = message.timestamp;
            
            // Get or create conversation for receiver
            if (!conversations[receiverId]) {
                conversations[receiverId] = {};
            }
            
            if (!conversations[receiverId][currentUser.id]) {
                conversations[receiverId][currentUser.id] = {
                    id: conversations[currentUser.id][receiverId].id,
                    messages: [],
                    lastUpdated: message.timestamp,
                    unreadCount: 1
                };
            } else {
                conversations[receiverId][currentUser.id].unreadCount++;
                conversations[receiverId][currentUser.id].lastUpdated = message.timestamp;
            }
            
            // Add message to receiver's conversation
            conversations[receiverId][currentUser.id].messages.push(message);
            
            return message;
        },
        
        /**
         * Get total unread message count for the current user
         * @returns {number} Total unread count
         */
        getUnreadCount() {
            // Check if user is logged in
            if (!window.AuthService || !window.AuthService.isLoggedIn()) {
                return 0;
            }
            
            // Get current user
            const currentUser = window.AuthService.getCurrentUser();
            if (!currentUser) return 0;
            
            // Get conversations for this user
            const userConversations = conversations[currentUser.id] || {};
            
            // Sum up unread counts
            return Object.values(userConversations).reduce((total, conversation) => {
                return total + (conversation.unreadCount || 0);
            }, 0);
        },
        
        /**
         * Start a new conversation with a user
         * @param {string} userId - ID of the user to start a conversation with
         * @param {string} initialMessage - Initial message content
         * @returns {Object} The sent message
         */
        startConversation(userId, initialMessage) {
            return this.sendMessage(userId, initialMessage);
        },
        
        /**
         * Get user info by ID
         * @param {string} userId - User ID
         * @returns {Object} User info
         */
        getUserInfo(userId) {
            return users[userId] || null;
        }
    };
    
    // Expose to global scope
    window.MessagingService = MessagingService;
})();
