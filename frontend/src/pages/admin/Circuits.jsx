import { useEffect, useState } from 'react'
import { Check, Compass, MapPin, Mountain, Plus, Sparkles, Trash2, X } from 'lucide-react'
import { circuitApi, etapeApi, getErrorMessage } from '../../services/api'
import { mediaUrl, regions, themes } from '../../utils/content'

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
export default AdminCircuits
