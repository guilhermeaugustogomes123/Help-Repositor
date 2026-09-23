import { useState } from 'react'
import { History, Search, Package, RefreshCw, Pencil, Trash2, AlertTriangle, Layers, Plus } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { TopBar } from '../components/Nav'
import { HistoryActionType } from '../types'

const ACTION_CONFIG: Record<HistoryActionType, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  cadastro: { label: 'Cadastro', icon: <Plus size={13} />, color: 'text-blue-700', bg: 'bg-blue-100' },
  edicao: { label: 'Edição', icon: <Pencil size={13} />, color: 'text-slate-700', bg: 'bg-slate-100' },
  reposicao: { label: 'Reposição', icon: <RefreshCw size={13} />, color: 'text-amber-700', bg: 'bg-amber-100' },
  remocao: { label: 'Remoção', icon: <Trash2 size={13} />, color: 'text-red-700', bg: 'bg-red-100' },
  alerta: { label: 'Alerta', icon: <AlertTriangle size={13} />, color: 'text-orange-700', bg: 'bg-orange-100' },
  palete: { label: 'Palete', icon: <Layers size={13} />, color: 'text-purple-700', bg: 'bg-purple-100' },
}

export default function Historico() {
  const { history } = useApp()
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<HistoryActionType | 'todos'>('todos')

  const filtered = history.filter(h => {
    const matchesSearch = search === '' ||
      h.description.toLowerCase().includes(search.toLowerCase()) ||
      (h.productName?.toLowerCase().includes(search.toLowerCase())) ||
      h.user.toLowerCase().includes(search.toLowerCase())
    const matchesType = filterType === 'todos' || h.actionType === filterType
    return matchesSearch && matchesType
  })

  function formatTimestamp(ts: string) {
    const d = new Date(ts)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const hours = diff / 3600000
    const days = diff / 86400000

    if (days > 1) {
      return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) + ' às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
    if (hours > 1) return `${Math.floor(hours)}h atrás`
    return 'Agora há pouco'
  }

  // Group by date
  const grouped: Record<string, typeof filtered> = {}
  filtered.forEach(h => {
    const d = new Date(h.timestamp).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })
    if (!grouped[d]) grouped[d] = []
    grouped[d].push(h)
  })

  return (
    <div className="page-enter flex flex-col" style={{ height: '100vh' }}>
      <TopBar title="Histórico" subtitle={`${history.length} registros`} />

      <div className="px-4 pt-3 pb-2 bg-white border-b border-slate-100 space-y-2">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar no histórico..." className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:bg-white" />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
          {(['todos', 'cadastro', 'edicao', 'reposicao', 'remocao', 'alerta', 'palete'] as const).map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`flex-shrink-0 py-1.5 px-3 rounded-lg text-[11px] font-semibold transition-colors ${
                filterType === t ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {t === 'todos' ? 'Todos' : ACTION_CONFIG[t].label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-y-auto flex-1 px-4 py-3">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <History size={40} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">Nenhum registro encontrado</p>
          </div>
        )}

        {Object.entries(grouped).map(([date, entries]) => (
          <div key={date} className="mb-5">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 capitalize">{date}</p>
            <div className="relative">
              <div className="absolute left-[18px] top-0 bottom-0 w-px bg-slate-100" />
              <div className="space-y-3 pl-10">
                {entries.map((entry, i) => {
                  const config = ACTION_CONFIG[entry.actionType]
                  return (
                    <div key={entry.id} className="relative">
                      <div className={`absolute -left-[26px] top-1 w-6 h-6 rounded-full flex items-center justify-center z-10 ${config.bg} ${config.color} border-2 border-white`}>
                        {config.icon}
                      </div>
                      <div className="bg-white border border-slate-100 rounded-xl p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            {entry.productName && (
                              <p className="font-semibold text-slate-800 text-sm leading-tight mb-0.5 truncate">{entry.productName}</p>
                            )}
                            <p className="text-xs text-slate-600">{entry.description}</p>
                          </div>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${config.bg} ${config.color}`}>
                            {config.label}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2">
                          {entry.user} · {formatTimestamp(entry.timestamp)}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
