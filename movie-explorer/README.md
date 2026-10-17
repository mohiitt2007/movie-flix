# 🎬 Cineflix - Online Movie & Entertainment Explorer (Spotify Green Edition)

A streamlined, modern entertainment portal allowing users to explore and analyze movies by keyword and genre—styled with a signature **Spotify-inspired green palette** (`#1DB954` on `#121212`), responsive movie cards, and interactive **Chart.js** data visualizations.

---

## 🌟 Features & Implemented Requirements

1. **Spotify-Inspired Green Aesthetics**:
   - Signature Spotify Green (`#1DB954` & hover `#1ED760`).
   - Deep Obsidian Black background (`#121212`).
   - Charcoal Cards (`#181818`, hover `#242424`) with glowing green border accents.
   - Spotify-styled pill buttons and active genre tags with green glow effects.
   - Star Gold (`#FFC107`) ratings.

2. **Clean Search & Filter Controls (Objective 1)**:
   - **Keyword Search**: Real-time debounced search across movie titles, directors, and cast (shortcut `/`).
   - **5 Core Genres Selection**: Single-click pills for **Action**, **Comedy**, **Drama**, **Sci-Fi**, and **Thriller** (+ "All").
   - **Dynamic DOM Updates**: Real-time card re-rendering, active filter tag chips with 1-click removal, and result counters.

3. **Client-Server Communication (Objective 2)**:
   - Asynchronous `fetch()` service reading movie catalog records from `data/movies.json` (sample REST JSON dataset).
   - 28 blockbuster movies with 100% verified, unblocked TMDB posters and YouTube trailers.
   - Animated shimmer skeletons during load states.

4. **Front-End UI & Detail Modal (Objective 3)**:
   - **Responsive Movie Cards**: Verified high-resolution posters with hover zoom, IMDb ratings, match badges, and quick action buttons.
   - **Movie Detail Modal**: Official embedded trailer player, plot synopsis, cast, director, and multi-source ratings (IMDb, Rotten Tomatoes, Metascore).

5. **Visual Analytics with Exactly 2 Charts (Objective 4)**:
   - **Chart 1: Movie Count by Genre** (Doughnut Chart): Visualizes the distribution of titles across film genres styled in Spotify green tones.
   - **Chart 2: Movies by Release Decade** (Bar Chart): Shows the catalog distribution across decades (1970s, 1980s, 1990s, 2000s, 2010s, 2020s) with Spotify green bars.
   - **Full Catalog Analysis**: Analyzes the complete entertainment collection with live KPI summary indicators.

---

## 🚀 How to Run Locally

### Using Python:
```bash
cd C:\Users\mohii\.gemini\antigravity-ide\scratch\movie-explorer
python -m http.server 8080
```
Open **[http://localhost:8080](http://localhost:8080)** in your browser.

### Using Node / npm:
```bash
npm start
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📁 File Structure

```
movie-explorer/
├── data/
│   └── movies.json        # 28 movie records with 100% verified TMDB posters & trailers
├── css/
│   └── style.css          # Spotify green palette (#1DB954 on #121212), responsive cards, modal
├── js/
│   ├── app.js             # Simplified controller (keyword search, 5 genres, modal)
│   └── charts.js          # Exactly 2 Chart.js visualizations in Spotify green hues
├── index.html             # Clean portal structure without spotlight banner
├── vercel.json            # One-click static deployment for Vercel
├── package.json           # Node scripts
└── README.md              # Project documentation
```
