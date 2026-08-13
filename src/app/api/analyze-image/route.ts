import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

// Zod Schema untuk memvalidasi output dari AI
const AnalyzeResponseSchema = z.object({
  detected_ingredients: z
    .array(z.string())
    .describe("Daftar bahan makanan mentah yang terdeteksi"),
});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Gambar tidak ditemukan dalam request." },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");
    const mimeType = file.type;

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: 'Identifikasi bahan-bahan makanan mentah atau bahan masakan yang ada di dalam gambar ini. Abaikan botol minuman ringan, makanan jadi, wadah kosong, atau objek non-makanan. Kembalikan array string berisi nama-nama bahan dasar dalam bahasa Indonesia (misal: "Tomat", "Telur", "Bawang Putih").',
            },
            {
              inlineData: {
                data: base64Image,
                mimeType: mimeType,
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        // Format JSON Schema agar AI mengembalikan format yang konsisten
        responseSchema: {
          type: "OBJECT",
          properties: {
            detected_ingredients: {
              type: "ARRAY",
              description:
                "Daftar bahan makanan mentah (sayur, daging, bumbu dasar) yang terdeteksi. Gunakan bahasa Indonesia.",
              items: {
                type: "STRING",
              },
            },
          },
          required: ["detected_ingredients"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("AI mengembalikan response kosong.");
    }

    // Validasi ketat menggunakan Zod (Structured Output Enforcement)
    const jsonOutput = JSON.parse(text);
    const validatedData = AnalyzeResponseSchema.parse(jsonOutput);

    return NextResponse.json(validatedData);
  } catch (error) {
    console.error("Error saat menganalisis gambar:", error);
    return NextResponse.json(
      { 
        error: "Gagal menganalisis gambar.", 
        details: error instanceof Error ? error.message : "Terjadi kesalahan tidak dikenal" 
      },
      { status: 500 },
    );
  }
}
