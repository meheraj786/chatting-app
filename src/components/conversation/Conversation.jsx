import React, { useEffect, useRef, useState } from "react";
import Flex from "../../layouts/Flex";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdClose, MdEmojiEmotions, MdPersonRemove, MdWarning } from "react-icons/md";
import { IoCameraOutline } from "react-icons/io5";
import Button from "../../layouts/Button";
import { FaLessThanEqual, FaPaperPlane } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import LetterAvatar from "../../layouts/LetterAvatar";
import {
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import time from "../time/time";
import EmojiPicker from "emoji-picker-react";
import { AiFillLike } from "react-icons/ai";
import { roomUser } from "../../features/chatRoom/chatRoom";
import { BiBlock, BiChat } from "react-icons/bi";
import toast, { Toaster } from "react-hot-toast";

const Conversation = ({ msgNotification, isFriend }) => {
  const db = getDatabase();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.userInfo.value);
  const roomuser = useSelector((state) => state.roomUser.value);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [emojiActive, setEmojiActive] = useState(false);
  const [activeDropdown, setActiveDropdown]= useState(false)
  const [unfriendConfirm, setUnfriendConfirm]= useState(false)
  const [blockPopup, setBlockPopup]= useState(false)

  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const getSafeName = (name) => {
    return name && typeof name === 'string' && name.trim() ? name : 'Unknown User';
  };

  const getSafeFirstChar = (name) => {
    const safeName = getSafeName(name);
    return safeName.charAt(0).toUpperCase();
  };

  const getCurrentPartnerName = () => {
    if (!roomuser) return 
    
    return data.uid === roomuser.senderid
      ? getSafeName(roomuser.recivername)
      : getSafeName(roomuser.sendername);
  };

  const getCurrentPartnerChar = () => {
    if (!roomuser) return 
    
    return data.uid === roomuser.senderid
      ? getSafeFirstChar(roomuser.recivername)
      : getSafeFirstChar(roomuser.sendername);
  };

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  };

const unFriendHandler=()=>{
  remove(ref(db, "friendlist/" + roomuser.id));
        toast.success("Unfriended successfully");
        set(push(ref(db, "notification/")), {
          notifyReciver:
            roomuser.senderid == data.uid ? roomuser.reciverid : roomuser.senderid,
          type: "negative",
          time: time(),
          content: `${data.displayName} unfriend you`,
        });
}

