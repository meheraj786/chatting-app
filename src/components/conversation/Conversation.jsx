import React, { useEffect, useState } from "react";
import Flex from "../../layouts/Flex";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdEmojiEmotions } from "react-icons/md";
import { IoCameraOutline } from "react-icons/io5";
import Button from "../../layouts/Button";
import { FaPaperPlane } from "react-icons/fa";
import { useSelector } from "react-redux";
import LetterAvatar from "../../layouts/LetterAvatar";
import { getDatabase, onValue, push, ref, set } from "firebase/database";
import time from "../time/time";
import EmojiPicker from "emoji-picker-react";
import { AiFillLike } from "react-icons/ai";

const Conversation = ({ friends }) => {
  const db = getDatabase();
  const data = useSelector((state) => state.userInfo.value);
  const roomUser = useSelector((state) => state.roomUser.value);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const [emojiActive, setEmojiActive] = useState(false);

  useEffect(() => {
    const messageRef = ref(db, "message/");
    onValue(messageRef, (snapshot) => {
      let arr = [];
      const roomUserId =
        data.uid === roomUser.senderid ? roomUser.reciverid : roomUser.senderid;
      snapshot.forEach((item) => {
        const message = item.val();
        const messageId = item.key;
        if (
          (message.senderid === data.uid && message.reciverid === roomUserId) ||
          (message.senderid === roomUserId && message.reciverid === data.uid)
        ) {
          arr.push({ ...message, id: messageId });
        }
      });
      setMessageList(arr);
    });
  }, [db, data.uid, roomUser]);

  const sentMessageHandler = (like) => {
    if (like=="like") {
      const receiverid =
      data.uid === roomUser.senderid ? roomUser.reciverid : roomUser.senderid;
    const receivername =
      data.uid === roomUser.senderid
        ? roomUser.recivername
        : roomUser.sendername;
    set(push(ref(db, "message/")), {
      senderid: data.uid,
      sendername: data.displayName,
      reciverid: receiverid,
      recivername: receivername,
      message: "like",
      time: time(),
    });
    }else{
      const receiverid =
        data.uid === roomUser.senderid ? roomUser.reciverid : roomUser.senderid;
      const receivername =
        data.uid === roomUser.senderid
          ? roomUser.recivername
          : roomUser.sendername;
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
    setEmojiActive(false)
  };

  if (!roomUser)
    return (
      <div className="convo mt-10 xl:mt-0 shadow-shadow flex justify-center items-center rounded-[20px] xl:w-[62%]  h-[93vh]">
        <p>No Chat</p>
      </div>
    );
  return (
    <div className="convo mt-10 xl:mt-0 shadow-shadow rounded-[20px] xl:w-[62%]  h-[93vh]">
      {friends.map((friend, i) => (
        <>
          <Flex className="details w-full h-[15%]">
            <Flex
              key={i}
              className="py-[10px] w-full border-b-2 mx-[50px] pb-[25px] border-gray-300 items-center justify-between"
            >
              <Flex className="gap-x-[14px] w-[65%] justify-start items-center">
                <div className="relative">
                  {roomUser.img ? (
                    <img
                      src={roomUser.img}
                      className="avatar w-[75px] relative h-[75px] rounded-full"
                      alt=""
                    />
                  ) : (
                    <LetterAvatar className="w-[75px] h-[75px] text-[35px]">
                      {data.uid == roomUser.senderid
                        ? roomUser.recivername.charAt(0).toUpperCase()
                        : roomUser.sendername.charAt(0).toUpperCase()}
                    </LetterAvatar>
                  )}

                  {friend.active && (
                    <span className="w-4 h-4 border-2 border-white rounded-full bg-green-400 absolute bottom-0 right-0 z-[555]"></span>
                  )}
                </div>

                <div className="w-[60%]">
                  <h3 className="text-[24px] font-semibold text-black truncate w-full">
                    {data.uid == roomUser.senderid
                      ? roomUser.recivername
                      : roomUser.sendername}
                  </h3>
                  <p className="font-medium text-[12px] text-[#4D4D4D]/75 truncate w-full">
                    {friend.active && "Online"}
                  </p>
                </div>
              </Flex>
              <span className="text-3xl text-black  text-right">
                <BsThreeDotsVertical />
              </span>
            </Flex>
          </Flex>
          <div className="h-[75%] overflow-y-auto relative py-10 px-10">
            {messageList.map((msg, index) =>
              msg.senderid !== data.uid ? (
                <Flex
                  key={index}
                  className=" flex-col gap-y-3 mb-5 max-w-full items-start"
                >
                  <span className='relative max-w-full break-words bg-gray-300 text-primary px-[28px] py-[17px] rounded-xl after:content-[""] after:absolute after:bottom-0 after:-left-2 after:w-5 after:h-13 after:bg-gray-300  after:[clip-path:polygon(100%_48%,0%_100%,100%_100%)]'>
                    {
                      msg.message=="like" ? <AiFillLike className="text-[34px]" /> : msg.message
                    }
                  </span>
                  <span className="text-[12px] text-black/25 font-medium">
                    {msg.time}
                  </span>
                </Flex>
              ) : (
                <Flex
                  key={index}
                  className=" flex-col mb-5 max-w-full items-end gap-y-3 "
                >
                  <span className='text-white bg-primary px-[28px] py-[17px]  break-words rounded-xl relative after:content-[""] after:absolute after:bottom-0 after:-right-2 after:w-5 after:h-13 after:bg-primary  after:[clip-path:polygon(0%_48%,0%_100%,100%_100%)]'>
                    {
                      msg.message=="like" ? <AiFillLike className="text-[34px]" /> : msg.message
                    }
                  </span>
                  <span className="text-[12px] text-black/25 font-medium">
                    {msg.time}
                  </span>
                </Flex>
              )
            )}
          </div>
        </>
      ))}

      <hr className="text-gray-300 w-[90%] mx-auto" />
      <Flex className="messageBox gap-x-[20px] px-10 h-[10%] w-full ">
        <div className="messageInput relative w-[85%] xl:w-[90%]">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && message.trim().length > 0) {
                sentMessageHandler();
              }
            }}
            className=" bg-[#F1F1F1] p-[15px] rounded-[10px] w-full"
          />
          {emojiActive && (
            <div className="absolute -top-[100%] right-0">
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
          <MdEmojiEmotions onClick={()=>setEmojiActive(!emojiActive)} className="absolute cursor-pointer hover:text-black top-1/2 text-black/50 right-[48px] text-[20px] -translate-y-1/2" />

          <IoCameraOutline className="absolute top-1/2 text-black/50 right-[15px] text-[20px] -translate-y-1/2" />
        </div>
        <div className="w-[7%]">
          {message.trim().length > 0 ? (
            <Button
              onClick={sentMessageHandler}
              className="!p-[15px] text-white text-[15px]"
            >
              <FaPaperPlane />
            </Button>
          ): <Button
              onClick={()=>sentMessageHandler("like")}
              className="!p-[15px] text-white text-[15px]"
            >
              <AiFillLike />
            </Button>
        }
        </div>
      </Flex>
    </div>
  );
};

export default Conversation;
