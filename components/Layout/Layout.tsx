import React, { useState, useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setIsScrolled(scrollTop > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className={`flex-1 transition-all duration-300 ${
        isScrolled ? 'pt-32' : 'pt-40'
      }`}>
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout
