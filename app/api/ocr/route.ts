import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// OCR.Space API endpoint
const OCR_API_URL = "https://api.ocr.space/parse/image"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Get API key from environment variables or use the default "helloworld" for testing
    const apiKey = process.env.OCR_SPACE_API_KEY || "helloworld"

    // Create a new FormData object for the OCR API
    const ocrFormData = new FormData()
    ocrFormData.append("file", file)
    ocrFormData.append("language", "eng")
    ocrFormData.append("isOverlayRequired", "false")
    ocrFormData.append("iscreatesearchablepdf", "false")
    ocrFormData.append("issearchablepdfhidetextlayer", "false")

    // Call OCR.Space API
    const response = await fetch(OCR_API_URL, {
      method: "POST",
      headers: {
        apikey: apiKey,
      },
      body: ocrFormData,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error("OCR.Space API error:", errorData)
      return NextResponse.json({ error: "Failed to process the image" }, { status: response.status })
    }

    const result = await response.json()

    // Extract the text from the OCR result
    let extractedText = ""
    if (result.ParsedResults && result.ParsedResults.length > 0) {
      extractedText = result.ParsedResults[0].ParsedText
    }

    // Generate a response based on the extracted text
    let aiResponse = ""

    if (
      extractedText.toLowerCase().includes("prescription") ||
      extractedText.toLowerCase().includes("mg") ||
      extractedText.toLowerCase().includes("tablet") ||
      extractedText.toLowerCase().includes("capsule")
    ) {
      // This appears to be a prescription
      aiResponse = `I've analyzed your prescription and found the following information:\n\n${extractedText}\n\nPlease note that I can only extract the text from the prescription. For proper medical advice, please consult with your healthcare provider.`
    } else {
      // This appears to be a general document
      aiResponse = `I've extracted the following text from your image:\n\n${extractedText}\n\nIf you have any specific questions about this content, please let me know.`
    }

    return NextResponse.json({
      extractedText,
      aiResponse,
    })
  } catch (error) {
    console.error("Error in OCR API route:", error)
    return NextResponse.json({ error: "Failed to process your request" }, { status: 500 })
  }
}
