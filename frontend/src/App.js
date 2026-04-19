import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CursoMilagros from "./pages/CursoMilagros";
import Coach from "./pages/Coach";
import NinoInterior from "./pages/NinoInterior";
import Planner from "./pages/Planner";
import Diario from "./pages/Diario";
import Habitos from "./pages/Habitos";
import Emociones from "./pages/Emociones";

const TOASTER_OPTIONS = {
  style: {
    background: "#FFFFFF",
    border: "1px solid #E6DFD3",
    color: "#1A3626",
    fontFamily: "IBM Plex Sans",
    borderRadius: "1rem",
  },
};

function ProtectedRoute({ children }) {
  const { authed, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bone">
        <p className="text-forest-light font-body">Cargando...</p>
      </div>
    );
  }
  if (!authed) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
}

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={TOASTER_OPTIONS} />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/curso" element={<ProtectedRoute><CursoMilagros /></ProtectedRoute>} />
            <Route path="/coach" element={<ProtectedRoute><Coach /></ProtectedRoute>} />
            <Route path="/nino-interior" element={<ProtectedRoute><NinoInterior /></ProtectedRoute>} />
            <Route path="/planner" element={<ProtectedRoute><Planner /></ProtectedRoute>} />
            <Route path="/diario" element={<ProtectedRoute><Diario /></ProtectedRoute>} />
            <Route path="/habitos" element={<ProtectedRoute><Habitos /></ProtectedRoute>} />
            <Route path="/emociones" element={<ProtectedRoute><Emociones /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
