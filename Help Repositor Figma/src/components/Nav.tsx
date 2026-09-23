import { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Grid3x3, Bell, RefreshCw, Package, BoxIcon, History, Layers } from 'lucide-react'
import { useApp } from '../store/AppContext'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Início' },
  { to: '/corredores', icon: Grid3x3, label: 'Corredores' },
  { to: '/alertas', icon: Bell, label: 'Alertas' },
  { to: '/reposicao', icon: RefreshCw, label: 'Reposição' },
  { to: '/paletes', icon: Layers, label: 'Paletes' },
  { to: '/caixaria', icon: BoxIcon, label: 'Caixaria' },
  { to: '/historico', icon: History, label: 'Histórico' },
]

export function BottomNav() {
  const { alerts } = useApp()
  const activeAlerts = alerts.filter(a => !a.resolved).length

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 safe-bottom">
      <div className="flex items-stretch">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] font-medium transition-colors relative ${
                isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`relative p-1.5 rounded-lg transition-colors ${isActive ? 'bg-blue-50' : ''}`}>
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 1.75} />
                  {label === 'Alertas' && activeAlerts > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
                      {activeAlerts > 99 ? '99+' : activeAlerts}
                    </span>
                  )}
                </div>
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export function TopBar({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <header className="bg-white border-b border-slate-200 px-4 pt-4 pb-3 flex items-start justify-between gap-3 sticky top-0 z-40">
      <div>
        <h1 className="text-lg font-bold text-slate-900 leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </header>
  )
}

export function PriorityBadge({ priority }: { priority: 'alta' | 'media' | 'baixa' }) {
  const labels = { alta: 'Alta', media: 'Média', baixa: 'Baixa' }
  return (
    <span className={`priority-${priority} text-[10px] font-semibold px-2 py-0.5 rounded-full`}>
      {labels[priority]}
    </span>
  )
}

export function EmptyState({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="text-slate-300 mb-3">{icon}</div>
      <p className="font-semibold text-slate-600 mb-1">{title}</p>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  )
}
