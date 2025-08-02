import React, { useEffect, useState } from "react";
import Flex from "../layouts/Flex";
import SearchInput from "../layouts/SearchInput";
import { BsThreeDotsVertical } from "react-icons/bs";
import groupImg from "../assets/groupImg.png";
import grpImg1 from "../assets/grpImg1.png";
import grpImg2 from "../assets/grpImg2.png";
import grpImg3 from "../assets/grpImg3.png";
import grpImg4 from "../assets/grpImg4.jpg";
import { FaTrashCan } from "react-icons/fa6";

import {
  getDatabase,
  onValue,
  ref,
  remove,
  set,
  push,
  get,
} from "firebase/database";
import { useDispatch, useSelector } from "react-redux";
import {
  IoChatbubbleEllipsesOutline,
  IoClose,
  IoWarningOutline,
} from "react-icons/io5";
import Sbutton from "../layouts/Sbutton";
import toast, { Toaster } from "react-hot-toast";
import UserSkeleton from "../components/skeleton/UserSkeleton";
import LetterAvatar from "../layouts/LetterAvatar";
import GroupConversation from "../components/groupConversation/GroupConversation";
import { groupChat } from "../features/groupChatSlice/groupChatSlice";
import { useNavigate } from "react-router";

const GroupChat = () => {
  const db = getDatabase();
  const [groups, setGroups] = useState([]);
  const [groupListLoading, setGroupListLoading] = useState(true);
  const [memberGroup, setMemberGroup] = useState([]);
  const data = useSelector((state) => state.userInfo.value);
  const navigate= useNavigate()
  const dispatch = useDispatch();

  useEffect(() => {
    if (!data?.uid) return;

    const requestRef = ref(db, "groupmembers/");
    onValue(requestRef, (snapshot) => {
      let arr = [];
      if (snapshot.exists()) {
        snapshot.forEach((item) => {
          const request = item.val();
          if (request && request.creatorId !== data.uid && request.memberId === data.uid) {
            arr.push({ ...request, id: item.key });
          }
        });
      }
      setMemberGroup(arr);
    });
  }, [data?.uid, db]);

  useEffect(() => {
    if (!data?.uid) return;

    const groupList = ref(db, "grouplist/");
    onValue(groupList, (snapshot) => {
      let arr = [];
      if (snapshot.exists()) {
        snapshot.forEach((group) => {
          const groupItem = group.val();
          const groupId = group.key;
          if (groupItem && groupItem.creatorId === data.uid) {
            // Fixed: Add id property to the group object
            arr.push({ 
              ...groupItem, 
              id: groupId, 
              groupId: groupId 
            });
          }
        });
      }
      setGroups(arr);
      setGroupListLoading(false);
    });
  }, [data?.uid, db]);

  if (!data) {
    return (
      <Flex className="mt-[32px] font-poppins items-start xl:w-[80%]">
        <div className="xl:w-[30%] w-full shadow-shadow h-[50%] rounded-[20px] px-[20px] font-poppins py-[20px]">
          <p className="text-center text-gray-500">Loading...</p>
        </div>
      </Flex>
    );
  }

  return (
    <Flex className="mt-[32px] font-poppins items-start xl:w-[80%]">
      <div className="xl:w-[30%] w-full shadow-shadow h-[50%] rounded-[20px] px-[20px] font-poppins py-[20px]">
        <Toaster position="top-right" reverseOrder={false} />

        <Flex className="justify-between items-center mb-2">
          <h3 className="text-[20px] font-semibold text-black">My Groups</h3>
          <Sbutton onClick={()=>navigate("/chat/")}>Friends Chat</Sbutton>
        </Flex>

        <div className="overflow-y-auto h-[90%]">
          {groupListLoading ? (
            <>
              <UserSkeleton />
              <UserSkeleton />
            </>
          ) : (
            groups.map((group) => (
              <div
                key={group.id || group.groupId} 
                className="border-b-2 border-gray-300 pb-4 mb-4"
              >
                <Flex className="py-[10px] items-center justify-between">
                  <Flex className="gap-x-[14px] w-[50%]  items-center justify-start">
                    <div>
                      <LetterAvatar>
                        {group.groupName ? group.groupName.charAt(0) : 'G'}
                      </LetterAvatar>
                    </div>

                    <div className="w-[50%]">
                      <h3 className="text-[14px]  font-semibold text-black truncate w-full">
                        {group.groupName || 'Unnamed Group'}
                      </h3>
                    </div>
                  </Flex>

                  <div className="flex justify-end flex-1">
                    <Sbutton
                      className="relative"
                      onClick={() => {
                        dispatch(groupChat(group));
                      }}
                    >
                      <IoChatbubbleEllipsesOutline className="mr-1" />
                      Chat
                    </Sbutton>
                  </div>
                </Flex>
              </div>
            ))
          )}

          {memberGroup.map((group) => (
            <Flex key={group.id || `member-${Math.random()}`}>
              <Flex
                className="py-[10px] border-b-2 border-gray-300 w-full items-center justify-between"
              >
                <Flex
                  className="gap-x-[15px] items-center w-full justify-start"
                >
                  <div>
                    <LetterAvatar>
                      {group.groupName ? group.groupName.charAt(0) : 'G'}
                    </LetterAvatar>
                  </div>

                  <div className="w-[50%]">
                    <h3 className="text-[14px] font-semibold text-black truncate w-full">
                      {group.groupName || 'Unnamed Group'}
                    </h3>
                    <p className="text-[10px] text-black/50 truncate w-full">
                      Member
                    </p>
                  </div>
                  <div className="flex justify-end flex-1">
                    <Sbutton
                      className="relative"
                      onClick={() => {
                        dispatch(groupChat(group));
                      }}
                    >
                      <IoChatbubbleEllipsesOutline className="mr-1" />
                      Chat
                    </Sbutton>
                  </div>
                </Flex>
              </Flex>
            </Flex>
          ))}

          {!groupListLoading &&
            groups.length === 0 &&
            memberGroup.length === 0 && (
              <p className="mt-5 text-gray-500 text-center italic">
                No Groups Found
              </p>
            )}
        </div>
      </div>
      <div className="w-auto xl:ml-20 flex-1">
      <GroupConversation />

      </div>
    </Flex>
  );
};

export default GroupChat;