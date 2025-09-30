import type { AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next'
import Head from 'next/head'
import { ThemeProvider } from 'next-themes'
import { CartProvider } from '@/contexts/CartContext'
import { WishlistProvider } from '@/contexts/WishlistContext'
import { MerchantProvider } from '@/contexts/MerchantContext'
import { AdminProvider } from '@/contexts/AdminContext'
import '@/styles/globals.css'
import { useEffect } from 'react'

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
        })
    }
  }, [])
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="babymama - Premium mother & baby products" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#7dd3fc" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="babymama" />
      </Head>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <CartProvider>
          <WishlistProvider>
            <MerchantProvider>
              <AdminProvider>
                <Component {...pageProps} />
              </AdminProvider>
            </MerchantProvider>
          </WishlistProvider>
        </CartProvider>
      </ThemeProvider>
    </>
  )
}

export default appWithTranslation(App)
