import React, { useState, useRef } from "react";
import { Button } from "@cred/neopop-web/lib/components";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Human from "../../../public/Human";

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
    // if (isNaN(side)) return null;
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
      <div className="w-full flex p-10 gap-2 h-screen">
        <div className="flex flex-col gap-7 w-1/5 p-5 rounded-lg shadow-sm border border-gray-300">
          <div>
            <p className="font-serif font-semibold text-2xl text-black">
              Stacks of cash
            </p>
            <p className="font-serif text-gray-500">
              Visualize how certain amounts of money would look beside you(₹2000
              notes are used for reference).
            </p>
          </div>
          <div className="flex flex-col gap-2 ">
            {presetValues.map((preset, idx) => (
              <Button
                key={idx}
                variant="primary"
                kind="elevated"
                size="big"
                colorMode="dark"
                onClick={() => replaceStack(preset.value)}
                // onClick={setMoneyStacks(preset.value)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>
        <div className="w-4/5 bg-white rounded-lg shadow-sm border border-gray-300 p-5">
          <Canvas>
            <Scene />
          </Canvas>
        </div>
      </div>
    </div>
  );
};

export default StacksOfCash;
