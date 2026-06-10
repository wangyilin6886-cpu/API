import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function WireSphere() {
  const group = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.25
      group.current.rotation.x += delta * 0.08
    }
  })
  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[2, 4]} />
        <meshStandardMaterial
          color="#185fa5"
          wireframe
          emissive="#3b9ae1"
          emissiveIntensity={0.5}
          roughness={0.3}
        />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[1.55, 2]} />
        <meshStandardMaterial
          color="#3b9ae1"
          transparent
          opacity={0.18}
          emissive="#3b9ae1"
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.4}
        />
      </mesh>
    </group>
  )
}

function Particles() {
  const points = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const count = 900
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 2.6 + Math.random() * 1.8
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [])
  useFrame((_, delta) => {
    if (points.current) points.current.rotation.y -= delta * 0.06
  })
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.045} color="#3b9ae1" transparent opacity={0.85} sizeAttenuation />
    </points>
  )
}

function Ring({ tilt }: { tilt: number }) {
  const ring = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (ring.current) ring.current.rotation.z += delta * 0.3
  })
  return (
    <mesh ref={ring} rotation={[tilt, 0.4, 0]}>
      <torusGeometry args={[3, 0.012, 16, 120]} />
      <meshBasicMaterial color="#185fa5" transparent opacity={0.5} />
    </mesh>
  )
}

export default function Sphere3D() {
  return (
    <Canvas camera={{ position: [0, 0, 7], fov: 45 }} dpr={[1, 2]}>
      <ambientLight intensity={0.6} />
      <pointLight position={[5, 5, 5]} intensity={1.4} color="#3b9ae1" />
      <pointLight position={[-5, -3, 2]} intensity={1.1} color="#185fa5" />
      <WireSphere />
      <Particles />
      <Ring tilt={1.4} />
      <Ring tilt={0.3} />
    </Canvas>
  )
}
