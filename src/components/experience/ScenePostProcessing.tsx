'use client'

import { EffectComposer, Bloom, Vignette, DepthOfField } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

export default function ScenePostProcessing() {
  return (
    <EffectComposer>
      <Bloom intensity={0.9} luminanceThreshold={0.55} luminanceSmoothing={0.3} />
      <DepthOfField focusDistance={0.012} focalLength={0.045} bokehScale={3.5} />
      <Vignette offset={0.38} darkness={0.72} blendFunction={BlendFunction.NORMAL} />
    </EffectComposer>
  )
}
