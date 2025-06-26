import React from 'react'
import Flex from '../../layouts/Flex'
import { Link, NavLink } from 'react-router'
import { VscHome } from "react-icons/vsc";
import { AiFillMessage } from "react-icons/ai";
import { MdOutlineSettings } from "react-icons/md";
import { GrLogout } from "react-icons/gr";
import { FaCloudUploadAlt } from "react-icons/fa";


const Menubar = () => {
  return (
    <Flex className="flex-col fixed w-[186px] text-white h-[95vh] bg-primary mt-[35px] pt-[35px] pb-[47px] ml-[32px] rounded-[20px]">
      <Flex className="flex-col gap-y-[78px]">
        <div className="avatar group relative w-[100px] h-[100px] rounded-full bg-[url(assets/dp.png)] bg-cover bg-center cursor-pointer">
  <div className="absolute inset-0 bg-gray-500/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
    <FaCloudUploadAlt className="text-white text-[25px]" />
  </div>
</div>
        <Flex className="flex-col gap-y-7 pl-[25px]">
        <NavLink className='py-[22px] relative rounded-l-2xl pl-[45px] pr-[59px] bg-white text-primary'><VscHome className='text-[46px]' />
        <div className='absolute w-[10px] h-full bg-primary top-0 right-0 rounded-l-2xl'></div>
</NavLink>
        <NavLink className='py-[22px] group hover:text-primary z-10 relative rounded-l-2xl pl-[45px] pr-[59px] bg-white text-[#C3C3C3]'><AiFillMessage  className='text-[46px]' />
        <div className='absolute transition-all duration-200 group-hover:w-[10px] group-hover:rounded-l-2xl w-[100%] z-[-1] h-full bg-primary top-0 right-0 rounded-0'></div>
</NavLink>
        <NavLink className='py-[22px] group hover:text-primary z-10 relative rounded-l-2xl pl-[45px] pr-[59px] bg-white text-[#C3C3C3]'><MdOutlineSettings className='text-[46px]' />
        <div className='absolute transition-all duration-200 group-hover:w-[10px] group-hover:rounded-l-2xl w-[100%] z-[-1] h-full bg-primary top-0 right-0 rounded-0'></div>
</NavLink>
        </Flex>

      </Flex>
      <NavLink to="/login">
        <GrLogout className='text-[46px] hover:text-[#C3C3C3]' />
      </NavLink>
    </Flex>
  )
}

export default Menubar