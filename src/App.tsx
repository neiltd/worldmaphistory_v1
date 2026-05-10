import WorldMap from './components/Map/WorldMap'
import CountryPanel from './components/Panel/CountryPanel'
import ConflictCard from './components/Panel/ConflictCard'
import LayerToggle from './components/UI/LayerToggle'
import { useMapStore } from './store/useMapStore'

export default function App() {
  const { selectedCountryId, selectedConflict } = useMapStore()
  const showSidePanel = !!selectedCountryId

  return (
    <div className="flex flex-col h-screen bg-[#0f1117] text-slate-200">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-slate-800 flex-shrink-0 bg-slate-900/80 backdrop-blur gap-3">
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-lg">🌍</span>
          <div>
            <h1 className="text-sm font-bold text-white leading-none">World Map History</h1>
            <p className="text-xs text-slate-500 leading-none mt-0.5">Geopolitical Intelligence</p>
          </div>
        </div>

        {/* Layer toggles — center */}
        <div className="flex-1 flex justify-center">
          <LayerToggle />
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-xs text-slate-600 hidden lg:block">
            Click country or conflict marker
          </span>
          <a
            href="https://github.com/neiltd/worldmaphistory_v1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            GitHub ↗
          </a>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Map */}
        <div className={`transition-all duration-300 ${showSidePanel ? 'flex-1' : 'w-full'}`}>
          <WorldMap />
        </div>

        {/* Country side panel */}
        {showSidePanel && (
          <div className="w-80 xl:w-96 flex-shrink-0 border-l border-slate-800 bg-slate-900 overflow-hidden">
            <CountryPanel />
          </div>
        )}

        {/* Conflict floating card */}
        {selectedConflict && !showSidePanel && <ConflictCard />}
        {selectedConflict && showSidePanel && (
          <div className="absolute bottom-4 right-4 w-72 z-30">
            <ConflictCard />
          </div>
        )}

        {/* Empty state hint */}
        {!selectedCountryId && !selectedConflict && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-center pointer-events-none whitespace-nowrap">
            <p className="text-sm text-slate-300 font-medium">Click any country or conflict marker</p>
            <p className="text-xs text-slate-500 mt-0.5">Toggle layers above · Scroll to zoom · Drag to pan</p>
          </div>
        )}
      </div>
    </div>
  )
}
