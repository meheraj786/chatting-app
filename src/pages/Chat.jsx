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
import { IoCameraOutline, IoChatbubbleEllipsesOutline } from "react-icons/io5";
import Conversation from "../components/conversation/Conversation";
import { getDatabase, onValue, ref, remove } from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import LetterAvatar from "../layouts/LetterAvatar";
import UserSkeleton from "../components/skeleton/UserSkeleton";
import Sbutton from "../layouts/Sbutton";
import { roomUser } from "../features/chatRoom/chatRoom";
import { useNavigate } from "react-router";
import { IoArrowBack } from "react-icons/io5";

const Chat = () => {
  const dispatch = useDispatch();
  const [friendList, setFriendList] = useState([]);
  const [friendListLoading, setFriendListLoading] = useState(true);
  const [isFriend, setIsFriend] = useState([]);
  const db = getDatabase();
  const navigate = useNavigate();
  const data = useSelector((state) => state.userInfo.value);
  const roomuser = useSelector((state) => state.roomUser.value);
  const [filterFriends, setFilterFriends] = useState([]);
  const [showChatList, setShowChatList] = useState(true);

  const [msgNotification, setMsgNotification] = useState([]);

  const handleSearch = (e) => {
    let arr = [];
    friendList.forEach((item) => {
      if (
        item.sendername.toLowerCase().includes(e.target.value.toLowerCase()) ||
        item.recivername.toLowerCase().includes(e.target.value.toLowerCase())
      ) {
        arr.push(item);
      }
    });
    setFilterFriends(arr);
  };

  const cleanupUnfriendNotifications = () => {
    msgNotification.forEach((notification) => {
      const isFriendNotification = friendList.some((friend) => {
        return (
          (notification.senderid === friend.senderid && notification.reciverid === friend.reciverid) ||
          (notification.senderid === friend.reciverid && notification.reciverid === friend.senderid)
        );
      });
      if (!isFriendNotification) {
        const notificationRef = ref(db, "messagenotification/" + notification.id);
        remove(notificationRef);
        console.log(`Removed notification from unfriended user: ${notification.id}`);
      }
    });
  };

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
  }, [db, data.uid]);

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

  useEffect(() => {
    if (!friendListLoading && friendList.length >= 0 && msgNotification.length > 0) {
      cleanupUnfriendNotifications();
    }
  }, [friendList, msgNotification, friendListLoading]);

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

  const handleChatSelect = (friend) => {
    handleMsgNotificationDelete(friend);
    dispatch(roomUser(friend));
    // On mobile, hide chat list when conversation is selected
    if (window.innerWidth < 1280) {
      setShowChatList(false);
    }
  };

  const handleBackToList = () => {
    setShowChatList(true);
    dispatch(roomUser(null));
  };

  // Listen for window resize to handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setShowChatList(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Flex className="mt-[32px] font-poppins  gap-x-20 justify-start items-start  w-full px-4 xl:px-0">
      {/* Chat List */}
      <div className={`w-full xl:w-auto  xl:block ${showChatList ? 'block' : 'hidden xl:block'}`}>
        <div className="mx-auto xl:mx-0">
          <SearchInput onChange={handleSearch} className="xl:w-[447px] w-full" />
          <div className="xl:w-[447px] w-full shadow-shadow max-h-[85vh] overflow-y-auto rounded-[20px] px-[20px] font-poppins py-[20px]">
            <Flex className="justify-between items-center mb-2 flex-wrap gap-2">
              <h3 className="text-[20px] font-semibold text-black">Friends</h3>
              <Sbutton 
                onClick={() => navigate("/chat/groupchat")}
                className="text-sm px-3 py-1.5"
              >
                Group Chat
              </Sbutton>
            </Flex>

            <div className="overflow-y-auto">
              {friendListLoading && <UserSkeleton />}
              {filterFriends.length > 0 ? filterFriends.map((friend, i) => (
                <Flex
                  key={i}
                  className={`py-[10px] border-b-2 border-gray-300 items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors ${friend.id == roomuser?.id ? "border-2 bg-blue-100 rounded-2xl" : "bg-none"}`}
                >
                  <Flex className="gap-x-[14px] w-[65%] sm:w-[70%] justify-start items-center">
                    <div className="relative">
                      <LetterAvatar className="w-[52px] h-[52px] text-lg">
                        {friend.senderid == data.uid
                          ? friend.recivername.charAt(0)
                          : friend.sendername.charAt(0)}
                      </LetterAvatar>
                      {friend.active && (
                        <span className="w-4 h-4 border-2 border-white rounded-full bg-green-400 absolute bottom-0 right-0 z-[555]"></span>
                      )}
                    </div>

                    <div className="w-[60%] min-w-0">
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
                  <div className="text-xl text-black text-right">
                    <Sbutton
                      className="relative text-sm px-3 py-1.5 flex items-center gap-1"
                      onClick={() => handleChatSelect(friend)}
                    >
                      <IoChatbubbleEllipsesOutline className="xl:mr-1" />
                      <span className="hidden sm:inline">chat</span>
                      {msgNotification.some(
                        (item) =>
                          (item.senderid === friend.senderid &&
                            item.reciverid === friend.reciverid) ||
                          (item.senderid === friend.reciverid &&
                            item.reciverid === friend.senderid)
                      ) && (
                        <span className="w-[12px] h-[12px] absolute -top-1 -left-1 rounded-full animate-pulse bg-red-500"></span>
                      )}
                    </Sbutton>
                  </div>
                </Flex>
              )) : friendList.map((friend, i) => (
                <Flex
                  key={i}
                  className={`py-[10px] border-b-2 border-gray-300 items-center transition-all justify-between cursor-pointer hover:bg-gray-50 ${friend.id == roomuser?.id ? "border-2 bg-blue-100 rounded-2xl" : "bg-none"}`}
                >
                  <Flex className="gap-x-[14px] w-[65%] sm:w-[70%] justify-start items-center">
                    <div className="relative">
                      <LetterAvatar className="w-[52px] h-[52px] text-lg">
                        {friend.senderid == data.uid
                          ? friend.recivername.charAt(0)
                          : friend.sendername.charAt(0)}
                      </LetterAvatar>
                      {friend.active && (
                        <span className="w-4 h-4 border-2 border-white rounded-full bg-green-400 absolute bottom-0 right-0 z-[555]"></span>
                      )}
                    </div>

                    <div className="w-[60%] min-w-0">
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
                  <div className="text-xl text-black text-right">
                    <Sbutton
                      className="relative text-sm px-3 py-1.5 flex items-center gap-1"
                      onClick={() => handleChatSelect(friend)}
                    >
                      <IoChatbubbleEllipsesOutline className="xl:mr-1" />
                      <span className="hidden sm:inline">chat</span>
                      {msgNotification.some(
                        (item) =>
                          (item.senderid === friend.senderid &&
                            item.reciverid === friend.reciverid) ||
                          (item.senderid === friend.reciverid &&
                            item.reciverid === friend.senderid)
                      ) && (
                        <span className="w-[12px] h-[12px] absolute -top-1 -left-1 rounded-full animate-pulse bg-red-500"></span>
                      )}
                    </Sbutton>
                  </div>
                </Flex>
              ))}
              {!friendListLoading && friendList.length == 0 && (
                <p className="text-[12px] text-gray-400 text-center italic py-8">
                  You've No Friends
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Conversation */}
      <div className={`w-1/2  xl:block ${!showChatList ? 'block' : 'hidden xl:block'}`}>
        {/* Mobile Back Button */}
        {roomuser && (
          <button
            onClick={handleBackToList}
            className="xl:hidden flex items-center gap-2 text-primary font-medium mb-4 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <IoArrowBack className="text-lg" />
            <span>Back to Chats</span>
          </button>
        )}
        <Conversation 
          isFriend={isFriend} 
          msgNotification={msgNotification} 
          onBackToList={handleBackToList}
        />
      </div>
    </Flex>
  );
};

export default Chat;