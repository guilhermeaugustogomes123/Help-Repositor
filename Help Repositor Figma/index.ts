export type Priority = 'alta' | 'media' | 'baixa'
export type QuantityUnit = 'caixa' | 'unidade'
export type PaletteLocation = 'pulmao' | 'aereo'
export type AlertType = 'validade' | 'estoque'
export type AlertSeverity = 'high' | 'medium' | 'low'
export type HistoryActionType = 'cadastro' | 'edicao' | 'reposicao' | 'remocao' | 'alerta' | 'palete'

export interface Aisle {
  id: string
  number: number
  name: string
  description: string
}

export interface Product {
  id: string
  name: string
  barcode: string
  price: number
  expiryDate: string
  quantity: number
  quantityUnit: QuantityUnit
  priority: Priority
  aisleId: string
  minStock: number
  maxStock: number
  paletteId?: string
  createdAt: string
  updatedAt: string
}

export interface Palette {
  id: string
  code: string
  location: PaletteLocation
  position: string
  productIds: string[]
  notes: string
}

export interface BoxItem {
  id: string
  productId: string
  quantity: number
  unit: QuantityUnit
  location: string
}

export interface Alert {
  id: string
  type: AlertType
  productId: string
  message: string
  severity: AlertSeverity
  date: string
  resolved: boolean
}

export interface HistoryEntry {
  id: string
  actionType: HistoryActionType
  productId?: string
  productName?: string
  description: string
  timestamp: string
  user: string
}

export interface ReplenishmentItem {
  productId: string
  quantity: number
  unit: QuantityUnit
  reason: 'acabou' | 'acabando'
  isManual: boolean
  priority: Priority
  requestedAt: string
}

export type Weekday = 'seg' | 'ter' | 'qua' | 'qui' | 'sex' | 'sab' | 'dom'

export interface Promoter {
  id: string
  name: string
  company: string
  productIds: string[]
  weekdays: Weekday[]
}

export interface Note {
  id: string
  text: string
  completed: boolean
  createdAt: string
}

export interface DayOff {
  id: string
  date: string
  type: 'folga' | 'ferias'
  notes: string
}
