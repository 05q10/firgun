"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
import { Suspense, useEffect } from "react";
import { Group, Mesh, MeshStandardMaterial } from "three";

type ModelProps = {
  modelPath: string;
};

function AnimatedModel({ modelPath }: ModelProps) {
  const { scene, animations } = useGLTF(modelPath) as unknown as {
    scene: Group;
    animations: any[];
  };

  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    if (actions) {
      const actionKeys = Object.keys(actions);
      if (actionKeys.length > 0) {
        actions[actionKeys[0]]?.play();
      }
    }

    // Fix potential material issues
    scene.traverse((child) => {
      if (child instanceof Mesh) {
        const mesh = child;
        const materials = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];

        materials.forEach((material) => {
          if (material instanceof MeshStandardMaterial) {
            material.transparent = true;
            material.opacity = 1;
            material.depthWrite = true;
            material.alphaTest = 0;
            material.side = 0; // FrontSide
          }
        });
      }
    });
  }, [actions, scene]);

  return <primitive object={scene} scale={1.5} />;
}

export default function ModelViewer() {
  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 4, 2]} intensity={1.5} />
        <Suspense fallback={null}>
          <AnimatedModel modelPath="/models/scene.gltf" />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}
