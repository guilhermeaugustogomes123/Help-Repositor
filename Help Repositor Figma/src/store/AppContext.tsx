import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Product, Aisle, Palette, BoxItem, Alert, HistoryEntry, ReplenishmentItem, Priority } from '../types'

const AISLES: Aisle[] = [
  { id: 'a1', number: 1, name: 'Laticínios', description: 'Leites, queijos, iogurtes e derivados' },
  { id: 'a2', number: 2, name: 'Bebidas', description: 'Águas, sucos, refrigerantes e energéticos' },
  { id: 'a3', number: 3, name: 'Higiene Pessoal', description: 'Sabonetes, shampoos e cuidados pessoais' },
  { id: 'a4', number: 4, name: 'Limpeza', description: 'Detergentes, desinfetantes e limpeza geral' },
  { id: 'a5', number: 5, name: 'Frios e Embutidos', description: 'Presuntos, mortadelas e frios em geral' },
  { id: 'a6', number: 6, name: 'Padaria', description: 'Pães, bolos e produtos de panificação' },
  { id: 'a7', number: 7, name: 'Hortifrúti', description: 'Frutas, legumes e verduras frescas' },
  { id: 'a8', number: 8, name: 'Mercearia', description: 'Arroz, feijão, massas e enlatados' },
  { id: 'a9', number: 9, name: 'Confeitaria', description: 'Chocolates, balas e biscoitos' },
  { id: 'a10', number: 10, name: 'Congelados', description: 'Pizzas, nuggets e alimentos congelados' },
]

const SEED_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Leite Integral Itambé 1L', barcode: '7896005800101', price: 4.99, expiryDate: '2025-01-15', quantity: 48, quantityUnit: 'unidade', priority: 'alta', aisleId: 'a1', minStock: 24, maxStock: 120, createdAt: '2024-11-01', updatedAt: '2024-11-20' },
  { id: 'p2', name: 'Queijo Mussarela Fatiado 200g', barcode: '7896005800202', price: 8.90, expiryDate: '2024-12-28', quantity: 5, quantityUnit: 'unidade', priority: 'alta', aisleId: 'a1', minStock: 20, maxStock: 60, createdAt: '2024-11-01', updatedAt: '2024-11-20' },
  { id: 'p3', name: 'Iogurte Natural Danone 170g', barcode: '7896005800303', price: 3.49, expiryDate: '2024-12-20', quantity: 12, quantityUnit: 'unidade', priority: 'media', aisleId: 'a1', minStock: 30, maxStock: 90, createdAt: '2024-11-01', updatedAt: '2024-11-20' },
  { id: 'p4', name: 'Coca-Cola 2L', barcode: '7894900011517', price: 10.99, expiryDate: '2025-06-30', quantity: 3, quantityUnit: 'caixa', priority: 'alta', aisleId: 'a2', minStock: 5, maxStock: 20, createdAt: '2024-11-01', updatedAt: '2024-11-20' },
  { id: 'p5', name: 'Água Mineral Crystal 500ml', barcode: '7894321100150', price: 1.99, expiryDate: '2026-01-01', quantity: 8, quantityUnit: 'caixa', priority: 'media', aisleId: 'a2', minStock: 10, maxStock: 40, createdAt: '2024-11-01', updatedAt: '2024-11-20' },
  { id: 'p6', name: 'Suco Del Valle Uva 1L', barcode: '7896331700015', price: 6.99, expiryDate: '2025-08-15', quantity: 2, quantityUnit: 'caixa', priority: 'baixa', aisleId: 'a2', minStock: 3, maxStock: 12, createdAt: '2024-11-01', updatedAt: '2024-11-20' },
  { id: 'p7', name: 'Shampoo Seda Liso Perfeito 325ml', barcode: '7891150037141', price: 12.90, expiryDate: '2026-05-01', quantity: 36, quantityUnit: 'unidade', priority: 'media', aisleId: 'a3', minStock: 15, maxStock: 60, createdAt: '2024-11-01', updatedAt: '2024-11-20' },
  { id: 'p8', name: 'Sabonete Dove Original 90g', barcode: '7891150032986', price: 3.99, expiryDate: '2026-12-01', quantity: 2, quantityUnit: 'unidade', priority: 'alta', aisleId: 'a3', minStock: 30, maxStock: 120, createdAt: '2024-11-01', updatedAt: '2024-11-20' },
  { id: 'p9', name: 'Detergente Ypê Limão 500ml', barcode: '7896098900108', price: 2.49, expiryDate: '2027-01-01', quantity: 0, quantityUnit: 'unidade', priority: 'alta', aisleId: 'a4', minStock: 24, maxStock: 96, createdAt: '2024-11-01', updatedAt: '2024-11-20' },
  { id: 'p10', name: 'Presunto Cozido Sadia 200g', barcode: '7896085030038', price: 9.50, expiryDate: '2024-12-10', quantity: 8, quantityUnit: 'unidade', priority: 'alta', aisleId: 'a5', minStock: 20, maxStock: 80, createdAt: '2024-11-01', updatedAt: '2024-11-20' },
  { id: 'p11', name: 'Pão de Forma Wickbold Tradicional 500g', barcode: '7896004611234', price: 7.99, expiryDate: '2024-12-08', quantity: 4, quantityUnit: 'unidade', priority: 'alta', aisleId: 'a6', minStock: 15, maxStock: 60, createdAt: '2024-11-01', updatedAt: '2024-11-20' },
  { id: 'p12', name: 'Arroz Tipo 1 Tio João 5kg', barcode: '7896038102014', price: 22.90, expiryDate: '2025-12-01', quantity: 6, quantityUnit: 'caixa', priority: 'alta', aisleId: 'a8', minStock: 10, maxStock: 40, createdAt: '2024-11-01', updatedAt: '2024-11-20' },
  { id: 'p13', name: 'Feijão Carioca Camil 1kg', barcode: '7896006758038', price: 8.49, expiryDate: '2025-10-01', quantity: 4, quantityUnit: 'caixa', priority: 'alta', aisleId: 'a8', minStock: 8, maxStock: 30, createdAt: '2024-11-01', updatedAt: '2024-11-20' },
  { id: 'p14', name: 'Chocolate Lacta ao Leite 90g', barcode: '7622210651341', price: 5.99, expiryDate: '2025-07-01', quantity: 48, quantityUnit: 'unidade', priority: 'media', aisleId: 'a9', minStock: 30, maxStock: 120, createdAt: '2024-11-01', updatedAt: '2024-11-20' },
  { id: 'p15', name: 'Pizza Congelada Sadia Frango 400g', barcode: '7896085001282', price: 18.90, expiryDate: '2025-03-01', quantity: 1, quantityUnit: 'caixa', priority: 'media', aisleId: 'a10', minStock: 3, maxStock: 12, createdAt: '2024-11-01', updatedAt: '2024-11-20' },
]

