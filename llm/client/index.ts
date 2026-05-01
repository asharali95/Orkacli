import OpenAI from "openai"
import dotenv from "dotenv"
dotenv.config()
const client = new OpenAI({
apiKey: process.env.OPENAI_API_KEY
})

export async function callLLM(prompt: string): Promise<string> {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a senior software engineer generating precise implementation plans."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.2
  })

  return response.choices[0]?.message?.content || ""
}