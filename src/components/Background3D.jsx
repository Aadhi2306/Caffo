import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';

const FloatingMote = ({ position, speed, size, color }) => {
  const ref = useRef();
  useFrame((state) => {
    ref.current.rotation.x += speed * 0.005;
    ref.current.rotation.y += speed * 0.005;
    ref.current.position.y += Math.sin(state.clock.elapsedTime * speed) * 0.002;
  });

  return (
    <mesh ref={ref} position={position} receiveShadow castShadow>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial color={color} opacity={0.15} transparent depthWrite={false} roughness={0.4} />
    </mesh>
  );
};

const Background3D = ({ theme }) => {
  const isNight = theme === 'night';
  const bgColor = isNight ? '#1e120d' : '#ece0d1';
  const fogColor = isNight ? '#1e120d' : '#ece0d1';
  const ambientIntensity = isNight ? 0.3 : 0.9;
  const directionalColor = isNight ? '#ffb366' : '#fffaf0'; 
  const directionalIntensity = isNight ? 0.7 : 1.5;
  const pointLightIntensity = isNight ? 2.5 : 0.5;

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, pointerEvents: 'none', background: bgColor, transition: 'background 1.5s ease' }}>
      <Canvas shadows camera={{ position: [0, 0, 15], fov: 45 }}>
        <fog attach="fog" args={[fogColor, 10, 35]} />
        <ambientLight intensity={ambientIntensity} />
        <directionalLight position={[10, 15, 10]} intensity={directionalIntensity} color={directionalColor} castShadow shadow-mapSize={[1024, 1024]} />
        
        {/* Cozy point light mimicking a café lamp */}
        <pointLight position={[0, 5, 2]} intensity={pointLightIntensity} color="#ffa500" distance={20} />
        
        <Sparkles count={isNight ? 100 : 200} scale={25} size={isNight ? 4 : 3} speed={0.1} opacity={isNight ? 0.5 : 0.3} color={isNight ? "#ffd700" : "#ffffff"} noise={2} />
        
        <FloatingMote position={[-6, 4, -10]} speed={1} size={3} color={isNight ? "#a0522d" : "#ffffff"} />
        <FloatingMote position={[8, -2, -15]} speed={0.8} size={5} color={isNight ? "#8b4513" : "#ffffff"} />
        <FloatingMote position={[-5, -6, -12]} speed={1.2} size={4} color={isNight ? "#d2b48c" : "#ffffff"} />
        <FloatingMote position={[5, 6, -8]} speed={0.9} size={2.5} color={isNight ? "#cd853f" : "#ffffff"} />
      </Canvas>
    </div>
  );
};

export default Background3D;
