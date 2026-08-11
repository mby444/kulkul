"use client";

import React, { useState } from "react";
import { Camera, UploadCloud, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { CheckboxGrid } from "@/components/CheckboxGrid";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [manualInput, setManualInput] = useState("");

  const pantryOptions = [
    "Garam",
    "Minyak Goreng",
    "Bawang Putih",
    "Kecap",
    "Cabai",
    "Lada",
  ];
  const [selectedPantry, setSelectedPantry] = useState<string[]>([
    "Garam",
    "Minyak Goreng",
  ]);

  const handleUploadClick = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIngredients(["Telur", "Tomat", "Daun Bawang"]);
      setIsProcessing(false);
    }, 2000);
  };

  const handleRemoveIngredient = (ing: string) => {
    setIngredients(ingredients.filter((i) => i !== ing));
  };

  const handleAddManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim() && !ingredients.includes(manualInput.trim())) {
      setIngredients([...ingredients, manualInput.trim()]);
      setManualInput("");
    }
  };

  const togglePantry = (option: string) => {
    if (selectedPantry.includes(option)) {
      setSelectedPantry(selectedPantry.filter((o) => o !== option));
    } else {
      setSelectedPantry([...selectedPantry, option]);
    }
  };

  const handleGenerateRecipe = () => {
    localStorage.setItem(
      "userIngredients",
      JSON.stringify({ ingredients, selectedPantry }),
    );
    router.push("/recipes");
  };

  return (
    <main className="flex-1 p-6 flex flex-col relative overflow-y-auto">
      {/* Header */}
      <header className="mb-8 text-center mt-6">
        <h1 className="text-3xl font-bold text-text-main mb-3 font-sans">
          KulKul 🍳
        </h1>
        <p className="text-text-muted text-sm px-4">
          Foto bahan di kulkasmu, kami buatkan resep lezatnya.
        </p>
      </header>

      {/* Upload Zone */}
      <div
        className="border-2 border-dashed border-primary/40 bg-primary/5 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-primary/10 transition-colors mb-6 shadow-sm"
        onClick={handleUploadClick}
      >
        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
          <Camera size={36} className="text-primary" />
        </div>
        <h3 className="font-bold text-lg mb-1">
          Ambil / Upload Foto Isi Kulkas
        </h3>
        <p className="text-sm text-text-muted mt-1">
          Klik untuk mencoba (Simulasi AI)
        </p>
      </div>

      {isProcessing && (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mb-5"></div>
          <p className="text-text-muted font-medium animate-pulse">
            Sedang mengintip isi kulkasmu...
          </p>
        </div>
      )}

      {ingredients.length > 0 && !isProcessing && (
        <div className="flex-1 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
          {/* Ingredients */}
          <div className="mb-8 bg-white p-5 rounded-2xl shadow-sm border border-border">
            <h3 className="font-bold mb-4 text-text-main">Bahan Terdeteksi:</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {ingredients.map((ing) => (
                <Chip
                  key={ing}
                  label={ing}
                  onRemove={() => handleRemoveIngredient(ing)}
                />
              ))}
            </div>

            <form onSubmit={handleAddManual} className="flex gap-2">
              <input
                type="text"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                placeholder="Ada yang kelewat? Tambah manual..."
                className="flex-1 bg-bg-app border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="submit"
                className="bg-accent text-white w-12 h-12 rounded-xl flex items-center justify-center hover:brightness-105 shadow-sm transition-all"
              >
                <Plus size={24} />
              </button>
            </form>
          </div>

          {/* Pantry Staples */}
          <div className="mb-6">
            <h3 className="font-bold mb-3 text-text-main ml-1">
              Bumbu Dasar di Dapur:
            </h3>
            <CheckboxGrid
              options={pantryOptions}
              selectedOptions={selectedPantry}
              onChange={togglePantry}
            />
          </div>
        </div>
      )}

      {/* CTA Button Fixed at Bottom if ingredients exist */}
      {ingredients.length > 0 && !isProcessing && (
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-bg-app via-bg-app to-transparent pt-12">
          <Button
            fullWidth
            onClick={handleGenerateRecipe}
            className="shadow-lg shadow-primary/20"
          >
            Cari Resep Masakan
          </Button>
        </div>
      )}
    </main>
  );
}
