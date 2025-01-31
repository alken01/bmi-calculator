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

  const kgDifference = (bmi: number, height: number): string => {
    const currentWeight =
      system === "metric"
        ? (bmi * (height * height)) / 10_000
        : (bmi * (height * height)) / 703;
    let targetBmi;

    if (bmi < 18.5) {
      targetBmi = 18.5;
    } else if (bmi > 24.9) {
      targetBmi = 24.9;
    } else {
      return "";
    }

    const targetWeight =
      system === "metric"
        ? (targetBmi * (height * height)) / 10_000
        : (targetBmi * (height * height)) / 703;
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
      <Card className="w-[350px] min-w-[350px] shadow-lg">
        <CardHeader>
          <CardTitle>BMI Calculator</CardTitle>
          <CardDescription>Find your BMI and health risks.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="metric"
            className="w-full"
            onValueChange={(value) => handleSystemChange(value as "metric" | "imperial")}
            >
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
                    min="1"
                    max="300"
                    value={heightCm}
                    onChange={(e) => {
                      let value = Number(e.target.value);
                      if (value > 300) value = 300; // Automatically adjust to 300 if higher
                      setHeightCm(value === 0 ? "" : value);
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
                    value={weightKg}
                    onChange={(e) => {
                      let value = Number(e.target.value);
                      if (value > 650) value = 650; //
                      setWeightKg(value === 0 ? "" : Number(value));
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
                    {classification !== "Normal Weight" &&
                      typeof heightCm === "number" && (
                        <p className="text-sm text-muted-foreground">
                          You need to {bmi < 18.5 ? "gain" : "lose"}{" "}
                          <span className="font-semibold">
                            {kgDifference(bmi, heightCm as number)}
                          </span>{" "}
                          kg to reach a normal weight.
                        </p>
                      )}
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="imperial">
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <div className="flex w-full max-w-sm items-center space-x-2">
                    <Label htmlFor="heightFeet">Height</Label>
                  </div>
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <Input
                        id="heightFeet"
                        placeholder="Feet"
                        type="number"
                        min="1"
                        max="10"
                        value={heightFeet}
                        onChange={(e) => {
                          let value = Number(e.target.value);
                          if (value > 10) value = 10; // Automatically adjust to 10 if higher
                          setHeightFeet(value === 0 ? "" : value);
                        }}
                        className="focus:ring-2 focus:ring-offset-2"
                      />
                      <Badge variant="secondary">ft</Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="heightInches"
                        placeholder="Inches"
                        type="number"
                        min="0"
                        max="11"
                        value={heightInches}
                        onChange={(e) => {
                          let value = Number(e.target.value);
                          if (value > 11) value = 11; // Automatically adjust to 11 if higher
                          setHeightInches(value === 0 ? "" : value);
                        }}
                        className="focus:ring-2 focus:ring-offset-2"
                      />
                      <Badge variant="secondary">in</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col space-y-1.5">
                  <div className="flex w-full max-w-sm items-center space-x-2">
                    <Label htmlFor="weight">Weight</Label>
                    <Badge variant="secondary">lbs</Badge>
                  </div>
                  <Input
                    id="weight"
                    placeholder="Enter weight in lbs"
                    type="number"
                    min="1"
                    max="1000"
                    value={weightLbs}
                    onChange={(e) => {
                      let value = Number(e.target.value);
                      if (value > 1400) value = 1400;
                      setWeightLbs(value === 0 ? "" : Number(value));
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
                    {classification !== "Normal Weight" &&
                      typeof heightFeet === "number" && (
                        <p className="text-sm text-muted-foreground">
                          You need to {bmi < 18.5 ? "gain" : "lose"}{" "}
                          <span className="font-semibold">
                            {kgDifference(bmi, heightFeet as number)}
                          </span>{" "}
                          lbs to reach a normal weight.
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
            disabled={
              (system === "metric" ? heightCm : heightFeet) === "" ||
              (system === "metric" ? weightKg : weightLbs) === ""
            }
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
