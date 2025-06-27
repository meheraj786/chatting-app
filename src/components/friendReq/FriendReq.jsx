import React from "react";
import Flex from "../../layouts/Flex";
import SearchInput from "../../layouts/SearchInput";
import { BsThreeDotsVertical } from "react-icons/bs";
import Button from "../../layouts/Button";
import userImg1 from "../../assets/user1.png";
import userImg2 from "../../assets/user2.png";
import userImg3 from "../../assets/user3.png";
import userImg4 from "../../assets/user4.png";

const FriendReq = () => {
  const friendReq = [
    {
      img: userImg1,
      userName: "Maria Santos",
      lastTime: "2 hours ago",
    },
    {
      img: userImg2,
      userName: "James Wilson",
      lastTime: "5 hours ago",
    },
    {
      img: userImg3,
      userName: "Priya Sharma",
      lastTime: "1 day ago",
    },
    {
      img: userImg4,
      userName: "Robert Kim",
      lastTime: "2 days ago",
    },
  ];

  return (
    <div className="xl:w-[36%] w-full h-[50%] rounded-[20px] px-[20px] font-poppins py-[20px] ">
      <Flex className="">
        <h3 className="text-[20px] font-semibold text-black">Friend Request</h3>
        <BsThreeDotsVertical />
      </Flex>
      <SearchInput />

      <div className="overflow-y-auto h-[70%]">
        {friendReq.map((group) => (
          <Flex className="py-[13px] border-b-2 border-gray-300 items-center justify-between">
            <Flex className="gap-x-[14px] w-[60%] justify-start">
              <div
                className="avatar w-[70px] h-[70px] rounded-full bg-cover bg-center"
                style={{ backgroundImage: `url(${group.img})` }}
              ></div>
              <div className="w-[55%]">
                <h3 className="text-[20px] truncate font-semibold text-black w-full">
                  {group.userName}
                </h3>
                <p className="font-medium text-[14px] text-[#4D4D4D]/75 truncate w-full">
                  {group.lastTime}
                </p>
              </div>
            </Flex>
            <Button className="px-[15px]">Accept</Button>
          </Flex>
        ))}
      </div>
    </div>
  );
};

export default FriendReq;
