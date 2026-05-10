# World Map History — Project Briefing for Claude Code

## Who You Are Working With
- **Owner:** Neil (thanapol.ds@gmail.com), Thailand-based investor and analyst
- **Goal:** Build a geopolitical intelligence platform for long-term investment research
- **Workflow:** Claude Code = developer. Gemini = research and data generation.
- **Hosting:** GitHub Pages — static site only, no backend server

## Project Location
```
~/Desktop/Projects/worldmaphistory_v1/
```
GitHub: https://github.com/neiltd/worldmaphistory_v1
Live site: https://neiltd.github.io/worldmaphistory_v1/

---

## What Is Already Built (V1 — Complete)

### Features
- Interactive world map (react-simple-maps, Mercator projection)
- Click any country → side panel with 6 tabs: Overview, Indicators, Relations, Perspectives, History, Investment
- **214 country JSON profiles** (Gemini-generated) in `src/data/countries/[ISO3].json`
- **Conflict layer** — 30 active conflicts with pulsing markers (red=critical, orange=high, yellow=medium)
- **Trade route layer** — 19 major shipping/rail/pipeline routes as curved lines
- **Chokepoint layer** — 18 strategic chokepoints as diamond markers
- Layer toggles in header (Conflicts on by default, Trade Routes and Chokepoints off)
- Conflict detail card popup on marker click
- ISO numeric → ISO-3 lookup table covering ~195 countries

### Tech Stack
| Concern | Library |
|---|---|
| Framework | React 19 + Vite 8 + TypeScript |
| Map | react-simple-maps v3 (SVG, no API key needed) |
| State | Zustand v5 |
| Styling | Tailwind CSS v4 (@tailwindcss/vite) |
| Deploy | GitHub Actions → GitHub Pages |

### Key Files
```
src/
  App.tsx                          # Root layout, layer visibility, side panels
  store/useMapStore.ts             # All global state (country, conflict, layer toggles)
  types/country.ts                 # Country data schema (TypeScript)
  types/conflict.ts                # Conflict data schema
  types/traderoute.ts              # Trade route + chokepoint schema
  types/react-simple-maps.d.ts    # Manual type declarations for react-simple-maps
  data/
    countries/[ISO3].json          # 214 country profiles (lazy-loaded on click)
    conflicts.json                 # 30 active conflicts and tension zones
    trade-routes.json              # { routes: [...19], chokepoints: [...18] }
  components/
    Map/WorldMap.tsx               # Map, zoom controls, legend, ISO numeric lookup
    Map/ConflictLayer.tsx          # Pulsing conflict markers
    Map/TradeRouteLayer.tsx        # Trade route lines + chokepoint diamonds
    Panel/CountryPanel.tsx         # 6-tab country detail panel
    Panel/ConflictCard.tsx         # Floating conflict detail card
    UI/ScoreBar.tsx                # Indicator score bar (1-10, trend, confidence)
    UI/LayerToggle.tsx             # Header toggle buttons
```

### Country Data Schema (src/types/country.ts)
Each country JSON has: id, iso2, name, region, subregion, capital, lastUpdated, summary,
indicators (7 scored 1-10 with trend+confidence), demographics, alliances,
relationships (countryId, type, sentiment, summary), perspectives (multi-source narratives),
historicalContext (summary + keyEvents), investmentNotes (strengths/risks/sectors), sources.

### Known V1 Issues to Fix in V2
1. **Icon scaling** — conflict/chokepoint markers don't scale with zoom. Need to divide
   marker size by zoom level so they stay geographically proportional.
2. **Trade route details** — no way to see cargo types or density on hover.
   Need tooltip/panel showing route details on hover.
3. **No search** — users must hunt for countries visually. Need fuzzy search (Fuse.js).
4. **No heatmap** — map is static dark color. Need to color countries by indicator.

---

## V2 Feature Backlog (Prioritized)

### Tier 1 — Build First
1. **Search bar** with autocomplete (Fuse.js) — find country by name instantly
2. **Heatmap mode** — dropdown selects an indicator, colors entire world map by score
3. **Marker zoom scaling** — conflict/chokepoint icons scale with zoom level
4. **Trade route hover tooltip** — shows route name, cargo, annual value, risk on hover

