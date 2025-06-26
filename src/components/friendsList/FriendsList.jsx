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

const FriendsList = () => {
    const friends= [
      {
        img:grpImg1,
        frndName: "Friends Reunion",
        lastMsg: "Hi Guys, Wassup!",
        lastTime: "Today, 2:23pm"
      },
      {
        img:grpImg2,
        frndName: "Friends Forever",
        lastMsg: "Good to see you",
        lastTime: "Today, 2:23pm"
      },
      {
        img:grpImg3,
        frndName: "Crazy Cousins",
        lastMsg: "What plans today?",
        lastTime: "Today, 2:23pm"
      },
      {
        img:grpImg4,
        frndName: "Office friend",
        lastMsg: "Join the meeting",
        lastTime: "Today, 2:23pm"
      },
      {
        img:grpImg5,
        frndName: "Gaming friend",
        lastMsg: "Let's play",
        lastTime: "Today, 2:23pm"
      },
    ]
  return (
        <div className='w-[344px]  mt-[35px] shadow-shadow h-[451px] rounded-[20px] px-[20px] font-poppins py-[20px] '>
      <Flex className="">
        <h3 className='text-[20px] font-semibold text-black'>Friends</h3>
        <BsThreeDotsVertical/>
      </Flex>
      <SearchInput/>

      <div className='overflow-y-auto h-[70%]'>

      {
        friends.map((friend)=>(
      <Flex className="py-[10px] border-b-2 border-gray-300">
        <Flex className="gap-x-[14px]">
<div
  className="avatar w-[52px] h-[52px] rounded-full bg-cover bg-center"
  style={{ backgroundImage: `url(${friend.img})` }}
></div>

          <div>
            <h3 className='text-[14px] font-semibold text-black'>{friend.frndName}</h3>
            <p className='font-medium text-[12px] text-[#4D4D4D]/75'>{friend.lastMsg}</p>
          </div>
        </Flex>
        <span className='text-[10px] text-black/50'>{friend.lastTime}</span>
      </Flex>
        ))
      }
      </div>

    </div>
  )
}

export default FriendsList