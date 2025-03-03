"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { SystemType, BmiMilestone } from "./types";
import { getBmiClassification, getColorByBmi } from "./utils";

interface BmiResultsProps {
  bmi: number;
  system: SystemType;
  height: number;
  milestones: BmiMilestone[];
}

export function BmiResults({
  bmi,
  system,
  height,
  milestones,
}: BmiResultsProps) {
  const classification = getBmiClassification(bmi);
  const unit = system === "metric" ? "kg" : "lbs";

  if (bmi === 0) return null;

  return (
    <div className="flex flex-col space-y-3 p-4 mt-4 bg-secondary rounded-lg">
      <div className="flex justify-between items-center">
        <p className="text-m font-medium">
          Your BMI: <span className="font-bold text-lg">{bmi}</span>
        </p>
        <Badge
          className={`${getColorByBmi(bmi)} transition-colors text-sm py-1.5`}
        >
          {classification}
        </Badge>
      </div>

      {classification !== "Normal Weight" && milestones.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Weight goals:</p>
          {milestones.map((milestone, index) => (
            <div key={index} className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {bmi < 18.5 ? "Gain" : "Lose"}{" "}
                <span className="font-semibold">{milestone.difference}</span>{" "}
                {unit} to reach:
              </p>
              <Badge
                className={`${getColorByBmi(milestone.targetBmi)} text-xs py-1`}
              >
                {milestone.category}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
