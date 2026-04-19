import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Sparkles, ArrowRight, ArrowLeft, Loader2, Compass } from "lucide-react";
import { toast } from "sonner";

export default function Diagnostico() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    api.get("/journey/intake/questions").then((r) => setQuestions(r.data.questions));
  }, []);

  const current = questions[idx];
  const isLast = idx === questions.length - 1;

  const setAnswer = (val) => {
    setAnswers((a) => ({ ...a, [current.id]: val }));
  };

  const next = () => {
    if (idx < questions.length - 1) setIdx(idx + 1);
  };

  const prev = () => {
    if (idx > 0) setIdx(idx - 1);
  };

  const submit = useCallback(async () => {
    setSubmitting(true);
    const payload = {
      answers: Object.entries(answers).map(([id, answer]) => ({ id, answer })),
    };
    try {
      await api.post("/journey/intake/submit", payload);
      toast.success("Tu ruta ha sido diseñada. Vamos a verla.");
      navigate("/ruta");
    } catch (err) {
      toast.error("Hubo un error. Inténtalo de nuevo.");
      setSubmitting(false);
    }
  }, [answers, navigate]);

  if (!questions.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bone">
        <Loader2 className="w-6 h-6 text-forest animate-spin" />
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" data-testid="diagnostico-intro">
        <div className="max-w-2xl animate-fade-in-up">
          <Compass className="w-10 h-10 text-terracotta mb-6" strokeWidth={1.5} />
          <p className="label-upper">Diagnóstico transformacional</p>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-forest mt-3 tracking-tighter leading-tight">
            Antes de guiarte,
            <br />
            <span className="text-terracotta">necesito conocerte.</span>
          </h1>
          <p className="text-forest-light mt-6 font-body text-lg leading-relaxed">
            Voy a hacerte 8 preguntas profundas. Tu coach IA analizará cada
            respuesta y diseñará una <strong>hoja de ruta personalizada</strong> de
            84 días integrando UCDM, PNL, Tony Robbins y sanación del niño
            interior.
          </p>
          <p className="text-forest-light/80 mt-4 font-body leading-relaxed">
            Responde con honestidad radical. Nadie lo verá. Esto es solo para ti.
          </p>
          <Button
            onClick={() => setStarted(true)}
            data-testid="start-intake-btn"
            className="mt-10 rounded-full bg-forest hover:bg-forest-light text-bone font-semibold h-12 px-8"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Comenzar diagnóstico
          </Button>
        </div>
      </div>
    );
  }

  const progress = Math.round(((idx + 1) / questions.length) * 100);

  return (
    <div className="min-h-screen flex items-center justify-center p-6" data-testid="diagnostico-page">
      <div className="max-w-2xl w-full">
        {/* progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <p className="label-upper">
              Pregunta {idx + 1} de {questions.length}
            </p>
            <span className="label-upper text-forest-light">{progress}%</span>
          </div>
          <div className="h-1 bg-bone-dark rounded-full overflow-hidden">
            <div
              className="h-full bg-terracotta transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div
          key={current.id}
          className="tactile-card p-8 md:p-10 animate-spring-in"
          data-testid={`question-${current.id}`}
        >
          <p className="label-upper">{current.category.replace(/_/g, " ")}</p>
          <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-forest mt-3 leading-tight tracking-tight">
            {current.question}
          </h2>
          <p className="text-forest-light/70 font-body text-sm mt-3 italic">
            {current.hint}
          </p>

          <Textarea
            value={answers[current.id] || ""}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Tu respuesta honesta..."
            rows={5}
            data-testid="answer-input"
            className="mt-6 rounded-2xl border-bone-dark bg-bone font-body text-base"
            autoFocus
          />
        </div>

        <div className="mt-6 flex justify-between items-center">
          <Button
            onClick={prev}
            disabled={idx === 0}
            variant="outline"
            data-testid="prev-btn"
            className="rounded-full border-bone-dark disabled:opacity-30"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          {!isLast ? (
            <Button
              onClick={next}
              disabled={!answers[current.id]?.trim()}
              data-testid="next-btn"
              className="rounded-full bg-forest hover:bg-forest-light text-bone font-semibold px-6"
            >
              Siguiente
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={submit}
              disabled={!answers[current.id]?.trim() || submitting}
              data-testid="submit-intake-btn"
              className="rounded-full bg-terracotta hover:bg-terracotta-dark text-bone font-semibold px-6"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Diseñando tu ruta (45s)...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generar mi ruta
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
