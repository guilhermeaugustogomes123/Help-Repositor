import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Search, Pencil, Trash2, AlertTriangle, RefreshCw, X, Check, Package } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { PriorityBadge } from '../components/Nav'
import { Product, Priority, QuantityUnit } from '../types'

function ProductForm({ initial, aisleId, onSave, onCancel }: {
  initial?: Partial<Product>
  aisleId: string
  onSave: (data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState({
    name: initial?.name ?? '',
    barcode: initial?.barcode ?? '',
    price: initial?.price ?? 0,
    expiryDate: initial?.expiryDate ?? '',
    quantity: initial?.quantity ?? 0,
    quantityUnit: initial?.quantityUnit ?? 'unidade' as QuantityUnit,
    priority: initial?.priority ?? 'media' as Priority,
    minStock: initial?.minStock ?? 10,
    maxStock: initial?.maxStock ?? 50,
    aisleId,
  })

  const set = (k: string, v: unknown) => setForm(prev => ({ ...prev, [k]: v }))

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave({ ...form, paletteId: initial?.paletteId })
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="bg-white rounded-t-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-4 py-4 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-lg" style={{ fontFamily: 'Outfit, sans-serif' }}>
            {initial?.name ? 'Editar Produto' : 'Novo Produto'}
          </h2>
          <button onClick={onCancel} className="p-2 rounded-full hover:bg-slate-100">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <Field label="Nome do Produto *">
            <input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Ex: Leite Integral Itambé 1L" className="input-base" />
          </Field>

          <Field label="Código de Barras">
            <input value={form.barcode} onChange={e => set('barcode', e.target.value)} placeholder="7896005800101" className="input-base font-mono text-sm" />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Preço (R$) *">
              <input required type="number" step="0.01" min="0" value={form.price} onChange={e => set('price', parseFloat(e.target.value))} className="input-base" />
            </Field>
            <Field label="Validade *">
              <input required type="date" value={form.expiryDate} onChange={e => set('expiryDate', e.target.value)} className="input-base" />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Quantidade *">
              <input required type="number" min="0" value={form.quantity} onChange={e => set('quantity', parseInt(e.target.value))} className="input-base" />
            </Field>
            <Field label="Unidade">
              <select value={form.quantityUnit} onChange={e => set('quantityUnit', e.target.value)} className="input-base">
                <option value="unidade">Unidade</option>
                <option value="caixa">Caixa</option>
              </select>
            </Field>
          </div>

          <Field label="Prioridade">
            <div className="flex gap-2">
              {(['alta', 'media', 'baixa'] as Priority[]).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => set('priority', p)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all ${
                    form.priority === p
                      ? p === 'alta' ? 'bg-red-100 border-red-300 text-red-700'
                        : p === 'media' ? 'bg-amber-100 border-amber-300 text-amber-700'
                        : 'bg-green-100 border-green-300 text-green-700'
                      : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}
                >
                  {p === 'alta' ? 'Alta' : p === 'media' ? 'Média' : 'Baixa'}
                </button>
              ))}
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Estoque Mínimo">
              <input type="number" min="0" value={form.minStock} onChange={e => set('minStock', parseInt(e.target.value))} className="input-base" />
            </Field>
            <Field label="Estoque Máximo">
              <input type="number" min="0" value={form.maxStock} onChange={e => set('maxStock', parseInt(e.target.value))} className="input-base" />
            </Field>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 active:bg-blue-700">
            <Check size={18} />
            {initial?.name ? 'Salvar Alterações' : 'Cadastrar Produto'}
          </button>
        </form>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-500 mb-1.5">{label}</label>
      {children}
    </div>
  )
}

