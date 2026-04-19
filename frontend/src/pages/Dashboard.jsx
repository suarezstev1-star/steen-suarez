import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  BookOpen,
  MessageCircleHeart,
  Flame,
  TrendingUp,
  Heart,
  Sparkles,
  NotebookPen,
  Baby,
  ArrowRight,
} from "lucide-react";

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [todayLesson, setTodayLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get("/metrics/dashboard").then((r) => setMetrics(r.data)),
      api.get("/lessons/today").then((r) => setTodayLesson(r.data)),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading || !metrics) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="dashboard-loading">
        <p className="text-forest-light font-body">Cargando tu transformación...</p>
      </div>
    );
  }

  const chartData = metrics.emotions.series_14d.map((d) => ({
    date: d.date.slice(5),
    Ánimo: d.mood,
    Energía: d.energy,
    Estabilidad: d.stability,
  }));

  return (
    <div className="p-6 md:p-10 max-w-7xl" data-testid="dashboard">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10 animate-fade-in-up">
        <div>
          <p className="label-upper">Tu salto cuántico · Día {metrics.day_of_year} de 365</p>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-forest mt-2 tracking-tighter">
            Buenos días.
            <br />
            <span className="text-terracotta">Hoy transformas.</span>
          </h1>
        </div>
        <div className="tactile-card px-6 py-4 max-w-sm">
          <p className="label-upper text-forest-light">Progreso del año</p>
          <div className="mt-2 flex items-end gap-2">
            <span className="font-heading text-4xl font-extrabold text-forest">
              {metrics.year_progress}%
            </span>
            <span className="text-forest-light/60 text-sm mb-1 font-body">
              del camino 2026
            </span>
          </div>
          <div className="mt-3 h-2 bg-bone-dark rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-forest to-terracotta transition-all duration-700 ease-out"
              style={{ width: `${metrics.year_progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Lección del día - span 2 */}
        <div
          className="tactile-card p-8 md:col-span-2 lg:col-span-2 md:row-span-2 cursor-pointer group"
          onClick={() => navigate(`/curso?day=${todayLesson?.day}`)}
          data-testid="today-lesson-card"
        >
          <div className="flex items-start justify-between">
            <p className="label-upper">Lección {todayLesson?.day} · Hoy</p>
            <BookOpen className="w-5 h-5 text-terracotta" strokeWidth={1.5} />
          </div>
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-forest mt-6 leading-snug tracking-tight">
            "{todayLesson?.title}"
          </h2>
          <p className="text-forest-light font-body mt-6 leading-relaxed">
            Tu coach decodificará esta lección con ejemplos reales, PNL y
            sabiduría bíblica para un salto cuántico hoy.
          </p>
          <button
            className="mt-8 inline-flex items-center gap-2 text-terracotta font-label font-semibold text-sm tracking-wide group-hover:gap-3 transition-all"
            data-testid="open-lesson-btn"
          >
            Abrir lección del día
            <ArrowRight className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>

        {/* Emociones métricas */}
        <MetricCard
          label="Ánimo"
          value={metrics.emotions.mood_avg || "—"}
          suffix="/10"
          icon={Heart}
          testid="metric-mood"
          accent
        />
        <MetricCard
          label="Estabilidad"
          value={metrics.emotions.stability_avg || "—"}
          suffix="/10"
          icon={TrendingUp}
          testid="metric-stability"
        />
        <MetricCard
          label="Racha"
          value={metrics.emotions.streak}
          suffix=" días"
          icon={Flame}
          testid="metric-streak"
        />
        <MetricCard
          label="Hábitos semana"
          value={`${metrics.habits.completion_rate}%`}
          icon={Sparkles}
          testid="metric-habits"
        />

        {/* Gráfico emocional - span 3 */}
        <div className="tactile-card p-8 md:col-span-3 lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="label-upper">Evolución emocional · 14 días</p>
              <h3 className="font-heading font-bold text-xl text-forest mt-1">
                Tu trayectoria de transformación
              </h3>
            </div>
            <button
              onClick={() => navigate("/emociones")}
              data-testid="open-emotions-btn"
              className="text-xs font-label tracking-wide text-terracotta hover:text-terracotta-dark"
            >
              Registrar ahora →
            </button>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E6DFD3" />
              <XAxis
                dataKey="date"
                stroke="#4A5D52"
                fontSize={11}
                fontFamily="IBM Plex Sans"
              />
              <YAxis
                domain={[0, 10]}
                stroke="#4A5D52"
                fontSize={11}
                fontFamily="IBM Plex Sans"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E6DFD3",
                  borderRadius: "0.75rem",
                  fontFamily: "IBM Plex Sans",
                }}
              />
              <Legend wrapperStyle={{ fontFamily: "IBM Plex Sans", fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="Ánimo"
                stroke="#C25934"
                strokeWidth={2.5}
                dot={{ fill: "#C25934", r: 3 }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="Energía"
                stroke="#2C5A3F"
                strokeWidth={2.5}
                dot={{ fill: "#2C5A3F", r: 3 }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="Estabilidad"
                stroke="#7BA4A8"
                strokeWidth={2.5}
                dot={{ fill: "#7BA4A8", r: 3 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Growth stats */}
        <GrowthCard
          label="Coach IA"
          count={metrics.growth.coach_sessions}
          desc="sesiones"
          icon={MessageCircleHeart}
          onClick={() => navigate("/coach")}
          testid="growth-coach"
        />
        <GrowthCard
          label="Diario"
          count={metrics.growth.journal_entries}
          desc="entradas"
          icon={NotebookPen}
          onClick={() => navigate("/diario")}
          testid="growth-journal"
        />
        <GrowthCard
          label="Niño interior"
          count={metrics.growth.inner_child_logs}
          desc="prácticas"
          icon={Baby}
          onClick={() => navigate("/nino-interior")}
          testid="growth-nino"
        />
        <GrowthCard
          label="Lecciones"
          count={metrics.growth.lessons_studied}
          desc="decodificadas"
          icon={BookOpen}
          onClick={() => navigate("/curso")}
          testid="growth-lessons"
        />
      </div>
    </div>
  );
}

function MetricCard({ label, value, suffix = "", icon: Icon, testid, accent }) {
  return (
    <div className="tactile-card p-6 flex flex-col justify-between" data-testid={testid}>
      <div className="flex items-center justify-between">
        <p className="label-upper">{label}</p>
        <Icon
          className={`w-4 h-4 ${accent ? "text-terracotta" : "text-forest-light"}`}
          strokeWidth={1.5}
        />
      </div>
      <div className="mt-4">
        <span
          className={`font-heading font-extrabold text-3xl ${
            accent ? "text-terracotta" : "text-forest"
          }`}
        >
          {value}
        </span>
        <span className="text-forest-light/60 text-sm font-body">{suffix}</span>
      </div>
    </div>
  );
}

function GrowthCard({ label, count, desc, icon: Icon, onClick, testid }) {
  return (
    <button
      onClick={onClick}
      data-testid={testid}
      className="tactile-card p-6 text-left hover:border-terracotta/40 group"
    >
      <div className="flex items-center justify-between">
        <Icon className="w-5 h-5 text-forest-light group-hover:text-terracotta transition-colors" strokeWidth={1.5} />
        <ArrowRight className="w-4 h-4 text-bone-dark group-hover:text-terracotta transition-colors" strokeWidth={2} />
      </div>
      <p className="label-upper mt-4 text-forest-light">{label}</p>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="font-heading font-extrabold text-2xl text-forest">{count}</span>
        <span className="text-forest-light/60 text-xs font-body">{desc}</span>
      </div>
    </button>
  );
}
