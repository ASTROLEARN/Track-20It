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
    const isMobile = window.innerWidth < 768;
    const actualHeight = isMobile ? Math.min(height, 240) : height;
    
    // Check for WebGL support
    const canvas = document.createElement('canvas');
    const webglSupported = !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    container.style.height = `${actualHeight}px`;
    
    // Fallback for unsupported devices
    if (!webglSupported) {
      container.innerHTML = '<div style="width: 100%; height: 100%; background: linear-gradient(135deg, hsl(258, 88%, 70%), hsl(258, 88%, 50%)); border-radius: 20%; opacity: 0.8;" aria-label="3D visualization placeholder"></div>';
      return;
    }
    
    const width =
      container.clientWidth || container.getBoundingClientRect().width || 300;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / actualHeight, 0.1, 100);
    // Adjust camera position for mobile to fit better in smaller space
    camera.position.set(0, 0, isMobile ? 5 : 6);

    const renderer = new THREE.WebGLRenderer({ 
      antialias: !isMobile, // Disable antialiasing on mobile for better performance
      alpha: true,
      powerPreference: isMobile ? "low-power" : "default"
    });
    renderer.setPixelRatio(Math.min(isMobile ? 1.5 : 2, window.devicePixelRatio || 1));
    renderer.setSize(width, actualHeight);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    container.appendChild(renderer.domElement);

    // Adjust geometry size for mobile
    const knopSize = isMobile ? 1.0 : 1.2;
    const tubeSize = isMobile ? 0.35 : 0.4;
    const segmentsCount = isMobile ? 100 : 160; // Reduce complexity on mobile
    
    const geometry = new THREE.TorusKnotGeometry(knopSize, tubeSize, segmentsCount, 24);
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
    // Respect reduced motion preference and mobile performance
    const rotationSpeed = prefersReducedMotion ? 0 : (isMobile ? 0.5 : 1);
    
    const animate = () => {
      if (!mounted) return;
      if (!prefersReducedMotion) {
        mesh.rotation.x += 0.004 * rotationSpeed;
        mesh.rotation.y += 0.006 * rotationSpeed;
      }
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      if (!container) return;
      const newIsMobile = window.innerWidth < 768;
      const newHeight = newIsMobile ? Math.min(height, 240) : height;
      const w =
        container.clientWidth ||
        container.getBoundingClientRect().width ||
        width;
      renderer.setSize(w, newHeight);
      camera.aspect = w / newHeight;
      camera.updateProjectionMatrix();
      
      // Update container height on resize
      container.style.height = `${newHeight}px`;
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

  return (
    <div 
      ref={ref} 
      className={className}
      role="img"
      aria-label="Animated 3D torus knot visualization"
      style={{ touchAction: 'none' }}
    />
  );
}
