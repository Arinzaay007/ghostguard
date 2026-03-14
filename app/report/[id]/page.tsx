"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Shield } from "lucide-react";
import VerdictCard from "@/components/VerdictCard";
import Link from "next/link";

export default function ReportPage() {
  const { id } = useParams();
  const [scan, setScan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(`/api/report?id=${id}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setScan(data);
      } catch (err: any) {
        setError(err.message ?? "Report not found");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchReport();
  }, [id]);

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
          <Link href="/timeline" className="hover:text-white transition-colors">Threat Timeline</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <span className="text-xs font-mono text-violet-400 uppercase tracking-widest">Scan Report</span>
          <h1 className="text-3xl font-bold mt-2 mb-3 tracking-tight">Report details</h1>
          <p className="text-zinc-400 text-sm font-mono break-all">ID: {id}</p>
        </div>

        {loading && (
          <div className="text-center py-12 text-zinc-600 font-mono text-sm">
            Loading report...
          </div>
        )}

        {error && (
          <div className="p-4 rounded-lg border border-red-500/20 bg-red-500/10 text-red-400 text-sm font-mono">
            {error}
          </div>
        )}

        {scan && (
          <div className="space-y-6">
            <div className="p-4 rounded-lg border border-zinc-800 bg-zinc-900">
              <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">
                {scan.type === "paste" ? "Scanned code" : "Package scanned"}
              </p>
              <pre className="text-sm text-zinc-300 font-mono whitespace-pre-wrap break-all">
                {scan.input}
              </pre>
            </div>
            <VerdictCard
              verdict={scan.verdict}
              confidence={scan.confidence}
              flags={scan.flags}
              reasons={scan.reasons}
              safe_version={scan.safe_version}
              id={scan.id}
            />
          </div>
        )}
      </div>
    </main>
  );
}