import type { Moment } from '@/lib/journey/moments'

// This is the existing personal mark, not a new campaign/product logo.
export const PERSONAL_MARK_PATH = 'M229.28 10.00Q146.00 10.00 97.50 -35.04Q49.00 -80.08 49.00 -157.00Q49.00 -240.00 106.50 -284.50Q164.00 -329.00 272.00 -329.00H386.00V-370.00Q386.00 -402.00 363.50 -421.00Q341.00 -440.00 303.00 -440.00Q268.49 -440.00 245.24 -424.00Q222.00 -408.00 217.00 -380.00H72.00Q81.00 -463.00 144.50 -511.50Q208.00 -560.00 308.00 -560.00Q413.00 -560.00 474.50 -508.50Q536.00 -457.00 536.00 -370.00V0.00H391.00V-90.00H367.00L392.00 -125.00Q392.00 -62.69 347.49 -26.35Q302.98 10.00 229.28 10.00ZM285.00 -100.00Q329.27 -100.00 357.64 -123.50Q386.00 -147.00 386.00 -184.89V-244.00H275.00Q241.00 -244.00 220.00 -224.50Q199.00 -205.00 199.00 -173.20Q199.00 -139.19 221.76 -119.60Q244.53 -100.00 285.00 -100.00Z'
export const PERSONAL_DOT_PATH = 'M300.00 10.00Q254.00 10.00 226.50 -17.50Q199.00 -45.00 199.00 -91.00Q199.00 -138.00 226.50 -165.00Q254.00 -192.00 300.00 -192.00Q347.00 -192.00 374.00 -165.00Q401.00 -138.00 401.00 -91.00Q401.00 -45.00 374.00 -17.50Q347.00 10.00 300.00 10.00Z'

/** SSR artwork stays present for no-JS, reduced-motion and failed WebGL. */
export default function AssemblyVisual({ kind, className = '' }: { kind: Moment; className?: string }) {
  return (
    <div className={`assembly-visual assembly-${kind} ${className}`} data-assembly={kind} aria-hidden="true">
      <svg className="assembly-fallback" viewBox={kind === 'portrait' ? '0 0 380 480' : '0 0 460 230'} fill="none" focusable="false">
        {kind === 'portrait' ? <g stroke="currentColor" strokeWidth="1">
          <path d="M12 90V12H90M290 12H368V90M368 390V468H290M90 468H12V390" />
          <path d="M4 120V4H120M260 476H376V360" opacity=".25" />
        </g> : kind === 'signature' ? <g transform="translate(74 205) scale(.33)">
          <path d={PERSONAL_MARK_PATH} fill="#f5f1ea" />
          <path d={PERSONAL_DOT_PATH} transform="translate(500 0)" fill="#ff3b1f" />
        </g> : <g stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
          <path d="M40 166L226 214L426 153L242 107Z" opacity=".15" />
          {kind === 'oravex' || kind === 'expertise' ? [0,1,2,3,4,5].map(i => {
            const x = 90 + (i % 3) * 80, y = 60 + Math.floor(i / 3) * 62
            return <g key={i}><path d={`M${x} ${y}l35 -15 35 15 -35 15Z M${x} ${y}v28l35 15 35 -15v-28 M${x+35} ${y+15}v28`} opacity={i === 1 ? 1 : .5}/></g>
          }) : kind === 'costra' ? [0,1,2,3].map(i => {
            const x = 95 + i * 65, y = 135 - i * 22
            return <path key={i} d={`M${x} 175V${y}l25 -12 25 12V175l-25 12Z M${x} ${y}l25 12 25 -12 M${x+25} ${y+12}v${175-y}`} opacity={.4+i*.18}/>
          }) : kind === 'experience' ? [0,1,2].map(i => <path key={i} d={`M80 ${70+i*38}l140 -32 140 32 -140 32Z M80 ${70+i*38}v8l140 32 140 -32v-8`} opacity={.4+i*.25}/>) : <>
            <path d="M76 78l160 -28 140 46 -160 28Z M76 78v80l140 34 160 -48V96 M216 124v68" opacity=".7"/>
            <path d="M109 105l43 10v37l-43 -10Z M166 118l30 7v18l-30 -7Z M239 131l48 -14v28l-48 14Z M302 112l44 -13v17l-44 13Z"/>
          </>}
        </g>}
      </svg>
      <span className="assembly-baseline" />
    </div>
  )
}
