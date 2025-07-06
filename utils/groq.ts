// Uses Groq LLM API to get AI response.
// You need to set NEXT_PUBLIC_GROQ_API_KEY in your .env.local

export async function askGroq(context: string): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY || (typeof window !== "undefined" && (window as any).NEXT_PUBLIC_GROQ_API_KEY);
  if (!apiKey) {
    throw new Error("GROQ API key not set");
  }

  const body = {
    messages: [
      {
        role: "system",
        content:
          "You are a helpful, concise AI assistant. Answer as helpfully as possible.",
      },
      { role: "user", content: context },
    ],
    model: "llama3-70b-8192", // or "gemma-7b-it" for smaller model
    temperature: 0.7,
    max_tokens: 400,
    top_p: 1,
    stream: false,
  };

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Groq API error: " + (await response.text()));
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || "Sorry, I don't know.";
}