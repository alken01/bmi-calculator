import Image from "next/image";
import BmiCard from "@/components/BmiCard";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-black py-4 px-8">
        <h1 className="text-3xl font-bold text-white">BMI Calculator</h1>
      </header>
      <main className="flex flex-col items-start p-24 flex-grow text-left">
        <div className="flex flex-col md:flex-row md:items-start md:space-x-8 max-w-6xl mx-auto w-full">
          <div className="flex flex-col space-y-4 flex-grow max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">
              Check your BMI with a BMI Calculator
            </h2>
            <p className="text-lg text-gray-600">
              The Body Mass Index (BMI) is one way to measure body size. It is a
              tool to estimate body fat and screen for obesity and health risks.
              It can be calculated with a BMI calculator and classifies people
              as being underweight, overweight and obese based on their height
              and weight.
            </p>
            <p className="text-lg text-gray-600">
              The BMI calculation is based on the following formula:
            </p>
            <pre className="text-lg text-gray-600">
              BMI = weight (kg) / height (m)²
            </pre>
          </div>
          <BmiCard />
        </div>
      </main>
      <footer className="bg-black py-4 px-8">
        <p className="text-white text-center">
          © 2025 BMI Calculator. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
