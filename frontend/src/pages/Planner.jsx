import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Plus, Check, Trash2, CalendarClock } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = {
  spiritual: { label: "Espiritual", color: "bg-terracotta/15 text-terracotta border-terracotta/30" },
  work: { label: "Trabajo", color: "bg-forest/15 text-forest border-forest/30" },
  body: { label: "Cuerpo", color: "bg-sky_soft/20 text-sky_soft border-sky_soft/40" },
  rest: { label: "Descanso", color: "bg-sand/40 text-forest-light border-sand" },
  family: { label: "Familia", color: "bg-terracotta-light/20 text-terracotta-dark border-terracotta-light/40" },
  general: { label: "General", color: "bg-bone-dark text-forest-light border-bone-dark" },
};

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function Planner() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [blocks, setBlocks] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [newHour, setNewHour] = useState(9);
  const [newActivity, setNewActivity] = useState("");
  const [newCategory, setNewCategory] = useState("general");

  const load = useCallback(async () => {
    const res = await api.get(`/planner?date_str=${selectedDate}`);
    setBlocks(res.data);
  }, [selectedDate]);

  useEffect(() => {
    load();
  }, [load]);

  const addBlock = async () => {
    if (!newActivity.trim()) return;
    await api.post("/planner", {
      date: selectedDate,
      hour: newHour,
      activity: newActivity,
      category: newCategory,
    });
    setShowDialog(false);
    setNewActivity("");
    await load();
    toast.success("Bloque agregado");
  };

  const toggle = async (id) => {
    await api.patch(`/planner/${id}/toggle`);
    await load();
  };

  const remove = async (id) => {
    await api.delete(`/planner/${id}`);
    await load();
  };

  const blocksByHour = {};
  blocks.forEach((b) => {
    if (!blocksByHour[b.hour]) blocksByHour[b.hour] = [];
    blocksByHour[b.hour].push(b);
  });

  return (
    <div className="p-6 md:p-10 max-w-5xl" data-testid="planner-page">
      <div className="mb-8 animate-fade-in-up flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="label-upper">Planner horario</p>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-forest mt-2 tracking-tighter">
            Tu día,
            <br />
            <span className="text-terracotta">hora por hora.</span>
          </h1>
        </div>
        <div className="flex gap-3">
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            data-testid="planner-date"
            className="h-11 rounded-full border-bone-dark bg-bone-light w-44"
          />
          <Button
            onClick={() => setShowDialog(true)}
            data-testid="add-block-btn"
            className="rounded-full bg-forest hover:bg-forest-light text-bone font-semibold px-6 h-11"
          >
            <Plus className="w-4 h-4 mr-2" />
            Añadir bloque
          </Button>
        </div>
      </div>

      <div className="tactile-card p-6 md:p-8">
        <div className="space-y-2">
          {HOURS.map((h) => {
            const hourBlocks = blocksByHour[h] || [];
            const hourLabel = `${h.toString().padStart(2, "0")}:00`;
            return (
              <div
                key={h}
                className="flex gap-4 items-start border-b border-bone-dark/40 py-2 last:border-0"
                data-testid={`hour-${h}`}
              >
                <div className="w-16 shrink-0 pt-1">
                  <span className="font-heading font-bold text-sm text-forest-light">
                    {hourLabel}
                  </span>
                </div>
                <div className="flex-1 space-y-1.5 min-h-[36px]">
                  {hourBlocks.length === 0 ? (
                    <div
                      className="text-forest-light/30 text-sm font-body py-1.5 cursor-pointer hover:text-forest-light"
                      onClick={() => {
                        setNewHour(h);
                        setShowDialog(true);
                      }}
                    >
                      —
                    </div>
                  ) : (
                    hourBlocks.map((b) => {
                      const cat = CATEGORIES[b.category] || CATEGORIES.general;
                      return (
                        <div
                          key={b.id}
                          className={`flex items-center gap-3 border rounded-xl px-4 py-2.5 ${cat.color} ${
                            b.done ? "opacity-60" : ""
                          }`}
                          data-testid={`block-${b.id}`}
                        >
                          <button
                            onClick={() => toggle(b.id)}
                            data-testid={`toggle-block-${b.id}`}
                            className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                              b.done
                                ? "bg-forest border-forest"
                                : "border-current"
                            }`}
                          >
                            {b.done && <Check className="w-3 h-3 text-bone" strokeWidth={3} />}
                          </button>
                          <span
                            className={`font-body text-sm flex-1 ${
                              b.done ? "line-through" : ""
                            }`}
                          >
                            {b.activity}
                          </span>
                          <span className="label-upper text-[10px] opacity-70">
                            {cat.label}
                          </span>
                          <button
                            onClick={() => remove(b.id)}
                            data-testid={`delete-block-${b.id}`}
                            className="opacity-40 hover:opacity-100"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showDialog && (
        <div
          className="fixed inset-0 bg-forest-dark/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          data-testid="block-dialog"
        >
          <div className="bg-bone-light rounded-2xl p-8 max-w-md w-full border border-bone-dark">
            <p className="label-upper">Nuevo bloque</p>
            <h3 className="font-heading font-bold text-2xl text-forest mt-2 tracking-tight">
              ¿Qué harás?
            </h3>
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label-upper block mb-2">Hora</label>
                  <Select
                    value={newHour.toString()}
                    onValueChange={(v) => setNewHour(parseInt(v))}
                  >
                    <SelectTrigger data-testid="hour-select" className="rounded-full border-bone-dark bg-bone h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {HOURS.map((h) => (
                        <SelectItem key={h} value={h.toString()}>
                          {h.toString().padStart(2, "0")}:00
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="label-upper block mb-2">Categoría</label>
                  <Select value={newCategory} onValueChange={setNewCategory}>
                    <SelectTrigger data-testid="category-select" className="rounded-full border-bone-dark bg-bone h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CATEGORIES).map(([k, v]) => (
                        <SelectItem key={k} value={k}>
                          {v.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="label-upper block mb-2">Actividad</label>
                <Input
                  value={newActivity}
                  onChange={(e) => setNewActivity(e.target.value)}
                  placeholder="Meditar, trabajar en proyecto, etc."
                  data-testid="activity-input"
                  className="h-11 rounded-full border-bone-dark bg-bone"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowDialog(false)}
                data-testid="cancel-block-btn"
                className="rounded-full border-bone-dark"
              >
                Cancelar
              </Button>
              <Button
                onClick={addBlock}
                disabled={!newActivity.trim()}
                data-testid="save-block-btn"
                className="rounded-full bg-forest hover:bg-forest-light text-bone font-semibold px-6"
              >
                <CalendarClock className="w-4 h-4 mr-2" />
                Guardar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
