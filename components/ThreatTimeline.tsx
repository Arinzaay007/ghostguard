import { ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";

interface Scan {
  id: string;
  type: string;
  input: string;
  verdict: "SAFE" | "SUSPICIOUS" | "MALICIOUS";
  confidence: number;
  created_at: string;
}

interface ThreatTimelineProps {
  scans: Scan[];
}

const verdictConfig = {
  SAFE: {
    icon: ShieldCheck,
    color: "#00ff41",
    border: "#00ff4133",
    bg: "#00ff4108",
    glow: "0 0 8px #00ff4133",
  },
  SUSPICIOUS: {
    icon: ShieldQuestion,
    color: "#ffaa00",
    border: "#ffaa0033",
    bg: "#ffaa0008",
    glow: "0 0 8px #ffaa0033",
  },
  MALICIOUS: {
    icon: ShieldAlert,
    color: "#ff0040",
    border: "#ff004033",
    bg: "#ff004008",
    glow: "0 0 8px #ff004033",
  },
};

export default function ThreatTimeline({ scans }: ThreatTimelineProps) {
  if (scans.length === 0) {
    return (
      <div className="text-center py-12 text-green-900 font-mono text-sm">
        &gt; no scans found. run a scan to see results here.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {scans.map((scan) => {
        const config = verdictConfig[scan.verdict];
        const Icon = config.icon;
        const date = new Date(scan.created_at).toLocaleString();
        const preview = scan.input.length > 60
          ? scan.input.slice(0, 60) + "..."
          : scan.input;

        return (
          
          <a
            key={scan.id}
            href={`/report/${scan.id}`}
            className="flex items-start gap-4 p-4 rounded block transition-all hover:scale-[1.01]"
            style={{
              background: config.bg,
              border: `1px solid ${config.border}`,
              boxShadow: config.glow,
            }}
          >
            <div className="mt-1">
              <Icon className="w-4 h-4" style={{ color: config.color, filter: `drop-shadow(0 0 4px ${config.color})` }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span
                  className="text-xs px-2 py-0.5 rounded border font-mono font-bold"
                  style={{ color: config.color, borderColor: config.border }}
                >
                  {scan.verdict}
                </span>
                <span className="text-xs px-2 py-0.5 rounded border border-green-900 text-green-700 font-mono">
                  {scan.type === "paste" ? "paste_shield" : "drift_detector"}
                </span>
                <span className="text-xs text-green-900 font-mono ml-auto">{date}</span>
              </div>
              <p className="text-sm text-green-700 font-mono truncate">&gt; {preview}</p>
            </div>
          </a>
        );
      })}
    </div>
  );
}