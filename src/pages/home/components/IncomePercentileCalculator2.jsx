import React, { useState } from "react";
import IncomePercentileGraphSvg from "./IncomePercentileGraphSvg";

const incomeData = [
  { threshold: 0, percentile: 100 },
  { threshold: 71163, percentile: 50 },
  { threshold: 290848, percentile: 10 },
  { threshold: 2073846, percentile: 1 },
  { threshold: 8220379, percentile: 0.1 },
  { threshold: 34606044, percentile: 0.01 },
  { threshold: 200198548, percentile: 0.001 },
];

const totalPopulation = 922344832;
const nationalAverage = 234551;

const formatIndianNumber = (num) => {
  const str = Math.abs(Math.floor(num)).toString();
  let lastThree = str.substring(str.length - 3);
  let otherNumbers = str.substring(0, str.length - 3);
  if (otherNumbers !== "") {
    lastThree = "," + lastThree;
  }
  let result = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  return result;
};

const parseIndianNumber = (str) => {
  return parseInt(str.replace(/,/g, ""), 10);
};

const calculatePercentileLogarithmic = (income) => {
  // If income is less than or equal to the threshold of the second income data point
  if (income <= incomeData[1].threshold) {
    const lowerPercentile = incomeData[0].percentile;
    const upperPercentile = incomeData[1].percentile;
    const lowerIncomeLog = Math.log(incomeData[0].threshold + 1); // Adding 1 to avoid log(0)
    const upperIncomeLog = Math.log(incomeData[1].threshold);
    const incomeLog = Math.log(income + 1); // Adding 1 to avoid log(0)

    const interpolatedPercentile =
      lowerPercentile +
      ((upperPercentile - lowerPercentile) * (incomeLog - lowerIncomeLog)) /
        (upperIncomeLog - lowerIncomeLog);

    return interpolatedPercentile;
  }

  if (income >= incomeData[incomeData.length - 1].threshold) {
    return incomeData[incomeData.length - 1].percentile;
  }

  // For other income ranges
  for (let i = 2; i < incomeData.length; i++) {
    if (income < incomeData[i].threshold) {
      const lowerPercentile = incomeData[i - 1].percentile;
      const upperPercentile = incomeData[i].percentile;
      const lowerIncomeLog = Math.log(incomeData[i - 1].threshold);
      const upperIncomeLog = Math.log(incomeData[i].threshold);
      const incomeLog = Math.log(income);

      const interpolatedPercentile =
        lowerPercentile +
        ((upperPercentile - lowerPercentile) * (incomeLog - lowerIncomeLog)) /
          (upperIncomeLog - lowerIncomeLog);

      return interpolatedPercentile;
    }
  }

  return 100; // Default case
};

const IncomePercentileCalculator = ({ income }) => {
  const [result, setResult] = useState(null);

  const calculateResults = (income) => {
    const numIncome = parseIndianNumber(income);
    const percentile = calculatePercentileLogarithmic(numIncome);
    const peopleAbove = Math.round(totalPopulation * (percentile / 100));
    const timesNationalAverage = (numIncome / nationalAverage).toFixed(2);

    return {
      percentile: percentile.toFixed(3),
      peopleAbove: formatIndianNumber(peopleAbove),
      timesNationalAverage: timesNationalAverage,
    };
  };
  // const calculateResults = async (income) => {
  //   const response = await fetch("http://localhost:5000/calculate", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({ income: parseIndianNumber(income) }),
  //   });
  //   const { percentile } = await response.json();

  //   const peopleAbove = Math.round(totalPopulation * (percentile / 100));
  //   const timesNationalAverage = (
  //     parseIndianNumber(income) / nationalAverage
  //   ).toFixed(2);

  //   return {
  //     percentile: percentile.toFixed(3),
  //     peopleAbove: formatIndianNumber(peopleAbove),
  //     timesNationalAverage: timesNationalAverage,
  //   };
  // };

  React.useEffect(() => {
    if (income) {
      (async () => {
        const result = await calculateResults(income);
        setResult(result);
      })();
    }
  }, [income]);

  return (
    <div>
      {result && (
        <div className="flex flex-col gap-20 md:gap-10">
          <div className="md:w-[75%]">
            <p className="text-2xl font-medium text-gray-400">
              You rank among the top{" "}
              <strong className="text-black">{result.percentile}%</strong> of
              income earners across India. Out of over a billion people,
              approximately{" "}
              <strong className="text-black">{result.peopleAbove}</strong>{" "}
              individuals earn more than you. Additionally, your income stands
              at{" "}
              <strong className="text-black">
                {result.timesNationalAverage}
              </strong>{" "}
              times the national average.
            </p>
          </div>
          <div className="mb-8">
            <IncomePercentileGraphSvg userPercentile={result.percentile} />
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomePercentileCalculator;
