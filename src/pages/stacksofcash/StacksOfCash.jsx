import React, { useState, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
// import Human from "../../../public/Human";

const StacksOfCash = () => {
  const [moneyStacks, setMoneyStacks] = useState([]);

  const presetValues = [
    { label: "₹10 Lakh", value: 1000000 },
    { label: "₹1 Cr", value: 10000000 },
    { label: "₹10 Cr", value: 100000000 },
    { label: "₹100 Cr", value: 1000000000 },
    { label: "₹1000 Cr", value: 10000000000 },
    { label: "₹10,000 Cr", value: 100000000000 },
    { label: "₹1 Lakh Cr", value: 1000000000000 },
  ];

  const replaceStack = (value) => {
    setMoneyStacks({ value });
  };

  const MoneyStack = ({ value }) => {
    const side = (16.6 * 6.6 * ((value / 2000) * 0.011)) ** (1 / 3) / 100;
    console.log(side);

    const meshRef = useRef();

    return (
      <>
        <group position={[0, 0 + side / 2, 0]}>
          <mesh ref={meshRef}>
            <boxGeometry
              args={[side, side, side]}
              position={[0, 0 + side / 2, 0]}
            />
            <meshStandardMaterial color="#2ecc71" />
          </mesh>
        </group>
      </>
    );
  };

  const Platform = () => {
    return (
      <mesh>
        <gridHelper args={[15, 15, "#000000", "#000000"]} />
      </mesh>
    );
  };

  const Scene = () => {
    const { camera } = useThree();

    React.useEffect(() => {
      camera.position.set(0, 5, 10);
    }, [camera]);

    return (
      <>
        <color attach="background" args={["#9999FF"]} />
        <ambientLight intensity={3.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <Platform />
        {moneyStacks && <MoneyStack value={moneyStacks.value} />}
        <Human position={[-5, 0, 3]} />
        <OrbitControls target={[0, 1, 0]} />
      </>
    );
  };

  return (
    <div className="w-full">
      <div className="w-full flex flex-col md:flex-row p-4 md:p-10 gap-4 md:gap-2 min-h-screen">
        {/* Visualization area - full width on mobile, 4/5 width on larger screens */}
        <div className="w-full md:w-4/5 h-[60vh] md:h-auto bg-white rounded-lg shadow-sm border border-gray-300 p-5 order-1 md:order-2">
          <Canvas>
            <Scene />
          </Canvas>
        </div>

        {/* Control panel - full width on mobile, 1/5 width on larger screens */}
        <div className="w-full md:w-1/5 p-5 rounded-lg shadow-sm border border-gray-300 order-2 md:order-1">
          <div>
            <p className="font-serif font-semibold text-2xl text-black">
              Stacks of cash
            </p>
            <p className="font-serif text-gray-500">
              Visualize how certain amounts of money would look beside you(₹2000
              notes are used for reference).
            </p>
          </div>
          <div className="flex flex-col gap-2 mt-7 w-[65%]">
            {presetValues.map((preset, idx) => (
              <button
                className="flex-1 md:flex-none py-2 font-serif text-white bg-gray-600 border-b-8 border-gray-700 border-r-[6px] border-r-gray-500 active:border-b-2 active:border-r-2 active:translate-y-[6px] active:translate-x-[6px] transition-all"
                key={idx}
                onClick={() => replaceStack(preset.value)}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StacksOfCash;
