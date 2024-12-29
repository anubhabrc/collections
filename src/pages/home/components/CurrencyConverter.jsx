import React, { useState, useEffect } from "react";
import CurrencySymbols from "../../../components/data/CurrencySymbols.json";

const CurrencyConverter = ({ income }) => {
  const [convertedIncome, setConvertedIncome] = useState(0);
  const [currency, setCurrency] = useState("USD");
  const [rates, setRates] = useState({});

  const apiKey = import.meta.env.VITE_EXCHANGE_API_KEY;

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`
        );
        const data = await response.json();
        if (data.result === "success") {
          setRates(data.conversion_rates);
        }
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    };

    fetchRates();
  }, []);

  useEffect(() => {
    if (rates[currency] && rates["INR"]) {
      setConvertedIncome(
        ((income / rates["INR"]) * rates[currency]).toFixed(
          CurrencySymbols[currency]?.decimal_digits || 2
        )
      );
    }
  }, [income, currency, rates]);

  const formatCurrencyValue = (value, currencyCode) => {
    const currencyInfo = CurrencySymbols[currencyCode];
    if (!currencyInfo) return `${value} ${currencyCode}`;
    return `${currencyInfo.symbol}${value}`;
  };

  return (
    <div className="p-4 flex flex-col gap-5">
      <div className="flex justify-between">
        <h2 className="font-serif font-medium text-lg text-black">
          Exchange Rates.
        </h2>
        <label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-green-200 px-4 rounded-lg border focus:outline-none focus:border-none border-none cursor-pointer"
          >
            {Object.keys(rates).map((cur) => (
              <option key={cur} value={cur} className="bg-white h-5 text-base">
                {CurrencySymbols[cur]?.symbol} {cur}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="font-serif font-bold text-xl text-black">
        {formatCurrencyValue(convertedIncome, currency)}
      </p>
    </div>
  );
};

export default CurrencyConverter;
