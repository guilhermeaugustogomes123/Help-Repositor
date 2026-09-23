import { FormEvent, useMemo, useState } from 'react'
import { CalendarDays, Check, ChevronDown, ClipboardPen, Plus, Store, Trash2, UsersRound, X } from 'lucide-react'
import { TopBar, EmptyState } from '../components/Nav'
import { useApp } from '../store/AppContext'
import { Weekday } from '../types'

type Tab = 'promotores' | 'anotacoes' | 'escala'

const WEEKDAYS: { value: Weekday; short: string; label: string }[] = [
  { value: 'seg', short: 'S', label: 'Segunda' },
  { value: 'ter', short: 'T', label: 'Terça' },
  { value: 'qua', short: 'Q', label: 'Quarta' },
  { value: 'qui', short: 'Q', label: 'Quinta' },
  { value: 'sex', short: 'S', label: 'Sexta' },
  { value: 'sab', short: 'S', label: 'Sábado' },
  { value: 'dom', short: 'D', label: 'Domingo' },
]

function daysUntil(date: string) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.ceil((new Date(`${date}T00:00:00`).getTime() - today.getTime()) / 86400000)
}

export default function Rotina() {
  const { products, promoters, notes, daysOff, addPromoter, deletePromoter, addNote, toggleNote, deleteNote, addDayOff, deleteDayOff } = useApp()
  const [tab, setTab] = useState<Tab>('promotores')
  const [showForm, setShowForm] = useState(false)
  const [noteText, setNoteText] = useState('')
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [productIds, setProductIds] = useState<string[]>([])
  const [weekdays, setWeekdays] = useState<Weekday[]>([])
  const [offDate, setOffDate] = useState('')
  const [offType, setOffType] = useState<'folga' | 'ferias'>('folga')
  const [offNotes, setOffNotes] = useState('')

  const upcomingDaysOff = useMemo(
    () => daysOff.filter(day => daysUntil(day.date) >= 0).sort((a, b) => a.date.localeCompare(b.date)),
    [daysOff],
  )
  const nextDayOff = upcomingDaysOff[0]

  function resetForm() {
    setShowForm(false)
    setName('')
    setCompany('')
    setProductIds([])
    setWeekdays([])
    setOffDate('')
    setOffType('folga')
    setOffNotes('')
  }

  function savePromoter(event: FormEvent) {
    event.preventDefault()
    if (!name.trim() || productIds.length === 0 || weekdays.length === 0) return
    addPromoter({ name: name.trim(), company: company.trim(), productIds, weekdays })
    resetForm()
  }

  function saveDayOff(event: FormEvent) {
    event.preventDefault()
    if (!offDate) return
    addDayOff({ date: offDate, type: offType, notes: offNotes.trim() })
    resetForm()
  }

  function submitNote(event: FormEvent) {
    event.preventDefault()
    if (!noteText.trim()) return
    addNote(noteText.trim())
    setNoteText('')
  }

  function toggleValue<T>(value: T, values: T[], setter: (next: T[]) => void) {
    setter(values.includes(value) ? values.filter(item => item !== value) : [...values, value])
  }

  return (
    <div className="page-enter flex flex-col h-full">
      <TopBar
        title="Minha rotina"
        subtitle="Promotores, lembretes e escala"
        action={tab !== 'anotacoes' && (
          <button onClick={() => setShowForm(true)} className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center active:scale-95">
            <Plus size={19} />
          </button>
        )}
      />

      <div className="px-4 pt-3 bg-white border-b border-slate-100">
        <div className="grid grid-cols-3 p-1 bg-slate-100 rounded-xl mb-3">
          {([
            ['promotores', 'Promotores', UsersRound],
            ['anotacoes', 'Anotações', ClipboardPen],
            ['escala', 'Escala', CalendarDays],
          ] as const).map(([value, label, Icon]) => (
            <button key={value} onClick={() => { setTab(value); resetForm() }} className={`flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] font-semibold transition ${tab === value ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500'}`}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 overflow-y-auto px-4 py-4">
        {tab === 'promotores' && (
          <div className="space-y-3">
            {promoters.map(promoter => (
              <article key={promoter.id} className="bg-white border border-slate-200 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><UsersRound size={19} /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2">
                      <div>
                        <h2 className="text-sm font-bold text-slate-900">{promoter.name}</h2>
                        <p className="text-xs text-slate-500">{promoter.company || 'Empresa não informada'}</p>
                      </div>
                      <button onClick={() => deletePromoter(promoter.id)} aria-label="Excluir promotor" className="text-slate-300 hover:text-red-500 p-1"><Trash2 size={16} /></button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {promoter.weekdays.map(day => <span key={day} className="px-2 py-1 rounded-md bg-amber-50 text-amber-700 text-[10px] font-bold">{WEEKDAYS.find(w => w.value === day)?.label}</span>)}
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">Produtos atendidos</p>
                  {promoter.productIds.map(id => <p key={id} className="text-xs text-slate-700 flex items-center gap-1.5 py-0.5"><Store size={12} className="text-blue-500" />{products.find(p => p.id === id)?.name || 'Produto removido'}</p>)}
                </div>
              </article>
            ))}
            {promoters.length === 0 && <EmptyState icon={<UsersRound size={42} />} title="Nenhum promotor" description="Cadastre quem atende os produtos da loja." />}
          </div>
        )}

        {tab === 'anotacoes' && (
          <>
            <form onSubmit={submitNote} className="bg-blue-600 rounded-2xl p-4 shadow-sm">
              <label className="text-xs font-semibold text-blue-100">Novo lembrete</label>
              <div className="flex gap-2 mt-2">
                <input value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="O que você precisa lembrar?" className="flex-1 min-w-0 bg-white rounded-xl px-3 py-2.5 text-sm outline-none" />
                <button className="w-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center"><Plus size={19} /></button>
              </div>
            </form>
            <div className="space-y-2 mt-4">
              {notes.map(note => (
                <div key={note.id} className="bg-white border border-slate-200 rounded-xl p-3 flex items-start gap-3">
                  <button onClick={() => toggleNote(note.id)} className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 ${note.completed ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 text-transparent'}`}><Check size={15} /></button>
                  <p className={`flex-1 text-sm leading-6 ${note.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>{note.text}</p>
                  <button onClick={() => deleteNote(note.id)} aria-label="Excluir anotação" className="text-slate-300 hover:text-red-500 p-1"><X size={16} /></button>
                </div>
              ))}
              {notes.length === 0 && <EmptyState icon={<ClipboardPen size={42} />} title="Tudo anotado" description="Seus lembretes individuais aparecerão aqui." />}
            </div>
          </>
        )}

        {tab === 'escala' && (
          <>
            {nextDayOff && daysUntil(nextDayOff.date) <= 7 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 flex gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center shrink-0"><CalendarDays size={20} /></div>
                <div>
                  <p className="text-xs font-bold text-amber-900 uppercase tracking-wide">Sua {nextDayOff.type === 'folga' ? 'folga' : 'férias'} está chegando</p>
                  <p className="text-sm text-amber-800 mt-0.5">{daysUntil(nextDayOff.date) === 0 ? 'É hoje.' : `Faltam ${daysUntil(nextDayOff.date)} dias.`}</p>
                </div>
              </div>
            )}
            <div className="space-y-2">
              {upcomingDaysOff.map(day => (
                <article key={day.id} className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex flex-col items-center justify-center shrink-0">
                    <span className="text-lg font-extrabold leading-4">{new Date(`${day.date}T00:00:00`).getDate()}</span>
                    <span className="text-[9px] font-bold uppercase">{new Date(`${day.date}T00:00:00`).toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-800 capitalize">{day.type}</p>
                    <p className="text-xs text-slate-500">{day.notes || (daysUntil(day.date) === 0 ? 'Hoje' : `Em ${daysUntil(day.date)} dias`)}</p>
                  </div>
                  <button onClick={() => deleteDayOff(day.id)} aria-label="Excluir folga" className="text-slate-300 hover:text-red-500 p-2"><Trash2 size={16} /></button>
                </article>
              ))}
              {upcomingDaysOff.length === 0 && <EmptyState icon={<CalendarDays size={42} />} title="Escala livre" description="Adicione suas próximas folgas ou férias." />}
            </div>
          </>
        )}
      </main>

      {showForm && (
        <div className="absolute inset-0 z-[60] bg-slate-950/40 flex items-end" onMouseDown={resetForm}>
          <form onSubmit={tab === 'promotores' ? savePromoter : saveDayOff} onMouseDown={e => e.stopPropagation()} className="bg-white rounded-t-3xl w-full max-h-[88%] overflow-y-auto p-5 pb-8">
            <div className="flex items-center justify-between mb-5">
              <div><h2 className="font-bold text-lg text-slate-900">{tab === 'promotores' ? 'Novo promotor' : 'Adicionar à escala'}</h2><p className="text-xs text-slate-500">Preencha as informações abaixo</p></div>
              <button type="button" onClick={resetForm} className="p-2 rounded-xl bg-slate-100 text-slate-500"><X size={18} /></button>
            </div>
            {tab === 'promotores' ? (
              <div className="space-y-4">
                <Field label="Nome do promotor"><input required value={name} onChange={e => setName(e.target.value)} className="input-base" placeholder="Nome completo" /></Field>
                <Field label="Empresa ou marca"><input value={company} onChange={e => setCompany(e.target.value)} className="input-base" placeholder="Ex.: Coca-Cola" /></Field>
                <Field label="Dias de atendimento">
                  <div className="grid grid-cols-7 gap-1.5">{WEEKDAYS.map(day => <button type="button" title={day.label} key={day.value} onClick={() => toggleValue(day.value, weekdays, setWeekdays)} className={`aspect-square rounded-lg text-xs font-bold ${weekdays.includes(day.value) ? 'bg-amber-400 text-slate-900' : 'bg-slate-100 text-slate-500'}`}>{day.short}</button>)}</div>
                </Field>
                <Field label="Produtos com promotor">
                  <div className="border border-slate-200 rounded-xl max-h-48 overflow-y-auto divide-y divide-slate-100">
                    {products.map(product => <label key={product.id} className="flex items-center gap-3 p-3 text-xs text-slate-700"><input type="checkbox" checked={productIds.includes(product.id)} onChange={() => toggleValue(product.id, productIds, setProductIds)} className="accent-blue-600 w-4 h-4" /><span className="flex-1">{product.name}</span></label>)}
                  </div>
                </Field>
              </div>
            ) : (
              <div className="space-y-4">
                <Field label="Tipo"><div className="relative"><select value={offType} onChange={e => setOffType(e.target.value as 'folga' | 'ferias')} className="input-base appearance-none"><option value="folga">Folga</option><option value="ferias">Férias</option></select><ChevronDown size={16} className="absolute right-3 top-3 text-slate-400 pointer-events-none" /></div></Field>
                <Field label="Data"><input required type="date" value={offDate} onChange={e => setOffDate(e.target.value)} className="input-base" /></Field>
                <Field label="Observação"><input value={offNotes} onChange={e => setOffNotes(e.target.value)} className="input-base" placeholder="Opcional" /></Field>
              </div>
            )}
            <button className="w-full bg-blue-600 text-white rounded-xl py-3 text-sm font-bold mt-5">Salvar</button>
          </form>
        </div>
      )}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</span>{children}</label>
}
