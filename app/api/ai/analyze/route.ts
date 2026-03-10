import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const { history, stats, journals, userPrompt: customPrompt, lang } = await req.json()
        const apiKey = process.env.OPENROUTER_API_KEY || process.env.Open_Router_API

        if (!apiKey) {
            return NextResponse.json({ error: 'OPENROUTER_API_KEY missing' }, { status: 500 })
        }

        const systemPrompt = `You are Atara AI, an elite, science-backed metabolic fasting coach. 
Analyze the user's history, stats, and journal reflections.
Respond in ${lang === 'bg' ? 'Bulgarian (български)' : 'English'}.
Keep your response concise (max 3 short paragraphs).
Format your response using ONLY bullet points (-) or very SPARING bold text (**) for key metrics only.
Do NOT over-bold text. No more than 10% of the text should be bold.
Do NOT use ALL CAPS. Use normal sentence casing.
Ensure there is a double newline between bullet points for readability.
Do not use complicated markdown (no headers, no tables, no blockquotes).
Be direct, authoritative, and helpful.`

        const userPrompt = customPrompt || `Here is my fasting history: ${JSON.stringify(history)}
    And my current stats: ${JSON.stringify(stats)}
    Latest journal reflections: ${JSON.stringify(journals)}`

        const primaryModel = "google/gemini-2.5-flash"
        const fallbackModel = "google/gemini-2.5-flash-lite"

        let res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: primaryModel,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt }
                ]
            })
        });

        if (!res.ok) {
            // Fallback
            res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: fallbackModel,
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: userPrompt }
                    ]
                })
            });
        }

        if (!res.ok) {
            throw new Error("Both primary and fallback AI models failed.");
        }

        const data = await res.json()
        return NextResponse.json({ analysis: data.choices[0].message.content })
    } catch (err: any) {
        console.error("AI Analysis error:", err);
        return NextResponse.json({ error: 'Failed to analyze', details: err.message }, { status: 500 })
    }
}
