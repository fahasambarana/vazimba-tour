import { ArrowUpRight, CalendarDays, MapPin, Mountain, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { mediaUrl } from "../lib/utils";

function CircuitCard({ circuit, index = 0 }) {
  const image = mediaUrl(circuit.image_principale);

  return (
    <article className={`circuit-card card-${index % 3}`}>
      <Link
        className="card-image"
        to={`/circuits/${circuit._id}`}
        aria-label={`Découvrir le circuit ${circuit.titre}`}
        style={image ? { backgroundImage: `url("${image}")` } : undefined}
      >
        {!image && (
          <span className="image-placeholder" aria-hidden="true">
            <Mountain size={34} />
            <span>MADAGASCAR</span>
          </span>
        )}
        <span className="card-theme">{circuit.theme}</span>
        {circuit.is_featured && (
          <span className="featured-label"><Sparkles size={12} /> À la une</span>
        )}
        <span className="card-open"><ArrowUpRight size={17} /></span>
      </Link>
      <div className="card-content">
        <div className="card-location"><MapPin size={12} /> {circuit.axe_region}</div>
        <h3>{circuit.titre}</h3>
        <p>{circuit.description}</p>
        <div className="card-meta">
          <span><CalendarDays size={13} /> {circuit.duree_jours} jours</span>
          <strong>À partir de {Number(circuit.prix_a_partir).toLocaleString("fr-FR")} Ar</strong>
        </div>
      </div>
    </article>
  );
}

export default CircuitCard;
