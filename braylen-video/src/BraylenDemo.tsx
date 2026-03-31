import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";

// ── Brand tokens ────────────────────────────────────────────────────────────
const COLORS = {
  bg: "#08090d",
  bgCard: "#111318",
  accent: "#4f8fff",
  accentBright: "#6ea8ff",
  accentDim: "rgba(79,143,255,0.08)",
  accentGlow: "rgba(79,143,255,0.22)",
  white: "#edeef1",
  text: "#c8cad0",
  muted: "#6e7179",
  border: "rgba(255,255,255,0.07)",
};

const FONT_DISPLAY = "'Outfit', 'Segoe UI', sans-serif";
const FONT_BODY = "'Plus Jakarta Sans', 'Segoe UI', sans-serif";

// ── Scene timing (frames @ 30fps) ──────────────────────────────────────────
// Scene 1 – Intro          0   → 180  (6s)
// Scene 2 – Web Design    180  → 360  (6s)
// Scene 3 – Redesigns     360  → 540  (6s)
// Scene 4 – Maintenance   540  → 690  (5s)
// Scene 5 – CTA           690  → 750  (2s)
export const SCENE = {
  intro:       { start: 0,   duration: 180 },
  design:      { start: 180, duration: 180 },
  redesign:    { start: 360, duration: 180 },
  maintenance: { start: 540, duration: 150 },
  cta:         { start: 690, duration: 60  },
};

// ── Helpers ─────────────────────────────────────────────────────────────────
function useSpring(frame: number, delay = 0, fps = 30) {
  return spring({ frame: frame - delay, fps, config: { damping: 18, mass: 0.8 } });
}

function fadeUp(frame: number, delay = 0, duration = 20) {
  const f = Math.max(0, frame - delay);
  return {
    opacity: interpolate(f, [0, duration], [0, 1], { extrapolateRight: "clamp" }),
    transform: `translateY(${interpolate(f, [0, duration], [28, 0], { extrapolateRight: "clamp" })}px)`,
  };
}

function fadeIn(frame: number, delay = 0, duration = 18) {
  const f = Math.max(0, frame - delay);
  return {
    opacity: interpolate(f, [0, duration], [0, 1], { extrapolateRight: "clamp" }),
  };
}

// Radial glow blob
const Glow: React.FC<{ x: string; y: string; size?: number; opacity?: number }> = ({
  x, y, size = 700, opacity = 0.14,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: size,
      height: size,
      borderRadius: "50%",
      background: `radial-gradient(circle, rgba(79,143,255,${opacity}), transparent 65%)`,
      transform: "translate(-50%, -50%)",
      pointerEvents: "none",
    }}
  />
);

// Accent check-pill for feature list
const Feature: React.FC<{ text: string; delay: number; frame: number }> = ({ text, delay, frame }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 14, ...fadeUp(frame, delay, 16) }}>
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: 8,
        background: COLORS.accentDim,
        border: `1px solid rgba(79,143,255,0.18)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        color: COLORS.accent,
        fontWeight: 800,
        flexShrink: 0,
      }}
    >
      ✓
    </div>
    <span style={{ fontFamily: FONT_BODY, fontSize: 28, color: COLORS.text }}>{text}</span>
  </div>
);

// Price badge
const PriceBadge: React.FC<{ price: string; label: string; frame: number; delay?: number }> = ({
  price,
  label,
  frame,
  delay = 0,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 12,
      background: COLORS.accentDim,
      border: `1px solid rgba(79,143,255,0.15)`,
      borderRadius: 999,
      padding: "10px 26px",
      ...fadeIn(frame, delay, 18),
    }}
  >
    <span
      style={{
        fontFamily: FONT_DISPLAY,
        fontWeight: 800,
        fontSize: 32,
        color: COLORS.accentBright,
      }}
    >
      {price}
    </span>
    <span style={{ fontFamily: FONT_BODY, fontSize: 22, color: COLORS.muted }}>{label}</span>
  </div>
);

// Service icon circle
const ServiceIcon: React.FC<{ emoji: string; frame: number }> = ({ emoji, frame }) => {
  const s = useSpring(frame, 0);
  return (
    <div
      style={{
        width: 96,
        height: 96,
        borderRadius: 28,
        background: COLORS.accentDim,
        border: `1px solid rgba(79,143,255,0.18)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 44,
        transform: `scale(${s})`,
        marginBottom: 28,
      }}
    >
      {emoji}
    </div>
  );
};

