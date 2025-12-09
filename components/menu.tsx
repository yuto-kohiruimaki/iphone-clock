"use client";

import React, { useState, useEffect } from "react";
import { X, Timer, Pause, Play, Coffee, RotateCcw, LampDesk } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type TimerMode = "focus" | "break";
type TimerStatus = "idle" | "running" | "paused";

const FOCUS_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export default function Menu() {
  const [isVisible, setIsVisible] = useState(true);
  const [mode, setMode] = useState<TimerMode>("focus");
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [timeLeft, setTimeLeft] = useState(FOCUS_TIME);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (status === "running" && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer finished
      if (mode === "focus") {
        setMode("break");
        setTimeLeft(BREAK_TIME);
        setStatus("idle"); // Auto-pause or auto-start? Let's auto-pause to let user take a breath
      } else {
        setMode("focus");
        setTimeLeft(FOCUS_TIME);
        setStatus("idle");
      }
    }

    return () => clearInterval(interval);
  }, [status, timeLeft, mode]);

  const toggleTimer = () => {
    if (status === "idle" || status === "paused") {
      setStatus("running");
    } else {
      setStatus("paused");
    }
  };

  const resetTimer = () => {
    setStatus("idle");
    setMode("focus");
    setTimeLeft(FOCUS_TIME);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const totalTime = mode === "focus" ? FOCUS_TIME : BREAK_TIME;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <>
      {/* Top Right Donut Timer */}
      <AnimatePresence>
        {(status !== "idle" || timeLeft !== FOCUS_TIME) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-6 right-6 z-50 flex items-center justify-center"
          >
            <div className="relative flex items-center justify-center w-16 h-16">
              {/* Background Circle */}
              <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 64 64">
                <circle
                  cx="32"
                  cy="32"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-white/10"
                />
                {/* Progress Circle */}
                <circle
                  cx="32"
                  cy="32"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className={`transition-all duration-500 ease-in-out ${
                    mode === "focus" ? "text-emerald-500" : "text-blue-500"
                  }`}
                />
              </svg>
              {/* Icon */}
              <div className="absolute inset-0 flex items-center justify-center text-white/90">
                {mode === "focus" ? (
                  <LampDesk size={20} />
                ) : (
                  <Coffee size={20} />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Right Menu */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        <AnimatePresence mode="wait">
          {isVisible ? (
            <motion.div
              key="menu"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="relative flex items-center gap-2 px-4 py-3 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl"
            >
              {status !== "idle" || timeLeft !== FOCUS_TIME ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleTimer}
                    className="p-2 rounded-full hover:bg-white/20 text-white/90 transition-colors"
                  >
                    {status === "running" ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  
                  <div className="flex flex-col items-start min-w-[60px]">
                    <span className="text-sm font-mono font-bold text-white leading-none">
                      {formatTime(timeLeft)}
                    </span>
                    <span className="text-[10px] text-white/70 uppercase font-medium leading-none mt-1">
                      {mode === "focus" ? "Focus" : "Break"}
                    </span>
                  </div>

                  <button
                    onClick={resetTimer}
                    className="p-2 rounded-full hover:bg-white/20 text-white/90 transition-colors"
                    aria-label="Reset"
                  >
                    <RotateCcw size={18} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={toggleTimer}
                  className="p-2 rounded-full hover:bg-white/20 text-white/90 transition-colors flex items-center gap-2"
                  aria-label="Start Timer"
                >
                  <Timer size={24} />
                </button>
              )}

              <div className="w-px h-6 bg-white/20 mx-1" />
              
              <button
                onClick={() => setIsVisible(false)}
                className="p-2 rounded-full hover:bg-white/20 text-white/90 transition-colors"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </motion.div>
          ) : (
            <motion.button
              key="trigger"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsVisible(true)}
              className="relative p-3 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 shadow-xl text-white/90 hover:bg-white/20 transition-colors overflow-hidden"
              aria-label="Open menu"
            >
               {status === "running" ? (
                  <div className="absolute inset-0 bg-emerald-500/20 animate-pulse" />
               ) : null}
              <Timer size={24} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
