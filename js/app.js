/**
 * CINEFLIX - Online Movie & Entertainment Explorer
 * Simplified Application Controller (Spotify Green Theme)
 */

// Global App State
const AppState = {
  allMovies: [],
  filteredMovies: [],
  filters: {
    keyword: '',
    genre: 'all'
  }
};

// ==========================================================================
// 1. Client-Server Communication & Data Fetching (Objective 2)
// ==========================================================================
const MovieService = {
  async fetchMovies() {
    try {
      const response = await fetch('data/movies.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to load movie catalog from JSON/REST endpoint:', error);
      return [];
    }
  }
};

// ==========================================================================
// 2. DOM Elements Cache
// ==========================================================================
const DOM = {
  navbar: document.getElementById('navbar'),

  // Filters
  searchInput: document.getElementById('searchInput'),
  searchClearBtn: document.getElementById('searchClearBtn'),
  genrePillsContainer: document.getElementById('genrePillsContainer'),
  resetFiltersBtn: document.getElementById('resetFiltersBtn'),
  activeFiltersBar: document.getElementById('activeFiltersBar'),
  resultsCountDisplay: document.getElementById('resultsCountDisplay'),

  // Movie Grid
  movieGrid: document.getElementById('movieGrid'),

  // Details Modal
  modalBackdrop: document.getElementById('modalBackdrop'),
  modalCloseBtn: document.getElementById('modalCloseBtn'),
  modalVideoBox: document.getElementById('modalVideoBox'),
  modalTitle: document.getElementById('modalTitle'),
  modalMatch: document.getElementById('modalMatch'),
  modalYear: document.getElementById('modalYear'),
  modalCert: document.getElementById('modalCert'),
  modalRuntime: document.getElementById('modalRuntime'),
  modalScoreImdb: document.getElementById('modalScoreImdb'),
  modalScoreRT: document.getElementById('modalScoreRT'),
  modalScoreMeta: document.getElementById('modalScoreMeta'),
  modalSynopsis: document.getElementById('modalSynopsis'),
  modalDirector: document.getElementById('modalDirector'),
  modalCast: document.getElementById('modalCast'),
  modalGenres: document.getElementById('modalGenres'),

  toastContainer: document.getElementById('toastContainer')
};

