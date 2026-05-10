import { useState } from 'react'
import { useMapStore } from '../../store/useMapStore'
import ScoreBar from '../UI/ScoreBar'
import type { Country } from '../../types/country'

const INDICATOR_LABELS: Record<string, string> = {
  politicalStability:       'Political Stability',
  economicDirection:        'Economic Direction',
  investmentAttractiveness: 'Investment Attractiveness',
  geopoliticalRisk:         'Geopolitical Risk',
  educationQuality:         'Education Quality',
  healthcareQuality:        'Healthcare Quality',
  technologyInvestment:     'Technology Investment',
}

const RELATIONSHIP_COLORS: Record<string, string> = {
  ally:             'bg-emerald-900 text-emerald-300 border-emerald-700',
  treaty_ally:      'bg-emerald-900 text-emerald-300 border-emerald-700',
  strategic_partner:'bg-blue-900 text-blue-300 border-blue-700',
  trade_partner:    'bg-sky-900 text-sky-300 border-sky-700',
  neutral:          'bg-slate-800 text-slate-300 border-slate-600',
  contested:        'bg-amber-900 text-amber-300 border-amber-700',
  rival:            'bg-orange-900 text-orange-300 border-orange-700',
  enemy:            'bg-red-900 text-red-300 border-red-700',
}

type Tab = 'overview' | 'indicators' | 'relationships' | 'perspectives' | 'history' | 'investment'

function flagEmoji(iso2: string) {
  return iso2
    .toUpperCase()
    .split('')
    .map((c) => String.fromCodePoint(0x1f1e6 - 65 + c.charCodeAt(0)))
    .join('')
}

function formatPop(n: number) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  return n.toLocaleString()
}

export default function CountryPanel() {
  const { countryData, loading, error, clearSelection } = useMapStore()
  const [tab, setTab] = useState<Tab>('overview')

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-sm">Loading intelligence data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-400 p-6">
        <div className="text-4xl mb-3">🗺️</div>
        <p className="text-sm text-center text-slate-500">{error}</p>
        <button
          onClick={clearSelection}
          className="mt-4 text-xs text-blue-400 hover:text-blue-300 underline"
        >
          Back to map
        </button>
      </div>
    )
  }

  if (!countryData) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 p-6 text-center">
        <div className="text-5xl mb-4">🌍</div>
        <p className="text-sm font-medium text-slate-400 mb-1">Click any country</p>
        <p className="text-xs text-slate-600">
          View historical context, geopolitical relationships, competing perspectives, and investment intelligence.
        </p>
      </div>
    )
  }

  const c: Country = countryData

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview',      label: 'Overview' },
    { id: 'indicators',    label: 'Indicators' },
    { id: 'relationships', label: 'Relations' },
    { id: 'perspectives',  label: 'Perspectives' },
    { id: 'history',       label: 'History' },
    { id: 'investment',    label: 'Investment' },
  ]

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-slate-800 flex-shrink-0">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-2xl">{flagEmoji(c.iso2)}</span>
              <h2 className="text-lg font-bold text-white">{c.name}</h2>
            </div>
            <p className="text-xs text-slate-500">{c.subregion} · {c.capital}</p>
          </div>
          <button
            onClick={clearSelection}
            className="text-slate-500 hover:text-slate-300 text-xl leading-none p-1"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <p className="text-xs text-slate-600 mt-1">Updated {c.lastUpdated}</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 flex-shrink-0 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
              tab === t.id
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-4">

        {tab === 'overview' && (
          <div>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">{c.summary}</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-800 rounded-lg p-3">
                <p className="text-slate-500 mb-0.5">Population</p>
                <p className="text-white font-semibold">{formatPop(c.demographics.population)}</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-3">
                <p className="text-slate-500 mb-0.5">Median Age</p>
                <p className="text-white font-semibold">{c.demographics.medianAge}</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-3">
                <p className="text-slate-500 mb-0.5">Urbanization</p>
                <p className="text-white font-semibold">{c.demographics.urbanizationRate}%</p>
              </div>
              <div className="bg-slate-800 rounded-lg p-3">
                <p className="text-slate-500 mb-0.5">Alliances</p>
                <p className="text-white font-semibold">{c.alliances.length} memberships</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs text-slate-500 mb-1.5">Religion</p>
              {c.demographics.religions.map((r) => (
                <div key={r.name} className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${r.percent}%` }} />
                  </div>
                  <span className="text-xs text-slate-400 w-24 text-right">{r.name} {r.percent}%</span>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <p className="text-xs text-slate-500 mb-1.5">Alliances & Memberships</p>
              <div className="flex flex-wrap gap-1">
                {c.alliances.map((a) => (
                  <span key={a} className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'indicators' && (
          <div>
            <p className="text-xs text-slate-500 mb-3">Scores 1–10 · Confidence level shown</p>
            {Object.entries(INDICATOR_LABELS).map(([key, label]) => (
              <ScoreBar
                key={key}
                label={label}
                indicator={c.indicators[key as keyof typeof c.indicators]}
              />
            ))}
          </div>
        )}

        {tab === 'relationships' && (
          <div>
            <p className="text-xs text-slate-500 mb-3">{c.relationships.length} key relationships</p>
            {c.relationships.map((r) => (
              <div
                key={r.countryId}
                className="mb-3 p-3 bg-slate-800 rounded-lg border border-slate-700"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-white">{r.countryName}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${RELATIONSHIP_COLORS[r.type] || RELATIONSHIP_COLORS.neutral}`}>
                    {r.type.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-snug">{r.summary}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'perspectives' && (
          <div>
            <p className="text-xs text-slate-500 mb-3">
              Competing narratives — no single view is endorsed.
            </p>
            {c.perspectives.map((p, i) => (
              <div key={i} className="mb-4 border-l-2 border-blue-700 pl-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-blue-300">{p.source}</span>
                  <span className="text-xs text-slate-600">· {p.bias}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{p.view}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'history' && (
          <div>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">{c.historicalContext.summary}</p>
            <p className="text-xs text-slate-500 mb-2">Key Events</p>
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-700" />
              {c.historicalContext.keyEvents.map((e, i) => (
                <div key={i} className="flex gap-3 mb-3 relative">
                  <div className="w-16 flex-shrink-0 text-right">
                    <span className="text-xs font-mono text-blue-400">{e.year}</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-1 relative z-10" />
                  <p className="text-xs text-slate-300 leading-snug">{e.event}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'investment' && (
          <div>
            <div className="mb-4">
              <p className="text-xs font-semibold text-emerald-400 mb-2">✓ Strengths</p>
              {c.investmentNotes.strengths.map((s, i) => (
                <p key={i} className="text-xs text-slate-300 mb-1.5 flex gap-2">
                  <span className="text-emerald-600 flex-shrink-0">•</span> {s}
                </p>
              ))}
            </div>
            <div className="mb-4">
              <p className="text-xs font-semibold text-red-400 mb-2">⚠ Risks</p>
              {c.investmentNotes.risks.map((r, i) => (
                <p key={i} className="text-xs text-slate-300 mb-1.5 flex gap-2">
                  <span className="text-red-600 flex-shrink-0">•</span> {r}
                </p>
              ))}
            </div>
            <div className="mb-4">
              <p className="text-xs font-semibold text-blue-400 mb-2">Key Sectors</p>
              <div className="flex flex-wrap gap-1">
                {c.investmentNotes.sectors.map((s) => (
                  <span key={s} className="text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded border border-blue-800">
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-2">Sources</p>
              {c.sources.map((s, i) => (
                <a
                  key={i}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300 block mb-1 underline"
                >
                  {s.name} ↗
                </a>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
