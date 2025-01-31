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
import { Progress } from "@/components/ui/progress";

export function BmiCard() {
  const { toast } = useToast();
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0.0);
  const [bmi, setBmi] = useState(0.0);

  function handleClick(): void {
    const bmi = Number(((weight / (height * height)) * 10_000).toFixed(2));
    if (height === 0 || weight === 0.0 || isNaN(bmi)) {
      toast({
        title: "Uh oh! Invalid Input",
        description: "Please enter valid values for height and weight.",
      });
      setBmi(0);
    } else {
      setBmi(bmi);
    }
  }

  function getBmiPercentage(): number {
    const percentage = (bmi * 100) / 40;
    return percentage >= 100 ? 100 : percentage;
  }

  const kgDifference = (bmi: number, height: number): string => {
    const idealWeight = (24.9 * (height * height)) / 10_000;
    return Number(idealWeight - bmi).toFixed(2);
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
      <Card className="w-[350px] min-w-[350px]">
        <CardHeader>
          <CardTitle>BMI Calculator</CardTitle>
          <CardDescription>Find your BMI and health risks.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="metric">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="metric">Metric</TabsTrigger>
              <TabsTrigger value="imperial">Imperial</TabsTrigger>
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
                    min="0"
                    onChange={(e) => setHeight(Number(e.target.value))}
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
                    min="0"
                    onChange={(e) => setWeight(Number(e.target.value))}
                  />
                </div>
                {bmi !== 0 && (
                  <div className="flex flex-col space-y-1.5">
                    <div className="flex justify-between">
                      <p className="text-m font-medium leading-none">
                        Your BMI is <span className="font-bold">{bmi}</span>.
                      </p>
                      <Badge className={getColorByBmi(bmi)}>
                        {classification}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">
                      You are {kgDifference(bmi, height)} kg away from the ideal
                      weight.
                    </p>
                    <Progress value={getBmiPercentage()} />
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="imperial">
              <p className="text-sm">Coming soon...</p>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleClick}>Calculate</Button>
          {bmi !== 0 && (
            <Button
              variant="secondary"
              onClick={() => {
                setBmi(0);
                setWeight(0);
                (document.getElementById("weight") as HTMLInputElement).value =
                  "";
                setHeight(0);
                (document.getElementById("height") as HTMLInputElement).value =
                  "";
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
