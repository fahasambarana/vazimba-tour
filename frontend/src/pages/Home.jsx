import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowRight,
  BedDouble,
  ChevronDown,
  Compass,
  HeartHandshake,
  House,
  Leaf,
  MapPin,
  Mountain,
  Sparkles,
  X,
} from "lucide-react";
import api, { circuitApi, getErrorMessage } from "../services/api";
import { themes, regions } from "../lib/utils";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { useMotion, batchReveal } from "../lib/motion";
import CircuitCard from "../components/CircuitCard";

const landscapes = [
  {
    title: "Les Hautes Matsiatra",
    place: "Hautes Terres · Fianarantsoa",
    image:
      "https://fianarantsoa-tourisme.com/wp-content/uploads/2022/03/rice-field-madagascar-4909001_960_720.jpg",
    credit: "Tourisme Fianarantsoa",
    source: "https://fianarantsoa-tourisme.com/site_touristique/la-riziere/",
  },
  {
    title: "L’allée des Baobabs",
    place: "Morondava · côte ouest",
    image:
      "https://images.unsplash.com/photo-1659944975073-453265ccf3a6?auto=format&fit=crop&w=1400&q=85",
    credit: "Yasmine Arfaoui",
    source: "https://unsplash.com/photos/allee-des-baobabs-madagaskar-tagsuber-G40jEUyEsEk",
  },
  {
    title: "Les Tsingy de Bemaraha",
    place: "Bekopaka · ouest",
    image:
      "https://images.unsplash.com/photo-1781428268792-23853eab57ef?auto=format&fit=crop&w=1100&q=85",
    credit: "Rafael Peier",
    source:
      "https://unsplash.com/photos/tsingy-rock-formations-and-green-trees-under-a-clear-sky-1ZcEPkTc_uM",
  },
  {
    title: "La forêt de lémuriens",
    place: "Andasibe · est",
    image:
      "https://images.unsplash.com/photo-1656163157901-8715e42adeb4?auto=format&fit=crop&w=1400&q=85",
    credit: "Sandy Ravaloniaina",
    source: "https://unsplash.com/photos/a-lemur-on-a-branch-RBLzhR0gmKo",
  },
];

