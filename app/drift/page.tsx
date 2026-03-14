"use client";

import { useState } from "react";
import { Shield, GitCompare } from "lucide-react";
import VerdictCard from "@/components/VerdictCard";
import Link from "next/link";

export default function DriftPage() {
  const [packageName, setPackageName] = useState("");
  const [oldVersion, setOldVersion] = useState("");
  const [newVersion, setNewVersion] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  const scan = async () => {
    if (!packageName || !oldVersion || !newVersion) return;
    setLoading(true);
    setError("");
    setResult(null);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => (p >= 90 ? 90 : p + 10));
    }, 200);

    try {
      const res = await fetch("/api/drift", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageName, oldVersion, newVersion }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => setResult(data), 300);
    } catch (err: any) {
      clearInterval(interval);
      setProgress(0);
      setError(err.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: "black",
    border: "1px solid #003300",
    color: "#00ff41",
    caretColor: "#00ff41",
  };

  const inputFocusClass = "focus:outline-none focus:border-green-400 transition-all";

  return (
    <main className="min-h-screen page-enter">
      {loading && <div className="scan-animation" />}

      <nav className="border-b border-green-900 px-6 py-4 flex items-center justify-between bg-black/40 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-green-400" style={{ filter: "drop-shadow(0 0 6px #00ff41)" }} />
          <span className="font-mono font-bold text-lg tracking-tight text-green-400 glow">GhostGuard</span>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/" className="text-green-700 hover:text-green-400 transition-colors font-mono">Paste Shield</Link>
          <Link href="/drift" className="text-green-400 glow font-mono">Drift Detector</Link>
          <Link href="/timeline" className="text-green-700 hover:text-green-400 transition-colors font-mono">Threat Timeline</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <GitCompare className="w-4 h-4 text-green-400" />
            <span className="text-xs font-mono text-green-600 uppercase tracking-widest">// drift_detector.exe</span>
          </div>
          <h1 className="text-3xl font-bold mb-3 tracking-tight text-green-400 glow cursor">
            Detect package behavior changes
          </h1>
          <p className="text-green-700 text-sm leading-relaxed font-mono">
            &gt; Enter an npm package name and two versions.<br />
            &gt; GhostGuard analyzes behavioral shifts between them.
          </p>
        </div>

        <div className="space-y-4">
          {loading && (
            <div className="w-full h-1 bg-green-950 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-400 progress-bar transition-all duration-200 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          <input
            type="text"
            value={packageName}
            onChange={(e) => setPackageName(e.target.value)}
            placeholder="// package name (e.g. lodash)"
            className={`w-full px-4 py-3 rounded font-mono text-sm placeholder:text-green-900 ${inputFocusClass}`}
            style={inputStyle}
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              value={oldVersion}
              onChange={(e) => setOldVersion(e.target.value)}
              placeholder="// old version (e.g. 3.3.5)"
              className={`w-full px-4 py-3 rounded font-mono text-sm placeholder:text-green-900 ${inputFocusClass}`}
              style={inputStyle}
            />
            <input
              type="text"
              value={newVersion}
              onChange={(e) => setNewVersion(e.target.value)}
              placeholder="// new version (e.g. 3.3.6)"
              className={`w-full px-4 py-3 rounded font-mono text-sm placeholder:text-green-900 ${inputFocusClass}`}
              style={inputStyle}
            />
          </div>

          <button
            onClick={scan}
            disabled={loading || !packageName || !oldVersion || !newVersion}
            className="w-full py-3 rounded font-mono text-sm font-bold tracking-widest uppercase transition-all border"
            style={{
              background: loading || !packageName ? "transparent" : "#001a00",
              borderColor: loading || !packageName ? "#003300" : "#00ff41",
              color: loading || !packageName ? "#003300" : "#00ff41",
              boxShadow: loading || !packageName ? "none" : "0 0 10px #00ff4133",
            }}
          >
            {loading ? `[ scanning... ${progress}% ]` : "[ detect drift → ]"}
          </button>
        </div>

        {error && (
          <div className="mt-6 p-4 rounded border border-red-900 bg-red-950/30 text-red-400 text-sm font-mono">
            &gt; ERROR: {error}
          </div>
        )}

        {result && (
          <div className="mt-8">
            <VerdictCard {...result} />
          </div>
        )}
      </div>
    </main>
  );
}