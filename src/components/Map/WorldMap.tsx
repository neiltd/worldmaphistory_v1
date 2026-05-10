import { useState } from 'react'
import React from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Sphere,
  Graticule,
} from 'react-simple-maps'
import { useMapStore } from '../../store/useMapStore'
import ConflictLayer from './ConflictLayer'
import TradeRouteLayer from './TradeRouteLayer'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

// UN numeric ISO 3166-1 → ISO-3 alpha codes
// Source: ISO 3166 Maintenance Agency
const NUM_TO_ISO3: Record<string, string> = {
  '004': 'AFG', '008': 'ALB', '012': 'DZA', '024': 'AGO', '028': 'ATG',
  '032': 'ARG', '036': 'AUS', '040': 'AUT', '031': 'AZE', '044': 'BHS',
  '048': 'BHR', '050': 'BGD', '052': 'BRB', '112': 'BLR', '056': 'BEL',
  '084': 'BLZ', '204': 'BEN', '064': 'BTN', '068': 'BOL', '070': 'BIH',
  '072': 'BWA', '076': 'BRA', '096': 'BRN', '100': 'BGR', '854': 'BFA',
  '108': 'BDI', '116': 'KHM', '120': 'CMR', '124': 'CAN', '132': 'CPV',
  '140': 'CAF', '148': 'TCD', '152': 'CHL', '156': 'CHN', '170': 'COL',
  '174': 'COM', '178': 'COG', '180': 'COD', '188': 'CRI', '384': 'CIV',
  '191': 'HRV', '192': 'CUB', '196': 'CYP', '203': 'CZE', '208': 'DNK',
  '262': 'DJI', '214': 'DOM', '218': 'ECU', '818': 'EGY', '222': 'SLV',
  '226': 'GNQ', '232': 'ERI', '233': 'EST', '231': 'ETH', '242': 'FJI',
  '246': 'FIN', '250': 'FRA', '266': 'GAB', '270': 'GMB', '268': 'GEO',
  '276': 'DEU', '288': 'GHA', '300': 'GRC', '308': 'GRD', '320': 'GTM',
  '324': 'GIN', '624': 'GNB', '328': 'GUY', '332': 'HTI', '340': 'HND',
  '348': 'HUN', '356': 'IND', '360': 'IDN', '364': 'IRN', '368': 'IRQ',
  '372': 'IRL', '376': 'ISR', '380': 'ITA', '388': 'JAM', '392': 'JPN',
  '400': 'JOR', '398': 'KAZ', '404': 'KEN', '296': 'KIR', '408': 'PRK',
  '410': 'KOR', '414': 'KWT', '417': 'KGZ', '418': 'LAO', '422': 'LBN',
  '426': 'LSO', '430': 'LBR', '434': 'LBY', '440': 'LTU', '442': 'LUX',
  '450': 'MDG', '454': 'MWI', '458': 'MYS', '462': 'MDV', '466': 'MLI',
  '470': 'MLT', '478': 'MRT', '484': 'MEX', '583': 'FSM', '498': 'MDA',
  '496': 'MNG', '504': 'MAR', '508': 'MOZ', '104': 'MMR', '516': 'NAM',
  '520': 'NRU', '524': 'NPL', '528': 'NLD', '554': 'NZL', '558': 'NIC',
  '562': 'NER', '566': 'NGA', '578': 'NOR', '512': 'OMN', '586': 'PAK',
  '585': 'PLW', '591': 'PAN', '598': 'PNG', '600': 'PRY', '604': 'PER',
  '608': 'PHL', '616': 'POL', '620': 'PRT', '634': 'QAT', '642': 'ROU',
  '643': 'RUS', '646': 'RWA', '659': 'KNA', '662': 'LCA', '670': 'VCT',
  '882': 'WSM', '678': 'STP', '682': 'SAU', '686': 'SEN', '694': 'SLE',
  '706': 'SOM', '710': 'ZAF', '724': 'ESP', '144': 'LKA', '729': 'SDN',
  '740': 'SUR', '752': 'SWE', '756': 'CHE', '760': 'SYR', '762': 'TJK',
  '834': 'TZA', '764': 'THA', '626': 'TLS', '768': 'TGO', '776': 'TON',
  '780': 'TTO', '788': 'TUN', '792': 'TUR', '795': 'TKM', '798': 'TUV',
  '800': 'UGA', '804': 'UKR', '784': 'ARE', '826': 'GBR', '840': 'USA',
  '858': 'URY', '860': 'UZB', '548': 'VUT', '862': 'VEN', '704': 'VNM',
  '887': 'YEM', '894': 'ZMB', '716': 'ZWE', '020': 'AND', '051': 'ARM',
  '352': 'ISL', '438': 'LIE', '492': 'MCO', '807': 'MKD', '480': 'MUS',
  '688': 'SRB', '703': 'SVK', '705': 'SVN', '090': 'SLB',
}

