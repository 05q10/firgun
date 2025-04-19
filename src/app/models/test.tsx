"use client";

import { Canvas, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations, Html } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { Group, Mesh, MeshStandardMaterial } from "three";
import * as THREE from "three";
import { useRouter } from "next/navigation";

type ModelProps = {
  modelPath: string;
};

function InteractiveModel({ modelPath }: ModelProps) {
  const router = useRouter();
  const sofaRef = useRef<Mesh | null>(null);
  const tvRef = useRef<Mesh | null>(null);
  const [hoveredObject, setHoveredObject] = useState<"sofa" | "tv" | null>(null);

  const { scene, animations } = useGLTF(modelPath) as any;
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    if (actions) {
      const actionKeys = Object.keys(actions);
      if (actionKeys.length > 0) {
        actions[actionKeys[0]]?.play();
      }
    }

    scene.traverse((child: THREE.Object3D) => {
      if (child instanceof Mesh) {
        if (child.name === "Sofa") {
          sofaRef.current = child;
        } else if (child.name === "TV") {
          tvRef.current = child;
        }

        const mesh = child as Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((material) => {
            if (material instanceof MeshStandardMaterial) {
              material.transparent = false;
              material.opacity = 1;
              material.color.set(0x5a5a5a);
              material.metalness = 0.8;
              material.roughness = 0.2;
              material.emissive.set(0x3a0000);
              material.emissiveIntensity = 0.2;
              material.depthWrite = false;
              material.alphaTest = 0.05;
              material.blending = THREE.NormalBlending;
              material.side = THREE.DoubleSide;
            }
          });
        } else if (mesh.material instanceof MeshStandardMaterial) {
          mesh.material.transparent = true;
          mesh.material.depthWrite = true;
          mesh.material.alphaTest = 0.5;
        }
      }
    });
  }, [actions, scene]);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (e.object === sofaRef.current) {
      router.push("/writing");
    } else if (e.object === tvRef.current) {
      const link = document.createElement("a");
      link.href = "https://www.youtube.com/watch?v=q5xIoeG4uVI";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    if (e.object === sofaRef.current) {
      setHoveredObject("sofa");
      document.body.style.cursor = "pointer";
    } else if (e.object === tvRef.current) {
      setHoveredObject("tv");
      document.body.style.cursor = "pointer";
    }
  };

  const handlePointerOut = () => {
    setHoveredObject(null);
    document.body.style.cursor = "auto";
  };

  return (
    <>
      <primitive
        object={scene}
        scale={1.5}
        onPointerDown={handlePointerDown}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      />
      {hoveredObject === "sofa" && sofaRef.current && (
        <Html position={sofaRef.current.position} center>
          <div className="text-white bg-black bg-opacity-80 px-2 py-1 rounded text-sm">
            Open Writings
          </div>
        </Html>
      )}
      {hoveredObject === "tv" && tvRef.current && (
        <Html position={tvRef.current.position} center>
          <div className="text-white bg-black bg-opacity-80 px-2 py-1 rounded text-sm">
            Watch Video
          </div>
        </Html>
      )}
    </>
  );
}

export default function ModelViewer() {
  return (
    <div className="w-full h-screen relative">
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 4, 2]} intensity={1.5} />
        <Suspense fallback={null}>
          <InteractiveModel modelPath="/models/miniatureroom1.glb" />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}
