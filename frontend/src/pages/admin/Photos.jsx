import { useState } from 'react'
import { ArrowRight, Check, Plus, Trash2 } from 'lucide-react'
import { getErrorMessage, photoApi } from '../../services/api'
import { mediaUrl, photoCategories } from '../../utils/content'

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
export default AdminPhotos
