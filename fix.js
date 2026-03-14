const fs = require('fs');

const verdictCard = `"use client";

import { ShieldAlert, ShieldCheck, ShieldQuestion, Copy, ExternalLink } from "lucide-react";

interface VerdictCardProps {
  verdict: "SAFE" | "SUSPICIOUS" | "MALICIOUS";
  confidence: number;
  flags: string[];
  reasons: string[];
  safe_version?: string | null;
  id?: string;
}

const verdictConfig = {
  SAFE: { label: "// SAFE", icon: ShieldCheck, color: "#00ff41", glow: "0 0 10px #00ff41, 0 0 20px #00ff4144", border: "#00ff4144", bg: "#00ff4108" },
  SUSPICIOUS: { label: "// SUSPICIOUS", icon: ShieldQuestion, color: "#ffaa00", glow: "0 0 10px #ffaa00, 0 0 20px #ffaa0044", border: "#ffaa0044", bg: "#ffaa0008" },
  MALICIOUS: { label: "// MALICIOUS", icon: ShieldAlert, color: "#ff0040", glow: "0 0 10px #ff0040, 0 0 20px #ff004044", border: "#ff004044", bg: "#ff004008" },
};

export default function VerdictCard({ verdict, confidence, flags, reasons, safe_version, id }: VerdictCardProps) {
  const config = verdictConfig[verdict];
  const Icon = config.icon;
  const shareUrl = id && typeof window !== "undefined" ? \`\${window.location.origin}/report/\${id}\` : null;
  const copyLink = () => { if (shareUrl) navigator.clipboard.writeText(shareUrl); };

  return (
    <div className="rounded p-6 space-y-6 font-mono" style={{ background: config.bg, border: \`1px solid \${config.border}\`, boxShadow: config.glow }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className="w-6 h-6" style={{ color: config.color, filter: \`drop-shadow(0 0 6px \${config.color})\` }} />
          <span className="text-xl font-bold tracking-widest" style={{ color: config.color, textShadow: config.glow }}>{config.label}</span>
          <span className="text-xs px-2 py-1 rounded border" style={{ color: config.color, borderColor: config.border }}>{confidence}% confidence</span>
        </div>
        {shareUrl && (
          <div className="flex gap-2">
            <button onClick={copyLink} className="flex items-center gap-1 text-xs px-3 py-1 rounded border border-green-900 text-green-600 hover:text-green-400 hover:border-green-400 transition-all">
              <Copy className="w-3 h-3" /> copy link
            </button>
            <a href={shareUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs px-3 py-1 rounded border border-green-900 text-green-600 hover:text-green-400 hover:border-green-400 transition-all">
              <ExternalLink className="w-3 h-3" /> view report
            </a>
          </div>
        )}
      </div>
      {flags.length > 0 && (
        <div>
          <p className="text-xs text-green-700 uppercase tracking-widest mb-2">&gt; flags_detected[]</p>
          <div className="flex flex-wrap gap-2">
            {flags.map((flag, i) => (
              <span key={i} className="text-xs px-2 py-1 rounded border" style={{ color: config.color, borderColor: config.border, background: config.bg }}>{flag}</span>
            ))}
          </div>
        </div>
      )}
      {reasons.length > 0 && (
        <div>
          <p className="text-xs text-green-700 uppercase tracking-widest mb-2">&gt; analysis[]</p>
          <ul className="space-y-2">
            {reasons.map((reason, i) => (
              <li key={i} className="text-sm text-green-300 flex gap-2"><span className="text-green-700 mt-0.5">→</span>{reason}</li>
            ))}
          </ul>
        </div>
      )}
      {safe_version && (
        <div className="p-3 rounded border" style={{ borderColor: "#00ff4133", background: "#00ff4108" }}>
          <p className="text-xs text-green-700 uppercase tracking-widest mb-1">&gt; recommendation</p>
          <p className="text-sm text-green-300">{safe_version}</p>
        </div>
      )}
    </div>
  );
}`;

fs.writeFileSync('components/VerdictCard.tsx', verdictCard);
console.log('VerdictCard done');