const blockHandler=()=>{
      let blockerId = "";
    let blockedId = "";
    let blockerName = "";
    let blockedName = "";
    if (roomuser.senderid == data.uid) {
      blockerId = roomuser.senderid;
      blockerName = getSafeName(roomuser.sendername);
      blockedId = roomuser.reciverid;
      blockedName = getSafeName(roomuser.recivername);
    } else {
      blockerId = roomuser.reciverid;
      blockerName = getSafeName(roomuser.recivername);
      blockedId = roomuser.senderid;
      blockedName = getSafeName(roomuser.sendername);
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
    remove(ref(db, "friendlist/" + roomuser.id));
}

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (roomuser?.id && isFriend && Array.isArray(isFriend)) {
        if (!isFriend.includes(roomuser.id)) {
          console.log("User is not in friend list");
          dispatch(roomUser(null));
        } else {
          console.log("User is friend");
        }
      }
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [isFriend, roomuser?.id, dispatch]);

  const handleMsgNotificationDelete = () => {
    if (!roomuser || !msgNotification?.length) return;

    msgNotification.forEach((item) => {
      if (
        (item.senderid === roomuser.senderid &&
          item.reciverid === roomuser.reciverid) ||
        (item.senderid === roomuser.reciverid &&
          item.reciverid === roomuser.senderid)
      ) {
        const notificationRef = ref(db, "messagenotification/" + item.id);
        remove(notificationRef);
      }
    });
  };

  useEffect(() => {
    if (!roomuser || !data?.uid) return;

    const messageRef = ref(db, "message/");
    const unsubscribe = onValue(messageRef, (snapshot) => {
      let arr = [];
      const roomuserId =
        data.uid === roomuser?.senderid
          ? roomuser?.reciverid
          : roomuser?.senderid;

      snapshot.forEach((item) => {
        const message = item.val();
        const messageId = item.key;
        if (
          (message.senderid === data.uid && message.reciverid === roomuserId) ||
          (message.senderid === roomuserId && message.reciverid === data.uid)
        ) {
          arr.push({ ...message, id: messageId });
        }
      });
      setMessageList(arr);
    });

    return () => unsubscribe();
  }, [db, data?.uid, roomuser]);

  const sentMessageHandler = (like) => {
    if (!roomuser || !data?.uid) return;

    const receiverid =
      data.uid === roomuser.senderid ? roomuser.reciverid : roomuser.senderid;
    const receivername =
      data.uid === roomuser.senderid
        ? getSafeName(roomuser.recivername)
        : getSafeName(roomuser.sendername);

    if (like === "like") {
      set(push(ref(db, "message/")), {
        senderid: data.uid,
        sendername: data.displayName || 'Unknown',
        reciverid: receiverid,
        recivername: receivername,
        message: "like",
        time: time(),
      });
    } else {
      if (message.trim().length === 0) return;

      set(push(ref(db, "message/")), {
        senderid: data.uid,
        sendername: data.displayName || 'Unknown',
        reciverid: receiverid,
        recivername: receivername,
        message: message,
        time: time(),
      });
      setMessage("");
    }

    set(push(ref(db, "messagenotification/")), {
      senderid: data.uid,
      reciverid: receiverid,
    });

    setEmojiActive(false);
  };

  if (!roomuser) {
    return (
      <div className="convo mt-10 xl:mt-0 shadow-shadow flex justify-center items-center rounded-[20px] xl:w-[62%] h-[93vh]">
        <p>No Chat Selected</p>
      </div>
    );
  }

  return (
    <div
      onClick={(e)=>{e.stopPropagation()
        handleMsgNotificationDelete()
        setEmojiActive(false)
      }}
      className="convo mt-10 relative xl:mt-0 shadow-shadow rounded-[20px] xl:w-[62%] h-[93vh]"
    >
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
                    {blockPopup &&  (
                <div className="fixed inset-0 z-[99999] w-full h-full flex justify-center items-center bg-black/50 backdrop-blur-sm">
                  <div className="w-[90%] max-w-md relative flex flex-col justify-center items-center p-8 rounded-2xl shadow-2xl bg-white border border-orange-100">
                    <button
                      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer text-2xl font-bold hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center"
                      onClick={() => {
                        setBlockPopup(false);
                      }}
                    >
                      ×
                    </button>

                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
                      <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-2xl">🚫</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <LetterAvatar>
                        {getCurrentPartnerChar()}
                      </LetterAvatar>
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {getCurrentPartnerName()}
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
                        onClick={() => {
                          setBlockPopup(false);
                          setActiveDropdown(false);
                        }}
                        className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-all duration-200 hover:shadow-md"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          blockHandler();
                          setBlockPopup(false);
                          setActiveDropdown(false);
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
                    {unfriendConfirm && (
                      <div className="fixed inset-0 flex justify-center items-center w-full z-[9999] h-full bg-black/20 backdrop-blur-sm">
                        <div className="w-1/2 max-w-1/2 flex flex-col justify-center items-center min-h-[500px] relative bg-white shadow-2xl gap-y-5 rounded-xl border border-gray-100">
                          <span
                            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors p-1"
                            onClick={() => setUnfriendConfirm(false)}
                          >
                            <MdClose size={24} />
                          </span>
      
                          <div className="mb-4">
                            <div className="p-3 bg-red-100 rounded-full">
                              <MdWarning className="w-8 h-8 text-red-600" />
                            </div>
                          </div>
      
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Remove Friend?
                          </h3>
      
                          <p className="text-gray-600 text-center mb-6 px-6">
                            Are you sure you want to remove{" "}
                            <span className="font-bold">
                              {getCurrentPartnerName()}
                            </span>{" "}
                            from your friends list?
                          </p>
      
                          <div className="flex space-x-3">
                            <button
                              onClick={() => {setUnfriendConfirm(false)
                                setActiveDropdown(false)
                              }}
                              className="px-6 py-2 cursor-pointer bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => {
                                unFriendHandler();
                                setActiveDropdown(false)
                                setUnfriendConfirm(false);
                              }}
                              className="flex bg-red-600 px-6 py-2 hover:bg-red-700 hover:text-white rounded-lg text-white font-semibold cursor-pointer transition-colors items-center space-x-2"
                            >
                              <MdPersonRemove />
                              <span>UnFriend</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                      {activeDropdown && (
                        <div className="absolute right-15 top-18 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999]">
                          <button
                            onClick={() => setUnfriendConfirm(true)}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-2 rounded-t-lg transition-colors"
                          >
                            <BiChat className="text-base" />
                            Unfriend
                          </button>
                          <button
                            onClick={() => {
                              setBlockPopup(true);
                              setActiveDropdown(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center gap-2 rounded-b-lg transition-colors"
                          >
                            <BiBlock className="text-base" />
                            Block
                          </button>
                        </div>
                      )}
      <Flex className="details w-full h-[15%]">
        <Flex className="py-[10px] w-full border-b-2 mx-[50px] pb-[25px] border-gray-300 items-center justify-between">
          <Flex className="gap-x-[14px] w-[65%] justify-start items-center">
            <div className="relative">
              {roomuser.img ? (
                <img
                  src={roomuser.img}
                  className="avatar w-[75px] relative h-[75px] rounded-full"
                  alt=""
                />
              ) : (
                <LetterAvatar className="w-[75px] h-[75px] text-[35px]">
                  {getCurrentPartnerChar()}
                </LetterAvatar>
              )}
            </div>

            <div className="w-[60%]">
              <h3 className="text-[24px] font-semibold text-black truncate w-full">
                {getCurrentPartnerName()}
              </h3>
            </div>
          </Flex>
          <span onClick={()=>{
            setActiveDropdown(!activeDropdown)
          }} className="text-3xl hover:bg-gray-100 p-1 rounded-full text-black text-right cursor-pointer">
            <BsThreeDotsVertical />
          </span>
        </Flex>
      </Flex>

      <div
        ref={scrollContainerRef}
        className="h-[75%] overflow-y-auto relative py-10 px-10"
      >
        {messageList.map((msg, index) =>
          msg.senderid !== data.uid ? (
            <Flex
              key={index}
              className="flex-col gap-y-3 mb-5 max-w-full items-start"
            >
              <span className='relative max-w-full break-words bg-gray-300 text-primary px-[28px] py-[17px] rounded-xl after:content-[""] after:absolute after:bottom-0 after:-left-2 after:w-5 after:h-13 after:bg-gray-300 after:[clip-path:polygon(100%_48%,0%_100%,100%_100%)]'>
                {msg.message === "like" ? (
                  <AiFillLike className="text-[34px] animate-floating" />
                ) : (
                  msg.message
                )}
              </span>
              <span className="text-[12px] text-black/25 font-medium">
                {msg.time}
              </span>
            </Flex>
          ) : (
            <Flex
              key={index}
              className="flex-col mb-5 max-w-full items-end gap-y-3"
            >
              <span className='text-white bg-primary px-[28px] py-[17px] break-words rounded-xl relative after:content-[""] after:absolute after:bottom-0 after:-right-2 after:w-5 after:h-13 after:bg-primary after:[clip-path:polygon(0%_48%,0%_100%,100%_100%)]'>
                {msg.message === "like" ? (
                  <AiFillLike className="text-[34px] animate-floating" />
                ) : (
                  msg.message
                )}
              </span>
              <span className="text-[12px] text-black/25 font-medium">
                {msg.time}
              </span>
            </Flex>
          )
        )}
        <div ref={messagesEndRef} />
      </div>

      <hr className="text-gray-300 w-[90%] mx-auto" />

      <Flex className="messageBox gap-x-[20px] px-10 h-[10%] w-full">
        <div className="messageInput relative w-[85%] xl:w-[90%]">
          <input
            type="text"
            placeholder="Write Message Here"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && message.trim().length > 0) {
                sentMessageHandler();
              }
            }}
            className="bg-[#F1F1F1] p-[15px] rounded-[10px] w-full"
          />
          {emojiActive && (
            <div className="absolute -top-[100%] right-0 z-50">
              <EmojiPicker
                reactionsDefaultOpen={true}
                allowExpandReactions={false}
                theme="dark"
                onEmojiClick={(emojiData) => {
                  setMessage((prev) => prev + emojiData.emoji);
                }}
              />
            </div>
          )}
          <MdEmojiEmotions
            onClick={(e) => {
               e.stopPropagation()
              setEmojiActive(!emojiActive)}}
            className="absolute cursor-pointer hover:text-black top-1/2 text-black/50 right-[48px] text-[20px] -translate-y-1/2"
          />
          <IoCameraOutline className="absolute top-1/2 text-black/50 right-[15px] text-[20px] -translate-y-1/2" />
        </div>

        <div className="w-[7%]">
          {message.trim().length > 0 ? (
            <Button
              onClick={() => sentMessageHandler()}
              className="!p-[15px] text-white text-[15px]"
            >
              <FaPaperPlane />
            </Button>
          ) : (
            <Button
              onClick={() => sentMessageHandler("like")}
              className="!p-[15px] text-white text-[15px]"
            >
              <AiFillLike />
            </Button>
          )}
        </div>
      </Flex>
    </div>
  );
};

export default Conversation;