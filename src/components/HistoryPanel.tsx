import { SavedSession } from "../types";
import { BookOpen, Trash2, Calendar, Code, ChevronRight } from "lucide-react";

interface HistoryPanelProps {
  history: SavedSession[];
  onSelectSession: (session: SavedSession) => void;
  onDeleteSession: (id: string) => void;
  onClearAll: () => void;
  activeSessionId?: string;
}

export function HistoryPanel({
  history,
  onSelectSession,
  onDeleteSession,
  onClearAll,
  activeSessionId,
}: HistoryPanelProps) {
  const formatDate = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      return date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-50/50 rounded border border-zinc-200 dark:bg-zinc-950/20 dark:border-zinc-805 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-650 dark:text-zinc-350">
            Saved Solutions ({history.length})
          </h3>
        </div>
        {history.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 hover:text-red-500 dark:text-zinc-500 dark:hover:text-red-400 transition-colors cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[350px] md:max-h-[600px]">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Code className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mb-2 stroke-[1.5]" />
            <p className="text-xs text-zinc-450 dark:text-zinc-600 font-sans font-medium">
              No saved solutions yet.
            </p>
            <p className="text-[10px] tracking-tight text-zinc-450 dark:text-zinc-500 font-sans mt-1 max-w-[200px]">
              Your analyzed LeetCode solutions will persist offline here.
            </p>
          </div>
        ) : (
          history.map((session) => {
            const isActive = session.id === activeSessionId;
            return (
              <div
                key={session.id}
                className={`group relative flex items-center justify-between p-3.5 rounded border transition-all cursor-pointer ${
                  isActive
                    ? "bg-zinc-950 border-zinc-900 dark:bg-zinc-200 dark:border-zinc-300"
                    : "bg-white border-zinc-200 hover:border-zinc-400 dark:bg-zinc-900/30 dark:border-zinc-800 dark:hover:border-zinc-600"
                }`}
                onClick={() => onSelectSession(session)}
              >
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider font-mono ${
                        isActive
                          ? "bg-zinc-800 text-zinc-200 dark:bg-zinc-300 dark:text-zinc-800"
                          : "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300"
                      }`}
                    >
                      {session.language}
                    </span>
                    <span
                      className={`text-[9px] flex items-center gap-1 ${
                        isActive
                          ? "text-zinc-400 dark:text-zinc-500"
                          : "text-zinc-400 dark:text-zinc-500"
                      }`}
                    >
                      <Calendar className="w-3 h-3" />
                      {formatDate(session.timestamp)}
                    </span>
                  </div>
                  <h4
                    className={`font-sans text-xs font-semibold truncate ${
                      isActive
                        ? "text-white dark:text-zinc-955"
                        : "text-zinc-800 dark:text-zinc-200"
                    }`}
                  >
                    {session.problemName}
                  </h4>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className={`p-1.5 rounded transition-all ${
                      isActive
                        ? "text-zinc-400 hover:text-red-400 hover:bg-zinc-803/50 dark:text-zinc-500 dark:hover:text-red-600 dark:hover:bg-zinc-200"
                        : "text-zinc-400 hover:text-red-500 hover:bg-zinc-100 dark:text-zinc-500 dark:hover:text-red-400 dark:hover:bg-zinc-800"
                    }`}
                    title="Delete solution"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${
                      isActive
                        ? "text-white dark:text-zinc-955"
                        : "text-zinc-400 dark:text-zinc-550"
                    }`}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
