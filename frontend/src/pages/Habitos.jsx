import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Plus, Check, Trash2, Flame } from "lucide-react";
import { toast } from "sonner";

export default function Habitos() {
  const [habits, setHabits] = useState([]);
  const [week, setWeek] = useState({ checkins: [], start: "", end: "" });
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");

  const load = useCallback(async () => {
    const [hs, wk] = await Promise.all([
      api.get("/habits"),
      api.get("/habits/checkins/week"),
    ]);
    setHabits(hs.data);
    setWeek(wk.data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addHabit = async () => {
    if (!newName.trim()) return;
    await api.post("/habits", { name: newName });
    setNewName("");
    setShowForm(false);
    toast.success("Hábito añadido");
    await load();
  };

  const checkin = async (id) => {
    await api.post(`/habits/${id}/checkin`);
    await load();
  };

  const remove = async (id) => {
    await api.delete(`/habits/${id}`);
    await load();
  };

  const getWeekDates = () => {
    if (!week.start) return [];
    const start = new Date(week.start);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d.toISOString().slice(0, 10);
    });
  };

  const weekDates = getWeekDates();
  const todayStr = new Date().toISOString().slice(0, 10);

  const isDone = (habitId, date) =>
    week.checkins.some((c) => c.habit_id === habitId && c.date === date && c.done);

  const streakFor = (habitId) => {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const ds = d.toISOString().slice(0, 10);
      const done = week.checkins.some((c) => c.habit_id === habitId && c.date === ds && c.done);
      if (done) streak++;
      else if (i > 0) break;
      else break;
    }
    return streak;
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl" data-testid="habitos-page">
      <div className="mb-8 animate-fade-in-up flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="label-upper">Hábitos transformacionales</p>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-forest mt-2 tracking-tighter">
            Tus rituales
            <br />
            <span className="text-terracotta">de poder.</span>
          </h1>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          data-testid="toggle-habit-form"
          className="rounded-full bg-forest hover:bg-forest-light text-bone font-semibold px-6 h-11"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo hábito
        </Button>
      </div>

      {showForm && (
        <div className="tactile-card p-6 mb-6 flex gap-3 animate-fade-in-up">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Ej: Meditar 10 minutos, Agua 2L..."
            data-testid="habit-name-input"
            className="flex-1 h-11 rounded-full border-bone-dark bg-bone font-body"
            onKeyDown={(e) => e.key === "Enter" && addHabit()}
          />
          <Button
            onClick={addHabit}
            disabled={!newName.trim()}
            data-testid="save-habit-btn"
            className="rounded-full bg-forest hover:bg-forest-light text-bone px-6 h-11"
          >
            Añadir
          </Button>
        </div>
      )}

      <div className="tactile-card p-6 md:p-8" data-testid="habits-grid">
        {habits.length === 0 ? (
          <div className="text-center py-10">
            <Flame className="w-10 h-10 text-terracotta/60 mx-auto mb-3" strokeWidth={1.5} />
            <p className="text-forest-light font-body">
              Crea tu primer hábito para comenzar tu racha
            </p>
          </div>
        ) : (
          <>
            {/* Week header */}
            <div className="grid grid-cols-[1fr,auto] gap-4 items-end mb-4 pb-3 border-b border-bone-dark">
              <p className="label-upper">Hábito</p>
              <div className="flex gap-1.5">
                {weekDates.map((d) => {
                  const dt = new Date(d);
                  const label = dt.toLocaleDateString("es-ES", { weekday: "short" }).charAt(0).toUpperCase();
                  const isToday = d === todayStr;
                  return (
                    <div
                      key={d}
                      className={`w-9 text-center label-upper text-[10px] ${isToday ? "text-terracotta" : ""}`}
                    >
                      {label}
                      <div className="text-[9px] opacity-60 mt-0.5">
                        {dt.getDate()}
                      </div>
                    </div>
                  );
                })}
                <div className="w-9 text-center label-upper text-[10px] text-terracotta">
                  <Flame className="w-3 h-3 mx-auto" />
                </div>
                <div className="w-6"></div>
              </div>
            </div>

            <div className="space-y-2">
              {habits.map((h) => (
                <div
                  key={h.id}
                  className="grid grid-cols-[1fr,auto] gap-4 items-center py-2"
                  data-testid={`habit-${h.id}`}
                >
                  <span className="font-body text-forest">{h.name}</span>
                  <div className="flex gap-1.5 items-center">
                    {weekDates.map((d) => {
                      const done = isDone(h.id, d);
                      const isToday = d === todayStr;
                      return (
                        <button
                          key={d}
                          onClick={() => isToday && checkin(h.id)}
                          disabled={!isToday}
                          data-testid={`checkin-${h.id}-${d}`}
                          className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
                            done
                              ? "bg-forest border-forest text-bone"
                              : isToday
                              ? "border-terracotta/60 hover:border-terracotta hover:bg-terracotta/10"
                              : "border-bone-dark"
                          } ${!isToday ? "cursor-default opacity-50" : ""}`}
                        >
                          {done && <Check className="w-4 h-4" strokeWidth={3} />}
                        </button>
                      );
                    })}
                    <div className="w-9 text-center font-heading font-bold text-sm text-terracotta">
                      {streakFor(h.id)}
                    </div>
                    <button
                      onClick={() => remove(h.id)}
                      data-testid={`delete-habit-${h.id}`}
                      className="w-6 text-bone-dark hover:text-terracotta"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
