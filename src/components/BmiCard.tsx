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

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

export function BmiCard() {
  const { toast } = useToast();
  const [heightFeet, setHeightFeet] = useState<number | "">("");
  const [heightInches, setHeightInches] = useState<number | "">("");
  const [heightCm, setHeightCm] = useState<number | "">("");
  const [weightKg, setWeightKg] = useState<number | "">("");
  const [weightLbs, setWeightLbs] = useState<number | "">("");
  const [bmi, setBmi] = useState(0);
  const [system, setSystem] = useState<"metric" | "imperial">("metric");

  function handleClick(): void {
    let height: number;
    if (system === "metric") {
      height = heightCm as number;
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
    }

    const weight = system === "metric" ? weightKg : weightLbs;

    if (height <= 0 || weight === "" || weight <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid values for height and weight.",
        variant: "destructive",
      });
      setBmi(0);
      return;
    }

    let calculatedBmi;
    if (system === "metric") {
      calculatedBmi = Number(
        (((weight as number) / (height * height)) * 10_000).toFixed(1)
      );
    } else {
      calculatedBmi = Number(
        (((weight as number) / (height * height)) * 703).toFixed(1)
      );
    }

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

  const calculateWeightForBmi = (targetBmi: number, height: number): number => {
    return system === "metric"
      ? (targetBmi * (height * height)) / 10_000
      : (targetBmi * (height * height)) / 703;
  };

  const weightDifferenceToTarget = (currentBmi: number, targetBmi: number, height: number): string => {
    const currentWeight = calculateWeightForBmi(currentBmi, height);
    const targetWeight = calculateWeightForBmi(targetBmi, height);
    const difference = Math.abs(currentWeight - targetWeight);
    return difference.toFixed(1);
  };

  const getBmiMilestones = (bmi: number, height: number): Array<{category: string, targetBmi: number, difference: string}> => {
    const milestones = [];
    
    // Define BMI thresholds and their categories
    const underweightThresholds = [
      { bmi: 17, category: "Mildly Underweight" },
      { bmi: 16, category: "Moderately Underweight" }
    ];
    
    const overweightThresholds = [
      { bmi: 24.9, category: "Normal Weight" },
      { bmi: 29.9, category: "Overweight" },
      { bmi: 34.9, category: "Obesity Class I" },
      { bmi: 39.9, category: "Obesity Class II" }
    ];
    
    if (bmi < 18.5) {
      // For underweight - provide milestones to gain weight
      if (bmi < 16) {
        // Severely underweight - show steps to each higher category
        milestones.push({
          category: "Moderately Underweight",
          targetBmi: 16,
          difference: weightDifferenceToTarget(bmi, 16, height)
        });
        milestones.push({
          category: "Mildly Underweight",
          targetBmi: 17,
          difference: weightDifferenceToTarget(bmi, 17, height)
        });
        milestones.push({
          category: "Normal Weight",
          targetBmi: 18.5,
          difference: weightDifferenceToTarget(bmi, 18.5, height)
        });
      } else if (bmi < 17) {
        // Moderately underweight
        milestones.push({
          category: "Mildly Underweight",
          targetBmi: 17,
          difference: weightDifferenceToTarget(bmi, 17, height)
        });
        milestones.push({
          category: "Normal Weight",
          targetBmi: 18.5,
          difference: weightDifferenceToTarget(bmi, 18.5, height)
        });
      } else {
        // Mildly underweight
        milestones.push({
          category: "Normal Weight",
          targetBmi: 18.5,
          difference: weightDifferenceToTarget(bmi, 18.5, height)
        });
      }
    } else if (bmi > 24.9) {
      // For overweight and obese - provide milestones to lose weight
      for (let i = 0; i < overweightThresholds.length; i++) {
        if (bmi > overweightThresholds[i].bmi) {
          // Add milestones for categories below current BMI
          milestones.push({
            category: overweightThresholds[i].category,
            targetBmi: overweightThresholds[i].bmi,
            difference: weightDifferenceToTarget(bmi, overweightThresholds[i].bmi, height)
          });
        }
      }
      
      // Sort milestones by closest goal first
      return milestones.reverse();
    }
    
    return milestones;
  };

  const getBmiClassification = (bmi: number): string => {
    if (bmi < 16) {
      return "Severely Underweight";
    } else if (bmi >= 16 && bmi < 17) {
      return "Moderately Underweight";
    } else if (bmi >= 17 && bmi < 18.5) {
      return "Mildly Underweight";
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      return "Normal Weight";
    } else if (bmi >= 25 && bmi <= 29.9) {
      return "Overweight";
    } else if (bmi >= 30 && bmi <= 34.9) {
      return "Obesity Class I";
    } else if (bmi >= 35 && bmi <= 39.9) {
      return "Obesity Class II";
    } else {
      return "Obesity Class III";
    }
  };

  const getColorByBmi = (bmi: number): string => {
    if (bmi < 16) {
      return "bg-indigo-700";
    } else if (bmi >= 16 && bmi < 17) {
      return "bg-indigo-500";
    } else if (bmi >= 17 && bmi < 18.5) {
      return "bg-blue-500";
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      return "bg-green-500";
    } else if (bmi >= 25 && bmi <= 29.9) {
      return "bg-yellow-500";
    } else if (bmi >= 30 && bmi <= 34.9) {
      return "bg-orange-500";
    } else if (bmi >= 35 && bmi <= 39.9) {
      return "bg-red-500";
    } else {
      return "bg-red-700";
    }
  };

  const classification = getBmiClassification(bmi);

  const handleSystemChange = (newSystem: "metric" | "imperial") => {
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

  return (
    <>
      <Card className="w-full md:w-[400px] shadow-lg">
        <CardHeader>
          <CardTitle>BMI Calculator</CardTitle>
          <CardDescription>Find your BMI.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="metric"
            className="w-full"
            onValueChange={(value) => handleSystemChange(value as "metric" | "imperial")}
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="metric">Metric</TabsTrigger>
              <TabsTrigger value="imperial">Imperial</TabsTrigger>
            </TabsList>
            <TabsContent value="metric">
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <div className="flex w-full items-center space-x-2">
                    <Label htmlFor="height" className="text-base">Height</Label>
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
                    <Label htmlFor="weight" className="text-base">Weight</Label>
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
                {bmi !== 0 && (
                  <div className="flex flex-col space-y-3 p-4 bg-secondary rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <p className="text-m font-medium">
                        Your BMI:{" "}
                        <span className="font-bold text-lg">{bmi}</span>
                      </p>
                      <Badge
                        className={`${getColorByBmi(bmi)} transition-colors text-sm py-1.5`}
                      >
                        {classification}
                      </Badge>
                    </div>
                    
                    {classification !== "Normal Weight" &&
                      typeof heightCm === "number" && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Weight goals:</p>
                          {getBmiMilestones(bmi, heightCm as number).map((milestone, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <p className="text-sm text-muted-foreground">
                                {bmi < 18.5 ? "Gain" : "Lose"}{" "}
                                <span className="font-semibold">
                                  {milestone.difference}
                                </span>{" "}
                                kg to reach:
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
                )}
              </div>
            </TabsContent>
            <TabsContent value="imperial">
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <div className="flex w-full items-center space-x-2">
                    <Label htmlFor="heightFeet" className="text-base">Height</Label>
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
                    <Label htmlFor="weight" className="text-base">Weight</Label>
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
                {bmi !== 0 && (
                  <div className="flex flex-col space-y-3 p-4 bg-secondary rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                      <p className="text-m font-medium">
                        Your BMI:{" "}
                        <span className="font-bold text-lg">{bmi}</span>
                      </p>
                      <Badge
                        className={`${getColorByBmi(bmi)} transition-colors text-sm py-1.5`}
                      >
                        {classification}
                      </Badge>
                    </div>
                    
                    {classification !== "Normal Weight" &&
                      typeof heightFeet === "number" && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Weight goals:</p>
                          {getBmiMilestones(bmi, (heightFeet as number) * 12 + (heightInches as number)).map((milestone, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <p className="text-sm text-muted-foreground">
                                {bmi < 18.5 ? "Gain" : "Lose"}{" "}
                                <span className="font-semibold">
                                  {milestone.difference}
                                </span>{" "}
                                lbs to reach:
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
                )}
              </div>
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
              onClick={() => {
                setBmi(0);
                setWeightKg("");
                setWeightLbs("");
                setHeightCm("");
                setHeightFeet("");
                setHeightInches("");
              }}
              className="w-full sm:w-auto py-6 text-base"
            >
              Clear
            </Button>
          )}
        </CardFooter>
      </Card>
    </>
  );
}

export default BmiCard;