const SEED_PALETTES: Palette[] = [
  { id: 'pal1', code: 'PAL-001', location: 'pulmao', position: 'A-01', productIds: ['p4', 'p5'], notes: 'Bebidas geladas — manter ventilado' },
  { id: 'pal2', code: 'PAL-002', location: 'aereo', position: 'B-03', productIds: ['p12', 'p13'], notes: 'Grãos e cereais' },
  { id: 'pal3', code: 'PAL-003', location: 'pulmao', position: 'C-02', productIds: ['p7', 'p8', 'p9'], notes: 'Higiene e limpeza' },
]

const SEED_BOXES: BoxItem[] = [
  { id: 'bx1', productId: 'p4', quantity: 6, unit: 'caixa', location: 'Caixaria A — Prateleira 2' },
  { id: 'bx2', productId: 'p12', quantity: 10, unit: 'caixa', location: 'Caixaria B — Prateleira 1' },
  { id: 'bx3', productId: 'p1', quantity: 4, unit: 'caixa', location: 'Câmara Fria' },
  { id: 'bx4', productId: 'p14', quantity: 8, unit: 'caixa', location: 'Caixaria A — Prateleira 4' },
]

const SEED_HISTORY: HistoryEntry[] = [
  { id: 'h1', actionType: 'reposicao', productId: 'p9', productName: 'Detergente Ypê Limão 500ml', description: 'Reposição solicitada — estoque zerado', timestamp: '2024-11-20T09:15:00', user: 'Carlos Silva' },
  { id: 'h2', actionType: 'alerta', productId: 'p2', productName: 'Queijo Mussarela Fatiado 200g', description: 'Alerta de validade gerado — vence em 8 dias', timestamp: '2024-11-20T08:00:00', user: 'Sistema' },
  { id: 'h3', actionType: 'cadastro', productId: 'p15', productName: 'Pizza Congelada Sadia Frango 400g', description: 'Produto cadastrado no corredor 10', timestamp: '2024-11-19T14:30:00', user: 'Ana Oliveira' },
  { id: 'h4', actionType: 'edicao', productId: 'p4', productName: 'Coca-Cola 2L', description: 'Quantidade atualizada: 5 → 3 caixas', timestamp: '2024-11-19T11:00:00', user: 'Carlos Silva' },
  { id: 'h5', actionType: 'palete', productId: undefined, productName: undefined, description: 'Palete PAL-002 movido de B-01 para B-03', timestamp: '2024-11-18T16:45:00', user: 'Roberto Souza' },
  { id: 'h6', actionType: 'reposicao', productId: 'p8', productName: 'Sabonete Dove Original 90g', description: 'Reposição manual registrada — 30 unidades', timestamp: '2024-11-18T10:20:00', user: 'Ana Oliveira' },
]