function HomePage() {
  const [circuits, setCircuits] = useState([]);
  const [theme, setTheme] = useState("");
  const [region, setRegion] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [apiOnline, setApiOnline] = useState(null);
  const [heroLandscapeIndex, setHeroLandscapeIndex] = useState(0);

  useEffect(() => {
    let active = true;
    circuitApi
      .list({ theme, axe_region: region })
      .then(({ data }) => {
        if (active) setCircuits(data.data || []);
      })
      .catch((requestError) => {
        if (active) setError(getErrorMessage(requestError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [theme, region]);

  useEffect(() => {
    const apiRoot = (
      import.meta.env.VITE_API_URL || "http://localhost:5000/api"
    ).replace(/\/api\/?$/, "");
    api
      .get(apiRoot)
      .then(() => setApiOnline(true))
      .catch(() => setApiOnline(false));
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroLandscapeIndex((current) => (current + 1) % landscapes.length);
    }, 3000);
    return () => window.clearInterval(timer);
  }, []);

  const root = useRef(null);

  // Hero + sections fixes (jouées une seule fois)
  useMotion(
    (el) => {
      const q = gsap.utils.selector(el);

      // Le moment marquant de tout le site : l'entrée du hero
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(q(".hero-copy .eyebrow"), { autoAlpha: 0, y: 16, duration: 0.5 })
        .from(
          q(".hero-copy h1"),
          { autoAlpha: 0, y: 48, duration: 0.9 },
          "-=0.2",
        )
        .from(
          q(".hero-copy > p, .hero-actions, .hero-note"),
          { autoAlpha: 0, y: 20, stagger: 0.12, duration: 0.6 },
          "-=0.5",
        )
        .fromTo(
          q(".hero-art"),
          { clipPath: "inset(0 0 100% 0)" },
          {
            clipPath: "inset(0 0 0% 0)",
            duration: 1.1,
            ease: "power4.inOut",
            clearProps: "clipPath",
          },
          0.1,
        )
        .from(
          q(".sun-disc"),
          { yPercent: 40, scale: 0.8, autoAlpha: 0, duration: 1.4 },
          0.6,
        )
        .from(
          q(".hero-photo-caption, .hero-photo-number"),
          { autoAlpha: 0, y: 10, stagger: 0.1, duration: 0.5 },
          "-=0.4",
        );

      // Le reste reste sobre : apparitions au scroll
      gsap.from(q(".intro-band > *"), {
        autoAlpha: 0,
        y: 30,
        stagger: 0.12,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: q(".intro-band")[0],
          start: "top 80%",
          once: true,
        },
      });
      batchReveal(el, ".commitments-section .section-heading");
      batchReveal(el, ".commitment-card", { stagger: 0.12 });
      batchReveal(el, ".landscape-gallery-heading, .landscape-card", {
        y: 24,
        stagger: 0.12,
      });
      gsap.utils.toArray(".landscape-card img", el).forEach((img) => {
        gsap.from(img, {
          scale: 1.08,
          duration: 1,
          ease: "power1.out",
          scrollTrigger: { trigger: img, start: "top 90%", once: true },
        });
      });

      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: q(".featured-experience")[0],
            start: "top 70%",
            once: true,
          },
        })
        .from(q(".featured-copy > *"), {
          autoAlpha: 0,
          y: 30,
          stagger: 0.1,
          duration: 0.7,
        })
        .from(
          q(".featured-landmarks span"),
          { autoAlpha: 0, x: 30, stagger: 0.12, duration: 0.6 },
          "-=0.4",
        );

      batchReveal(el, ".circuits-section .section-heading, .filters");

      // Léger parallaxe sur l'image Chez Namana
      gsap.fromTo(
        q(".lodging-preview-art"),
        { backgroundPositionY: "20%" },
        {
          backgroundPositionY: "80%",
          ease: "none",
          scrollTrigger: {
            trigger: q(".lodging-preview")[0],
            scrub: true,
            start: "top bottom",
            end: "bottom top",
          },
        },
      );
      batchReveal(el, ".lodging-preview-copy > *", { stagger: 0.1 });
      batchReveal(el, ".quote-banner");
    },
    { scope: root },
  );

  useMotion(
    (el) => {
      gsap.fromTo(
        el.querySelector(".hero-slideshow-image"),
        { autoAlpha: 0.7, scale: 1.015 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.45,
          ease: "power1.out",
          clearProps: "transform,opacity,visibility",
        },
      );
    },
    { scope: root, dependencies: [heroLandscapeIndex] },
  );

  // Cartes de circuits : rejouées quand l'API répond ou qu'un filtre change
  useMotion(
    (el) => {
      batchReveal(el, ".circuit-card", { y: 40, stagger: 0.1 });
      ScrollTrigger.refresh();
    },
    { scope: root, dependencies: [circuits] },
  );

  const currentLandscape = landscapes[heroLandscapeIndex];

  return (
    <main ref={root}>
      <section className="hero-section">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="eyebrow-dot" /> TOURISME SOLIDAIRE · DÉCOUVERTE ·
            AVENTURE · CULTURE · NATURE
          </div>
          <h1>
            La grande île,
            <br />
            <em>à votre façon.</em>
          </h1>
          <p>
            Vivez Madagascar au plus près de ses habitants : immersion
            villageoise, coutumes vivantes, nature et aventures pensées avec les
            communautés locales.
          </p>
          <div className="hero-actions">
            <a className="button button-dark" href="#circuits">
              Explorer les circuits <ArrowDownRight size={17} />
            </a>
            <Link className="text-link" to="/devis">
              Voyage sur mesure <ArrowRight size={16} />
            </Link>
          </div>
          <div className="hero-note">
            <span className="note-line" /> Authenticité · Partage · Respect des
            coutumes
          </div>
        </div>
        <div
          className="hero-art"
          role="img"
          aria-label={`${currentLandscape.title}, ${currentLandscape.place}`}>
          <img
            className="hero-slideshow-image"
            src={currentLandscape.image}
            alt=""
            fetchPriority="high"
            decoding="async"
          />
          <div className="sun-disc" />
          <div className="hero-photo-caption">
            <MapPin size={14} /> {currentLandscape.place} · Madagascar
          </div>
          <div className="hero-photo-number">
            {String(heroLandscapeIndex + 1).padStart(2, "0")} <span>/</span>{" "}
            {String(landscapes.length).padStart(2, "0")}
          </div>
        </div>
        <div className="hero-bottom">
          <span>
            <Sparkles size={15} /> Une autre manière de voyager
          </span>
          <span className="scroll-cue">
            DÉFILER <span />
          </span>
        </div>
      </section>

      <section id="esprit" className="intro-band">
        <div className="intro-label">
          <span>01</span> L'ESPRIT VAZIMBA
        </div>
        <p>
          Tourisme solidaire, découverte, aventure, culture, nature et{" "}
          <em>authenticité.</em>
        </p>
        <span className="intro-stamp">
          <Compass size={23} /> FAIT AVEC
          <br />
          LE CŒUR
        </span>
      </section>

      <section className="commitments-section section-wrap">
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              <span className="eyebrow-dot" /> NOS ENGAGEMENTS
            </div>
            <h2>
              Voyager autrement,
              <br />
              <em>ensemble.</em>
            </h2>
          </div>
          <p>
            Chaque rencontre est une occasion de découvrir, de partager et de
            soutenir la vie locale.
          </p>
        </div>
        <div className="commitment-grid">
          <article className="commitment-card">
            <span>
              <House size={23} />
            </span>
            <h3>Chez l’habitant</h3>
            <p>
              Une immersion chaleureuse à Betafo, dans la maison d’hôtes Chez
              Namana.
            </p>
            <Link to="/chez-l-habitant">
              Découvrir l’hébergement <ArrowRight size={14} />
            </Link>
          </article>
          <article className="commitment-card">
            <span>
              <HeartHandshake size={23} />
            </span>
            <h3>Culture & traditions</h3>
            <p>
              Des rencontres respectueuses des coutumes et du patrimoine des
              villages.
            </p>
            <Link to="/a-propos">
              Notre démarche <ArrowRight size={14} />
            </Link>
          </article>
          <article className="commitment-card">
            <span>
              <Leaf size={23} />
            </span>
            <h3>Nature & aventure</h3>
            <p>
              Des paysages de Madagascar aux parcours d’aventure, au rythme du
              territoire.
            </p>
            <Link to="/#circuits">
              Explorer les circuits <ArrowRight size={14} />
            </Link>
          </article>
        </div>
      </section>

      <FeaturedCircuitSection circuits={circuits} />

      <section className="landscape-gallery-section" aria-labelledby="landscape-title">
        <div className="landscape-gallery-heading section-heading">
          <div>
            <div className="eyebrow">
              <span className="eyebrow-dot" /> L’ÎLE AUX MILLE PAYSAGES
            </div>
            <h2 id="landscape-title">
              Madagascar <em>en images.</em>
            </h2>
          </div>
          <p>Des Hautes Terres aux grands baobabs, chaque région révèle un nouveau décor.</p>
        </div>
        <div className="landscape-gallery">
          {landscapes.map((landscape, index) => (
            <figure
              className={index === 0 || index === 3 ? "landscape-card landscape-card-wide" : "landscape-card"}
              key={landscape.title}
            >
              <img
                src={landscape.image}
                alt={`${landscape.title}, ${landscape.place}`}
                loading="lazy"
                decoding="async"
              />
              <figcaption>
                <span className="landscape-caption-copy">
                  <strong>{landscape.title}</strong>
                  <span>{landscape.place}</span>
                </span>
                <a
                  className="landscape-credit"
                  href={landscape.source}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Crédit photo : ${landscape.credit}`}
                >
                  {landscape.credit}
                </a>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section id="circuits" className="circuits-section section-wrap">
        <div className="section-heading">
          <div>
            <div className="eyebrow">
              <span className="eyebrow-dot" /> CHOISISSEZ VOTRE AVENTURE
            </div>
            <h2>
              Nos <em>circuits</em>
            </h2>
          </div>
          <p>
            Chaque itinéraire est une invitation à découvrir Madagascar
            autrement.
          </p>
        </div>
        <div className="filters" aria-label="Filtres des circuits">
          <label>
            <span>Thématique</span>
            <select
              value={theme}
              onChange={(event) => setTheme(event.target.value)}>
              <option value="">Toutes les thématiques</option>
              {themes.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
            <ChevronDown size={15} />
          </label>
          <label>
            <span>Région</span>
            <select
              value={region}
              onChange={(event) => setRegion(event.target.value)}>
              <option value="">Toutes les régions</option>
              {regions.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
            <ChevronDown size={15} />
          </label>
          {(theme || region) && (
            <button
              className="clear-filter"
              type="button"
              onClick={() => {
                setTheme("");
                setRegion("");
              }}>
              Effacer les filtres <X size={14} />
            </button>
          )}
        </div>

        {loading && <div className="notice">Chargement des circuits…</div>}
        {!loading && error && (
          <div className="notice notice-error">{error}</div>
        )}
        {!loading && !error && circuits.length === 0 && (
          <div className="empty-state">
            <Mountain size={28} />
            <h3>Aucun circuit pour le moment</h3>
            <p>
              Essayez d'autres filtres ou demandez-nous un voyage sur mesure.
            </p>
            <Link className="button button-dark" to="/devis">
              Parler de mon projet <ArrowRight size={16} />
            </Link>
          </div>
        )}
        {!loading && !error && circuits.length > 0 && (
          <div className="circuit-grid">
            {circuits.map((circuit, index) => (
              <CircuitCard circuit={circuit} key={circuit._id} index={index} />
            ))}
          </div>
        )}
        <div className="api-status">
          <span className={apiOnline ? "status-dot online" : "status-dot"} />{" "}
          {apiOnline === null
            ? "Connexion à l’API…"
            : apiOnline
              ? "Services opérationnels"
              : "API momentanément indisponible"}
        </div>
      </section>
      <LodgingPreview />
      <section className="quote-banner">
        <div className="quote-banner-icon">
          <Compass size={25} />
        </div>
        <div>
          <div className="eyebrow">VOTRE VOYAGE, VOS ENVIES</div>
          <h2>Vous avez une idée en tête ?</h2>
          <p>Nous la transformons en itinéraire unique, pensé avec vous.</p>
        </div>
        <Link className="button button-light" to="/devis">
          Parlons de votre projet <ArrowRight size={16} />
        </Link>
      </section>
    </main>
  );
}

function FeaturedCircuitSection({ circuits }) {
  const featuredCircuit = circuits.find(
    (circuit) =>
      circuit.is_featured ||
      /sur la trace des vazimba/i.test(circuit.titre || ""),
  );

  return (
    <section className="featured-experience">
      <div className="featured-copy">
        <div className="eyebrow light-eyebrow">
          <span className="eyebrow-dot" /> L’EXPÉRIENCE PHARE · VAKINANKARATRA
        </div>
        <h2>
          Sur la trace
          <br />
          <em>des Vazimba.</em>
        </h2>
        <p>
          Aponga Vato et Betafo, le mont Ibity, le lac Tritriva et Ianjanina
          (Anjanampara), avec une nuitée chez l’habitant à Chez Namana.
        </p>
        <Link
          className="button button-light"
          to={featuredCircuit ? `/circuits/${featuredCircuit._id}` : "/devis"}>
          {featuredCircuit ? "Voir le circuit" : "Demander ce voyage"}{" "}
          <ArrowRight size={15} />
        </Link>
      </div>
      <div
        className="featured-landmarks"
        aria-label="Étapes de l'expérience phare">
        <span>
          <MapPin size={15} /> Aponga Vato · Betafo
        </span>
        <span>
          <Mountain size={15} /> Mont Ibity
        </span>
        <span>
          <MapPin size={15} /> Lac Tritriva
        </span>
        <span>
          <BedDouble size={15} /> Nuitée chez Namana
        </span>
      </div>
    </section>
  );
}

function LodgingPreview() {
  return (
    <section className="lodging-preview">
      <div
        className="lodging-preview-art"
        role="img"
        aria-label="Paysage des Hautes Terres près de Betafo"
      />
      <div className="lodging-preview-copy">
        <div className="eyebrow">
          <span className="eyebrow-dot" /> BETAFO · HAUTES TERRES
        </div>
        <h2>
          La convivialité
          <br />
          de <em>Chez Namana.</em>
        </h2>
        <p>
          Découvrez une maison d’hôtes locale, ses chambres, sa table
          traditionnelle et les histoires partagées autour d’un repas.
        </p>
        <Link className="button button-dark" to="/chez-l-habitant">
          Découvrir Chez Namana <ArrowRight size={15} />
        </Link>
      </div>
    </section>
  );
}

export default HomePage;
