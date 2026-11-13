import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Mail, MessageCircle, Mountain, Menu, X } from 'lucide-react'

function PublicHeader() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="site-header">
      <Link to="/" className="brand" onClick={() => setMenuOpen(false)}>
        <span className="brand-mark"><Mountain size={19} /></span>
        <span>Vazimba<span className="brand-light"> Tour</span></span>
      </Link>
      <button className="icon-button mobile-menu" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Ouvrir le menu">
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'}>
        <Link to="/#circuits" onClick={() => setMenuOpen(false)}>Nos circuits</Link>
        <Link to="/a-propos" onClick={() => setMenuOpen(false)}>À propos</Link>
        <Link to="/chez-l-habitant" onClick={() => setMenuOpen(false)}>Chez l’habitant</Link>
        <Link className="nav-cta" to="/devis" onClick={() => setMenuOpen(false)}>Créer mon voyage <ArrowRight size={15} /></Link>
      </nav>
    </header>
  )
}

function PublicLayout({ children }) {
  return (
    <div className="public-shell">
      <PublicHeader />
      {children}
      <footer className="site-footer">
        <Link to="/" className="brand"><span className="brand-mark"><Mountain size={18} /></span>Vazimba Tour</Link>
        <span>Des voyages qui ont du sens, au cœur de Madagascar.</span>
        <ContactLinks />
        <Link to="/admin/login" className="footer-admin">Espace équipe</Link>
      </footer>
    </div>
  )
}

function ContactLinks() {
  const email = import.meta.env.VITE_CONTACT_EMAIL
  const whatsappNumber = (import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '')
  const facebookUrl = import.meta.env.VITE_FACEBOOK_URL
  const instagramUrl = import.meta.env.VITE_INSTAGRAM_URL
  const contacts = [
    email && { href: `mailto:${email}`, label: 'E-mail', icon: Mail },
    whatsappNumber && { href: `https://wa.me/${whatsappNumber}`, label: 'WhatsApp', icon: MessageCircle },
    facebookUrl && { href: facebookUrl, label: 'Facebook', icon: ArrowRight },
    instagramUrl && { href: instagramUrl, label: 'Instagram', icon: ArrowRight },
  ].filter(Boolean)

  if (!contacts.length) return null

  return (
    <div className="contact-links" aria-label="Nous contacter">
      {contacts.map(({ href, label, icon: Icon }) => (
        <a href={href} key={label} aria-label={label} title={label} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined}>
          <Icon size={16} /><span>{label}</span>
        </a>
      ))}
    </div>
  )
}

export default PublicLayout
