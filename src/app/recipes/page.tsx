"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import { RecipeCard } from "@/components/ui/RecipeCard";
import { useAppStore, Recipe } from "@/store/useAppStore";
import useIsHydrated from "@/hooks/useIsHydrated";

export default function RecipesPage() {
  const router = useRouter();
  const {
    generatedRecipes,
    setGeneratedRecipes,
    ingredients,
    selectedPantry,
    cookingStyle,
    setCurrentRecipeId,
  } = useAppStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const isHydrated = useIsHydrated();

  useEffect(() => {
    if (!isHydrated) return;

    if (generatedRecipes.length === 0) {
      setIsGenerating(true);

      const generateAI = async () => {
        try {
          // --- MOCK DATA SEMENTARA (HEMAT QUOTA) ---
          // setTimeout(() => {
          //   setGeneratedRecipes([
          //     {
          //       id: "mock1",
          //       title: "Nasi Goreng Telur Spesial",
          //       description: "Nasi goreng lezat dengan bumbu rahasia dapur.",
          //       prep_time_minutes: 15,
          //       difficulty: "Mudah",
          //       ingredients_used: ["Nasi", "Telur", "Bawang Putih"],
          //       pantry_stables_needed: ["Minyak Goreng", "Garam", "Kecap"],
          //       steps: []
          //     },
          //     {
          //       id: "mock2",
          //       title: "Omelet Sayur Keju Gurih",
          //       description: "Omelet gurih dan sehat, cocok untuk sarapan.",
          //       prep_time_minutes: 10,
          //       difficulty: "Sedang",
          //       ingredients_used: ["Telur", "Keju", "Bayam"],
          //       pantry_stables_needed: ["Garam", "Minyak Goreng", "Lada"],
          //       steps: []
          //     }
          //   ]);
          //   setIsGenerating(false);
          // }, 2000);
          // return;
          // ----------------------------------------

          const res = await fetch("/api/generate-recipe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ingredients,
              pantryStaples: selectedPantry,
              cookingStyle,
            }),
          });

          if (!res.ok) {
            throw new Error("Gagal meracik resep");
          }

          const data = await res.json();
          if (data.recipes) {
            setGeneratedRecipes(data.recipes);
          }
        } catch (error) {
          console.error(error);
          alert("Terjadi kesalahan saat meracik resep dengan AI.");
        } finally {
          setIsGenerating(false);
        }
      };

      generateAI();
    }
  }, [isHydrated]);

  const handleCookClick = (id: string) => {
    setCurrentRecipeId(id);
    router.push(`/cook/${id}`);
  };

  return (
    <main className="flex-1 flex flex-col relative bg-bg-app h-full overflow-y-auto">
      {/* Header Back */}
      <div className="sticky top-0 z-20 bg-bg-app/90 backdrop-blur-md px-4 py-4 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-black/5 rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-text-main" />
        </button>
        <h2 className="font-bold text-text-main text-lg">
          {isGenerating
            ? "Meracik Resep..."
            : `Ditemukan ${generatedRecipes.length} Resep`}
        </h2>
      </div>

      <div className="p-6 pb-12">
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-500">
            <div className="relative mb-6">
              <Sparkles size={48} className="text-primary animate-pulse" />
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
            </div>
            <h3 className="font-bold text-lg mb-2 text-text-main">
              AI Sedang Meracik Resep
            </h3>
            <p className="text-sm text-text-muted text-center max-w-[80%] leading-relaxed">
              Memilih kombinasi terbaik dari {ingredients.length} bahan yang
              terdeteksi di kulkasmu...
            </p>

            {/* Skeleton Loaders */}
            <div className="w-full mt-10 flex flex-col gap-6 opacity-60">
              <div className="w-full h-48 bg-border/50 rounded-2xl animate-pulse"></div>
              <div className="w-full h-48 bg-border/50 rounded-2xl animate-pulse"></div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-8 duration-700">
            {generatedRecipes.map((recipe, index) => (
              <RecipeCard
                key={recipe.id}
                id={recipe.id}
                title={recipe.title}
                description={recipe.description}
                prepTime={recipe.prep_time_minutes}
                difficulty={recipe.difficulty}
                ingredientCount={recipe.ingredients_used.length}
                tags={recipe.ingredients_used.filter(
                  (i) => !recipe.pantry_stables_needed.includes(i),
                )}
                imageUrl={`https://image.pollinations.ai/prompt/${encodeURIComponent(recipe.title + " delicious food photography high quality")}?width=800&height=600&nologo=true`}
                onCookClick={handleCookClick}
                index={index}
              />
            ))}

            {generatedRecipes.length === 0 && !isGenerating && (
              <div className="text-center py-20 text-text-muted">
                <p>Tidak ada resep yang ditemukan.</p>
                <button
                  onClick={() => router.push("/upload")}
                  className="text-primary font-bold mt-4"
                >
                  Coba lagi dengan bahan lain
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
