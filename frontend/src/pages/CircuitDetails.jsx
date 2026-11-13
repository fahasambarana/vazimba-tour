import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, CalendarDays, MapPin, Mountain, ShieldCheck } from 'lucide-react'
import { circuitApi, getErrorMessage } from '../services/api'
import { mediaUrl } from '../utils/content'

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
export default CircuitPage
