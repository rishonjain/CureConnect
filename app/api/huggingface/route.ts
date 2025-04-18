import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Hugging Face API endpoint for Mistral-7B-Instruct-v0.2
const HF_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2"

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json()

    // Get API key from environment variable
    const apiKey = process.env.HUGGINGFACE_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: "Hugging Face API key not configured" }, { status: 500 })
    }

    // Format conversation history for Mistral-7B-Instruct
    const formattedMessages = formatConversationHistory(history, message)

    // Call Hugging Face API
    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        inputs: formattedMessages,
        parameters: {
          max_new_tokens: 512,
          temperature: 0.7,
          top_p: 0.95,
          do_sample: true,
          return_full_text: false,
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("Hugging Face API error:", errorData)
      return NextResponse.json({ error: "Failed to get response from Hugging Face API" }, { status: response.status })
    }

    const result = await response.json()

    // Extract the generated text from the response
    let generatedText = ""
    if (Array.isArray(result) && result.length > 0) {
      generatedText = result[0]?.generated_text || ""
    } else if (result.generated_text) {
      generatedText = result.generated_text
    }

    return NextResponse.json({ response: generatedText })
  } catch (error) {
    console.error("Error in Hugging Face API route:", error)
    return NextResponse.json({ error: "Failed to process your request" }, { status: 500 })
  }
}

// Format conversation history for Mistral-7B-Instruct model
function formatConversationHistory(history: Array<{ role: string; content: string }>, currentMessage: string) {
  // System prompt to guide the model's behavior
  const systemPrompt = `You are CureBot, an AI health assistant developed by CureConnect. 
Provide helpful, accurate, and ethical health information. 
Do not provide medical diagnoses or prescribe treatments. 
Always recommend consulting with healthcare professionals for specific medical concerns.
Be conversational, empathetic, and clear in your responses.
Keep responses concise and focused on health-related topics.`

  // Format the conversation for Mistral-7B-Instruct
  let formattedPrompt = `<s>[INST] ${systemPrompt} [/INST]</s>\n`

  // Add conversation history
  for (let i = 0; i < history.length; i++) {
    const message = history[i]
    if (message.role === "user") {
      formattedPrompt += `<s>[INST] ${message.content} [/INST] `
    } else if (message.role === "assistant") {
      formattedPrompt += `${message.content}</s>\n`
    }
  }

  // Add the current message
  formattedPrompt += `<s>[INST] ${currentMessage} [/INST]`

  return formattedPrompt
}
