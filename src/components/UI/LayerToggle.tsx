import { useMapStore } from '../../store/useMapStore'

export default function LayerToggle() {
  const {
    showConflicts, toggleConflicts,
    showTradeRoutes, toggleTradeRoutes,
    showChokepoints, toggleChokepoints,
  } = useMapStore()

  const layers = [
    {
      label: 'Conflicts',
      active: showConflicts,
      toggle: toggleConflicts,
      activeClass: 'bg-red-900/60 text-red-300 border-red-700',
      inactiveClass: 'bg-slate-800/60 text-slate-500 border-slate-700',
      dot: 'bg-red-500',
    },
    {
      label: 'Trade Routes',
      active: showTradeRoutes,
      toggle: toggleTradeRoutes,
      activeClass: 'bg-cyan-900/60 text-cyan-300 border-cyan-700',
      inactiveClass: 'bg-slate-800/60 text-slate-500 border-slate-700',
      dot: 'bg-cyan-500',
    },
    {
      label: 'Chokepoints',
      active: showChokepoints,
      toggle: toggleChokepoints,
      activeClass: 'bg-amber-900/60 text-amber-300 border-amber-700',
      inactiveClass: 'bg-slate-800/60 text-slate-500 border-slate-700',
      dot: 'bg-amber-500',
    },
  ]

  return (
    <div className="flex items-center gap-1.5">
      {layers.map((l) => (
        <button
          key={l.label}
          onClick={l.toggle}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
            l.active ? l.activeClass : l.inactiveClass
          }`}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${l.active ? l.dot : 'bg-slate-600'}`} />
          {l.label}
        </button>
      ))}
    </div>
  )
}
