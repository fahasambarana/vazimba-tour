import { useEffect, useState } from 'react'
import { ArrowRight, Check, ShieldCheck } from 'lucide-react'
import { circuitApi, devisApi, getErrorMessage } from '../services/api'
import { regions, themes } from '../utils/content'

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
export default DevisPage
