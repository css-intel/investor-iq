import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import DealsPage from './pages/DealsPage'
import NewDealPage from './pages/NewDealPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/deals" element={<DealsPage />} />
      <Route path="/deals/new" element={<NewDealPage />} />
    </Routes>
  )
}

export default App
