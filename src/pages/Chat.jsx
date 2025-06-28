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
                className="w-[52px] relative h-[52px] rounded-full bg-cover bg-center"
                style={{ backgroundImage: `url(${friend.img})` }}
              >
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
      <div className="convo mt-10 xl:mt-0 shadow-shadow rounded-[20px] xl:w-[62%]  h-[93vh]">
        {
          friends.slice(0,1).map((friend,i)=>(
        <Flex className="details w-full h-[15%]">
<Flex
            key={i}
            className="py-[10px] w-full border-b-2 mx-[50px] pb-[25px] border-gray-300 items-center justify-between"
          >
            <Flex className="gap-x-[14px] w-[65%] justify-start items-center">
              <div
                className="w-[75px] relative h-[75px] rounded-full bg-cover bg-center"
                style={{ backgroundImage: `url(${friend.img})` }}
              >
                {friend.active && (
                  <span className="w-4 h-4 border-2 border-white rounded-full bg-green-400 absolute bottom-0 right-0 z-[555]"></span>
                )}
              </div>

              <div className="w-[60%]">
                <h3 className="text-[24px] font-semibold text-black truncate w-full">
                  {friend.frndName}
                </h3>
                <p className="font-medium text-[12px] text-[#4D4D4D]/75 truncate w-full">
                  {
                    friend.active && "Online"
                  }
                </p>
              </div>
            </Flex>
            <span className="text-3xl text-black  text-right">
              <BsThreeDotsVertical />
            </span>
          </Flex>
        </Flex>

          ))
        }
<div className="h-[75%] overflow-y-auto relative py-10 px-10">
  {
      friends[0].message.map((msg, index) => (
        msg.sender === "friend" ? (
          <Flex key={index} className='self-start flex-col gap-y-3 mb-5 max-w-full items-start'>
            <span className='relative max-w-full break-words bg-gray-300 text-primary px-[28px] py-[17px] rounded-xl after:content-[""] after:absolute after:bottom-0 after:-left-2 after:w-5 after:h-13 after:bg-gray-300  after:[clip-path:polygon(100%_48%,0%_100%,100%_100%)]'>
              {msg.message}
            </span>
            <span className="text-[12px] text-black/25 font-medium">{msg.lastTime}</span>
          </Flex>
        ) : (
          <Flex key={index} className='self-end flex-col mb-5 max-w-full items-end gap-y-3 '>
            <span className='text-white bg-primary px-[28px] py-[17px]  break-words rounded-xl relative after:content-[""] after:absolute after:bottom-0 after:-right-2 after:w-5 after:h-13 after:bg-primary  after:[clip-path:polygon(0%_48%,0%_100%,100%_100%)]'>
              {msg.message}
            </span>
            <span className="text-[12px] text-black/25 font-medium">{msg.lastTime}</span>
          </Flex>
        )
      ))
  }
</div>

<hr className='text-gray-300 w-[90%] mx-auto' />
        <Flex className="messageBox gap-x-[20px] px-10 h-[10%] w-full ">
          <div className="messageInput relative w-[85% xl:w-[90%]">
            <input type="text" className=' bg-[#F1F1F1] p-[15px] rounded-[10px] w-full' />
            <MdEmojiEmotions className='absolute top-1/2 text-black/50 right-[48px] text-[20px] -translate-y-1/2' />

<IoCameraOutline className='absolute top-1/2 text-black/50 right-[15px] text-[20px] -translate-y-1/2' />
          </div>
          <div className="w-[7%]">
<Button className="!p-[15px] text-white text-[15px]">
<FaPaperPlane />


          </Button>
          </div>


        </Flex>

      </div>
    </Flex>
  )
}

export default Chat