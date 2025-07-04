import React from 'react'
import Flex from '../../layouts/Flex'
import SearchInput from '../../layouts/SearchInput'
import { BsThreeDotsVertical } from 'react-icons/bs'
import Button from '../../layouts/Button'
import userImg1 from '../../assets/user1.png'
import userImg2 from '../../assets/user2.png'
import userImg3 from '../../assets/user3.png'
import userImg4 from '../../assets/user4.png'
import userImg5 from '../../assets/user5.png'

const UserList = () => {
  const friends = [
    {
      img: userImg1,
      frndName: "Friends Reunion",
      lastTime: "Today, 2:23pm"
    },
    {
      img: userImg2,
      frndName: "Friends Forever",
      lastTime: "Today, 2:23pm"
    },
    {
      img: userImg3,
      frndName: "Crazy Cousins",
      lastTime: "Today, 2:23pm"
    },
    {
      img: userImg4,
      frndName: "Office friend",
      lastTime: "Today, 2:23pm"
    },
    {
      img: userImg5,
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

      <div className='overflow-y-auto h-[75%]'>
        {
          friends.map((friend, idx) => (
            <Flex key={idx} className="py-[10px] border-b-2 border-gray-300 items-center justify-between">
              <Flex className="gap-x-[14px] w-[75%] items-center justify-start">
                <div

                >
                                    <img src={friend.img}  className='avatar w-[52px] h-[52px] rounded-full' alt="" />
                </div>

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
