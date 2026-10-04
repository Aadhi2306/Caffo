import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, Float } from '@react-three/drei';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float uTime;
  uniform float uProgress;
  void main() {
    vUv = uv;
    vPosition = position;
    float ripple = sin(position.x * 12.0 + uTime * 4.0) * cos(position.y * 12.0 + uTime * 4.0) * 0.015 * smoothstep(0.0, 0.2, uProgress);
    vec3 newPos = position;
    newPos.z += ripple; 
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform float uProgress;
  uniform vec3 colorEmpty;
  uniform vec3 colorFull;
  uniform float isNight;
  varying vec2 vUv;
  
  float random (in vec2 st) { return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123); }
  float noise (in vec2 st) {
      vec2 i = floor(st); vec2 f = fract(st);
      float a = random(i); float b = random(i + vec2(1.0, 0.0)); float c = random(i + vec2(0.0, 1.0)); float d = random(i + vec2(1.0, 1.0));
      vec2 u = f*f*(3.0-2.0*f);
      return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  void main() {
    float dist = distance(vUv, vec2(0.5));
    float swirlActive = smoothstep(0.4, 0.6, uProgress) * (1.0 - smoothstep(0.75, 0.9, uProgress));
    
    vec2 pos = vUv - 0.5;
    float angle = uTime * 0.8 * swirlActive;
    float s = sin(angle - dist * 8.0 * swirlActive);
    float c = cos(angle - dist * 8.0 * swirlActive);
    mat2 rot = mat2(c, -s, s, c);
    pos = rot * pos;
    
    float n = noise(pos * 8.0 + uTime * 0.3);
    
    vec3 baseColor = mix(colorEmpty, colorFull, clamp(uProgress, 0.0, 1.0));
    vec3 milkColor = vec3(0.95, 0.9, 0.85); // creamy white
    
    float pattern = smoothstep(0.3, 0.7, n + swirlActive * 0.4);
    vec3 finalColor = mix(baseColor, mix(baseColor, milkColor, swirlActive), pattern * swirlActive);
    
    // Foam ring at edge when full
    float foamRing = smoothstep(0.35, 0.48, dist) * smoothstep(0.7, 1.0, uProgress);
    finalColor = mix(finalColor, milkColor, foamRing * 0.8);
    
    // Dim the unlit shader in night mode to fake lighting
    finalColor *= (1.0 - isNight * 0.3);

    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const CoffeeLiquid = ({ progress, isNight }) => {
  const meshRef = useRef();
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uProgress: { value: 0 },
    colorEmpty: { value: new THREE.Color("#1a0f08") },
    colorFull: { value: new THREE.Color("#c48b61") },
    isNight: { value: isNight ? 1.0 : 0.0 }
  }), [isNight]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, -1.3 + progress * 2.6, 0.05);
      meshRef.current.rotation.x = -Math.PI / 2 + Math.sin(state.clock.elapsedTime * 2) * 0.015;
      meshRef.current.rotation.y = Math.cos(state.clock.elapsedTime * 2.5) * 0.015;
      
      meshRef.current.material.uniforms.uTime.value = state.clock.elapsedTime;
      meshRef.current.material.uniforms.uProgress.value = THREE.MathUtils.lerp(meshRef.current.material.uniforms.uProgress.value, progress, 0.05);
      meshRef.current.material.uniforms.isNight.value = isNight ? 1.0 : 0.0;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -1.3, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <circleGeometry args={[1.45, 64]} />
      <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} />
    </mesh>
  );
};

const CoffeeCup3D = ({ progress, isHovering = false, theme = 'day' }) => {
  const groupRef = useRef();
  const isNight = theme === 'night';

  useFrame((state) => {
    if (groupRef.current) {
      if (isHovering) {
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.pointer.x * 0.4, 0.05);
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -state.pointer.y * 0.2 + 0.2, 0.05);
      } else {
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        groupRef.current.rotation.x = 0.2;
      }
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.4}>
      <group ref={groupRef} position={[0, -0.5, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[1.6, 1.3, 3, 64, 1, true]} />
          <meshPhysicalMaterial color={isNight ? "#a0a0a0" : "#fdfdfd"} metalness={0.1} roughness={isNight ? 0.3 : 0.1} clearcoat={1} clearcoatRoughness={0.1} side={THREE.DoubleSide} transparent opacity={isNight ? 0.7 : 0.9} />
        </mesh>
        
        <mesh position={[0, -0.05, 0]} receiveShadow>
          <cylinderGeometry args={[1.55, 1.25, 2.9, 64, 1, true]} />
          <meshStandardMaterial color={isNight ? "#8b7e73" : "#d4c5b9"} side={THREE.BackSide} />
        </mesh>

        <mesh position={[0, -1.5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.3, 1.25, 0.2, 64]} />
          <meshPhysicalMaterial color={isNight ? "#a0a0a0" : "#fdfdfd"} roughness={0.1} />
        </mesh>
        
        <mesh position={[1.55, 0.2, 0]} rotation={[0, 0, -Math.PI / 10]} castShadow receiveShadow>
          <torusGeometry args={[0.7, 0.25, 32, 32, Math.PI * 1.2]} />
          <meshPhysicalMaterial color={isNight ? "#a0a0a0" : "#fdfdfd"} roughness={0.1} />
        </mesh>

        <CoffeeLiquid progress={progress} isNight={isNight} />

        {progress > 0.1 && (
           <Sparkles count={Math.floor(progress * 40) + 10} scale={[2.5, 5, 2.5]} size={4} position={[0, 2, 0]} speed={0.3} opacity={isNight ? 0.15 : 0.3} color="#ffffff" noise={1} />
        )}
      </group>
    </Float>
  );
};

export default CoffeeCup3D;
