import { defineConfig } from "vite"

export default defineConfig({
    build: {
      rollupOptions: {
        // https://rollupjs.org/configuration-options/
        input: {
            popup: 'popup.html',
            config: 'config.html'
        }
      },
    },
  })