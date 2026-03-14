"use client";

import { useEffect, useState } from "react";
import { Shield, Clock } from "lucide-react";
import ThreatTimeline from "@/components/ThreatTimeline";
import Link from "next/link";

export default function TimelinePage() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const res = await fetch("/api/report");
        const data = await res.json();
        setScans(Array.isArray(data) ? data : []);
      } catch {
        setScans([]);
      } finally {
        setLoading(false);
      }
    };
    fetchScans();
  }, []);

  return (
    <main className="min-h-screen page-enter">
      <nav className="border-b border-green-900 px-6 py-4 flex items-center justify-between bg-black/40 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-400" style={{ filter: "drop-shadow(0 0 6px #00ff41)" }} />
          <span className="font-mono font-bold text-lg tracking-tight text-green-400 glow">GhostGuard</span>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/" className="text-green-700 hover:text-green-400 transition-colors font-mono">Paste Shield</Link>
          <Link href="/drift" className="text-green-700 hover:text-green-400 transition-colors font-mono">Drift Detector</Link>
          <Link href="/timeline" className="text-green-400 glow font-mono">Threat Timeline</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-green-400" />
            <span className="text-xs font-mono text-green-600 uppercase tracking-widest">// threat_timeline.log</span>
          </div>
          <h1 className="text-3xl font-bold mb-3 tracking-tight text-green-400 glow cursor">
            All scans
          </h1>
          <p className="text-green-700 text-sm leading-relaxed font-mono">
            &gt; Every scan run through GhostGuard.<br />
            &gt; Click any entry to view the full report.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-green-800 font-mono text-sm">
            &gt; loading scans...
          </div>
        ) : (
          <ThreatTimeline scans={scans} />
        )}
      </div>
    </main>
  );
}