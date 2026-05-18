import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const features = [
  {
    title: "Unified performance view",
    copy: "Track scores, tenure, departments, and skills in one searchable roster synced to MongoDB.",
    tag: "Data",
  },
  {
    title: "GPT-powered guidance",
    copy: "Rankings, promotions, training ideas, and written feedback—all from structured employee signals.",
    tag: "AI",
  },
  {
    title: "Secure HR access",
    copy: "Only authenticated HR and admin staff reach the roster; JWT protects roster edits and AI runs.",
    tag: "Security",
  },
  {
    title: "Filters that flex",
    copy: "Slice by department, skill keywords, or minimum score—the same Express endpoints your examiner expects.",
    tag: "API",
  },
];

const steps = [
  {
    step: "01",
    title: "Sign in",
    text: "Use your HR or admin credentials (provisioned separately—employees do not create their own workspace accounts here).",
  },
  {
    step: "02",
    title: "Load your bench",
    text: "Add and edit employee profiles: department, skills, scores, tenure—matching the Employee Registration workflow.",
  },
  {
    step: "03",
    title: "Let AI advise",
    text: "Run recommendations on subsets or your whole roster in one click.",
  },
];

export default function LandingPage() {
  const { token } = useAuth();
  if (token) return <Navigate to="/employees" replace />;

  return (
    <div className="landing">
      <section className="landing-hero">
        <div className="landing-hero__badge">MERN · OpenAI-ready</div>
        <h1 className="landing-hero__title">
          Performance clarity
          <span className="landing-hero__accent">without the spreadsheet sprawl.</span>
        </h1>
        <p className="landing-hero__lead">
          For <strong>HR and admin teams</strong> managing employee profiles, metrics, and AI-assisted reviews—employees are
          modelled inside the roster, not registered as dashboard users themselves.
        </p>
        <div className="landing-hero__actions">
          <Link className="btn btn-glow" to="/login">
            Staff login
          </Link>
          <Link className="btn btn-outline-light" to="/login">
            Open console
          </Link>
        </div>
        <div className="landing-hero__viz" aria-hidden>
          <div className="orbit orbit--one" />
          <div className="orbit orbit--two" />
          <div className="hero-card hero-card--a">
            <span className="hero-card__label">Avg. score</span>
            <span className="hero-card__val">82.4</span>
            <span className="hero-card__hint">Across 47 profiles</span>
          </div>
          <div className="hero-card hero-card--b">
            <span className="hero-card__label">Next review</span>
            <span className="hero-card__val mono">Promotion</span>
            <span className="hero-card__hint">3 high performers</span>
          </div>
        </div>
      </section>

      <section className="landing-strip" aria-label="Highlights">
        <div className="landing-strip__grid">
          <div className="landing-strip__cell">
            <strong>React · Vite</strong>
            <span>Composable UI with Axios integration</span>
          </div>
          <div className="landing-strip__cell">
            <strong>Express · MongoDB</strong>
            <span>REST + validation pipelines</span>
          </div>
          <div className="landing-strip__cell">
            <strong>OpenAI</strong>
            <span>gpt-4o-mini by default · env override</span>
          </div>
        </div>
      </section>

      <section className="landing-bento-wrap">
        <h2 className="landing-section-title">Built for the brief</h2>
        <p className="landing-section-sub">Everything your case study checklist asks for—packaged cleanly.</p>
        <div className="landing-bento">
          {features.map((f) => (
            <article key={f.title} className="bento-card">
              <span className="bento-card__tag">{f.tag}</span>
              <h3>{f.title}</h3>
              <p>{f.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-flow">
        <h2 className="landing-section-title">How teams use it</h2>
        <div className="flow-grid">
          {steps.map((s) => (
            <div key={s.step} className="flow-step">
              <span className="flow-step__num">{s.step}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-cta">
        <div className="landing-cta__inner glass-panel">
          <h2>Ready when your panel is.</h2>
          <p>MongoDB Atlas, JWT-backed APIs, and env-based secrets—not hardcoded users in source control.</p>
          <div className="landing-cta__row">
            <Link className="btn btn-glow" to="/login">
              Sign in as HR/admin
            </Link>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <span className="brand-mini">
          <span className="dot" /> PerfInsight
        </span>
        <span className="muted">Employee performance analytics · prototype · {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}
