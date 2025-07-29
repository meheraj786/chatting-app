import React, { useEffect, useState } from "react";
import Flex from "../layouts/Flex";
import Button from "../layouts/Button";
import userImg1 from "../assets/user1.png";
import userImg2 from "../assets/user2.png";
import userImg3 from "../assets/user3.png";
import userImg4 from "../assets/user4.png";
import { BsThreeDotsVertical } from "react-icons/bs";
import SearchInput from "../layouts/SearchInput";
import { FaPaperPlane } from "react-icons/fa";
import { MdEmojiEmotions } from "react-icons/md";
import { IoCameraOutline } from "react-icons/io5";
import Conversation from "../components/conversation/Conversation";
import { getDatabase, onValue, ref, remove } from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import LetterAvatar from "../layouts/LetterAvatar";
import UserSkeleton from "../components/skeleton/UserSkeleton";
import Sbutton from "../layouts/Sbutton";
import { roomUser } from "../features/chatRoom/chatRoom";

const Chat = () => {
  const dispatch = useDispatch();
  const [friendList, setFriendList] = useState([]);
  const [friendListLoading, setFriendListLoading] = useState(true);
  const [isFriend, setIsFriend] = useState([]);
  const db = getDatabase();
  const data = useSelector((state) => state.userInfo.value);
  const roomuser = useSelector((state) => state.roomUser.value);

  const [msgNotification, setMsgNotification] = useState([]);

  useEffect(() => {
    const requestRef = ref(db, "friendlist/");
    onValue(requestRef, (snapshot) => {
      let arr = [];
      let arr2 = [];
      snapshot.forEach((item) => {
        const request = item.val();
        if (request.senderid == data.uid || request.reciverid == data.uid) {
          arr.push({ ...request, id: item.key });
          arr2.push(...item.key, item.key);
        }
      });
      setFriendList(arr);
      setIsFriend(arr2);
      setFriendListLoading(false);
    });
  }, [db]);

  useEffect(() => {
    const notificationRef = ref(db, "messagenotification/");
    onValue(notificationRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const notification = item.val();

        if (notification.reciverid == data.uid) {
          arr.push({
            id: item.key,
            ...notification,
          });
        }
      });
      setMsgNotification(arr);
    });
  }, []);

  const handleMsgNotificationDelete = (friend) => {
    msgNotification.forEach((item) => {
      if (
        (item.senderid === friend.senderid &&
          item.reciverid === friend.reciverid) ||
        (item.senderid === friend.reciverid &&
          item.reciverid === friend.senderid)
      ) {
        const notificationRef = ref(db, "messagenotification/" + item.id);
        remove(notificationRef);
      }
    });
  };

  return (
    <Flex className="mt-[32px] font-poppins items-start xl:w-[80%]">
      <div className="mx-auto xl:mx-0">
        <SearchInput className="xl:w-[447px]" />
        <div className="xl:w-[447px] w-full shadow-shadow max-h-[85vh] overflow-y-auto rounded-[20px] px-[20px] font-poppins py-[20px]">
          <Flex className="justify-between items-center mb-2">
            <h3 className="text-[20px] font-semibold text-black">Friends</h3>
            <BsThreeDotsVertical />
          </Flex>

          <div className="overflow-y-auto ">
            {friendListLoading && <UserSkeleton />}
            {friendList.map((friend, i) => (
              <Flex
                key={i}
                className={`py-[10px] border-b-2 border-gray-300 items-center justify-between ${friend.id==roomuser?.id ? "bg-gray-100 rounded-lg" : "bg-none"}`}
              >
                <Flex className="gap-x-[14px] w-[65%] justify-start items-center">
                  <div className=" relative ">
                    {/* <img
                      src={friend.img}
                      className="avatar w-[52px] relative z-0 h-[52px] rounded-full"
                      alt=""
                    /> */}
                    <LetterAvatar>
                      {friend.senderid == data.uid
                        ? friend.recivername.charAt(0)
                        : friend.sendername.charAt(0)}
                    </LetterAvatar>
                    {friend.active && (
                      <span className="w-4 h-4 border-2 border-white rounded-full bg-green-400 absolute bottom-0 right-0 z-[555]"></span>
                    )}
                  </div>

                  <div className="w-[60%]">
                    <h3 className="text-[14px] font-semibold text-black truncate w-full">
                      {friend.senderid == data.uid
                        ? friend.recivername
                        : friend.sendername}
                    </h3>
                    <p className="font-medium text-[12px] text-[#4D4D4D]/75 truncate w-full">
                      Recently
                    </p>
                  </div>
                </Flex>
                <span className="text-xl text-black  text-right">
                  <Sbutton
                    className="relative"
                    onClick={() => {
                      handleMsgNotificationDelete(friend);
                      dispatch(roomUser(friend));
                    }}
                  >
                    {msgNotification.some(
                      (item) =>
                        (item.senderid === friend.senderid &&
                          item.reciverid === friend.reciverid) ||
                        (item.senderid === friend.reciverid &&
                          item.reciverid === friend.senderid)
                    ) && (
                      <span className="w-[12px] h-[12px] absolute top-0 left-0 rounded-full bg-red-500"></span>
                    )}
                    chat
                  </Sbutton>
                </span>
              </Flex>
            ))}
            {!friendListLoading && friendList.length == 0 && (
              <p className="text-[12px] text-gray-400 text-center italic">
                You've No Friends
              </p>
            )}
          </div>
        </div>
      </div>

      <Conversation isFriend={isFriend} msgNotification={msgNotification} />
    </Flex>
  );
};

export default Chat;
