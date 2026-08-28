"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, type ThreeElements } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

type HelixProps = { count?: number };

function Helix({ count = 26 }: HelixProps) {
  const group = useRef<THREE.Group>(null);
  const reduce = useReducedMotion();
  const pointer = useRef({ x: 0, y: 0 });

  const nodes = useMemo(() => {
    const items: {
      pos: [number, number, number];
      strand: 0 | 1;
      key: string;
    }[] = [];
    const turns = 3;
    for (let i = 0; i < count; i++) {
      const t = (i / (count - 1)) * Math.PI * 2 * turns;
      const y = (i / (count - 1)) * 8 - 4;
      const r = 1.5;
      items.push({ pos: [Math.cos(t) * r, y, Math.sin(t) * r], strand: 0, key: `a${i}` });
      items.push({ pos: [Math.cos(t + Math.PI) * r, y, Math.sin(t + Math.PI) * r], strand: 1, key: `b${i}` });
    }
    return items;
  }, [count]);

  const rungs = useMemo(() => {
    const items: { y: number; t: number; key: string }[] = [];
    const turns = 3;
    for (let i = 0; i < count; i += 2) {
      const t = (i / (count - 1)) * Math.PI * 2 * turns;
      const y = (i / (count - 1)) * 8 - 4;
      items.push({ y, t, key: `r${i}` });
    }
    return items;
  }, [count]);

  useFrame((state, delta) => {
    if (!group.current) return;
    pointer.current.x = state.pointer.x;
    pointer.current.y = state.pointer.y;
    if (!reduce) {
      group.current.rotation.y += delta * 0.28;
    }
    // subtle parallax toward the cursor
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      pointer.current.y * 0.25,
      0.05,
    );
    group.current.position.x = THREE.MathUtils.lerp(
      group.current.position.x,
      pointer.current.x * 0.4,
      0.05,
    );
  });

  const colorA = new THREE.Color("#32d6c1");
  const colorB = new THREE.Color("#6cefe2");

  return (
    <group ref={group}>
      {nodes.map((n) => (
        <mesh key={n.key} position={n.pos}>
          <sphereGeometry args={[0.22, 24, 24]} />
          <meshStandardMaterial
            color={n.strand === 0 ? colorA : colorB}
            emissive={n.strand === 0 ? colorA : colorB}
            emissiveIntensity={0.35}
            roughness={0.25}
            metalness={0.1}
          />
        </mesh>
      ))}
      {rungs.map((r) => {
        const geom: ThreeElements["cylinderGeometry"]["args"] = [0.03, 0.03, 3, 8];
        return (
          <mesh
            key={r.key}
            position={[0, r.y, 0]}
            rotation={[0, -r.t, Math.PI / 2]}
          >
            <cylinderGeometry args={geom} />
            <meshStandardMaterial
              color="#8ea9a7"
              transparent
              opacity={0.5}
              roughness={0.4}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export default function DnaHelix() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 11], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 6, 8]} intensity={1.1} />
      <pointLight position={[-6, -3, -4]} intensity={0.6} color="#6cefe2" />
      <Helix />
    </Canvas>
  );
}
