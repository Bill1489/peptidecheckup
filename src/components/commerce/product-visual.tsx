import * as React from "react";
import type { Product, ProductFormat, ProductTone } from "@/data/products/types";
import { cn } from "@/lib/utils";

/**
 * Flat technical product illustration. Every product renders from the same
 * system so the catalogue reads as one range: square viewBox, 1px ink lines,
 * a single fill tone, a mono label block with the compound code.
 */

const TONES: Record<ProductTone, { fill: string; deep: string; text: string; label: string }> = {
  ink: { fill: "#0b0b0c", deep: "#000000", text: "#ffffff", label: "#ffffff" },
  cobalt: { fill: "#1d3bff", deep: "#1428c4", text: "#ffffff", label: "#ffffff" },
  grey: { fill: "#e7e5e0", deep: "#cfcdc7", text: "#0b0b0c", label: "#ffffff" },
  orange: { fill: "#ff4a1c", deep: "#d93a11", text: "#ffffff", label: "#ffffff" },
  white: { fill: "#ffffff", deep: "#e7e5e0", text: "#0b0b0c", label: "#ffffff" },
};

export interface ProductVisualProps {
  product?: Product;
  format?: ProductFormat;
  tone?: ProductTone;
  /** Big code printed on the label, e.g. "BPC-157". */
  code?: string;
  /** Small line under the code, e.g. "5 mg". */
  meta?: string;
  batch?: string;
  className?: string;
  /** Show the light grid background. */
  grid?: boolean;
  /** Renders a second unit behind the first (for kits / multipacks). */
  stacked?: boolean;
}

export function ProductVisual({
  product,
  format,
  tone,
  code,
  meta,
  batch,
  className,
  grid = true,
  stacked,
}: ProductVisualProps) {
  const f = format ?? product?.visual.format ?? "vial";
  const t = TONES[tone ?? product?.visual.tone ?? "ink"];
  const codeText = (code ?? product?.visual.accentText ?? product?.name ?? "").toUpperCase();
  const metaText = meta ?? product?.variants.find((v) => v.id === product.defaultVariantId)?.label ?? "";
  const batchText = batch ?? product?.coa?.batch ?? "";

  return (
    <svg
      viewBox="0 0 400 400"
      role="img"
      aria-label={product ? `${product.name} — product illustration` : "Product illustration"}
      className={cn("block h-full w-full", className)}
    >
      <rect width="400" height="400" fill="#f4f3f0" />
      {grid && (
        <g stroke="#e7e5e0" strokeWidth="1">
          {Array.from({ length: 7 }, (_, i) => (
            <line key={`v${i}`} x1={50 * (i + 1)} y1="0" x2={50 * (i + 1)} y2="400" />
          ))}
          {Array.from({ length: 7 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={50 * (i + 1)} x2="400" y2={50 * (i + 1)} />
          ))}
        </g>
      )}
      {stacked && (
        <g opacity="0.35" transform="translate(28,-22)">
          <Shape format={f} t={t} code={codeText} meta={metaText} batch={batchText} muted />
        </g>
      )}
      <Shape format={f} t={t} code={codeText} meta={metaText} batch={batchText} />
      {/* baseline */}
      <line x1="60" y1="352" x2="340" y2="352" stroke="#0b0b0c" strokeWidth="1" />
    </svg>
  );
}

function Label({
  x,
  y,
  w,
  h,
  code,
  meta,
  batch,
  t,
  compact,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  code: string;
  meta: string;
  batch: string;
  t: (typeof TONES)[ProductTone];
  compact?: boolean;
}) {
  const codeSize = code.length > 9 ? 16 : code.length > 6 ? 20 : 24;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={t.label} stroke="#0b0b0c" strokeWidth="1" />
      <text
        x={x + 12}
        y={y + (compact ? 24 : 30)}
        fontFamily="var(--font-plex-mono), ui-monospace, monospace"
        fontSize={compact ? 12 : codeSize}
        fontWeight="600"
        fill="#0b0b0c"
        letterSpacing="-0.5"
      >
        {code}
      </text>
      {!compact && (
        <>
          <line x1={x + 12} y1={y + 42} x2={x + w - 12} y2={y + 42} stroke="#0b0b0c" strokeWidth="1" />
          <text x={x + 12} y={y + 60} fontFamily="var(--font-plex-mono), ui-monospace, monospace" fontSize="11" fill="#0b0b0c">
            {meta}
          </text>
          {batch && (
            <text
              x={x + 12}
              y={y + h - 12}
              fontFamily="var(--font-plex-mono), ui-monospace, monospace"
              fontSize="8.5"
              fill="#6b6a66"
              letterSpacing="0.8"
            >
              {`LOT ${batch}`}
            </text>
          )}
        </>
      )}
    </g>
  );
}

