import { useCallback, useEffect, useRef, useState } from "react";
import { api } from "../lib/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Plus, Send, Trash2, Sparkles, Loader2, MessageCircleHeart } from "lucide-react";
import { toast } from "sonner";
import Markdown from "../components/Markdown";

export default function Coach() {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [newContext, setNewContext] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const scrollRef = useRef(null);

  const loadSessions = useCallback(async () => {
    const res = await api.get("/coach/sessions");
    setSessions(res.data);
    setActiveSession((curr) => curr || res.data[0] || null);
  }, []);

  const loadMessages = useCallback(async (sessionId) => {
    const res = await api.get(`/coach/sessions/${sessionId}/messages`);
    setMessages(res.data);
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  useEffect(() => {
    if (activeSession) loadMessages(activeSession.id);
  }, [activeSession, loadMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const createSession = async () => {
    try {
      setSending(true);
      const res = await api.post("/coach/sessions", {
        title: newTitle || "Sesión de coaching",
        initial_context: newContext,
      });
      setShowNewDialog(false);
      setNewContext("");
      setNewTitle("");
      await loadSessions();
      setActiveSession(res.data);
      toast.success("Sesión creada. Tu coach está diagnosticando.");
    } catch (err) {
      toast.error("Error al crear sesión");
    } finally {
      setSending(false);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !activeSession || sending) return;
    const userMsg = {
      id: `tmp-${Date.now()}`,
      session_id: activeSession.id,
      role: "user",
      content: input,
      created_at: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);
    const contentToSend = input;
    setInput("");
    setSending(true);
    try {
      await api.post("/coach/message", {
        session_id: activeSession.id,
        content: contentToSend,
      });
      await loadMessages(activeSession.id);
    } catch (err) {
      toast.error("Error al enviar mensaje");
    } finally {
      setSending(false);
    }
  };

  const deleteSession = async (id) => {
    await api.delete(`/coach/sessions/${id}`);
    await loadSessions();
    if (activeSession?.id === id) {
      setActiveSession(null);
      setMessages([]);
    }
  };

  return (
    <div className="h-screen flex flex-col" data-testid="coach-page">
      <div className="p-6 md:p-10 pb-0">
        <p className="label-upper">Coach IA · PNL + Tony Robbins + UCDM</p>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-forest mt-2 tracking-tighter">
          Sesiones de <span className="text-terracotta">coaching profundo</span>
        </h1>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-[280px,1fr] gap-6 p-6 md:p-10 overflow-hidden">
        {/* Sessions list */}
        <div className="tactile-card p-4 flex flex-col overflow-hidden">
          <Button
            onClick={() => setShowNewDialog(true)}
            data-testid="new-session-btn"
            className="rounded-full bg-forest hover:bg-forest-light text-bone font-semibold mb-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva sesión
          </Button>
          <div className="flex-1 overflow-y-auto space-y-1" data-testid="sessions-list">
            {sessions.length === 0 ? (
              <p className="text-xs text-forest-light/60 font-body text-center py-6 px-2">
                Crea tu primera sesión de coaching
              </p>
            ) : (
              sessions.map((s) => (
                <div
                  key={s.id}
                  className={`group flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                    activeSession?.id === s.id
                      ? "bg-bone-dark text-forest"
                      : "hover:bg-bone-dark/50 text-forest-light"
                  }`}
                  onClick={() => setActiveSession(s)}
                  data-testid={`session-${s.id}`}
                >
                  <MessageCircleHeart className="w-4 h-4 shrink-0" strokeWidth={1.5} />
                  <span className="text-sm font-body truncate flex-1">
                    {s.title}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSession(s.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    data-testid={`delete-session-${s.id}`}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-terracotta" strokeWidth={1.5} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="tactile-card flex flex-col overflow-hidden">
          {!activeSession ? (
            <div className="flex-1 flex items-center justify-center p-10 text-center">
              <div>
                <Sparkles className="w-10 h-10 text-terracotta mx-auto mb-4" strokeWidth={1.5} />
                <p className="font-heading font-bold text-xl text-forest mb-2">
                  Inicia una sesión de coaching
                </p>
                <p className="text-forest-light font-body max-w-md">
                  Tu coach integra PNL, técnicas de Tony Robbins, UCDM y
                  decodificación bíblica. Diagnostica y crea planes personalizados.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="px-6 py-4 border-b border-bone-dark">
                <h3 className="font-heading font-bold text-forest">
                  {activeSession.title}
                </h3>
              </div>

              <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-4"
                data-testid="messages-area"
              >
                {messages.length === 0 ? (
                  <p className="text-center text-forest-light/60 font-body text-sm py-8">
                    Escribe para comenzar la conversación
                  </p>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                      data-testid={`message-${m.role}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-5 py-3 ${
                          m.role === "user"
                            ? "bg-forest text-bone"
                            : "bg-bone border border-bone-dark"
                        }`}
                      >
                        {m.role === "user" ? (
                          <p className="font-body text-sm leading-relaxed whitespace-pre-wrap">
                            {m.content}
                          </p>
                        ) : (
                          <Markdown content={m.content} />
                        )}
                      </div>
                    </div>
                  ))
                )}
                {sending && (
                  <div className="flex justify-start">
                    <div className="bg-bone border border-bone-dark rounded-2xl px-5 py-3">
                      <Loader2 className="w-4 h-4 text-terracotta animate-spin" />
                    </div>
                  </div>
                )}
              </div>

              <form
                onSubmit={sendMessage}
                className="p-4 border-t border-bone-dark flex gap-2"
                data-testid="chat-form"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Cuéntale a tu coach..."
                  disabled={sending}
                  data-testid="chat-input"
                  className="flex-1 h-11 rounded-full border-bone-dark bg-bone font-body"
                />
                <Button
                  type="submit"
                  disabled={sending || !input.trim()}
                  data-testid="chat-send-btn"
                  className="h-11 rounded-full bg-terracotta hover:bg-terracotta-dark text-bone px-6"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* New session dialog */}
      {showNewDialog && (
        <div
          className="fixed inset-0 bg-forest-dark/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          data-testid="new-session-dialog"
        >
          <div className="bg-bone-light rounded-2xl p-8 max-w-lg w-full border border-bone-dark">
            <p className="label-upper">Nueva sesión</p>
            <h3 className="font-heading font-bold text-2xl text-forest mt-2 tracking-tight">
              ¿Cómo te sientes hoy?
            </h3>
            <p className="text-forest-light font-body text-sm mt-2">
              Cuéntale a tu coach cómo estás y qué necesitas. Él diagnosticará y
              diseñará un plan personalizado.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="label-upper block mb-2">Título (opcional)</label>
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej: Ansiedad en el trabajo"
                  data-testid="new-session-title"
                  className="h-11 rounded-full border-bone-dark bg-bone"
                />
              </div>
              <div>
                <label className="label-upper block mb-2">
                  Tu estado emocional y lo que buscas
                </label>
                <Textarea
                  value={newContext}
                  onChange={(e) => setNewContext(e.target.value)}
                  placeholder="Hoy me siento... Quiero trabajar en..."
                  rows={5}
                  data-testid="new-session-context"
                  className="rounded-2xl border-bone-dark bg-bone font-body"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowNewDialog(false)}
                data-testid="cancel-session-btn"
                className="rounded-full border-bone-dark"
              >
                Cancelar
              </Button>
              <Button
                onClick={createSession}
                disabled={sending}
                data-testid="create-session-btn"
                className="rounded-full bg-forest hover:bg-forest-light text-bone font-semibold px-6"
              >
                {sending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                Comenzar sesión
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
