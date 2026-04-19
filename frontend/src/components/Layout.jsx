import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Compass,
  BookOpen,
  MessageCircleHeart,
  Baby,
  CalendarClock,
  NotebookPen,
  Sparkles,
  Heart,
  LogOut,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, testid: "nav-dashboard" },
  { to: "/ruta", label: "Mi Ruta", icon: Compass, testid: "nav-ruta" },
  { to: "/curso", label: "Curso de Milagros", icon: BookOpen, testid: "nav-curso" },
  { to: "/coach", label: "Coach IA", icon: MessageCircleHeart, testid: "nav-coach" },
  { to: "/nino-interior", label: "Niño Interior", icon: Baby, testid: "nav-nino-interior" },
  { to: "/planner", label: "Planner Horario", icon: CalendarClock, testid: "nav-planner" },
  { to: "/diario", label: "Diario", icon: NotebookPen, testid: "nav-diario" },
  { to: "/habitos", label: "Hábitos", icon: Sparkles, testid: "nav-habitos" },
  { to: "/emociones", label: "Emociones", icon: Heart, testid: "nav-emociones" },
];

export default function Layout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-bone flex">
      {/* Sidebar */}
      <aside
        className="w-64 bg-bone-light border-r border-bone-dark flex flex-col sticky top-0 h-screen"
        data-testid="sidebar"
      >
        <div className="px-6 py-8 border-b border-bone-dark">
          <p className="label-upper">Milagros</p>
          <h1 className="font-heading font-extrabold text-2xl text-forest mt-1 tracking-tight">
            Salto Cuántico
          </h1>
          <p className="text-xs text-forest-light/70 mt-1 font-body">
            Transformación diaria
          </p>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              data-testid={item.testid}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-forest text-bone"
                    : "text-forest-light hover:bg-bone-dark/50 hover:text-forest"
                }`
              }
            >
              <item.icon className="w-4 h-4" strokeWidth={1.75} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-bone-dark">
          <button
            onClick={handleLogout}
            data-testid="logout-btn"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-full text-sm font-medium text-forest-light hover:bg-terracotta/10 hover:text-terracotta transition-colors duration-200"
          >
            <LogOut className="w-4 h-4" strokeWidth={1.75} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}
