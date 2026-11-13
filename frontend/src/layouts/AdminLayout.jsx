import { useEffect, useState } from 'react'
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, CalendarDays, Compass, Images, LogOut, Mountain } from 'lucide-react'
import { authApi } from '../services/api'
import AdminCircuits from '../pages/admin/Circuits'
import AdminDevis from '../pages/admin/Devis'
import AdminPhotos from '../pages/admin/Photos'

function AdminGuard() {
  const [checking, setChecking] = useState(() => Boolean(localStorage.getItem('vazimba-token')))
  const [admin, setAdmin] = useState(null)

  useEffect(() => {
    if (!localStorage.getItem('vazimba-token')) return
    authApi.profile().then(({ data }) => setAdmin(data.admin)).catch(() => {
      localStorage.removeItem('vazimba-token')
      setAdmin(null)
    }).finally(() => setChecking(false))
  }, [])

  if (checking) return <div className="admin-loading">Vérification de votre session…</div>
  return admin ? <AdminLayout admin={admin} /> : <Navigate to="/admin/login" replace />
}

function AdminLayout({ admin }) {
  const navigate = useNavigate()
  const location = useLocation()
  const section = location.pathname.split('/')[2] || 'circuits'

  const tabs = [
    { key: 'circuits', label: 'Circuits', icon: Compass },
    { key: 'devis', label: 'Demandes de devis', icon: CalendarDays },
    { key: 'photos', label: 'Photos hébergement', icon: Images },
  ]

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/" className="brand"><span className="brand-mark"><Mountain size={19} /></span>Vazimba<span className="brand-light"> Tour</span></Link>
        <div className="sidebar-label">GESTION</div>
        <nav className="admin-nav">
          {tabs.map(({ key, label, icon: Icon }) => (
            <Link key={key} to={`/admin/${key}`} className={section === key ? 'admin-nav-link active' : 'admin-nav-link'}>
              <Icon size={17} /> {label} {key === 'circuits' && <ArrowRight size={14} className="nav-arrow" />}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="admin-user"><span>{admin?.nom?.slice(0, 1)?.toUpperCase() || 'V'}</span><div><strong>{admin?.nom || 'Équipe Vazimba'}</strong><small>Administrateur</small></div></div>
          <button type="button" className="logout-button" onClick={() => { localStorage.removeItem('vazimba-token'); navigate('/admin/login') }}><LogOut size={16} /> Déconnexion</button>
        </div>
      </aside>
      <div className="admin-content">
        <header className="admin-topbar"><div><span className="admin-breadcrumb">ESPACE ADMINISTRATEUR</span><span className="admin-top-title">{tabs.find((tab) => tab.key === section)?.label || 'Gestion'}</span></div><Link to="/" className="view-site">Voir le site <ArrowRight size={14} /></Link></header>
        <Routes>
          <Route index element={<Navigate to="circuits" replace />} />
          <Route path="circuits" element={<AdminCircuits />} />
          <Route path="devis" element={<AdminDevis />} />
          <Route path="photos" element={<AdminPhotos />} />
          <Route path="*" element={<Navigate to="circuits" replace />} />
        </Routes>
      </div>
    </div>
  )
}
export default AdminGuard
