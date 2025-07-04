import React from 'react'
import Flex from '../layouts/Flex'
import Button from '../layouts/Button'
import userImg1 from "../assets/user1.png";
import userImg2 from "../assets/user2.png";
import userImg3 from "../assets/user3.png";
import userImg4 from "../assets/user4.png";
import { BsThreeDotsVertical } from 'react-icons/bs';
import SearchInput from '../layouts/SearchInput';
import { FaPaperPlane } from "react-icons/fa";
import { MdEmojiEmotions } from "react-icons/md";
import { IoCameraOutline } from "react-icons/io5";
import Conversation from '../components/conversation/Conversation';



const Chat = () => {
    const friends = [
      {
        img: userImg1,
        frndName: "Jessica Williams",
        lastMsg: "Thanks for your help!",
        lastTime: "Yesterday, 5:45pm",
        active: true,
        message: [
          {
            message: "Hello",
            sender: "friend",
            lastTime: "Yesterday, 3:12pm",
          },
          {
            message: "How are you doing?",
            sender: "friend",
            lastTime: "Yesterday, 3:12pm",
          },
          {
            message: "Hello",
            sender: "self",
            lastTime: "Yesterday, 3:12pm",
          },
          {
            message: "I am good and how about you?",
            sender: "self",
            lastTime: "Yesterday, 3:12pm",
          },
          {
            message: "I am doing well. Can we meet up tomorrow?",
            sender: "friend",
            lastTime: "Yesterday, 3:12pm",
          },
          {
            message: "Sure!",
            sender: "self",
            lastTime: "Yesterday, 3:12pm",
          },
          {
            message: "Hello",
            sender: "friend",
            lastTime: "Yesterday, 3:12pm",
          },
          {
            message: "How are you doing?",
            sender: "friend",
            lastTime: "Yesterday, 3:12pm",
          },
          {
            message: "Hello",
            sender: "self",
            lastTime: "Yesterday, 3:12pm",
          },
          {
            message: "I am good and how about you?",
            sender: "self",
            lastTime: "Yesterday, 3:12pm",
          },
          {
            message: "I am doing well. Can we meet up tomorrow?",
            sender: "friend",
            lastTime: "Yesterday, 3:12pm",
          },
          {
            message: "Sure!",
            sender: "self",
            lastTime: "Yesterday, 3:12pm",
          },
        ]
      },
      {
        img: userImg2,
        frndName: "David Kumar",
        lastMsg: "Let's catch up soon",
        lastTime: "Yesterday, 3:12pm",
        active: true,
      },
      {
        img: userImg3,
        frndName: "Lisa Zhang",
        lastMsg: "Perfect! See you then",
        lastTime: "Tuesday, 11:30am",
        active: true,
      },
      {
        img: userImg4,
        frndName: "Ryan O'Connor",
        lastMsg: "Great work on the project",
        lastTime: "Monday, 4:15pm",
        active: false,
      },
    ];
    const convoFriend= friends.slice(0,1)
  return (
    <Flex className="mt-[32px] font-poppins items-start xl:w-[80%]">
      <div className='mx-auto xl:mx-0'>
      <SearchInput className="xl:w-[447px]" />
<div className="xl:w-[447px] w-full shadow-shadow max-h-[85vh] overflow-y-auto rounded-[20px] px-[20px] font-poppins py-[20px]">
      <Flex className="justify-between items-center mb-2">
        <h3 className="text-[20px] font-semibold text-black">Friends</h3>
        <BsThreeDotsVertical />
      </Flex>

      

      <div className="overflow-y-auto ">
        {friends.map((friend, i) => (
          <Flex
            key={i}
            className="py-[10px] border-b-2 border-gray-300 items-center justify-between"
          >
            <Flex className="gap-x-[14px] w-[65%] justify-start items-center">
              <div
                className=" relative "
              >
                                                  <img src={friend.img}  className='avatar w-[52px] relative z-0 h-[52px] rounded-full' alt="" />
                {friend.active && (
                  <span className="w-4 h-4 border-2 border-white rounded-full bg-green-400 absolute bottom-0 right-0 z-[555]"></span>
                )}
              </div>

              <div className="w-[60%]">
                <h3 className="text-[14px] font-semibold text-black truncate w-full">
                  {friend.frndName}
                </h3>
                <p className="font-medium text-[12px] text-[#4D4D4D]/75 truncate w-full">
                  {friend.lastMsg}
                </p>
              </div>
            </Flex>
            <span className="text-xl text-black  text-right">
              <BsThreeDotsVertical />
            </span>
          </Flex>
        ))}
      </div>
    </div>

      </div>

<Conversation friends={convoFriend}/>
    </Flex>
  )
}

export default Chat