import React from "react";

const IncomePercentileGraphSvg = ({ userPercentile }) => {
  const percentilePoints = [100, 50, 10, 1, 0.1, 0.01, 0.001];
  const xPoints = [0, 71.67, 143.33, 215, 286.67, 358.33, 430];

  const getXPosition = (perc) => {
    for (let i = 0; i < percentilePoints.length - 1; i++) {
      if (perc <= percentilePoints[i] && perc > percentilePoints[i + 1]) {
        const x1 = xPoints[i];
        const x2 = xPoints[i + 1];
        const p1 = percentilePoints[i];
        const p2 = percentilePoints[i + 1];
        return (
          x1 +
          ((x2 - x1) * (Math.log10(p1) - Math.log10(perc))) /
            (Math.log10(p1) - Math.log10(p2))
        );
      }
    }
    return 0; // Default to 0 if percentile is out of range
  };

  const xPosition = getXPosition(userPercentile);

  const incomePoints = [
    { x: 0, y: 310 },
    { x: 71.67, y: 128.8 },
    { x: 143.33, y: 105.97 },
    { x: 215, y: 74.11 },
    { x: 286.67, y: 51.78 },
    { x: 358.33, y: 28.47 },
    { x: 430, y: 0 },
  ];

  return (
    <div className="md:w-[750px]">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 770 490"
        preserveAspectRatio="xMidYMid meet"
        className="bg-white"
      >
        <g transform="translate(100,20)">
          <line x1="0" y1="410" x2="600" y2="410" stroke="black" />
          {percentilePoints.map((value, index) => (
            <g key={value} transform={`translate(${xPoints[index]},410)`}>
              <line y2="6" stroke="black" />
              <text y="20" textAnchor="middle" fontSize="10">
                {value}%
              </text>
            </g>
          ))}
          <text x="300" y="465" textAnchor="middle">
            Percentile
          </text>
          <line x1="-10" y1="0" x2="-10" y2="400" stroke="black" />
          {[0, 10000, 100000, 1000000, 10000000, 100000000, 200000000].map(
            (value, index) => (
              <g
                key={value}
                transform={`translate(-10,${310 - index * 51.67})`}
              >
                <line x2="-6" stroke="black" />
                <text x="-10" textAnchor="end" fontSize="10">
                  {value.toLocaleString("en-IN")}
                </text>
              </g>
            )
          )}
          <text transform="translate(-65,200) rotate(-90)" textAnchor="middle">
            Income (₹, log scale)
          </text>
          <path
            d={`M ${incomePoints.map((p) => `${p.x} ${p.y}`).join(" L ")}`}
            fill="none"
            stroke="blue"
            strokeWidth="2"
          />
          {incomePoints.map((point, index) => (
            <circle key={index} cx={point.x} cy={point.y} r="4" fill="blue" />
          ))}
          <g transform={`translate(${xPosition}, 0)`}>
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="410"
              stroke="red"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <text x="5" y="395" fill="red" fontFamily="cursive" fontSize="16">
              You are here
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default IncomePercentileGraphSvg;
