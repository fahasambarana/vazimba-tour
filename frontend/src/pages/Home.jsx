import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowDownRight, ArrowRight, BedDouble, CalendarDays, ChevronDown, Compass, HeartHandshake, House, Leaf, MapPin, Mountain, Sparkles, X } from 'lucide-react'
import api, { circuitApi, getErrorMessage } from '../services/api'
import { mediaUrl, regions, themes } from '../utils/content'

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
export default HomePage
