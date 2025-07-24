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
        if (request.memberId === data.uid) { // === এর বদলে ==
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
        if (groupItem.creatorId !== data.uid) { // !== এর বদলে !=
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
        <div className="fixed top-0 left-0 flex justify-center items-center w-full z-[9999] h-full bg-gray-200/10 backdrop-blur-[3px]">
          <div className="w-1/2 flex flex-col justify-center items-center h-1/2 relative bg-white shadow-2xl rounded-lg">
            <span
              onClick={() => setCreateGroup(false)}
              className="absolute font-semibold text-[22px] cursor-pointer right-4 top-4"
            >
              ✕
            </span>
            <div className="relative">
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                id="floating_outlined"
                className="block w-full px-[26px] py-[26px] xl:w-[368px] text-xl text-secondary font-semibold bg-transparent rounded-lg border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-secondary/30 peer"
                placeholder=" "
              />
              <label
                htmlFor="floating_outlined"
                className="absolute text-sm text-secondary/70 duration-300 transform top-2 z-10 origin-[0] bg-white -translate-y-4 px-4 peer-focus:px-4 peer-focus:text-secondary/70 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-2/5 rtl:peer-focus:left-auto start-4"
              >
                Group Name
              </label>
            </div>
            <Button onClick={createGroupHandler} className="mt-10">
              Create Group
            </Button>
          </div>
        </div>
      )}
      <Flex className="justify-between items-center mb-2">
        <h3 className="text-[20px] font-semibold text-black">Group List</h3>
        <Button onClick={() => setCreateGroup(true)}>Create Group</Button>
      </Flex>

      <div className="overflow-y-auto h-[90%]">
        {groupListLoading ? (
          <UserSkeleton />
        ) : (
          groups
            .filter(group => !groupMemberList.includes(group.id))
            .map((group, i) => (
              <Flex
                key={group.id} 
                className="py-[13px] border-b-2 border-gray-300 items-center justify-between"
              >
                <Flex className="gap-x-[14px] w-[70%] items-center justify-start">
                  <div>
                    <img
                      src={grpImg}
                      className="avatar border w-[70px] h-[70px] rounded-full"
                      alt={group.groupName}
                    />
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
                  <Button
                    onClick={() => cancelJoinRequest(group)}
                    className="px-[22px] text-[14px]"
                  >
                    Cancel
                  </Button>
                ) : (
                  <Button
                    onClick={() => joinRequest(group)}
                    className="px-[22px] text-[14px]"
                  >
                    Join
                  </Button>
                )}
              </Flex>
            ))
        )}
                      {!groupListLoading && groups.length==0 && (
          <p className="mt-5 text-gray-500 text-center italic">No Groups Found</p>
        )
      }
      </div>
    </div>
  );
};

export default GroupList;