function generateAlerts(products: Product[]): Alert[] {
  const alerts: Alert[] = []
  const today = new Date()

  products.forEach(p => {
    const expiry = new Date(p.expiryDate)
    const daysToExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (daysToExpiry <= 30 && daysToExpiry > 0) {
      alerts.push({
        id: `alert-exp-${p.id}`,
        type: 'validade',
        productId: p.id,
        message: daysToExpiry <= 7
          ? `Vence em ${daysToExpiry} dia${daysToExpiry !== 1 ? 's' : ''}! Ação imediata necessária.`
          : `Vence em ${daysToExpiry} dias.`,
        severity: daysToExpiry <= 7 ? 'high' : daysToExpiry <= 14 ? 'medium' : 'low',
        date: today.toISOString(),
        resolved: false,
      })
    }

    const ratio = p.quantity / p.maxStock
    if (ratio === 0) {
      alerts.push({
        id: `alert-stk-${p.id}`,
        type: 'estoque',
        productId: p.id,
        message: `Estoque zerado! Reposição urgente.`,
        severity: p.priority === 'alta' ? 'high' : 'medium',
        date: today.toISOString(),
        resolved: false,
      })
    } else if (ratio < 0.25) {
      alerts.push({
        id: `alert-stk-low-${p.id}`,
        type: 'estoque',
        productId: p.id,
        message: `Estoque baixo: ${p.quantity} ${p.quantityUnit}${p.quantity !== 1 ? 's' : ''} restante${p.quantity !== 1 ? 's' : ''}.`,
        severity: p.priority === 'alta' ? 'medium' : 'low',
        date: today.toISOString(),
        resolved: false,
      })
    }
  })

  return alerts
}

function generateReplenishment(products: Product[]): ReplenishmentItem[] {
  const items: ReplenishmentItem[] = []
  const today = new Date().toISOString()
  products.forEach(p => {
    const ratio = p.quantity / p.maxStock
    if (ratio === 0) {
      items.push({ productId: p.id, quantity: p.maxStock, unit: p.quantityUnit, reason: 'acabou', isManual: false, priority: p.priority, requestedAt: today })
    } else if (ratio < 0.25) {
      items.push({ productId: p.id, quantity: Math.ceil((p.maxStock - p.quantity) / 2), unit: p.quantityUnit, reason: 'acabando', isManual: false, priority: p.priority, requestedAt: today })
    }
  })
  return items
}

