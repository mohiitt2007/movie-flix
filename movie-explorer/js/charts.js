/**
 * CINEFLIX - Analytics & Visualization Engine
 * Objective 4: Exactly 2 Charts with Spotify Green Palette
 * 1. Movie Distribution by Genre (Doughnut Chart)
 * 2. Movies by Release Decade (Bar Chart)
 */

const ChartEngine = (() => {
  let genreChartInstance = null;
  let eraChartInstance = null;

  // Spotify Palette Colors
  const colors = {
    spotifyGreen: '#1DB954',
    spotifyGreenHover: '#1ED760',
    spotifyDark: '#121212',
    textSecondary: '#B3B3B3',
    cardBg: '#181818'
  };

  /**
   * Render or update the 2 catalog charts and KPI indicators
   * @param {Array} movies - Full catalog dataset
   */
  function renderAll(movies) {
    if (!movies || !window.Chart) return;

    updateKPIs(movies);
    renderGenreChart(movies);
    renderDecadeChart(movies);
  }

  /**
   * Update Summary KPI metrics
   */
  function updateKPIs(movies) {
    const totalCountEl = document.getElementById('kpi-total-movies');
    const avgRatingEl = document.getElementById('kpi-avg-rating');
    const topGenreEl = document.getElementById('kpi-top-genre');
    const goldenEraEl = document.getElementById('kpi-golden-era');

    if (totalCountEl) totalCountEl.textContent = movies.length;

    if (avgRatingEl) {
      if (movies.length === 0) {
        avgRatingEl.textContent = '0.0';
      } else {
        const sum = movies.reduce((acc, m) => acc + (parseFloat(m.rating) || 0), 0);
        avgRatingEl.textContent = (sum / movies.length).toFixed(1) + ' ★';
      }
    }

    // Most common genre
    const genreCounts = {};
    movies.forEach(m => {
      (m.genre || []).forEach(g => {
        genreCounts[g] = (genreCounts[g] || 0) + 1;
      });
    });
    const sortedGenres = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]);
    if (topGenreEl) {
      topGenreEl.textContent = sortedGenres.length > 0 ? `${sortedGenres[0][0]} (${sortedGenres[0][1]})` : 'N/A';
    }

    // Peak decade
    const eraCounts = {};
    movies.forEach(m => {
      const era = Math.floor(m.year / 10) * 10 + 's';
      eraCounts[era] = (eraCounts[era] || 0) + 1;
    });
    const sortedEras = Object.entries(eraCounts).sort((a, b) => b[1] - a[1]);
    if (goldenEraEl) {
      goldenEraEl.textContent = sortedEras.length > 0 ? sortedEras[0][0] : 'N/A';
    }
  }

  /**
   * Chart 1: Genre Distribution (Doughnut Chart with Spotify Green Hues)
   */
  function renderGenreChart(movies) {
    const ctx = document.getElementById('genreChart');
    if (!ctx) return;

    const genreCounts = {};
    movies.forEach(m => {
      (m.genre || []).forEach(g => {
        genreCounts[g] = (genreCounts[g] || 0) + 1;
      });
    });

    const labels = Object.keys(genreCounts);
    const data = Object.values(genreCounts);

    // Curated Spotify Green harmonious spectrum
    const backgroundColors = [
      '#1DB954', '#1ED760', '#2ECC71', '#00D26A',
      '#00B894', '#55EFC4', '#10AC84', '#26DE81',
      '#20BF6B', '#16A085', '#05C46B', '#58B19F'
    ];

    if (genreChartInstance) {
      genreChartInstance.data.labels = labels;
      genreChartInstance.data.datasets[0].data = data;
      genreChartInstance.update();
      return;
    }

    genreChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: backgroundColors.slice(0, labels.length),
          borderColor: '#181818',
          borderWidth: 2,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              color: '#d1d1d1',
              font: { family: 'Inter', size: 11 },
              boxWidth: 12,
              padding: 10
            }
          },
          tooltip: {
            backgroundColor: 'rgba(18, 18, 18, 0.95)',
            titleColor: '#fff',
            bodyColor: '#e5e5e5',
            borderColor: colors.spotifyGreen,
            borderWidth: 1,
            callbacks: {
              label: function(context) {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const val = context.raw || 0;
                const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                return ` ${context.label}: ${val} titles (${pct}%)`;
              }
            }
          }
        },
        cutout: '60%'
      }
    });
  }

  /**
   * Chart 2: Movies by Release Decade (Bar Chart with Spotify Green Accent)
   */
  function renderDecadeChart(movies) {
    const ctx = document.getElementById('eraChart');
    if (!ctx) return;

    const eras = ['1970s', '1980s', '1990s', '2000s', '2010s', '2020s'];
    const counts = eras.map(era => {
      return movies.filter(m => (Math.floor(m.year / 10) * 10 + 's') === era).length;
    });

    if (eraChartInstance) {
      eraChartInstance.data.labels = eras;
      eraChartInstance.data.datasets[0].data = counts;
      eraChartInstance.update();
      return;
    }

    eraChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: eras,
        datasets: [{
          label: 'Number of Movies',
          data: counts,
          backgroundColor: 'rgba(29, 185, 84, 0.85)',
          hoverBackgroundColor: '#1ED760',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#B3B3B3', font: { family: 'Inter' } }
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#B3B3B3', stepSize: 2, precision: 0 }
          }
        },
        plugins: {
          legend: {
            labels: { color: '#d1d1d1', font: { family: 'Inter', size: 12 } }
          },
          tooltip: {
            backgroundColor: 'rgba(18, 18, 18, 0.95)',
            titleColor: '#fff',
            borderColor: colors.spotifyGreen,
            borderWidth: 1,
            callbacks: {
              label: (ctx) => ` Movies released: ${ctx.raw}`
            }
          }
        }
      }
    });
  }

  return {
    renderAll
  };
})();
