import { useState } from 'react'
import { BoxIcon, Plus, X, Check, Pencil } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { TopBar } from '../components/Nav'
import { BoxItem } from '../types'

export default function Caixaria() {
  const { boxes, products, addBox, updateBox } = useApp()
  const [showForm, setShowForm] = useState(false)
  const [editBox, setEditBox] = useState<BoxItem | null>(null)

  const enriched = boxes.map(b => ({
    ...b,
    product: products.find(p => p.id === b.productId),
  }))

  const totalBoxes = boxes.reduce((sum, b) => sum + (b.unit === 'caixa' ? b.quantity : 0), 0)

  return (
    <div className="page-enter flex flex-col" style={{ height: '100vh' }}>
      <TopBar
        title="Caixaria"
        subtitle={`${boxes.length} itens · ${totalBoxes} caixas`}
        action={
          <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white rounded-xl p-2.5">
            <Plus size={18} />
          </button>
        }
      />

      <div className="overflow-y-auto flex-1 px-4 py-3 space-y-2">
        {enriched.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <BoxIcon size={40} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">Nenhum item na caixaria</p>
          </div>
        )}
        {enriched.map(item => (
          <div key={item.id} className="bg-white border border-slate-100 rounded-2xl p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="bg-blue-50 rounded-xl p-2.5 flex-shrink-0">
                  <BoxIcon size={18} className="text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 text-sm leading-tight truncate">
                    {item.product?.name ?? 'Produto removido'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    📍 {item.location}
                  </p>
                </div>
              </div>
              <button onClick={() => setEditBox(item)} className="p-1.5 rounded-lg hover:bg-slate-100 flex-shrink-0">
                <Pencil size={14} className="text-slate-400" />
              </button>
            </div>
            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-50">
              <div className="bg-slate-50 rounded-lg px-3 py-2 flex-1 text-center">
                <p className="text-2xl font-bold text-slate-900">{item.quantity}</p>
                <p className="text-[10px] text-slate-500 font-medium">{item.unit === 'caixa' ? 'caixas' : 'unidades'}</p>
              </div>
              {item.product && (
                <>
                  <div className="bg-slate-50 rounded-lg px-3 py-2 flex-1 text-center">
                    <p className="text-sm font-bold text-slate-700">
                      {item.product.quantity} {item.product.quantityUnit === 'caixa' ? 'cx' : 'un'}
                    </p>
                    <p className="text-[10px] text-slate-500">Na prateleira</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg px-3 py-2 flex-1 text-center">
                    <p className="text-sm font-bold text-blue-600">
                      {item.quantity + item.product.quantity}
                    </p>
                    <p className="text-[10px] text-slate-500">Total geral</p>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {(showForm || editBox) && (
        <BoxForm
          initial={editBox ?? undefined}
          products={products}
          onSave={data => {
            if (editBox) {
              updateBox(editBox.id, data)
            } else {
              addBox(data)
            }
            setShowForm(false)
            setEditBox(null)
          }}
          onCancel={() => { setShowForm(false); setEditBox(null) }}
        />
      )}
    </div>
  )
}

function BoxForm({ initial, products, onSave, onCancel }: {
  initial?: BoxItem
  products: ReturnType<typeof useApp>['products']
  onSave: (data: Omit<BoxItem, 'id'>) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState({
    productId: initial?.productId ?? '',
    quantity: initial?.quantity ?? 1,
    unit: initial?.unit ?? 'caixa' as 'caixa' | 'unidade',
    location: initial?.location ?? '',
  })
  const [search, setSearch] = useState('')

  const results = search.length > 1
    ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).slice(0, 6)
    : []

  const selectedProduct = products.find(p => p.id === form.productId)

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-white rounded-t-3xl w-full max-h-[85vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-4 py-4 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-lg" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {initial ? 'Editar Item' : 'Novo Item na Caixaria'}
          </h2>
          <button onClick={onCancel} className="p-2 rounded-full hover:bg-slate-100"><X size={20} className="text-slate-500" /></button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Produto *</label>
            {selectedProduct ? (
              <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2.5">
                <span className="text-sm text-blue-800 flex-1">{selectedProduct.name}</span>
                <button onClick={() => setForm(p => ({ ...p, productId: '' }))}><X size={14} className="text-blue-400" /></button>
              </div>
            ) : (
              <>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar produto..." className="input-base" />
                {results.length > 0 && (
                  <div className="border border-slate-200 rounded-xl overflow-hidden mt-2">
                    {results.map(p => (
                      <button key={p.id} type="button" onClick={() => { setForm(prev => ({ ...prev, productId: p.id })); setSearch('') }} className="w-full px-3 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 border-b border-slate-50 last:border-0">
                        {p.name}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Quantidade</label>
              <input type="number" min="0" value={form.quantity} onChange={e => setForm(p => ({ ...p, quantity: parseInt(e.target.value) }))} className="input-base" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">Unidade</label>
              <select value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value as 'caixa' | 'unidade' }))} className="input-base">
                <option value="caixa">Caixa</option>
                <option value="unidade">Unidade</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Localização</label>
            <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="Ex: Caixaria A — Prateleira 2" className="input-base" />
          </div>

          <button
            type="button"
            onClick={() => onSave(form)}
            disabled={!form.productId}
            className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Check size={18} />
            {initial ? 'Salvar' : 'Adicionar à Caixaria'}
          </button>
        </div>
      </div>
    </div>
  )
}
