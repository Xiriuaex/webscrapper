import Link from 'next/link'
import Image from 'next/image'

const navIcons = [
    {src: '/assets/icons/search.svg', alt: 'search'},
    {src: '/assets/icons/heart.svg', alt: 'heart'},
    {src: '/assets/icons/profile.svg', alt: 'profile'}
]

const Navbar = () => {
  return (
    <header className='w-full'>
        <nav className='nav'>
            <Link href={"/"} className='flex items-center gap-1'>
                <p className='nav-logo'>Tracker<span className='text-primary'>Do</span></p>
            </Link>

            <div className='flex items-center gap-5'>
                {navIcons.map((icons) => (
                    <Image
                        key={icons.alt}
                        src={icons.src}
                        alt='icons.alt'
                        width={25}
                        height={24}
                        className='object-contain'
                    />
                ))}
            </div>
        </nav>
    </header>
  )
}

export default Navbar
