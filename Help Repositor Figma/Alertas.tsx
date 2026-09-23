import { useState } from 'react'
import { AlertTriangle, Clock, TrendingDown, CheckCircle, Filter } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { TopBar } from '../components/Nav'
import { Alert } from '../types'

type FilterType = 'todos' | 'validade' | 'estoque'

export default function Alertas() {
  const { alerts, products, resolveAlert } = useApp()
  const [filter, setFilter] = useState<FilterType>('todos')
  const [showResolved, setShowResolved] = useState(false)

  const filtered = alerts
    .filter(a => showResolved ? a.resolved : !a.resolved)
    .filter(a => filter === 'todos' ? true : a.type === filter)
    .sort((a, b) => {
      const sev = { high: 0, medium: 1, low: 2 }
      return sev[a.severity] - sev[b.severity]
    })

  const activeCount = alerts.filter(a => !a.resolved).length
  const highCount = alerts.filter(a => !a.resolved && a.severity === 'high').length
  const expiryCount = alerts.filter(a => !a.resolved && a.type === 'validade').length
  const stockCount = alerts.filter(a => !a.resolved && a.type === 'estoque').length

  const severityIcon = (a: Alert) => {
    if (a.type === 'validade') return <Clock size={16} className={a.severity === 'high' ? 'text-red-500' : a.severity === 'medium' ? 'text-amber-500' : 'text-blue-500'} />
    return <TrendingDown size={16} className={a.severity === 'high' ? 'text-red-500' : a.severity === 'medium' ? 'text-amber-500' : 'text-blue-500'} />
  }

  const severityBg = (a: Alert) => {
    if (a.severity === 'high') return 'bg-red-50 border-red-100'
    if (a.severity === 'medium') return 'bg-amber-50 border-amber-100'
    return 'bg-blue-50 border-blue-100'
  }

  return (
    <div className="page-enter flex flex-col" style={{ height: '100vh' }}>
      <TopBar title="Alertas" subtitle={`${activeCount} ativo${activeCount !== 1 ? 's' : ''}`} />

      {/* Summary chips */}
      <div className="px-4 pt-3 pb-2 bg-white border-b border-slate-100">
        <div className="grid grid-cols-3 gap-2 mb-3">
          <SummaryChip label="Críticos" value={highCount} color="red" />
          <SummaryChip label="Validade" value={expiryCount} color="amber" />
          <SummaryChip label="Estoque" value={stockCount} color="blue" />
        </div>
        <div className="flex gap-2">
          {(['todos', 'validade', 'estoque'] as FilterType[]).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === f ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {f === 'todos' ? 'Todos' : f === 'validade' ? 'Validade' : 'Estoque'}
            </button>
          ))}
          <button
            onClick={() => setShowResolved(!showResolved)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              showResolved ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
            }`}
          >
            {showResolved ? 'Resolvidos' : 'Pendentes'}
          </button>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 px-4 py-3 space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <CheckCircle size={40} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm font-medium">Nenhum alerta {showResolved ? 'resolvido' : 'ativo'}</p>
            <p className="text-xs mt-1">Tudo sob controle!</p>
          </div>
        )}
        {filtered.map(alert => {
          const product = products.find(p => p.id === alert.productId)
          return (
            <div key={alert.id} className={`bg-white border rounded-2xl overflow-hidden ${alert.resolved ? 'opacity-60' : ''}`}>
              <div className={`p-3 border ${severityBg(alert)}`}>
                <div className="flex items-start gap-3">
                  <div className={`rounded-lg p-2 flex-shrink-0 ${
                    alert.severity === 'high' ? 'bg-red-100' : alert.severity === 'medium' ? 'bg-amber-100' : 'bg-blue-100'
                  }`}>
                    {severityIcon(alert)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wide ${
                        alert.type === 'validade' ? 'text-orange-600' : 'text-blue-600'
                      }`}>
                        {alert.type === 'validade' ? 'Validade' : 'Estoque'}
                      </span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                        alert.severity === 'high' ? 'bg-red-100 text-red-700'
                        : alert.severity === 'medium' ? 'bg-amber-100 text-amber-700'
                        : 'bg-blue-100 text-blue-700'
                      }`}>
                        {alert.severity === 'high' ? 'Crítico' : alert.severity === 'medium' ? 'Moderado' : 'Baixo'}
                      </span>
                    </div>
                    {product && (
                      <p className="font-semibold text-slate-900 text-sm leading-tight">{product.name}</p>
                    )}
                    <p className="text-xs text-slate-600 mt-1">{alert.message}</p>
                  </div>
                </div>
                {!alert.resolved && (
                  <button
                    onClick={() => resolveAlert(alert.id)}
                    className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    <CheckCircle size={13} />
                    Marcar como resolvido
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function SummaryChip({ label, value, color }: { label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    red: 'bg-red-50 border-red-200 text-red-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
  }
  return (
    <div className={`border rounded-xl p-2 text-center ${colors[color]}`}>
      <p className="text-lg font-bold">{value}</p>
      <p className="text-[10px] font-medium opacity-80">{label}</p>
    </div>
  )
}
