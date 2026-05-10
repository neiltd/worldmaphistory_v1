import WorldMap from './components/Map/WorldMap'
import CountryPanel from './components/Panel/CountryPanel'
import { useMapStore } from './store/useMapStore'

export default function App() {
  const { selectedCountryId } = useMapStore()

  return (
    <div className="flex flex-col h-screen bg-[#0f1117] text-slate-200">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800 flex-shrink-0 bg-slate-900/80 backdrop-blur">
        <div className="flex items-center gap-3">
          <span className="text-lg">🌍</span>
          <div>
            <h1 className="text-sm font-bold text-white leading-none">World Map History</h1>
            <p className="text-xs text-slate-500 leading-none mt-0.5">Geopolitical Intelligence Platform</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-600 hidden sm:block">
            Click any country · Scroll to zoom · Drag to pan
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
        <div className={`transition-all duration-300 ${selectedCountryId ? 'flex-1' : 'w-full'}`}>
          <WorldMap />
        </div>

        {/* Side panel */}
        {selectedCountryId && (
          <div className="w-80 xl:w-96 flex-shrink-0 border-l border-slate-800 bg-slate-900 overflow-hidden">
            <CountryPanel />
          </div>
        )}

        {/* Empty state hint when nothing selected */}
        {!selectedCountryId && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-center pointer-events-none">
            <p className="text-sm text-slate-300 font-medium">Click a country to explore</p>
            <p className="text-xs text-slate-500 mt-0.5">USA, China &amp; Thailand have full data</p>
          </div>
        )}
      </div>
    </div>
  )
}
