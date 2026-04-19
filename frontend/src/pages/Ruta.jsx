import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api";
import { Button } from "../components/ui/button";
import {
  Compass,
  CheckCircle2,
  Circle,
  Loader2,
  RotateCcw,
  Sparkles,
  BookOpen,
  Baby,
  ArrowRight,
} from "lucide-react";
import Markdown from "../components/Markdown";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function Ruta() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [progress, setProgress] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState(false);
  const [advancing, setAdvancing] = useState(false);
  const [resetting, setResetting] = useState(false);

  const load = useCallback(async () => {
    try {
      const [p, r, pr, rv] = await Promise.all([
        api.get("/journey/profile"),
        api.get("/journey/roadmap"),
        api.get("/journey/progress"),
        api.get("/journey/reviews"),
      ]);
      setProfile(p.data);
      setRoadmap(r.data);
      setProgress(pr.data);
      setReviews(rv.data);
    } catch (e) {
      if (e.response?.status === 404) {
        navigate("/diagnostico");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    load();
  }, [load]);

  const generateReview = async () => {
    setReviewing(true);
    try {
      await api.post("/journey/review");
      toast.success("Revisión generada");
      await load();
    } catch (e) {
      toast.error("Error al generar revisión");
    } finally {
      setReviewing(false);
    }
  };

  const advancePhase = async () => {
    setAdvancing(true);
    try {
      await api.post("/journey/advance-phase");
      toast.success("Has avanzado a la siguiente fase");
      await load();
    } finally {
      setAdvancing(false);
    }
  };

  const resetJourney = async () => {
    if (!window.confirm("¿Seguro? Borrará tu perfil, ruta y guías diarias.")) return;
    setResetting(true);
    try {
      await api.delete("/journey/reset");
      toast.success("Ruta reiniciada");
      navigate("/diagnostico");
    } finally {
      setResetting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="ruta-loading">
        <Loader2 className="w-6 h-6 text-forest animate-spin" />
      </div>
    );
  }

  if (!profile || !roadmap) return null;

  const currentPhaseNum = roadmap.current_phase;

  return (
    <div className="p-6 md:p-10 max-w-6xl" data-testid="ruta-page">
      <div className="mb-8 animate-fade-in-up flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="label-upper">Tu ruta de transformación</p>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-forest mt-2 tracking-tighter leading-tight">
            Diseñada por tu coach
            <br />
            <span className="text-terracotta">sólo para ti.</span>
          </h1>
        </div>
        <Button
          onClick={resetJourney}
          disabled={resetting}
          variant="outline"
          data-testid="reset-journey-btn"
          className="rounded-full border-bone-dark text-forest-light hover:text-terracotta"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reiniciar ruta
        </Button>
      </div>

      {/* Perfil transformacional */}
      <div className="tactile-card p-8 mb-6" data-testid="profile-card">
        <div className="flex items-center gap-2 mb-4">
          <Compass className="w-5 h-5 text-terracotta" strokeWidth={1.5} />
          <p className="label-upper">Tu perfil transformacional</p>
        </div>

        <div className="space-y-5">
          <div>
            <p className="label-upper text-forest-light">Diagnóstico</p>
            <p className="font-body text-forest mt-1 leading-relaxed">
              {profile.diagnosis}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <p className="label-upper text-forest-light">Patrones núcleo</p>
              <ul className="mt-2 space-y-1.5">
                {profile.core_patterns?.map((p, i) => (
                  <li key={`pattern-${i}`} className="text-sm font-body text-forest-light flex gap-2">
                    <span className="text-terracotta">·</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="label-upper text-forest-light">Herida raíz</p>
              <p className="text-sm font-body text-forest mt-2 leading-relaxed">
                {profile.root_wound}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <p className="label-upper text-forest-light">Necesidad núcleo</p>
              <p className="text-sm font-body text-forest mt-2 leading-relaxed">
                {profile.core_need}
              </p>
            </div>
            <div>
              <p className="label-upper text-forest-light">Tu superpoder</p>
              <p className="text-sm font-body text-forest mt-2 leading-relaxed">
                {profile.superpower}
              </p>
            </div>
          </div>

          <div className="border-t border-bone-dark pt-5">
            <p className="label-upper text-terracotta">Tu norte</p>
            <p className="font-heading font-bold text-lg text-forest mt-2 leading-snug">
              {profile.north_star}
            </p>
          </div>
        </div>
      </div>

      {/* Progreso */}
      {progress?.has_roadmap && (
        <div className="tactile-card p-6 mb-6" data-testid="progress-card">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <ProgressStat
              label="Fase actual"
              value={`${progress.current_phase}/${progress.total_phases}`}
              testid="stat-phase"
            />
            <ProgressStat
              label="Días recorridos"
              value={progress.days_since_start}
              testid="stat-days"
            />
            <ProgressStat
              label="Acciones completadas"
              value={progress.days_completed}
              testid="stat-completed"
            />
            <ProgressStat
              label="Progreso total"
              value={`${progress.completion_percent}%`}
              accent
              testid="stat-progress"
            />
          </div>
        </div>
      )}

      {/* Fases */}
      <div className="mb-8">
        <p className="label-upper mb-4">Las 4 fases de tu transformación</p>
        <div className="space-y-4">
          {roadmap.phases?.map((phase) => {
            const isCurrent = phase.number === currentPhaseNum;
            const isDone = phase.number < currentPhaseNum;
            return (
              <div
                key={`phase-${phase.number}`}
                data-testid={`phase-${phase.number}`}
                className={`tactile-card p-8 ${
                  isCurrent
                    ? "border-terracotta border-2"
                    : isDone
                    ? "opacity-70"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    {isDone ? (
                      <CheckCircle2 className="w-6 h-6 text-forest" strokeWidth={1.75} />
                    ) : isCurrent ? (
                      <div className="w-6 h-6 rounded-full bg-terracotta text-bone flex items-center justify-center font-heading font-bold text-xs">
                        {phase.number}
                      </div>
                    ) : (
                      <Circle className="w-6 h-6 text-bone-dark" strokeWidth={1.5} />
                    )}
                    <div>
                      <p className="label-upper text-forest-light">
                        Fase {phase.number} · {phase.duration_days} días
                      </p>
                      <h3 className="font-heading font-bold text-xl text-forest mt-0.5">
                        {phase.title}
                      </h3>
                    </div>
                  </div>
                  {isCurrent && (
                    <Button
                      onClick={advancePhase}
                      disabled={advancing || phase.number >= roadmap.phases.length}
                      data-testid={`advance-phase-${phase.number}`}
                      className="rounded-full bg-forest hover:bg-forest-light text-bone text-xs h-8 px-4"
                    >
                      {advancing ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <>
                          Completar fase
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </>
                      )}
                    </Button>
                  )}
                </div>

                <p className="font-body text-forest-light leading-relaxed mb-5">
                  {phase.focus}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="label-upper text-forest-light mb-2">
                      Lecciones UCDM
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {phase.key_ucdm_lessons?.map((l) => (
                        <button
                          key={`l-${phase.number}-${l}`}
                          onClick={() => navigate(`/curso?day=${l}`)}
                          data-testid={`lesson-link-${l}`}
                          className="inline-flex items-center gap-1 text-xs font-label font-semibold bg-bone-dark hover:bg-terracotta hover:text-bone text-forest px-3 py-1 rounded-full transition-colors"
                        >
                          <BookOpen className="w-3 h-3" />
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="label-upper text-forest-light mb-2">
                      Niño interior
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {phase.key_inner_child?.map((ic) => (
                        <button
                          key={`ic-${phase.number}-${ic}`}
                          onClick={() => navigate("/nino-interior")}
                          className="inline-flex items-center gap-1 text-xs font-label font-semibold bg-bone-dark hover:bg-terracotta hover:text-bone text-forest px-3 py-1 rounded-full transition-colors"
                        >
                          <Baby className="w-3 h-3" />
                          {ic}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {phase.pnl_techniques?.length > 0 && (
                  <div className="mt-4">
                    <p className="label-upper text-forest-light mb-2">
                      Técnicas PNL
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {phase.pnl_techniques.map((t, i) => (
                        <span
                          key={`pnl-${phase.number}-${i}`}
                          className="text-xs font-label font-semibold bg-sky_soft/20 text-sky_soft px-3 py-1 rounded-full"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-5 pt-5 border-t border-bone-dark">
                  <p className="label-upper text-terracotta mb-1">
                    Práctica nuclear diaria
                  </p>
                  <p className="text-sm font-body text-forest leading-relaxed">
                    {phase.daily_core_practice}
                  </p>
                </div>

                <div className="mt-3">
                  <p className="label-upper text-forest-light mb-1">Milestone</p>
                  <p className="text-sm font-body text-forest-light italic leading-relaxed">
                    {phase.milestone}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews */}
      <div className="tactile-card p-8" data-testid="reviews-section">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="label-upper">Revisiones estratégicas</p>
            <h3 className="font-heading font-bold text-xl text-forest mt-1">
              Evaluaciones semanales de tu coach
            </h3>
          </div>
          <Button
            onClick={generateReview}
            disabled={reviewing}
            data-testid="generate-review-btn"
            className="rounded-full bg-terracotta hover:bg-terracotta-dark text-bone font-semibold"
          >
            {reviewing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Nueva revisión
              </>
            )}
          </Button>
        </div>

        {reviews.length === 0 ? (
          <p className="text-forest-light/60 font-body text-sm py-4">
            Aún no hay revisiones. Genera tu primera revisión cuando hayas
            tenido al menos 7 días de práctica.
          </p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="p-6 bg-bone rounded-xl border border-bone-dark"
                data-testid={`review-${r.id}`}
              >
                <p className="label-upper text-forest-light mb-3">{r.date}</p>
                <Markdown content={r.content} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProgressStat({ label, value, accent, testid }) {
  return (
    <div data-testid={testid}>
      <p className="label-upper text-forest-light">{label}</p>
      <p
        className={`font-heading font-extrabold text-3xl mt-1 ${
          accent ? "text-terracotta" : "text-forest"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
