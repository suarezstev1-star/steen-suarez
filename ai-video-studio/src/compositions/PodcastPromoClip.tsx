import React from "react";
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, interpolate} from "remotion";
import {GradientBackground} from "../components/backgrounds/GradientBackground";
import {GridPattern} from "../components/backgrounds/GridPattern";
import {WordByWordCaption, CaptionWord} from "../components/text/WordByWordCaption";
import {LowerThird} from "../components/text/LowerThird";
import {AnimatedTitle} from "../components/text/AnimatedTitle";
import {ProgressBar} from "../components/overlays/ProgressBar";
import {SafeArea} from "../components/layout/SafeArea";
import {loadDefaultFonts} from "../presets/fonts";

const ACCENT = "#6366f1"; const ACCENT_ALT = "#a855f7";

export interface PodcastPromoClipProps { audioSrc?: string; title?: string; speakerName?: string; speakerTitle?: string; captionWords?: CaptionWord[]; }

const AudioWaveform: React.FC<{barCount?: number; color?: string; accentColor?: string; width?: number; height?: number}> = ({barCount = 40, color = ACCENT, accentColor = ACCENT_ALT, width = 800, height = 220}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{display: "flex", alignItems: "center", justifyContent: "center", gap: 4, width, height}}>
      {Array.from({length: barCount}).map((_, i) => {
        const phase = i * 0.4 + frame * 0.12;
        const rawHeight = (Math.sin(phase) * 0.4 + Math.sin(phase * 1.7 + i * 0.3) * 0.35 + Math.sin(phase * 0.5 + i * 0.8) * 0.25 + 1) / 2;
        const t = i / (barCount - 1); const isCenter = t > 0.3 && t < 0.7;
        return <div key={i} style={{width: Math.max(6, (width / barCount) - 4), height: interpolate(rawHeight, [0, 1], [12, height * 0.9]), borderRadius: 4, background: isCenter ? `linear-gradient(to top, ${color}, ${accentColor})` : color, opacity: interpolate(rawHeight, [0, 1], [0.4, 1])}} />;
      })}
    </div>
  );
};

const DEFAULT_CAPTIONS: CaptionWord[] = [
  {text: "El", startFrame: 30, endFrame: 45}, {text: "secreto", startFrame: 46, endFrame: 75},
  {text: "para", startFrame: 76, endFrame: 95}, {text: "escalar", startFrame: 96, endFrame: 130},
  {text: "tu", startFrame: 131, endFrame: 145}, {text: "negocio", startFrame: 146, endFrame: 185},
  {text: "es", startFrame: 186, endFrame: 200}, {text: "automatizar", startFrame: 201, endFrame: 260},
];

export const PodcastPromoClip: React.FC<PodcastPromoClipProps> = ({audioSrc = "assets/episodio_podcast.mp3", title = "El secreto para escalar tu agencia", speakerName = "Invitado", speakerTitle = "Experto en Seguros", captionWords = DEFAULT_CAPTIONS}) => {
  loadDefaultFonts();
  return (
    <AbsoluteFill>
      <GradientBackground colors={["#0c0c1d", "#1a1033", "#0c0c1d"]} angle={135} animateAngle animateSpeed={0.2} />
      <GridPattern type="dots" spacing={50} size={1.5} color="rgba(99,102,241,0.08)" animate animateSpeed={0.3} />
      <Audio src={staticFile(audioSrc)} startFrom={750 * 30} endAt={810 * 30} volume={1} />
      <Sequence from={0} durationInFrames={120}>
        <SafeArea paddingHorizontal={60} paddingVertical={60}>
          <AbsoluteFill style={{justifyContent: "flex-start", alignItems: "center", paddingTop: 80}}>
            <div style={{fontSize: 18, fontFamily: "'Inter', sans-serif", fontWeight: 600, color: ACCENT, textTransform: "uppercase", letterSpacing: 4, marginBottom: 16}}>PODCAST</div>
            <AnimatedTitle text={title} fontSize={44} fontWeight={800} color="#ffffff" enterAnimation="slideUp" exitAnimation="fade" enterDuration={18} holdDuration={70} exitDuration={18} />
          </AbsoluteFill>
        </SafeArea>
      </Sequence>
      <AbsoluteFill style={{justifyContent: "center", alignItems: "center"}}>
        <AudioWaveform barCount={40} color={ACCENT} accentColor={ACCENT_ALT} width={800} height={200} />
      </AbsoluteFill>
      <Sequence from={0} durationInFrames={1800}>
        <WordByWordCaption words={captionWords} fontSize={44} fontWeight={800} color="rgba(255,255,255,0.5)" highlightColor="#ffffff" backgroundColor="rgba(0,0,0,0.75)" position="bottom" padding={18} borderRadius={14} />
      </Sequence>
      <Sequence from={60} durationInFrames={210}>
        <LowerThird name={speakerName} title={speakerTitle} accentColor={ACCENT} position="bottomLeft" enterDuration={20} holdDuration={160} exitDuration={20} />
      </Sequence>
      <ProgressBar color={ACCENT} height={4} position="bottom" />
    </AbsoluteFill>
  );
};