export default function CorredorDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { aisles, products, alerts, addProduct, updateProduct, deleteProduct, addManualReplenishment } = useApp()

  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const aisle = aisles.find(a => a.id === id)
  const aisleProducts = products.filter(p => p.aisleId === id && p.name.toLowerCase().includes(search.toLowerCase()))

  if (!aisle) return <div className="p-4 text-slate-500">Corredor não encontrado.</div>

  function formatPrice(n: number) {
    return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  }

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString('pt-BR')
  }

  function getStockStatus(p: Product) {
    if (p.quantity === 0) return { label: 'Zerado', color: 'text-red-600 bg-red-50 border border-red-200' }
    if (p.quantity / p.maxStock < 0.25) return { label: 'Baixo', color: 'text-amber-600 bg-amber-50 border border-amber-200' }
    return { label: 'OK', color: 'text-green-600 bg-green-50 border border-green-200' }
  }

  function getProductAlerts(productId: string) {
    return alerts.filter(a => !a.resolved && a.productId === productId)
  }

  return (
    <div className="page-enter flex flex-col" style={{ height: '100vh' }}>
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 pt-4 pb-3 flex items-center gap-3 sticky top-0 z-40">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-xl hover:bg-slate-100">
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white text-xs font-bold rounded-lg px-2 py-0.5">#{aisle.number}</span>
            <h1 className="font-bold text-slate-900 text-base truncate" style={{ fontFamily: 'Outfit, sans-serif' }}>{aisle.name}</h1>
          </div>
          <p className="text-xs text-slate-500">{aisleProducts.length} produto{aisleProducts.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white rounded-xl p-2.5">
          <Plus size={18} />
        </button>
      </header>

      {/* Search */}
      <div className="px-4 pt-3 pb-2 bg-white border-b border-slate-100">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar produto..." className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-400 focus:bg-white transition-colors" />
        </div>
      </div>

      {/* Product list */}
      <div className="overflow-y-auto flex-1 px-4 py-3 space-y-2">
        {aisleProducts.length === 0 && (
          <div className="text-center py-16 text-slate-400">
            <Package size={40} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">Nenhum produto encontrado</p>
          </div>
        )}
        {aisleProducts.map(product => {
          const stockStatus = getStockStatus(product)
          const productAlerts = getProductAlerts(product.id)
          const daysToExpiry = Math.ceil((new Date(product.expiryDate).getTime() - Date.now()) / 86400000)

          return (
            <div key={product.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
              {productAlerts.length > 0 && (
                <div className={`px-3 py-1.5 flex items-center gap-2 ${productAlerts[0].severity === 'high' ? 'bg-red-50 border-b border-red-100' : 'bg-amber-50 border-b border-amber-100'}`}>
                  <AlertTriangle size={12} className={productAlerts[0].severity === 'high' ? 'text-red-500' : 'text-amber-500'} />
                  <span className={`text-[11px] font-medium ${productAlerts[0].severity === 'high' ? 'text-red-700' : 'text-amber-700'}`}>
                    {productAlerts[0].message}
                  </span>
                </div>
              )}
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 text-sm leading-tight">{product.name}</p>
                    {product.barcode && (
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">{product.barcode}</p>
                    )}
                  </div>
                  <PriorityBadge priority={product.priority} />
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3">
                  <InfoChip label="Preço" value={formatPrice(product.price)} />
                  <InfoChip label="Estoque" value={`${product.quantity} ${product.quantityUnit === 'caixa' ? 'cx' : 'un'}`} valueClass={stockStatus.color.split(' ')[0]} />
                  <InfoChip label="Validade" value={formatDate(product.expiryDate)} valueClass={daysToExpiry <= 7 ? 'text-red-600' : daysToExpiry <= 30 ? 'text-amber-600' : 'text-slate-700'} />
                </div>

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-50">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${stockStatus.color}`}>
                    {stockStatus.label}
                  </span>
                  <div className="flex-1" />
                  <button onClick={() => addManualReplenishment(product.id)} className="flex items-center gap-1 text-amber-600 text-[11px] font-medium py-1 px-2 rounded-lg hover:bg-amber-50 transition-colors">
                    <RefreshCw size={12} />
                    Repor
                  </button>
                  <button onClick={() => setEditProduct(product)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => setDeleteConfirm(product.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-400">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {(showForm || editProduct) && (
        <ProductForm
          initial={editProduct ?? undefined}
          aisleId={id!}
          onSave={data => {
            if (editProduct) {
              updateProduct(editProduct.id, data)
            } else {
              addProduct(data)
            }
            setShowForm(false)
            setEditProduct(null)
          }}
          onCancel={() => { setShowForm(false); setEditProduct(null) }}
        />
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-xs">
            <h3 className="font-bold text-slate-900 mb-2">Remover produto?</h3>
            <p className="text-sm text-slate-500 mb-5">Esta ação não pode ser desfeita.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 border border-slate-200 rounded-xl text-slate-600 font-medium text-sm">Cancelar</button>
              <button onClick={() => { deleteProduct(deleteConfirm); setDeleteConfirm(null) }} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-medium text-sm">Remover</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InfoChip({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="bg-slate-50 rounded-lg px-2 py-1.5">
      <p className="text-[9px] text-slate-400 uppercase font-semibold tracking-wide mb-0.5">{label}</p>
      <p className={`text-xs font-semibold ${valueClass ?? 'text-slate-700'}`}>{value}</p>
    </div>
  )
}
