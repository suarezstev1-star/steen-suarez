import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Baby, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function NinoInterior() {
  const [exercises, setExercises] = useState([]);
  const [logs, setLogs] = useState([]);
  const [activeExercise, setActiveExercise] = useState(null);
  const [reflection, setReflection] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/inner-child/exercises").then((r) => setExercises(r.data.exercises));
    api.get("/inner-child/logs").then((r) => setLogs(r.data));
  }, []);

  const saveReflection = async () => {
    if (!activeExercise || !reflection.trim()) return;
    setSaving(true);
    try {
      await api.post("/inner-child/log", {
        exercise_id: activeExercise.id,
        reflection,
      });
      toast.success("Práctica registrada. Tu niño/a interior te lo agradece.");
      setReflection("");
      setActiveExercise(null);
      const r = await api.get("/inner-child/logs");
      setLogs(r.data);
    } catch (e) {
      toast.error("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl" data-testid="nino-page">
      <div className="mb-10 animate-fade-in-up">
        <p className="label-upper">Sanación del niño interior</p>
        <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-forest mt-2 tracking-tighter">
          Reparéntate con
          <br />
          <span className="text-terracotta">amor consciente.</span>
        </h1>
        <p className="text-forest-light mt-4 font-body max-w-2xl leading-relaxed">
          Ejercicios probados de Bradshaw, Capacchione y técnicas de PNL para
          sanar heridas de infancia y reconectar con tu esencia.
        </p>
      </div>

      {!activeExercise ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exercises.map((ex) => {
            const logCount = logs.filter((l) => l.exercise_id === ex.id).length;
            return (
              <div
                key={ex.id}
                className="tactile-card p-8 cursor-pointer"
                onClick={() => setActiveExercise(ex)}
                data-testid={`exercise-${ex.id}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <Baby className="w-7 h-7 text-terracotta" strokeWidth={1.5} />
                  <div className="flex items-center gap-2 text-forest-light/60 font-body text-xs">
                    <Clock className="w-3.5 h-3.5" />
                    {ex.duration_min} min
                  </div>
                </div>
                <h3 className="font-heading font-bold text-xl text-forest leading-tight">
                  {ex.title}
                </h3>
                <p className="text-forest-light font-body text-sm mt-3 leading-relaxed">
                  {ex.description}
                </p>
                {logCount > 0 && (
                  <div className="mt-4 inline-flex items-center gap-1.5 text-xs font-label font-semibold text-forest-light">
                    <CheckCircle2 className="w-3.5 h-3.5 text-forest-light" />
                    {logCount} {logCount === 1 ? "práctica" : "prácticas"}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="tactile-card p-8 md:p-10" data-testid="exercise-detail">
          <button
            onClick={() => setActiveExercise(null)}
            className="label-upper text-forest-light hover:text-terracotta mb-4"
            data-testid="back-exercises-btn"
          >
            ← Volver a ejercicios
          </button>
          <p className="label-upper">{activeExercise.duration_min} minutos</p>
          <h2 className="font-heading font-extrabold text-3xl text-forest mt-2 tracking-tight">
            {activeExercise.title}
          </h2>
          <p className="text-forest-light font-body mt-3">
            {activeExercise.description}
          </p>

          <div className="mt-8">
            <p className="label-upper mb-4">Pasos</p>
            <ol className="space-y-3">
              {activeExercise.steps.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="shrink-0 w-8 h-8 rounded-full bg-forest text-bone font-heading font-bold text-sm flex items-center justify-center">
                    {i + 1}
                  </span>
                  <p className="text-forest-light font-body leading-relaxed pt-1">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-10 border-t border-bone-dark pt-8">
            <p className="label-upper mb-3">Reflexión post-ejercicio</p>
            <Textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="¿Qué surgió? ¿Qué necesita tu niño/a interior hoy?"
              rows={5}
              data-testid="reflection-input"
              className="rounded-2xl border-bone-dark bg-bone font-body"
            />
            <Button
              onClick={saveReflection}
              disabled={saving || !reflection.trim()}
              data-testid="save-reflection-btn"
              className="mt-4 rounded-full bg-forest hover:bg-forest-light text-bone font-semibold px-6 h-11"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4 mr-2" />
              )}
              Registrar práctica
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
