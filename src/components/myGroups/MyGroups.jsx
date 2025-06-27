import React from 'react'
import Flex from '../../layouts/Flex'
import SearchInput from '../../layouts/SearchInput'
import { BsThreeDotsVertical } from 'react-icons/bs'
import grpImg1 from '../../assets/grpImg1.png'
import grpImg2 from '../../assets/grpImg2.png'
import grpImg3 from '../../assets/grpImg3.png'
import grpImg4 from '../../assets/grpImg4.jpg'
import grpImg5 from '../../assets/grpImg5.jpg'

const MyGroups = () => {
  const myGrp = [
    {
      img: grpImg1,
      frndName: "Friends Reunion",
      lastMsg: "Hi Guys, Wassup!",
      lastTime: "Today, 2:23pm"
    },
    {
      img: grpImg2,
      frndName: "Friends Forever",
      lastMsg: "Good to see you",
      lastTime: "Today, 2:23pm"
    },
    {
      img: grpImg3,
      frndName: "Crazy Cousins",
      lastMsg: "What plans today?",
      lastTime: "Today, 2:23pm"
    },
    {
      img: grpImg4,
      frndName: "Office friend",
      lastMsg: "Join the meeting",
      lastTime: "Today, 2:23pm"
    },
    {
      img: grpImg5,
      frndName: "Gaming friend",
      lastMsg: "Let's play",
      lastTime: "Today, 2:23pm"
    },
  ];

  return (
    <div className='xl:w-[30%] w-full shadow-shadow h-[50%] rounded-[20px] px-[20px] font-poppins py-[20px]'>
      <Flex className="justify-between items-center mb-2">
        <h3 className='text-[20px] font-semibold text-black'>My Groups</h3>
        <BsThreeDotsVertical />
      </Flex>

      <SearchInput />

      <div className='overflow-y-auto h-[70%]'>
        {
          myGrp.map((friend, idx) => (
            <Flex key={idx} className="py-[10px] border-b-2 border-gray-300 items-center justify-between">
              <Flex className="gap-x-[14px] w-[75%] items-center justify-start">
                <div
                  className="w-[52px] h-[52px] rounded-full bg-cover bg-center "
                  style={{ backgroundImage: `url(${friend.img})` }}
                ></div>

                <div className="w-[60%]">
                  <h3 className='text-[14px] font-semibold text-black truncate w-full'>{friend.frndName}</h3>
                  <p className='font-medium text-[12px] text-[#4D4D4D]/75 truncate w-full'>{friend.lastMsg}</p>
                </div>
              </Flex>

              <span className='text-[10px] text-black/50 w-[20%] text-right truncate'>{friend.lastTime}</span>
            </Flex>
          ))
        }
      </div>
    </div>
  );
}

export default MyGroups;
