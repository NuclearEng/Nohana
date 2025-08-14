(function() {
    // Messaging page functionality
    function initMessagesPage() {
        console.log('Initializing messages page');
        
        // Check if user is logged in
        if (window.AuthService && !window.AuthService.isLoggedIn()) {
            // Redirect to home page
            window.waveRouter.navigate('/');
            return;
        }
        
        // Get conversations
        let conversations = [];
        if (window.MessagingService) {
            conversations = window.MessagingService.getConversations();
        }
        
        // Initialize UI
        initConversationList(conversations);
        
        // Initialize search
        initSearch();
        
        // Hide loading overlay
        if (typeof toggleLoadingOverlay === 'function') {
            toggleLoadingOverlay(false);
        }
    }
    
    function initConversationList(conversations) {
        const conversationList = document.getElementById('conversation-list');
        if (!conversationList) return;
        
        // Clear list
        conversationList.innerHTML = '';
        
        // If no conversations, show message
        if (conversations.length === 0) {
            conversationList.innerHTML = '<li class="no-conversations">No conversations yet</li>';
            return;
        }
        
        // Create HTML for each conversation
        conversations.forEach(conversation => {
            const lastMessage = conversation.lastMessage;
            const lastMessageTime = formatMessageTime(lastMessage.timestamp);
            
            // Create conversation item
            const conversationItem = document.createElement('li');
            conversationItem.className = 'conversation-item';
            conversationItem.setAttribute('data-id', conversation.user.id);
            
            // Create HTML
            conversationItem.innerHTML = `
                <div class="conversation-header">
                    <img src="${conversation.user.avatar}" alt="${conversation.user.name}" class="conversation-avatar">
                    <div class="conversation-info">
                        <div class="conversation-name">${conversation.user.name}</div>
                        <div class="conversation-time">${lastMessageTime}</div>
                    </div>
                    ${conversation.unreadCount > 0 ? `<div class="conversation-unread">${conversation.unreadCount}</div>` : ''}
                </div>
                <div class="conversation-preview">${lastMessage.content}</div>
            `;
            
            // Add click event
            conversationItem.addEventListener('click', () => {
                // Remove active class from all items
                const items = conversationList.querySelectorAll('.conversation-item');
                items.forEach(item => item.classList.remove('active'));
                
                // Add active class to this item
                conversationItem.classList.add('active');
                
                // Remove unread indicator
                const unreadBadge = conversationItem.querySelector('.conversation-unread');
                if (unreadBadge) {
                    unreadBadge.remove();
                }
                
                // Load messages
                loadMessages(conversation.user.id);
            });
            
            // Add to list
            conversationList.appendChild(conversationItem);
        });
    }
    
    function initSearch() {
        const searchInput = document.getElementById('conversation-search');
        if (!searchInput) return;
        
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase();
            const items = document.querySelectorAll('.conversation-item');
            
            items.forEach(item => {
                const name = item.querySelector('.conversation-name').textContent.toLowerCase();
                const preview = item.querySelector('.conversation-preview').textContent.toLowerCase();
                
                if (name.includes(query) || preview.includes(query)) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
    
    function loadMessages(userId) {
        // Get messages
        let messages = [];
        if (window.MessagingService) {
            messages = window.MessagingService.getMessages(userId);
        }
        
        // Get user info
        const user = window.MessagingService ? window.MessagingService.getUserInfo(userId) : null;
        if (!user) return;
        
        // Get elements
        const messagesArea = document.getElementById('messages-area');
        const emptyState = document.getElementById('empty-state');
        const messagesContent = document.getElementById('messages-content');
        const messagesHeader = document.getElementById('messages-header');
        const messagesList = document.getElementById('messages-list');
        const messageForm = document.getElementById('message-form');
        const messageInput = document.getElementById('message-input');
        const sendButton = document.getElementById('send-message-btn');
        
        if (!messagesArea || !emptyState || !messagesContent || !messagesHeader || !messagesList || !messageForm || !messageInput || !sendButton) return;
        
        // Hide empty state, show messages content
        emptyState.style.display = 'none';
        messagesContent.style.display = 'flex';
        
        // Set header
        messagesHeader.innerHTML = `
            <img src="${user.avatar}" alt="${user.name}" class="messages-header-avatar">
            <div class="messages-header-info">
                <h3>${user.name}</h3>
                <p>Active now</p>
            </div>
        `;
        
        // Set messages
        messagesList.innerHTML = '';
        
        // Get current user
        const currentUser = window.AuthService ? window.AuthService.getCurrentUser() : null;
        
        // Create HTML for each message
        messages.forEach(message => {
            const isSent = currentUser && message.sender === currentUser.id;
            const messageTime = formatMessageTime(message.timestamp);
            
            // Create message item
            const messageItem = document.createElement('div');
            messageItem.className = `message-item ${isSent ? 'sent' : 'received'}`;
            
            // Create HTML
            messageItem.innerHTML = `
                <div class="message-bubble">
                    <p class="message-content">${message.content}</p>
                    <div class="message-time">${messageTime}</div>
                </div>
            `;
            
            // Add to list
            messagesList.appendChild(messageItem);
        });
        
        // Scroll to bottom
        messagesList.scrollTop = messagesList.scrollHeight;
        
        // Set up message form
        messageForm.onsubmit = (e) => {
            e.preventDefault();
            
            const content = messageInput.value.trim();
            if (!content) return;
            
            // Send message
            if (window.MessagingService) {
                const message = window.MessagingService.sendMessage(userId, content);
                
                if (message) {
                    // Create message item
                    const messageItem = document.createElement('div');
                    messageItem.className = 'message-item sent';
                    
                    // Create HTML
                    messageItem.innerHTML = `
                        <div class="message-bubble">
                            <p class="message-content">${message.content}</p>
                            <div class="message-time">${formatMessageTime(message.timestamp)}</div>
                        </div>
                    `;
                    
                    // Add to list
                    messagesList.appendChild(messageItem);
                    
                    // Scroll to bottom
                    messagesList.scrollTop = messagesList.scrollHeight;
                    
                    // Clear input
                    messageInput.value = '';
                    sendButton.disabled = true;
                }
            }
        };
        
        // Enable/disable send button based on input
        messageInput.oninput = () => {
            sendButton.disabled = messageInput.value.trim() === '';
        };
        
        // Focus input
        messageInput.focus();
    }
    
    function formatMessageTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        
        // If today, show time
        if (date.toDateString() === now.toDateString()) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        
        // If yesterday, show "Yesterday"
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        }
        
        // If this year, show month and day
        if (date.getFullYear() === now.getFullYear()) {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
        
        // Otherwise, show date
        return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    }
    
    // Expose to global scope
    window.initMessagesPage = initMessagesPage;
})();
