import React from 'react'
import Flex from '../layouts/Flex'
import { IoArrowBack } from "react-icons/io5";
import { Link } from 'react-router';


const ForgotPassword = () => {
  return (
    <div className='bg-gray-300 pt-[200px] h-screen'>
    <Flex className="justify-center  bg-white rounded-lg flex-col p-8 pt-10 xl:w-[368px] w-full lg:w-1/2 mx-auto">
      <div className="relative ">
              <input
                type="text"
                onChange=""
                id="floating_outlined"
                className="block w-full px-[26px] py-[26px] xl:w-[368px] text-xl text-secondary font-semibold bg-transparent rounded-lg border-0 border-b-2 border-gray-300 appearance-none   focus:outline-none focus:ring-0 focus:border-secondary/30 peer"
                placeholder=" "
              />
              <label
                for="floating_outlined"
                className="absolute text-sm text-secondary/70 duration-300 transform  top-2 z-10 origin-[0] bg-white  -translate-y-4 px-4 peer-focus:px-4 peer-focus:text-secondary/70  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2  peer-focus:-translate-y-4 rtl:peer-focus:translate-x-2/5 rtl:peer-focus:left-auto start-4"
              >
                Email Address
              </label>
            </div>
<Flex className="w-full flex-col lg:flex-row gap-y-5 lg:gap-y-0 justify-center gap-x-5 mt-10">
      <Link
              to="/login"
              className="flex items-center gap-x-2  cursor-pointer py-5 bg-primary text-white font-semibold rounded-[9px] text-sm px-4"
            ><IoArrowBack className='text-[20px]' />
              Back To Login
            </Link>
      <button
              onClick=""
              className="  cursor-pointer py-5 bg-primary text-white font-semibold rounded-[9px] text-sm px-4"
            >
              Send Reset Password Mail
            </button>

</Flex>
    </Flex>

    </div>
  )
}

export default ForgotPassword