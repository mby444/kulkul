import React from 'react';
import Link from 'next/link';
import { Camera, UtensilsCrossed, Sparkles, ChefHat } from 'lucide-react';

export default function LandingPage() {
  const quickRecipes = [
    { title: "Nasi Goreng Sisa", time: "10 menit", difficulty: "Mudah" },
    { title: "Telur Dadar Mie", time: "12 menit", difficulty: "Mudah" },
    { title: "Tumis Sayur Sosis", time: "15 menit", difficulty: "Sedang" },
  ];

  return (
    <main className="flex-1 flex flex-col relative overflow-y-auto pb-8 bg-bg-app">
      {/* Header Greeting */}
      <header className="px-6 pt-10 pb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-text-main font-sans">Halo, mau masak apa hari ini? 👋</h2>
          <p className="text-text-muted text-sm mt-1">Kulik isi kulkasmu, masak lezat tanpa pusing!</p>
        </div>
        <div className="bg-primary/10 p-2 rounded-xl">
          <UtensilsCrossed className="text-primary" size={24} />
        </div>
      </header>

      {/* Hero CTA Banner */}
      <div className="px-6 mb-10">
        <div className="bg-primary rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-2 pr-10">Punya Sisa Bahan di Kulkas?</h3>
            <p className="text-white/80 text-sm mb-6 max-w-[90%] leading-relaxed">
              Foto bahan makananmu sekarang, biar AI racikkan resep lezatnya dalam hitungan detik!
            </p>
            <Link href="/upload" className="block">
              <button className="bg-white text-primary font-bold px-5 py-3.5 rounded-xl flex items-center gap-2 hover:bg-white/90 transition-colors w-full justify-center shadow-sm">
                <Camera size={20} />
                Mulai Kulik Kulkas
              </button>
            </Link>
          </div>
          {/* Decorative element */}
          <Sparkles className="absolute top-4 right-4 text-white/20" size={80} strokeWidth={1} />
        </div>
      </div>

      {/* Quick Recipe Carousel */}
      <div className="mb-10">
        <h3 className="font-bold text-text-main px-6 mb-4">Resep Kilat Bahan Seadanya</h3>
        <div className="flex overflow-x-auto px-6 gap-4 pb-4" style={{ scrollbarWidth: 'none' }}>
          {quickRecipes.map((recipe, idx) => (
            <div key={idx} className="min-w-[200px] bg-white border border-border rounded-2xl p-4 shadow-sm flex flex-col justify-between gap-4">
              <div className="h-28 bg-primary/5 rounded-xl flex items-center justify-center">
                <ChefHat className="text-primary/30" size={40} />
              </div>
              <div>
                <h4 className="font-bold text-text-main text-sm">{recipe.title}</h4>
                <div className="flex gap-2 mt-3">
                  <span className="text-[10px] font-medium px-2 py-1 bg-secondary/10 text-secondary rounded-full flex items-center gap-1">
                    ⏱️ {recipe.time}
                  </span>
                  <span className="text-[10px] font-medium px-2 py-1 bg-accent/20 text-[#D97706] rounded-full flex items-center gap-1">
                    ⭐ {recipe.difficulty}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About Section */}
      <div className="mx-6 mb-8 bg-white p-6 rounded-2xl border border-border shadow-sm flex gap-4 items-start">
        <div className="bg-primary/10 p-3 rounded-xl shrink-0">
          <Sparkles className="text-primary" size={24} />
        </div>
        <div>
          <h3 className="font-bold text-text-main text-sm mb-2">Tentang KulKul</h3>
          <p className="text-text-muted text-xs leading-relaxed">
            KulKul adalah asisten dapur pintar yang membantu kamu mendeteksi bahan makanan dari foto kulkas, mengurangi food waste, dan menyajikan panduan langkah memasak interaktif yang bebas ribet.
          </p>
        </div>
      </div>

      {/* Stepper Guide */}
      <div className="mb-8 bg-white p-6 mx-6 rounded-2xl border border-border shadow-sm">
        <h3 className="font-bold text-text-main mb-6">Cara Pakai KulKul</h3>
        
        <div className="flex gap-4 mb-2">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm shrink-0 z-10">1</div>
            <div className="w-0.5 h-8 bg-border my-1 shrink-0"></div>
          </div>
          <div className="pb-4">
            <h4 className="font-bold text-text-main text-sm">📸 Foto Isi Kulkas</h4>
            <p className="text-text-muted text-xs mt-1 leading-relaxed">Ambil atau upload foto sisa bahan makanan yang ada di kulkasmu.</p>
          </div>
        </div>

        <div className="flex gap-4 mb-2">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm shrink-0 z-10">2</div>
            <div className="w-0.5 h-8 bg-border my-1 shrink-0"></div>
          </div>
          <div className="pb-4">
            <h4 className="font-bold text-text-main text-sm">🤖 AI Racik Resep</h4>
            <p className="text-text-muted text-xs mt-1 leading-relaxed">KulKul mendeteksi bahan otomatis dan meracik pilihan resep lezat.</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-sm shrink-0 z-10">3</div>
          </div>
          <div>
            <h4 className="font-bold text-text-main text-sm">🍳 Masak Tanpa Pusing</h4>
            <p className="text-text-muted text-xs mt-1 leading-relaxed">Pilih resep favoritmu dan ikuti mode memasak interaktif langkah demi langkah.</p>
          </div>
        </div>
      </div>

    </main>
  );
}
