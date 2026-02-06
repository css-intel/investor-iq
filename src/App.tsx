import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import DealsPage from './pages/DealsPage'
import NewDealPage from './pages/NewDealPage'
import UnderwritingPage from './pages/UnderwritingPage'
import MarketDataPage from './pages/MarketDataPage'
import LendersPage from './pages/LendersPage'
import ReportsPage from './pages/ReportsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/deals" element={<DealsPage />} />
      <Route path="/deals/new" element={<NewDealPage />} />
      <Route path="/underwriting" element={<UnderwritingPage />} />
      <Route path="/market" element={<MarketDataPage />} />
      <Route path="/lenders" element={<LendersPage />} />
      <Route path="/reports" element={<ReportsPage />} />
    </Routes>
  )
}

export default App