// ==========================================================================
// 3. Application Controller
// ==========================================================================
const App = {
  async init() {
    this.renderSkeletons();
    this.bindEvents();

    // Fetch movie dataset
    const movies = await MovieService.fetchMovies();
    AppState.allMovies = movies;
    AppState.filteredMovies = [...movies];

    this.applyFilters();

    // Render full catalog analytics (Exactly 2 charts)
    ChartEngine.renderAll(AppState.allMovies);

    console.log('Cineflix Explorer initialized (Spotify green theme) with', movies.length, 'movies');
  },

  renderSkeletons() {
    if (!DOM.movieGrid) return;
    DOM.movieGrid.innerHTML = Array(8)
      .fill(0)
      .map(() => '<div class="skeleton-card"></div>')
      .join('');
  },

  bindEvents() {
    // Debounced Keyword Search
    let debounceTimer;
    DOM.searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      const query = e.target.value.trim();
      DOM.searchClearBtn.classList.toggle('visible', query.length > 0);
      debounceTimer = setTimeout(() => {
        AppState.filters.keyword = query;
        this.applyFilters();
      }, 200);
    });

    // Clear Search Input
    DOM.searchClearBtn.addEventListener('click', () => {
      DOM.searchInput.value = '';
      DOM.searchClearBtn.classList.remove('visible');
      AppState.filters.keyword = '';
      this.applyFilters();
      DOM.searchInput.focus();
    });

    // 5 Genre Pills Event Delegation
    DOM.genrePillsContainer.querySelectorAll('.genre-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        DOM.genrePillsContainer.querySelectorAll('.genre-pill').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        AppState.filters.genre = btn.getAttribute('data-genre');
        this.applyFilters();
      });
    });

    // Reset Filters
    DOM.resetFiltersBtn.addEventListener('click', () => {
      this.resetFilters();
    });

    // Modal Close
    DOM.modalCloseBtn.addEventListener('click', () => {
      this.closeModal();
    });

    DOM.modalBackdrop.addEventListener('click', (e) => {
      if (e.target === DOM.modalBackdrop) {
        this.closeModal();
      }
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
      } else if (e.key === '/' && document.activeElement !== DOM.searchInput) {
        e.preventDefault();
        DOM.searchInput.focus();
      }
    });
  },

  /**
   * Filter catalog by keyword and selected genre (out of 5)
   */
  applyFilters() {
    const { keyword, genre } = AppState.filters;

    const results = AppState.allMovies.filter(movie => {
      // Keyword Search (checks title, director, cast)
      if (keyword) {
        const query = keyword.toLowerCase();
        const inTitle = movie.title.toLowerCase().includes(query);
        const inDirector = (movie.director || '').toLowerCase().includes(query);
        const inCast = (movie.cast || []).some(c => c.toLowerCase().includes(query));
        if (!inTitle && !inDirector && !inCast) {
          return false;
        }
      }

      // Genre filter (5 selected genres or all)
      if (genre !== 'all') {
        const movieGenres = (movie.genre || []).map(g => g.toLowerCase());
        if (!movieGenres.includes(genre)) {
          return false;
        }
      }

      return true;
    });

    AppState.filteredMovies = results;
    this.renderMovieCards(results);
    this.renderFilterSummary();
  },

  renderMovieCards(movies) {
    if (!DOM.movieGrid) return;

    if (movies.length === 0) {
      DOM.movieGrid.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-film empty-state-icon"></i>
          <h3>No Movies Found</h3>
          <p>No titles matched your current search and filter settings.</p>
          <button class="btn-primary" onclick="App.resetFilters()">
            <i class="fa-solid fa-rotate-left"></i> Reset Filters
          </button>
        </div>
      `;
      return;
    }

    DOM.movieGrid.innerHTML = movies.map(movie => {
      return `
        <div class="movie-card" data-id="${movie.id}">
          <div class="card-poster-wrapper">
            <img 
              src="${movie.poster}" 
              alt="${movie.title} Poster" 
              class="card-poster"
              loading="lazy"
              onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80';"
            />
            <span class="card-badge-rating">
              <i class="fa-solid fa-star"></i> ${movie.rating}
            </span>
            <span class="card-badge-match">
              ${movie.matchScore || 95}% Match
            </span>
            <div class="card-hover-overlay">
              <div class="card-action-bar">
                <button class="card-action-btn card-play-trigger" title="Watch Trailer" data-id="${movie.id}">
                  <i class="fa-solid fa-play"></i>
                </button>
                <button class="card-action-btn btn-outline card-info-trigger" title="View Details" data-id="${movie.id}">
                  <i class="fa-solid fa-chevron-down"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="card-body">
            <h4 class="card-title" title="${movie.title}">${movie.title}</h4>
            <div class="card-meta-row">
              <span>${movie.year}</span>
              <span>${movie.certificate || 'PG-13'}</span>
              <span>${movie.runtime || '120 min'}</span>
            </div>
            <div class="card-genres">
              ${(movie.genre || []).slice(0, 3).map(g => `<span class="card-genre-badge">${g}</span>`).join('')}
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach card handlers
    DOM.movieGrid.querySelectorAll('.movie-card').forEach(card => {
      const id = parseInt(card.getAttribute('data-id'));
      const movie = AppState.allMovies.find(m => m.id === id);

      card.addEventListener('click', (e) => {
        if (!e.target.closest('button')) {
          this.openModal(movie);
        }
      });

      card.querySelector('.card-play-trigger')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openModal(movie);
      });

      card.querySelector('.card-info-trigger')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openModal(movie);
      });
    });
  },

  renderFilterSummary() {
    const { keyword, genre } = AppState.filters;
    const count = AppState.filteredMovies.length;
    const total = AppState.allMovies.length;

    DOM.resultsCountDisplay.innerHTML = `Showing <strong>${count}</strong> of ${total} titles`;

    const chips = [];
    if (keyword) {
      chips.push(`Search: "${keyword}" <i class="fa-solid fa-xmark" onclick="App.clearFilter('keyword')"></i>`);
    }
    if (genre !== 'all') {
      chips.push(`Genre: ${genre.toUpperCase()} <i class="fa-solid fa-xmark" onclick="App.clearFilter('genre')"></i>`);
    }

    DOM.activeFiltersBar.innerHTML = chips.map(c => `<span class="filter-chip">${c}</span>`).join('');
  },

  clearFilter(type) {
    if (type === 'keyword') {
      AppState.filters.keyword = '';
      DOM.searchInput.value = '';
      DOM.searchClearBtn.classList.remove('visible');
    } else if (type === 'genre') {
      AppState.filters.genre = 'all';
      DOM.genrePillsContainer.querySelectorAll('.genre-pill').forEach(p => {
        p.classList.toggle('active', p.getAttribute('data-genre') === 'all');
      });
    }
    this.applyFilters();
  },

  resetFilters() {
    AppState.filters.keyword = '';
    AppState.filters.genre = 'all';

    DOM.searchInput.value = '';
    DOM.searchClearBtn.classList.remove('visible');

    DOM.genrePillsContainer.querySelectorAll('.genre-pill').forEach(p => {
      p.classList.toggle('active', p.getAttribute('data-genre') === 'all');
    });

    this.applyFilters();
    this.showToast('Filters have been reset');
  },

  /**
   * Movie Details & Trailer Modal
   */
  openModal(movie) {
    if (!movie) return;

    if (movie.trailerId) {
      DOM.modalVideoBox.innerHTML = `
        <iframe 
          src="https://www.youtube.com/embed/${movie.trailerId}?autoplay=1&rel=0&modestbranding=1" 
          title="${movie.title} Trailer" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
      `;
    } else {
      DOM.modalVideoBox.innerHTML = `
        <div style="width:100%; height:100%; background: url('${movie.backdrop || movie.poster}') center/cover;"></div>
      `;
    }

    DOM.modalTitle.textContent = movie.title;
    DOM.modalMatch.textContent = `${movie.matchScore || 96}% Match`;
    DOM.modalYear.textContent = movie.year;
    DOM.modalCert.textContent = movie.certificate || 'PG-13';
    DOM.modalRuntime.textContent = movie.runtime || '120 min';

    DOM.modalScoreImdb.textContent = movie.rating || 'N/A';
    DOM.modalScoreRT.textContent = movie.rottenTomatoes || 'N/A';
    DOM.modalScoreMeta.textContent = movie.metascore || 'N/A';

    DOM.modalSynopsis.textContent = movie.synopsis;
    DOM.modalDirector.textContent = movie.director || 'N/A';
    DOM.modalCast.textContent = (movie.cast || []).join(', ');
    DOM.modalGenres.textContent = (movie.genre || []).join(' • ');

    DOM.modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  },

  closeModal() {
    DOM.modalBackdrop.classList.remove('open');
    DOM.modalVideoBox.innerHTML = '';
    document.body.style.overflow = 'auto';
  },

  showToast(message) {
    if (!DOM.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-info" style="color: var(--spotify-green)"></i> <span>${message}</span>`;
    DOM.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(50px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
