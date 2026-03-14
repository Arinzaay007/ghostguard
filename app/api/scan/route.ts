import { NextRequest, NextResponse } from "next/server";
import { groq } from "@/lib/groq";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { code } = await req.json();

  if (!code || code.trim().length < 5) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const prompt = `
You are a senior security engineer. Analyze this code snippet for malicious intent.

Code:
\`\`\`
${code}
\`\`\`

Respond ONLY with a JSON object — no markdown, no backticks, no explanation outside the JSON:
{
  "verdict": "SAFE" or "SUSPICIOUS" or "MALICIOUS",
  "confidence": number between 0-100,
  "flags": ["list of specific threat patterns found"],
  "reasons": ["detailed explanation of each issue found"],
  "safe_version": "brief suggestion to fix, or null if safe"
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
        type: "paste",
        input: code,
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
``