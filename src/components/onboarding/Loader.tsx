import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";

const greetings = ["Hello.", "Bonjour.", "Ciao.", "Hola.", "Namaste.", "Prajwal."];

export function Loader() {
  const setLoaded = useAppStore((s) => s.setLoaded);
  const [index, setIndex] = useState(0);
  const [pct, setPct] = useState(0);

  // Cycle through greetings
  useEffect(() => {
    if (index === greetings.length - 1) return;
    const timeout = setTimeout(
      () => {
        setIndex(index + 1);
      },
      index === 0 ? 300 : 100, // Read "Hello" slightly longer, then very rapid fire
    );
    return () => clearTimeout(timeout);
  }, [index]);

  // Loading percentage counter
  useEffect(() => {
    const interval = setInterval(() => {
      setPct((prev) => {
        const next = prev + Math.floor(Math.random() * 30) + 20;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoaded(true), 300); // Slide up almost immediately
          return 100;
        }
        return next;
      });
    }, 50); // Very fast interval
    return () => clearInterval(interval);
  }, [setLoaded]);

  return (
    <motion.div
      key="loader"
      exit={{ y: "-100%" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#0a0a0a] text-white"
    >
      <div className="w-full max-w-sm px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-4 text-3xl font-medium sm:text-4xl"
          >
            <span className="h-2 w-2 rounded-full bg-white" />
            {greetings[index]}
          </motion.div>
        </AnimatePresence>

        <div className="mt-16 flex justify-between font-mono text-sm opacity-50">
          <span>Loading</span>
          <span>{Math.min(pct, 100)}%</span>
        </div>
        
        <div className="mt-3 h-[2px] w-full overflow-hidden bg-white/10 rounded-full">
          <motion.div
            className="h-full bg-white rounded-full"
            animate={{ width: `${Math.min(pct, 100)}%` }}
            transition={{ ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}
