/**
 * ElevenLabs Voice Integration
 * Genera voiceover con ElevenLabs API para composiciones de Remotion.
 * Soporta: text-to-speech, voice cloning, español latino.
 *
 * Uso:
 *   npx tsx scripts/elevenlabs-voice.ts --list-voices
 *   npx tsx scripts/elevenlabs-voice.ts --text "Tu texto" --voice-id abc123
 *   npx tsx scripts/elevenlabs-voice.ts --clone --name "MiVoz" --samples a.mp3 b.mp3
 *   npx tsx scripts/elevenlabs-voice.ts --generate-script iul_educational --voice-id abc123
 *
 * Requiere: ELEVENLABS_API_KEY en variable de entorno
 */
import fs from "fs";
import path from "path";

const API_BASE = "https://api.elevenlabs.io/v1";
const OUTPUT_DIR = path.join(process.cwd(), "public", "assets", "voiceover");

function getApiKey(): string {
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) { console.error("ERROR: ELEVENLABS_API_KEY no configurada."); process.exit(1); }
  return key;
}

async function listVoices() {
  const res = await fetch(`${API_BASE}/voices`, { headers: { "xi-api-key": getApiKey() } });
  if (!res.ok) throw new Error(`API Error ${res.status}`);
  return (await res.json()).voices;
}

async function textToSpeech(opts: { text: string; voiceId: string; outputPath: string; modelId?: string }) {
  const { text, voiceId, outputPath, modelId = "eleven_multilingual_v2" } = opts;
  console.log(`Generando voiceover (${text.length} chars)...`);
  const res = await fetch(`${API_BASE}/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: { "xi-api-key": getApiKey(), "Content-Type": "application/json" },
    body: JSON.stringify({ text, model_id: modelId, voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.5 } }),
  });
  if (!res.ok) throw new Error(`TTS Error ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, buffer);
  console.log(`Guardado: ${outputPath}`);
  return outputPath;
}

async function cloneVoice(opts: { name: string; samplePaths: string[] }) {
  const formData = new FormData();
  formData.append("name", opts.name);
  formData.append("description", `Voz clonada: ${opts.name}`);
  for (const p of opts.samplePaths) {
    formData.append("files", new Blob([fs.readFileSync(p)], { type: "audio/mpeg" }), path.basename(p));
  }
  const res = await fetch(`${API_BASE}/voices/add`, { method: "POST", headers: { "xi-api-key": getApiKey() }, body: formData });
  if (!res.ok) throw new Error(`Clone Error ${res.status}`);
  const data = await res.json();
  console.log(`Voz clonada! ID: ${data.voice_id}`);
  return data;
}

const INSURANCE_SCRIPTS = {
  iul_educational: [
    { scene: "hook", text: "¿Sabías que la inflación promedio supera el tres por ciento, pero una cuenta de ahorro paga menos del uno?" },
    { scene: "build", text: "Existe un instrumento financiero que combina seguro de vida con una cuenta de ahorro indexada al mercado." },
    { scene: "benefits", text: "Protección familiar desde el día uno. Potencial de crecimiento vinculado al S&P 500. Y un piso de cero por ciento." },
    { scene: "cta", text: "Conocé cómo funciona un IUL para tu familia. Más información en el link de la bio." },
  ],
  recruitment: [
    { scene: "hook", text: "La industria de seguros de vida está buscando nuevos agentes." },
    { scene: "opportunity", text: "Una carrera flexible, con potencial de crecimiento real." },
    { scene: "benefits", text: "Horarios flexibles. Entrenamiento incluido. Un mercado que crece cada año." },
    { scene: "cta", text: "¿Te interesa? Visitá el link en la bio para conocer más detalles." },
  ],
};

async function main() {
  const args = process.argv.slice(2);
  if (args.includes("--list-voices")) {
    const voices = await listVoices();
    for (const v of voices) console.log(`  ${v.name} (${v.voice_id})`);
    return;
  }
  if (args.includes("--clone")) {
    await cloneVoice({ name: args[args.indexOf("--name") + 1], samplePaths: args.slice(args.indexOf("--samples") + 1) });
    return;
  }
  if (args.includes("--generate-script")) {
    const name = args[args.indexOf("--generate-script") + 1] as keyof typeof INSURANCE_SCRIPTS;
    const voiceId = args[args.indexOf("--voice-id") + 1];
    for (let i = 0; i < INSURANCE_SCRIPTS[name].length; i++) {
      const { scene, text } = INSURANCE_SCRIPTS[name][i];
      await textToSpeech({ text, voiceId, outputPath: path.join(OUTPUT_DIR, `${name}_${i + 1}_${scene}.mp3`) });
      if (i < INSURANCE_SCRIPTS[name].length - 1) await new Promise(r => setTimeout(r, 600));
    }
    return;
  }
  if (args.includes("--text")) {
    await textToSpeech({ text: args[args.indexOf("--text") + 1], voiceId: args[args.indexOf("--voice-id") + 1], outputPath: path.join(OUTPUT_DIR, "voiceover.mp3") });
    return;
  }
  console.log("ElevenLabs Voice Integration\n  --list-voices\n  --text '...' --voice-id ID\n  --clone --name 'Voz' --samples a.mp3\n  --generate-script iul_educational --voice-id ID");
}
main().catch(console.error);
