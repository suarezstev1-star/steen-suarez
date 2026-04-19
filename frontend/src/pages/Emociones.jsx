import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Slider } from "../components/ui/slider";
import { Heart, Zap, Anchor, CheckCircle2 } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { toast } from "sonner";

const CHART_Y_DOMAIN = [0, 10];
const CHART_TOOLTIP_STYLE = {
  backgroundColor: "#FFFFFF",
  border: "1px solid #E6DFD3",
  borderRadius: "0.75rem",
};

export default function Emociones() {
  const [mood, setMood] = useState([7]);
  const [energy, setEnergy] = useState([7]);
  const [stability, setStability] = useState([7]);
  const [note, setNote] = useState("");
  const [history, setHistory] = useState([]);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await api.get("/emotions?days=30");
    setHistory(res.data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const submit = async () => {
    setSaving(true);
    try {
      await api.post("/emotions", {
        mood: mood[0],
        energy: energy[0],
        stability: stability[0],
        note,
      });
      toast.success("Check-in registrado");
      setNote("");
      await load();
    } catch (e) {
      toast.error("Error");
    } finally {
      setSaving(false);
    }
  };

  const chartData = useMemo(
    () =>
      history.map((h) => ({
        date: h.date.slice(5),
        Ánimo: h.mood,
        Energía: h.energy,
        Estabilidad: h.stability,
      })),
    [history]
  );

  return (
    <div className="p-6 md:p-10 max-w-6xl" data-testid="emociones-page">
      <div className="mb-8 animate-fade-in-up">
        <p className="label-upper">Check-in emocional</p>
        <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-forest mt-2 tracking-tighter">
          ¿Cómo te sientes
          <br />
          <span className="text-terracotta">ahora mismo?</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[400px,1fr] gap-6">
        {/* Check-in form */}
        <div className="tactile-card p-8 h-fit">
          <SliderBlock
            icon={Heart}
            color="text-terracotta"
            label="Ánimo"
            value={mood}
            setValue={setMood}
            testid="mood-slider"
          />
          <SliderBlock
            icon={Zap}
            color="text-forest-light"
            label="Energía"
            value={energy}
            setValue={setEnergy}
            testid="energy-slider"
          />
          <SliderBlock
            icon={Anchor}
            color="text-sky_soft"
            label="Estabilidad"
            value={stability}
            setValue={setStability}
            testid="stability-slider"
          />

          <div className="mt-6">
            <p className="label-upper mb-2">Nota (opcional)</p>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="¿Qué está vivo en ti ahora?"
              rows={3}
              data-testid="emotion-note"
              className="rounded-2xl border-bone-dark bg-bone font-body"
            />
          </div>

          <Button
            onClick={submit}
            disabled={saving}
            data-testid="save-emotion-btn"
            className="mt-6 w-full rounded-full bg-forest hover:bg-forest-light text-bone font-semibold h-12"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Registrar check-in
          </Button>
        </div>

        {/* History */}
        <div className="tactile-card p-8">
          <p className="label-upper">Tus últimos 30 días</p>
          <h3 className="font-heading font-bold text-xl text-forest mt-1 mb-6">
            Patrones emocionales
          </h3>

          {history.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="w-10 h-10 text-terracotta/60 mx-auto mb-3" strokeWidth={1.5} />
              <p className="text-forest-light/60 font-body">
                Aún no hay registros. Haz tu primer check-in.
              </p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="moodG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C25934" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#C25934" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="energyG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2C5A3F" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#2C5A3F" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="stabG" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7BA4A8" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#7BA4A8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E6DFD3" />
                  <XAxis dataKey="date" stroke="#4A5D52" fontSize={11} />
                  <YAxis domain={CHART_Y_DOMAIN} stroke="#4A5D52" fontSize={11} />
                  <Tooltip contentStyle={CHART_TOOLTIP_STYLE} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="Ánimo"
                    stroke="#C25934"
                    fill="url(#moodG)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="Energía"
                    stroke="#2C5A3F"
                    fill="url(#energyG)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="Estabilidad"
                    stroke="#7BA4A8"
                    fill="url(#stabG)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>

              <div className="mt-6 space-y-2 max-h-60 overflow-y-auto">
                {[...history].reverse().slice(0, 10).map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center gap-4 py-2 border-b border-bone-dark/40 last:border-0"
                    data-testid={`emotion-${h.id}`}
                  >
                    <span className="label-upper text-forest-light/70 w-20">
                      {h.date.slice(5)}
                    </span>
                    <div className="flex gap-3 text-sm font-body flex-1">
                      <span className="text-terracotta">
                        ♥ {h.mood}
                      </span>
                      <span className="text-forest-light">⚡ {h.energy}</span>
                      <span className="text-sky_soft">⚓ {h.stability}</span>
                    </div>
                    {h.note && (
                      <span className="text-xs font-body text-forest-light/70 italic truncate max-w-xs">
                        "{h.note}"
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SliderBlock({ icon: Icon, color, label, value, setValue, testid }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${color}`} strokeWidth={1.75} />
          <span className="label-upper">{label}</span>
        </div>
        <span className="font-heading font-extrabold text-2xl text-forest">
          {value[0]}
        </span>
      </div>
      <Slider
        value={value}
        onValueChange={setValue}
        min={1}
        max={10}
        step={1}
        data-testid={testid}
        className="w-full"
      />
      <div className="flex justify-between mt-2 text-[10px] font-label text-forest-light/50">
        <span>1</span>
        <span>10</span>
      </div>
    </div>
  );
}
