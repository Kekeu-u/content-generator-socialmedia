import { NextRequest, NextResponse } from "next/server";
import { analyzeImage } from "@/services/gemini";

/**
 * POST /api/analyze/image
 * Analisa imagem usando Gemini 2.5 Flash (visão)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageData, prompt, userId } = body;

    // Validação
    if (!imageData) {
      return NextResponse.json(
        { error: "Image data is required (base64 or URL)" },
        { status: 400 }
      );
    }

    const startTime = Date.now();

    // Analisar imagem
    const analysis = await analyzeImage(
      imageData,
      prompt || "Descreva esta imagem em detalhes para uso em redes sociais"
    );

    const generationTimeMs = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      data: {
        analysis,
        prompt: prompt || "Descreva esta imagem em detalhes",
        modelUsed: "gemini-2.5-flash",
        generationTimeMs,
      },
    });
  } catch (error) {
    console.error("Image analysis error:", error);
    return NextResponse.json(
      {
        error: "Failed to analyze image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/analyze/image
 * Retorna informações sobre a API de análise de imagens
 */
export async function GET() {
  return NextResponse.json({
    name: "Image Analysis API",
    version: "1.0.0",
    model: "gemini-2.5-flash (multimodal)",
    description:
      "Analyze images using Gemini's vision capabilities for social media content generation",
    capabilities: [
      "Describe images in detail",
      "Identify objects and scenes",
      "Suggest captions for social media",
      "Extract text from images (OCR)",
      "Analyze image composition",
      "Suggest hashtags based on image content",
    ],
    endpoints: {
      POST: {
        description: "Analyze an image",
        parameters: {
          imageData: "string (required) - base64 encoded image",
          prompt: "string (optional) - specific question about the image",
          userId: "string (optional) - for tracking purposes",
        },
        example: {
          imageData: "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
          prompt:
            "Crie uma legenda atraente para Instagram sobre esta imagem",
        },
      },
    },
    useCases: [
      "Generate captions for uploaded images",
      "Analyze competitor's visual content",
      "Extract insights from infographics",
      "Identify trends in visual content",
      "Create alt text for accessibility",
    ],
  });
}
