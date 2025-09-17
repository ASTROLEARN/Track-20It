import * as THREE from "three";
import React, { useEffect, useRef } from "react";

export function Scene3D() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const width = ref.current.clientWidth;
    const height = 220;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    ref.current.appendChild(renderer.domElement);

    const geometry = new THREE.TorusKnotGeometry(1.2, 0.4, 128, 16);
    const material = new THREE.MeshStandardMaterial({ color: new THREE.Color("hsl(258, 88%, 60%)"), metalness: 0.2, roughness: 0.1 });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const light1 = new THREE.DirectionalLight(0xffffff, 0.9);
    light1.position.set(2, 2, 3);
    scene.add(light1);
    const light2 = new THREE.PointLight(0x60a5fa, 1, 10);
    light2.position.set(-3, -1, 2);
    scene.add(light2);

    let mounted = true;
    const animate = () => {
      if (!mounted) return;
      mesh.rotation.x += 0.005;
      mesh.rotation.y += 0.007;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      if (!ref.current) return;
      const w = ref.current.clientWidth;
      renderer.setSize(w, height);
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      mounted = false;
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      ref.current?.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={ref} className="hidden lg:block" />;
}