interface AppState {
  products: Product[]
  aisles: Aisle[]
  palettes: Palette[]
  boxes: BoxItem[]
  alerts: Alert[]
  history: HistoryEntry[]
  replenishment: ReplenishmentItem[]
  addProduct: (p: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateProduct: (id: string, p: Partial<Product>) => void
  deleteProduct: (id: string) => void
  addHistoryEntry: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void
  resolveAlert: (id: string) => void
  addManualReplenishment: (productId: string) => void
  updatePalette: (id: string, p: Partial<Palette>) => void
  addPalette: (p: Omit<Palette, 'id'>) => void
  updateBox: (id: string, b: Partial<BoxItem>) => void
  addBox: (b: Omit<BoxItem, 'id'>) => void
}

const AppContext = createContext<AppState | null>(null)

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => load('ss_products', SEED_PRODUCTS))
  const [palettes, setPalettes] = useState<Palette[]>(() => load('ss_palettes', SEED_PALETTES))
  const [boxes, setBoxes] = useState<BoxItem[]>(() => load('ss_boxes', SEED_BOXES))
  const [history, setHistory] = useState<HistoryEntry[]>(() => load('ss_history', SEED_HISTORY))
  const [alerts, setAlerts] = useState<Alert[]>(() => generateAlerts(load('ss_products', SEED_PRODUCTS)))
  const [replenishment, setReplenishment] = useState<ReplenishmentItem[]>(() => generateReplenishment(load('ss_products', SEED_PRODUCTS)))

  useEffect(() => { localStorage.setItem('ss_products', JSON.stringify(products)) }, [products])
  useEffect(() => { localStorage.setItem('ss_palettes', JSON.stringify(palettes)) }, [palettes])
  useEffect(() => { localStorage.setItem('ss_boxes', JSON.stringify(boxes)) }, [boxes])
  useEffect(() => { localStorage.setItem('ss_history', JSON.stringify(history)) }, [history])
  useEffect(() => {
    setAlerts(generateAlerts(products))
    setReplenishment(generateReplenishment(products))
  }, [products])

  const uid = () => Math.random().toString(36).slice(2, 10)

  function addProduct(p: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString()
    const newProduct = { ...p, id: uid(), createdAt: now, updatedAt: now }
    setProducts(prev => [...prev, newProduct])
    addHistoryEntry({ actionType: 'cadastro', productId: newProduct.id, productName: newProduct.name, description: `Produto cadastrado no corredor`, user: 'Usuário' })
  }

  function updateProduct(id: string, p: Partial<Product>) {
    setProducts(prev => prev.map(x => x.id === id ? { ...x, ...p, updatedAt: new Date().toISOString() } : x))
    const prod = products.find(x => x.id === id)
    addHistoryEntry({ actionType: 'edicao', productId: id, productName: prod?.name, description: `Produto atualizado`, user: 'Usuário' })
  }

  function deleteProduct(id: string) {
    const prod = products.find(x => x.id === id)
    setProducts(prev => prev.filter(x => x.id !== id))
    addHistoryEntry({ actionType: 'remocao', productId: id, productName: prod?.name, description: `Produto removido do sistema`, user: 'Usuário' })
  }

  function addHistoryEntry(entry: Omit<HistoryEntry, 'id' | 'timestamp'>) {
    setHistory(prev => [{ ...entry, id: uid(), timestamp: new Date().toISOString() }, ...prev])
  }

  function resolveAlert(id: string) {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a))
  }

  function addManualReplenishment(productId: string) {
    const prod = products.find(p => p.id === productId)
    if (!prod) return
    const exists = replenishment.find(r => r.productId === productId)
    if (!exists) {
      setReplenishment(prev => [...prev, {
        productId,
        quantity: prod.maxStock - prod.quantity,
        unit: prod.quantityUnit,
        reason: prod.quantity === 0 ? 'acabou' : 'acabando',
        isManual: true,
        priority: prod.priority,
        requestedAt: new Date().toISOString(),
      }])
    }
    addHistoryEntry({ actionType: 'reposicao', productId, productName: prod.name, description: `Reposição manual solicitada`, user: 'Usuário' })
  }

  function updatePalette(id: string, p: Partial<Palette>) {
    setPalettes(prev => prev.map(x => x.id === id ? { ...x, ...p } : x))
    addHistoryEntry({ actionType: 'palete', description: `Palete atualizado`, user: 'Usuário' })
  }

  function addPalette(p: Omit<Palette, 'id'>) {
    setPalettes(prev => [...prev, { ...p, id: uid() }])
    addHistoryEntry({ actionType: 'palete', description: `Novo palete ${p.code} criado`, user: 'Usuário' })
  }

  function updateBox(id: string, b: Partial<BoxItem>) {
    setBoxes(prev => prev.map(x => x.id === id ? { ...x, ...b } : x))
  }

  function addBox(b: Omit<BoxItem, 'id'>) {
    setBoxes(prev => [...prev, { ...b, id: uid() }])
  }

  return (
    <AppContext.Provider value={{
      products, aisles: AISLES, palettes, boxes, alerts, history, replenishment,
      addProduct, updateProduct, deleteProduct, addHistoryEntry,
      resolveAlert, addManualReplenishment, updatePalette, addPalette, updateBox, addBox,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}

export function priorityLabel(p: Priority) {
  return p === 'alta' ? 'Alta' : p === 'media' ? 'Média' : 'Baixa'
}
