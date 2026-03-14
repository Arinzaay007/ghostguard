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
    <main className="min-h-screen page-enter">
      <nav className="border-b border-green-900 px-6 py-4 flex items-center justify-between bg-black/40 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-400" style={{ filter: "drop-shadow(0 0 6px #00ff41)" }} />
          <span className="font-mono font-bold text-lg tracking-tight text-green-400 glow">GhostGuard</span>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/" className="text-green-700 hover:text-green-400 transition-colors font-mono">Paste Shield</Link>
          <Link href="/drift" className="text-green-700 hover:text-green-400 transition-colors font-mono">Drift Detector</Link>
          <Link href="/timeline" className="text-green-700 hover:text-green-400 transition-colors font-mono">Threat Timeline</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <span className="text-xs font-mono text-green-600 uppercase tracking-widest">// scan_report.log</span>
          <h1 className="text-3xl font-bold mt-2 mb-3 tracking-tight text-green-400 glow cursor">
            Report details
          </h1>
          <p className="text-green-800 text-xs font-mono break-all">&gt; id: {id}</p>
        </div>

        {loading && (
          <div className="text-center py-12 text-green-800 font-mono text-sm">
            &gt; loading report...
          </div>
        )}

        {error && (
          <div className="p-4 rounded border border-red-900 bg-red-950/30 text-red-400 text-sm font-mono">
            &gt; ERROR: {error}
          </div>
        )}

        {scan && (
          <div className="space-y-6">
            <div
              className="p-4 rounded border border-green-900 bg-black"
            >
              <p className="text-xs text-green-700 uppercase tracking-wider mb-2 font-mono">
                &gt; {scan.type === "paste" ? "scanned_code" : "package_scanned"}
              </p>
              <pre className="text-sm text-green-600 font-mono whitespace-pre-wrap break-all">
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