import React, { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import * as THREE from "three";

export default function Player() {
  const controlsRef = useRef<React.ElementRef<typeof PointerLockControls> | null>(null);
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const move = useRef({ forward: false, back: false, left: false, right: false });

  const { camera } = useThree();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "KeyW") move.current.forward = true;
      if (e.code === "KeyS") move.current.back = true;
      if (e.code === "KeyA") move.current.left = true;
      if (e.code === "KeyD") move.current.right = true;
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "KeyW") move.current.forward = false;
      if (e.code === "KeyS") move.current.back = false;
      if (e.code === "KeyA") move.current.left = false;
      if (e.code === "KeyD") move.current.right = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    if (!controlsRef.current) return;

    const speed = 3;
    direction.current.set(0, 0, 0);
    if (move.current.forward) direction.current.z -= 1;
    if (move.current.back) direction.current.z += 1;
    if (move.current.left) direction.current.x -= 1;
    if (move.current.right) direction.current.x += 1;
    direction.current.normalize();

    // Move relative to camera orientation
    const camQuat = camera.quaternion.clone();
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camQuat);
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camQuat);

    const moveVec = new THREE.Vector3();
    moveVec.addScaledVector(forward, direction.current.z);
    moveVec.addScaledVector(right, direction.current.x);
    moveVec.y = 0;
    moveVec.normalize().multiplyScalar(speed * delta);

    camera.position.add(moveVec);
    camera.position.y = 1.6; // keep at head height
  });

  return <PointerLockControls ref={controlsRef} />; // pointer lock for FPS controls
}



