import React from "react";
import {AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig, interpolate, spring} from "remotion";
import {AnimatedTitle} from "../../components/text/AnimatedTitle";
import {TypewriterText} from "../../components/text/TypewriterText";
import {GradientBackground} from "../../components/backgrounds/GradientBackground";
import {GridPattern} from "../../components/backgrounds/GridPattern";
import {GlassmorphismCard} from "../../components/backgrounds/GlassmorphismCard";
import {ProgressBar} from "../../components/overlays/ProgressBar";
import {SafeArea} from "../../components/layout/SafeArea";
import {loadDefaultFonts} from "../../presets/fonts";
import {META_AD_COLORS, type MetaAdColorScheme} from "../../presets/meta-compliance";

interface Benefit { icon: string; title: string; subtitle: string; }
export interface InsuranceAdProps { hook?: string; productName?: string; productDescription?: string; benefits?: Benefit[]; ctaText?: string; ctaSubtext?: string; disclaimer?: string; colorScheme?: MetaAdColorScheme; accentColor?: string; }

const BenefitItem: React.FC<{benefit: Benefit; index: number; accentColor: string}> = ({benefit, index, accentColor}) => {
  const frame = useCurrentFrame(); const {fps} = useVideoConfig();
  const progress = spring({fps, frame: Math.max(0, frame - index * 35), config: {damping: 14, stiffness: 100}});
  return (
    <div style={{display: "flex", alignItems: "center", gap: 20, opacity: interpolate(progress, [0, 1], [0, 1]), transform: `translateY(${interpolate(progress, [0, 1], [50, 0])}px)`, marginBottom: 28}}>
      <div style={{width: 68, height: 68, borderRadius: 16, background: `linear-gradient(135deg, ${accentColor}22, ${accentColor}44)`, border: `1.5px solid ${accentColor}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, flexShrink: 0}}>{benefit.icon}</div>
      <div><div style={{fontSize: 30, fontFamily: "'Inter', sans-serif", fontWeight: 700, color: "#ffffff", lineHeight: 1.2}}>{benefit.title}</div><div style={{fontSize: 21, fontFamily: "'Inter', sans-serif", fontWeight: 400, color: "#94a3b8", marginTop: 4}}>{benefit.subtitle}</div></div>
    </div>
  );
};

const DisclaimerText: React.FC<{text: string}> = ({text}) => {
  const frame = useCurrentFrame();
  return <div style={{position: "absolute", bottom: 40, left: 60, right: 60, opacity: interpolate(frame, [0, 20], [0, 0.6], {extrapolateRight: "clamp"}), fontSize: 15, fontFamily: "'Inter', sans-serif", fontWeight: 400, color: "#94a3b8", textAlign: "center", lineHeight: 1.4}}>{text}</div>;
};

export const InsuranceAd: React.FC<InsuranceAdProps> = ({
  hook = "La industria de seguros de vida crece un 8% cada a\u00f1o",
  productName = "Seguro de Vida",
  productDescription = "Protecci\u00f3n financiera para tu familia con beneficios que se adaptan a cada etapa de la vida",
  benefits = [{icon: "\uD83D\uDEE1\uFE0F", title: "Protecci\u00f3n familiar", subtitle: "Cobertura desde el d\u00eda 1"}, {icon: "\uD83D\uDCC8", title: "Valor en efectivo", subtitle: "Componente de ahorro incluido"}, {icon: "\u2705", title: "Flexibilidad", subtitle: "Opciones para cada presupuesto"}],
  ctaText = "M\u00e1s informaci\u00f3n \u2192 link en bio",
  ctaSubtext = "Agenda una consulta gratuita con un agente",
  disclaimer = "Consulta con un profesional financiero autorizado. Los beneficios dependen de la p\u00f3liza. Los resultados individuales pueden variar.",
  colorScheme = "dark", accentColor,
}) => {
  loadDefaultFonts();
  const colors = META_AD_COLORS[colorScheme]; const accent = accentColor || colors.accent;
  return (
    <AbsoluteFill>
      <GradientBackground colors={[...colors.bg]} angle={160} animateAngle animateSpeed={0.15} />
      <GridPattern type="dots" spacing={60} size={1} color={`${accent}0F`} animate animateSpeed={0.2} />
      <Sequence from={0} durationInFrames={90}><SafeArea paddingHorizontal={60} paddingVertical={250}><AbsoluteFill style={{justifyContent: "center", alignItems: "center"}}><AnimatedTitle text={hook} fontSize={52} fontWeight={900} color={colors.text} enterAnimation="scale" exitAnimation="slideLeft" enterDuration={15} holdDuration={55} exitDuration={12} lineHeight={1.2} /></AbsoluteFill></SafeArea></Sequence>
      <Sequence from={90} durationInFrames={180}><SafeArea paddingHorizontal={60} paddingVertical={180}><AbsoluteFill style={{flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 30}}><AnimatedTitle text={productName} fontSize={58} fontWeight={900} color={colors.text} enterAnimation="slideUp" exitAnimation="fade" enterDuration={15} holdDuration={140} exitDuration={15} /><Sequence from={20} durationInFrames={160}><GlassmorphismCard accentColor={accent} width={900} height={200} enterDelay={0} bgOpacity={0.1}><div style={{fontSize: 30, fontFamily: "'Inter', sans-serif", fontWeight: 500, color: "#ffffff", textAlign: "center", lineHeight: 1.5, padding: 8}}>{productDescription}</div></GlassmorphismCard></Sequence></AbsoluteFill></SafeArea></Sequence>
      <Sequence from={270} durationInFrames={240}><SafeArea paddingHorizontal={60} paddingVertical={200}><AbsoluteFill style={{flexDirection: "column", justifyContent: "center", paddingLeft: 40, paddingRight: 40}}>{benefits.map((b, i) => <BenefitItem key={i} benefit={b} index={i} accentColor={accent} />)}</AbsoluteFill></SafeArea></Sequence>
      <Sequence from={510} durationInFrames={240}><SafeArea paddingHorizontal={60} paddingVertical={200}><AbsoluteFill style={{flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 30}}><AnimatedTitle text={ctaSubtext} fontSize={44} fontWeight={800} color={colors.text} enterAnimation="scale" enterDuration={15} holdDuration={200} exitDuration={0} lineHeight={1.2} /><Sequence from={20} durationInFrames={220}><TypewriterText text={ctaText} fontSize={30} fontFamily="'Inter', sans-serif" fontWeight={700} color={accent} cursorColor={accent} typingSpeed={2} startDelay={5} /></Sequence></AbsoluteFill><DisclaimerText text={disclaimer} /></SafeArea></Sequence>
      <ProgressBar color={accent} height={4} position="bottom" />
    </AbsoluteFill>
  );
};
