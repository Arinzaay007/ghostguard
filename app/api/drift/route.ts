import { NextRequest, NextResponse } from "next/server";
import { groq } from "@/lib/groq";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { packageName, oldVersion, newVersion } = await req.json();

  if (!packageName || !oldVersion || !newVersion) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const prompt = `
You are a supply chain security expert. Analyze the behavioral differences between two versions of an npm package and flag anything suspicious.

Package: ${packageName}
Old version: ${oldVersion}
New version: ${newVersion}

Focus on:
- New network calls or outbound connections
- New file system access
- New environment variable access
- Dependency additions
- Maintainer or ownership changes
- Timing of release (odd hours = suspicious)
- Any behavior that was not present before

Respond ONLY with a JSON object — no markdown, no backticks, no explanation outside the JSON:
{
  "verdict": "SAFE" or "SUSPICIOUS" or "MALICIOUS",
  "confidence": number between 0-100,
  "flags": ["specific behavioral changes that are suspicious"],
  "reasons": ["explanation of each flag"],
  "safe_version": "recommendation or null"
}
`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
    });

    const raw = completion.choices[0].message.content ?? "";
    const parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());

    const { data, error } = await supabase
      .from("scans")
      .insert({
        type: "drift",
        input: `${packageName} ${oldVersion} → ${newVersion}`,
        verdict: parsed.verdict,
        confidence: parsed.confidence,
        flags: parsed.flags,
        reasons: parsed.reasons,
        safe_version: parsed.safe_version ?? null,
      })
      .select("id")
      .single();

    if (error) throw error;

    return NextResponse.json({ ...parsed, id: data.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}