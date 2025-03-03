"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface ImperialFormProps {
  heightFeet: number | "";
  heightInches: number | "";
  weightLbs: number | "";
  setHeightFeet: (value: number | "") => void;
  setHeightInches: (value: number | "") => void;
  setWeightLbs: (value: number | "") => void;
}

export function ImperialForm({
  heightFeet,
  heightInches,
  weightLbs,
  setHeightFeet,
  setHeightInches,
  setWeightLbs,
}: ImperialFormProps) {
  return (
    <div className="grid w-full items-center gap-4">
      <div className="flex flex-col space-y-1.5">
        <div className="flex w-full items-center space-x-2">
          <Label htmlFor="heightFeet" className="text-base">
            Height
          </Label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2">
            <Input
              id="heightFeet"
              placeholder="Feet"
              type="number"
              inputMode="numeric"
              min="1"
              max="10"
              value={heightFeet}
              onChange={(e) => {
                let value = Number(e.target.value);
                if (value > 10) value = 10;
                setHeightFeet(value === 0 ? "" : value);
              }}
              className="focus:ring-2 focus:ring-offset-2 text-base py-6"
            />
            <Badge variant="secondary">ft</Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              id="heightInches"
              placeholder="Inches"
              type="number"
              inputMode="numeric"
              min="0"
              max="11"
              value={heightInches}
              onChange={(e) => {
                let value = Number(e.target.value);
                if (value > 11) value = 11;
                setHeightInches(value === 0 ? "" : value);
              }}
              className="focus:ring-2 focus:ring-offset-2 text-base py-6"
            />
            <Badge variant="secondary">in</Badge>
          </div>
        </div>
      </div>
      <div className="flex flex-col space-y-1.5">
        <div className="flex w-full items-center space-x-2">
          <Label htmlFor="weight" className="text-base">
            Weight
          </Label>
          <Badge variant="secondary">lbs</Badge>
        </div>
        <Input
          id="weight"
          placeholder="Enter weight in lbs"
          type="number"
          inputMode="numeric"
          min="1"
          max="1000"
          value={weightLbs}
          onChange={(e) => {
            let value = Number(e.target.value);
            if (value > 1400) value = 1400;
            setWeightLbs(value === 0 ? "" : Number(value));
          }}
          className="focus:ring-2 focus:ring-offset-2 text-base py-6"
        />
      </div>
    </div>
  );
}
