import './App.css'
import React from 'react'
import Flex from './layouts/Flex'
import image from './assets/registerImg.png'

function App() {

  return (
<>
<Flex>
  <Flex className="left flex-col  items-end justify-center  font-primary p-10 xl:p-0 xl:w-[55%] xl:pr-[169px]">
    <div>
      <h1 className='font-bold text-4xl text-secondary'>Get started with easily register</h1>
    <p className='mt-[13px] text-xl mb-10 text-primary/50'>Free register and you can enjoy it</p>
    <div className="relative">
    <input type="text" id="floating_outlined" className="block px-[26px] py-[26px] xl:w-[368px] text-xl text-secondary font-semibold bg-transparent rounded-lg border-1 border-gray-300 appearance-none   focus:outline-none focus:ring-0 focus:border-secondary/30 peer" placeholder=" " />
    <label for="floating_outlined" className="absolute text-sm text-secondary/70 duration-300 transform  top-2 z-10 origin-[0] bg-white  -translate-y-4 px-4 peer-focus:px-4 peer-focus:text-secondary/70  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2  peer-focus:-translate-y-4 rtl:peer-focus:translate-x-2/5 rtl:peer-focus:left-auto start-4">Email Address</label>
</div>
    <div className="relative my-[34px]">
    <input type="text" id="floating_outlined2" className="block px-[26px] py-[26px] xl:w-[368px] text-xl text-secondary font-semibold bg-transparent rounded-lg border-1 border-gray-300 appearance-none   focus:outline-none focus:ring-0 focus:border-secondary/30 peer" placeholder=" " />
    <label for="floating_outlined2" className="absolute text-sm text-secondary/70 duration-300 transform  -translate-y-4 top-2 z-10 origin-[0] bg-white  px-4 peer-focus:px-4 peer-focus:text-secondary/70  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2  peer-focus:-translate-y-4 rtl:peer-focus:translate-x-2/5 rtl:peer-focus:left-auto start-4">Full Name</label>
</div>
    <div className="relative">
    <input type="password" id="floating_outlined3" className="block px-[26px] py-[26px] xl:w-[368px] text-xl text-secondary font-semibold bg-transparent rounded-lg border-1 border-gray-300 appearance-none   focus:outline-none focus:ring-0 focus:border-secondary/30 peer" placeholder=" " />
    <label for="floating_outlined3" className="absolute text-sm duration-300 transform text-secondary/70 top-2 -translate-y-4 z-10 origin-[0] bg-white  px-4 peer-focus:px-4 peer-focus:text-secondary/70  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2  peer-focus:-translate-y-4 rtl:peer-focus:translate-x-2/5 rtl:peer-focus:left-auto start-4">Password</label>
</div>
<button className='xl:w-[368px] w-full cursor-pointer py-5 bg-primary text-white font-semibold mt-[51px] mb-[35px] rounded-[86px] text-xl'>Sign Up</button>
<p className='xl:w-[368px] font-secondary text-center text-[14px] text-primary'>Already  have an account ? <span className='text-[#EA6C00] cursor-pointer'>Sign In</span></p>
    </div>
  </Flex>

  <div className="right xl:xl:w-[45%] object-cover h-screen">
    <img className='xl:w-full object-cover h-full' src={image} alt="" />
  </div>
</Flex>

</>
  )
}

export default App
