"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

import { MetricForm } from "./MetricForm";
import { ImperialForm } from "./ImperialForm";
import { BmiResults } from "./BmiResults";
import { SystemType } from "./types";
import { calculateBmi, getBmiMilestones } from "./utils";

export function BmiCard() {
  const { toast } = useToast();
  const [heightFeet, setHeightFeet] = useState<number | "">("");
  const [heightInches, setHeightInches] = useState<number | "">("");
  const [heightCm, setHeightCm] = useState<number | "">("");
  const [weightKg, setWeightKg] = useState<number | "">("");
  const [weightLbs, setWeightLbs] = useState<number | "">("");
  const [bmi, setBmi] = useState(0);
  const [system, setSystem] = useState<SystemType>("metric");

  function handleClick(): void {
    let height: number;
    let weight: number;

    if (system === "metric") {
      height = heightCm as number;
      weight = weightKg as number;
    } else {
      if (heightFeet === "" || heightInches === "") {
        toast({
          title: "Invalid Input",
          description: "Please enter valid values for height and weight.",
          variant: "destructive",
        });
        setBmi(0);
        return;
      }
      height = (heightFeet as number) * 12 + (heightInches as number);
      weight = weightLbs as number;
    }

    if (height <= 0 || weight <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid values for height and weight.",
        variant: "destructive",
      });
      setBmi(0);
      return;
    }

    const calculatedBmi = calculateBmi(height, weight, system);

    if (isNaN(calculatedBmi)) {
      toast({
        title: "Calculation Error",
        description: "Unable to calculate BMI. Please check your inputs.",
        variant: "destructive",
      });
      setBmi(0);
    } else {
      setBmi(calculatedBmi);
    }
  }

  const handleSystemChange = (newSystem: SystemType) => {
    if (newSystem === "metric" && system === "imperial") {
      // Convert from imperial to metric
      if (heightFeet !== "" || heightInches !== "") {
        const totalInches =
          (heightFeet as number) * 12 + (heightInches as number);
        setHeightCm(Math.round(totalInches * 2.54));
      }
      if (weightLbs !== "") {
        setWeightKg(Math.round((weightLbs as number) * 0.453592));
      }
    } else if (newSystem === "imperial" && system === "metric") {
      // Convert from metric to imperial
      if (heightCm !== "") {
        const totalInches = Math.round((heightCm as number) / 2.54);
        setHeightFeet(Math.floor(totalInches / 12));
        setHeightInches(totalInches % 12);
      }
      if (weightKg !== "") {
        setWeightLbs(Math.round((weightKg as number) / 0.453592));
      }
    }
    setSystem(newSystem);
  };

  const handleClear = () => {
    setBmi(0);
    setWeightKg("");
    setWeightLbs("");
    setHeightCm("");
    setHeightFeet("");
    setHeightInches("");
  };

  // Calculate height for milestones
  const getHeight = (): number => {
    if (system === "metric") {
      return heightCm as number;
    } else {
      return (heightFeet as number) * 12 + (heightInches as number);
    }
  };

  // Get milestones based on current BMI and system
  const milestones =
    bmi !== 0 ? getBmiMilestones(bmi, getHeight(), system) : [];

  return (
    <Card className="w-full md:w-[400px] shadow-lg">
      <CardHeader>
        <CardTitle>BMI Calculator</CardTitle>
        <CardDescription>Find your BMI.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="metric"
          className="w-full"
          onValueChange={(value) => handleSystemChange(value as SystemType)}
          value={system}
        >
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="metric">Metric</TabsTrigger>
            <TabsTrigger value="imperial">Imperial</TabsTrigger>
          </TabsList>
          <TabsContent value="metric">
            <MetricForm
              heightCm={heightCm}
              weightKg={weightKg}
              setHeightCm={setHeightCm}
              setWeightKg={setWeightKg}
            />
            {bmi !== 0 && (
              <BmiResults
                bmi={bmi}
                system={system}
                height={heightCm as number}
                milestones={milestones}
              />
            )}
          </TabsContent>
          <TabsContent value="imperial">
            <ImperialForm
              heightFeet={heightFeet}
              heightInches={heightInches}
              weightLbs={weightLbs}
              setHeightFeet={setHeightFeet}
              setHeightInches={setHeightInches}
              setWeightLbs={setWeightLbs}
            />
            {bmi !== 0 && (
              <BmiResults
                bmi={bmi}
                system={system}
                height={(heightFeet as number) * 12 + (heightInches as number)}
                milestones={milestones}
              />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:justify-between w-full">
        <Button
          onClick={handleClick}
          disabled={
            (system === "metric" ? heightCm : heightFeet) === "" ||
            (system === "metric" ? weightKg : weightLbs) === ""
          }
          className="w-full sm:w-auto py-6 text-base"
        >
          Calculate
        </Button>
        {bmi !== 0 && (
          <Button
            variant="secondary"
            onClick={handleClear}
            className="w-full sm:w-auto py-6 text-base"
          >
            Clear
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default BmiCard;
