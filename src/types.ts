/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum ThoughtPattern {
  JUDGMENT = "판단 (Judgment)",
  CRITICISM = "비난 (Criticism)",
  DEMAND = "강요 (Demand)",
  COMPARISON = "비교 (Comparison)",
  DESERVE = "당연시 (Deserving/Taking for granted)",
  RATIONALIZATION = "합리화 (Rationalization)",
}

export interface JournalEntry {
  id: string;
  createdAt: number;
  automaticThought: string;
  patterns: ThoughtPattern[];
  feeling: string;
  coreNeed: string;
  iMessage: string;
  actionPlan: string;
}

export interface SunRecord {
  id: string;
  createdAt: number;
  type: "gratitude" | "service" | "compassion";
  content: string;
}

export interface ChatMessage {
  role: "user" | "model";
  content: string;
}
