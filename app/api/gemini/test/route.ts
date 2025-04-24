import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Get API key from environment variable or use the provided key
    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyAlEv40q32xNYzBvILs-bhjoi5lI2p6QnA"

    if (!apiKey) {
      return NextResponse.json({ error: "No Gemini API key configured" }, { status: 500 })
    }

    // Test the Gemini API with a simple prompt using Gemini 2.5 Flash Preview
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-preview:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: "Hello, can you provide a brief health tip?" }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 100,
          },
        }),
      },
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return NextResponse.json({ error: "Gemini API error", details: errorData }, { status: response.status })
    }

    const result = await response.json()
    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error("Error testing Gemini API:", error)
    return NextResponse.json({ error: "Failed to test Gemini API", details: String(error) }, { status: 500 })
  }
}
