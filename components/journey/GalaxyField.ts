import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from 'three'
import { buildFieldGeometry } from '@/lib/journey/galaxy'
import type { FieldState } from '@/lib/journey/field'

const VERT = /* glsl */ `
attribute vec3 aGalaxy;
attribute vec3 aLattice;
attribute vec3 aColor;
attribute float aSize;
attribute float aSeed;
uniform float uSpin;
uniform float uOrder;
uniform float uTime;
uniform float uPixelRatio;
uniform float uDensity;
varying vec3 vColor;
varying float vAlpha;
void main() {
  float c = cos(uSpin);
  float s = sin(uSpin);
  vec3 g = vec3(aGalaxy.x * c - aGalaxy.y * s, aGalaxy.x * s + aGalaxy.y * c, aGalaxy.z);
  float k = uOrder * uOrder * (3.0 - 2.0 * uOrder);
  vec3 p = mix(g, aLattice, k);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aSize * uPixelRatio * (16.0 / -mv.z);
  float tw = 0.7 + 0.3 * sin(uTime * 0.9 + aSeed);
  vColor = aColor;
  vAlpha = tw * uDensity;
}`

const FRAG = /* glsl */ `
precision mediump float;
varying vec3 vColor;
varying float vAlpha;
void main() {
  vec2 d = gl_PointCoord - vec2(0.5);
  float r2 = dot(d, d);
  if (r2 > 0.25) discard;
  float a = smoothstep(0.25, 0.02, r2);
  gl_FragColor = vec4(vColor, a * vAlpha * 0.5);
}`

export interface GalaxyFieldOptions {
  count: number
  dpr: number
}

const KEYS = ['spin', 'order', 'dolly', 'density'] as const

/**
 * One Points mesh whose vertices carry both a galaxy position and a lattice
 * position; `uOrder` mixes between them. Renders on demand: full rate while
 * the state or pointer is moving, ≤ 20 fps twinkle when idle.
 */
export class GalaxyField {
  private renderer: WebGLRenderer
  private scene = new Scene()
  private camera: PerspectiveCamera
  private geometry: BufferGeometry
  private material: ShaderMaterial
  private current: FieldState = { spin: 0, order: 0, dolly: 8, density: 1 }
  private target: FieldState = { spin: 0, order: 0, dolly: 8, density: 1 }
  private pointer = { x: 0, y: 0, tx: 0, ty: 0 }
  private raf = 0
  private running = false
  private lastRender = 0
  private readonly t0 = performance.now()
  private readonly onLost = (e: Event) => {
    e.preventDefault()
    this.stop()
  }
  private readonly onRestored = () => this.start()

  constructor(private canvas: HTMLCanvasElement, opts: GalaxyFieldOptions) {
    this.renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'low-power',
      premultipliedAlpha: false,
    })
    this.renderer.setPixelRatio(opts.dpr)
    this.renderer.setClearColor(0x000000, 0)

    this.camera = new PerspectiveCamera(50, 1, 0.1, 100)
    this.camera.position.z = this.current.dolly

    const g = buildFieldGeometry({ count: opts.count })
    this.geometry = new BufferGeometry()
    this.geometry.setAttribute('position', new BufferAttribute(g.galaxy, 3))
    this.geometry.setAttribute('aGalaxy', new BufferAttribute(g.galaxy, 3))
    this.geometry.setAttribute('aLattice', new BufferAttribute(g.lattice, 3))
    this.geometry.setAttribute('aColor', new BufferAttribute(g.color, 3))
    this.geometry.setAttribute('aSize', new BufferAttribute(g.size, 1))
    this.geometry.setAttribute('aSeed', new BufferAttribute(g.seed, 1))

    this.material = new ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: AdditiveBlending,
      uniforms: {
        uSpin: { value: 0 },
        uOrder: { value: 0 },
        uTime: { value: 0 },
        uPixelRatio: { value: opts.dpr },
        uDensity: { value: 1 },
      },
    })

    const points = new Points(this.geometry, this.material)
    points.frustumCulled = false
    this.scene.add(points)

    canvas.addEventListener('webglcontextlost', this.onLost)
    canvas.addEventListener('webglcontextrestored', this.onRestored)
    this.resize()
  }

  setTarget(state: FieldState) {
    this.target = state
  }

  /** x, y in -0.5..0.5 (viewport-relative pointer). */
  setPointer(x: number, y: number) {
    this.pointer.tx = x
    this.pointer.ty = y
  }

  resize() {
    const w = window.innerWidth
    const h = window.innerHeight
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.render(performance.now())
  }

  start() {
    if (this.running) return
    this.running = true
    this.raf = requestAnimationFrame(this.tick)
  }

  stop() {
    this.running = false
    if (this.raf) cancelAnimationFrame(this.raf)
    this.raf = 0
  }

  dispose() {
    this.stop()
    this.canvas.removeEventListener('webglcontextlost', this.onLost)
    this.canvas.removeEventListener('webglcontextrestored', this.onRestored)
    this.geometry.dispose()
    this.material.dispose()
    this.renderer.dispose()
  }

  private readonly tick = (now: number) => {
    if (!this.running) return
    this.raf = requestAnimationFrame(this.tick)
    const c = this.current
    const t = this.target
    let delta = 0
    for (const k of KEYS) {
      const d = t[k] - c[k]
      c[k] += d * 0.08
      delta += Math.abs(d)
    }
    const p = this.pointer
    const pd = Math.abs(p.tx - p.x) + Math.abs(p.ty - p.y)
    p.x += (p.tx - p.x) * 0.06
    p.y += (p.ty - p.y) * 0.06
    const busy = delta > 1e-3 || pd > 1e-3
    if (!busy && now - this.lastRender < 50) return
    this.render(now)
  }

  private render(now: number) {
    this.lastRender = now
    const c = this.current
    const u = this.material.uniforms
    u.uSpin.value = c.spin
    u.uOrder.value = c.order
    u.uDensity.value = c.density
    u.uTime.value = (now - this.t0) / 1000
    this.camera.position.set(this.pointer.x * 0.9, -this.pointer.y * 0.6, c.dolly)
    this.camera.lookAt(0, 0, 0)
    this.renderer.render(this.scene, this.camera)
  }
}
