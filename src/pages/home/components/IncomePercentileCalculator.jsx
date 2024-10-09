import React, { useState } from "react";
import IncomePercentileGraphSvg from "./IncomePercentileGraphSvg";

const incomeData = [
  { threshold: 20198548, percentile: 99.999, peopleAbove: 9223 },
  { threshold: 34606044, percentile: 99.99, peopleAbove: 92234 },
  { threshold: 8220379, percentile: 99.9, peopleAbove: 922345 },
  { threshold: 2073846, percentile: 99, peopleAbove: 9223448 },
  { threshold: 290848, percentile: 90, peopleAbove: 92234483 },
  { threshold: 105413, percentile: 60, peopleAbove: 368937933 },
  { threshold: 0, percentile: 0, peopleAbove: 922344832 },
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

const IncomePercentileCalculator = ({ income }) => {
  const [result, setResult] = useState(null);

  const calculatePercentile = (income) => {
    const numIncome = parseIndianNumber(income);
    for (let i = 0; i < incomeData.length; i++) {
      if (numIncome >= incomeData[i].threshold) {
        let percentile, peopleAbove;

        if (i === 0) {
          percentile =
            99.999 +
            ((numIncome - incomeData[0].threshold) /
              (incomeData[0].threshold * 10)) *
              0.001;
          peopleAbove = Math.max(
            0,
            Math.round((totalPopulation * (100 - percentile)) / 100)
          );
        } else {
          const lowerBound = incomeData[i].percentile;
          const upperBound = incomeData[i - 1].percentile;
          const lowerThreshold = incomeData[i].threshold;
          const upperThreshold = incomeData[i - 1].threshold;

          percentile =
            lowerBound +
            ((upperBound - lowerBound) * (numIncome - lowerThreshold)) /
              (upperThreshold - lowerThreshold);

          peopleAbove = Math.round(
            (incomeData[i].peopleAbove * (upperThreshold - numIncome)) /
              (upperThreshold - lowerThreshold)
          );
        }

        const timesNationalAverage = (numIncome / nationalAverage).toFixed(2);

        return {
          percentile: percentile.toFixed(3),
          peopleAbove: formatIndianNumber(peopleAbove),
          timesNationalAverage: timesNationalAverage,
        };
      }
    }
    return {
      percentile: 0,
      peopleAbove: formatIndianNumber(totalPopulation),
      timesNationalAverage: (
        parseIndianNumber(income) / nationalAverage
      ).toFixed(2),
    };
  };

  const handleCalculation = () => {
    const result = calculatePercentile(income);
    setResult(result);
  };

  React.useEffect(() => {
    if (income) {
      handleCalculation();
    }
  }, [income]);

  return (
    <div>
      {result && (
        <div className="flex flex-col gap-20 md:gap-10">
          <div className="md:w-[75%]">
            <p className="text-xl font-medium text-gray-400">
              You rank among the top{" "}
              <strong className="text-black">
                {(100 - parseFloat(result.percentile)).toFixed(3)}%
              </strong>{" "}
              of income earners across India. Out of over a billion people,
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
            <IncomePercentileGraphSvg
              userPercentile={(100 - parseFloat(result.percentile)).toFixed(3)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomePercentileCalculator;
