import React from 'react'

const Navbar = () => {
    return (
        <header>
            <nav className='flex items-center justify-between bg-[#06000f] w-full py-2 sm:px-15 px-5'>
                <div className='flex justify-center items-center gap-x-1'>
                    <img src="../public/unloklogo.png" alt="logo" height={60} width={60} />
                    <p className='text-2xl font-semibold'>Unlok</p>
                </div>
                <div>
                    <button className='bg-white text-black py-1 px-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-300 ease-in-out
                             shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-Poppins'>
                        Sign in
                    </button>
                </div>
            </nav>
        </header>
    )
}

export default Navbar