### Tier 2 — Core Intelligence Features
5. **Radar/spider chart** — replace score bars with Recharts radar chart for country profile
6. **Country comparison** — select 2 countries → side-by-side radar chart overlay
7. **Mobile layout** — bottom-sheet drawer on mobile, touch-native zoom
8. **Map library upgrade** — migrate to react-map-gl + Mapbox GL for visual quality

### Tier 3 — Live Intelligence (News Agent)
9. **News feed tab** — per-country RSS news feed (Reuters/BBC/Al Jazeera) in country panel
10. **URL news agent** — user pastes a news article URL → Claude reads it → identifies
    related countries → highlights them on map and creates a news note entry
11. **Country highlight from news** — map overlay showing which countries a news story relates to
12. **Watchlist** — save countries to monitor (localStorage), quick-access panel

### Tier 4 — Investment Analysis
13. **Investment screening view** — table of all countries sortable by indicator score
14. **Risk-opportunity matrix** — scatter plot: geopolitical risk vs investment attractiveness
15. **Historical timeline scrubber** — needs historical data (Gemini can generate per country)
16. **Export profile** — save country report as PDF

---

## News Agent Architecture (V2 Plan)

When user pastes a news URL:
1. Claude reads the URL content
2. Extracts: headline, date, summary, list of country ISO3 codes mentioned
3. Writes a `NewsItem` to `src/data/news/[YYYY-MM-DD]-[slug].json`
4. Map temporarily highlights related countries in a distinct color
5. Country panel shows linked news items in a "News" tab

### NewsItem schema (to implement):
```typescript
interface NewsItem {
  id: string
  url: string
  headline: string
  source: string
  date: string
  summary: string           // Claude-generated 2-3 sentence summary
  relatedCountries: string[] // ISO3 codes
  tags: string[]            // e.g. ["conflict", "trade", "election"]
  addedBy: "manual" | "scheduled"
}
```

### Scheduled news sources (future):
- ACLED data export (conflict events, weekly)
- World Bank API (economic indicators, quarterly)
- SIPRI (military expenditure, annual)
- RSS: Reuters World, BBC World, Al Jazeera — parsed client-side via allorigins.win proxy

---

## Development Workflow

### Adding new country data:
1. Ask Gemini using the schema in src/types/country.ts
2. Save as `[ISO3].json` in `src/data/countries/`
3. No code changes needed — the store lazy-imports by ID

### Adding new conflicts:
1. Add entries to `src/data/conflicts.json` array
2. Must include: id, name, type, intensity, status, startYear, coordinates [lon,lat],
   region, parties, summary, currentStatus, casualties, internationalInvolvement

### Adding trade routes / chokepoints:
1. Add to `routes` or `chokepoints` arrays in `src/data/trade-routes.json`

### Deploy:
```bash
git add . && git commit -m "message" && git push
# GitHub Actions auto-deploys to GitHub Pages (~60 seconds)
```

### Install notes:
```bash
npm install --legacy-peer-deps  # react-simple-maps has React 19 peer dep conflict
```

---

## Investment Analysis Context
Neil uses this platform for long-term investment research. Features should prioritize:
- **Comparative analysis** (which countries are improving vs declining)
- **Risk identification** (geopolitical risk, political instability)
- **Sector opportunities** (per country investmentNotes.sectors)
- **Relationship mapping** (supply chain dependencies, alliance shifts)
- **Multi-perspective reading** (avoid single-narrative bias in investment decisions)

When building features, ask: "Does this help an investor make a better decision?"

---

## Gemini Prompt Templates

### For country data:
Use the schema in `src/types/country.ts`. Request JSON only, no explanation.
Key instruction: "Include at least 4 competing perspectives from different ideological viewpoints."

### For conflict data:
Use the schema in `src/types/conflict.ts`. Coordinates are [longitude, latitude].
Request array format only.

### For trade route data:
Use the schema in `src/types/traderoute.ts`. Separate routes and chokepoints objects.

---

## V2 Repo Plan
Start a new repo: `worldmaphistory_v2`
- Copy `src/data/` folder entirely from v1
- Rebuild UI from scratch with improvements
- Same Vite + React + TypeScript + Tailwind base
- Add Recharts, Framer Motion, Fuse.js, react-map-gl

To start: `! cd ~/Desktop/Projects && cp -r worldmaphistory_v1/src/data /tmp/geo-data-backup`
