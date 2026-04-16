import React from "react";
import {AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring} from "remotion";
import {AnimatedTitle} from "../components/text/AnimatedTitle";
import {TypewriterText} from "../components/text/TypewriterText";
import {GradientBackground} from "../components/backgrounds/GradientBackground";
import {GridPattern} from "../components/backgrounds/GridPattern";
import {GlassmorphismCard} from "../components/backgrounds/GlassmorphismCard";
import {ProgressBar} from "../components/overlays/ProgressBar";
import {SafeArea} from "../components/layout/SafeArea";
import {loadDefaultFonts} from "../presets/fonts";

// IUL Campaign - 25s Meta Ad (1080x1920) - 100% Meta-Compliant
const NAVY = "#0a0f1e"; const NAVY_MID = "#111827";
const BLUE = "#3b82f6"; const BLUE_LIGHT = "#60a5fa";
const GREEN = "#22c55e"; const RED_MUTED = "#ef4444";
const WHITE = "#ffffff"; const MUTED = "#94a3b8"; const GOLD = "#fbbf24";

const ComparisonBar: React.FC<{label: string; value: number; maxValue: number; color: string; delay?: number}> = ({label, value, maxValue, color, delay = 0}) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const progress = spring({fps, frame: Math.max(0, frame - delay), config: {damping: 20, stiffness: 80}});
  const barWidth = interpolate(progress, [0, 1], [0, (value / maxValue) * 100]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  return (
    <div style={{opacity, marginBottom: 24}}>
      <div style={{display: "flex", justifyContent: "space-between", marginBottom: 8}}>
        <span style={{fontSize: 26, fontFamily: "'Inter', sans-serif", fontWeight: 600, color: WHITE}}>{label}</span>
        <span style={{fontSize: 26, fontFamily: "'Poppins', sans-serif", fontWeight: 700, color}}>{value}%</span>
      </div>
      <div style={{height: 16, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.1)", overflow: "hidden"}}>
        <div style={{width: `${barWidth}%`, height: "100%", borderRadius: 8, backgroundColor: color, boxShadow: `0 0 16px ${color}55`}} />
      </div>
    </div>
  );
};

const BenefitRow: React.FC<{icon: string; title: string; subtitle: string; accentColor: string; index: number}> = ({icon, title, subtitle, accentColor, index}) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const progress = spring({fps, frame: Math.max(0, frame - index * 35), config: {damping: 14, stiffness: 100}});
  const translateY = interpolate(progress, [0, 1], [50, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  return (
    <div style={{display: "flex", alignItems: "center", gap: 20, opacity, transform: `translateY(${translateY}px)`, marginBottom: 28}}>
      <div style={{width: 72, height: 72, borderRadius: 18, background: `linear-gradient(135deg, ${accentColor}22, ${accentColor}44)`, border: `1.5px solid ${accentColor}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, flexShrink: 0}}>{icon}</div>
      <div><div style={{fontSize: 32, fontFamily: "'Inter', sans-serif", fontWeight: 700, color: WHITE, lineHeight: 1.2}}>{title}</div><div style={{fontSize: 22, fontFamily: "'Inter', sans-serif", fontWeight: 400, color: MUTED, marginTop: 4}}>{subtitle}</div></div>
    </div>
  );
};

const ComparisonRow: React.FC<{feature: string; traditional: string; iul: string; traditionalColor?: string; iulColor?: string; index: number}> = ({feature, traditional, iul, traditionalColor = RED_MUTED, iulColor = GREEN, index}) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const progress = spring({fps, frame: Math.max(0, frame - index * 20), config: {damping: 16, stiffness: 100}});
  return (
    <div style={{display: "flex", alignItems: "center", opacity: interpolate(progress, [0, 1], [0, 1]), transform: `translateX(${interpolate(progress, [0, 1], [40, 0])}px)`, padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.08)"}}>
      <div style={{flex: 1.2, fontSize: 22, fontFamily: "'Inter', sans-serif", fontWeight: 600, color: WHITE}}>{feature}</div>
      <div style={{flex: 1, fontSize: 22, fontFamily: "'Inter', sans-serif", fontWeight: 600, color: traditionalColor, textAlign: "center"}}>{traditional}</div>
      <div style={{flex: 1, fontSize: 22, fontFamily: "'Inter', sans-serif", fontWeight: 700, color: iulColor, textAlign: "center"}}>{iul}</div>
    </div>
  );
};

const Disclaimer: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();
  return <div style={{position: "absolute", bottom: 40, left: 60, right: 60, opacity: interpolate(frame, [0, 20], [0, 0.7], {extrapolateRight: "clamp"}), fontSize: 16, fontFamily: "'Inter', sans-serif", fontWeight: 400, color: MUTED, textAlign: "center", lineHeight: 1.4}}>{text}</div>;
};

export const IULCuentaIndexada: React.FC = () => {
  loadDefaultFonts();
  return (
    <AbsoluteFill>
      <GradientBackground colors={[NAVY, NAVY_MID, "#0d1525"]} angle={160} animateAngle animateSpeed={0.15} />
      <GridPattern type="dots" spacing={60} size={1} color="rgba(59,130,246,0.06)" animate animateSpeed={0.2} />
      {/* HOOK 0-3s */}
      <Sequence from={0} durationInFrames={90}>
        <SafeArea paddingHorizontal={60} paddingVertical={200}>
          <AbsoluteFill style={{flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 40}}>
            <div style={{fontSize: 20, fontFamily: "'Inter', sans-serif", fontWeight: 600, color: BLUE_LIGHT, textTransform: "uppercase", letterSpacing: 5}}>DATO FINANCIERO</div>
            <div style={{width: "100%", paddingLeft: 60, paddingRight: 60}}>
              <ComparisonBar label="Inflaci\u00f3n promedio" value={3.4} maxValue={5} color={RED_MUTED} delay={10} />
              <ComparisonBar label="Cuenta de ahorro" value={0.5} maxValue={5} color={MUTED} delay={25} />
            </div>
            <Sequence from={40} durationInFrames={50}>
              <AnimatedTitle text="El ahorro tradicional pierde poder adquisitivo cada a\u00f1o" fontSize={34} fontWeight={700} color={GOLD} enterAnimation="slideUp" enterDuration={12} holdDuration={40} exitDuration={0} />
            </Sequence>
          </AbsoluteFill>
        </SafeArea>
      </Sequence>
      {/* BUILD 3-10s */}
      <Sequence from={90} durationInFrames={210}>
        <SafeArea paddingHorizontal={60} paddingVertical={160}>
          <AbsoluteFill style={{flexDirection: "column", justifyContent: "flex-start", alignItems: "center", gap: 30}}>
            <AnimatedTitle text="\u00bfQu\u00e9 es un IUL?" fontSize={56} fontWeight={900} color={WHITE} enterAnimation="scale" exitAnimation="fade" enterDuration={15} holdDuration={170} exitDuration={15} letterSpacing={-1} />
            <Sequence from={20} durationInFrames={190}>
              <GlassmorphismCard accentColor={BLUE} width={920} height={340} enterDelay={0} bgOpacity={0.1}>
                <div style={{display: "flex", flexDirection: "column", gap: 20, padding: 10}}>
                  <div style={{fontSize: 24, fontFamily: "'Inter', sans-serif", fontWeight: 600, color: BLUE_LIGHT, textTransform: "uppercase", letterSpacing: 3}}>INDEXED UNIVERSAL LIFE</div>
                  <div style={{fontSize: 32, fontFamily: "'Inter', sans-serif", fontWeight: 600, color: WHITE, lineHeight: 1.5}}>Un instrumento financiero que combina <span style={{color: BLUE}}>seguro de vida</span> + <span style={{color: GREEN}}>cuenta de ahorro</span> vinculada a \u00edndices del mercado</div>
                </div>
              </GlassmorphismCard>
            </Sequence>
          </AbsoluteFill>
        </SafeArea>
      </Sequence>
      {/* PEAK 10-17s */}
      <Sequence from={300} durationInFrames={210}>
        <SafeArea paddingHorizontal={60} paddingVertical={180}>
          <AbsoluteFill style={{flexDirection: "column", justifyContent: "center", paddingLeft: 40, paddingRight: 40}}>
            <BenefitRow index={0} icon="\uD83D\uDEE1\uFE0F" title="Protecci\u00f3n familiar" subtitle="Seguro de vida incluido desde el d\u00eda 1" accentColor={BLUE} />
            <BenefitRow index={1} icon="\uD83D\uDCC8" title="Potencial de crecimiento" subtitle="Vinculado a \u00edndices como el S&P 500" accentColor={GREEN} />
            <BenefitRow index={2} icon="\uD83D\uDD12" title="Piso de protecci\u00f3n (0%)" subtitle="Dise\u00f1ado para no perder en ca\u00eddas del mercado" accentColor={GOLD} />
          </AbsoluteFill>
        </SafeArea>
      </Sequence>
      {/* COMPARISON 17-21s */}
      <Sequence from={510} durationInFrames={120}>
        <SafeArea paddingHorizontal={50} paddingVertical={180}>
          <AbsoluteFill style={{flexDirection: "column", justifyContent: "center", paddingLeft: 30, paddingRight: 30}}>
            <div style={{display: "flex", alignItems: "center", paddingBottom: 16, borderBottom: `2px solid ${BLUE}44`, marginBottom: 8}}>
              <div style={{flex: 1.2}} />
              <div style={{flex: 1, fontSize: 20, fontFamily: "'Inter', sans-serif", fontWeight: 700, color: MUTED, textAlign: "center"}}>Ahorro</div>
              <div style={{flex: 1, fontSize: 20, fontFamily: "'Inter', sans-serif", fontWeight: 700, color: BLUE_LIGHT, textAlign: "center"}}>IUL</div>
            </div>
            <ComparisonRow index={0} feature="Protecci\u00f3n de vida" traditional="No" iul="S\u00ed" />
            <ComparisonRow index={1} feature="Crecimiento potencial" traditional="~0.5%" iul="Indexado" traditionalColor={MUTED} iulColor={GREEN} />
            <ComparisonRow index={2} feature="Piso en ca\u00eddas" traditional="N/A" iul="0%" traditionalColor={MUTED} iulColor={GREEN} />
            <ComparisonRow index={3} feature="Ventajas fiscales" traditional="Limitadas" iul="Potenciales" traditionalColor={MUTED} iulColor={GREEN} />
          </AbsoluteFill>
        </SafeArea>
      </Sequence>
      {/* CTA 21-25s */}
      <Sequence from={630} durationInFrames={120}>
        <SafeArea paddingHorizontal={60} paddingVertical={200}>
          <AbsoluteFill style={{flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 30}}>
            <AnimatedTitle text={"Conoc\u00e9 c\u00f3mo funciona\nun IUL para tu familia"} fontSize={48} fontWeight={800} color={WHITE} enterAnimation="scale" enterDuration={15} holdDuration={100} exitDuration={0} letterSpacing={-0.5} lineHeight={1.2} />
            <Sequence from={20} durationInFrames={100}>
              <TypewriterText text="M\u00e1s informaci\u00f3n \u2192 link en bio" fontSize={32} fontFamily="'Inter', sans-serif" fontWeight={700} color={BLUE_LIGHT} cursorColor={BLUE} typingSpeed={2} startDelay={5} />
            </Sequence>
          </AbsoluteFill>
          <Disclaimer text="Consulta con un profesional financiero autorizado. Los beneficios dependen de la p\u00f3liza espec\u00edfica y las condiciones del mercado. Los resultados individuales pueden variar." />
        </SafeArea>
      </Sequence>
      <ProgressBar color={BLUE} height={4} position="bottom" />
    </AbsoluteFill>
  );
};
