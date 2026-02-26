"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setDone(true), 600);
          return 100;
        }
        return prev + 1;
      });
    }, 18);

    return () => clearInterval(interval);
  }, []);

  const letters = ["M", "A", "K", "N", "E"];

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ y: 0 }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{
            duration: 1,
            ease: [0.83, 0, 0.17, 1], 
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#000]"
        >
          {/* MAKNE Animated Text */}
          <div className="relative flex gap-4">
            {letters.map((letter, index) => (
              <motion.span
                key={index}
                initial={{ y: 60, opacity: 0, filter: "blur(10px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                transition={{
                  delay: index * 0.15,
                  duration: 0.6,
                  ease: "easeOut",
                }}
                className="text-[120px] font-bold tracking-tight text-white"
              >
                {letter}
              </motion.span>
            ))}
          </div>

          {/* Percentage */}
          <motion.div
            className="absolute bottom-12 left-12 text-3xl font-semibold text-[#636EE1]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {progress}%
          </motion.div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 h-[3px] bg-[#636EE1] transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}