import Navbar from '@/components/ui/Navbar'
import Preloader from '@/components/sections/Preloader'
import Hero from '@/components/sections/Hero'
import Services from '@/components/sections/Services'
import Work from '@/components/sections/Work'
import Process from '@/components/sections/Process'
import Stats from '@/components/sections/Stats'
import TechStack from '@/components/sections/TechStack'
import Contact from '@/components/sections/Contact'
import FinalCTA from '@/components/sections/FinalCTA'
import Footer from '@/components/sections/Footer'
import CustomCursor from '@/components/ui/CustomCursor'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import SmoothScroll from '@/components/ui/SmoothScroll'

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <SmoothScroll />
      <Preloader />
      <CustomCursor />
      <WhatsAppButton />
      <Navbar />

      <div className="relative z-10">
        <Hero />
        <Services />
        <Work />
        <Process />
        <Stats />
        <TechStack />
        <Contact />
        <FinalCTA />
      </div>
      <Footer />
    </main>
  )
}
