import React, { useEffect, useRef, useState } from "react";
import Flex from "../../layouts/Flex";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdEmojiEmotions } from "react-icons/md";
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

const Conversation = ({ msgNotification, isFriend }) => {
  const db = getDatabase();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.userInfo.value);
  const roomuser = useSelector((state) => state.roomUser.value);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [emojiActive, setEmojiActive] = useState(false);

  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  };
  console.log(roomuser);

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
    if (!roomuser || !msgNotification.length) return;

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
    const messageRef = ref(db, "message/");
    onValue(messageRef, (snapshot) => {
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
  }, [db, data.uid, roomuser]);

  const sentMessageHandler = (like) => {
    if (!roomuser) return;

    const receiverid =
      data.uid === roomuser.senderid ? roomuser.reciverid : roomuser.senderid;
    const receivername =
      data.uid === roomuser.senderid
        ? roomuser.recivername
        : roomuser.sendername;

    if (like === "like") {
      set(push(ref(db, "message/")), {
        senderid: data.uid,
        sendername: data.displayName,
        reciverid: receiverid,
        recivername: receivername,
        message: "like",
        time: time(),
      });
    } else {
      if (message.trim().length === 0) return;

      set(push(ref(db, "message/")), {
        senderid: data.uid,
        sendername: data.displayName,
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
        <p>No Chat</p>
      </div>
    );
  }

  return (
    <div
      onClick={(e)=>{e.stopPropagation()
        handleMsgNotificationDelete()
        setEmojiActive(false)
      }}
      className="convo mt-10 xl:mt-0 shadow-shadow rounded-[20px] xl:w-[62%] h-[93vh]"
    >
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
                  {data.uid === roomuser.senderid
                    ? roomuser.recivername.charAt(0).toUpperCase()
                    : roomuser.sendername.charAt(0).toUpperCase()}
                </LetterAvatar>
              )}
            </div>

            <div className="w-[60%]">
              <h3 className="text-[24px] font-semibold text-black truncate w-full">
                {data.uid === roomuser.senderid
                  ? roomuser.recivername
                  : roomuser.sendername}
              </h3>
            </div>
          </Flex>
          <span className="text-3xl text-black text-right">
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
