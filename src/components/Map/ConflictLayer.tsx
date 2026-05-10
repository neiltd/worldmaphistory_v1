import { Marker } from 'react-simple-maps'
import { useMapStore } from '../../store/useMapStore'
import type { Conflict } from '../../types/conflict'
import conflictsData from '../../data/conflicts.json'

const conflicts = conflictsData as Conflict[]

const INTENSITY_COLOR: Record<string, string> = {
  critical: '#ef4444',
  high:     '#f97316',
  medium:   '#eab308',
  low:      '#84cc16',
}

const INTENSITY_SIZE: Record<string, number> = {
  critical: 9,
  high:     7,
  medium:   5,
  low:      4,
}

const TYPE_LABEL: Record<string, string> = {
  armed_conflict:      '⚔',
  civil_war:           '⚔',
  territorial_dispute: '⚑',
  naval_tension:       '⚓',
  frozen_conflict:     '❄',
}

export default function ConflictLayer() {
  const { selectConflict, selectedConflict } = useMapStore()

  return (
    <>
      {conflicts.map((conflict) => {
        const color = INTENSITY_COLOR[conflict.intensity]
        const size  = INTENSITY_SIZE[conflict.intensity]
        const isSelected = selectedConflict?.id === conflict.id

        return (
          <Marker
            key={conflict.id}
            coordinates={conflict.coordinates}
            onClick={() => selectConflict(conflict)}
          >
            {/* Outer pulse ring */}
            <circle
              r={size * 2.5}
              fill={color}
              fillOpacity={0}
              stroke={color}
              strokeWidth={1}
              strokeOpacity={isSelected ? 0.8 : 0.4}
              className="conflict-pulse-ring"
            />
            {/* Inner solid dot */}
            <circle
              r={size}
              fill={color}
              fillOpacity={isSelected ? 1 : 0.85}
              stroke="#0f1117"
              strokeWidth={1}
              style={{ cursor: 'pointer' }}
            />
            {/* Icon */}
            <text
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={size * 0.9}
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            >
              {TYPE_LABEL[conflict.type] || '⚔'}
            </text>
          </Marker>
        )
      })}
    </>
  )
}
