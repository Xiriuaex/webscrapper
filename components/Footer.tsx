import React from 'react'
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa6";

const Footer = () => {

    const hoverLinks = 'hover:text-primary duration-300';
  return (
    <div className='w-full h-[25vh]  text-[13px] text-slate-300 bg-secondary flex flex-row justify-center items-center gap-5'>
      <div className='px-6 text-center flex flex-col gap-2'>
        <h1 className='text-xl font-spaceGrotesk'>TrackerDo Ecommerce Price Tracker</h1>
        <p>Developed And Managed by</p>
        <p>PragyanC</p>
      </div>
      <div className='px-6 flex flex-col items-center gap-2 text-[20px]'>
        <p>Contact</p>
        <ul className='flex flex-row gap-3 justify-center w-[15vw]'>
            <li><FaGithub className={hoverLinks} /></li>
            <li><FaInstagram className={hoverLinks} /></li>
            <li><FaLinkedin className={hoverLinks} /></li>
        </ul>
      </div>
    </div>
  )
}

export default Footer
