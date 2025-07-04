import React from 'react'
import Flex from '../layouts/Flex'
import SearchInput from '../layouts/SearchInput'
import { RiEdit2Fill } from "react-icons/ri";
import { TbMessageCircleFilled } from "react-icons/tb";
import { BiSolidImageAdd } from 'react-icons/bi';
import { IoMdHelpCircleOutline } from 'react-icons/io';
import { FaKey } from 'react-icons/fa';
import { HiTrash } from 'react-icons/hi';
import dp from '../assets/dp.png'


const Setting = () => {
  return (
    <div className='xl:w-[82%] w-full font-poppins h-screen rounded-[20px] pt-[30px]'>
      <SearchInput className="mb-[36px]"/>
      <Flex className="gap-x-[36px]">
        <div className="profile p-[26px] w-full xl:w-[48%] xl:h-[85vh] rounded-[20px] shadow-shadow">
          <h3 className='text-[20px] text-black font-semibold'>Profile Settings</h3>
          <div className="data">
                    <Flex className="details w-full h-[15%]">
            <Flex
                        
                        className="py-[10px] w-full border-b-2 mt-[50px] mx-[50px] pb-[25px] border-gray-300 items-center justify-between"
                      >
                        <Flex className="gap-x-[14px] w-full justify-start  items-center">
                          <div
                            
                          >
                            <img src={dp} className="avatar w-[100px] relative h-[100px]  rounded-full" alt="" />
                            
                          </div>
            
                          <div className="xl:w-[70%]">
                            <h3 className="text-[25px] font-semibold text-black truncate w-full">
                              Meheraj Hosen
                            </h3>
                            <p className='text-[20px]'>A Dreamer</p>
                            
                          </div>
                        </Flex>
                      </Flex>
                      <div className="options xl:px-[84px] px-10 mt-[43px]">
    <Flex className="justify-start text-[20px] gap-x-[37px]"> <span className='text-[25px]'><RiEdit2Fill />
</span> Edit Profile Name</Flex>
    <Flex className="justify-start text-[20px] my-[37px] gap-x-[37px]"> <span className='text-[25px]'><TbMessageCircleFilled />
</span> Edit Status Info</Flex>
    <Flex className="justify-start text-[20px] my-[37px] gap-x-[37px]"> <span className='text-[25px]'><BiSolidImageAdd />
</span> Edit Profile Photo</Flex>
    <Flex className="justify-start text-[20px] gap-x-[37px]"> <span className='text-[25px]'><IoMdHelpCircleOutline />
</span> Help</Flex>
                      </div>
                    </Flex>
          </div>
          
        </div>
        <div className="account p-[26px] w-full xl:w-[48%] xl:h-[85vh] rounded-[20px] shadow-shadow">
<h3 className='text-[20px] text-black font-semibold'>Account Settings</h3>
<div className="options xl:px-[84px] px-10 mt-[43px]">
    <Flex className="justify-start text-[20px] gap-x-[37px]"> <span className='text-[25px]'><FaKey />
</span> Change Password</Flex>
    <Flex className="justify-start text-[20px] my-[37px] gap-x-[37px]"> <span className='text-[25px]'><HiTrash />

</span> Delete Account</Flex>
                      </div>
        </div>
      </Flex>
    </div>
  )
}

export default Setting