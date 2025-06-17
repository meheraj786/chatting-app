import './App.css'
import React from 'react'
import Flex from './layouts/Flex'
import image from './assets/registerImg.png'

function App() {

  return (
<>
<Flex>
  <div className="left w-[55%] pl-[190px]">
    <h1>Get started with easily register</h1>
    <p className='mt-[13px] mb-10 text-primary/50'>Free register and you can enjoy it</p>
    <div class="relative">
    <input type="text" id="floating_outlined" class="block px-[26px] py-[26px] w-[368px] text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none   focus:outline-none focus:ring-0 focus:border-secondary/30 peer" placeholder=" " />
    <label for="floating_outlined" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform  top-2 z-10 origin-[0] bg-white  px-4 peer-focus:px-4 peer-focus:text-secondary/70  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2  peer-focus:-translate-y-4 rtl:peer-focus:translate-x-2/5 rtl:peer-focus:left-auto start-4">Email Address</label>
</div>
    <div class="relative my-[34px]">
    <input type="text" id="floating_outlined2" class="block px-[26px] py-[26px] w-[368px] text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none   focus:outline-none focus:ring-0 focus:border-secondary/30 peer" placeholder=" " />
    <label for="floating_outlined2" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform  top-2 z-10 origin-[0] bg-white  px-4 peer-focus:px-4 peer-focus:text-secondary/70  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2  peer-focus:-translate-y-4 rtl:peer-focus:translate-x-2/5 rtl:peer-focus:left-auto start-4">Full Name</label>
</div>
    <div class="relative">
    <input type="password" id="floating_outlined3" class="block px-[26px] py-[26px] w-[368px] text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none   focus:outline-none focus:ring-0 focus:border-secondary/30 peer" placeholder=" " />
    <label for="floating_outlined3" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform  top-2 z-10 origin-[0] bg-white  px-4 peer-focus:px-4 peer-focus:text-secondary/70  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2  peer-focus:-translate-y-4 rtl:peer-focus:translate-x-2/5 rtl:peer-focus:left-auto start-4">Password</label>
</div>
  </div>
  <div className="right w-[45%] object-cover h-screen">
    <img className='w-full object-cover h-full' src={image} alt="" />
  </div>
</Flex>

</>
  )
}

export default App
