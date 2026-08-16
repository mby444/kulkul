import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { callAIWithRetry } from "@/lib/callAIWithRetry";

const StepSchema = z.object({
  step_number: z.number(),
  instruction: z.string(),
  timer_seconds: z.number(),
});

const RecipeSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  prep_time_minutes: z.number(),
  difficulty: z.string(),
  ingredients_used: z.array(z.string()),
  pantry_stables_needed: z.array(z.string()),
  steps: z.array(StepSchema),
});

const GenerateResponseSchema = z.object({
  recipes: z.array(RecipeSchema),
});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ingredients, pantryStaples = [], cookingStyle = "Bebas" } = body;

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json(
        { error: "Bahan masakan (ingredients) tidak boleh kosong." },
        { status: 400 },
      );
    }

    const response = await callAIWithRetry(async () => {
      return await generateRecipeWithAI(
        ingredients,
        pantryStaples,
        cookingStyle,
      );
    });

    const text = response.text;
    if (!text) {
      throw new Error("AI mengembalikan response kosong.");
    }

    // Validasi struktur JSON menggunakan Zod
    const jsonOutput = JSON.parse(text);
    const validatedData = GenerateResponseSchema.parse(jsonOutput);

    return NextResponse.json(validatedData);
  } catch (error) {
    console.error("Error saat meracik resep:", error);
    return NextResponse.json(
      {
        error: "Gagal meracik resep.",
        details:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan tidak dikenal",
      },
      { status: 500 },
    );
  }
}

function generateRecipeWithAI(
  ingredients: string[],
  pantryStaples: string[],
  cookingStyle: string,
) {
  const prompt = `Kamu adalah seorang Chef AI profesional. Buatkan 2 hingga 3 rekomendasi resep masakan yang lezat berdasarkan parameter berikut:
- Bahan utama yang harus digunakan (bisa sebagian atau semua): ${ingredients.join(", ")}
- Bumbu dasar di dapur yang bisa dipakai: ${pantryStaples.join(", ")}
- Gaya masakan: ${cookingStyle}

Instruksi:
1. Pastikan resep realistis dan langkahnya mudah diikuti.
2. Hitung estimasi waktu persiapan (prep_time_minutes).
3. Untuk langkah (steps), jika butuh didiamkan/dimasak dalam waktu tertentu, isi timer_seconds dengan detiknya (misal: 3 menit = 180). Jika tidak, isi 0.
4. Buat id yang unik (contoh: "recipe-1", "recipe-2").
5. Semua bahasa dalam bahasa Indonesia.`;

  return ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          recipes: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                id: { type: "STRING" },
                title: { type: "STRING" },
                description: { type: "STRING" },
                prep_time_minutes: { type: "INTEGER" },
                difficulty: { type: "STRING" },
                ingredients_used: {
                  type: "ARRAY",
                  items: { type: "STRING" },
                },
                pantry_stables_needed: {
                  type: "ARRAY",
                  items: { type: "STRING" },
                },
                steps: {
                  type: "ARRAY",
                  items: {
                    type: "OBJECT",
                    properties: {
                      step_number: { type: "INTEGER" },
                      instruction: { type: "STRING" },
                      timer_seconds: { type: "INTEGER" },
                    },
                    required: ["step_number", "instruction", "timer_seconds"],
                  },
                },
              },
              required: [
                "id",
                "title",
                "description",
                "prep_time_minutes",
                "difficulty",
                "ingredients_used",
                "pantry_stables_needed",
                "steps",
              ],
            },
          },
        },
        required: ["recipes"],
      },
    },
  });
}
