"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
import { Suspense, useEffect } from "react";
import { Group, Mesh, MeshStandardMaterial } from "three";
import * as THREE from "three";


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

    // Fix transparency issues (white patches)
    scene.traverse((child) => {
      if (child instanceof Mesh) {
        const mesh = child as Mesh;
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((material) => {
            if (material instanceof MeshStandardMaterial) {
                

// Assuming 'material' is your target material


// Assuming 'material' is your target material
material.transparent = true;
material.opacity = 0; // Increase slightly for visibility
material.color.set(0x5a5a5a); // Greyish tone with slight red tint
material.metalness = 0.8; // High metallic effect for blending with snake
material.roughness = 0.2; // Slight shine, not too reflective
material.emissive.set(0x3a0000); // Very dark red glow to match snake
material.emissiveIntensity = 0.2; // Reduce glow for a subtle effect
material.depthWrite = false; // Avoids hard edges from depth sorting
material.alphaTest = 0.05; // Prevents harsh clipping of semi-transparent areas
material.blending = THREE.NormalBlending; // Soft blending instead of additive
material.side = THREE.DoubleSide; // Ensures visibility from all angles


                
            }
          });
        } else if (mesh.material instanceof MeshStandardMaterial) {
          mesh.material.transparent = true;
          mesh.material.depthWrite = true;
          mesh.material.alphaTest = 0.5;
        }
      }
    });
  }, [actions, scene.uuid]); // Keep dependencies stable

  return <primitive object={scene} scale={1.5} />;
}

export default function ModelViewer() {
  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 4, 2]} intensity={1.5} />
        <Suspense fallback={null}>
          <AnimatedModel modelPath="/models/fantasy_sea_keep.glb" />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>

  );
}
