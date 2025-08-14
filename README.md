# WaveSurf - Boat Seat Booking Marketplace

A marketplace application for booking individual seats on boats for wakesurfing, fishing, water skiing, wakeboarding, and cruising activities. Inspired by Airbnb's UI/UX patterns but specialized for water sports and activities with a focus on per-seat booking rather than entire boat rentals.

## Features

### User Features
- Browse boat listings by activity type
- Search and filter by price, location, amenities, and seat availability
- Interactive map view of available boats
- Image carousel for each listing
- Detailed listing pages with specifications and booking options
- Seat-based booking system with date and time selection
- Booking confirmation with details and meeting location
- User profiles with booking history and favorites
- Responsive design for all devices

### Host Features
- Comprehensive host dashboard
- Listing management (create, edit, activate/deactivate)
- Booking oversight and management
- Earnings tracking and transaction history
- Review management and response system
- Host profile and settings configuration

## Getting Started

1. Clone the repository
2. Open `index.html` in your web browser
3. The Google Maps API key is already configured for demo purposes

## Navigation

- **Home Page**: Browse listings and filter by activity type
- **Search Results**: Use the search bar or activity tabs to find specific boats
- **Listing Details**: Click on any listing to view details and book seats
- **User Profile**: Access your profile, bookings, and favorites from the user menu
- **Host Dashboard**: Click "Become a Captain" to access the host dashboard

## Project Structure

- `index.html` - Main HTML entry point
- `styles.css` - CSS styling for the application
- `js/` - JavaScript files organized by functionality
  - `main.js` - Core functionality for the home page
  - `router.js` - Client-side routing using Navigo.js
  - `templates.js` - HTML templates for different pages
  - `listing-detail.js` - Listing detail page functionality
  - `search-results.js` - Search results page functionality
  - `user-profile.js` - User profile page functionality
  - `host-dashboard.js` - Host dashboard functionality
- `images/` - Contains images and SVG files
- `Projectplan.md` - Comprehensive project documentation

## Technical Implementation

- **Frontend**: Pure HTML5, CSS3, and vanilla JavaScript
- **Routing**: Client-side routing with Navigo.js
- **Maps**: Google Maps API integration
- **Templates**: Dynamic template loading system
- **Mock Data**: Simulated backend with JavaScript objects
- **Responsive Design**: Mobile-first approach with media queries
- **Form Validation**: Client-side validation for all forms

## Development

This project is built using vanilla HTML, CSS, and JavaScript without any frameworks to keep it simple and lightweight.

To add new features or make changes:
1. Follow the structure in existing files
2. Update the `Projectplan.md` file with your changes
3. Test across different devices and browsers

## Future Enhancements

See `Projectplan.md` for detailed information about:
- Backend integration plans
- Additional feature enhancements
- Technical improvements
- Development phases

## License

This project is for demonstration purposes only.