export type SystemType = "metric" | "imperial";

export interface BmiMilestone {
  category: string;
  targetBmi: number;
  difference: string;
}