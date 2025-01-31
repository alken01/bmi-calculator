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
  const [height, setHeight] = useState<number | "">("");
  const [weight, setWeight] = useState<number | "">("");
  const [bmi, setBmi] = useState(0);

  function handleClick(): void {
    if (height === "" || weight === "" || height <= 0 || weight <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid values for height and weight.",
        variant: "destructive",
      });
      setBmi(0);
      return;
    }

    const calculatedBmi = Number(
      ((weight / (height * height)) * 10_000).toFixed(1)
    );

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

  const kgDifference = (bmi: number, height: number): string => {
    const currentWeight = (bmi * (height * height)) / 10_000;
    let targetBmi;

    if (bmi < 18.5) {
      targetBmi = 18.5; // Target the lower end of normal weight
    } else if (bmi > 24.9) {
      targetBmi = 24.9; // Target the upper end of normal weight
    } else {
      return ""; // Return empty string for normal weight
    }

    const targetWeight = (targetBmi * (height * height)) / 10_000;
    const difference = Math.abs(currentWeight - targetWeight);
    return difference.toFixed(1);
  };

  const getBmiClassification = (bmi: number): string => {
    if (bmi < 18.5) {
      return "Underweight";
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
    if (bmi < 18.5) {
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
      return "bg-red-500";
    }
  };

  const classification = getBmiClassification(bmi);

  return (
    <>
      <Card className="w-[350px] min-w-[350px] shadow-lg">
        <CardHeader>
          <CardTitle>BMI Calculator</CardTitle>
          <CardDescription>Find your BMI and health risks.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="metric" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="metric">Metric</TabsTrigger>
              <TabsTrigger value="imperial" disabled>
                Imperial (Soon)
              </TabsTrigger>
            </TabsList>
            <TabsContent value="metric">
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <div className="flex w-full max-w-sm items-center space-x-2">
                    <Label htmlFor="height">Height</Label>
                    <Badge variant="secondary">cm</Badge>
                  </div>
                  <Input
                    id="height"
                    placeholder="Enter height in cm"
                    type="number"
                    min="1"
                    max="300"
                    value={height}
                    onChange={(e) => {
                      const value = e.target.value;
                      setHeight(value === "" ? "" : Number(value));
                    }}
                    className="focus:ring-2 focus:ring-offset-2"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <div className="flex w-full max-w-sm items-center space-x-2">
                    <Label htmlFor="weight">Weight</Label>
                    <Badge variant="secondary">kg</Badge>
                  </div>
                  <Input
                    id="weight"
                    placeholder="Enter weight in kg"
                    type="number"
                    min="1"
                    max="500"
                    value={weight}
                    onChange={(e) => {
                      const value = e.target.value;
                      setWeight(value === "" ? "" : Number(value));
                    }}
                    className="focus:ring-2 focus:ring-offset-2"
                  />
                </div>
                {bmi !== 0 && (
                  <div className="flex flex-col space-y-3 p-4 bg-secondary rounded-lg">
                    <div className="flex justify-between items-center">
                      <p className="text-m font-medium">
                        Your BMI:{" "}
                        <span className="font-bold text-lg">{bmi}</span>
                      </p>
                      <Badge
                        className={`${getColorByBmi(bmi)} transition-colors`}
                      >
                        {classification}
                      </Badge>
                    </div>
                    {classification !== "Normal Weight" && typeof height === "number" && (
                      <p className="text-sm text-muted-foreground">
                        You need to {bmi < 18.5 ? "gain" : "lose"}{" "}
                        <span className="font-semibold">
                          {kgDifference(bmi, height)}
                        </span>{" "}
                        kg to reach a normal weight.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            onClick={handleClick}
            disabled={height === "" || weight === ""}
          >
            Calculate
          </Button>
          {bmi !== 0 && (
            <Button
              variant="secondary"
              onClick={() => {
                setBmi(0);
                setWeight("");
                setHeight("");
              }}
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
