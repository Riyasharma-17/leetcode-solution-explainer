import { useMemo, useRef, useEffect, useState } from "react";
import { Play, Sparkles, Terminal, FileText, ChevronDown, ListPlus } from "lucide-react";

interface SolutionFormProps {
  code: string;
  setCode: (code: string) => void;
  problem: string;
  setProblem: (problem: string) => void;
  language: string;
  setLanguage: (lang: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

// Some pre-loaded LeetCode examples to easily allow users to explore and try the app!
const SAMPLE_SOLUTIONS = [
  {
    name: "Two Sum",
    problem: "1. Two Sum (Easy)",
    language: "Python",
    code: `def twoSum(nums: list[int], target: int) -> list[int]:
    prevMap = {} # val -> index
    for i, n in enumerate(nums):
        diff = target - n
        if diff in prevMap:
            return [prevMap[diff], i]
        prevMap[n] = i
    return []`
  },
  {
    name: "Reverse Linked List",
    problem: "206. Reverse Linked List (Easy)",
    language: "Java",
    code: `class Solution {
    public ListNode reverseList(ListNode head) {
        ListNode prev = null;
        ListNode curr = head;
        while (curr != null) {
            ListNode nextTemp = curr.next;
            curr.next = prev;
            prev = curr;
            curr = nextTemp;
        }
        return prev;
    }
}`
  },
  {
    name: "3Sum",
    problem: "15. 3Sum (Medium)",
    language: "C++",
    code: `vector<vector<int>> threeSum(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> res;
    for (int i = 0; i < nums.size(); i++) {
        if (i > 0 && nums[i] == nums[i-1]) continue;
        int l = i + 1, r = nums.size() - 1;
        while (l < r) {
            int sum = nums[i] + nums[l] + nums[r];
            if (sum > 0) r--;
            else if (sum < 0) l--;
            else {
                res.push_back({nums[i], nums[l], nums[r]});
                l++;
                while (nums[l] == nums[l-1] && l < r) l++;
            }
        }
    }
    return res;
}`
  },
  {
    name: "Longest Substring Without Repeating",
    problem: "3. Longest Substring Without Repeating Characters (Medium)",
    language: "JavaScript",
    code: `function lengthOfLongestSubstring(s) {
    let charSet = new Set();
    let l = 0;
    let res = 0;
    for (let r = 0; r < s.length; r++) {
        while (charSet.has(s[r])) {
            charSet.delete(s[l]);
            l += 1;
        }
        charSet.add(s[r]);
        res = Math.max(res, r - l + 1);
    }
    return res;
}`
  }
];

export function SolutionForm({
  code,
  setCode,
  problem,
  setProblem,
  language,
  setLanguage,
  onSubmit,
  loading,
}: SolutionFormProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // Sync scroll of line numbers with details
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Generate lines count
  const lines = useMemo(() => {
    const split = code.split("\n");
    // Ensure always at least one line is drawn
    return split.length > 0 ? split.length : 1;
  }, [code]);

  const selectSample = (sample: typeof SAMPLE_SOLUTIONS[0]) => {
    setCode(sample.code);
    setProblem(sample.problem);
    setLanguage(sample.language);
  };

  return (
    <div className="space-y-6">
      {/* Examples presets for extremely friendly UX */}
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">
          ⚡ Try with a sample solution
        </label>
        <div className="flex flex-wrap gap-2">
          {SAMPLE_SOLUTIONS.map((sample) => (
            <button
              key={sample.name}
              type="button"
              onClick={() => selectSample(sample)}
              className="px-3 py-1.5 rounded border border-zinc-200 bg-zinc-50 text-xs font-semibold hover:bg-zinc-100 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-350 dark:hover:bg-zinc-900 dark:hover:border-zinc-700 transition-all cursor-pointer uppercase tracking-wider text-[10px]"
            >
              {sample.name} ({sample.language})
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Problem Name */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            Problem name or number (optional)
          </label>
          <input
            type="text"
            placeholder="e.g. 1. Two Sum, 15. 3Sum, etc."
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            className="w-full bg-zinc-50 border border-zinc-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 dark:bg-zinc-900/40 dark:border-zinc-800 dark:text-zinc-100 dark:focus:ring-white dark:focus:border-white transition-all"
          />
        </div>

        {/* Programming Language Dropdown */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5" />
            Language
          </label>
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full appearance-none bg-zinc-50 border border-zinc-200 rounded px-4 py-2.5 text-sm focus:outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 dark:bg-zinc-900/40 dark:border-zinc-800 dark:text-zinc-100 dark:focus:ring-white dark:focus:border-white transition-all pr-10 cursor-pointer"
            >
              <option value="Python">Python</option>
              <option value="Java">Java</option>
              <option value="C++">C++</option>
              <option value="JavaScript">JavaScript</option>
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Code Textarea Editor-like */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center justify-between">
          <span className="flex items-center gap-1.5">Code Input</span>
          <span className="text-[10px] font-mono font-medium text-zinc-400 dark:text-zinc-500 tracking-tight">
            ({lines} lines)
          </span>
        </label>
        
        {/* Editor container with dark background of code area */}
        <div className="relative flex rounded border border-zinc-200 bg-zinc-950 overflow-hidden dark:border-zinc-800 shadow-md">
          {/* Editor Header / Chrome tab bar */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-zinc-900/60 border-b border-zinc-900 flex items-center px-4 gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-850" />
            <span className="w-2.5 h-2.5 rounded-full bg-zinc-900" />
            <span className="text-[10px] font-mono text-zinc-500 ml-2 font-bold uppercase tracking-wider">
              solution.{language === "Python" ? "py" : language === "Java" ? "java" : language === "C++" ? "cpp" : "js"}
            </span>
          </div>

          {/* Code Body details */}
          <div className="flex w-full mt-8 font-mono text-[11.5px] leading-relaxed">
            {/* Real-time Line numbers gutter */}
            <div
              ref={lineNumbersRef}
              className="w-10 select-none bg-zinc-900/30 text-right pr-2 text-zinc-700 font-mono py-4 border-r border-zinc-900 overflow-hidden text-[10px] select-none"
              style={{ height: "300px" }}
            >
              {Array.from({ length: lines }).map((_, i) => (
                <div key={i} className="h-[20px] pr-1">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Core Textarea */}
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onScroll={handleScroll}
              placeholder={`// Paste your LeetCode solution here...\n\n// Example:\n// function twoSum(nums, target) {\n//   ...\n// }`}
              className="flex-1 w-full bg-transparent text-zinc-300 font-mono p-4 outline-none resize-none overflow-y-auto block text-[11.5px]"
              style={{
                height: "300px",
                lineHeight: "20px",
                whiteSpace: "pre",
                wordBreak: "keep-all"
              }}
              spellCheck={false}
            />
          </div>
        </div>
      </div>

      {/* Explain My Solution Button */}
      <button
        onClick={onSubmit}
        disabled={loading || !code.trim()}
        className={`w-full py-4 rounded font-bold uppercase text-xs tracking-widest hover:bg-zinc-200 transition-all active:scale-[0.98] duration-150 flex items-center justify-center gap-2 cursor-pointer ${
          loading || !code.trim()
            ? "bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-not-allowed dark:bg-zinc-900 dark:text-zinc-650 dark:border-zinc-800"
            : "bg-zinc-950 text-white border border-zinc-950 hover:bg-zinc-850 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 dark:border-white"
        }`}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Analyzing your solution...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            Explain My Solution
          </>
        )}
      </button>
    </div>
  );
}
