/**
 * Favorites Service for WaveSurf
 * Persists favorite listings in localStorage
 */

(function() {
	const STORAGE_KEY = 'wavesurf_favorites';

	function readFavorites() {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			return raw ? JSON.parse(raw) : [];
		} catch (e) {
			console.error('Failed to read favorites from storage', e);
			return [];
		}
	}

	function writeFavorites(favorites) {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
		} catch (e) {
			console.error('Failed to write favorites to storage', e);
		}
	}

	const Favorites = {
		getAll() {
			return readFavorites();
		},

		isFavorite(listingId) {
			return readFavorites().includes(listingId);
		},

		add(listingId) {
			const favorites = readFavorites();
			if (!favorites.includes(listingId)) {
				favorites.push(listingId);
				writeFavorites(favorites);
			}
			return true;
		},

		remove(listingId) {
			const favorites = readFavorites();
			const index = favorites.indexOf(listingId);
			if (index !== -1) {
				favorites.splice(index, 1);
				writeFavorites(favorites);
			}
			return false;
		},

		toggle(listingId) {
			return this.isFavorite(listingId) ? this.remove(listingId) : this.add(listingId);
		},

		clear() {
			writeFavorites([]);
		}
	};

	// Expose the service globally
	window.Favorites = Favorites;
})();