function Shape({
  format,
  t,
  code,
  meta,
  batch,
  muted,
}: {
  format: ProductFormat;
  t: (typeof TONES)[ProductTone];
  code: string;
  meta: string;
  batch: string;
  muted?: boolean;
}) {
  const stroke = muted ? "#9a988f" : "#0b0b0c";
  switch (format) {
    case "vial":
      return (
        <g>
          {/* cap */}
          <rect x="164" y="64" width="72" height="26" fill={t.deep} stroke={stroke} />
          <rect x="172" y="90" width="56" height="14" fill="#0b0b0c" stroke={stroke} />
          {/* neck + body */}
          <rect x="176" y="104" width="48" height="22" fill="#ffffff" stroke={stroke} />
          <rect x="140" y="126" width="120" height="226" fill={t.fill} stroke={stroke} />
          {/* lyophilised cake */}
          <rect x="141" y="300" width="118" height="51" fill="#ffffff" opacity={t.fill === "#ffffff" ? 1 : 0.92} />
          <Label x={150} y={150} w={100} h={118} code={code} meta={meta} batch={batch} t={t} />
        </g>
      );
    case "pen":
      return (
        <g>
          <rect x="176" y="48" width="48" height="304" fill={t.fill} stroke={stroke} />
          <rect x="176" y="48" width="48" height="34" fill="#0b0b0c" stroke={stroke} />
          <rect x="186" y="82" width="28" height="70" fill="#ffffff" stroke={stroke} />
          <line x1="192" y1="96" x2="208" y2="96" stroke="#0b0b0c" />
          <line x1="192" y1="110" x2="208" y2="110" stroke="#0b0b0c" />
          <line x1="192" y1="124" x2="208" y2="124" stroke="#0b0b0c" />
          <rect x="176" y="318" width="48" height="34" fill={t.deep} stroke={stroke} />
          <g transform="translate(0,0)">
            <rect x="184" y="166" width="32" height="130" fill={t.label} stroke={stroke} />
            <text
              x="200"
              y="180"
              fontFamily="var(--font-plex-mono), ui-monospace, monospace"
              fontSize="11"
              fontWeight="600"
              fill="#0b0b0c"
              textAnchor="middle"
              transform="rotate(90 200 180)"
            >
              {code}
            </text>
          </g>
          <text
            x="200"
            y="372"
            fontFamily="var(--font-plex-mono), ui-monospace, monospace"
            fontSize="10"
            fill="#6b6a66"
            textAnchor="middle"
            letterSpacing="1"
          >
            {meta.toUpperCase()}
          </text>
        </g>
      );
    case "jar":
      return (
        <g>
          <rect x="120" y="118" width="160" height="34" fill="#0b0b0c" stroke={stroke} />
          <rect x="124" y="152" width="152" height="200" fill={t.fill} stroke={stroke} />
          <Label x={140} y={176} w={120} h={118} code={code} meta={meta} batch={batch} t={t} />
        </g>
      );
    case "box":
      return (
        <g>
          <rect x="108" y="96" width="184" height="256" fill={t.fill} stroke={stroke} />
          <rect x="108" y="96" width="184" height="24" fill={t.deep} stroke={stroke} />
          <Label x={124} y={140} w={152} h={130} code={code} meta={meta} batch={batch} t={t} />
          <line x1="124" y1="300" x2="276" y2="300" stroke={t.text} strokeOpacity="0.5" />
          <line x1="124" y1="312" x2="230" y2="312" stroke={t.text} strokeOpacity="0.5" />
        </g>
      );
    case "dropper":
      return (
        <g>
          <rect x="188" y="52" width="24" height="26" fill="#0b0b0c" stroke={stroke} />
          <rect x="176" y="78" width="48" height="30" fill="#0b0b0c" stroke={stroke} />
          <rect x="196" y="108" width="8" height="120" fill="#ffffff" stroke={stroke} />
          <rect x="144" y="132" width="112" height="220" fill={t.fill} stroke={stroke} />
          <Label x={156} y={200} w={88} h={104} code={code} meta={meta} batch={batch} t={t} />
        </g>
      );
    case "tube":
      return (
        <g>
          <rect x="172" y="60" width="56" height="30" fill="#0b0b0c" stroke={stroke} />
          <polygon points="150,90 250,90 240,352 160,352" fill={t.fill} stroke={stroke} />
          <Label x={160} y={140} w={80} h={104} code={code} meta={meta} batch={batch} t={t} />
        </g>
      );
    case "pouch":
      return (
        <g>
          <rect x="112" y="72" width="176" height="280" fill={t.fill} stroke={stroke} />
          <rect x="112" y="72" width="176" height="28" fill={t.deep} stroke={stroke} />
          <line x1="140" y1="86" x2="260" y2="86" stroke={t.text} strokeDasharray="4 4" />
          <Label x={128} y={128} w={144} h={130} code={code} meta={meta} batch={batch} t={t} />
        </g>
      );
    default:
      return null;
  }
}
