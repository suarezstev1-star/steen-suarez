import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import {AnimatedTitle} from "../components/text/AnimatedTitle";
import {MorphingText} from "../components/text/MorphingText";
import {TypewriterText} from "../components/text/TypewriterText";
import {CountdownTimer} from "../components/overlays/CountdownTimer";
import {GradientBackground} from "../components/backgrounds/GradientBackground";
import {ParticleField} from "../components/backgrounds/ParticleField";
import {ProgressBar} from "../components/overlays/ProgressBar";
import {SafeArea} from "../components/layout/SafeArea";
import {loadDefaultFonts} from "../presets/fonts";

const YELLOW_NEON = "#facc15";
const BG_DARK = "#0a0a0a";
const BG_ACCENT = "#1a1a2e";
const ACCENT_PURPLE = "#a855f7";

const BulletPoint: React.FC<{text: string; index: number; emoji: string}> = ({text, index, emoji}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const delay = index * 45;
  const adjustedFrame = Math.max(0, frame - delay);
  const progress = spring({fps, frame: adjustedFrame, config: {damping: 14, stiffness: 100}});
  const translateX = interpolate(progress, [0, 1], [120, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  return (
    <div style={{display: "flex", alignItems: "center", gap: 20, opacity, transform: `translateX(${translateX}px)`, marginBottom: 36}}>
      <div style={{fontSize: 52, width: 70, height: 70, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 16, background: `linear-gradient(135deg, ${YELLOW_NEON}22, ${ACCENT_PURPLE}33)`, border: `2px solid ${YELLOW_NEON}44`, flexShrink: 0}}>{emoji}</div>
      <div style={{fontSize: 38, fontFamily: "'Inter', sans-serif", fontWeight: 700, color: "#ffffff", lineHeight: 1.3, textShadow: `0 2px 12px ${BG_DARK}`}}>{text}</div>
    </div>
  );
};

const FadeTransition: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30, 30, 60], [0, 1, 1, 0], {extrapolateRight: "clamp"});
  return <AbsoluteFill style={{backgroundColor: BG_DARK, opacity}} />;
};

export const AutomatizacionIA: React.FC = () => {
  loadDefaultFonts();
  return (
    <AbsoluteFill>
      <GradientBackground colors={[BG_DARK, BG_ACCENT, "#0f0524"]} angle={180} animateAngle animateSpeed={0.3} />
      <ParticleField count={30} color={`${YELLOW_NEON}25`} speed={0.3} direction="up" />
      <Sequence from={0} durationInFrames={150}>
        <SafeArea paddingHorizontal={60} paddingVertical={200}>
          <AbsoluteFill style={{justifyContent: "center", alignItems: "center"}}>
            <AnimatedTitle text={"El 80% del trabajo\nrepetitivo ya se puede\nautomatizar con IA"} fontSize={68} fontWeight={900} color={YELLOW_NEON} enterAnimation="scale" exitAnimation="slideLeft" enterDuration={18} holdDuration={95} exitDuration={18} textShadow={`0 4px 30px ${YELLOW_NEON}55`} letterSpacing={-1} lineHeight={1.15} />
          </AbsoluteFill>
        </SafeArea>
      </Sequence>
      <Sequence from={150} durationInFrames={450}>
        <SafeArea paddingHorizontal={60} paddingVertical={180}>
          <AbsoluteFill style={{flexDirection: "column", justifyContent: "flex-start", alignItems: "center"}}>
            <Sequence from={0} durationInFrames={100}>
              <AnimatedTitle text="La IA puede hacerlo por vos" fontSize={42} fontWeight={600} color="#ffffff" enterAnimation="slideUp" exitAnimation="fade" enterDuration={15} holdDuration={65} exitDuration={15} />
            </Sequence>
          </AbsoluteFill>
          <AbsoluteFill style={{flexDirection: "column", justifyContent: "center", paddingLeft: 60, paddingRight: 60}}>
            <BulletPoint index={0} emoji="\u26A1" text="Automatiz\u00e1 emails, reportes y seguimientos" />
            <BulletPoint index={1} emoji="\uD83E\uDDE0" text="La IA analiza datos y toma decisiones por vos" />
            <BulletPoint index={2} emoji="\uD83D\uDCB0" text="Ahorr\u00e1 +10 horas por semana y enfocate en vender" />
          </AbsoluteFill>
          <AbsoluteFill style={{justifyContent: "flex-end", alignItems: "center", paddingBottom: 40}}>
            <Sequence from={120} durationInFrames={300}>
              <MorphingText words={["M\u00e1s r\u00e1pido", "M\u00e1s inteligente", "M\u00e1s rentable"]} holdDuration={50} morphDuration={15} fontSize={36} color={`${YELLOW_NEON}88`} accentColor={ACCENT_PURPLE} />
            </Sequence>
          </AbsoluteFill>
        </SafeArea>
      </Sequence>
      <Sequence from={600} durationInFrames={60}><FadeTransition /></Sequence>
      <Sequence from={660} durationInFrames={240}>
        <SafeArea paddingHorizontal={60} paddingVertical={200}>
          <AbsoluteFill style={{flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 40}}>
            <Sequence from={0} durationInFrames={240}>
              <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 8}}>
                <CountdownTimer startFrom={240} fontSize={90} color={YELLOW_NEON} accentColor={ACCENT_PURPLE} showLabel label="ACCESO POR" />
              </div>
            </Sequence>
            <Sequence from={15} durationInFrames={225}>
              <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 24, marginTop: 60}}>
                <TypewriterText text="Descarg\u00e1 la gu\u00eda gratuita \u2192 link en bio" fontSize={40} fontFamily="'Inter', sans-serif" fontWeight={700} color="#ffffff" cursorColor={YELLOW_NEON} typingSpeed={2} startDelay={10} />
                <Sequence from={80}>
                  <AnimatedTitle text="Disponible por tiempo limitado" fontSize={32} fontWeight={600} color={YELLOW_NEON} enterAnimation="slideUp" enterDuration={15} holdDuration={200} exitDuration={0} />
                </Sequence>
              </div>
            </Sequence>
          </AbsoluteFill>
        </SafeArea>
      </Sequence>
      <ProgressBar color={YELLOW_NEON} height={4} position="bottom" />
    </AbsoluteFill>
  );
};
