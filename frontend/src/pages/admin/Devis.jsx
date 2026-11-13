import { useEffect, useState } from 'react'
import { ArrowRight, CalendarDays } from 'lucide-react'
import { devisApi, getErrorMessage } from '../../services/api'
import { statuses } from '../../utils/content'

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
export default AdminDevis
