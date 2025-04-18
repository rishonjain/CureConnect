import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  // Check if the Hugging Face API key is configured
  const apiKey = process.env.HUGGINGFACE_API_KEY

  return NextResponse.json({
    configured: !!apiKey,
  })
}
