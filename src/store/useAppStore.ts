import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Recipe = {
  id: string;
  title: string;
  description: string;
  prep_time_minutes: number;
  difficulty: string;
  ingredients_used: string[];
  pantry_stables_needed: string[];
  steps: { step_number: number; instruction: string; timer_seconds: number }[];
};

type AppState = {
  ingredients: string[];
  selectedPantry: string[];
  cookingStyle: string;
  generatedRecipes: Recipe[];
  currentRecipeId: string | null;
  currentCookStep: number;
  previewUrl: string | null;
  
  setIngredients: (ingredients: string[]) => void;
  setSelectedPantry: (pantry: string[]) => void;
  setCookingStyle: (style: string) => void;
  setGeneratedRecipes: (recipes: Recipe[]) => void;
  setCurrentRecipeId: (id: string | null) => void;
  setCurrentCookStep: (step: number) => void;
  setPreviewUrl: (url: string | null) => void;
  clearSession: () => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ingredients: [],
      selectedPantry: ["Garam", "Minyak Goreng"],
      cookingStyle: "Santai / Ala Kosan",
      generatedRecipes: [],
      currentRecipeId: null,
      currentCookStep: 1,
      previewUrl: null,

      setIngredients: (ingredients) => set({ ingredients }),
      setSelectedPantry: (selectedPantry) => set({ selectedPantry }),
      setCookingStyle: (cookingStyle) => set({ cookingStyle }),
      setGeneratedRecipes: (generatedRecipes) => set({ generatedRecipes }),
      setCurrentRecipeId: (currentRecipeId) => set({ currentRecipeId }),
      setCurrentCookStep: (currentCookStep) => set({ currentCookStep }),
      setPreviewUrl: (previewUrl) => set({ previewUrl }),
      clearSession: () => set({
        ingredients: [],
        selectedPantry: ["Garam", "Minyak Goreng"],
        cookingStyle: "Santai / Ala Kosan",
        generatedRecipes: [],
        currentRecipeId: null,
        currentCookStep: 1,
      }),
    }),
    {
      name: 'kulkul-storage',
    }
  )
);
