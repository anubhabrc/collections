import React, { useState, useRef, useEffect } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid } from "@react-three/drei";
import Human from "../../../../public/Human";
// import Cash from "../../../../public/Cash";
import * as THREE from "three";

const StacksOfCash = ({ incomeValue }) => {
  const [moneyStacks, setMoneyStacks] = useState([]);

  useEffect(() => {
    setMoneyStacks({ label: "", value: incomeValue });
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

  //   const Platform = () => {
  //     return (
  //       <mesh>
  //         <gridHelper args={[15, 15, "#000000", "#000000"]} />
  //       </mesh>
  //     );
  //   };

  const Platform = () => {
    const { camera } = useThree();
    const gridRef = useRef();
    const lastPosition = useRef(new THREE.Vector3());

    useFrame(() => {
      if (!gridRef.current) return;

      // Use a larger chunk size (50 units) and lower precision
      const snappedX = Math.round(camera.position.x / 50) * 50;
      const snappedZ = Math.round(camera.position.z / 50) * 50;

      // Only update position if camera has moved significantly
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
        sectionThickness={1.2}
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

    // Calculate stack size
    const side =
      (16.6 * 6.6 * ((moneyStacks.value / 2000) * 0.011)) ** (1 / 3) / 100;
    // Fixed distance for human positioning (about 2 meters from the edge of the stack)
    const FIXED_DISTANCE = 2;
    // Calculate offset to position human from the center
    const offsetDistance = side / 2 + FIXED_DISTANCE;

    return (
      <>
        <color attach="background" args={["#9999FF"]} />
        <ambientLight intensity={3.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <Platform />
        {moneyStacks && <MoneyStack value={moneyStacks.value} />}
        <Human position={[-offsetDistance, 0, -offsetDistance]} />
        {/* <Cash position={[-4, 0, 2]} /> */}
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
      </div>
    </div>
  );
};

export default StacksOfCash;