export default function WorldMap() {
  const { countryData, selectCountry, showConflicts, showTradeRoutes, showChokepoints } = useMapStore()
  const [tooltip, setTooltip] = useState<{ name: string; x: number; y: number } | null>(null)
  const [position, setPosition] = useState<{ coordinates: [number, number]; zoom: number }>({
    coordinates: [0, 10],
    zoom: 1,
  })

  // Build reverse map (ISO3 → numeric) for relationship highlighting
  const iso3ToNum = Object.fromEntries(
    Object.entries(NUM_TO_ISO3).map(([num, iso3]) => [iso3, num])
  )

  function getCountryFill(numId: string): string {
    if (!countryData) return '#152035'

    const thisIso3 = NUM_TO_ISO3[numId]

    // Currently selected country
    if (thisIso3 === countryData.id) return '#2563eb'

    // Relationship highlight
    const rel = countryData.relationships.find(
      (r) => r.countryId === thisIso3 || iso3ToNum[r.countryId] === numId
    )
    if (rel) {
      if (rel.sentiment === 'positive') return '#1e3a8a'
      if (rel.sentiment === 'negative') return '#7f1d1d'
      return '#78350f'
    }

    // Has data file
    if (thisIso3) return '#1a2f50'

    return '#101825'
  }

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: '#060f1c' }}>
      {/* Zoom controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-1">
        <button
          onClick={() => setPosition((p) => ({ ...p, zoom: Math.min(p.zoom * 1.5, 8) }))}
          className="w-8 h-8 text-white rounded text-lg font-bold flex items-center justify-center border transition-colors"
          style={{ background: '#111c30', borderColor: '#1e2d45' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#1a2744')}
          onMouseLeave={e => (e.currentTarget.style.background = '#111c30')}
        >
          +
        </button>
        <button
          onClick={() => setPosition((p) => ({ ...p, zoom: Math.max(p.zoom / 1.5, 1) }))}
          className="w-8 h-8 text-white rounded text-lg font-bold flex items-center justify-center border transition-colors"
          style={{ background: '#111c30', borderColor: '#1e2d45' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#1a2744')}
          onMouseLeave={e => (e.currentTarget.style.background = '#111c30')}
        >
          −
        </button>
        <button
          onClick={() => setPosition({ coordinates: [0, 10], zoom: 1 })}
          className="w-8 h-8 rounded text-xs flex items-center justify-center border transition-colors"
          style={{ background: '#111c30', borderColor: '#1e2d45', color: '#64748b' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#1a2744')}
          onMouseLeave={e => (e.currentTarget.style.background = '#111c30')}
          title="Reset view"
        >
          ⊙
        </button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 rounded-lg p-2 text-xs border" style={{ background: '#0d1626cc', borderColor: '#1e2d45' }}>
        <p className="mb-1.5 font-medium" style={{ color: '#475569' }}>Map legend</p>
        {[
          { color: '#2563eb', label: 'Selected' },
          { color: '#1e3a8a', label: 'Ally / Partner' },
          { color: '#78350f', label: 'Mixed / Neutral' },
          { color: '#7f1d1d', label: 'Rival / Enemy' },
          { color: '#1a2f50', label: 'Has data' },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-sm" style={{ background: l.color }} />
            <span style={{ color: '#94a3b8' }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-20 text-white text-xs px-2 py-1 rounded pointer-events-none shadow-lg border"
          style={{ left: tooltip.x + 12, top: tooltip.y - 28, background: '#0d1626', borderColor: '#1e2d45' }}
        >
          {tooltip.name}
        </div>
      )}

      <ComposableMap
        projection="geoNaturalEarth1"
        style={{ width: '100%', height: '100%' }}
        projectionConfig={{ scale: 118 }}
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={(pos: { coordinates: [number, number]; zoom: number }) => setPosition(pos)}
        >
          {/* Ocean fill */}
          <Sphere id="rsm-sphere" fill="#0c2340" stroke="#1a3a5c" strokeWidth={0.4} />
          {/* Lat/lon grid lines */}
          <Graticule stroke="#1a3555" strokeWidth={0.25} />
          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: import('react-simple-maps').Geography[] }) =>
              geographies.map((geo: import('react-simple-maps').Geography) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={getCountryFill(geo.id)}
                  stroke="#0a1220"
                  strokeWidth={0.4}
                  style={{
                    default: { outline: 'none' },
                    hover:   { outline: 'none', fill: '#1d4ed8', cursor: 'pointer' },
                    pressed: { outline: 'none' },
                  }}
                  onMouseEnter={(e: React.MouseEvent<SVGPathElement>) => {
                    setTooltip({ name: geo.properties.name, x: e.clientX, y: e.clientY })
                  }}
                  onMouseMove={(e: React.MouseEvent<SVGPathElement>) => {
                    setTooltip((t) => t ? { ...t, x: e.clientX, y: e.clientY } : null)
                  }}
                  onMouseLeave={() => setTooltip(null)}
                  onClick={() => {
                    setTooltip(null)
                    const iso3 = NUM_TO_ISO3[geo.id]
                    if (iso3) selectCountry(iso3)
                  }}
                />
              ))
            }
          </Geographies>
          {/* Trade routes layer (behind conflicts) */}
          <TradeRouteLayer showRoutes={showTradeRoutes} showChokepoints={showChokepoints} />

          {/* Conflict markers layer */}
          {showConflicts && <ConflictLayer />}

        </ZoomableGroup>
      </ComposableMap>
    </div>
  )
}
