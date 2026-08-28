"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

/** Scroll progress 0→1 of the whole document, read live in the frame loop. */
function scrollProgress(): number {
  if (typeof window === "undefined") return 0;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max <= 0) return 0;
  return Math.min(Math.max(window.scrollY / max, 0), 1);
}

function fibonacciSphere(n: number, radius: number) {
  const pts: [number, number, number][] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    pts.push([
      Math.cos(theta) * r * radius,
      y * radius,
      Math.sin(theta) * r * radius,
    ]);
  }
  return pts;
}

function Capsid({ seed, color }: { seed: number; color: string }) {
  const group = useRef<THREE.Group>(null);
  const reduce = useReducedMotion();
  const c = useMemo(() => new THREE.Color(color), [color]);
  const atoms = useMemo(() => fibonacciSphere(12, 2.4), []);

  useFrame((state, delta) => {
    if (!group.current) return;
    const p = scrollProgress();
    const base = seed * 0.6;

    if (!reduce) {
      group.current.rotation.y += delta * 0.06;
    }
    // Scroll drives an extra full-ish rotation + a vertical drift, so the
    // object visibly "travels" as the reader moves down the page.
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      base + p * Math.PI * 1.5 + (reduce ? 0 : group.current.rotation.y),
      0.02,
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      p * 0.8 + state.pointer.y * 0.15,
      0.04,
    );
    group.current.position.y = THREE.MathUtils.lerp(
      group.current.position.y,
      2.2 - p * 4.4,
      0.04,
    );
    group.current.position.x = THREE.MathUtils.lerp(
      group.current.position.x,
      state.pointer.x * 0.6,
      0.04,
    );
  });

  return (
    <group ref={group}>
      {/* Molecular cage */}
      <mesh>
        <icosahedronGeometry args={[2.4, 1]} />
        <meshBasicMaterial color={c} wireframe transparent opacity={0.22} />
      </mesh>
      {/* Inner core */}
      <mesh>
        <icosahedronGeometry args={[1.1, 0]} />
        <meshBasicMaterial color={c} wireframe transparent opacity={0.12} />
      </mesh>
      {/* Glowing nodes */}
      {atoms.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.11, 16, 16]} />
          <meshStandardMaterial
            color={c}
            emissive={c}
            emissiveIntensity={0.6}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function MoleculeField({
  seed = 1,
  color = "#32d6c1",
}: {
  seed?: number;
  color?: string;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 8], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      style={{ background: "transparent" }}
      frameloop="always"
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 6]} intensity={0.8} color={color} />
      <Capsid seed={seed} color={color} />
    </Canvas>
  );
}
