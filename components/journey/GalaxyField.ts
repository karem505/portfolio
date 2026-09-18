import { AmbientLight, BoxGeometry, BufferGeometry, DirectionalLight, EdgesGeometry, ExtrudeGeometry, Group, LineBasicMaterial, LineSegments, Mesh, MeshStandardMaterial, OrthographicCamera, Scene, WebGLRenderer, type Material } from 'three'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import { PERSONAL_MARK_PATH, PERSONAL_DOT_PATH } from './AssemblyVisual'
import { momentPose, momentProgress, type Moment } from '@/lib/journey/moments'

export interface GalaxyFieldOptions { dpr: number }
type Sculpture = { element: HTMLElement; kind: Moment; scene: Scene; group: Group; pieces: Group[] }

/** One lazy, low-power WebGL context. Scissor regions never contain readable copy.
 * No idle loop: scroll, resize, and visibility changes request a single frame.
 * The public name is retained so JourneyStage's lazy import stays compatible.
 */
export class GalaxyField {
  private renderer: WebGLRenderer
  private camera = new OrthographicCamera(-4, 4, 2, -2, .1, 100)
  private sculptures: Sculpture[] = []
  private geometries = new Set<BufferGeometry>()
  private materials = new Set<Material>()
  private frame = 0
  private running = false
  private disposed = false
  private observer: ResizeObserver
  private readonly lost = (event: Event) => { event.preventDefault(); this.stop(); this.fallback() }
  private readonly restored = () => { if (!document.hidden) this.start() }

  constructor(private canvas: HTMLCanvasElement, opts: GalaxyFieldOptions) {
    this.renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' })
    this.renderer.setPixelRatio(Math.min(opts.dpr, 1.5))
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.autoClear = false
    this.camera.position.set(0, 0, 10)
    document.querySelectorAll<HTMLElement>('[data-assembly]').forEach(element => {
      const kind = element.dataset.assembly as Moment
      // The portrait already has a crisp SSR frame. Keep WebGL away from the face.
      if (kind === 'portrait') return
      this.sculptures.push(this.createSculpture(element, kind))
    })
    this.observer = new ResizeObserver(() => this.request())
    this.sculptures.forEach(s => this.observer.observe(s.element))
    const main = document.querySelector('main')
    if (main) this.observer.observe(main)
    canvas.addEventListener('webglcontextlost', this.lost)
    canvas.addEventListener('webglcontextrestored', this.restored)
    window.addEventListener('scroll', this.request, { passive: true })
    this.resize()
  }

  private material(color: number, opacity = 1) {
    const mat = new MeshStandardMaterial({ color, metalness: .5, roughness: .35, transparent: opacity < 1, opacity })
    this.materials.add(mat)
    return mat
  }

  private box(w: number, h: number, d: number, color = 0x2a2522) {
    const group = new Group()
    const geometry = new BoxGeometry(w, h, d)
    const edges = new EdgesGeometry(geometry)
    const line = new LineBasicMaterial({ color: color === 0xff3b1f ? 0xff8a77 : 0xa09690, transparent: true, opacity: .75 })
    this.geometries.add(geometry); this.geometries.add(edges); this.materials.add(line)
    group.add(new Mesh(geometry, this.material(color)), new LineSegments(edges, line))
    return group
  }

