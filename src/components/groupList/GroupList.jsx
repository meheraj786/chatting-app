import React, { useEffect, useState } from "react";
import Flex from "../../layouts/Flex";
import SearchInput from "../../layouts/SearchInput";
import { BsThreeDotsVertical } from "react-icons/bs";
import Button from "../../layouts/Button";
import grpImg1 from "../../assets/grpImg1.png";
import grpImg from "../../assets/groupImg.png";
import grpImg2 from "../../assets/grpImg2.png";
import grpImg3 from "../../assets/grpImg3.png";
import grpImg4 from "../../assets/grpImg4.jpg";
import grpImg5 from "../../assets/grpImg5.jpg";
import { useSelector } from "react-redux";
import {
  get,
  getDatabase,
  onValue,
  push,
  ref,
  remove,
  set,
} from "firebase/database";
import { Bounce, toast, ToastContainer } from "react-toastify";
import UserSkeleton from "../skeleton/UserSkeleton";
import LetterAvatar from "../../layouts/LetterAvatar";
import { IoClose } from "react-icons/io5";
import Sbutton from "../../layouts/Sbutton";

const GroupList = () => {
  const [createGroup, setCreateGroup] = useState(false);
  const [sendReq, setSendReq] = useState([]);
  const [groupMemberList, setGroupMemberList] = useState([]);
  const db = getDatabase();
  const data = useSelector((state) => state.userInfo.value);
  const [groups, setGroups] = useState([]);
  const [groupListLoading, setGroupListLoading] = useState(true);
  const [groupName, setGroupName] = useState("");

  const createGroupHandler = () => {
    if (!groupName.trim()) {
      toast.error("Please enter a group name");
      return;
    }

    set(push(ref(db, "grouplist/")), {
      groupName: groupName,
      creatorId: data.uid,
    });
    setGroupName("");
    setCreateGroup(false);
    toast.success("Group Created");
  };

  useEffect(() => {
    const memberRef = ref(db, "groupmembers/");
    onValue(memberRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const request = item.val();
        if (request.memberId === data.uid) {
          // === এর বদলে ==
          arr.push(request.groupId);
        }
      });
      setGroupMemberList(arr);
    });
  }, [data.uid, db]);

  useEffect(() => {
    const groupList = ref(db, "grouplist/");
    onValue(groupList, (snapshot) => {
      let arr = [];
      snapshot.forEach((group) => {
        const groupItem = group.val();
        const groupId = group.key;
        if (groupItem.creatorId !== data.uid) {
          // !== এর বদলে !=
          arr.push({ ...groupItem, id: groupId });
        }
      });
      setGroups(arr);
      setGroupListLoading(false);
    });
  }, [data.uid, db]);

  const joinRequest = (grp) => {
    set(push(ref(db, "joingroupreq/")), {
      groupName: grp.groupName,
      creatorId: grp.creatorId,
      groupId: grp.id,
      wantedId: data.uid,
      wantedName: data.displayName,
    });
    toast.success("Join Request Sent");
  };

  useEffect(() => {
    const requestRef = ref(db, "joingroupreq/");
    onValue(requestRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const request = item.val();
        arr.push({ userId: request.wantedId, id: request.groupId });
      });
      setSendReq(arr);
    });
  }, [db]);

  const cancelJoinRequest = async (grp) => {
    const requestRef = ref(db, "joingroupreq/");
    const snapshot = await get(requestRef);

    snapshot.forEach((item) => {
      const request = item.val();
      if (request.groupId === grp.id && request.wantedId === data.uid) {
        remove(ref(db, "joingroupreq/" + item.key));
        toast.success("Join request canceled");
      }
    });
  };

  return (
    <div className="xl:w-[36%] w-full shadow-shadow h-[50%] rounded-[20px] px-[20px] font-poppins py-[20px]">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
      {createGroup && (
        <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-lg mx-4 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                Create New Group
              </h3>
              <button
                onClick={() => setCreateGroup(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <IoClose className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <label
                  htmlFor="groupName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Group Name
                </label>
                <input
                  type="text"
                  id="groupName"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-black outline-none transition-colors text-gray-900 placeholder-gray-500"
                  placeholder="Enter group name"
                />
              </div>

              <p className="text-sm text-gray-500 mb-6">
                Choose a name that describes your group's purpose or topic.
              </p>
            </div>

            <div className="flex gap-3 p-6 pt-0 border-t border-gray-100">
              <button
                onClick={() => setCreateGroup(false)}
                className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createGroupHandler}
                disabled={!groupName.trim()}
                className="flex-1 px-4 py-2.5 text-white bg-blue-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      )}
      <Flex className="justify-between items-center mb-2">
        <h3 className="text-[20px] font-semibold text-black">Group List</h3>
        <Sbutton onClick={() => setCreateGroup(true)}>Create Group</Sbutton>
      </Flex>

      <div className="overflow-y-auto h-[90%]">
        {groupListLoading ? (
          <UserSkeleton />
        ) : (
          groups
            .filter((group) => !groupMemberList.includes(group.id))
            .map((group, i) => (
              <Flex
                key={group.id}
                className="py-[13px] border-b-2 border-gray-300 items-center justify-between"
              >
                <Flex className="gap-x-[14px] w-[70%] items-center justify-start">
                  <div>
                    {/* <img
                      src={grpImg}
                      className="avatar border w-[70px] h-[70px] rounded-full"
                      alt={group.groupName}
                    /> */}
                    <LetterAvatar>{group.groupName.charAt(0)}</LetterAvatar>
                  </div>

                  <div className="w-[60%]">
                    <h3 className="text-[20px] font-semibold text-black truncate w-full">
                      {group.groupName}
                    </h3>
                    <p className="font-medium text-[14px] text-[#4D4D4D]/75 truncate w-full">
                      {group.lastMsg || "No messages yet"}
                    </p>
                  </div>
                </Flex>
                {sendReq.some(
                  (req) => req.id === group.id && req.userId === data.uid
                ) ? (
                  <Sbutton
                    onClick={() => cancelJoinRequest(group)}
                    className="px-[22px] text-[14px]"
                  >
                    Cancel
                  </Sbutton>
                ) : (
                  <Sbutton
                    onClick={() => joinRequest(group)}
                    className="px-[22px] text-[14px]"
                  >
                    Join
                  </Sbutton>
                )}
              </Flex>
            ))
        )}
        {!groupListLoading && groups.length == 0 && (
          <p className="mt-5 text-gray-500 text-center italic">
            No Groups Found
          </p>
        )}
      </div>
    </div>
  );
};

export default GroupList;
