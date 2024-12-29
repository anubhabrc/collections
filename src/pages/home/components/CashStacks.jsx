import React, { useState, useRef, useEffect } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import Human from "../../../../public/Human";
import * as THREE from "three";

const CashStacks = ({ incomeValue }) => {
  const [moneyStacks, setMoneyStacks] = useState([]);

  useEffect(() => {
    setMoneyStacks({ value: incomeValue });
  }, [incomeValue]);

  const MoneyStack = ({ value }) => {
    const side = (16.6 * 6.6 * ((value / 2000) * 0.011)) ** (1 / 3) / 100;
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
    const { camera } = useThree();
    const gridRef = useRef();
    const lastPosition = useRef(new THREE.Vector3());

    useFrame(() => {
      if (!gridRef.current) return;
      const snappedX = Math.round(camera.position.x / 50) * 50;
      const snappedZ = Math.round(camera.position.z / 50) * 50;
      if (
        Math.abs(lastPosition.current.x - snappedX) > 25 ||
        Math.abs(lastPosition.current.z - snappedZ) > 25
      ) {
        gridRef.current.position.x = snappedX;
        gridRef.current.position.z = snappedZ;
        lastPosition.current.set(snappedX, 0, snappedZ);
      }
    });

    return (
      <Grid
        ref={gridRef}
        args={[100, 100]}
        cellSize={1}
        cellThickness={0.6}
        cellColor="#6f6f6f"
        sectionSize={10}
        sectionThickness={0.6}
        sectionColor="#000000"
        fadeStrength={5}
        fadeDistance={50}
        infiniteGrid
      />
    );
  };

  const Scene = () => {
    const { camera } = useThree();

    React.useEffect(() => {
      camera.position.set(0, 5, 10);
    }, [camera]);

    const side = (16.6 * 6.6 * ((incomeValue / 2000) * 0.011)) ** (1 / 3) / 100;
    const offsetDistance = side / 2 + 2;

    return (
      <>
        <color attach="background" args={["#9999FF"]} />
        <ambientLight intensity={3.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <Platform />
        {moneyStacks && <MoneyStack value={moneyStacks.value} />}
        <Human position={[-offsetDistance, 0, -offsetDistance]} />
        <OrbitControls target={[0, 1, 0]} maxPolarAngle={Math.PI / 2.1} />
      </>
    );
  };

  return (
    <div className="w-full">
      <div className="w-full flex flex-col md:flex-row p-4 md:p-10 gap-4 md:gap-2 min-h-screen">
        <div className="w-full md:w-4/5 h-[60vh] md:h-auto bg-white rounded-lg shadow-sm border border-gray-300 p-5 order-1 md:order-2">
          <Canvas>
            <Scene />
          </Canvas>
        </div>
        <div className="w-full md:w-1/5 p-5 rounded-lg shadow-sm border border-gray-300 flex flex-col gap-5">
          <p className="font-serif font-semibold text-xl text-black">
            Visualize Money
          </p>
          <p className="font-serif text-gray-500">
            Here you can visualize how certain amounts of money would look Like
            when stacked beside you.
          </p>
          <p className="font-serif text-gray-500">
            ₹2000 notes are used as the only point of reference.
          </p>
          <p className="font-serif text-gray-500">
            Real world measurements are replicated here, where 1 unit in this 3D
            scene is 1 metre. The human is 1.8m tall.
          </p>
          <p className="font-serif text-gray-500">
            Volumetric calculations are used to render the stacks of cash.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CashStacks;
