import { Link } from 'react-router-dom'
import { Bell, RefreshCw, Package, TrendingDown, AlertTriangle, Layers, BoxIcon, History, ChevronRight, Clock, CalendarDays } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { TopBar } from '../components/Nav'

export default function Dashboard() {
  const { products, alerts, replenishment, history, daysOff } = useApp()

  const activeAlerts = alerts.filter(a => !a.resolved)
  const highAlerts = activeAlerts.filter(a => a.severity === 'high')
  const outOfStock = products.filter(p => p.quantity === 0)
  const expiringSoon = activeAlerts.filter(a => a.type === 'validade' && a.severity === 'high')

  const recentHistory = history.slice(0, 5)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const nextDayOff = daysOff
    .map(day => ({ ...day, days: Math.ceil((new Date(`${day.date}T00:00:00`).getTime() - today.getTime()) / 86400000) }))
    .filter(day => day.days >= 0)
    .sort((a, b) => a.days - b.days)[0]

  const actionTypeColor: Record<string, string> = {
    cadastro: 'bg-blue-100 text-blue-700',
    edicao: 'bg-slate-100 text-slate-700',
    reposicao: 'bg-amber-100 text-amber-700',
    remocao: 'bg-red-100 text-red-700',
    alerta: 'bg-orange-100 text-orange-700',
    palete: 'bg-purple-100 text-purple-700',
  }
  const actionTypeLabel: Record<string, string> = {
    cadastro: 'Cadastro', edicao: 'Edição', reposicao: 'Reposição',
    remocao: 'Remoção', alerta: 'Alerta', palete: 'Palete',
  }

  function timeAgo(ts: string) {
    const diff = Date.now() - new Date(ts).getTime()
    const h = Math.floor(diff / 3600000)
    const d = Math.floor(diff / 86400000)
    if (d > 0) return `${d}d atrás`
    if (h > 0) return `${h}h atrás`
    return 'Agora'
  }

  return (
    <div className="page-enter">
      <TopBar
        title="StockShelf"
        subtitle="Gestão de Estoque"
        action={
          <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-3 py-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-green-700 font-medium">Online</span>
          </div>
        }
      />

      <div className="overflow-y-auto" style={{ height: 'calc(100vh - 56px - 64px)' }}>
        {/* Alert banner */}
        {highAlerts.length > 0 && (
          <Link to="/alertas" className="block mx-4 mt-4 bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-center gap-3">
            <div className="bg-red-100 rounded-lg p-2 flex-shrink-0">
              <AlertTriangle size={18} className="text-red-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-red-800 text-sm">{highAlerts.length} alerta{highAlerts.length !== 1 ? 's' : ''} crítico{highAlerts.length !== 1 ? 's' : ''}</p>
              <p className="text-xs text-red-600 truncate">Requer atenção imediata</p>
            </div>
            <ChevronRight size={16} className="text-red-400 flex-shrink-0" />
          </Link>
        )}

        {nextDayOff && nextDayOff.days <= 7 && (
          <Link to="/rotina" className="block mx-4 mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-center gap-3">
            <div className="bg-amber-400 rounded-lg p-2 flex-shrink-0"><CalendarDays size={18} className="text-slate-900" /></div>
            <div className="flex-1">
              <p className="font-semibold text-amber-900 text-sm">Sua {nextDayOff.type === 'folga' ? 'folga' : 'férias'} está chegando</p>
              <p className="text-xs text-amber-700">{nextDayOff.days === 0 ? 'É hoje' : `Faltam ${nextDayOff.days} dias`}</p>
            </div>
            <ChevronRight size={16} className="text-amber-500" />
          </Link>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3 px-4 mt-4">
          <StatCard to="/alertas" color="blue" icon={<Bell size={20} />} value={activeAlerts.length} label="Alertas Ativos" />
          <StatCard to="/reposicao" color="amber" icon={<RefreshCw size={20} />} value={replenishment.length} label="Reposições" />
          <StatCard to="/corredores" color="slate" icon={<Package size={20} />} value={products.length} label="Produtos" />
          <StatCard to="/alertas" color="red" icon={<TrendingDown size={20} />} value={outOfStock.length} label="Sem Estoque" />
        </div>

        {/* Quick actions */}
        <div className="px-4 mt-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Acesso Rápido</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { to: '/alertas', icon: <Bell size={20} className="text-red-500" />, label: 'Alertas', bg: 'bg-red-50' },
              { to: '/reposicao', icon: <RefreshCw size={20} className="text-amber-500" />, label: 'Reposição', bg: 'bg-amber-50' },
              { to: '/paletes', icon: <Layers size={20} className="text-purple-500" />, label: 'Paletes', bg: 'bg-purple-50' },
              { to: '/caixaria', icon: <BoxIcon size={20} className="text-blue-500" />, label: 'Caixaria', bg: 'bg-blue-50' },
              { to: '/historico', icon: <History size={20} className="text-slate-500" />, label: 'Histórico', bg: 'bg-slate-50' },
              { to: '/corredores', icon: <Package size={20} className="text-green-500" />, label: 'Produtos', bg: 'bg-green-50' },
              { to: '/rotina', icon: <CalendarDays size={20} className="text-blue-600" />, label: 'Minha rotina', bg: 'bg-blue-50' },
            ].map(({ to, icon, label, bg }) => (
              <Link key={to} to={to} className="flex flex-col items-center gap-2 py-3 rounded-xl bg-white border border-slate-100 hover:border-slate-200 transition-all active:scale-95">
                <div className={`${bg} rounded-lg p-2`}>{icon}</div>
                <span className="text-[11px] font-medium text-slate-600">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Expiring products */}
        {expiringSoon.length > 0 && (
          <div className="px-4 mt-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Vencimento Crítico</p>
              <Link to="/alertas" className="text-xs text-blue-600 font-medium">Ver tudo</Link>
            </div>
            <div className="space-y-2">
              {expiringSoon.slice(0, 3).map(alert => {
                const product = products.find(p => p.id === alert.productId)
                if (!product) return null
                return (
                  <div key={alert.id} className="bg-white border border-red-100 rounded-xl p-3 flex items-center gap-3">
                    <div className="bg-red-100 rounded-lg p-1.5 flex-shrink-0">
                      <Clock size={14} className="text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{product.name}</p>
                      <p className="text-xs text-red-600">{alert.message}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Recent history */}
        <div className="px-4 mt-5 mb-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Atividade Recente</p>
            <Link to="/historico" className="text-xs text-blue-600 font-medium">Ver tudo</Link>
          </div>
          <div className="bg-white border border-slate-100 rounded-xl overflow-hidden">
            {recentHistory.map((entry, i) => (
              <div key={entry.id} className={`flex items-start gap-3 px-4 py-3 ${i < recentHistory.length - 1 ? 'border-b border-slate-50' : ''}`}>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${actionTypeColor[entry.actionType] || 'bg-slate-100 text-slate-600'}`}>
                  {actionTypeLabel[entry.actionType] || entry.actionType}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-700 leading-relaxed">{entry.description}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{entry.user} · {timeAgo(entry.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ to, color, icon, value, label }: { to: string; color: string; icon: React.ReactNode; value: number; label: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-600 text-white',
    amber: 'bg-amber-500 text-white',
    slate: 'bg-slate-700 text-white',
    red: 'bg-red-500 text-white',
    green: 'bg-green-500 text-white',
  }
  return (
    <Link to={to} className={`${colors[color]} rounded-2xl p-4 flex flex-col gap-2 active:opacity-80 transition-opacity`}>
      <div className="opacity-80">{icon}</div>
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs opacity-80 font-medium">{label}</p>
      </div>
    </Link>
  )
}
