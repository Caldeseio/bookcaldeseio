'use client'

export default function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.25} color="#F8E4A0" />
      <spotLight
        position={[3, 8, 4]}
        angle={0.42}
        penumbra={0.6}
        intensity={3.5}
        color="#FFD98A"
        castShadow
      />
      <pointLight position={[-2, 3, 2]} intensity={0.5} color="#E8903A" />
    </>
  )
}
