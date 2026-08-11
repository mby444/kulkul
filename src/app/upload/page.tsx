"use client";

import React, { useState } from 'react';
import { Camera, Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Chip } from '@/components/ui/Chip';
import { CheckboxGrid } from '@/components/CheckboxGrid';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';

export default function UploadPage() {
  const router = useRouter();
  
  const { 
    ingredients, 
    setIngredients, 
    selectedPantry, 
    setSelectedPantry,
    cookingStyle,
    setCookingStyle
  } = useAppStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [manualInput, setManualInput] = useState("");
  
  const pantryOptions = ["Garam", "Minyak Goreng", "Bawang Putih", "Kecap", "Cabai", "Lada", "Gula", "Mentega"];
  const styleOptions = ["Santai / Ala Kosan", "Indonesian Comfort Food", "Western Quick Meals"];

  const handleUploadClick = () => {
    setIsProcessing(true);
    setTimeout(() => {
      // Simulate AI returning ingredients
      const dummyDetected = ["Telur", "Tomat", "Daun Bawang", "Sosis"];
      // Merge with existing ingredients
      const newIngredients = Array.from(new Set([...ingredients, ...dummyDetected]));
      setIngredients(newIngredients);
      setIsProcessing(false);
    }, 2000);
  };

  const handleRemoveIngredient = (ing: string) => {
    setIngredients(ingredients.filter(i => i !== ing));
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
      setSelectedPantry(selectedPantry.filter(o => o !== option));
    } else {
      setSelectedPantry([...selectedPantry, option]);
    }
  };

  const handleGenerateRecipe = () => {
    router.push('/recipes');
  };

  return (
    <main className="flex-1 flex flex-col relative bg-bg-app h-full overflow-y-auto">
      
      {/* Header Back */}
      <div className="sticky top-0 z-20 bg-bg-app/90 backdrop-blur-md px-4 py-4 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-black/5 rounded-full transition-colors">
          <ArrowLeft size={24} className="text-text-main" />
        </button>
        <h2 className="font-bold text-text-main text-lg">Input Bahan</h2>
      </div>

      <div className="p-6 pb-28">
        
        {/* Upload Zone */}
        <div 
          className="border-2 border-dashed border-primary/40 bg-primary/5 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-primary/10 transition-colors mb-8 shadow-sm"
          onClick={handleUploadClick}
        >
          <div className="bg-white p-4 rounded-full shadow-sm mb-4">
            <Camera size={36} className="text-primary" />
          </div>
          <h3 className="font-bold text-lg mb-1 text-text-main">Ambil / Upload Foto</h3>
          <p className="text-sm text-text-muted mt-1">Klik untuk mensimulasikan deteksi AI</p>
        </div>

        {isProcessing && (
          <div className="flex flex-col items-center justify-center py-10 animate-in fade-in zoom-in duration-300">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mb-5"></div>
            <p className="text-text-muted font-medium animate-pulse">Sedang mendeteksi isi kulkasmu...</p>
          </div>
        )}

        {ingredients.length > 0 && !isProcessing && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Ingredients */}
            <div className="mb-8 bg-white p-5 rounded-2xl shadow-sm border border-border">
              <h3 className="font-bold mb-4 text-text-main flex items-center justify-between">
                Bahan Terdeteksi
                <span className="text-xs bg-secondary/10 text-secondary font-bold px-2.5 py-1 rounded-md">{ingredients.length} item</span>
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {ingredients.map(ing => (
                  <Chip key={ing} label={ing} onRemove={() => handleRemoveIngredient(ing)} />
                ))}
              </div>
              
              <form onSubmit={handleAddManual} className="flex gap-2 mt-4 pt-4 border-t border-border">
                <input 
                  type="text" 
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="Tambah bahan manual..."
                  className="flex-1 bg-bg-app border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary transition-colors text-text-main"
                />
                <button 
                  type="submit"
                  className="bg-accent text-[#D97706] w-12 h-12 rounded-xl flex items-center justify-center hover:brightness-105 shadow-sm transition-all shrink-0"
                >
                  <Plus size={24} />
                </button>
              </form>
            </div>

            {/* Pantry Staples */}
            <div className="mb-8 bg-white p-5 rounded-2xl shadow-sm border border-border">
              <h3 className="font-bold mb-2 text-text-main">Bumbu Dasar di Dapur</h3>
              <p className="text-xs text-text-muted mb-4 leading-relaxed">Centang bumbu yang kamu miliki agar resep lebih pas dengan keadaan dapurmu.</p>
              <CheckboxGrid 
                options={pantryOptions} 
                selectedOptions={selectedPantry}
                onChange={togglePantry}
              />
            </div>

            {/* Cooking Style */}
            <div className="mb-2 bg-white p-5 rounded-2xl shadow-sm border border-border">
              <h3 className="font-bold mb-4 text-text-main">Gaya Masakan</h3>
              <div className="flex flex-col gap-3">
                {styleOptions.map((style) => (
                  <label key={style} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${cookingStyle === style ? 'border-primary bg-primary/5' : 'border-border hover:bg-black/5'}`}>
                    <input 
                      type="radio" 
                      name="cookingStyle" 
                      value={style}
                      checked={cookingStyle === style}
                      onChange={(e) => setCookingStyle(e.target.value)}
                      className="w-5 h-5 accent-primary border-border cursor-pointer"
                    />
                    <span className={`text-sm font-medium ${cookingStyle === style ? 'text-primary' : 'text-text-main'}`}>{style}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
      
      {/* CTA Button Fixed at Bottom if ingredients exist */}
      {ingredients.length > 0 && !isProcessing && (
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-bg-app via-bg-app/95 to-transparent pt-12 z-20">
          <Button fullWidth onClick={handleGenerateRecipe} className="shadow-lg shadow-primary/30 text-lg py-6 h-14">
            Cari Resep Masakan
          </Button>
        </div>
      )}
    </main>
  );
}
