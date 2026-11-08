export default async (req) => {
  if (req.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  const apiKey = Netlify.env.get("GEMINI_API_KEY");
  if (!apiKey) {
    return Response.json({ error: "GEMINI_API_KEY is not set in Netlify environment variables." }, { status: 500 });
  }

  try {
    const body = await req.json();
    const incoming = Array.isArray(body.history) ? body.history.slice(-20) : [];
    const contents = incoming
      .filter(m => (m.role === "user" || m.role === "model") && typeof m.text === "string")
      .map(m => ({ role: m.role, parts: [{ text: m.text.slice(0, 8000) }] }));

    if (!contents.length || contents[contents.length - 1].role !== "user") {
      return Response.json({ error: "Please send a message first." }, { status: 400 });
    }

    const endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent";
    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{
            text: "You are Dino AI by Raunak, a helpful, friendly, accurate multilingual AI assistant. Understand and respond in the language the user uses, including Hindi, English, Hinglish, and other languages when possible. If the user mixes languages, you may do the same. Explain clearly and naturally. Do not claim to know everything; be honest when uncertain. Keep answers age-appropriate and safe."
          }]
        },
        contents,
        generationConfig: { temperature: 0.7, maxOutputTokens: 2048 }
      })
    });

    const result = await upstream.json();
    if (!upstream.ok) {
      const message = result?.error?.message || `Gemini API error (${upstream.status})`;
      return Response.json({ error: message }, { status: upstream.status });
    }

    const reply = result?.candidates?.[0]?.content?.parts
      ?.map(part => part.text || "").join("").trim();

    if (!reply) {
      return Response.json({ error: "The AI returned an empty response. Please try again." }, { status: 502 });
    }
    return Response.json({ reply });
  } catch (error) {
    return Response.json({ error: error.message || "Unexpected server error." }, { status: 500 });
  }
};
