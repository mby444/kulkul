"use client";

import React, { useEffect, useState, useRef } from "react";
import { Camera, Plus, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { CheckboxGrid } from "@/components/CheckboxGrid";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    ingredients,
    setIngredients,
    selectedPantry,
    setSelectedPantry,
    cookingStyle,
    setCookingStyle,
    generatedRecipes,
    setGeneratedRecipes,
    previewUrl,
    setPreviewUrl,
  } = useAppStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [manualInput, setManualInput] = useState("");

  const loadingMessages = [
    "Sedang mendeteksi isi kulkasmu...",
    "Mencari bahan yang tersembunyi...",
    "Menganalisis sayuran dan bumbu...",
    "Membuat daftar bahan ajaib..."
  ];
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isProcessing) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2500);
    } else {
      setLoadingMessageIndex(0);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  const pantryOptions = [
    "Garam",
    "Minyak Goreng",
    "Bawang Putih",
    "Kecap",
    "Cabai",
    "Lada",
    "Gula",
    "Mentega",
  ];
  const styleOptions = [
    "Santai / Ala Kosan",
    "Indonesian Comfort Food",
    "Western Quick Meals",
  ];

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) return resolve(file); // Fallback jika canvas tidak disupport

        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const newFile = new File(
                [blob],
                file.name.replace(/\.[^/.]+$/, "") + ".webp",
                {
                  type: "image/webp",
                  lastModified: Date.now(),
                },
              );
              resolve(newFile);
            } else {
              resolve(file);
            }
          },
          "image/webp",
          0.8,
        ); // Kompres kualitas webp ke 80%
      };

      img.onerror = () =>
        reject(new Error("Gagal meload gambar untuk kompresi"));
      img.src = url;
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi tipe file (MIME)
    if (!file.type.startsWith("image/")) {
      alert("Harap unggah file berupa gambar (JPEG, PNG, webp, dsb).");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    setIsProcessing(true);
    try {
      // Kompresi dan resize gambar
      const compressedFile = await compressImage(file);
      console.log("compressedFile", compressedFile);

      // Validasi ukuran setelah kompresi (opsional pencegahan akhir)
      const MAX_SIZE_MB = 4;
      if (compressedFile.size > MAX_SIZE_MB * 1024 * 1024) {
        alert(`Ukuran gambar terlalu besar! Maksimal ${MAX_SIZE_MB}MB.`);
        setIsProcessing(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      const formData = new FormData();
      formData.append("image", compressedFile);

      const res = await fetch("/api/analyze-image", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error && data.error.message) {
          throw data.error;
        }
        throw new Error("Gagal menganalisis gambar");
      }

      if (data.detected_ingredients) {
        const newIngredients = Array.from(
          new Set([...ingredients, ...data.detected_ingredients]),
        );
        setIngredients(newIngredients);
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Terjadi kesalahan saat memproses gambar.");
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
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
    router.push("/recipes");
  };

  const handleRegenerateRecipe = () => {
    setGeneratedRecipes([]);
    router.push("/recipes");
  };

  return (
    <main className="flex-1 flex flex-col relative bg-bg-app overflow-y-auto">
      {/* Header Back */}
      <div className="sticky top-0 z-20 bg-bg-app/90 backdrop-blur-md px-4 py-4 flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-black/5 rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-text-main" />
        </button>
        <h2 className="font-bold text-text-main text-lg">Input Bahan</h2>
      </div>

      <div className="p-6">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />
        {/* Upload Zone */}
        <div
          className="border-2 border-dashed border-primary/40 bg-primary/5 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-primary/10 transition-colors mb-8 shadow-sm relative overflow-hidden min-h-[200px]"
          onClick={handleUploadClick}
        >
          {previewUrl ? (
            <div className="absolute inset-0 w-full h-full">
              <img src={previewUrl} alt="Preview Kulkas" className="w-full h-full object-cover opacity-60" />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/20">
                <div className="bg-white p-3 rounded-full shadow-md mb-2">
                  <Camera size={24} className="text-primary" />
                </div>
                <h3 className="font-bold text-white text-sm bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">Ganti Foto</h3>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                <Camera size={36} className="text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-1 text-text-main">
                Unggah Foto Isi Kulkas
              </h3>
              <p className="text-sm text-text-muted mt-1">
                Format PNG / JPG
              </p>
            </>
          )}
        </div>

        {isProcessing && (
          <div className="flex flex-col items-center justify-center py-10 animate-in fade-in zoom-in duration-300">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mb-5"></div>
            <p className="text-text-muted font-medium animate-pulse text-center transition-all">
              {loadingMessages[loadingMessageIndex]}
            </p>
          </div>
        )}

        {ingredients.length > 0 && !isProcessing && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Ingredients */}
            <div className="mb-8 bg-white p-5 rounded-2xl shadow-sm border border-border">
              <h3 className="font-bold mb-4 text-text-main flex items-center justify-between">
                Bahan Terdeteksi
                <span className="text-xs bg-secondary/10 text-secondary font-bold px-2.5 py-1 rounded-md">
                  {ingredients.length} item
                </span>
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {ingredients.map((ing) => (
                  <Chip
                    key={ing}
                    label={ing}
                    onRemove={() => handleRemoveIngredient(ing)}
                  />
                ))}
              </div>

              <form
                onSubmit={handleAddManual}
                className="flex gap-2 mt-4 pt-4 border-t border-border"
              >
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
              <h3 className="font-bold mb-2 text-text-main">
                Bumbu Dasar di Dapur
              </h3>
              <p className="text-xs text-text-muted mb-4 leading-relaxed">
                Centang bumbu yang kamu miliki agar resep lebih pas dengan
                keadaan dapurmu.
              </p>
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
                  <label
                    key={style}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${cookingStyle === style ? "border-primary bg-primary/5" : "border-border hover:bg-black/5"}`}
                  >
                    <input
                      type="radio"
                      name="cookingStyle"
                      value={style}
                      checked={cookingStyle === style}
                      onChange={(e) => setCookingStyle(e.target.value)}
                      className="w-5 h-5 accent-primary border-border cursor-pointer"
                    />
                    <span
                      className={`text-sm font-medium ${cookingStyle === style ? "text-primary" : "text-text-main"}`}
                    >
                      {style}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CTA Button Fixed at Bottom if ingredients exist */}
      {ingredients.length > 0 && !isProcessing && (
        <div className="p-6 bg-gradient-to-t from-bg-app via-bg-app/95 to-transparent z-20 flex flex-col gap-3">
          {generatedRecipes.length > 0 ? (
            <>
              <Button
                fullWidth
                onClick={handleGenerateRecipe}
                className="shadow-lg shadow-primary/30 text-lg py-6 h-14"
              >
                Lihat Hasil Resep (Tersimpan)
              </Button>
              <Button
                fullWidth
                variant="outline"
                onClick={handleRegenerateRecipe}
                className="text-lg py-6 h-14 bg-white"
              >
                Buat Resep Baru
              </Button>
            </>
          ) : (
            <Button
              fullWidth
              onClick={handleGenerateRecipe}
              className="shadow-lg shadow-primary/30 text-lg py-6 h-14"
            >
              Cari Resep Masakan <Sparkles className="ml-2" size={20} />
            </Button>
          )}
        </div>
      )}
    </main>
  );
}
