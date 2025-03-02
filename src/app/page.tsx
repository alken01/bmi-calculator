import Image from "next/image";
import BmiCard from "@/components/BmiCard";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-black py-4 px-4 sm:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">BMI Calculator</h1>
      </header>
      <main className="flex flex-col items-start p-4 sm:p-8 md:p-12 lg:p-24 flex-grow text-left">
        <div className="flex flex-col md:flex-row md:items-start md:space-x-8 max-w-6xl mx-auto w-full gap-8">
          <div className="flex flex-col space-y-4 flex-grow max-w-2xl order-2 md:order-1">
            <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">
              Check your BMI with a BMI Calculator
            </h2>
            <p className="text-base sm:text-lg text-gray-600">
              The Body Mass Index (BMI) is one way to measure body size. It is a
              tool to estimate body fat and screen for obesity and health risks.
              It can be calculated with a BMI calculator and classifies people
              as being underweight, overweight and obese based on their height
              and weight.
            </p>
            <p className="text-base sm:text-lg text-gray-600">
              The BMI calculation is based on the following formula:
            </p>
            <pre className="text-base sm:text-lg text-gray-600 bg-gray-200 p-3 rounded-md overflow-x-auto">
              BMI = weight (kg) / height (m)²
            </pre>
          </div>
          <div className="w-full order-1 md:order-2 flex justify-center md:justify-start">
            <BmiCard />
          </div>
        </div>
      </main>
      <footer className="bg-black py-4 px-4 sm:px-8 mt-8">
        <p className="text-white text-center text-sm sm:text-base">
          github/alken01
        </p>
      </footer>
    </div>
  );
}