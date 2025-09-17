import * as THREE from "three";
import React, { useEffect, useRef } from "react";

export function Scene3D({
  height = 300,
  className,
}: {
  height?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const container = ref.current;
    container.style.height = `${height}px`;
    const width =
      container.clientWidth || container.getBoundingClientRect().width || 300;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(width, height);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    container.appendChild(renderer.domElement);

    const geometry = new THREE.TorusKnotGeometry(1.2, 0.4, 160, 24);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color("hsl(258, 88%, 60%)"),
      metalness: 0.3,
      roughness: 0.15,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(2, 2, 3);
    scene.add(light1);
    const light2 = new THREE.PointLight(0x60a5fa, 1, 10);
    light2.position.set(-3, -1, 2);
    scene.add(light2);

    let mounted = true;
    const animate = () => {
      if (!mounted) return;
      mesh.rotation.x += 0.004;
      mesh.rotation.y += 0.006;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      if (!container) return;
      const w =
        container.clientWidth ||
        container.getBoundingClientRect().width ||
        width;
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
      container?.removeChild(renderer.domElement);
    };
  }, [height]);

  return <div ref={ref} className={className} />;
}
