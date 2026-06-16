import { useState } from "react";
import { motion } from "motion/react";
import { Copy, Check, Lightbulb, Puzzle, Timer, Brain } from "lucide-react";
import { ExplanationResult } from "../types";

interface ResultCardProps {
  type: "intuition" | "pattern" | "complexity" | "memoryTrick";
  data: ExplanationResult;
}

export function ResultCard({ type, data }: ResultCardProps) {
  const [copied, setCopied] = useState(false);

  const getCardDetails = () => {
    switch (type) {
      case "intuition":
        return {
          title: "Intuition",
          icon: <Lightbulb className="w-5 h-5 text-neutral-900 dark:text-neutral-100" />,
          emoji: "💡",
          copyText: `Intuition:\n${data.intuition}`,
        };
      case "pattern":
        return {
          title: "Pattern Used",
          icon: <Puzzle className="w-5 h-5 text-neutral-900 dark:text-neutral-100" />,
          emoji: "🧩",
          copyText: `Pattern Used: ${data.pattern.name}\nReasoning: ${data.pattern.reason}`,
        };
      case "complexity":
        return {
          title: "Time & Space Complexity",
          icon: <Timer className="w-5 h-5 text-neutral-900 dark:text-neutral-100" />,
          emoji: "⏱️",
          copyText: `Complexity:\n- Time Complexity: ${data.complexity.time} (${data.complexity.timeReason})\n- Space Complexity: ${data.complexity.space} (${data.complexity.spaceReason})`,
        };
      case "memoryTrick":
        return {
          title: "How to Remember This",
          icon: <Brain className="w-5 h-5 text-neutral-900 dark:text-neutral-100" />,
          emoji: "🧠",
          copyText: `How to Remember:\n${data.memoryTrick}`,
        };
    }
  };

  const details = getCardDetails();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(details.copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative flex flex-col justify-between overflow-hidden rounded border border-zinc-200 bg-zinc-50/50 p-5 backdrop-blur-md transition-all hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-zinc-500 group"
    >
      {/* Subtle top indicator line matching the theme */}
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-zinc-200 dark:bg-zinc-800 transition-all group-hover:bg-zinc-400 dark:group-hover:bg-zinc-500" />

      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl leading-none">{details.emoji}</span>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              {details.title}
            </h3>
          </div>

          <button
            onClick={handleCopy}
            className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-white transition-colors cursor-pointer"
            title="Copy to clipboard"
          >
            {copied ? (
              <span className="text-emerald-600 dark:text-emerald-400">Copled!</span>
            ) : (
              "Copy"
            )}
          </button>
        </div>

        {/* Card Content Custom Layouts */}
        <div className="font-sans text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          {type === "intuition" && <p>{data.intuition}</p>}

          {type === "pattern" && (
            <div className="space-y-2">
              <div className="inline-flex rounded border border-zinc-200 bg-zinc-100/80 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                {data.pattern.name}
              </div>
              <p className="mt-2 text-zinc-350">{data.pattern.reason}</p>
            </div>
          )}

          {type === "complexity" && (
            <div className="space-y-3">
              <div>
                <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-0.5">Time</div>
                <div className="text-sm text-zinc-900 dark:text-zinc-200 font-mono font-medium">
                  {data.complexity.time} <span className="text-xs text-zinc-400 dark:text-zinc-500 font-sans tracking-tight font-normal">— {data.complexity.timeReason}</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-0.5">Space</div>
                <div className="text-sm text-zinc-900 dark:text-zinc-200 font-mono font-medium">
                  {data.complexity.space} <span className="text-xs text-zinc-400 dark:text-zinc-500 font-sans tracking-tight font-normal">— {data.complexity.spaceReason}</span>
                </div>
              </div>
            </div>
          )}

          {type === "memoryTrick" && (
            <div className="rounded border border-zinc-200/60 bg-zinc-100/30 p-4.5 italic dark:border-zinc-800/80 dark:bg-zinc-900/20">
              <p className="not-italic text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5">Mnemonic Aid</p>
              <p className="text-zinc-600 dark:text-zinc-300">"{data.memoryTrick}"</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
