## Nohana Frontend Architecture and API/URL Map

### Overview
Nohana is a single-page application (SPA) built with plain HTML/CSS/JavaScript. Client-side routing is powered by Navigo. UI is componentized by page-level scripts and a lightweight template system. The application is fully static and served locally at `http://localhost:5173`.

- **Routing**: Navigo (hash-based) in `js/router.js`
- **Templates**: Inline HTML templates (e.g., `js/templates.js`, `js/*-template.html`) dynamically injected into `#main-content`
- **UI Libraries**: Flatpickr (datepicker), Font Awesome (icons)
- **Maps**: Google Maps JS API (on demand) and Static Maps as a fallback
- **Data**: Mock services (e.g., `js/listings-service.js`, `js/reviews-service.js`), state stored in-memory and `localStorage`

### Application Structure (selected)
- `index.html` — shell, header (logo, search), user nav, script includes
- `styles.css` — global styling system (colors, shadows, buttons, cards, search, etc.)
- `js/router.js` — route table, template loading, page initialization
- `js/templates.js` — global `window.templates` for key pages/sections
- `js/*-template.html` — standalone HTML templates loaded via `fetch()`
- `js/*-page.js`, `js/*-details.js` — page controllers and initializers
- `js/*-service.js` — mock service modules (listings, favorites, reviews, messages, auth)

### Client-Side Routes
Defined in `js/router.js` using Navigo:

```
/                             → Home
/search                       → Search results
/listing/:id                  → Listing detail
/host                         → Host dashboard
/become-host                  → Become a Captain page
/bookings                     → Bookings overview
/favorites                    → Favorites page
/account                      → Account page
/booking/:id                  → Booking flow
/booking-confirmation/:id     → Booking confirmation
/booking-details/:id          → Booking details
/messages                     → Messages
```

Anchors and programmatic navigations mirror these routes using `href="#/..."` and `waveRouter.navigate('/...')`.

### Search Bar (Header)
Implemented in `index.html` + `js/search-bar.js` with rich dropdowns:
- Location: text input with a dropdown of popular locations
- Date: Flatpickr range calendar in a dropdown (multi-day span supported)
- Seats: counter dropdown with +/- controls
- Submit: navigates to `/search` with query parameters

Supported query parameters (observed in code and templates):
- `location` — free text (e.g., `Austin`)
- `dates` — formatted string (e.g., `Mar 15 - Mar 20`)
- `seats` — integer
- `category` / `activity` — categorized search (e.g., `wakesurfing`, `fishing`)

### Dynamic Template Loading
`js/router.js` uses `fetch()` to load HTML templates as needed:

```
js/search-results-template.html
js/become-host-template.html
js/user-profile-template.html
js/messages-template.html
js/bookings-template.html
js/booking-details-template.html
```

On success, the template HTML is injected into `#main-content`, then the corresponding page script (if any) is executed.

### Services (Mock Data / Utilities)
- `js/listings-service.js` — listing catalog, search helpers, featured lists
- `js/favorites-service.js` — manage saved boats (usually via `localStorage`)
- `js/reviews-service.js` — mock review data
- `js/messaging-service.js` — mock messages/threads
- `js/auth-service.js` — lightweight auth state, user-menu population

These services are exposed on `window.*` where needed for simple global access.

### External URLs & Libraries
- Font Awesome: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css`
- Google Fonts: `https://fonts.googleapis.com`, `https://fonts.gstatic.com`
- Flatpickr:
  - CSS: `https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css`
  - JS:  `https://cdn.jsdelivr.net/npm/flatpickr`
- Navigo: `https://unpkg.com/navigo@8.11.1/lib/navigo.min.js`

#### Maps & Directions
- Google Maps JS API (on demand):
  - `https://maps.googleapis.com/maps/api/js?key=YOUR_KEY&libraries=places&callback=initGoogleMapsCallback`
- Google Static Maps (fallback preview):
  - `https://maps.googleapis.com/maps/api/staticmap?...&key=YOUR_KEY`
- Directions deep-link:
  - `https://www.google.com/maps/dir/?api=1&destination=LAT,LNG`
- Generic maps link in templates:
  - `https://maps.google.com`

> Replace `YOUR_KEY` with a valid API key for production. Keys are referenced inline in booking pages; consider moving to environment/config before release.

### Data Flow (at a glance)
1. User navigates: Navigo calls a router handler
2. Router loads template via `fetch()`, injects into `#main-content`
3. Router loads/init page script (e.g., `initSearchResults()`)
4. Page script uses services for mock data and populates DOM
5. User interactions update UI and optionally persist to `localStorage`

### Error Handling & UX
- Graceful fallbacks when templates or elements are missing (user-friendly errors)
- Loading overlay helper available globally (`window.toggleLoadingOverlay`)
- Responsive design across breakpoints with consistent spacing and typography
- Micro-interactions: hover, focus states, subtle animations

### Local Development
- Static server runs at `http://localhost:5173`
- No backend API required (mock data + templates)

### Quick Route/URL Reference
```
Routes:
  /, /search, /listing/:id, /host, /become-host,
  /bookings, /favorites, /account, /booking/:id,
  /booking-confirmation/:id, /booking-details/:id, /messages

External:
  FontAwesome, Google Fonts, Flatpickr, Navigo
  Google Maps JS API, Google Static Maps, Google Directions

Templates fetched:
  js/*-template.html files (search-results, become-host, user-profile,
  messages, bookings, booking-details)
```

### Notes / Next Steps
- Move hard-coded external keys/URLs into a single config module
- Normalize use of `category` vs `activity` in search links
- Add unit tests for router handlers and services (optional)


