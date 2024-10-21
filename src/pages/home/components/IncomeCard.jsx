import React, { useState } from "react";
import { MdCurrencyRupee } from "react-icons/md";
import { LiaArrowRightSolid } from "react-icons/lia";
import IncomePercentileCalculator2 from "./IncomePercentileCalculator2";

const IncomeCard = () => {
  const [income, setIncome] = useState(""); // For formatted income
  const [submittedIncome, setSubmittedIncome] = useState(""); // For unformatted income to pass to the calculator

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

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/,/g, "");
    if (value === "" || /^\d+$/.test(value)) {
      setIncome(formatIndianNumber(value));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const unformattedIncome = income.replace(/,/g, ""); // Remove commas before submitting
    setSubmittedIncome(unformattedIncome); // Set the unformatted income to pass to IncomeCalculator
  };

  return (
    <div className="w-full">
      <div className="flex flex-col gap-5 w-[85%] m-auto pt-14">
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <MdCurrencyRupee className="text-sm" />
            <h6 className="text-gray-200 text-sm pb-1">|</h6>
            <h6 className="font-serif text-sm">Calculate Percentile</h6>
            <LiaArrowRightSolid className="text-sm" />
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold">Compare your income.</h1>
            <p className="text-lg font-light">
              Find out where you stand on a percentile basis in India, based on
              your yearly income
              <span>
                <a
                  href="https://wid.world/www-site/uploads/2024/03/WorldInequalityLab_WP2024_09_Income-and-Wealth-Inequality-in-India-1922-2023_Final.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 text-sm"
                >
                  (source)
                </a>
              </span>
              .
            </p>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <input
            type="text"
            value={income}
            onChange={handleInputChange}
            placeholder="Enter your annual income in ₹"
            className="border px-3 py-1 border-gray-200 rounded-lg bg-gray-50 w-80 hover:bg-gray-100"
          />
          <button
            type="submit"
            className="bg-black text-white hover:bg-gray-800 font-serif font-medium text-xs px-2 py-2 rounded-md"
          >
            Calculate
          </button>
        </form>

        {/* Calculator Results */}
        <div className="mt-6">
          {submittedIncome && (
            <IncomePercentileCalculator2 income={submittedIncome} />
          )}
        </div>
      </div>
    </div>
  );
};

export default IncomeCard;
