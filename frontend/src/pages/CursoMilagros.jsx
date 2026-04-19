import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import { Loader2, BookOpen, Sparkles } from "lucide-react";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import Markdown from "../components/Markdown";

export default function CursoMilagros() {
  const [searchParams] = useSearchParams();
  const [lessons, setLessons] = useState([]);
  const [selectedDay, setSelectedDay] = useState(
    parseInt(searchParams.get("day")) || null
  );
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [insight, setInsight] = useState(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  useEffect(() => {
    api.get("/lessons").then((r) => setLessons(r.data));
  }, []);

  useEffect(() => {
    if (!selectedDay) {
      api.get("/lessons/today").then((r) => setSelectedDay(r.data.day));
    }
  }, [selectedDay]);

  useEffect(() => {
    if (!selectedDay) return;
    const l = lessons.find((x) => x.day === selectedDay);
    setSelectedLesson(l || null);
    setInsight(null);
  }, [selectedDay, lessons]);

  const generateInsight = useCallback(async () => {
    if (!selectedDay) return;
    setLoadingInsight(true);
    try {
      const res = await api.get(`/lessons/${selectedDay}/insight`);
      setInsight(res.data);
      toast.success("Lección decodificada por tu coach");
    } catch (err) {
      toast.error("No se pudo generar el insight");
    } finally {
      setLoadingInsight(false);
    }
  }, [selectedDay]);

  return (
    <div className="p-6 md:p-10 max-w-7xl" data-testid="curso-page">
      <div className="mb-8 animate-fade-in-up">
        <p className="label-upper">Un Curso de Milagros</p>
        <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-forest mt-2 tracking-tighter">
          365 lecciones de
          <br />
          <span className="text-terracotta">transformación.</span>
        </h1>
        <p className="text-forest-light mt-4 font-body max-w-2xl leading-relaxed">
          Cada lección decodificada por tu coach IA con ejemplos de vida real,
          técnicas de PNL, decodificación bíblica y una práctica concreta para
          un salto cuántico hoy.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px,1fr] gap-6">
        {/* Grid de 365 días */}
        <div className="tactile-card p-6 h-fit lg:sticky lg:top-6">
          <p className="label-upper mb-4">Las 365 lecciones</p>
          <div
            className="grid grid-cols-10 gap-1.5 max-h-[500px] overflow-y-auto pr-2"
            data-testid="lessons-grid"
          >
            {Array.from({ length: 365 }, (_, i) => i + 1).map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                data-testid={`lesson-day-${day}`}
                className={`aspect-square text-[10px] font-label font-semibold rounded-md transition-all duration-200 ${
                  selectedDay === day
                    ? "bg-terracotta text-bone scale-110 shadow-md"
                    : "bg-bone hover:bg-bone-dark text-forest-light"
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        {/* Lesson content */}
        <div className="tactile-card p-8 md:p-10" data-testid="lesson-detail">
          {!selectedLesson ? (
            <div className="py-20 text-center text-forest-light/60 font-body">
              Selecciona una lección para comenzar
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <p className="label-upper">Lección {selectedLesson.day}</p>
                  <h2 className="font-heading font-extrabold text-3xl text-forest mt-3 leading-tight tracking-tight">
                    "{selectedLesson.title}"
                  </h2>
                </div>
                <BookOpen className="w-8 h-8 text-terracotta shrink-0" strokeWidth={1.5} />
              </div>

              <div className="border-t border-bone-dark pt-6 mt-6">
                {!insight ? (
                  <div className="text-center py-8">
                    <p className="text-forest-light font-body mb-6 max-w-md mx-auto leading-relaxed">
                      Pide a tu coach que decodifique esta lección con ejemplos
                      reales, PNL y sabiduría bíblica aplicada a tu vida.
                    </p>
                    <Button
                      onClick={generateInsight}
                      disabled={loadingInsight}
                      data-testid="generate-insight-btn"
                      className="rounded-full bg-forest hover:bg-forest-light text-bone font-semibold tracking-wide px-8 h-12"
                    >
                      {loadingInsight ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Decodificando...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Decodificar lección
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="animate-fade-in-up" data-testid="insight-content">
                    <p className="label-upper mb-4">
                      Decodificación por tu coach
                    </p>
                    <Markdown content={insight.insight} />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
