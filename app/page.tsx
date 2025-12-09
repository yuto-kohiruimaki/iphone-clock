"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!time) return null;

  const timeOptions: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Tokyo",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  };

  const timeString = new Intl.DateTimeFormat("ja-JP", timeOptions).format(time);
  const dateString = new Intl.DateTimeFormat("en-US", dateOptions).format(time);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#050505] text-[#e0e0e0] overflow-hidden relative selection:bg-white/20">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-[#1a1a1a] via-[#000000] to-[#000000] opacity-80"></div>
      
      <main className="flex flex-col items-center justify-center w-[95%] h-[90vh] relative z-10">

        <div className="flex flex-col items-center justify-between w-full h-full z-10 px-4 gap-0">
          <div className="text-2xl md:text-4xl font-(family-name:--font-noto-sans-jp) text-white/70 tracking-widest font-thin">
            {dateString}
          </div>

          <div className="h-px w-40 bg-linear-to-r from-transparent via-white/20 to-transparent my-1"></div>

          <div className="flex items-center justify-center flex-1 w-full min-w-0 px-2">
            <div
              className="text-[28vw] font-(family-name:--font-noto-sans) font-thin tracking-tight tabular-nums leading-none drop-shadow-2xl bg-linear-to-b from-white to-white/80 bg-clip-text text-transparent whitespace-nowrap"
              style={{ transform: 'scaleX(0.8)' }}
            >
              {timeString}
            </div>
          </div>

          <div className="text-xl md:text-2xl font-(family-name:--font-noto-sans) tracking-[0.3em] uppercase text-white/70 font-thin">
            Tokyo
          </div>
        </div>
      </main>
    </div>
  );
}
