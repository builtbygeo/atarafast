import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const { history, stats } = await req.json()
        const apiKey = process.env.OPENROUTER_API_KEY || process.env.Open_Router_API

        if (!apiKey) {
            return NextResponse.json({ error: 'OPENROUTER_API_KEY missing' }, { status: 500 })
        }

        const systemPrompt = `You are Atara AI, an elite, science-backed metabolic fasting coach. 
Analyze the user's formatting history and statistics.
Keep your response concise (max 3 short paragraphs).
Format your response using ONLY bullet points (-) or bold text for emphasis.
Do not use complicated markdown (no tables, no blockquotes, no headers).
Be direct, authoritative, and helpful. Mention patterns and suggest improvements based on metabolic adaptation science. Respond in the user's primary language based on the context.`

        const userPrompt = `Here is my fasting history: ${JSON.stringify(history)}
    And my current stats: ${JSON.stringify(stats)}`

        const primaryModel = "x-ai/grok-4.1-fast"
        const fallbackModel = "qwen/qwen3-32b"

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
