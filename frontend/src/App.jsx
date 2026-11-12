import { useEffect, useState } from 'react'
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'
import {
  ArrowDownRight,
  ArrowRight,
  BedDouble,
  CalendarDays,
  Check,
  ChevronDown,
  Compass,
  HeartHandshake,
  House,
  Images,
  Leaf,
  LogOut,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Mountain,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2,
  Utensils,
  X,
} from 'lucide-react'
import api, {
  authApi,
  circuitApi,
  devisApi,
  etapeApi,
  photoApi,
  getErrorMessage,
} from './services/api'
import './App.css'

const themes = ['Villageois', 'Aventure', 'Classique']
const regions = ['Vakinankaratra', 'Nord', 'Sud', 'Est', 'Ouest']
const statuses = ['En attente', 'En cours', 'Acceptée', 'Refusée']
const photoCategories = ['Chambre', 'Repas', 'Exterieur']

function mediaUrl(path) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  const serverUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '')
  return `${serverUrl}${path.startsWith('/') ? path : `/${path}`}`
}

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

function HomePage() {
  const [circuits, setCircuits] = useState([])
  const [theme, setTheme] = useState('')
  const [region, setRegion] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [apiOnline, setApiOnline] = useState(null)

  useEffect(() => {
    let active = true
    circuitApi.list({ theme, axe_region: region })
      .then(({ data }) => {
        if (active) setCircuits(data.data || [])
      })
      .catch((requestError) => {
        if (active) setError(getErrorMessage(requestError))
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [theme, region])

  useEffect(() => {
    const apiRoot = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '')
    api.get(apiRoot).then(() => setApiOnline(true)).catch(() => setApiOnline(false))
  }, [])

  return (
    <main>
      <section className="hero-section">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> TOURISME SOLIDAIRE · DÉCOUVERTE · AVENTURE · CULTURE · NATURE</div>
          <h1>La grande île,<br /><em>à votre façon.</em></h1>
          <p>Vivez Madagascar au plus près de ses habitants : immersion villageoise, coutumes vivantes, nature et aventures pensées avec les communautés locales.</p>
          <div className="hero-actions">
            <a className="button button-dark" href="#circuits">Explorer les circuits <ArrowDownRight size={17} /></a>
            <Link className="text-link" to="/devis">Voyage sur mesure <ArrowRight size={16} /></Link>
          </div>
          <div className="hero-note"><span className="note-line" /> Authenticité · Partage · Respect des coutumes</div>
        </div>
        <div className="hero-art" role="img" aria-label="Paysage montagneux de Madagascar">
          <div className="sun-disc" />
          <div className="hero-photo-caption"><MapPin size={14} /> Hautes terres · Madagascar</div>
          <div className="hero-photo-number">01 <span>/</span> 05</div>
        </div>
        <div className="hero-bottom">
          <span><Sparkles size={15} /> Une autre manière de voyager</span>
          <span className="scroll-cue">DÉFILER <span /></span>
        </div>
      </section>

      <section id="esprit" className="intro-band">
        <div className="intro-label"><span>01</span> L'ESPRIT VAZIMBA</div>
        <p>Tourisme solidaire, découverte, aventure, culture, nature et <em>authenticité.</em></p>
        <span className="intro-stamp"><Compass size={23} /> FAIT AVEC<br />LE CŒUR</span>
      </section>

      <section className="commitments-section section-wrap">
        <div className="section-heading">
          <div><div className="eyebrow"><span className="eyebrow-dot" /> NOS ENGAGEMENTS</div><h2>Voyager autrement,<br /><em>ensemble.</em></h2></div>
          <p>Chaque rencontre est une occasion de découvrir, de partager et de soutenir la vie locale.</p>
        </div>
        <div className="commitment-grid">
          <article className="commitment-card"><span><House size={23} /></span><h3>Chez l’habitant</h3><p>Une immersion chaleureuse à Betafo, dans la maison d’hôtes Chez Namana.</p><Link to="/chez-l-habitant">Découvrir l’hébergement <ArrowRight size={14} /></Link></article>
          <article className="commitment-card"><span><HeartHandshake size={23} /></span><h3>Culture & traditions</h3><p>Des rencontres respectueuses des coutumes et du patrimoine des villages.</p><Link to="/a-propos">Notre démarche <ArrowRight size={14} /></Link></article>
          <article className="commitment-card"><span><Leaf size={23} /></span><h3>Nature & aventure</h3><p>Des paysages de Madagascar aux parcours d’aventure, au rythme du territoire.</p><Link to="/#circuits">Explorer les circuits <ArrowRight size={14} /></Link></article>
        </div>
      </section>

      <FeaturedCircuitSection circuits={circuits} />

      <section id="circuits" className="circuits-section section-wrap">
        <div className="section-heading">
          <div>
            <div className="eyebrow"><span className="eyebrow-dot" /> CHOISISSEZ VOTRE AVENTURE</div>
            <h2>Nos <em>circuits</em></h2>
          </div>
          <p>Chaque itinéraire est une invitation à découvrir Madagascar autrement.</p>
        </div>
        <div className="filters" aria-label="Filtres des circuits">
          <label>
            <span>Thématique</span>
            <select value={theme} onChange={(event) => setTheme(event.target.value)}>
              <option value="">Toutes les thématiques</option>
              {themes.map((value) => <option key={value}>{value}</option>)}
            </select>
            <ChevronDown size={15} />
          </label>
          <label>
            <span>Région</span>
            <select value={region} onChange={(event) => setRegion(event.target.value)}>
              <option value="">Toutes les régions</option>
              {regions.map((value) => <option key={value}>{value}</option>)}
            </select>
            <ChevronDown size={15} />
          </label>
          {(theme || region) && <button className="clear-filter" type="button" onClick={() => { setTheme(''); setRegion('') }}>Effacer les filtres <X size={14} /></button>}
        </div>

        {loading && <div className="notice">Chargement des circuits…</div>}
        {!loading && error && <div className="notice notice-error">{error}</div>}
        {!loading && !error && circuits.length === 0 && (
          <div className="empty-state"><Mountain size={28} /><h3>Aucun circuit pour le moment</h3><p>Essayez d'autres filtres ou demandez-nous un voyage sur mesure.</p><Link className="button button-dark" to="/devis">Parler de mon projet <ArrowRight size={16} /></Link></div>
        )}
        {!loading && !error && circuits.length > 0 && (
          <div className="circuit-grid">
            {circuits.map((circuit, index) => <CircuitCard circuit={circuit} key={circuit._id} index={index} />)}
          </div>
        )}
        <div className="api-status"><span className={apiOnline ? 'status-dot online' : 'status-dot'} /> {apiOnline === null ? 'Connexion à l’API…' : apiOnline ? 'Services opérationnels' : 'API momentanément indisponible'}</div>
      </section>
      <LodgingPreview />
      <section className="quote-banner">
        <div className="quote-banner-icon"><Compass size={25} /></div>
        <div><div className="eyebrow">VOTRE VOYAGE, VOS ENVIES</div><h2>Vous avez une idée en tête ?</h2><p>Nous la transformons en itinéraire unique, pensé avec vous.</p></div>
        <Link className="button button-light" to="/devis">Parlons de votre projet <ArrowRight size={16} /></Link>
      </section>
    </main>
  )
}

function FeaturedCircuitSection({ circuits }) {
  const featuredCircuit = circuits.find((circuit) =>
    circuit.is_featured || /sur la trace des vazimba/i.test(circuit.titre || ''),
  )

  return (
    <section className="featured-experience">
      <div className="featured-copy">
        <div className="eyebrow light-eyebrow"><span className="eyebrow-dot" /> L’EXPÉRIENCE PHARE · VAKINANKARATRA</div>
        <h2>Sur la trace<br /><em>des Vazimba.</em></h2>
        <p>Aponga Vato et Betafo, le mont Ibity, le lac Tritriva et Ianjanina (Anjanampara), avec une nuitée chez l’habitant à Chez Namana.</p>
        <Link className="button button-light" to={featuredCircuit ? `/circuits/${featuredCircuit._id}` : '/devis'}>
          {featuredCircuit ? 'Voir le circuit' : 'Demander ce voyage'} <ArrowRight size={15} />
        </Link>
      </div>
      <div className="featured-landmarks" aria-label="Étapes de l'expérience phare">
        <span><MapPin size={15} /> Aponga Vato · Betafo</span>
        <span><Mountain size={15} /> Mont Ibity</span>
        <span><MapPin size={15} /> Lac Tritriva</span>
        <span><BedDouble size={15} /> Nuitée chez Namana</span>
      </div>
    </section>
  )
}

function LodgingPreview() {
  return (
    <section className="lodging-preview">
      <div className="lodging-preview-art" role="img" aria-label="Paysage des Hautes Terres près de Betafo" />
      <div className="lodging-preview-copy">
        <div className="eyebrow"><span className="eyebrow-dot" /> BETAFO · HAUTES TERRES</div>
        <h2>La convivialité<br />de <em>Chez Namana.</em></h2>
        <p>Découvrez une maison d’hôtes locale, ses chambres, sa table traditionnelle et les histoires partagées autour d’un repas.</p>
        <Link className="button button-dark" to="/chez-l-habitant">Découvrir Chez Namana <ArrowRight size={15} /></Link>
      </div>
    </section>
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

function AboutPage() {
  return (
    <main className="editorial-page">
      <section className="editorial-hero about-hero">
        <div className="eyebrow"><span className="eyebrow-dot" /> L’ESPRIT VAZIMBA TOUR</div>
        <h1>Un voyage qui a<br /><em>du sens.</em></h1>
        <p>Nous faisons découvrir Madagascar à travers ses habitants, son patrimoine et les paysages qui font la richesse de ses régions.</p>
        <Link className="button button-dark" to="/devis">Construire mon voyage <ArrowRight size={15} /></Link>
      </section>
      <section className="editorial-content">
        <div className="eyebrow"><span className="eyebrow-dot" /> NOTRE DÉMARCHE</div>
        <h2>Le territoire se découvre<br /><em>avec ceux qui y vivent.</em></h2>
        <div className="editorial-columns">
          <p>Vazimba Tour met en valeur le patrimoine malgache et les savoir-faire locaux. Nos voyages privilégient les rencontres et les échanges, dans le respect des coutumes et des lieux visités.</p>
          <p>Notre ancrage villageois se trouve dans la région de Vakinankaratra, autour de Betafo, Aponga Vato et Antsirabe. Les circuits s’ouvrent aussi aux grands axes de Madagascar et à des aventures comme la descente de la Tsiribihina.</p>
        </div>
      </section>
      <section className="editorial-values">
        <article><HeartHandshake size={22} /><h3>Solidarité</h3><p>Des expériences imaginées avec les communautés villageoises locales.</p></article>
        <article><Compass size={22} /><h3>Découverte</h3><p>Un regard curieux sur les patrimoines, les cultures et les paysages.</p></article>
        <article><Leaf size={22} /><h3>Respect</h3><p>Une attention portée aux coutumes et à la singularité de chaque lieu.</p></article>
      </section>
      <section className="quote-banner"><div className="quote-banner-icon"><Compass size={25} /></div><div><div className="eyebrow">À VOUS DE CHOISIR</div><h2>Madagascar, à votre façon.</h2><p>Parlons de vos envies et imaginons votre itinéraire.</p></div><Link className="button button-light" to="/devis">Demander un devis <ArrowRight size={15} /></Link></section>
    </main>
  )
}

function LodgingPage() {
  const hebergementId = import.meta.env.VITE_HEBERGEMENT_ID
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(Boolean(hebergementId))
  const [error, setError] = useState('')

  useEffect(() => {
    if (!hebergementId) return
    let active = true
    photoApi.list(hebergementId)
      .then(({ data }) => { if (active) setPhotos(data.data || []) })
      .catch((requestError) => { if (active) setError(getErrorMessage(requestError)) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [hebergementId])

  return (
    <main className="lodging-page">
      <section className="editorial-hero lodging-hero">
        <div className="eyebrow"><span className="eyebrow-dot" /> BETAFO · VAKINANKARATRA</div>
        <h1>Bienvenue<br />chez <em>Namana.</em></h1>
        <p>Une maison d’hôtes à Betafo pour prendre le temps, partager la vie locale et goûter à la cuisine traditionnelle.</p>
        <Link className="button button-dark" to="/devis?chez_namana=true">Inclure Chez Namana <ArrowRight size={15} /></Link>
      </section>
      <section className="lodging-details">
        <div className="lodging-detail"><BedDouble size={22} /><h2>Des chambres accueillantes</h2><p>Un séjour simple et chaleureux au cœur des Hautes Terres, pensé pour rencontrer le quotidien de la région.</p></div>
        <div className="lodging-detail"><Utensils size={22} /><h2>Une table traditionnelle</h2><p>Découvrez les saveurs locales et la convivialité d’un repas partagé.</p></div>
        <div className="lodging-detail"><HeartHandshake size={22} /><h2>Un accueil chez l’habitant</h2><p>Un point de départ pour découvrir Betafo et ses environs avec un regard local.</p></div>
      </section>
      <section className="lodging-gallery-section">
        <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-dot" /> GALERIE</div><h2>Un aperçu de <em>la maison.</em></h2></div><p>Chambres, repas et instants de convivialité chez Namana.</p></div>
        {!hebergementId && <div className="notice">La galerie sera affichée dès que l’identifiant de l’hébergement sera défini dans la configuration du frontend.</div>}
        {loading && <div className="notice">Chargement des photos…</div>}
        {error && <div className="notice notice-error">{error}</div>}
        {!loading && !error && hebergementId && photos.length > 0 && <div className="lodging-gallery">{photos.map((photo) => <figure key={photo._id}><img src={mediaUrl(photo.url_image)} alt={photo.titre_photo} /><figcaption>{photo.titre_photo}</figcaption></figure>)}</div>}
        {!loading && !error && hebergementId && photos.length === 0 && <div className="notice">Aucune photo n’est encore disponible pour cet hébergement.</div>}
      </section>
      <section className="quote-banner"><div className="quote-banner-icon"><BedDouble size={24} /></div><div><div className="eyebrow">PRÉPAREZ VOTRE SÉJOUR</div><h2>Une nuit chez Namana ?</h2><p>Indiquez-le dans votre demande de voyage.</p></div><Link className="button button-light" to="/devis?chez_namana=true">Demander un devis <ArrowRight size={15} /></Link></section>
    </main>
  )
}

function CircuitCard({ circuit, index }) {
  return (
    <article className={`circuit-card card-${index % 3}`}>
      <Link className="card-image" to={`/circuits/${circuit._id}`} style={circuit.image_principale ? { backgroundImage: `url("${mediaUrl(circuit.image_principale)}")` } : undefined}>
        {!circuit.image_principale && <div className="image-placeholder"><Mountain size={38} /><span>MADAGASCAR</span></div>}
        <span className="card-theme">{circuit.theme}</span>
        {circuit.is_featured && <span className="featured-label"><Sparkles size={13} /> À LA UNE</span>}
        <span className="card-open"><ArrowUpRightIcon /></span>
      </Link>
      <div className="card-content">
        <div className="card-location"><MapPin size={13} /> {circuit.axe_region}</div>
        <Link to={`/circuits/${circuit._id}`}><h3>{circuit.titre}</h3></Link>
        <p>{circuit.description}</p>
        <div className="card-meta"><span><CalendarDays size={14} /> {circuit.duree_jours} jours</span><strong>À partir de {Number(circuit.prix_a_partir).toLocaleString('fr-FR')} <small>Ar</small></strong></div>
      </div>
    </article>
  )
}

function ArrowUpRightIcon() {
  return <ArrowRight size={17} className="arrow-diagonal" />
}

function CircuitPage() {
  const { id } = useParams()
  const [circuit, setCircuit] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    circuitApi.get(id)
      .then(({ data }) => setCircuit(data.data))
      .catch((requestError) => setError(getErrorMessage(requestError)))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <main className="page-wrap"><div className="notice">Chargement du circuit…</div></main>
  if (error || !circuit) return <main className="page-wrap"><div className="notice notice-error">{error || 'Circuit introuvable'}</div><Link to="/" className="text-link">Retour aux circuits <ArrowRight size={16} /></Link></main>

  return (
    <main className="page-wrap detail-page">
      <Link className="back-link" to="/#circuits">← Tous les circuits</Link>
      <section className="detail-hero" style={circuit.image_principale ? { backgroundImage: `linear-gradient(90deg, rgba(20,37,29,.72), rgba(20,37,29,.08)), url("${mediaUrl(circuit.image_principale)}")` } : undefined}>
        {!circuit.image_principale && <Mountain size={80} />}
        <div className="detail-hero-copy">
          <div className="eyebrow light-eyebrow">{circuit.theme} · {circuit.axe_region}</div>
          <h1>{circuit.titre}</h1>
          <div className="detail-stats"><span><CalendarDays size={16} /> {circuit.duree_jours} jours</span><span>À partir de {Number(circuit.prix_a_partir).toLocaleString('fr-FR')} Ar / personne</span></div>
        </div>
      </section>
      <div className="detail-columns">
        <section className="detail-main">
          <div className="eyebrow"><span className="eyebrow-dot" /> LE VOYAGE</div>
          <h2>Un itinéraire <em>à vivre</em></h2>
          <p className="detail-description">{circuit.description}</p>
          <div className="itinerary-title"><span>JOUR PAR JOUR</span><span>{circuit.etapes?.length || 0} étapes</span></div>
          {circuit.etapes?.length > 0 ? circuit.etapes.map((etape) => (
            <article className="itinerary-item" key={etape._id}>
              <span className="day-marker">{String(etape.numero_jour).padStart(2, '0')}</span>
              <div><h3>{etape.titre_etape}</h3><div className="itinerary-place"><MapPin size={13} /> {etape.lieu}</div>{etape.activites && <p>{etape.activites}</p>}</div>
            </article>
          )) : <p className="muted-copy">Le programme détaillé sera bientôt disponible.</p>}
        </section>
        <aside className="detail-aside">
          <span className="aside-label">PRÊT À PARTIR ?</span>
          <h3>Votre aventure commence ici.</h3>
          <p>Partagez-nous vos dates et vos envies. Nous vous répondrons avec une proposition personnalisée.</p>
          <Link className="button button-dark full-button" to={`/devis?circuit=${circuit._id}`}>Demander un devis <ArrowRight size={16} /></Link>
          <div className="aside-note"><ShieldCheck size={17} /> Sans engagement · Réponse sous 48h</div>
        </aside>
      </div>
    </main>
  )
}

function DevisPage() {
  const [circuits, setCircuits] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const params = new URLSearchParams(window.location.search)
  const [form, setForm] = useState({
    nom_client: '',
    email_client: '',
    telephone_client: '',
    id_circuit: params.get('circuit') || '',
    theme: params.get('theme') || '',
    axe_region: params.get('axe_region') || '',
    nb_personnes: '2',
    date_debut: '',
    date_fin: '',
    option_chez_namana: params.get('chez_namana') === 'true',
    remarques_besoins: '',
  })

  useEffect(() => {
    circuitApi.list().then(({ data }) => setCircuits(data.data || [])).catch((requestError) => setError(getErrorMessage(requestError)))
  }, [])

  function change(event) {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  async function submit(event) {
    event.preventDefault()
    setError('')
    setSending(true)
    try {
      const { theme, axe_region, ...devis } = form
      const remarques_besoins = [
        devis.remarques_besoins.trim(),
        theme && `Thématique souhaitée : ${theme}`,
        axe_region && `Région / axe souhaité : ${axe_region}`,
      ].filter(Boolean).join('\n\n')
      await devisApi.create({
        ...devis,
        nb_personnes: Number(form.nb_personnes),
        id_circuit: form.id_circuit || undefined,
        remarques_besoins,
      })
      setMessage('Votre demande a bien été envoyée. Notre équipe revient vers vous très bientôt.')
      setForm((current) => ({
        ...current,
        nom_client: '',
        email_client: '',
        telephone_client: '',
        theme: '',
        axe_region: '',
        remarques_besoins: '',
      }))
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setSending(false)
    }
  }

  return (
    <main className="form-page">
      <div className="form-intro">
        <div className="eyebrow"><span className="eyebrow-dot" /> VOYAGE SUR MESURE</div>
        <h1>Racontez-nous<br /><em>votre voyage.</em></h1>
        <p>Quelques informations pour commencer. Notre équipe locale vous répond personnellement sous 48 heures.</p>
        <div className="form-promise"><ShieldCheck size={19} /><span><strong>Gratuit et sans engagement</strong><br />Vos informations restent confidentielles.</span></div>
      </div>
      <form className="form-card" onSubmit={submit}>
        {message && <div className="success-message"><Check size={18} /> {message}</div>}
        {error && <div className="error-message">{error}</div>}
        <div className="form-section-title"><span>01</span><div><h2>Vos coordonnées</h2><p>Pour que nous puissions vous recontacter.</p></div></div>
        <div className="form-grid">
          <label className="field"><span>Nom complet *</span><input name="nom_client" value={form.nom_client} onChange={change} required placeholder="Votre nom" /></label>
          <label className="field"><span>Téléphone *</span><input name="telephone_client" value={form.telephone_client} onChange={change} required type="tel" placeholder="+261 ..." /></label>
          <label className="field field-wide"><span>Adresse e-mail *</span><input name="email_client" value={form.email_client} onChange={change} required type="email" placeholder="vous@exemple.com" /></label>
        </div>
        <div className="form-section-title"><span>02</span><div><h2>Votre séjour</h2><p>Nous ajusterons les détails ensemble.</p></div></div>
        <div className="form-grid">
          <label className="field"><span>Thématique</span><select name="theme" value={form.theme} onChange={change}><option value="">À définir ensemble</option>{themes.map((value) => <option key={value}>{value}</option>)}</select></label>
          <label className="field"><span>Région / axe</span><select name="axe_region" value={form.axe_region} onChange={change}><option value="">À définir ensemble</option>{regions.map((value) => <option key={value}>{value}</option>)}</select></label>
          <label className="field field-wide"><span>Circuit souhaité</span><select name="id_circuit" value={form.id_circuit} onChange={change}><option value="">Je ne sais pas encore</option>{circuits.map((circuit) => <option value={circuit._id} key={circuit._id}>{circuit.titre}</option>)}</select></label>
          <label className="field"><span>Nombre de voyageurs *</span><input name="nb_personnes" value={form.nb_personnes} onChange={change} required type="number" min="1" step="1" /></label>
          <label className="field"><span>Date de départ *</span><input name="date_debut" value={form.date_debut} onChange={change} required type="date" /></label>
          <label className="field"><span>Date de retour *</span><input name="date_fin" value={form.date_fin} onChange={change} required type="date" min={form.date_debut || undefined} /></label>
          <label className="checkbox-field field-wide"><input name="option_chez_namana" checked={form.option_chez_namana} onChange={change} type="checkbox" /><span>Je souhaite découvrir l'hébergement Chez Namana</span></label>
          <label className="field field-wide"><span>Vos envies, questions ou besoins particuliers</span><textarea name="remarques_besoins" value={form.remarques_besoins} onChange={change} rows="4" placeholder="Racontez-nous ce qui vous ferait plaisir…" /></label>
        </div>
        <button className="button button-dark submit-button" type="submit" disabled={sending}>{sending ? 'Envoi en cours…' : 'Envoyer ma demande'} <ArrowRight size={16} /></button>
        <p className="form-legal">En envoyant ce formulaire, vous acceptez d'être recontacté au sujet de votre voyage.</p>
      </form>
    </main>
  )
}

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await authApi.login({ email, password })
      localStorage.setItem('vazimba-token', data.token)
      navigate('/admin', { replace: true })
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <Link to="/" className="back-link">← Retour au site</Link>
      <form className="login-card" onSubmit={submit}>
        <span className="login-mark"><ShieldCheck size={24} /></span>
        <div className="eyebrow">ESPACE ÉQUIPE</div>
        <h1>Bon retour.</h1>
        <p>Connectez-vous pour gérer vos circuits et demandes.</p>
        {error && <div className="error-message">{error}</div>}
        <label className="field"><span>Adresse e-mail</span><input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
        <label className="field"><span>Mot de passe</span><input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
        <button className="button button-dark full-button" disabled={loading}>{loading ? 'Connexion…' : 'Se connecter'} <ArrowRight size={16} /></button>
      </form>
    </main>
  )
}

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

const emptyCircuit = {
  titre: '', theme: 'Classique', axe_region: 'Vakinankaratra', duree_jours: '1',
  prix_a_partir: '0', description: '', is_featured: false, image_principale: '',
}

function AdminCircuits() {
  const [circuits, setCircuits] = useState([])
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(emptyCircuit)
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  async function load() {
    try {
      const { data } = await circuitApi.list()
      setCircuits(data.data || [])
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true
    circuitApi.list()
      .then(({ data }) => {
        if (active) setCircuits(data.data || [])
      })
      .catch((requestError) => {
        if (active) setError(getErrorMessage(requestError))
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [])

  function startCreate() {
    setEditing(null)
    setForm(emptyCircuit)
    setError('')
    setShowForm(true)
  }

  function startEdit(circuit) {
    setEditing(circuit._id)
    setForm({ ...circuit, duree_jours: String(circuit.duree_jours), prix_a_partir: String(circuit.prix_a_partir) })
    setError('')
    setShowForm(true)
  }

  async function saveCircuit(event) {
    event.preventDefault()
    setError('')
    const payload = { ...form, duree_jours: Number(form.duree_jours), prix_a_partir: Number(form.prix_a_partir) }
    try {
      const response = editing ? await circuitApi.update(editing, payload) : await circuitApi.create(payload)
      const saved = response.data.data
      await load()
      setSelected(saved._id)
      setShowForm(false)
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    }
  }

  async function removeCircuit(circuit) {
    if (!window.confirm(`Supprimer « ${circuit.titre} » et toutes ses étapes ?`)) return
    setError('')
    try {
      await circuitApi.remove(circuit._id)
      if (selected === circuit._id) setSelected(null)
      await load()
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    }
  }

  const activeCircuit = circuits.find((item) => item._id === selected)

  return (
    <main className="admin-page">
      <div className="admin-page-heading"><div><div className="eyebrow">ITINÉRAIRES & PROGRAMMES</div><h1>Vos circuits</h1><p>Créez et mettez à jour les voyages proposés aux visiteurs.</p></div><button className="button button-dark" type="button" onClick={startCreate}><Plus size={17} /> Nouveau circuit</button></div>
      {error && <div className="error-message">{error}</div>}
      {showForm && <CircuitForm form={form} setForm={setForm} editing={Boolean(editing)} onSubmit={saveCircuit} onCancel={() => setShowForm(false)} error={error} />}
      {loading ? <div className="notice">Chargement…</div> : circuits.length === 0 ? <div className="admin-empty">Aucun circuit créé. Ajoutez votre premier itinéraire.</div> : (
        <div className="admin-circuit-layout">
          <section className="admin-panel circuit-list-panel">
            <div className="panel-heading"><h2>Liste des circuits</h2><span className="count-pill">{circuits.length}</span></div>
            {circuits.map((circuit) => (
              <button type="button" className={`managed-circuit ${selected === circuit._id ? 'selected' : ''}`} onClick={() => setSelected(circuit._id)} key={circuit._id}>
                <span className="managed-thumb" style={circuit.image_principale ? { backgroundImage: `url("${mediaUrl(circuit.image_principale)}")` } : undefined}><Mountain size={17} /></span>
                <span className="managed-copy"><strong>{circuit.titre}</strong><small>{circuit.axe_region} · {circuit.duree_jours} jours</small></span>
                {circuit.is_featured && <Sparkles size={14} className="featured-icon" />}
              </button>
            ))}
          </section>
          <section className="admin-panel managed-detail">
            {!activeCircuit ? <div className="select-prompt"><Compass size={28} /><p>Sélectionnez un circuit pour gérer son programme.</p></div> : (
              <>
                <div className="panel-heading detail-admin-heading"><div><div className="eyebrow">{activeCircuit.theme} · {activeCircuit.axe_region}</div><h2>{activeCircuit.titre}</h2></div><div className="action-row"><button type="button" className="small-action" onClick={() => startEdit(activeCircuit)}>Modifier</button><button type="button" className="danger-icon" onClick={() => removeCircuit(activeCircuit)} aria-label="Supprimer le circuit"><Trash2 size={16} /></button></div></div>
                <div className="circuit-admin-summary"><span>{activeCircuit.duree_jours} jours</span><span>À partir de {Number(activeCircuit.prix_a_partir).toLocaleString('fr-FR')} Ar</span><span>{activeCircuit.is_featured ? 'À la une' : 'Non mis en avant'}</span></div>
                <EtapeManager key={activeCircuit._id} circuit={activeCircuit} />
              </>
            )}
          </section>
        </div>
      )}
    </main>
  )
}

function CircuitForm({ form, setForm, editing, onSubmit, onCancel, error }) {
  function change(event) {
    const { name, value, type, checked } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  return (
    <form className="admin-panel admin-form" onSubmit={onSubmit}>
      <div className="panel-heading"><div><h2>{editing ? 'Modifier le circuit' : 'Créer un circuit'}</h2><p>Les champs marqués d'un * sont obligatoires.</p></div><button type="button" className="icon-button" onClick={onCancel} aria-label="Fermer"><X size={18} /></button></div>
      {error && <div className="error-message">{error}</div>}
      <div className="form-grid">
        <label className="field field-wide"><span>Titre *</span><input name="titre" value={form.titre} onChange={change} required /></label>
        <label className="field"><span>Thématique *</span><select name="theme" value={form.theme} onChange={change}>{themes.map((theme) => <option key={theme}>{theme}</option>)}</select></label>
        <label className="field"><span>Région *</span><select name="axe_region" value={form.axe_region} onChange={change}>{regions.map((region) => <option key={region}>{region}</option>)}</select></label>
        <label className="field"><span>Durée (jours) *</span><input name="duree_jours" value={form.duree_jours} onChange={change} type="number" min="1" required /></label>
        <label className="field"><span>Prix à partir de (Ar) *</span><input name="prix_a_partir" value={form.prix_a_partir} onChange={change} type="number" min="0" required /></label>
        <label className="field field-wide"><span>Image principale (URL)</span><input name="image_principale" value={form.image_principale || ''} onChange={change} placeholder="https://…" /></label>
        <label className="field field-wide"><span>Description *</span><textarea name="description" value={form.description} onChange={change} rows="4" required /></label>
        <label className="checkbox-field field-wide"><input name="is_featured" checked={Boolean(form.is_featured)} onChange={change} type="checkbox" /><span>Mettre ce circuit à la une</span></label>
      </div>
      <div className="action-row"><button className="button button-dark" type="submit">{editing ? 'Enregistrer' : 'Créer le circuit'} <Check size={16} /></button><button type="button" className="small-action" onClick={onCancel}>Annuler</button></div>
    </form>
  )
}

const emptyEtape = { numero_jour: '1', titre_etape: '', lieu: '', activites: '' }

function EtapeManager({ circuit }) {
  const [etapes, setEtapes] = useState([])
  const [form, setForm] = useState(emptyEtape)
  const [editing, setEditing] = useState('')
  const [error, setError] = useState('')

  async function load() {
    try {
      const { data } = await etapeApi.list(circuit._id)
      setEtapes(data.data || [])
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    }
  }

  useEffect(() => {
    etapeApi.list(circuit._id)
      .then(({ data }) => setEtapes(data.data || []))
      .catch((requestError) => setError(getErrorMessage(requestError)))
  }, [circuit._id])

  async function save(event) {
    event.preventDefault()
    setError('')
    const payload = { ...form, id_circuit: circuit._id, numero_jour: Number(form.numero_jour) }
    try {
      if (editing) await etapeApi.update(editing, payload)
      else await etapeApi.create(payload)
      setForm({ ...emptyEtape, numero_jour: String(etapes.length + 2) })
      setEditing('')
      await load()
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    }
  }

  function edit(etape) {
    setEditing(etape._id)
    setForm({ numero_jour: String(etape.numero_jour), titre_etape: etape.titre_etape, lieu: etape.lieu, activites: etape.activites || '' })
  }

  async function remove(id) {
    if (!window.confirm('Supprimer cette étape ?')) return
    try {
      await etapeApi.remove(id)
      await load()
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    }
  }

  return (
    <div className="step-manager">
      <div className="panel-subheading"><div><h3>Programme jour par jour</h3><p>Les étapes sont affichées dans l'ordre des jours.</p></div><span className="count-pill">{etapes.length} étapes</span></div>
      {error && <div className="error-message">{error}</div>}
      {etapes.length > 0 && <div className="step-list">{etapes.map((etape) => <article className="step-row" key={etape._id}><span className="day-marker">{String(etape.numero_jour).padStart(2, '0')}</span><div className="step-row-content"><strong>{etape.titre_etape}</strong><small><MapPin size={12} /> {etape.lieu}</small>{etape.activites && <p>{etape.activites}</p>}</div><div className="action-row"><button className="small-action" type="button" onClick={() => edit(etape)}>Modifier</button><button className="danger-icon" type="button" onClick={() => remove(etape._id)} aria-label="Supprimer l'étape"><Trash2 size={15} /></button></div></article>)}</div>}
      <form className="step-form" onSubmit={save}>
        <h4>{editing ? 'Modifier une étape' : 'Ajouter une étape'}</h4>
        <div className="form-grid">
          <label className="field"><span>Jour *</span><input type="number" min="1" required value={form.numero_jour} onChange={(event) => setForm({ ...form, numero_jour: event.target.value })} /></label>
          <label className="field"><span>Lieu *</span><input required value={form.lieu} onChange={(event) => setForm({ ...form, lieu: event.target.value })} /></label>
          <label className="field field-wide"><span>Titre de l'étape *</span><input required value={form.titre_etape} onChange={(event) => setForm({ ...form, titre_etape: event.target.value })} /></label>
          <label className="field field-wide"><span>Activités</span><textarea rows="2" value={form.activites} onChange={(event) => setForm({ ...form, activites: event.target.value })} /></label>
        </div>
        <div className="action-row"><button className="small-action primary-small" type="submit">{editing ? 'Enregistrer' : <><Plus size={15} /> Ajouter l'étape</>}</button>{editing && <button type="button" className="small-action" onClick={() => { setEditing(''); setForm(emptyEtape) }}>Annuler</button>}</div>
      </form>
    </div>
  )
}

function AdminDevis() {
  const [requests, setRequests] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  async function load() {
    try {
      const { data } = await devisApi.list()
      setRequests(data.data || [])
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true
    devisApi.list()
      .then(({ data }) => {
        if (active) setRequests(data.data || [])
      })
      .catch((requestError) => {
        if (active) setError(getErrorMessage(requestError))
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [])

  async function updateStatus(id, statut_traitement) {
    setError('')
    try {
      await devisApi.update(id, { statut_traitement })
      await load()
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    }
  }

  return (
    <main className="admin-page">
      <div className="admin-page-heading"><div><div className="eyebrow">RELATION VOYAGEURS</div><h1>Demandes de devis</h1><p>Retrouvez les projets de voyage et mettez à jour leur suivi.</p></div><button className="small-action" type="button" onClick={load}>Actualiser <ArrowRight size={14} /></button></div>
      {error && <div className="error-message">{error}</div>}
      {loading ? <div className="notice">Chargement des demandes…</div> : requests.length === 0 ? <div className="admin-empty">Aucune demande reçue pour le moment.</div> : (
        <div className="admin-panel table-panel"><div className="panel-heading"><h2>{requests.length} demande{requests.length > 1 ? 's' : ''}</h2></div>
          <div className="request-list">{requests.map((request) => <article className="request-card" key={request._id}>
            <div className="request-head"><div className="request-avatar">{request.nom_client?.slice(0, 1)?.toUpperCase()}</div><div><h3>{request.nom_client}</h3><span>{request.email_client} · {request.telephone_client}</span></div><select aria-label={`Statut de la demande de ${request.nom_client}`} className={`status-select status-${request.statut_traitement?.toLowerCase().replace(' ', '-')}`} value={request.statut_traitement} onChange={(event) => updateStatus(request._id, event.target.value)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></div>
            <div className="request-details"><span><CalendarDays size={14} /> {new Date(request.date_debut).toLocaleDateString('fr-FR')} – {new Date(request.date_fin).toLocaleDateString('fr-FR')}</span><span>{request.nb_personnes} voyageur{request.nb_personnes > 1 ? 's' : ''}</span><span>{request.id_circuit?.titre || 'Voyage sur mesure'}</span>{request.option_chez_namana && <span>Option Chez Namana</span>}</div>
            {request.remarques_besoins && <p className="request-notes">« {request.remarques_besoins} »</p>}
            <div className="request-date">Reçue le {new Date(request.createdAt).toLocaleDateString('fr-FR')}</div>
          </article>)}</div>
        </div>
      )}
    </main>
  )
}

function AdminPhotos() {
  const [hebergementId, setHebergementId] = useState('')
  const [photos, setPhotos] = useState([])
  const [form, setForm] = useState({ titre_photo: '', categorie: 'Chambre', is_principale: false, image: null })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function loadPhotos(event) {
    event?.preventDefault()
    if (!hebergementId.trim()) {
      setError("Saisissez l'identifiant de l'hébergement.")
      return
    }
    setError('')
    setLoading(true)
    try {
      const { data } = await photoApi.list(hebergementId.trim())
      setPhotos(data.data || [])
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setLoading(false)
    }
  }

  async function addPhoto(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    setSubmitting(true)
    try {
      const payload = new FormData()
      payload.append('id_hebergement', hebergementId.trim())
      payload.append('titre_photo', form.titre_photo)
      payload.append('categorie', form.categorie)
      payload.append('is_principale', String(form.is_principale))
      payload.append('image', form.image)
      await photoApi.create(payload)
      setMessage('Photo ajoutée avec succès.')
      setForm({ titre_photo: '', categorie: 'Chambre', is_principale: false, image: null })
      event.target.reset()
      await loadPhotos()
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    } finally {
      setSubmitting(false)
    }
  }

  async function removePhoto(photo) {
    if (!window.confirm(`Supprimer la photo « ${photo.titre_photo} » ?`)) return
    setError('')
    try {
      await photoApi.remove(photo._id)
      setPhotos((current) => current.filter((item) => item._id !== photo._id))
    } catch (requestError) {
      setError(getErrorMessage(requestError))
    }
  }

  return (
    <main className="admin-page">
      <div className="admin-page-heading"><div><div className="eyebrow">GALERIE CHEZ NAMANA</div><h1>Photos hébergement</h1><p>Ajoutez et gérez les images des hébergements via leur identifiant.</p></div></div>
      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message"><Check size={17} />{message}</div>}
      <div className="admin-panel photo-lookup">
        <form className="lookup-form" onSubmit={loadPhotos}><label className="field"><span>Identifiant de l'hébergement</span><input value={hebergementId} onChange={(event) => setHebergementId(event.target.value)} required placeholder="ID MongoDB de l'hébergement" /></label><button className="button button-dark" type="submit">Charger les photos <ArrowRight size={15} /></button></form>
        <p className="helper-text">L'API ne propose pas de route de liste des hébergements : récupérez l'identifiant dans votre base de données.</p>
      </div>
      {hebergementId && <form className="admin-panel photo-upload" onSubmit={addPhoto}>
        <div className="panel-heading"><div><h2>Ajouter une photo</h2><p>Image téléversée dans la galerie de cet hébergement.</p></div></div>
        <div className="form-grid">
          <label className="field field-wide"><span>Titre de la photo *</span><input value={form.titre_photo} onChange={(event) => setForm({ ...form, titre_photo: event.target.value })} required /></label>
          <label className="field"><span>Catégorie *</span><select value={form.categorie} onChange={(event) => setForm({ ...form, categorie: event.target.value })}>{photoCategories.map((category) => <option key={category}>{category}</option>)}</select></label>
          <label className="field"><span>Image *</span><input type="file" accept="image/*" required onChange={(event) => setForm({ ...form, image: event.target.files?.[0] || null })} /></label>
          <label className="checkbox-field field-wide"><input type="checkbox" checked={form.is_principale} onChange={(event) => setForm({ ...form, is_principale: event.target.checked })} /><span>Photo principale de l'hébergement</span></label>
        </div>
        <button className="button button-dark" type="submit" disabled={submitting || !form.image}>{submitting ? 'Téléversement…' : 'Ajouter la photo'} <Plus size={16} /></button>
      </form>}
      {loading && <div className="notice">Chargement des photos…</div>}
      {!loading && photos.length > 0 && <section className="photo-gallery">{photos.map((photo) => <article className="photo-admin-card" key={photo._id}><img src={mediaUrl(photo.url_image)} alt={photo.titre_photo} /><div><span className="photo-category">{photo.categorie}{photo.is_principale ? ' · Principale' : ''}</span><h3>{photo.titre_photo}</h3><button className="danger-icon" type="button" onClick={() => removePhoto(photo)} aria-label={`Supprimer ${photo.titre_photo}`}><Trash2 size={15} /> Supprimer</button></div></article>)}</section>}
      {!loading && hebergementId && photos.length === 0 && <div className="admin-empty">Aucune photo chargée pour cet hébergement.</div>}
    </main>
  )
}

function NotFound() {
  return <PublicLayout><main className="not-found"><span>404</span><h1>Cette page s'est égarée.</h1><Link className="button button-dark" to="/">Retour à l'accueil <ArrowRight size={16} /></Link></main></PublicLayout>
}

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
