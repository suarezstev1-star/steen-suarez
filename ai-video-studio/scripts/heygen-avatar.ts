/**
 * HeyGen Avatar Integration
 * Genera videos con avatares digitales para campañas de seguros.
 *
 * Uso:
 *   npx tsx scripts/heygen-avatar.ts --list-avatars
 *   npx tsx scripts/heygen-avatar.ts --insurance iul --avatar AVATAR_ID
 *   npx tsx scripts/heygen-avatar.ts --status --video-id VIDEO_ID
 *   npx tsx scripts/heygen-avatar.ts --download --video-id VIDEO_ID
 *
 * Requiere: HEYGEN_API_KEY en variable de entorno
 */
import fs from "fs";
import path from "path";

const API_BASE = "https://api.heygen.com/v2";
const OUTPUT_DIR = path.join(process.cwd(), "public", "assets", "avatars");

function getApiKey(): string {
  const key = process.env.HEYGEN_API_KEY;
  if (!key) { console.error("ERROR: HEYGEN_API_KEY no configurada."); process.exit(1); }
  return key;
}
const hdrs = () => ({ "X-Api-Key": getApiKey(), "Content-Type": "application/json" });

async function listAvatars() {
  const res = await fetch(`${API_BASE}/avatars`, { headers: hdrs() });
  return (await res.json()).data?.avatars || [];
}

async function generateVideo(opts: { avatarId: string; text: string; voiceId?: string; title?: string }) {
  const { avatarId, text, title = "Insurance Ad" } = opts;
  const res = await fetch(`${API_BASE}/video/generate`, {
    method: "POST", headers: hdrs(),
    body: JSON.stringify({
      title, dimension: { width: 1080, height: 1920 },
      video_inputs: [{ character: { type: "avatar", avatar_id: avatarId, avatar_style: "normal" }, voice: { type: "text", input_text: text }, background: { type: "color", value: "#0a0f1e" } }],
    }),
  });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  const data = await res.json();
  console.log(`Video en proceso! ID: ${data.data?.video_id}`);
  return { video_id: data.data?.video_id };
}

async function checkStatus(videoId: string) {
  const res = await fetch(`${API_BASE}/video_status.get?video_id=${videoId}`, { headers: hdrs() });
  const data = await res.json();
  console.log(`Estado: ${data.data?.status}`);
  if (data.data?.video_url) console.log(`URL: ${data.data.video_url}`);
  return data.data;
}

async function downloadVideo(videoId: string) {
  const data = await checkStatus(videoId);
  if (data?.status !== "completed" || !data.video_url) { console.error("Video no listo."); process.exit(1); }
  const res = await fetch(data.video_url);
  const buffer = Buffer.from(await res.arrayBuffer());
  const outputPath = path.join(OUTPUT_DIR, `avatar_${videoId}.mp4`);
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(outputPath, buffer);
  console.log(`Guardado: ${outputPath}\nUsa en Remotion: <FitVideo src={staticFile("assets/avatars/avatar_${videoId}.mp4")} />`);
}

const SCRIPTS: Record<string, string> = {
  iul: "¿Sabías que la inflación supera el 3%, pero una cuenta de ahorro paga menos del 1%? Existe un instrumento llamado IUL que combina seguro de vida con ahorro indexado al mercado. Protección desde el día uno, crecimiento vinculado al S&P 500, y un piso de 0%. Visitá el link en la bio.",
  recruitment: "La industria de seguros busca nuevos agentes. Carrera flexible, crecimiento real, ayudás a familias. Entrenamiento incluido, horarios flexibles. ¿Te interesa? Link en la bio.",
  general: "El 60% de las familias no tienen seguro de vida adecuado. Un seguro es tranquilidad para tu familia. Opciones accesibles para cada presupuesto. Conocé más en el link de la bio.",
};

async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--list-avatars")) { for (const a of await listAvatars()) console.log(`  ${a.avatar_name} (${a.avatar_id})`); return; }
  if (args.includes("--insurance")) { const c = args[args.indexOf("--insurance") + 1] || "general"; const a = args[args.indexOf("--avatar") + 1]; await generateVideo({ avatarId: a, text: SCRIPTS[c], title: `Insurance - ${c}` }); return; }
  if (args.includes("--generate")) { await generateVideo({ avatarId: args[args.indexOf("--avatar") + 1], text: args[args.indexOf("--text") + 1] }); return; }
  if (args.includes("--status")) { await checkStatus(args[args.indexOf("--video-id") + 1]); return; }
  if (args.includes("--download")) { await downloadVideo(args[args.indexOf("--video-id") + 1]); return; }
  console.log("HeyGen Avatar Integration\n  --list-avatars\n  --insurance iul --avatar ID\n  --generate --avatar ID --text '...'\n  --status --video-id ID\n  --download --video-id ID");
}
main().catch(console.error);
