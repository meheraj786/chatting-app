import React from 'react'
import Flex from '../../layouts/Flex'
import SearchInput from '../../layouts/SearchInput'
import { BsThreeDotsVertical } from 'react-icons/bs'
import Button from '../../layouts/Button'
import grpImg1 from '../../assets/grpImg1.png'
import grpImg2 from '../../assets/grpImg2.png'
import grpImg3 from '../../assets/grpImg3.png'
import grpImg4 from '../../assets/grpImg4.jpg'
import grpImg5 from '../../assets/grpImg5.jpg'

const GroupList = () => {
  const groups= [
    {
      img:grpImg1,
      grpName: "Friends Reunion",
      lastMsg: "Hi Guys, Wassup!"
    },
    {
      img:grpImg2,
      grpName: "Friends Forever",
      lastMsg: "Good to see you"
    },
    {
      img:grpImg3,
      grpName: "Crazy Cousins",
      lastMsg: "What plans today?"
    },
    {
      img:grpImg4,
      grpName: "Office Group",
      lastMsg: "Join the meeting"
    },
    {
      img:grpImg5,
      grpName: "Gaming Group",
      lastMsg: "Let's play"
    },
  ]

  return (
    <div className='w-[427px]  mt-[35px] shadow-shadow h-[451px] rounded-[20px] px-[20px] font-poppins py-[20px] '>
      <Flex className="">
        <h3 className='text-[20px] font-semibold text-black'>Group List</h3>
        <BsThreeDotsVertical/>
      </Flex>
      <SearchInput/>

      <div className='overflow-y-auto h-[70%]'>

      {
        groups.map((group)=>(
      <Flex className="py-[13px] border-b-2 border-gray-300">
        <Flex className="gap-x-[14px]">
<div
  className="avatar w-[70px] h-[70px] rounded-full bg-cover bg-center"
  style={{ backgroundImage: `url(${group.img})` }}
></div>

          <div>
            <h3 className='text-[20px] font-semibold text-black'>{group.grpName}</h3>
            <p className='font-medium text-[14px] text-[#4D4D4D]/75'>{group.lastMsg}</p>
          </div>
        </Flex>
        <Button className="px-[22px]">Join</Button>
      </Flex>
        ))
      }
      </div>

    </div>

  )
}

export default GroupList