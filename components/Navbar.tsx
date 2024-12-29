'use client'
import Link from "next/link";
import { FaUser } from "react-icons/fa6";  

import { 
  SignInButton, 
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'

const Navbar = () => {  
  return (
    <header className="w-full">
      <nav className="flex text-[15px] text-secondary justify-between items-center px-6 md:px-20 py-4 bg-slate-300">
        <Link href={"/"} className="flex items-center gap-1">
          <p className="font-spaceGrotesk text-[40px]  font-bold">
            Tracker<span className="text-primary">Do</span>
          </p>
        </Link> 
        <div className="flex items-center gap-5">  
              <SignedOut>
                <SignInButton>
                  <button className="hover:text-slate-300 flex flex-row justify-center"><FaUser /></button>  
                </SignInButton>  
              </SignedOut>
              <SignedIn>
                <UserButton />  
              </SignedIn> 
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
