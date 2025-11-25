import { NextRequest, NextResponse } from "next/server";
import {
  generateText,
  generateSocialMediaPost,
  generateVariations,
  improveText,
} from "@/services/gemini";
import { supabaseAdmin } from "@/lib/supabase";
import type { Database } from "@/types/database";

/**
 * POST /api/generate/text
 * Gera texto usando Gemini 2.5 Flash
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      prompt,
      type = "general",
      platform,
      tone,
      targetAudience,
      includeHashtags,
      includeEmojis,
      variationsCount,
      textToImprove,
      userId,
    } = body;

    // Validação básica
    if (!prompt && !textToImprove) {
      return NextResponse.json(
        { error: "Prompt or textToImprove is required" },
        { status: 400 }
      );
    }

    let result: {
      text?: string;
      content?: string;
      hashtags?: string[];
      variations?: string[];
      tokensUsed?: number;
      modelUsed?: string;
      generationTimeMs?: number;
    } = {};

    const startTime = Date.now();

    // Escolher tipo de geração
    switch (type) {
      case "social-media":
        if (!platform) {
          return NextResponse.json(
            { error: "Platform is required for social media generation" },
            { status: 400 }
          );
        }
        result = await generateSocialMediaPost({
          topic: prompt,
          platform,
          tone,
          targetAudience,
          includeHashtags,
          includeEmojis,
        });
        break;

      case "variations":
        const variations = await generateVariations(
          prompt,
          variationsCount || 3
        );
        result = { variations };
        break;

      case "improve":
        if (!textToImprove) {
          return NextResponse.json(
            { error: "textToImprove is required for improvement" },
            { status: 400 }
          );
        }
        const improved = await improveText(textToImprove, prompt);
        result = { text: improved };
        break;

      default:
        // Geração geral
        const response = await generateText(prompt);
        result = response;
        break;
    }

    // Salvar no histórico (se userId fornecido)
    if (userId) {
      try {
        // @ts-expect-error - Supabase type inference issue, types are correct
        await supabaseAdmin.from("generation_history").insert({
          user_id: userId,
          generation_type: "text",
          prompt,
          result: JSON.stringify(result),
          model_used: result.modelUsed || "gemini-2.5-flash",
          tokens_used: result.tokensUsed ?? null,
          generation_time_ms: result.generationTimeMs ?? (Date.now() - startTime),
          metadata: {
            type,
            platform,
            tone,
          },
        });

        // Atualizar estatísticas
        const today = new Date().toISOString().split("T")[0];
        // @ts-expect-error - Supabase type inference issue, types are correct
        await supabaseAdmin.from("usage_statistics").upsert(
          {
            user_id: userId,
            date: today,
            text_generations_count: 1,
            total_tokens_used: result.tokensUsed || 0,
          },
          {
            onConflict: "user_id,date",
          }
        );
      } catch (dbError) {
        console.error("Error saving to database:", dbError);
        // Não falhar a requisição se salvar no DB falhar
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: result,
        metadata: {
          generationTimeMs: Date.now() - startTime,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Text generation error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate text",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/generate/text
 * Retorna informações sobre a API de geração de texto
 */
export async function GET() {
  return NextResponse.json({
    name: "Text Generation API",
    version: "1.0.0",
    model: process.env.GEMINI_TEXT_MODEL || "gemini-2.5-flash",
    endpoints: {
      POST: {
        description: "Generate text using Gemini 2.5 Flash",
        parameters: {
          prompt: "string (required)",
          type: "general | social-media | variations | improve",
          platform: "instagram | facebook | twitter | linkedin | tiktok",
          tone: "professional | casual | funny | inspirational",
          targetAudience: "string",
          includeHashtags: "boolean",
          includeEmojis: "boolean",
          variationsCount: "number (1-5)",
          textToImprove: "string",
          userId: "string (optional, for history tracking)",
        },
      },
    },
  });
}
