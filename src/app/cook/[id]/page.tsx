"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  ChevronRight,
  ChevronLeft,
  Timer as TimerIcon,
  ArrowLeft,
  RotateCcw,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import useIsHydrated from "@/hooks/useIsHydrated";
import { Button } from "@/components/ui/Button";

import confetti from "canvas-confetti";

// Simple Timer Component inside file
const StepTimer = ({ seconds }: { seconds: number }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [isActive, setIsActive] = useState(false);

  // Play audio when timeLeft == 0
  const playSuccessChime = () => {
    try {
      const ctx = new (
        window.AudioContext || (window as any).webkitAudioContext
      )();
      const playNote = (freq: number, startTime: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
        gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
        gain.gain.linearRampToValueAtTime(
          0.5,
          ctx.currentTime + startTime + 0.05,
        );
        gain.gain.exponentialRampToValueAtTime(
          0.01,
          ctx.currentTime + startTime + 0.5,
        );
        osc.start(ctx.currentTime + startTime);
        osc.stop(ctx.currentTime + startTime + 0.6);
      };
      playNote(523.25, 0); // C5
      playNote(659.25, 0.15); // E5
      playNote(783.99, 0.3); // G5
      playNote(1046.5, 0.45); // C6
    } catch (e) {
      console.error("Audio error", e);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            playSuccessChime();
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  useEffect(() => {
    // reset timer when seconds prop changes (step changes)
    setTimeLeft(seconds);
    setIsActive(false);
  }, [seconds]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setTimeLeft(seconds);
    setIsActive(false);
  };

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const displayTime = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

  return (
    <div className="bg-primary/5 border border-primary/20 p-5 rounded-2xl flex items-center justify-between mt-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-4">
        <div className="bg-primary text-white p-3 rounded-full shadow-sm">
          <TimerIcon size={24} />
        </div>
        <div>
          <p className="text-xs font-bold text-text-muted mb-1">
            Timer Langkah Ini
          </p>
          <p className="text-2xl font-black text-primary font-mono tracking-wider">
            {displayTime}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={resetTimer}
          className="bg-transparent px-3 py-3 rounded-xl text-text-muted hover:bg-black/5 transition-colors"
          title="Reset Timer"
        >
          <RotateCcw size={18} />
        </button>
        <button
          onClick={toggleTimer}
          className="bg-white px-5 py-3 rounded-xl text-sm font-bold text-primary shadow-sm border border-border hover:bg-primary hover:text-white transition-colors"
        >
          {isActive ? "Jeda" : timeLeft === seconds ? "Mulai" : "Lanjut"}
        </button>
      </div>
    </div>
  );
};

export default function CookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();
  const isHydrated = useIsHydrated();
  const {
    generatedRecipes,
    currentCookStep,
    setCurrentCookStep,
    clearSession,
  } = useAppStore();
  const [isFinishing, setIsFinishing] = useState(false);

  const recipe = generatedRecipes.find((r) => r.id === id);

  if (!isHydrated) {
    return (
      <div className="flex-1 flex items-center justify-center bg-bg-app">
        <div className="animate-spin rounded-full h-10 w-10 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-bg-app">
        <h3 className="font-bold text-text-main text-xl mb-2">
          Resep Tidak Ditemukan
        </h3>
        <p className="text-text-muted mb-8">
          Resep tidak ditemukan atau sesi telah berakhir.
        </p>
        <Button onClick={() => router.replace("/")}>Kembali ke Beranda</Button>
      </div>
    );
  }

  const totalSteps = recipe.steps.length;
  const currentStepData =
    recipe.steps.find((s) => s.step_number === currentCookStep) ||
    recipe.steps[0];

  // Progress Calculation
  const progressPercentage = (currentCookStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentCookStep < totalSteps) {
      setCurrentCookStep(currentCookStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentCookStep > 1) {
      setCurrentCookStep(currentCookStep - 1);
    }
  };

  const handleFinish = () => {
    setIsFinishing(true);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
    });

    setTimeout(() => {
      clearSession();
      router.replace("/");
    }, 3000);
  };

  return (
    <main className="flex-1 flex flex-col relative bg-white h-full overflow-y-auto">
      {/* Sticky Header with Progress */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-5 border-b border-border shadow-sm">
        <div className="flex justify-between items-center mb-4 gap-2">
          <div className="flex items-center gap-3 overflow-hidden">
            <button
              onClick={() => router.push("/recipes")}
              className="p-1.5 hover:bg-black/5 rounded-full transition-colors shrink-0"
              title="Kembali ke Daftar Resep"
            >
              <ArrowLeft size={20} className="text-text-main" />
            </button>
            <h2 className="font-bold text-text-main text-lg truncate pr-4">
              {recipe.title}
            </h2>
          </div>
          <span className="text-xs font-black text-primary bg-primary/10 px-3 py-1.5 rounded-full shrink-0">
            Langkah {currentCookStep}/{totalSteps}
          </span>
        </div>
        <div className="w-full bg-border rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div
        className="p-6 flex-1 flex flex-col justify-center animate-in fade-in slide-in-from-right-4 duration-500"
        key={currentCookStep}
      >
        <div className="bg-bg-app border border-border p-8 rounded-3xl shadow-sm text-center flex-1 flex flex-col items-center justify-center">
          <h3 className="text-text-muted text-xs font-bold uppercase tracking-widest mb-6 bg-white px-4 py-1.5 rounded-full border border-border">
            Instruksi
          </h3>
          <p className="text-2xl leading-relaxed text-text-main font-medium">
            {currentStepData.instruction}
          </p>
        </div>

        {currentStepData.timer_seconds > 0 && (
          <StepTimer seconds={currentStepData.timer_seconds} />
        )}
      </div>

      {/* Sticky Bottom Navigation */}
      <div className="sticky bottom-0 bg-white border-t border-border p-6 flex items-center justify-between gap-4 z-20">
        <button
          onClick={handlePrev}
          disabled={currentCookStep === 1}
          className={`p-4 rounded-xl border border-border flex items-center justify-center transition-colors ${currentCookStep === 1 ? "opacity-50 bg-black/5 cursor-not-allowed text-text-muted" : "hover:bg-black/5 text-text-main"}`}
        >
          <ChevronLeft size={24} />
        </button>

        {currentCookStep === totalSteps ? (
          <Button
            onClick={handleFinish}
            disabled={isFinishing}
            className="flex-1 h-14 text-lg"
          >
            {isFinishing ? (
              "Yey, Selesai! 🎉"
            ) : (
              <>
                Selesai <Check size={20} className="ml-2 inline" />
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className="flex-1 h-14 text-lg bg-text-main text-white hover:bg-black"
          >
            Lanjut <ChevronRight size={20} className="ml-2" />
          </Button>
        )}
      </div>
    </main>
  );
}
