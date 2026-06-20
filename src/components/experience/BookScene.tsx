'use client'

interface Props { flashRef: React.RefObject<HTMLDivElement | null> }

export default function BookScene({ flashRef: _ }: Props) {
  return (
    <>
      <ambientLight intensity={0.3} color="#F1EDE3" />
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 2.8, 0.3]} />
        <meshStandardMaterial color="#1B2B1E" />
      </mesh>
    </>
  )
}
