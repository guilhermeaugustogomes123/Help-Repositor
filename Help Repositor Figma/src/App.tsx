import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './store/AppContext'
import { BottomNav } from './components/Nav'
import Dashboard from './pages/Dashboard'
import Corredores from './pages/Corredores'
import CorredorDetail from './pages/CorredorDetail'
import Alertas from './pages/Alertas'
import Reposicao from './pages/Reposicao'
import Paletes from './pages/Paletes'
import Caixaria from './pages/Caixaria'
import Historico from './pages/Historico'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="flex flex-col" style={{ height: '100dvh', maxWidth: '480px', margin: '0 auto', position: 'relative', background: '#f8fafc' }}>
          <div className="flex-1 overflow-hidden" style={{ paddingBottom: 'var(--nav-height)' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/corredores" element={<Corredores />} />
              <Route path="/corredor/:id" element={<CorredorDetail />} />
              <Route path="/alertas" element={<Alertas />} />
              <Route path="/reposicao" element={<Reposicao />} />
              <Route path="/paletes" element={<Paletes />} />
              <Route path="/caixaria" element={<Caixaria />} />
              <Route path="/historico" element={<Historico />} />
            </Routes>
          </div>
          <BottomNav />
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}
