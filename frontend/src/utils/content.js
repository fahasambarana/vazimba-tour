export const themes = ['Villageois', 'Aventure', 'Classique']
export const regions = ['Vakinankaratra', 'Nord', 'Sud', 'Est', 'Ouest']
export const statuses = ['En attente', 'En cours', 'Acceptée', 'Refusée']
export const photoCategories = ['Chambre', 'Repas', 'Exterieur']

export function mediaUrl(path) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  const serverUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '')
  return `${serverUrl}${path.startsWith('/') ? path : `/${path}`}`
}
