import { useState } from 'react'
import { Layers, Package, MapPin, Plus, X, Check, Pencil, ArrowUpDown } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { TopBar } from '../components/Nav'
import { Palette, PaletteLocation } from '../types'

export default function Paletes() {
  const { palettes, products, updatePalette, addPalette } = useApp()
  const [view, setView] = useState<PaletteLocation | 'todos'>('todos')
  const [showForm, setShowForm] = useState(false)
  const [editPalette, setEditPalette] = useState<Palette | null>(null)

  const filtered = palettes.filter(p => view === 'todos' ? true : p.location === view)

  return (
    <div className="page-enter flex flex-col" style={{ height: '100vh' }}>
      <TopBar
        title="Paletes"
        subtitle={`${palettes.length} paletes cadastrados`}
        action={
          <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white rounded-xl p-2.5">
            <Plus size={18} />
          </button>
        }
      />

      {/* View toggle */}
      <div className="px-4 pt-3 pb-2 bg-white border-b border-slate-100">
        <div className="flex gap-2">
          {(['todos', 'pulmao', 'aereo'] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors ${
                view === v ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
              }`}
            >
              {v === 'todos' ? 'Todos' : v === 'pulmao' ? '🏪 Pulmão' : '✈ Aéreo'}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-y-auto flex-1 px-4 py-3 space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <Layers size={40} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">Nenhum palete encontrado</p>
          </div>
        )}
        {filtered.map(palette => {
          const paletteProducts = products.filter(p => palette.productIds.includes(p.id))
          return (
            <div key={palette.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 rounded-lg p-1.5">
                    <Layers size={16} className="text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm font-mono">{palette.code}</p>
                    <span className="text-[10px] text-blue-200 font-medium">
                      {palette.location === 'pulmao' ? '🏪 Pulmão' : '✈ Aéreo'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 rounded-lg px-2.5 py-1 flex items-center gap-1.5">
                    <MapPin size={12} className="text-blue-200" />
                    <span className="text-white text-xs font-semibold font-mono">{palette.position}</span>
                  </div>
                  <button onClick={() => setEditPalette(palette)} className="bg-white/20 p-1.5 rounded-lg">
                    <Pencil size={13} className="text-white" />
                  </button>
                </div>
              </div>

              <div className="p-3">
                {palette.notes && (
                  <p className="text-xs text-slate-500 italic mb-3 pb-3 border-b border-slate-50">{palette.notes}</p>
                )}

                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
                  Produtos ({paletteProducts.length})
                </p>

                {paletteProducts.length === 0 && (
                  <p className="text-xs text-slate-400 py-2">Nenhum produto associado</p>
                )}

                <div className="space-y-1.5">
                  {paletteProducts.map(p => (
                    <div key={p.id} className="flex items-center gap-2 bg-slate-50 rounded-lg px-2.5 py-2">
                      <Package size={12} className="text-slate-400 flex-shrink-0" />
                      <span className="text-xs text-slate-700 flex-1 truncate">{p.name}</span>
                      <span className="text-[10px] font-semibold text-slate-500">{p.quantity} {p.quantityUnit === 'caixa' ? 'cx' : 'un'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {(showForm || editPalette) && (
        <PaletteForm
          initial={editPalette ?? undefined}
          products={products}
          onSave={data => {
            if (editPalette) {
              updatePalette(editPalette.id, data)
            } else {
              addPalette(data)
            }
            setShowForm(false)
            setEditPalette(null)
          }}
          onCancel={() => { setShowForm(false); setEditPalette(null) }}
        />
      )}
    </div>
  )
}

function PaletteForm({ initial, products, onSave, onCancel }: {
  initial?: Palette
  products: ReturnType<typeof useApp>['products']
  onSave: (data: Omit<Palette, 'id'>) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState({
    code: initial?.code ?? '',
    location: initial?.location ?? 'pulmao' as PaletteLocation,
    position: initial?.position ?? '',
    productIds: initial?.productIds ?? [] as string[],
    notes: initial?.notes ?? '',
  })
  const [search, setSearch] = useState('')

  const searchResults = search.length > 1
    ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).slice(0, 6)
    : []

  function toggleProduct(id: string) {
    setForm(prev => ({
      ...prev,
      productIds: prev.productIds.includes(id) ? prev.productIds.filter(x => x !== id) : [...prev.productIds, id]
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-white rounded-t-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-4 py-4 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-lg" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {initial ? 'Editar Palete' : 'Novo Palete'}
          </h2>
          <button onClick={onCancel} className="p-2 rounded-full hover:bg-slate-100"><X size={20} className="text-slate-500" /></button>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Código *</label>
              <input required value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value }))} placeholder="PAL-004" className="input-base font-mono" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Posição *</label>
              <input required value={form.position} onChange={e => setForm(p => ({ ...p, position: e.target.value }))} placeholder="A-01" className="input-base font-mono" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Localização</label>
            <div className="flex gap-2">
              {(['pulmao', 'aereo'] as PaletteLocation[]).map(loc => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, location: loc }))}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                    form.location === loc ? 'bg-blue-600 border-blue-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}
                >
                  {loc === 'pulmao' ? '🏪 Pulmão' : '✈ Aéreo'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Observações</label>
            <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={2} className="input-base resize-none" placeholder="Notas sobre este palete..." />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Produtos ({form.productIds.length} selecionados)</label>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar produto..."
              className="input-base mb-2"
            />
            {searchResults.length > 0 && (
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                {searchResults.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggleProduct(p.id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-slate-50 border-b border-slate-50 last:border-0"
                  >
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${form.productIds.includes(p.id) ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                      {form.productIds.includes(p.id) && <Check size={10} className="text-white" />}
                    </div>
                    <span className="text-sm text-slate-700 truncate">{p.name}</span>
                  </button>
                ))}
              </div>
            )}
            {form.productIds.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.productIds.map(id => {
                  const p = products.find(x => x.id === id)
                  return (
                    <span key={id} className="bg-blue-50 text-blue-700 text-[11px] rounded-lg px-2 py-1 flex items-center gap-1">
                      {p?.name.split(' ').slice(0, 3).join(' ')}
                      <button type="button" onClick={() => toggleProduct(id)}><X size={10} /></button>
                    </span>
                  )
                })}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => onSave(form)}
            className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2"
          >
            <Check size={18} />
            {initial ? 'Salvar Alterações' : 'Criar Palete'}
          </button>
        </div>
      </div>
    </div>
  )
}