  private createSculpture(element: HTMLElement, kind: Moment): Sculpture {
    const scene = new Scene(), group = new Group(), pieces: Group[] = []
    scene.add(new AmbientLight(0xffffff, 2))
    const key = new DirectionalLight(0xffb4a0, 4); key.position.set(-3, 5, 7); scene.add(key)
    const rim = new DirectionalLight(0xf5f1ea, 3); rim.position.set(4, 1, -3); scene.add(rim)
    scene.add(group)
    const piece = (w: number, h: number, d: number, x: number, y: number, z: number, accent = false) => {
      const mesh = this.box(w, h, d, accent ? 0xff3b1f : 0x2a2522)
      mesh.position.set(x, y, z)
      mesh.userData.base = { x, y, z }; pieces.push(mesh); group.add(mesh)
      return mesh
    }
    if (kind === 'expertise' || kind === 'oravex') {
      for (let i = 0; i < 6; i++) piece(.74, .54, .65, (i % 3 - 1) * 1.08, (Math.floor(i / 3) - .5) * .9, 0, i === 1)
      piece(3.15, .035, .05, 0, 0, -.45)
      for (let i = 0; i < 3; i++) piece(.035, .85, .05, (i-1)*1.08, 0, -.45)
    } else if (kind === 'experience') {
      for (let i = 0; i < 3; i++) {
        const plate = piece(3.2, .13, 1.2, 0, (i-1)*.55, (i-1)*-.1, i === 2)
        plate.rotation.x = .22
        piece(.07, .35, .07, -1.3 + i * 1.3, (i-1)*.55+.24, .1, true)
      }
    } else if (kind === 'tornix') {
      piece(3.3, 1.85, .1, 0, 0, -.23)
      for (let i = 0; i < 4; i++) {
        piece(2.9, .02, .025, 0, .62-i*.4, -.15)
        piece(.78+i*.12, .19, .24, -.85+i*.46, .48-i*.36, .04, i === 1)
      }
    } else if (kind === 'costra') {
      piece(3.5, .09, 1.1, 0, -.93, 0)
      for (let i = 0; i < 4; i++) piece(.52, .45+i*.35, .6, -.99+i*.66, -.66+i*.175, 0, i === 3)
    } else {
      const parsed = new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${PERSONAL_MARK_PATH}"/><path transform="translate(500 0)" d="${PERSONAL_DOT_PATH}"/></svg>`)
      for (const path of parsed.paths) for (const shape of SVGLoader.createShapes(path)) {
        const geometry = new ExtrudeGeometry(shape, { depth: 11, bevelEnabled: false })
        geometry.translate(-475, 275, -5.5); geometry.scale(.0048, -.0048, .0048)
        this.geometries.add(geometry)
        group.add(new Mesh(geometry, this.material(path === parsed.paths[0] ? 0xf5f1ea : 0xff3b1f)))
      }
    }
    return { element, kind, scene, group, pieces }
  }

  resize() {
    if (this.disposed) return
    this.renderer.setSize(window.innerWidth, window.innerHeight, false)
    this.request()
  }
  start() { if (!this.disposed) { this.running = true; this.request() } }
  stop() { this.running = false; if (this.frame) cancelAnimationFrame(this.frame); this.frame = 0 }
  private fallback() { this.sculptures.forEach(s => { delete s.element.dataset.rendered; delete s.element.dataset.pose }) }
  dispose() {
    if (this.disposed) return
    this.stop(); this.disposed = true; this.observer.disconnect(); this.fallback()
    window.removeEventListener('scroll', this.request)
    this.canvas.removeEventListener('webglcontextlost', this.lost)
    this.canvas.removeEventListener('webglcontextrestored', this.restored)
    this.geometries.forEach(g => g.dispose()); this.materials.forEach(m => m.dispose())
    // Dispose resources, but preserve this canvas's context for preference rebuilds.
    this.renderer.dispose()
  }
  private readonly request = () => {
    if (!this.running || this.frame || this.disposed || document.hidden) return
    this.frame = requestAnimationFrame(this.draw)
  }
  private readonly draw = () => {
    this.frame = 0
    if (!this.running || this.disposed || document.hidden) return
    try {
      const W = window.innerWidth, H = window.innerHeight
      this.renderer.setScissorTest(false); this.renderer.setViewport(0, 0, W, H); this.renderer.clear()
      this.renderer.setScissorTest(true)
      for (const s of this.sculptures) {
        const rect = s.element.getBoundingClientRect()
        if (rect.bottom <= 0 || rect.top >= H || rect.width <= 0 || rect.height <= 0) continue
        const p = momentProgress(rect.top, rect.height, H)
        const pose = momentPose(s.kind, p)
        s.group.rotation.set(pose.x, pose.y, pose.z)
        s.pieces.forEach((piece, i) => {
          const base = piece.userData.base
          const spread = 1 - pose.assembly
          piece.position.set(base.x * (1 + spread * .22), base.y * (1 + spread * .35), base.z + ((i % 3)-1) * spread * .55)
        })
        const halfH = s.kind === 'signature' ? 1.6 : 1.9
        this.camera.top = halfH; this.camera.bottom = -halfH
        this.camera.left = -halfH * rect.width / rect.height; this.camera.right = -this.camera.left
        this.camera.updateProjectionMatrix()
        const navBottom = document.querySelector('nav')?.getBoundingClientRect().bottom ?? 0
        const left = Math.max(0, rect.left), top = Math.max(navBottom, rect.top)
        const width = Math.min(W, rect.right)-left, height = Math.min(H, rect.bottom)-top
        if (width <= 0 || height <= 0) continue
        this.renderer.setViewport(rect.left, H-rect.bottom, rect.width, rect.height)
        this.renderer.setScissor(left, H-top-height, width, height)
        this.renderer.render(s.scene, this.camera)
        s.element.dataset.rendered = 'true'
        s.element.dataset.pose = `${pose.y.toFixed(4)},${pose.assembly.toFixed(4)}`
      }
    } catch {
      // GPU failures cannot leave hidden fallback artwork behind.
      this.stop(); this.fallback()
    }
  }
}
