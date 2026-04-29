import { JetBrains_Mono, Rubik } from 'next/font/google'

// English: single-family commitment to JetBrains Mono Variable.
// Display = ExtraBold (800) at huge size. Body = Light (300) - Regular (400).
// The weight contrast (200 vs 800) is the typographic system; not two families.
export const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ['200', '300', '400', '500', '700', '800'],
})

// Latin sibling/body fallback for the rare moments mono is wrong (long Arabic-EN
// transliterated proper nouns where mono looks brittle). Rubik is the Arabic
// pairing's Latin twin, so the bilingual surface stays unified.
export const rubik = Rubik({
  subsets: ['latin', 'arabic'],
  display: 'swap',
  variable: '--font-rubik',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
})
