# World Intelligence v1

**[Live site →](https://neiltd.github.io/worldmaphistory_v1/)**

The first version of a world map for geopolitical research: click a country to read its profile, and switch layers for active conflicts, trade routes and shipping chokepoints.

This version was the prototype. [World Intelligence v2](https://github.com/neiltd/worldmaphistory_v2) rebuilt it on MapLibre GL with GPU-rendered layers and added 1,500+ infrastructure points.

## What's in it

- **214 country profiles** (`src/data/countries/*.json`): indicators, alliances, relationships, different countries' perspectives, history, investment notes and sources, matched to the map by ISO code.
- **30 active conflicts** with the parties involved, their roles, intensity and location.
- **19 trade routes and 18 chokepoints** across shipping, rail and pipeline corridors.
- A Natural Earth projection with a graticule grid, in a dark navy style modeled on the Council on Foreign Relations' conflict tracker.

## Stack

React 19, TypeScript, Vite, react-simple-maps (SVG), Zustand for state, Tailwind CSS. GitHub Actions builds and deploys to GitHub Pages on every push.

## Run it

```bash
npm install
npm run dev
```
