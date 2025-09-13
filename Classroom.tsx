import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Html } from "@react-three/drei";

type Props = {
  onFeedback: (text: string, type?: "info" | "success" | "fail") => void;
  onComplete: (won: boolean) => void;
  onAddScore: () => void;
};

export default function Classroom({ onFeedback, onComplete, onAddScore }: Props) {
  const fireRef = useRef<THREE.Mesh | null>(null);
  const smokeRefs = useRef<Array<THREE.Mesh | null>>([]);
  const clock = useMemo(() => new THREE.Clock(), []);

  // Animate fire and smoke
  useFrame(() => {
    const t = clock.getElapsedTime();
    if (fireRef.current) {
      fireRef.current.scale.setScalar(1 + Math.sin(t * 6) * 0.12);
      (fireRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 1 + Math.abs(Math.sin(t * 10)) * 0.6;

      smokeRefs.current.forEach((s, i) => {
        if (!s) return;
        s.position.y += 0.002 + 0.001 * i;
        (s.material as THREE.MeshStandardMaterial).opacity = Math.max(0, 0.5 - (s.position.y - 2) * 0.1);
        if (s.position.y > 4) s.position.y = 1.8;
      });
    }
  });

  const handleClickInteract = (id: string) => {
    if (id === "extinguisher") {
      onFeedback("Correct: Fire extinguisher present. Use only if trained. Best to evacuate if fire is big.", "info");
      onAddScore();
    } else if (id === "window") {
      onFeedback("Wrong: Breaking windows can feed oxygen to fire and cause more danger. Use exits instead.", "fail");
    } else if (id === "desk") {
      onFeedback("Info: Desks are obstacles — don't crowd around them. Move to exits quickly.", "info");
    }
  };

  const handleDoorClick = (door: "exit" | "wrong1" | "wrong2") => {
    if (door === "exit") onComplete(true);
    else onComplete(false);
  };

  const desks = useMemo(() => {
    const arr: { pos: [number, number, number]; rot?: number }[] = [];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) arr.push({ pos: [-2 + c * 2, 0.45, -2 + r * 1.8], rot: 0 });
    }
    return arr;
  }, []);

  const smokePlanes = new Array(8).fill(0);

  return (
    <group>
      {/* Floor */}
      <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, 0, 0]}>
        <planeGeometry args={[12, 8]} />
        <meshStandardMaterial color="#eeeeee" />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 2.5, -4]}>
        <boxGeometry args={[12, 5, 0.2]} />
        <meshStandardMaterial color="#f3f4f6" />
      </mesh>
      <mesh position={[-6, 2.5, 0]}>
        <boxGeometry args={[0.2, 5, 8]} />
        <meshStandardMaterial color="#f3f4f6" />
      </mesh>
      <mesh position={[6, 2.5, 0]}>
        <boxGeometry args={[0.2, 5, 8]} />
        <meshStandardMaterial color="#f3f4f6" />
      </mesh>
      <mesh position={[0, 2.5, 4]}>
        <boxGeometry args={[12, 5, 0.2]} />
        <meshStandardMaterial color="#f3f4f6" />
      </mesh>

      {/* Blackboard */}
      <mesh position={[-3.5, 2.2, -3.9]}>
        <boxGeometry args={[5, 1.6, 0.05]} />
        <meshStandardMaterial color="#0b1324" />
      </mesh>

      {/* Desks */}
      {desks.map((d, i) => (
        <group key={i} position={d.pos}>
          <mesh onClick={() => handleClickInteract("desk")}>
            <boxGeometry args={[1.6, 0.6, 0.8]} />
            <meshStandardMaterial color="#b5651d" />
          </mesh>
          <mesh position={[0, -0.4, -0.5]}>
            <boxGeometry args={[1.6, 0.2, 0.4]} />
            <meshStandardMaterial color="#8b5a2b" />
          </mesh>
        </group>
      ))}

      {/* Fire */}
      <mesh ref={fireRef} position={[3, 0.6, -2]}>
        <sphereGeometry args={[0.45, 16, 16]} />
        <meshStandardMaterial emissive="#ff6b35" color="#ffb37a" emissiveIntensity={1.5} />
      </mesh>

      {/* Smoke */}
      {smokePlanes.map((_, i) => (
        <mesh
          key={i}
          ref={(r) => (smokeRefs.current[i] = r)}
          position={[3 + (i % 3) * 0.12, 1.6 + Math.random() * 0.8, -2 + (i % 2) * 0.12]}
          rotation={[0, 0, Math.random() * 0.6 - 0.3]}
        >
          <planeGeometry args={[0.9, 0.6]} />
          <meshStandardMaterial transparent opacity={0.45} depthWrite={false} color="#6b6b6b" />
        </mesh>
      ))}

      {/* Fire extinguisher */}
      <mesh position={[5.5, 0.6, -1]} onClick={() => handleClickInteract("extinguisher")}>
        <cylinderGeometry args={[0.18, 0.18, 0.6, 16]} />
        <meshStandardMaterial color="#b91c1c" />
      </mesh>
      <Html position={[5.5, 1.3, -1]} center>
        <div style={{ background: "rgba(255,255,255,0.9)", padding: "4px 8px", borderRadius: 6, fontSize: 12 }}>Fire Extinguisher</div>
      </Html>

      {/* Windows */}
      <mesh position={[-5.9, 2, -1.5]} rotation={[0, Math.PI / 2, 0]} onClick={() => handleClickInteract("window")}>
        <boxGeometry args={[0.1, 2, 2]} />
        <meshStandardMaterial color="#c7d2fe" transparent opacity={0.9} />
      </mesh>

      {/* Doors */}
      <group position={[0, 1, 4.05]}>
        <mesh onClick={() => handleDoorClick("exit")}>
          <boxGeometry args={[1.6, 2, 0.1]} />
          <meshStandardMaterial color="#064e3b" />
        </mesh>
        <Html position={[0, -1.2, 0]}>
          <div style={{ background: "rgba(0,0,0,0.7)", color: "#bbf7d0", padding: "4px 10px", borderRadius: 6, fontWeight: 700 }}>EXIT</div>
        </Html>
      </group>

      <group position={[-6.05, 1, -1.5]} rotation={[0, Math.PI / 2, 0]}>
        <mesh onClick={() => handleDoorClick("wrong1")}>
          <boxGeometry args={[1.2, 2, 0.1]} />
          <meshStandardMaterial color="#7f1d1d" />
        </mesh>
      </group>

      <group position={[6.05, 1, -1.5]} rotation={[0, -Math.PI / 2, 0]}>
        <mesh onClick={() => handleDoorClick("wrong2")}>
          <boxGeometry args={[1.2, 2, 0.1]} />
          <meshStandardMaterial color="#7f1d1d" />
        </mesh>
      </group>

      {/* Fire lighting */}
      <pointLight distance={8} intensity={1.4} color="#ff8a50" position={[3, 1, -2]} />
    </group>
  );
}

// Satisfies isolatedModules
export {};
