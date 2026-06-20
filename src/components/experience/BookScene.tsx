'use client'

import Desk from './Desk'
import SceneLighting from './SceneLighting'
import ScenePostProcessing from './ScenePostProcessing'

interface Props { flashRef: React.RefObject<HTMLDivElement | null> }

export default function BookScene({ flashRef: _ }: Props) {
  return (
    <>
      <SceneLighting />
      <Desk />
      {/* Book geometry added in Task 8 */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[2, 2.8, 0.32]} />
        <meshStandardMaterial color="#1B2B1E" roughness={0.55} />
      </mesh>
      <ScenePostProcessing />
    </>
  )
}
