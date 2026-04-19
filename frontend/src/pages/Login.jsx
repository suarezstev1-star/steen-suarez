import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

export default function Login() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(password);
      toast.success("Bienvenido/a. Hoy es un día de milagros.");
      navigate("/");
    } catch (err) {
      toast.error("Contraseña incorrecta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" data-testid="login-page">
      {/* Left - form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-bone">
        <div className="max-w-md w-full animate-fade-in-up">
          <p className="label-upper">Milagros · Transformación</p>
          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl text-forest mt-3 tracking-tighter leading-tight">
            Bienvenido/a a tu
            <br />
            <span className="text-terracotta">salto cuántico.</span>
          </h1>
          <p className="text-base text-forest-light/80 mt-6 font-body leading-relaxed">
            Un espacio profesional diseñado con PNL, coaching transformacional
            y la sabiduría de Un Curso de Milagros. Accede con tu contraseña
            personal.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-4" data-testid="login-form">
            <div>
              <label className="label-upper block mb-2">Contraseña</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tu contraseña personal"
                data-testid="login-password-input"
                className="h-12 rounded-full px-5 border-bone-dark bg-bone-light focus-visible:ring-forest font-body"
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !password}
              data-testid="login-submit-btn"
              className="w-full h-12 rounded-full bg-forest hover:bg-forest-light text-bone font-semibold tracking-wide transition-colors disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 mr-2" strokeWidth={2} />
              {loading ? "Abriendo..." : "Entrar a mi transformación"}
            </Button>
          </form>

          <div className="mt-12 pt-8 border-t border-bone-dark">
            <p className="text-xs text-forest-light/60 font-body">
              Diseñado con técnicas de Tony Robbins, PNL avanzada, sanación del
              niño interior y las 365 lecciones del Curso de Milagros.
            </p>
          </div>
        </div>
      </div>

      {/* Right - image */}
      <div
        className="hidden lg:block flex-1 bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url(https://images.pexels.com/photos/6789297/pexels-photo-6789297.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-forest/30 via-transparent to-terracotta/20" />
        <div className="absolute bottom-12 left-12 right-12 text-bone">
          <p className="label-upper text-bone/90">Un curso de milagros</p>
          <p className="font-heading text-2xl font-bold mt-3 leading-snug max-w-md">
            "Podría ver paz en lugar de esto."
          </p>
          <p className="text-sm mt-2 text-bone/80">— Lección 34</p>
        </div>
      </div>
    </div>
  );
}
