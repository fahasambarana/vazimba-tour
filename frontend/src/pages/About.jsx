import { Link } from 'react-router-dom'
import { ArrowRight, Compass, HeartHandshake, Leaf } from 'lucide-react'

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
export default AboutPage
