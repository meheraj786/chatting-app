import React, { useEffect, useState } from "react";
import Flex from "../../layouts/Flex";
import SearchInput from "../../layouts/SearchInput";
import { BsThreeDotsVertical } from "react-icons/bs";
import userImg1 from "../../assets/user1.png";
import userImg2 from "../../assets/user2.png";
import userImg3 from "../../assets/user3.png";
import userImg4 from "../../assets/user4.png";
import { getDatabase, onValue, ref } from "firebase/database";
import { useSelector } from "react-redux";
import userImg from "../../assets/user.png";

const FriendsList = () => {
    const [friendList, setFriendList] = useState([]);
  
    const db = getDatabase();
    const data = useSelector((state) => state.userInfo.value);


  useEffect(() => {
    const requestRef = ref(db, "friendlist/");
    onValue(requestRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const request = item.val();
        if (request.senderid==data.uid || request.reciverid==data.uid) {
          arr.push(request)
        }
        
      });
      setFriendList(arr);
    });
  }, []);

  return (
    <div className="xl:w-[30%] w-full shadow-shadow h-[50%] rounded-[20px] px-[20px] font-poppins py-[20px]">
      <Flex className="justify-between items-center mb-2">
        <h3 className="text-[20px] font-semibold text-black">Friends</h3>
        <BsThreeDotsVertical />
      </Flex>

      {/* <SearchInput /> */}

      <div className="overflow-y-auto h-[90%]">
        {friendList.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No friends yet
          </div>
        ) : (
          friendList.map((friend, i) => (
            <Flex
              key={i}
              className="py-[10px] border-b-2 border-gray-300 items-center justify-between"
            >
              <Flex className="gap-x-[14px] w-[65%] justify-start items-center">
                <div className="relative">
                  {friend.active && (
                    <span className="w-4 h-4 border-2 border-white rounded-full bg-green-400 absolute bottom-0 right-0 z-[555]"></span>
                  )}
                  <img
                    src={userImg}
                    className="avatar w-[52px] relative z-0 h-[52px] rounded-full"
                    alt=""
                  />
                </div>

                <div className="w-[60%]">
                  <h3 className="text-[14px] font-semibold text-black truncate w-full">
                    {
                      friend.senderid==data.uid ? friend.recivername : friend.sendername
                    }
                  </h3>
                  <p className="font-medium text-[12px] text-[#4D4D4D]/75 truncate w-full">
                    {friend.lastMsg}
                  </p>
                </div>
              </Flex>
              <span className="text-[10px] text-black/50 text-right">
                Recently
              </span>
            </Flex>
          ))
        )}
      </div>
    </div>
  );
};

export default FriendsList;