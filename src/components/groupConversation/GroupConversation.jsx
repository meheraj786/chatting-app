import React, { useEffect, useRef, useState } from "react";
import Flex from "../../layouts/Flex";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdClose, MdEmojiEmotions, MdWarning } from "react-icons/md";
import { IoCameraOutline } from "react-icons/io5";
import Button from "../../layouts/Button";
import { FaPaperPlane } from "react-icons/fa";
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
import { BiExit, BiX } from "react-icons/bi";
import toast, { Toaster } from "react-hot-toast";
import { FaCrown, FaUsers } from "react-icons/fa6";

const GroupConversation = () => {
  const db = getDatabase();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.userInfo.value);
  const selectedGroup = useSelector((state) => state.groupChat.value);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [emojiActive, setEmojiActive] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(false);
  const [leaveGroupConfirm, setLeaveGroupConfirm] = useState(false);
  const [msgListLoading, setMsgListLoading] = useState(true);
  const [groupMembers, setGroupMembers] = useState([]);
  const [groupMemberPopup, setGroupMemberPopup] = useState(false);
  const [memberId, setMemberId] = useState([]);

  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  };

  useEffect(() => {
    if (!selectedGroup?.id) return;

    const membersRef = ref(db, "groupmembers/");
    const unsubscribe = onValue(membersRef, (snapshot) => {
      let members = [];
      let membersId = [];
      snapshot.forEach((item) => {
        const member = item.val();
        if (member.groupId === selectedGroup.groupId) {
          members.push({ ...member, id: item.key });
          membersId.push(member.memberId);
        }
      });
      setGroupMembers(members);
      setMemberId(membersId);
      setMsgListLoading(false);
    });

    return () => unsubscribe();
  }, [selectedGroup?.groupId, db, selectedGroup.id, selectedGroup]);

  const leaveGroupHandler = () => {
    if (!selectedGroup) return;

    const userMembership = groupMembers.find(
      (member) => member.memberId === data.uid
    );

    if (userMembership) {
      remove(ref(db, "groupmembers/" + userMembership.id));

      set(push(ref(db, "notification/")), {
        notifyReciver: selectedGroup.creatorId,
        type: "negative",
        time: time(),
        content: `${data.displayName} has left the group "${selectedGroup.groupName}"`,
      });

      toast.success(`Left ${selectedGroup.groupName} successfully`);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  useEffect(() => {
    const memberRef = ref(db, "groupmessage/");
    onValue(memberRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const request = item.val();
        if (request.groupId === selectedGroup.groupId) {
          arr.push({ ...request, id: item.key });
        }
      });
      setMessageList(arr);
    });
  }, [db, selectedGroup]);

  const sentMessageHandler = (like) => {
    if (!selectedGroup || !data?.uid) return;

    const groupId = selectedGroup.groupId;
    const groupName = selectedGroup.groupName;

    if (like === "like") {
      set(push(ref(db, "groupmessage/")), {
        senderid: data.uid,
        sendername: data.displayName || "Unknown",
        groupId,
        groupName,
        message: "like",
        time: time(),
      });
    } else {
      if (message.trim().length === 0) return;

      set(push(ref(db, "groupmessage/")), {
        senderid: data.uid,
        sendername: data.displayName || "Unknown",
        groupId,
        groupName,
        message: message,
        time: time(),
      });
      setMessage("");
    }

    setEmojiActive(false);
  };

  console.log(memberId);

  if (!selectedGroup) {
    return (
      <div className="convo mt-10 xl:mt-0 shadow-shadow flex justify-center items-center rounded-[20px] xl:w-[62%] h-[93vh]">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-400 text-3xl">💬</span>
          </div>
          <p className="text-gray-500 text-lg font-medium">No Group Selected</p>
          <p className="text-gray-400 text-sm mt-2">
            Select a group to start chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setEmojiActive(false);
      }}
      className="convo mt-10 relative xl:mt-0 shadow-shadow rounded-[20px] xl:w-[62%] h-[93vh]"
    >
      <Toaster position="top-right" reverseOrder={false} />

      {groupMemberPopup && (
        <div className="fixed inset-0 flex justify-center items-center w-full z-[9999] h-full bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md mx-4 bg-white shadow-2xl rounded-2xl border border-gray-200 overflow-hidden">
            <div className="bg-white text-black p-6 relative border-b border-gray-200">
              <button
                onClick={() => setGroupMemberPopup(false)}
                className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <BiX size={20} />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-black/10 rounded-full">
                  <FaUsers size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    {selectedGroup.groupName}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {groupMembers.length} members
                  </p>
                </div>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              <div className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${"bg-black"}`}
                >
                  {selectedGroup.adminName.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-gray-900">
                      {selectedGroup.adminName}
                    </h3>
                    
                    <div className="flex items-center gap-1 px-2 py-1 bg-black text-white rounded-full text-xs font-medium">
                      <FaCrown size={12} />
                      Creator
                    </div>
                    
                  </div>
                </div>
              </div>
              {groupMembers.map((member, index) => {
                const isCreator = member.creatorId === data.uid;

                return (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold ${
                        isCreator ? "bg-black" : "bg-gray-600"
                      }`}
                    >
                      {member.memberName.charAt(0).toUpperCase()}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">
                          {member.memberName}
                        </h3>
                        {isCreator && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-black text-white rounded-full text-xs font-medium">
                            <FaCrown size={12} />
                            Creator
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-white border-t border-gray-200">
              <button
                onClick={() => setGroupMemberPopup(false)}
                className="w-full py-2 px-4 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {leaveGroupConfirm && (
        <div className="fixed inset-0 flex justify-center items-center w-full z-[9999] h-full bg-black/20 backdrop-blur-sm">
          <div className="w-1/2 max-w-1/2 flex flex-col justify-center items-center min-h-[400px] relative bg-white shadow-2xl gap-y-5 rounded-xl border border-gray-100">
            <span
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors p-1"
              onClick={() => setLeaveGroupConfirm(false)}
            >
              <MdClose size={24} />
            </span>

            <div className="mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <MdWarning className="w-8 h-8 text-red-600" />
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Leave Group?
            </h3>

            <p className="text-gray-600 text-center mb-6 px-6">
              Are you sure you want to leave{" "}
              <span className="font-bold">"{selectedGroup.groupName}"</span>?
              <br />
              <span className="text-sm text-gray-500">
                You won't receive messages from this group anymore.
              </span>
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setLeaveGroupConfirm(false);
                  setActiveDropdown(false);
                }}
                className="px-6 py-2 cursor-pointer bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  leaveGroupHandler();
                  setActiveDropdown(false);
                  setLeaveGroupConfirm(false);
                }}
                className="flex bg-red-600 px-6 py-2 hover:bg-red-700 hover:text-white rounded-lg text-white font-semibold cursor-pointer transition-colors items-center space-x-2"
              >
                <BiExit />
                <span>Leave Group</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeDropdown && !selectedGroup.isCreator && (
        <div className="absolute right-15 top-18 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999]">
          <button
            onClick={() => setLeaveGroupConfirm(true)}
            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center gap-2 rounded-lg transition-colors"
          >
            <BiExit className="text-base" />
            Leave Group
          </button>
        </div>
      )}

      <Flex className="details w-full h-[15%]">
        <Flex className="py-[10px] w-full border-b-2 mx-[50px] pb-[25px] border-gray-300 items-center justify-between">
          <Flex className="gap-x-[14px] w-[65%] justify-start items-center">
            <div className="relative">
              <LetterAvatar className="w-[75px] h-[75px] text-[35px]">
                {selectedGroup.groupName.charAt(0).toUpperCase()}
              </LetterAvatar>
            </div>

            <div className="w-[60%]">
              <h3 className="text-[24px] font-semibold text-black truncate w-full">
                {selectedGroup.groupName}
              </h3>
              <p className="text-[14px] cursor-pointer text-gray-500">
                {selectedGroup.creatorId !== data.uid ? (
                  <p onClick={() => setGroupMemberPopup(true)}>
                    {groupMembers.length + 1} members •{" "}
                  </p>
                ) : selectedGroup.creatorId === data.uid ? (
                  "You are admin"
                ) : (
                  "Member"
                )}
              </p>
            </div>
          </Flex>

          {selectedGroup.creatorId!==data.uid && (
            <span
              onClick={() => {
                setActiveDropdown(!activeDropdown);
              }}
              className="text-3xl hover:bg-gray-100 p-1 rounded-full text-black text-right cursor-pointer"
            >
              <BsThreeDotsVertical />
            </span>
          )}
        </Flex>
      </Flex>

      <div
        ref={scrollContainerRef}
        className="h-[75%] overflow-y-auto relative py-10 px-10"
      >
        {!msgListLoading && messageList.length == 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400 text-2xl">👋</span>
              </div>
              <p className="text-gray-500 font-medium">No messages yet</p>
              <p className="text-gray-400 text-sm mt-1">
                Start the conversation!
              </p>
            </div>
          </div>
        ) : (
          messageList.map((msg, index) =>
            msg.senderid !== data.uid ? (
              <Flex
                key={index}
                className="flex-col gap-y-2 mb-5 max-w-full items-start"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[12px] font-semibold text-gray-700">
                    {msg.sendername}
                  </span>
                  <span className="text-[10px] text-black/25 font-medium">
                    {msg.time}
                  </span>
                </div>
                <span className='relative max-w-full break-words bg-gray-300 text-primary px-[28px] py-[17px] rounded-xl after:content-[""] after:absolute after:bottom-0 after:-left-2 after:w-5 after:h-13 after:bg-gray-300 after:[clip-path:polygon(100%_48%,0%_100%,100%_100%)]'>
                  {msg.message === "like" ? (
                    <AiFillLike className="text-[34px] animate-floating" />
                  ) : (
                    msg.message
                  )}
                </span>
              </Flex>
            ) : (
              <Flex
                key={index}
                className="flex-col mb-5 max-w-full items-end gap-y-2"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] text-black/25 font-medium">
                    {msg.time}
                  </span>
                  <span className="text-[12px] font-semibold text-gray-700">
                    You
                  </span>
                </div>
                <span className='text-white bg-primary px-[28px] py-[17px] break-words rounded-xl relative after:content-[""] after:absolute after:bottom-0 after:-right-2 after:w-5 after:h-13 after:bg-primary after:[clip-path:polygon(0%_48%,0%_100%,100%_100%)]'>
                  {msg.message === "like" ? (
                    <AiFillLike className="text-[34px] animate-floating" />
                  ) : (
                    msg.message
                  )}
                </span>
              </Flex>
            )
          )
        )}
        <div ref={messagesEndRef} />
      </div>

      <hr className="text-gray-300 w-[90%] mx-auto" />

      <Flex className="messageBox gap-x-[20px] px-10 h-[10%] w-full">
        <div className="messageInput relative w-[85%] xl:w-[90%]">
          <input
            type="text"
            placeholder={`Message ${selectedGroup.groupName}...`}
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
              e.stopPropagation();
              setEmojiActive(!emojiActive);
            }}
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

export default GroupConversation;
