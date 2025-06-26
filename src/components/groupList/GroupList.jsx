import React from 'react'
import Flex from '../../layouts/Flex'
import SearchInput from '../../layouts/SearchInput'
import { BsThreeDotsVertical } from 'react-icons/bs'
import Button from '../../layouts/Button'

const GroupList = () => {
  // const groups= [
  //   {
  //     img:"",
  //     grpName: "Friends Forever",
  //     lastMsg: "Hi Guys, Wassup!"
  //   },
  //   {
  //     img:"",
  //     grpName: "Friends Forever",
  //     lastMsg: "Hi Guys, Wassup!"
  //   },
  //   {
  //     img:"",
  //     grpName: "Friends Forever",
  //     lastMsg: "Hi Guys, Wassup!"
  //   },
  //   {
  //     img:"",
  //     grpName: "Friends Forever",
  //     lastMsg: "Hi Guys, Wassup!"
  //   },
  // ]

  return (
    <div className='w-[427px]  mt-[35px] shadow-shadow h-[451px] rounded-[20px] px-[20px] font-poppins py-[20px]'>
      <Flex className="">
        <h3 className='text-[20px] font-semibold text-black'>Group List</h3>
        <BsThreeDotsVertical/>
      </Flex>
      <SearchInput/>
      <Flex className="py-[13px] border-b border-gray-300">
        <Flex className="gap-x-[14px]">
          <div className="avatar w-[70px] h-[70px] rounded-full bg-[url(assets/grpImg1.png)] bg-cover bg-center"></div>
          <div>
            <h3 className='text-[20px] font-semibold text-black'>Friends Reunion</h3>
            <p className='font-medium text-[14px] text-[#4D4D4D]/75'>Hi guys, Whassup!</p>
          </div>
        </Flex>
        <Button className="px-[22px]">Join</Button>

      </Flex>


home
    </div>

  )
}

export default GroupList