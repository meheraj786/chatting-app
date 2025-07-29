import React, { useEffect, useState } from "react";
import Flex from "../../layouts/Flex";
import SearchInput from "../../layouts/SearchInput";
import { BsThreeDotsVertical } from "react-icons/bs";
import userImg1 from "../../assets/user1.png";
import userImg2 from "../../assets/user2.png";
import userImg3 from "../../assets/user3.png";
import userImg4 from "../../assets/user4.png";
import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import { useSelector } from "react-redux";
import userImg from "../../assets/user.png";
import UserSkeleton from "../skeleton/UserSkeleton";
import Button from "../../layouts/Button";
import time from "../time/time";
import LetterAvatar from "../../layouts/LetterAvatar";
import toast, { Toaster } from "react-hot-toast";

const FriendsList = () => {
  const [friendList, setFriendList] = useState([]);
  const [friendListLoading, setFriendListLoading] = useState(true);
  const [blockPopup, setBlockPopup] = useState(false);

  const db = getDatabase();
  const data = useSelector((state) => state.userInfo.value);

  const blockHandler = (friend) => {
    let blockerId = "";
    let blockedId = "";
    let blockerName = "";
    let blockedName = "";
    if (friend.senderid == data.uid) {
      blockerId = friend.senderid;
      blockerName = friend.sendername;
      blockedId = friend.reciverid;
      blockedName = friend.recivername;
    } else {
      blockerId = friend.reciverid;
      blockerName = friend.recivername;
      blockedId = friend.senderid;
      blockedName = friend.sendername;
    }
    set(push(ref(db, "blocklist/")), {
      blockerId: blockerId,
      blockedId: blockedId,
      blockerName: blockerName,
      blockedName: blockedName,
    });
    set(push(ref(db, "notification/")), {
      notifyReciver: blockedId,
      type: "negative",
      time: time(),
      content: `${blockerName} blocked you`,
    });
    toast.success("Blocked Successful");
    remove(ref(db, "friendlist/" + friend.id));
  };

  useEffect(() => {
    const requestRef = ref(db, "friendlist/");
    onValue(requestRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const request = item.val();
        if (request.senderid == data.uid || request.reciverid == data.uid) {
          arr.push({ ...request, id: item.key });
        }
      });
      setFriendList(arr);
      setFriendListLoading(false);
    });
  }, []);

  return (
    <div className="xl:w-[30%] w-full shadow-shadow h-[50%] rounded-[20px] px-[20px] font-poppins py-[20px]">
<Toaster
  position="top-right"
  reverseOrder={false}
/>
      <Flex className="justify-between items-center mb-2">
        <h3 className="text-[20px] font-semibold text-black">Friends</h3>
        <BsThreeDotsVertical />
      </Flex>

      {/* <SearchInput /> */}

      <div className="overflow-y-auto h-[90%]">
        {friendListLoading ? (
          <UserSkeleton />
        ) : friendList.length === 0 ? (
          <div className="text-center text-gray-500 py-4">No friends yet</div>
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
                  {/* <img
                    src={userImg}
                    className="avatar w-[52px] relative z-0 h-[52px] rounded-full"
                    alt=""
                  /> */}
                  <LetterAvatar>
                    {friend.senderid == data.uid
                      ? friend.recivername.charAt(0)
                      : friend.sendername.charAt(0)}
                  </LetterAvatar>
                </div>

                <div className="w-[60%]">
                  <h3 className="text-[14px] font-semibold text-black truncate w-full">
                    {friend.senderid == data.uid
                      ? friend.recivername
                      : friend.sendername}
                  </h3>
                  <p className="font-medium text-[12px] text-[#4D4D4D]/75 truncate w-full">
                    {friend.lastMsg}
                  </p>
                </div>
              </Flex>
              {blockPopup && (
                <div className="fixed inset-0 z-[99999] w-full h-full flex justify-center items-center bg-black/50 backdrop-blur-sm">
                  <div className="w-[90%] max-w-md relative flex flex-col justify-center items-center p-8 rounded-2xl shadow-2xl bg-white border border-orange-100">
                    <button
                      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer text-2xl font-bold hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center"
                      onClick={() => setBlockPopup(false)}
                    >
                      ×
                    </button>

                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                      <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-2xl">🚫</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      {/* <img
          src={userImg}
          className="w-12 h-12 rounded-full border-2 border-orange-200"
        /> */}
                      <LetterAvatar>
                        {friend.senderid == data.uid
                          ? friend.recivername.charAt(0)
                          : friend.sendername.charAt(0)}
                      </LetterAvatar>
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {friend.senderid == data.uid
                            ? friend.recivername
                            : friend.sendername}
                        </h4>
                        <p className="text-sm text-gray-500">Will be blocked</p>
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                      Block User
                    </h2>

                    <p className="text-gray-600 text-center mb-8 leading-relaxed">
                      Are you sure you want to block this user?
                      <br />
                      <span className="text-orange-600 font-semibold">
                        They won't be able to message you.
                      </span>
                    </p>

                    <div className="flex gap-4 w-full">
                      <button
                        onClick={() => setBlockPopup(false)}
                        className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-all duration-200 hover:shadow-md"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          blockHandler(friend);
                          setBlockPopup(false);
                        }}
                        className="flex-1 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-md flex items-center justify-center gap-2"
                      >
                        Block
                      </button>
                    </div>

                    <div className="mt-6 p-3 bg-orange-50 border border-orange-200 rounded-lg w-full">
                      <p className="text-orange-700 text-sm text-center flex items-center justify-center gap-2">
                        <span className="text-orange-500">ℹ️</span>
                        You can unblock this user anytime from Blocked Users
                        List
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  setBlockPopup(true);
                }}
                className="px-3 py-2 bg-red-600 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-md flex items-center justify-center gap-2"
              >
                Block
              </button>
            </Flex>
          ))
        )}
      </div>
    </div>
  );
};

export default FriendsList;
