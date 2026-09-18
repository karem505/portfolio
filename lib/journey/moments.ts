export const MOMENTS = ['portrait', 'expertise', 'experience', 'tornix', 'oravex', 'costra', 'signature'] as const
export type Moment = typeof MOMENTS[number]
const clamp = (n: number) => Number.isFinite(n) ? Math.max(0, Math.min(1, n)) : 0

export function momentProgress(top: number, height: number, viewport: number) {
  return clamp((viewport - top) / Math.max(1, viewport + height))
}

/** Absolute scroll poses: forward/backward, refresh and anchor navigation agree. */
export function momentPose(kind: Moment, progress: number) {
  const p = clamp(progress)
  const assembly = p * p * (3 - 2 * p)
  if (kind === 'portrait') return { x: 0, y: 0, z: 0, assembly: 1 }
  if (kind === 'signature') return { x: .16 * (1 - assembly), y: .8 * (assembly - 1), z: 0, assembly }
  return { x: -.2 + .3 * p, y: -.45 + .9 * p, z: -.07 + .14 * p, assembly }
}
