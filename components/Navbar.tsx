'use client'
import Link from "next/link";
import { FaUser } from "react-icons/fa6";  

import { 
  SignInButton, 
  SignedIn,
  SignedOut,
  UserButton, 
} from '@clerk/nextjs'

const Navbar = () => {  
  return (
    <header className="w-full">
      <nav className="flex justify-between items-center px-6 md:px-20 py-4 bg-slate-300">
        <Link href={"/"} className="flex items-center gap-1">
          <p className="font-spaceGrotesk text-[40px] text-secondary font-bold">
            Tracker<span className="text-primary">Do</span>
          </p>
        </Link> 
        <div className="flex items-center gap-5">  
              <SignedOut>
                <SignInButton>
                  <button className="text-xl text-primary bg-white hover:bg-primary hover:text-white border-2 px-6 py-3 border-gray-400 rounded-full  flex flex-row justify-center p-3 gap-2"><FaUser /></button>  
                </SignInButton>  
              </SignedOut>
              <SignedIn>
                <Link
                  href={"#myProducts"}
                  className="text-xl text-primary bg-white hover:bg-primary hover:text-white border-2 px-6 py-3 border-gray-400 rounded-full  flex flex-row justify-center p-3 gap-2"
                >
                  My Products
                </Link>
                <Link
                  href={"#popularNow"}
                  className="text-xl text-primary bg-white hover:bg-primary hover:text-white border-2 px-6 py-3 border-gray-400 rounded-full  flex flex-row justify-center p-3 gap-2"
                >
                  Popular
                </Link> 
                <UserButton />  
              </SignedIn> 
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
