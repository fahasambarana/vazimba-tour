import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { authApi, getErrorMessage } from "../../services/api";
import { gsap } from "../../lib/gsap";
import { useMotion } from "../../lib/motion";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await authApi.login({ email, password });
      localStorage.setItem("vazimba-token", data.token);
      navigate("/admin", { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }

  const root = useRef(null);

  useMotion(
    (el) => {
      gsap.from(el.querySelector(".login-card"), {
        autoAlpha: 0,
        y: 30,
        scale: 0.98,
        duration: 0.7,
        ease: "power3.out",
      });
      gsap.from(gsap.utils.toArray(".login-card > *", el), {
        autoAlpha: 0,
        y: 12,
        stagger: 0.06,
        duration: 0.5,
        delay: 0.25,
        ease: "power2.out",
      });
    },
    { scope: root },
  );

  return (
    <main className="login-page" ref={root}>
      <Link to="/" className="back-link">
        ← Retour au site
      </Link>
      <form className="login-card" onSubmit={submit}>
        <span className="login-mark">
          <ShieldCheck size={24} />
        </span>
        <div className="eyebrow">ESPACE ÉQUIPE</div>
        <h1>Bon retour.</h1>
        <p>Connectez-vous pour gérer vos circuits et demandes.</p>
        {error && <div className="error-message">{error}</div>}
        <label className="field">
          <span>Adresse e-mail</span>
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <label className="field">
          <span>Mot de passe</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        <button className="button button-dark full-button" disabled={loading}>
          {loading ? "Connexion…" : "Se connecter"} <ArrowRight size={16} />
        </button>
      </form>
    </main>
  );
}

export default LoginPage;
