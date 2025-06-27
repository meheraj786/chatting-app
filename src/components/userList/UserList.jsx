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

const UserList = () => {
  const friends = [
    {
      img: grpImg1,
      frndName: "Friends Reunion",
      lastTime: "Today, 2:23pm"
    },
    {
      img: grpImg2,
      frndName: "Friends Forever",
      lastTime: "Today, 2:23pm"
    },
    {
      img: grpImg3,
      frndName: "Crazy Cousins",
      lastTime: "Today, 2:23pm"
    },
    {
      img: grpImg4,
      frndName: "Office friend",
      lastTime: "Today, 2:23pm"
    },
    {
      img: grpImg5,
      frndName: "Gaming friend",
      lastTime: "Today, 2:23pm"
    },
  ];

  return (
    <div className='xl:w-[30%] w-full shadow-shadow h-[50%] rounded-[20px] px-[20px] font-poppins py-[20px]'>
      <Flex className="justify-between items-center mb-2">
        <h3 className='text-[20px] font-semibold text-black'>Users</h3>
        <BsThreeDotsVertical />
      </Flex>

      <SearchInput />

      <div className='overflow-y-auto h-[70%]'>
        {
          friends.map((friend, idx) => (
            <Flex key={idx} className="py-[10px] border-b-2 border-gray-300 items-center justify-between">
              <Flex className="gap-x-[14px] w-[75%] items-center justify-start">
                <div
                  className="w-[52px] h-[52px] rounded-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${friend.img})` }}
                ></div>

                <div className="w-[60%]">
                  <h3 className='text-[14px] font-semibold text-black truncate w-full'>{friend.frndName}</h3>
                  <p className='text-[10px] text-black/50 truncate w-full'>{friend.lastTime}</p>
                </div>
              </Flex>

              <Button className="text-[14px]">+</Button>
            </Flex>
          ))
        }
      </div>
    </div>
  );
}

export default UserList;
