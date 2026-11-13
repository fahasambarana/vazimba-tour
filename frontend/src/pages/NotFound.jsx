import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import PublicLayout from '../components/layout/PublicLayout'

function NotFound() {
  return <PublicLayout><main className="not-found"><span>404</span><h1>Cette page s'est égarée.</h1><Link className="button button-dark" to="/">Retour à l'accueil <ArrowRight size={16} /></Link></main></PublicLayout>
}
export default NotFound
