import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BedDouble, HeartHandshake, Utensils } from 'lucide-react'
import { getErrorMessage, photoApi } from '../services/api'
import { mediaUrl } from '../utils/content'

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
export default LodgingPage