// ── Scene 1: Intro ───────────────────────────────────────────────────────────
const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Subtle animated blue line under logo
  const lineW = interpolate(frame, [20, 60], [0, 220], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ background: COLORS.bg, overflow: "hidden" }}>
      <Glow x="50%" y="40%" size={900} opacity={0.12} />
      <Glow x="80%" y="80%" size={400} opacity={0.07} />

      {/* Center content */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
        }}
      >
        {/* Logo */}
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 800,
            fontSize: 120,
            letterSpacing: "-0.04em",
            color: COLORS.white,
            lineHeight: 1,
            ...fadeUp(frame, 5, 22),
          }}
        >
          Braylen<span style={{ color: COLORS.accent }}>.</span>Digital
        </div>

        {/* Animated underline */}
        <div
          style={{
            height: 4,
            width: lineW,
            background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.accentBright})`,
            borderRadius: 99,
            marginTop: 16,
            marginBottom: 36,
          }}
        />

        {/* Tagline */}
        <div
          style={{
            fontFamily: FONT_BODY,
            fontSize: 34,
            color: COLORS.muted,
            letterSpacing: "0.01em",
            ...fadeUp(frame, 28, 22),
          }}
        >
          Modern websites for local businesses.
        </div>

        {/* Location pill */}
        <div
          style={{
            marginTop: 36,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: COLORS.accentDim,
            border: `1px solid rgba(79,143,255,0.15)`,
            borderRadius: 999,
            padding: "10px 28px",
            ...fadeIn(frame, 48, 20),
          }}
        >
          <span style={{ fontSize: 22 }}>📍</span>
          <span
            style={{
              fontFamily: FONT_BODY,
              fontSize: 22,
              color: COLORS.text,
              fontWeight: 600,
            }}
          >
            Indianapolis, IN
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Reusable service scene layout ────────────────────────────────────────────
interface ServiceSceneProps {
  eyebrow: string;
  title: string;
  description: string;
  price: string;
  priceLabel: string;
  features: string[];
  icon: string;
  accentRight?: boolean;
}

const ServiceScene: React.FC<ServiceSceneProps> = ({
  eyebrow,
  title,
  description,
  price,
  priceLabel,
  features,
  icon,
  accentRight = false,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: COLORS.bg, overflow: "hidden" }}>
      <Glow x={accentRight ? "75%" : "30%"} y="35%" size={800} opacity={0.1} />
      <Glow x={accentRight ? "15%" : "85%"} y="75%" size={350} opacity={0.06} />

      {/* Subtle top border line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${COLORS.accent}, transparent)`,
          opacity: 0.4,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          padding: "0 160px",
          gap: 100,
        }}
      >
        {/* Left: text */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 0 }}>
          <ServiceIcon emoji={icon} frame={frame} />

          {/* Eyebrow */}
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: COLORS.accent,
              marginBottom: 12,
              ...fadeIn(frame, 6, 14),
            }}
          >
            {eyebrow}
          </div>

          {/* Title */}
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 72,
              fontWeight: 800,
              color: COLORS.white,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              marginBottom: 20,
              ...fadeUp(frame, 8, 20),
            }}
          >
            {title}
          </div>

          {/* Description */}
          <div
            style={{
              fontFamily: FONT_BODY,
              fontSize: 26,
              color: COLORS.muted,
              lineHeight: 1.65,
              maxWidth: 620,
              marginBottom: 28,
              ...fadeUp(frame, 14, 20),
            }}
          >
            {description}
          </div>

          {/* Price */}
          <div style={{ marginBottom: 32 }}>
            <PriceBadge price={price} label={priceLabel} frame={frame} delay={22} />
          </div>
        </div>

        {/* Right: features card */}
        <div
          style={{
            width: 560,
            background: COLORS.bgCard,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 28,
            padding: "48px 52px",
            display: "flex",
            flexDirection: "column",
            gap: 22,
            ...fadeUp(frame, 16, 22),
          }}
        >
          <div
            style={{
              fontFamily: FONT_DISPLAY,
              fontSize: 22,
              fontWeight: 700,
              color: COLORS.white,
              marginBottom: 8,
            }}
          >
            What's included
          </div>
          {features.map((f, i) => (
            <Feature key={f} text={f} delay={22 + i * 7} frame={frame} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 5: CTA ─────────────────────────────────────────────────────────────
const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();

  const pulse = interpolate(
    Math.sin((frame / 8) * Math.PI),
    [-1, 1],
    [0.95, 1.05]
  );

  return (
    <AbsoluteFill style={{ background: COLORS.bg, overflow: "hidden" }}>
      <Glow x="50%" y="50%" size={1100} opacity={0.15} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
          textAlign: "center",
        }}
      >
        {/* Ready line */}
        <div
          style={{
            fontFamily: FONT_BODY,
            fontSize: 28,
            color: COLORS.muted,
            marginBottom: 20,
            ...fadeUp(frame, 0, 18),
          }}
        >
          Ready to grow online?
        </div>

        {/* Main CTA */}
        <div
          style={{
            fontFamily: FONT_DISPLAY,
            fontWeight: 800,
            fontSize: 96,
            color: COLORS.white,
            letterSpacing: "-0.04em",
            lineHeight: 1.1,
            marginBottom: 40,
            ...fadeUp(frame, 6, 18),
          }}
        >
          Get a{" "}
          <span
            style={{
              color: COLORS.accent,
              display: "inline-block",
              transform: `scale(${pulse})`,
            }}
          >
            Free Quote
          </span>
        </div>

        {/* URL pill */}
        <div
          style={{
            background: COLORS.accent,
            borderRadius: 999,
            padding: "18px 52px",
            fontFamily: FONT_DISPLAY,
            fontWeight: 700,
            fontSize: 36,
            color: "#08090d",
            letterSpacing: "-0.01em",
            ...fadeUp(frame, 12, 18),
          }}
        >
          braylendesigns.store
        </div>

        {/* Sub-line */}
        <div
          style={{
            fontFamily: FONT_BODY,
            fontSize: 22,
            color: COLORS.muted,
            marginTop: 28,
            ...fadeIn(frame, 18, 16),
          }}
        >
          Web Design · Redesigns · Monthly Maintenance
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Transition flash ─────────────────────────────────────────────────────────
const TransitionFlash: React.FC<{ totalDuration: number }> = ({ totalDuration }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 6, 10, totalDuration - 10, totalDuration - 4, totalDuration], [0, 0.35, 0, 0, 0.35, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill
      style={{
        background: COLORS.accent,
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};

// ── Root composition ─────────────────────────────────────────────────────────
export const BraylenDemo: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: COLORS.bg, fontFamily: FONT_BODY }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;600;700;800;900&display=swap');
      `}</style>

      {/* Scene 1 – Intro */}
      <Sequence from={SCENE.intro.start} durationInFrames={SCENE.intro.duration}>
        <IntroScene />
        <TransitionFlash totalDuration={SCENE.intro.duration} />
      </Sequence>

      {/* Scene 2 – Website Design */}
      <Sequence from={SCENE.design.start} durationInFrames={SCENE.design.duration}>
        <ServiceScene
          eyebrow="Service 01"
          title="Website Design"
          description="Custom sites built from scratch — fast, mobile-responsive, and optimized to convert visitors into customers."
          price="$500 – $3,000"
          priceLabel="depending on scope"
          icon="🎨"
          features={[
            "Custom design matched to your brand",
            "Mobile-responsive on all devices",
            "SEO optimized from day one",
            "Google Analytics setup",
            "Fast loading (under 3 seconds)",
          ]}
        />
        <TransitionFlash totalDuration={SCENE.design.duration} />
      </Sequence>

      {/* Scene 3 – Website Redesigns */}
      <Sequence from={SCENE.redesign.start} durationInFrames={SCENE.redesign.duration}>
        <ServiceScene
          eyebrow="Service 02"
          title="Website Redesigns"
          description="Outdated site? We rebuild it from the ground up — modern design, faster speeds, better rankings."
          price="$800 – $2,500"
          priceLabel="depending on scope"
          icon="⚡"
          accentRight
          features={[
            "Full redesign with modern aesthetics",
            "3–5× faster load times",
            "Improved mobile experience",
            "Better SEO structure & meta tags",
            "New contact forms & CTAs",
          ]}
        />
        <TransitionFlash totalDuration={SCENE.redesign.duration} />
      </Sequence>

      {/* Scene 4 – Monthly Maintenance */}
      <Sequence from={SCENE.maintenance.start} durationInFrames={SCENE.maintenance.duration}>
        <ServiceScene
          eyebrow="Service 03"
          title="Monthly Maintenance"
          description="Keep your site fast, secure, and up to date — we handle everything so you can focus on your business."
          price="$50 – $150"
          priceLabel="per month"
          icon="🛡️"
          features={[
            "Monthly content updates",
            "Security monitoring & backups",
            "Uptime monitoring (99.9% guaranteed)",
            "Monthly performance report",
            "Priority email support",
          ]}
        />
        <TransitionFlash totalDuration={SCENE.maintenance.duration} />
      </Sequence>

      {/* Scene 5 – CTA */}
      <Sequence from={SCENE.cta.start} durationInFrames={SCENE.cta.duration}>
        <CTAScene />
      </Sequence>
    </AbsoluteFill>
  );
};
