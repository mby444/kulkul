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
    setCurrentRecipeId,
  } = useAppStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const isHydrated = useIsHydrated();

  useEffect(() => {
    if (!isHydrated) return;

    // Simulate AI Generation if there are no generated recipes yet
    if (generatedRecipes.length === 0) {
      setIsGenerating(true);

      setTimeout(() => {
        const mockRecipes: Recipe[] = [
          {
            id: "r1",
            title: "Omelet Tomat Gurih",
            description:
              "Sarapan praktis yang menggabungkan manisnya tomat dan gurihnya telur dadar, cocok dipadukan dengan daun bawang.",
            prep_time_minutes: 10,
            difficulty: "Mudah",
            ingredients_used: [
              "Telur",
              "Tomat",
              "Daun Bawang",
              "Garam",
              "Minyak Goreng",
            ],
            pantry_stables_needed: ["Garam", "Minyak Goreng"],
            steps: [
              {
                step_number: 1,
                instruction: "Potong dadu tomat dan iris tipis daun bawang.",
                timer_seconds: 0,
              },
              {
                step_number: 2,
                instruction:
                  "Kocok telur, masukkan tomat, daun bawang, dan sejumput garam.",
                timer_seconds: 0,
              },
              {
                step_number: 3,
                instruction:
                  "Panaskan sedikit minyak goreng di teflon, lalu tuang adonan telur.",
                timer_seconds: 0,
              },
              {
                step_number: 4,
                instruction:
                  "Masak hingga matang kecokelatan, balik perlahan, lalu angkat dan sajikan.",
                timer_seconds: 180,
              },
            ],
          },
          {
            id: "r2",
            title: "Sosis Tumis Bawang",
            description:
              "Menu simpel untuk anak kos. Sosis digoreng tumis dengan taburan daun bawang dan sedikit lada.",
            prep_time_minutes: 12,
            difficulty: "Mudah",
            ingredients_used: [
              "Sosis",
              "Daun Bawang",
              "Minyak Goreng",
              "Bawang Putih",
            ],
            pantry_stables_needed: ["Minyak Goreng", "Bawang Putih"],
            steps: [
              {
                step_number: 1,
                instruction:
                  "Iris serong sosis dan cincang kasar bawang putih.",
                timer_seconds: 0,
              },
              {
                step_number: 2,
                instruction: "Tumis bawang putih hingga harum.",
                timer_seconds: 60,
              },
              {
                step_number: 3,
                instruction:
                  "Masukkan sosis, tumis hingga mekar dan kecokelatan.",
                timer_seconds: 120,
              },
              {
                step_number: 4,
                instruction:
                  "Taburkan irisan daun bawang, aduk sebentar, lalu angkat.",
                timer_seconds: 0,
              },
            ],
          },
        ];
        setGeneratedRecipes(mockRecipes);
        setIsGenerating(false);
      }, 3000);
    }
  }, [generatedRecipes.length, setGeneratedRecipes]);

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
            {generatedRecipes.map((recipe) => (
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
                imageUrl={`https://images.unsplash.com/photo-${recipe.id === "r1" ? "1546069901-ba9599a7e63c" : "1550547660-d9450f859349"}?w=800&q=80`}
                onCookClick={handleCookClick}
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
