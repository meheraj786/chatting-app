import React from 'react'
import Flex from '../../layouts/Flex'
import { Link } from 'react-router'
import { VscHome } from "react-icons/vsc";
import { AiOutlineMessage } from "react-icons/ai";
import { MdOutlineSettings } from "react-icons/md";


const Menubar = () => {
  return (
    <Flex className="flex-col w-[186px] text-white h-[95vh] bg-primary mt-[35px] pt-[35px] pb-[47px] ml-[32px] rounded-[20px]">
      <Flex className="flex-col gap-y-[78px]">
        <div className="avatar w-[100px] h-[100px] rounded-full bg-gray-300"></div>
        <Flex className="flex-col gap-y-7 pl-[25px]">
        <Link className='py-[22px] rounded-l-2xl pl-[45px] pr-[60px] bg-white text-primary'><VscHome />
</Link>
        <Link className='py-[22px] rounded-l-2xl pl-[45px] pr-[60px] bg-white text-primary'><AiOutlineMessage />
</Link>
        <Link className='py-[22px] rounded-l-2xl pl-[45px] pr-[60px] bg-white text-primary'>import { MdOutlineSettings } from "react-icons/md";
</Link>
        </Flex>

      </Flex>
        logout
    </Flex>
  )
}

export default Menubar