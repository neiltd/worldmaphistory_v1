import { useState } from 'react'
import React from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from 'react-simple-maps'
import { useMapStore } from '../../store/useMapStore'

// Free TopoJSON world map from naturalearth via cdn.jsdelivr.net
const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

// Countries with rich data (highlights slightly)
const RICH_DATA = new Set(['840', '156', '764']) // USA, CHN, THA (numeric ISO)

export default function WorldMap() {
  const { countryData, selectCountry } = useMapStore()
  const [tooltip, setTooltip] = useState<{ name: string; x: number; y: number } | null>(null)
  const [position, setPosition] = useState<{ coordinates: [number, number]; zoom: number }>({
    coordinates: [0, 20],
    zoom: 1,
  })

  function getCountryFill(geo: { id: string; properties: Record<string, string> }) {
    const numId = geo.id

    // Selected country
    if (countryData) {
      // Highlight related countries
      const related = countryData.relationships.map((r) => r.countryId)

      // Map ISO3 to ISO numeric for highlighting (limited set for now)
      const iso3ToNum: Record<string, string> = {
        USA: '840', CHN: '156', RUS: '643', GBR: '826', THA: '764', MYS: '458',
      }

      if (related.some((r) => iso3ToNum[r] === numId)) {
        const rel = countryData.relationships.find((r) => iso3ToNum[r.countryId] === numId)
        if (rel) {
          if (rel.sentiment === 'positive') return '#1d4ed8'
          if (rel.sentiment === 'negative') return '#991b1b'
          return '#92400e'
        }
      }
    }

    if (RICH_DATA.has(numId)) return '#1e3a5f'

    return '#1a2035'
  }

  return (
    <div className="relative w-full h-full bg-[#0d1321] overflow-hidden">
      {/* Zoom controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-1">
        <button
          onClick={() => setPosition((p) => ({ ...p, zoom: Math.min(p.zoom * 1.5, 8) }))}
          className="w-8 h-8 bg-slate-800 hover:bg-slate-700 text-white rounded text-lg font-bold flex items-center justify-center border border-slate-700"
        >
          +
        </button>
        <button
          onClick={() => setPosition((p) => ({ ...p, zoom: Math.max(p.zoom / 1.5, 1) }))}
          className="w-8 h-8 bg-slate-800 hover:bg-slate-700 text-white rounded text-lg font-bold flex items-center justify-center border border-slate-700"
        >
          −
        </button>
        <button
          onClick={() => setPosition({ coordinates: [0, 20], zoom: 1 })}
          className="w-8 h-8 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded text-xs flex items-center justify-center border border-slate-700"
          title="Reset view"
        >
          ⊙
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-slate-900/90 rounded-lg p-2 border border-slate-800 text-xs">
        <p className="text-slate-500 mb-1.5 font-medium">Relationship legend</p>
        {[
          { color: 'bg-blue-800', label: 'Ally / Partner' },
          { color: 'bg-amber-900', label: 'Mixed / Neutral' },
          { color: 'bg-red-900', label: 'Rival / Enemy' },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-2 mb-1">
            <div className={`w-3 h-3 rounded-sm ${l.color}`} />
            <span className="text-slate-400">{l.label}</span>
          </div>
        ))}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-20 bg-slate-900 text-white text-xs px-2 py-1 rounded pointer-events-none border border-slate-700"
          style={{ left: tooltip.x + 12, top: tooltip.y - 28 }}
        >
          {tooltip.name}
        </div>
      )}

      <ComposableMap
        projection="geoMercator"
        style={{ width: '100%', height: '100%' }}
        projectionConfig={{ scale: 130 }}
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={(pos: { coordinates: [number, number]; zoom: number }) => setPosition(pos)}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: import('react-simple-maps').Geography[] }) =>
              geographies.map((geo: import('react-simple-maps').Geography) => {
                const isSelected =
                  countryData &&
                  ['840', '156', '764'].includes(geo.id) &&
                  (
                    (countryData.id === 'USA' && geo.id === '840') ||
                    (countryData.id === 'CHN' && geo.id === '156') ||
                    (countryData.id === 'THA' && geo.id === '764')
                  )

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={isSelected ? '#3b82f6' : getCountryFill(geo)}
                    stroke="#0d1321"
                    strokeWidth={0.5}
                    style={{
                      default: { outline: 'none' },
                      hover:   { outline: 'none', fill: '#2563eb', cursor: 'pointer' },
                      pressed: { outline: 'none' },
                    }}
                    onMouseEnter={(e: React.MouseEvent<SVGPathElement>) => {
                      setTooltip({
                        name: geo.properties.name,
                        x: e.clientX,
                        y: e.clientY,
                      })
                    }}
                    onMouseMove={(e: React.MouseEvent<SVGPathElement>) => {
                      setTooltip((t) => t ? { ...t, x: e.clientX, y: e.clientY } : null)
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    onClick={() => {
                      setTooltip(null)
                      // Map numeric ISO to our ISO-3 codes
                      const numToIso3: Record<string, string> = {
                        '840': 'USA',
                        '156': 'CHN',
                        '764': 'THA',
                      }
                      const id = numToIso3[geo.id]
                      if (id) selectCountry(id)
                      else selectCountry(geo.properties.name)
                    }}
                  />
                )
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  )
}
