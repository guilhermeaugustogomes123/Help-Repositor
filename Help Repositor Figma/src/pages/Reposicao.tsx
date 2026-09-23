import { useState } from 'react'
import { RefreshCw, AlertTriangle, Package, Plus, Check, X } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { TopBar, PriorityBadge } from '../components/Nav'

export default function Reposicao() {
  const { replenishment, products, aisles, addManualReplenishment } = useApp()
  const [manualSearch, setManualSearch] = useState('')
  const [showAddManual, setShowAddManual] = useState(false)

  const sorted = [...replenishment].sort((a, b) => {
    const prio = { alta: 0, media: 1, baixa: 2 }
    if (prio[a.priority] !== prio[b.priority]) return prio[a.priority] - prio[b.priority]
    if (a.reason !== b.reason) return a.reason === 'acabou' ? -1 : 1
    return 0
  })

  const searchResults = manualSearch.length > 1
    ? products.filter(p =>
        p.name.toLowerCase().includes(manualSearch.toLowerCase()) &&
        !replenishment.find(r => r.productId === p.id)
      ).slice(0, 8)
    : []

  function getAisleName(productId: string) {
    const product = products.find(p => p.id === productId)
    const aisle = aisles.find(a => a.id === product?.aisleId)
    return aisle?.name ?? '—'
  }

  function formatDate(ts: string) {
    return new Date(ts).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="page-enter flex flex-col" style={{ height: '100vh' }}>
      <TopBar
        title="Reposição"
        subtitle={`${sorted.length} produto${sorted.length !== 1 ? 's' : ''} na lista`}
        action={
          <button
            onClick={() => setShowAddManual(!showAddManual)}
            className="flex items-center gap-1.5 bg-blue-600 text-white rounded-xl px-3 py-2 text-sm font-medium"
          >
            <Plus size={15} />
            Manual
          </button>
        }
      />

      {/* Manual add search */}
      {showAddManual && (
        <div className="px-4 pt-3 pb-2 bg-amber-50 border-b border-amber-100">
          <p className="text-xs font-semibold text-amber-700 mb-2">Adicionar reposição manual:</p>
          <input
            value={manualSearch}
            onChange={e => setManualSearch(e.target.value)}
            placeholder="Buscar produto para adicionar..."
            className="w-full px-3 py-2.5 bg-white border border-amber-200 rounded-xl text-sm outline-none focus:border-amber-400"
            autoFocus
          />
          {searchResults.length > 0 && (
            <div className="mt-2 bg-white border border-amber-100 rounded-xl overflow-hidden">
              {searchResults.map(p => (
                <button
                  key={p.id}
                  onClick={() => { addManualReplenishment(p.id); setManualSearch(''); setShowAddManual(false) }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-amber-50 border-b border-slate-50 last:border-0"
                >
                  <Package size={14} className="text-slate-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-slate-800 truncate">{p.name}</p>
                    <p className="text-[10px] text-slate-400">Corredor: {getAisleName(p.id)}</p>
                  </div>
                  <Plus size={14} className="text-amber-500 flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="overflow-y-auto flex-1 px-4 py-3 space-y-3">
        {sorted.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <RefreshCw size={40} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm font-medium">Lista de reposição vazia</p>
            <p className="text-xs mt-1">Adicione manualmente ou aguarde alertas automáticos</p>
          </div>
        )}

        {/* Group by priority */}
        {(['alta', 'media', 'baixa'] as const).map(priority => {
          const group = sorted.filter(r => r.priority === priority)
          if (group.length === 0) return null
          return (
            <div key={priority}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider ${
                  priority === 'alta' ? 'text-red-600' : priority === 'media' ? 'text-amber-600' : 'text-green-600'
                }`}>
                  Prioridade {priority === 'alta' ? 'Alta' : priority === 'media' ? 'Média' : 'Baixa'}
                </span>
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-[10px] text-slate-400">{group.length}</span>
              </div>
              <div className="space-y-2">
                {group.map(item => {
                  const product = products.find(p => p.id === item.productId)
                  if (!product) return null
                  return (
                    <div key={item.productId} className={`bg-white border rounded-2xl p-3.5 ${
                      item.reason === 'acabou' ? 'border-red-100' : 'border-amber-100'
                    }`}>
                      <div className="flex items-start gap-3">
                        <div className={`rounded-lg p-2 flex-shrink-0 ${item.reason === 'acabou' ? 'bg-red-100' : 'bg-amber-100'}`}>
                          {item.reason === 'acabou'
                            ? <AlertTriangle size={16} className="text-red-600" />
                            : <RefreshCw size={16} className="text-amber-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-900 text-sm leading-tight">{product.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{getAisleName(product.id)}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <div className={`text-xs font-semibold rounded-lg px-2 py-1 ${
                              item.reason === 'acabou' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {item.reason === 'acabou' ? '⚠ Zerado — pedir tudo' : '↓ Acabando — pedir menos'}
                            </div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-lg font-bold text-slate-900">{item.quantity}</p>
                          <p className="text-[10px] text-slate-400">{item.unit === 'caixa' ? 'caixas' : 'unidades'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-50">
                        <span className="text-[10px] text-slate-400">
                          {item.isManual ? '📝 Manual' : '🤖 Automático'} · {formatDate(item.requestedAt)}
                        </span>
                        <PriorityBadge priority={item.priority} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
