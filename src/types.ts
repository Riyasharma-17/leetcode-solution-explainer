export interface ExplanationResult {
  intuition: string;
  pattern: {
    name: string;
    reason: string;
  };
  complexity: {
    time: string;
    timeReason: string;
    space: string;
    spaceReason: string;
  };
  memoryTrick: string;
}

export interface SavedSession {
  id: string;
  timestamp: string;
  problemName: string;
  language: string;
  code: string;
  explanation: ExplanationResult;
}
