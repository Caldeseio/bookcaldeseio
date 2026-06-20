'use client'

export default function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.12} color="#F1EDE3" />
      <spotLight
        position={[4, 9, 5]}
        angle={0.38}
        penumbra={0.65}
        intensity={4}
        color="#FFD98A"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-3, 2, -2]} intensity={0.5} color="#4F9D5B" />
    </>
  )
}
