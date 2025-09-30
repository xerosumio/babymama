import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'babymama - Mother & Baby E-commerce',
    short_name: 'babymama',
    description: 'Premium mother & baby products - safe, authentic, and delivered with care',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#7dd3fc',
    orientation: 'portrait-primary',
    icons: [
      // TODO: Fill in icon details later
      // You can add your icons here following this format:
      // {
      //   src: '/icons/icon-192x192.png',
      //   sizes: '192x192',
      //   type: 'image/png',
      //   purpose: 'maskable any'
      // }
      {
        src:'/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
    categories: ['shopping', 'lifestyle', 'family'],
    lang: 'en',
    dir: 'ltr'
  }
}
