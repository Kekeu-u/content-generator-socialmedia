import { NextRequest, NextResponse } from "next/server";
import {
  generateImage,
  editImage,
  remixImage,
  generateSocialMediaImage,
} from "@/services/g4f-images";
import { supabaseAdmin } from "@/lib/supabase-admin";

/**
 * POST /api/generate/image
 * Gera imagens usando GPT4Free (GRÁTIS!) com fallback para REVE
 */
export async function POST(request: NextRequest) {
  try {
    // GPT4Free é grátis e não precisa de API key!
    // REVE é usado apenas como fallback para edição/remix

    const body = await request.json();
    const {
      prompt,
      type = "create",
      platform,
      imageBase64,
      maskBase64,
      strength,
      width,
      height,
      quality,
      userId,
    } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const startTime = Date.now();
    let result;

    // Escolher tipo de geração
    switch (type) {
      case "social-media":
        if (!platform) {
          return NextResponse.json(
            { error: "Platform is required for social media images" },
            { status: 400 }
          );
        }
        result = await generateSocialMediaImage({ prompt, platform });
        break;

      case "edit":
        if (!imageBase64) {
          return NextResponse.json(
            { error: "imageBase64 is required for image editing" },
            { status: 400 }
          );
        }
        result = await editImage({ imageBase64, prompt, maskBase64 });
        break;

      case "remix":
        if (!imageBase64) {
          return NextResponse.json(
            { error: "imageBase64 is required for image remix" },
            { status: 400 }
          );
        }
        result = await remixImage({ imageBase64, prompt, strength });
        break;

      default:
        // Geração simples
        result = await generateImage({ prompt, width, height, quality });
        break;
    }

    // Salvar no histórico (se userId fornecido)
    if (userId && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        await supabaseAdmin.from("generation_history").insert({
          user_id: userId,
          generation_type: "image",
          prompt,
          result: result.imageBase64 || "",
          model_used: result.modelUsed,
          tokens_used: result.creditsUsed || null,
          generation_time_ms: result.generationTimeMs,
          metadata: {
            type,
            platform,
            width,
            height,
            quality,
            contentViolation: result.contentViolation,
            creditsRemaining: result.creditsRemaining,
          },
        });

        // Atualizar estatísticas
        const today = new Date().toISOString().split("T")[0];
        await supabaseAdmin.from("usage_statistics").upsert(
          {
            user_id: userId,
            date: today,
            image_generations_count: 1,
            total_cost: result.creditsUsed || 0,
          },
          {
            onConflict: "user_id,date",
          }
        );
      } catch (dbError) {
        console.error("Error saving to database:", dbError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          imageBase64: result.imageBase64,
          modelUsed: result.modelUsed,
          generationTimeMs: result.generationTimeMs,
          creditsUsed: result.creditsUsed,
          creditsRemaining: result.creditsRemaining,
          contentViolation: result.contentViolation,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate image",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/generate/image
 * Informações sobre a API de geração de imagens
 */
export async function GET() {
  return NextResponse.json({
    name: "Image Generation API",
    version: "1.0.0",
    provider: "REVE AI",
    endpoints: {
      POST: {
        description: "Generate images using REVE AI",
        parameters: {
          prompt: "string (required) - Description of the image",
          type: "create | edit | remix | social-media",
          platform: "instagram | facebook | twitter | linkedin | story (for social-media type)",
          imageBase64: "string (required for edit/remix) - Base64 encoded image",
          maskBase64: "string (optional for edit) - Mask for selective editing",
          strength: "number (optional for remix) - Remix strength 0-1",
          width: "number (optional) - Image width",
          height: "number (optional) - Image height",
          quality: "standard | hd",
          userId: "string (optional) - For tracking",
        },
        examples: {
          create: {
            prompt: "A beautiful sunset over mountains",
            type: "create",
            quality: "hd",
          },
          "social-media": {
            prompt: "Modern tech product photo",
            type: "social-media",
            platform: "instagram",
          },
          edit: {
            prompt: "Add a rainbow in the sky",
            type: "edit",
            imageBase64: "data:image/png;base64,...",
          },
        },
      },
    },
    dimensions: {
      instagram: "1080x1080 (square post)",
      facebook: "1200x630 (shared post)",
      twitter: "1200x675 (card)",
      linkedin: "1200x627 (post)",
      story: "1080x1920 (9:16 stories)",
    },
  });
}
