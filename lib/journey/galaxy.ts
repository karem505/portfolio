export interface FieldGeometry {
  count: number
  /** xyz per point, face-on log-spiral galaxy in the XY plane. */
  galaxy: Float32Array
  /** xyz per point, jittered cubic lattice (the "ordered" state). */
  lattice: Float32Array
  /** rgb per point, 0..1. */
  color: Float32Array
  /** point size multiplier, 0.6..2.4. */
  size: Float32Array
  /** twinkle phase, 0..2π. */
  seed: Float32Array
}

export interface GalaxyOptions {
  count: number
  seed?: number
  arms?: number
  radius?: number
  latticeSize?: number
}

/** Site palette in 0..1 (paper #f5f1ea, signal #ff3b1f, ash #a09690). */
export const PALETTE = {
  paper: [0.961, 0.945, 0.918],
  signal: [1.0, 0.231, 0.122],
  ash: [0.627, 0.588, 0.565],
} as const

export const SIGNAL_RATIO = 0.09
export const ASH_RATIO = 0.03

/** mulberry32: tiny deterministic PRNG so the field is identical on every load. */
export function createRng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function buildFieldGeometry({
  count,
  seed = 20260902,
  arms = 3,
  radius = 5,
  latticeSize = 9,
}: GalaxyOptions): FieldGeometry {
  const rng = createRng(seed)
  const galaxy = new Float32Array(count * 3)
  const lattice = new Float32Array(count * 3)
  const color = new Float32Array(count * 3)
  const size = new Float32Array(count)
  const seedArr = new Float32Array(count)

  const side = Math.ceil(Math.cbrt(count))
  const cell = latticeSize / side
  const jitter = () => (rng() - 0.5) * cell * 0.16

  for (let i = 0; i < count; i++) {
    // --- galaxy: dense core, three twisted arms, thin disc ---
    const r = radius * (0.04 + 0.96 * Math.pow(rng(), 0.75))
    const armAngle = (i % arms) * ((Math.PI * 2) / arms)
    const twist = r * 0.85
    // Arms tighten toward the core and diffuse outward, so the outer arms read as
    // haze rather than bright hairlines behind body copy.
    const spread = 0.1 + 0.3 * (r / radius)
    const sgn = () => (rng() < 0.5 ? 1 : -1)
    const rx = Math.pow(rng(), 3) * sgn() * spread * radius * 0.3
    const ry = Math.pow(rng(), 3) * sgn() * spread * radius * 0.3
    const rz = Math.pow(rng(), 3) * sgn() * spread * radius * 0.12
    const a = armAngle + twist
    galaxy[i * 3] = Math.cos(a) * r + rx
    galaxy[i * 3 + 1] = Math.sin(a) * r + ry
    galaxy[i * 3 + 2] = rz

    // --- lattice: centred cube grid with slight jitter ---
    const ix = i % side
    const iy = Math.floor(i / side) % side
    const iz = Math.floor(i / (side * side))
    lattice[i * 3] = (ix + 0.5) * cell - latticeSize / 2 + jitter()
    lattice[i * 3 + 1] = (iy + 0.5) * cell - latticeSize / 2 + jitter()
    lattice[i * 3 + 2] = (iz + 0.5) * cell - latticeSize / 2 + jitter()

    // --- colour: mostly paper, ~9% signal, ~3% ash; warm the core ---
    const roll = rng()
    const base =
      roll < SIGNAL_RATIO ? PALETTE.signal : roll < SIGNAL_RATIO + ASH_RATIO ? PALETTE.ash : PALETTE.paper
    const core = r < radius * 0.2 ? 0.25 : 0
    color[i * 3] = base[0] * (1 - core) + PALETTE.signal[0] * core
    color[i * 3 + 1] = base[1] * (1 - core) + PALETTE.signal[1] * core
    color[i * 3 + 2] = base[2] * (1 - core) + PALETTE.signal[2] * core

    size[i] = 0.6 + rng() * 1.8
    seedArr[i] = rng() * Math.PI * 2
  }

  return { count, galaxy, lattice, color, size, seed: seedArr }
}
