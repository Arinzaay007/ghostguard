"use client";

import { useEffect, useState } from "react";
import { Shield, Clock } from "lucide-react";
import ThreatTimeline from "@/components/ThreatTimeline";
import Link from "next/link";

export default function TimelinePage() {
  const [scans, setScans] = useState<any[]>([]);
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
    <main className="min-h-screen bg-zinc-950 text-white">
      <nav className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-violet-400" />
          <span className="font-mono font-bold text-lg tracking-tight">GhostGuard</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-zinc-400">
          <Link href="/" className="hover:text-white transition-colors">Paste Shield</Link>
          <Link href="/drift" className="hover:text-white transition-colors">Drift Detector</Link>
          <Link href="/timeline" className="text-white font-medium">Threat Timeline</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-mono text-violet-400 uppercase tracking-widest">Threat Timeline</span>
          </div>
          <h1 className="text-3xl font-bold mb-3 tracking-tight">All scans</h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Every scan run through GhostGuard — click any entry to view the full report.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-zinc-600 font-mono text-sm">
            Loading scans...
          </div>
        ) : (
          <ThreatTimeline scans={scans} />
        )}
      </div>
    </main>
  );
}