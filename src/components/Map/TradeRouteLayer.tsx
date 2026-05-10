import { Line, Marker } from 'react-simple-maps'
import tradeData from '../../data/trade-routes.json'
import type { TradeRoute, Chokepoint } from '../../types/traderoute'

const routes     = tradeData.routes as TradeRoute[]
const chokepoints = tradeData.chokepoints as Chokepoint[]

const VOLUME_COLOR: Record<string, string> = {
  critical:  '#06b6d4',
  very_high: '#0ea5e9',
  high:      '#3b82f6',
  medium:    '#6366f1',
  low:       '#8b5cf6',
}

const VOLUME_WIDTH: Record<string, number> = {
  critical:  3,
  very_high: 2.5,
  high:      2,
  medium:    1.5,
  low:       1,
}

const RISK_COLOR: Record<string, string> = {
  low:    '#22c55e',
  medium: '#f59e0b',
  high:   '#ef4444',
}

const IMPORTANCE_SIZE: Record<string, number> = {
  critical: 7,
  high:     5,
  medium:   4,
}

interface Props {
  showRoutes: boolean
  showChokepoints: boolean
}

export default function TradeRouteLayer({ showRoutes, showChokepoints }: Props) {
  return (
    <>
      {showRoutes && routes.map((route) => (
        <Line
          key={route.id}
          from={route.from.coords}
          to={route.to.coords}
          stroke={VOLUME_COLOR[route.volume]}
          strokeWidth={VOLUME_WIDTH[route.volume]}
          strokeOpacity={0.6}
          strokeLinecap="round"
          curve={0.3}
          style={{ pointerEvents: 'none' }}
        />
      ))}

      {showChokepoints && chokepoints.map((cp) => {
        const size  = IMPORTANCE_SIZE[cp.importance]
        const color = RISK_COLOR[cp.riskLevel]

        return (
          <Marker key={cp.id} coordinates={cp.coordinates}>
            {/* Diamond shape via rotated rect */}
            <rect
              x={-size}
              y={-size}
              width={size * 2}
              height={size * 2}
              fill={color}
              fillOpacity={0.9}
              stroke="#0f1117"
              strokeWidth={1}
              transform="rotate(45)"
              style={{ cursor: 'pointer' }}
            />
            <title>{cp.name}</title>
          </Marker>
        )
      })}
    </>
  )
}
