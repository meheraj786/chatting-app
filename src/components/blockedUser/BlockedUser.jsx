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

const BlockedUser = () => {
  const blockedUser = [
    {
      img: userImg1,
      frndName: "Raghav",
      lastTime: "Today, 2:23pm"
    },
    {
      img: userImg2,
      frndName: "Swathi",
      lastTime: "Today, 2:23pm"
    },
    {
      img: userImg3,
      frndName: "Kiran",
      lastTime: "Today, 2:23pm"
    },
    {
      img: userImg4,
      frndName: "Tajeshwini C",
      lastTime: "Today, 2:23pm"
    },
    {
      img: userImg5,
      frndName: "Marvin",
      lastTime: "Today, 2:23pm"
    },
  ];

  return (
    <div className='xl:w-[30%] w-fpng shadow-shadow h-[50%] rounded-[20px] px-[20px] font-poppins py-[20px]'>
      <Flex className="justify-between items-center mb-2">
        <h3 className='text-[20px] font-semibold text-black'>Blocked Users</h3>
        <BsThreeDotsVertical />
      </Flex>

      <SearchInput />

      <div className='overflow-y-auto h-[70%]'>
        {
          blockedUser.map((friend, idx) => (
            <Flex key={idx} className="py-[10px] border-b-2 border-gray-300 items-center justify-between">
              <Flex className="gap-x-[14px] w-[60%] items-center justify-start">
                <div
                  className="avatar w-[52px] h-[52px] rounded-full bg-cover bg-center shrink-0"
                  style={{ backgroundImage: `url(${friend.img})` }}
                ></div>

                <div className="w-[60%]">
                  <h3 className='text-[14px] font-semibold text-black truncate w-full'>{friend.frndName}</h3>
                  <p className='text-[10px] text-black/50 truncate w-full'>{friend.lastTime}</p>
                </div>
              </Flex>

              <Button className="text-[12px]">Unblock</Button>
            </Flex>
          ))
        }
      </div>
    </div>
  );
}

export default BlockedUser;
