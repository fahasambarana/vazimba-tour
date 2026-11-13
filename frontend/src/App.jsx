import { BrowserRouter, Route, Routes } from 'react-router-dom'
import PublicLayout from './components/layout/PublicLayout'
import AdminGuard from './layouts/AdminLayout'
import AboutPage from './pages/About'
import CircuitPage from './pages/CircuitDetails'
import DevisPage from './pages/Devis'
import HomePage from './pages/Home'
import LodgingPage from './pages/ChezNamana'
import LoginPage from './pages/admin/Login'
import NotFound from './pages/NotFound'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/a-propos" element={<PublicLayout><AboutPage /></PublicLayout>} />
        <Route path="/chez-l-habitant" element={<PublicLayout><LodgingPage /></PublicLayout>} />
        <Route path="/circuits/:id" element={<PublicLayout><CircuitPage /></PublicLayout>} />
        <Route path="/devis" element={<PublicLayout><DevisPage /></PublicLayout>} />
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/*" element={<AdminGuard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
