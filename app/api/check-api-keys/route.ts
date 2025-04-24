import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  // Check if the OCR API key is configured
  const ocrApiKey = process.env.OCR_SPACE_API_KEY

  // Check if the Gemini API key is configured
  const geminiApiKey = process.env.GEMINI_API_KEY || "AIzaSyAlEv40q32xNYzBvILs-bhjoi5lI2p6QnA"

  return NextResponse.json({
    ocr: !!ocrApiKey || true, // OCR can use the default "helloworld" key
    gemini: !!geminiApiKey,
  })
}
