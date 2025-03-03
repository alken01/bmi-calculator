"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface MetricFormProps {
  heightCm: number | "";
  weightKg: number | "";
  setHeightCm: (value: number | "") => void;
  setWeightKg: (value: number | "") => void;
}

export function MetricForm({
  heightCm,
  weightKg,
  setHeightCm,
  setWeightKg,
}: MetricFormProps) {
  return (
    <div className="grid w-full items-center gap-4">
      <div className="flex flex-col space-y-1.5">
        <div className="flex w-full items-center space-x-2">
          <Label htmlFor="height" className="text-base">
            Height
          </Label>
          <Badge variant="secondary">cm</Badge>
        </div>
        <Input
          id="height"
          placeholder="Enter height in cm"
          type="number"
          inputMode="numeric"
          min="1"
          max="300"
          value={heightCm}
          onChange={(e) => {
            let value = Number(e.target.value);
            if (value > 300) value = 300;
            setHeightCm(value === 0 ? "" : value);
          }}
          className="focus:ring-2 focus:ring-offset-2 text-base py-6"
        />
      </div>
      <div className="flex flex-col space-y-1.5">
        <div className="flex w-full items-center space-x-2">
          <Label htmlFor="weight" className="text-base">
            Weight
          </Label>
          <Badge variant="secondary">kg</Badge>
        </div>
        <Input
          id="weight"
          placeholder="Enter weight in kg"
          type="number"
          inputMode="numeric"
          min="1"
          max="500"
          value={weightKg}
          onChange={(e) => {
            let value = Number(e.target.value);
            if (value > 650) value = 650;
            setWeightKg(value === 0 ? "" : Number(value));
          }}
          className="focus:ring-2 focus:ring-offset-2 text-base py-6"
        />
      </div>
    </div>
  );
}
