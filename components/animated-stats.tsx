"use client";

import { useEffect, useState } from "react";

interface StatProps {
  target: number;
  suffix: string;
  label: string;
  duration?: number;
}

function AnimatedStat({ target, suffix, label, duration = 2000 }: StatProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(target * easeOutQuart);
      
      setCount(current);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [target, duration]);

  return (
    <div>
      <div className="text-4xl font-bold text-brand-secondary mb-2 mt-[3.75rem]">
        {count}{suffix}
      </div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
}

export default function AnimatedStats() {
  return (
    <section className="pt-0 pb-16 bg-white border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <AnimatedStat target={150} suffix="K+" label="Professionals" />
          <AnimatedStat target={50} suffix="K+" label="Jobs Posted" />
          <AnimatedStat target={10} suffix="K+" label="Companies" />
          <AnimatedStat target={95} suffix="%" label="Success Rate" />
        </div>
      </div>
    </section>
  );
}

