/**
 * Enhanced Search Bar Functionality
 */

(function() {
    'use strict';

    let activeDropdown = null;
    let selectedDates = [];
    let seatsCount = 1;

    function initSearchBar() {
        console.log('Initializing enhanced search bar');

        // Get elements
        const searchFields = document.querySelectorAll('.search-field');
        const locationInput = document.getElementById('location-input');
        const dateInput = document.getElementById('date-input');
        const seatsInput = document.getElementById('seats-input');
        const searchForm = document.getElementById('search-form');

        // Initialize dropdowns
        searchFields.forEach(field => {
            field.addEventListener('click', handleFieldClick);
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-bar')) {
                closeAllDropdowns();
            }
        });

        // Initialize location functionality
        if (locationInput) {
            initLocationSearch();
        }

        // Initialize date picker
        if (dateInput) {
            initDatePicker();
        }

        // Initialize seats selector
        initSeatsSelector();

        // Handle form submission
        if (searchForm) {
            searchForm.addEventListener('submit', handleSearchSubmit);
        }
    }

    function handleFieldClick(e) {
        e.stopPropagation();
        const field = e.currentTarget;
        const fieldType = field.dataset.field;
        const dropdown = field.querySelector('.search-dropdown');

        if (activeDropdown && activeDropdown !== dropdown) {
            closeAllDropdowns();
        }

        if (dropdown) {
            const isActive = dropdown.classList.contains('active');
            if (isActive) {
                dropdown.classList.remove('active');
                field.classList.remove('active');
                activeDropdown = null;
            } else {
                dropdown.classList.add('active');
                field.classList.add('active');
                activeDropdown = dropdown;
            }
        }
    }

    function closeAllDropdowns() {
        document.querySelectorAll('.search-dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
        document.querySelectorAll('.search-field').forEach(field => {
            field.classList.remove('active');
        });
        activeDropdown = null;
    }

    function initLocationSearch() {
        const locationInput = document.getElementById('location-input');
        const locationItems = document.querySelectorAll('.location-item');

        // Handle location item clicks
        locationItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const location = item.dataset.location;
                locationInput.value = location;
                setTimeout(() => closeAllDropdowns(), 100);
            });
        });

        // Handle typing in location input
        locationInput.addEventListener('input', (e) => {
            // In a real app, this would filter locations or make API calls
            console.log('Searching for:', e.target.value);
        });
    }

    function initDatePicker() {
        const dateInput = document.getElementById('date-input');
        const dateContainer = document.getElementById('date-picker-container');
        const clearButton = document.getElementById('clear-dates');
        let fpInstance = null;

        // Initialize Flatpickr if available
        if (typeof flatpickr !== 'undefined' && dateContainer) {
            fpInstance = flatpickr(dateContainer, {
                mode: "range",
                inline: true,
                minDate: "today",
                dateFormat: "Y-m-d",
                onChange: function(dates) {
                    selectedDates = dates;
                    if (dates.length === 2) {
                        const start = formatDate(dates[0]);
                        const end = formatDate(dates[1]);
                        dateInput.value = `${start} - ${end}`;
                    } else if (dates.length === 1) {
                        dateInput.value = formatDate(dates[0]);
                    }
                }
            });
        }

        // Handle clear button
        if (clearButton && fpInstance) {
            clearButton.addEventListener('click', (e) => {
                e.stopPropagation();
                fpInstance.clear();
                dateInput.value = '';
                selectedDates = [];
            });
        }
    }

    function formatDate(date) {
        const options = { month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    function initSeatsSelector() {
        const seatsInput = document.getElementById('seats-input');
        const seatsCount = document.getElementById('seats-count');
        const decrementBtn = document.getElementById('seats-decrement');
        const incrementBtn = document.getElementById('seats-increment');

        let currentSeats = 1;

        if (decrementBtn && incrementBtn) {
            decrementBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (currentSeats > 1) {
                    currentSeats--;
                    updateSeatsDisplay(currentSeats);
                }
            });

            incrementBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (currentSeats < 20) {
                    currentSeats++;
                    updateSeatsDisplay(currentSeats);
                }
            });
        }

        function updateSeatsDisplay(count) {
            if (seatsCount) seatsCount.textContent = count;
            if (seatsInput) seatsInput.value = count === 1 ? '1 seat' : `${count} seats`;
            seatsCount = count;

            // Update button states
            if (decrementBtn) decrementBtn.disabled = count <= 1;
            if (incrementBtn) incrementBtn.disabled = count >= 20;
        }
    }

    function handleSearchSubmit(e) {
        e.preventDefault();
        
        const locationInput = document.getElementById('location-input');
        const dateInput = document.getElementById('date-input');
        
        const searchParams = {
            location: locationInput?.value || '',
            dates: dateInput?.value || '',
            seats: seatsCount
        };

        console.log('Search submitted:', searchParams);

        // Navigate to search results with params
        const queryString = new URLSearchParams({
            location: searchParams.location,
            dates: searchParams.dates,
            seats: searchParams.seats
        }).toString();

        if (window.waveRouter) {
            window.waveRouter.navigate(`/search?${queryString}`);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSearchBar);
    } else {
        initSearchBar();
    }

    // Export for global access
    window.initSearchBar = initSearchBar;
})();
