import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Package, AlertTriangle, Search } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { TopBar } from '../components/Nav'

export default function Corredores() {
  const { aisles, products, alerts } = useApp()
  const [search, setSearch] = useState('')

  const filteredAisles = aisles.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    String(a.number).includes(search)
  )

  return (
    <div className="page-enter flex flex-col" style={{ height: '100vh' }}>
      <TopBar title="Corredores" subtitle={`${aisles.length} corredores cadastrados`} />

      <div className="px-4 pt-3 pb-2 bg-white border-b border-slate-100">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar corredor..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:bg-white transition-colors"
          />
        </div>
      </div>

      <div className="overflow-y-auto flex-1 px-4 py-3 space-y-2">
        {filteredAisles.map(aisle => {
          const aisleProducts = products.filter(p => p.aisleId === aisle.id)
          const aisleAlerts = alerts.filter(a => !a.resolved && aisleProducts.some(p => p.id === a.productId))
          const criticalAlerts = aisleAlerts.filter(a => a.severity === 'high')
          const outOfStock = aisleProducts.filter(p => p.quantity === 0).length

          return (
            <Link
              key={aisle.id}
              to={`/corredor/${aisle.id}`}
              className="block bg-white border border-slate-100 rounded-2xl p-4 active:bg-slate-50 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="bg-blue-600 text-white rounded-xl w-10 h-10 flex items-center justify-center font-bold text-base flex-shrink-0" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {aisle.number}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900">{aisle.name}</p>
                    <p className="text-xs text-slate-500 truncate">{aisle.description}</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-300 flex-shrink-0 mt-1" />
              </div>

              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-50">
                <div className="flex items-center gap-1.5">
                  <Package size={13} className="text-slate-400" />
                  <span className="text-xs text-slate-500">{aisleProducts.length} produto{aisleProducts.length !== 1 ? 's' : ''}</span>
                </div>
                {aisleAlerts.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle size={13} className={criticalAlerts.length > 0 ? 'text-red-500' : 'text-amber-500'} />
                    <span className={`text-xs font-medium ${criticalAlerts.length > 0 ? 'text-red-600' : 'text-amber-600'}`}>
                      {aisleAlerts.length} alerta{aisleAlerts.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
                {outOfStock > 0 && (
                  <div className="ml-auto">
                    <span className="bg-red-100 text-red-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      {outOfStock} sem estoque
                    </span>
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
