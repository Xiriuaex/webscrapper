'use client'
 
import Image from "next/image";
const HeroCarousel = () => {
  return (
    <div className="bg-slate-300 rounded-3xl p-6 h-[77vh] flex flex-col justify-center items-center">
       <img src="/assets/hero.png" width="700" height="1000" alt="uio" />
    </div>
  )
}

export default HeroCarousel
