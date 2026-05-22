import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  prompt: z.string().min(1).max(4000),
  system: z.string().max(2000).optional(),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(4000) }))
    .max(20)
    .optional(),
  maxTokens: z.number().min(50).max(1000).optional(),
});

export const askAI = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => InputSchema.parse(d))
  .handler(async ({ data }) => {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return { reply: "⚠️ AI not configured." };

    const messages: { role: string; content: string }[] = [];
    if (data.system) messages.push({ role: "system", content: data.system });
    if (data.history) messages.push(...data.history);
    messages.push({ role: "user", content: data.prompt });

    try {
      const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          max_tokens: data.maxTokens ?? 500,
          messages,
        }),
      });
      if (r.status === 429) return { reply: "⚠️ Too many requests — wait a moment and try again." };
      if (r.status === 401) return { reply: "⚠️ Invalid API key — check your GROQ_API_KEY." };
      if (!r.ok) return { reply: `⚠️ AI error ${r.status}` };
      const j = await r.json();
      return { reply: j.choices?.[0]?.message?.content ?? "⚠️ Empty response" };
    } catch (e) {
      return { reply: `⚠️ ${(e as Error).message}` };
    }
  });
