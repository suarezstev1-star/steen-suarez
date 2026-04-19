import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Plus, NotebookPen, Trash2, Heart, Trophy, Lightbulb } from "lucide-react";
import { toast } from "sonner";

export default function Diario() {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [gratitude, setGratitude] = useState(["", "", ""]);
  const [wins, setWins] = useState(["", "", ""]);
  const [lessons, setLessons] = useState(["", "", ""]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await api.get("/journal");
    setEntries(res.data);
  };

  const save = async () => {
    if (!content.trim()) return;
    setSaving(true);
    try {
      await api.post("/journal", {
        title: title || "Reflexión del día",
        content,
        gratitude: gratitude.filter((g) => g.trim()),
        wins: wins.filter((w) => w.trim()),
        lessons: lessons.filter((l) => l.trim()),
      });
      toast.success("Entrada guardada");
      setShowForm(false);
      setTitle("");
      setContent("");
      setGratitude(["", "", ""]);
      setWins(["", "", ""]);
      setLessons(["", "", ""]);
      await load();
    } catch (e) {
      toast.error("Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    await api.delete(`/journal/${id}`);
    await load();
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl" data-testid="diario-page">
      <div className="mb-8 animate-fade-in-up flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="label-upper">Diario de transformación</p>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-forest mt-2 tracking-tighter">
            Escribe para
            <br />
            <span className="text-terracotta">transformar.</span>
          </h1>
          <p className="text-forest-light mt-3 font-body max-w-xl">
            Gratitud, victorias y lecciones aprendidas. Protocolo diario de
            alto rendimiento inspirado en Tony Robbins.
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          data-testid="toggle-form-btn"
          className="rounded-full bg-forest hover:bg-forest-light text-bone font-semibold px-6 h-11"
        >
          <Plus className="w-4 h-4 mr-2" />
          {showForm ? "Cerrar" : "Nueva entrada"}
        </Button>
      </div>

      {showForm && (
        <div className="tactile-card p-8 mb-8 animate-fade-in-up" data-testid="journal-form">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título (opcional)"
            data-testid="journal-title"
            className="h-12 rounded-full border-bone-dark bg-bone mb-4 font-heading font-semibold"
          />
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="¿Qué pasó hoy? ¿Qué sentiste? ¿Qué aprendiste?"
            rows={6}
            data-testid="journal-content"
            className="rounded-2xl border-bone-dark bg-bone font-body mb-6"
          />

          <ProtocolList
            label="3 gratitudes"
            icon={Heart}
            color="text-terracotta"
            values={gratitude}
            setValues={setGratitude}
            placeholder="Gracias por..."
            testid="gratitude"
          />
          <ProtocolList
            label="3 victorias"
            icon={Trophy}
            color="text-forest-light"
            values={wins}
            setValues={setWins}
            placeholder="Logré..."
            testid="wins"
          />
          <ProtocolList
            label="3 lecciones"
            icon={Lightbulb}
            color="text-sky_soft"
            values={lessons}
            setValues={setLessons}
            placeholder="Aprendí que..."
            testid="lessons"
          />

          <div className="flex justify-end mt-6">
            <Button
              onClick={save}
              disabled={saving || !content.trim()}
              data-testid="save-journal-btn"
              className="rounded-full bg-forest hover:bg-forest-light text-bone font-semibold px-8 h-11"
            >
              <NotebookPen className="w-4 h-4 mr-2" />
              Guardar entrada
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4" data-testid="entries-list">
        {entries.length === 0 ? (
          <div className="tactile-card p-10 text-center">
            <NotebookPen className="w-8 h-8 text-forest-light/40 mx-auto mb-3" strokeWidth={1.5} />
            <p className="text-forest-light/60 font-body">
              Aún no hay entradas. Empieza a escribir tu transformación.
            </p>
          </div>
        ) : (
          entries.map((e) => (
            <div key={e.id} className="tactile-card p-8" data-testid={`entry-${e.id}`}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="label-upper">{e.date}</p>
                  <h3 className="font-heading font-bold text-xl text-forest mt-1">
                    {e.title}
                  </h3>
                </div>
                <button
                  onClick={() => remove(e.id)}
                  data-testid={`delete-entry-${e.id}`}
                  className="text-bone-dark hover:text-terracotta"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="font-body text-forest-light whitespace-pre-wrap leading-relaxed">
                {e.content}
              </p>
              {(e.gratitude?.length || e.wins?.length || e.lessons?.length) > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-bone-dark">
                  {e.gratitude?.length > 0 && (
                    <PreviewBlock icon={Heart} color="text-terracotta" label="Gratitud" items={e.gratitude} />
                  )}
                  {e.wins?.length > 0 && (
                    <PreviewBlock icon={Trophy} color="text-forest-light" label="Victorias" items={e.wins} />
                  )}
                  {e.lessons?.length > 0 && (
                    <PreviewBlock icon={Lightbulb} color="text-sky_soft" label="Lecciones" items={e.lessons} />
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ProtocolList({ label, icon: Icon, color, values, setValues, placeholder, testid }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color}`} strokeWidth={1.75} />
        <span className="label-upper">{label}</span>
      </div>
      <div className="space-y-2">
        {values.map((v, i) => (
          <Input
            key={i}
            value={v}
            onChange={(e) => {
              const copy = [...values];
              copy[i] = e.target.value;
              setValues(copy);
            }}
            placeholder={`${i + 1}. ${placeholder}`}
            data-testid={`${testid}-${i}`}
            className="h-10 rounded-full border-bone-dark bg-bone font-body"
          />
        ))}
      </div>
    </div>
  );
}

function PreviewBlock({ icon: Icon, color, label, items }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-3.5 h-3.5 ${color}`} strokeWidth={1.75} />
        <span className="label-upper text-[10px]">{label}</span>
      </div>
      <ul className="space-y-1">
        {items.map((it, i) => (
          <li key={i} className="text-sm font-body text-forest-light leading-snug">
            · {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
