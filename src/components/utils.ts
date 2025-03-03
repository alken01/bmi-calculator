import { BmiMilestone, SystemType } from "./types";

export const calculateBmi = (
  height: number,
  weight: number,
  system: SystemType
): number => {
  if (system === "metric") {
    return Number(((weight / (height * height)) * 10_000).toFixed(1));
  }
  return Number(((weight / (height * height)) * 703).toFixed(1));
};

export const calculateWeightForBmi = (
  targetBmi: number,
  height: number,
  system: SystemType
): number => {
  return system === "metric"
    ? (targetBmi * (height * height)) / 10_000
    : (targetBmi * (height * height)) / 703;
};

export const weightDifferenceToTarget = (
  currentBmi: number,
  targetBmi: number,
  height: number,
  system: SystemType
): string => {
  const currentWeight = calculateWeightForBmi(currentBmi, height, system);
  const targetWeight = calculateWeightForBmi(targetBmi, height, system);
  const difference = Math.abs(currentWeight - targetWeight);
  return difference.toFixed(1);
};

export const getBmiMilestones = (
  bmi: number,
  height: number,
  system: SystemType
): Array<BmiMilestone> => {
  const milestones = [];

  // Define BMI thresholds and their categories
  const underweightThresholds = [
    { bmi: 17, category: "Mildly Underweight" },
    { bmi: 16, category: "Moderately Underweight" },
  ];

  const overweightThresholds = [
    { bmi: 24.9, category: "Normal Weight" },
    { bmi: 29.9, category: "Overweight" },
    { bmi: 34.9, category: "Obesity Class I" },
    { bmi: 39.9, category: "Obesity Class II" },
  ];

  if (bmi < 18.5) {
    // For underweight - provide milestones to gain weight
    if (bmi < 16) {
      // Severely underweight - show steps to each higher category
      milestones.push({
        category: "Moderately Underweight",
        targetBmi: 16,
        difference: weightDifferenceToTarget(bmi, 16, height, system),
      });
      milestones.push({
        category: "Mildly Underweight",
        targetBmi: 17,
        difference: weightDifferenceToTarget(bmi, 17, height, system),
      });
      milestones.push({
        category: "Normal Weight",
        targetBmi: 18.5,
        difference: weightDifferenceToTarget(bmi, 18.5, height, system),
      });
    } else if (bmi < 17) {
      // Moderately underweight
      milestones.push({
        category: "Mildly Underweight",
        targetBmi: 17,
        difference: weightDifferenceToTarget(bmi, 17, height, system),
      });
      milestones.push({
        category: "Normal Weight",
        targetBmi: 18.5,
        difference: weightDifferenceToTarget(bmi, 18.5, height, system),
      });
    } else {
      // Mildly underweight
      milestones.push({
        category: "Normal Weight",
        targetBmi: 18.5,
        difference: weightDifferenceToTarget(bmi, 18.5, height, system),
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
          difference: weightDifferenceToTarget(
            bmi,
            overweightThresholds[i].bmi,
            height,
            system
          ),
        });
      }
    }

    // Sort milestones by closest goal first
    return milestones.reverse();
  }

  return milestones;
};

export const getBmiClassification = (bmi: number): string => {
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

export const getColorByBmi = (bmi: number): string => {
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
