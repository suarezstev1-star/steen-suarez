import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api";
import { Button } from "../components/ui/button";
import {
  Sparkles,
  CheckCircle2,
  Loader2,
  BookOpen,
  Baby,
  Clock,
  Target,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function TodayCard() {
  const navigate = useNavigate();
  const [guidance, setGuidance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completing, setCompleting] = useState(false);
  const [generating, setGenerating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/journey/today");
      setGuidance(res.data);
      setError(null);
    } catch (e) {
      if (e.response?.status === 400) {
        setError("no-profile");
      } else {
        setError("other");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const generate = async () => {
    setGenerating(true);
    try {
      const res = await api.get("/journey/today");
      setGuidance(res.data);
    } catch (e) {
      toast.error("Error al generar guía");
    } finally {
      setGenerating(false);
    }
  };

  const complete = async () => {
    setCompleting(true);
    try {
      await api.post("/journey/today/complete");
      toast.success("¡Acción completada! Un paso más en tu salto cuántico.");
      await load();
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="tactile-card p-8 flex items-center gap-3">
        <Loader2 className="w-5 h-5 text-terracotta animate-spin" />
        <p className="text-forest-light font-body">Cargando tu guía de hoy...</p>
      </div>
    );
  }

  if (error === "no-profile") {
    return (
      <div
        className="tactile-card p-8 border-2 border-terracotta"
        data-testid="no-profile-card"
      >
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5 text-terracotta" strokeWidth={1.5} />
          <p className="label-upper">Antes de comenzar</p>
        </div>
        <h3 className="font-heading font-bold text-2xl text-forest tracking-tight">
          Tu coach necesita conocerte.
        </h3>
        <p className="text-forest-light font-body mt-3 leading-relaxed">
          Responde 8 preguntas profundas y la IA diseñará tu hoja de ruta
          personalizada de 84 días. Sin esto, la guía diaria no existe.
        </p>
        <Button
          onClick={() => navigate("/diagnostico")}
          data-testid="start-diagnostico-btn"
          className="mt-6 rounded-full bg-terracotta hover:bg-terracotta-dark text-bone font-semibold px-6 h-11"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Comenzar diagnóstico
        </Button>
      </div>
    );
  }

  if (!guidance) {
    return (
      <div className="tactile-card p-8">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-terracotta" strokeWidth={1.5} />
          <p className="label-upper">Hoy tu paso es...</p>
        </div>
        <p className="text-forest-light font-body mb-4">
          Genera la guía personalizada de tu coach para hoy.
        </p>
        <Button
          onClick={generate}
          disabled={generating}
          data-testid="generate-today-btn"
          className="rounded-full bg-forest hover:bg-forest-light text-bone font-semibold px-6 h-11"
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generando...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generar guía de hoy
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`tactile-card p-8 ${
        guidance.completed ? "border-forest border-2" : "border-terracotta border-2"
      }`}
      data-testid="today-guidance-card"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-terracotta" strokeWidth={1.5} />
          <p className="label-upper">
            Fase {guidance.phase_number} · Día {guidance.day_in_phase} · Hoy tu paso es
          </p>
        </div>
        {guidance.completed && (
          <span className="inline-flex items-center gap-1.5 text-forest text-xs font-label font-bold uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" strokeWidth={2} />
            Completado
          </span>
        )}
      </div>

      <h3 className="font-heading font-extrabold text-2xl md:text-3xl text-forest leading-tight tracking-tight">
        {guidance.action_title}
      </h3>

      <p className="font-body text-forest-light mt-4 leading-relaxed">
        {guidance.action_description}
      </p>

      <div className="mt-6 pl-4 border-l-2 border-terracotta/60">
        <p className="label-upper text-terracotta mb-1">Por qué hoy</p>
        <p className="font-body text-forest-light text-sm italic leading-relaxed">
          {guidance.why_today}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1.5 text-xs font-label font-semibold bg-bone-dark text-forest-light px-3 py-1.5 rounded-full">
          <Clock className="w-3 h-3" />
          {guidance.estimated_minutes} min
        </span>
        {guidance.suggested_ucdm_lesson && (
          <button
            onClick={() => navigate(`/curso?day=${guidance.suggested_ucdm_lesson}`)}
            data-testid="suggested-lesson-btn"
            className="inline-flex items-center gap-1.5 text-xs font-label font-semibold bg-bone-dark hover:bg-terracotta hover:text-bone text-forest px-3 py-1.5 rounded-full transition-colors"
          >
            <BookOpen className="w-3 h-3" />
            Lección {guidance.suggested_ucdm_lesson}
          </button>
        )}
        {guidance.suggested_inner_child_id && (
          <button
            onClick={() => navigate("/nino-interior")}
            data-testid="suggested-ic-btn"
            className="inline-flex items-center gap-1.5 text-xs font-label font-semibold bg-bone-dark hover:bg-terracotta hover:text-bone text-forest px-3 py-1.5 rounded-full transition-colors"
          >
            <Baby className="w-3 h-3" />
            {guidance.suggested_inner_child_id}
          </button>
        )}
      </div>

      {guidance.completion_criteria && (
        <div className="mt-5 pt-5 border-t border-bone-dark">
          <p className="label-upper text-forest-light mb-1">
            Sabrás que lo lograste si...
          </p>
          <p className="text-sm font-body text-forest leading-relaxed">
            {guidance.completion_criteria}
          </p>
        </div>
      )}

      {!guidance.completed && (
        <Button
          onClick={complete}
          disabled={completing}
          data-testid="complete-today-btn"
          className="mt-6 rounded-full bg-forest hover:bg-forest-light text-bone font-semibold h-11 px-6"
        >
          {completing ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <CheckCircle2 className="w-4 h-4 mr-2" />
          )}
          Marcar como completado
        </Button>
      )}
    </div>
  );
}
