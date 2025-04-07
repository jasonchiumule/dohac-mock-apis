import { defineConfig, presetWind3, } from 'unocss'
import presetWebFonts from '@unocss/preset-web-fonts'
import presetIcons from '@unocss/preset-icons'

export default defineConfig({
  presets: [
    presetWind3(),
    // presetTypography(),
    presetIcons({
      // icons somehow need a text property like text-lg for them to show up
      prefix: 'i-', // Default is 'i-', but explicitly stating doesn't hurt
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle', // Often useful for icons

      }
    }),
    presetWebFonts({
      provider: 'bunny',
      fonts: {
        sans: 'Roboto',
      },
    }),
  ],
})
