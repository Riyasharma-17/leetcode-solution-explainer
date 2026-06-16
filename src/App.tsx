import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { SolutionForm } from "./components/SolutionForm";
import { ResultCard } from "./components/ResultCard";
import { HistoryPanel } from "./components/HistoryPanel";
import { SavedSession, ExplanationResult } from "./types";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  AlertCircle,
  HelpCircle,
  Hash,
  Terminal,
  Activity,
  Award,
  TrendingUp,
  RotateCcw,
  CheckCircle2,
  Bookmark
} from "lucide-react";

export default function App() {
  // Theme management syncing with localstorage & system settings
  const [theme, setTheme] = useState<"light" | "dark" | "system">(() => {
    const saved = localStorage.getItem("leetcode_theme");
    return (saved as "light" | "dark" | "system") || "system";
  });

  // Offline persistent history synchronization
  const [history, setHistory] = useState<SavedSession[]>(() => {
    try {
      const saved = localStorage.getItem("leetcode_history");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Core explanation input states
  const [code, setCode] = useState("");
  const [problemName, setProblemName] = useState("");
  const [language, setLanguage] = useState("Python");
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  // loading + error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExplanationResult | null>(null);

  // Theme Sync on load and change
  useEffect(() => {
    const root = window.document.documentElement;
    const applyTheme = (currentTheme: "light" | "dark" | "system") => {
      if (
        currentTheme === "dark" ||
        (currentTheme === "system" &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      ) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };

    applyTheme(theme);
    localStorage.setItem("leetcode_theme", theme);

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme("system");
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  // Handle active session restoration
  const handleSelectSession = (session: SavedSession) => {
    setCode(session.code);
    setProblemName(session.problemName);
    setLanguage(session.language);
    setResult(session.explanation);
    setActiveSessionId(session.id);
    setError(null);
  };

  // Delete a session
  const handleDeleteSession = (id: string) => {
    const updatedHistory = history.filter((s) => s.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem("leetcode_history", JSON.stringify(updatedHistory));
    if (activeSessionId === id) {
      setActiveSessionId(null);
      setResult(null);
    }
  };

  // Clear all history
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const handleClearAllHistory = () => {
    setHistory([]);
    localStorage.removeItem("leetcode_history");
    setActiveSessionId(null);
    setResult(null);
    setShowClearConfirm(false);
  };

  // Trigger Explain process
  const handleExplain = async () => {
    if (!code.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/explain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          problem: problemName,
          language,
          code,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "An error occurred while generating explanation."
        );
      }

      setResult(data);

      // Save into persistent offline history
      const newSession: SavedSession = {
        id: crypto.randomUUID
          ? crypto.randomUUID()
          : Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        problemName: problemName.trim() ? problemName : `Solution (${language})`,
        language,
        code,
        explanation: data,
      };

      const updatedHistory = [newSession, ...history];
      setHistory(updatedHistory);
      localStorage.setItem("leetcode_history", JSON.stringify(updatedHistory));
      setActiveSessionId(newSession.id);
    } catch (err: any) {
      console.error(err);
      setError(
        err.message ||
          "Failed to analyze your solution. Please verify your internet connection or check if your GEMINI_API_KEY is configured."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setCode("");
    setProblemName("");
    setLanguage("Python");
    setResult(null);
    setActiveSessionId(null);
    setError(null);
  };

  // Generate statistics for persistent progress tracking
  const stats = {
    total: history.length,
    languages: history.reduce((acc, current) => {
      acc[current.language] = (acc[current.language] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    patterns: history.reduce((acc, current) => {
      const patternName = current.explanation.pattern.name;
      if (patternName) {
        acc[patternName] = (acc[patternName] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>),
  };

  const topPatterns = Object.entries(stats.patterns)
    .map(([name, count]) => ({ name, count: count as number }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200 selection:bg-zinc-950 selection:text-white dark:selection:bg-white dark:selection:text-zinc-950">
      <Header theme={theme} onChangeTheme={setTheme} />

      {/* Main Container with subtle black & white luxury gradient backgrounds */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 md:px-8 relative z-10">
        {/* Subtle decorative overlay simulating modern vector high-contrast mesh */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[500px] bg-radial-gradient from-zinc-200/40 via-transparent to-transparent dark:from-zinc-900/10 pointer-events-none -z-10" />

        {/* Hero Section */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-zinc-200 bg-white/80 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-zinc-500 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-350 mb-4 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-zinc-950 dark:text-zinc-100" />
            LeetCode DSA Solution Explainer
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-950 dark:text-white mb-3 uppercase font-sans">
            Understand your code, instantly
          </h2>
          <div className="h-[1px] w-12 bg-zinc-900 dark:bg-white mx-auto mb-4" />
          <p className="text-sm text-zinc-500 max-w-lg mx-auto dark:text-zinc-400">
            Paste your solved algorithms to unlock visual intuitions, Big O complexity limits, architectural patterns, and memory aids.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Input form details (Spans 7) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-zinc-200 rounded p-6 md:p-8 dark:border-zinc-800 dark:bg-zinc-900/10 backdrop-blur-md shadow-xs">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-zinc-955 dark:bg-white animate-pulse" />
                  <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    Input Code Dashboard
                  </h3>
                </div>
                {code && (
                  <button
                    onClick={handleResetForm}
                    className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset Editor
                  </button>
                )}
              </div>

              <SolutionForm
                code={code}
                setCode={setCode}
                problem={problemName}
                setProblem={setProblemName}
                language={language}
                setLanguage={setLanguage}
                onSubmit={handleExplain}
                loading={loading}
              />
            </div>

            {/* Offline Progress & Achievements tracking - Beautiful aesthetic B&W layout */}
            <div className="p-6 rounded border border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/10 backdrop-blur-xs grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  <Award className="w-3.5 h-3.5" />
                  Total Solved
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                    {stats.total}
                  </span>
                  <span className="text-xs text-zinc-450 dark:text-zinc-500 uppercase tracking-wider font-semibold text-[10px]">challenges</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  <Terminal className="w-3.5 h-3.5" />
                  Languages
                </div>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {Object.keys(stats.languages).length === 0 ? (
                    <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-600 italic uppercase tracking-wider">None yet</span>
                  ) : (
                    Object.entries(stats.languages).map(([lang, val]) => (
                      <span
                        key={lang}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-zinc-200 bg-white text-[9px] font-bold font-mono text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                      >
                        {lang}: <span className="font-extrabold">{val}</span>
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  <TrendingUp className="w-3.5 h-3.5" />
                  Top Patterns Used
                </div>
                <div className="flex flex-col gap-1 pt-0.5">
                  {topPatterns.length === 0 ? (
                    <span className="text-[10px] font-bold text-zinc-455 dark:text-zinc-600 italic uppercase tracking-wider">None yet</span>
                  ) : (
                    topPatterns.map(({ name: pName, count }) => (
                      <div
                        key={pName}
                        className="flex items-center justify-between text-[11px] text-zinc-600 dark:text-zinc-400"
                      >
                        <span className="truncate max-w-[120px] font-semibold uppercase text-[9px] tracking-wider text-zinc-500">{pName}</span>
                        <span className="font-bold text-zinc-400 shrink-0 font-mono text-[9px]">
                          x{count}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Results Section & persistent logger list (Spans 5) */}
          <div className="lg:col-span-5 space-y-6">
            <AnimatePresence mode="wait">
              {/* Error prompt displaying nicely */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-5 rounded border border-red-250 bg-red-50/50 text-red-900 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-300 flex items-start gap-3.5 shadow-sm"
                >
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-xs uppercase tracking-wider">Failed to generate explanation</p>
                    <p className="text-xs opacity-90 leading-relaxed font-sans">{error}</p>
                    <button
                      onClick={handleExplain}
                      className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-red-200 bg-red-100 text-[10px] font-bold uppercase tracking-wider hover:bg-red-200 dark:border-red-900 dark:bg-red-950/40 hover:dark:bg-red-900/30 transition-all cursor-pointer"
                    >
                      Try Again
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Loading spinner state */}
              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center p-12 text-center rounded border border-zinc-200 bg-white/50 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/30"
                >
                  {/* Premium customized visual loader */}
                  <div className="relative mb-6">
                    <div className="w-14 h-14 rounded-full border-4 border-zinc-100 dark:border-zinc-900 border-t-zinc-950 dark:border-t-white animate-spin" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-zinc-950 dark:text-white animate-pulse" />
                    </div>
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-900 dark:text-white mb-2">
                    Analyzing your solution...
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed">
                    Connecting to Gemini client to extract structure, Big O runtime boundaries, and algorithms retention strategy...
                  </p>
                </motion.div>
              )}

              {/* Showing Result Cards */}
              {result && !loading && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                      <Bookmark className="w-4 h-4 text-zinc-450" />
                      DSA Study Cards
                    </h3>
                    <div className="text-[9px] px-2 py-0.5 rounded border border-zinc-250 bg-zinc-100/80 text-zinc-650 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-450 font-mono tracking-wider font-bold uppercase">
                      {activeSessionId ? "Loaded from history" : "Generated just now"}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <ResultCard type="intuition" data={result} />
                    <ResultCard type="pattern" data={result} />
                    <ResultCard type="complexity" data={result} />
                    <ResultCard type="memoryTrick" data={result} />
                  </div>
                </motion.div>
              )}

              {/* Empty state when NO result & NOT loading */}
              {!result && !loading && !error && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center p-8 text-center rounded border border-zinc-200 bg-zinc-50/50 dark:border-zinc-805 dark:bg-zinc-900/10 backdrop-blur-xs py-14"
                >
                  <div className="w-12 h-12 rounded bg-white border border-zinc-200 shadow-xs flex items-center justify-center mb-4 dark:bg-zinc-900 dark:border-zinc-800">
                    <HelpCircle className="w-6 h-6 text-zinc-400 dark:text-zinc-600" />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 mb-1.5">
                    No active solution explanations
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed mb-6">
                    Pasted solutions will analyze block-by-block with Gemini to provide structured, beautiful retention cards here.
                  </p>
                  
                  {/* Visual bullet explanation on how it helps */}
                  <div className="text-left w-full max-w-sm space-y-3 p-4 rounded border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950/40 text-[11px] text-zinc-600 dark:text-zinc-450">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-zinc-950 dark:text-zinc-200 shrink-0 mt-0.5" />
                      <span><strong>Intuition</strong>: Translates solution logics into clean conversational English description.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-zinc-950 dark:text-zinc-200 shrink-0 mt-0.5" />
                      <span><strong>Algorithm Pattern</strong>: Identifies standard DSA patterns (e.g. Sliding window, two-pointer, BFS/DFS).</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-zinc-950 dark:text-zinc-200 shrink-0 mt-0.5" />
                      <span><strong>Complexity Limit</strong>: Displays clear Big O time and space bounds under matching formats.</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Offline persistence solutions logger section */}
            <div className="pt-4">
              <HistoryPanel
                history={history}
                onSelectSession={handleSelectSession}
                onDeleteSession={handleDeleteSession}
                onClearAll={() => setShowClearConfirm(true)}
                activeSessionId={activeSessionId || undefined}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Clear confirmations modal with custom beautiful overlay */}
      <AnimatePresence>
        {showClearConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md bg-white border border-zinc-200 rounded p-6 dark:bg-zinc-955 dark:border-zinc-800 shadow-2xl"
            >
              <h3 className="font-sans font-bold text-sm uppercase tracking-widest text-zinc-900 dark:text-white mb-2">
                Clear Solution History?
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
                This action is irreversible. All your offline persistent tracked solutions, algorithm breakdowns, and study cards will be completely deleted.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="px-4 py-2.5 border border-zinc-200 bg-zinc-50 text-zinc-700 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-850 cursor-pointer transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleClearAllHistory}
                  className="px-4 py-2.5 bg-red-650 text-white hover:bg-red-700 rounded text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-all"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Styled Footer */}
      <footer className="border-t border-zinc-200 bg-zinc-50/40 py-6 text-center text-[10.5px] text-zinc-400 font-sans dark:border-zinc-900 dark:bg-zinc-950/20">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-bold uppercase tracking-wider text-[10px] text-zinc-400 dark:text-zinc-500">© 2026 LeetCode Solution Explainer. Powered by Gemini & React</p>
          <div className="flex items-center gap-4 text-zinc-400 dark:text-zinc-500 uppercase tracking-widest font-bold">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Offline System Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
