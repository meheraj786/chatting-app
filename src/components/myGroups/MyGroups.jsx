import React, { useEffect, useState } from "react";
import Flex from "../../layouts/Flex";
import SearchInput from "../../layouts/SearchInput";
import { BsThreeDotsVertical } from "react-icons/bs";
import groupImg from "../../assets/groupImg.png";
import grpImg1 from "../../assets/grpImg1.png";
import grpImg2 from "../../assets/grpImg2.png";
import grpImg3 from "../../assets/grpImg3.png";
import grpImg4 from "../../assets/grpImg4.jpg";
import { FaTrashCan } from "react-icons/fa6";

import {
  getDatabase,
  onValue,
  ref,
  remove,
  set,
  push,
} from "firebase/database";
import { useSelector } from "react-redux";
import UserSkeleton from "../skeleton/UserSkeleton";
import Button from "../../layouts/Button";
import { Bounce, toast, ToastContainer } from "react-toastify";

const MyGroups = () => {
  const db = getDatabase();
  const [groups, setGroups] = useState([]);
  const [joinReq, setJoinReq] = useState([]);
  const [showRequests, setShowRequests] = useState({});
  const [groupListLoading, setGroupListLoading] = useState(true);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupMemberList, setGroupMemberList] = useState([])
  const data = useSelector((state) => state.userInfo.value);

  const toggleRequests = (group) => {
    setSelectedGroup(group);
    setShowGroupInfo(true);
  };

  const closePopup = () => {
    setShowGroupInfo(false);
    setSelectedGroup(null);
  };

  const getRequestsForGroup = (groupId) => {
    return joinReq.filter((req) => req.groupId === groupId);
  };

  useEffect(() => {
    const groupList = ref(db, "grouplist/");
    onValue(groupList, (snapshot) => {
      let arr = [];
      snapshot.forEach((group) => {
        const groupItem = group.val();
        const groupId = group.key;
        if (groupItem.creatorId == data.uid) {
          arr.push({ ...groupItem, id: groupId });
        }
      });
      setGroups(arr);
      setGroupListLoading(false);
    });
  }, []);

  useEffect(() => {
    const requestRef = ref(db, "joingroupreq/");
    onValue(requestRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const request = item.val();
        if (request.creatorId == data.uid) {
          arr.push({ ...request, id: item.key });
        }
      });
      setJoinReq(arr);
    });
  }, []);

  const deleteHandler = (id) => {
    remove(ref(db, "grouplist/" + id));
    toast.success("Group Deleted");
  };

  const acceptRequest = (request) => {
    set(push(ref(db, "groupmembers/")), {
      groupId: request.groupId,
      groupName: request.groupName,
      memberId: request.wantedId,
      memberName: request.wantedName,
      creatorId: request.creatorId,
    });

    remove(ref(db, "joingroupreq/" + request.id));
    toast.success(`${request.wantedName} added to group`);
  };

  const rejectRequest = (request) => {
    remove(ref(db, "joingroupreq/" + request.id));
    toast.success(`Request from ${request.wantedName} rejected`);
  };

  useEffect(() => {
    const memberRef = ref(db, "groupmembers/");
    onValue(memberRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const request = item.val();
        if (request.creatorId == data.uid) {
          arr.push({ ...request, id: item.key });
        }
      });
      setGroupMemberList(arr);
    });
  }, []);
  

  const getMemberList=(groupId)=>{
    return groupMemberList.filter((item)=> item.groupId==groupId)
  }

  const kickHandler= (group)=>{
    remove(ref(db, "groupmembers/" + group.id));
    toast.success(`${group.memberName} removed successfully`);
  }

  return (
    <div className="xl:w-[30%] w-full shadow-shadow h-[50%] rounded-[20px] px-[20px] font-poppins py-[20px]">
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

      <Flex className="justify-between items-center mb-2">
        <h3 className="text-[20px] font-semibold text-black">My Groups</h3>
        <BsThreeDotsVertical />
      </Flex>

      <div className="overflow-y-auto h-[90%]">
        {groupListLoading ? (
          <>
            <UserSkeleton />
            <UserSkeleton />
          </>
        ) : (
          groups.map((group) => (
            <div key={group.id} className="border-b-2 border-gray-300 pb-4 mb-4">
              <Flex className="py-[10px] items-center justify-between">
                <Flex className="gap-x-[14px] w-[65%] items-center justify-start">
                  <div>
                    <img
                      src={groupImg}
                      className="avatar border w-[52px] h-[52px] rounded-full"
                      alt=""
                    />
                  </div>

                  <div className="w-[40%]">
                    <h3 className="text-[14px] font-semibold text-black truncate w-full">
                      {group.groupName}
                    </h3>
                    <p className="font-medium text-[12px] text-[#4D4D4D]/75 truncate w-full">
                      {getRequestsForGroup(group.id).length} pending requests
                    </p>
                  </div>
                </Flex>

                <div className="flex gap-2">
                  <Button
                    onClick={() => toggleRequests(group)}
                    className="text-[12px] relative px-3 py-1"
                  >
                    Info {
                      getRequestsForGroup(group.id).length >0 && (
                        <span className="p-1 absolute -right-3 -top-2  text-[12px] rounded-full bg-red-500">{getRequestsForGroup(group.id).length}</span>
                      )
                    }
                  </Button>
                  <Button
                    onClick={() => deleteHandler(group.id)}
                    className="text-[12px] !font-normal px-3 py-1 !bg-gray-500 hover:!bg-gray-600"
                  >
                    <FaTrashCan />

                  </Button>
                </div>
              </Flex>
            </div>
          ))
        )}
      </div>

      {showGroupInfo && selectedGroup && (
        <div className='fixed inset-0 flex justify-center items-center w-full z-[9999] h-full bg-white/10 backdrop-blur-[5px]'>
          <div className="p-6 relative bg-white w-1/2 max-h-[80vh] rounded-lg shadow-lg overflow-hidden">
            <span 
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 cursor-pointer text-2xl font-bold"
              onClick={closePopup}
            >
              ×
            </span>

            <div className="mb-4">
              <h3 className="text-3xl font-semibold text-gray-800 mb-2">
                Group Information
              </h3>
              <p className="text-2xl text-gray-600">
                <strong>{selectedGroup.groupName}</strong>
              </p>
            </div>
            <Flex className="items-start">
            <div className="overflow-y-auto w-1/2  max-h-[400px]">
              {getRequestsForGroup(selectedGroup.id).length > 0 ? (
                <div>
                  <h3 className="text-[26px] mb-2">Group Join Requests</h3>
                  {getRequestsForGroup(selectedGroup.id).map((req, idx) => (
                    <Flex>
                    <Flex
                      key={req.id}
                      className="py-[10px] border-b-2 border-gray-300 items-start justify-start"
                    >
                      <Flex className="gap-x-[5px] items-center  justify-start">
                        <div>
                          <img
                            src={groupImg}
                            className="avatar border w-[52px] h-[52px] rounded-full"
                            alt=""
                          />
                        </div>

                        <div className="w-[40%]">
                          <h3 className="text-[14px] font-semibold text-black truncate w-full">
                            {req.wantedName}
                          </h3>
                          <p className="text-[10px] text-black/50 truncate w-full">
                            Wants to join group
                          </p>
                        </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => acceptRequest(req)}
                          className="text-[14px]"
                        >
                          Accept
                        </Button>
                        <Button
                          onClick={() => rejectRequest(req)}
                          className="text-[14px] "
                        >
                          Reject
                        </Button>
                      </div>
                      </Flex>

                    </Flex>
                    </Flex>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic text-center py-8">
                  No pending requests
                </p>
              )}
            </div>
            <div className="overflow-y-auto w-1/2 max-h-[400px]">
              {getMemberList(selectedGroup.id).length > 0 ? (
                <div>
                  <h3 className="text-[26px] mb-2">Group Join Requests</h3>
                  {getMemberList(selectedGroup.id).map((req, idx) => (
                    <Flex>
                    <Flex
                      key={req.id}
                      className="py-[10px] border-b-2 border-gray-300 items-start justify-between"
                    >
                      
                    
                      <Flex className="gap-x-[14px]  items-center w-full  justify-start">
                        <div>
                          <img
                            src={groupImg}
                            className="avatar border w-[52px] h-[52px] rounded-full"
                            alt=""
                          />
                        </div>

                        <div className="w-[60%]">
                          <h3 className="text-[14px] font-semibold text-black truncate w-full">
                            {req.memberName}
                          </h3>
                          <p className="text-[10px] text-black/50 truncate w-full">
                            Wants to join group
                          </p>
                        </div>
                        <Button
                          onClick={() => kickHandler(req)}
                          className="text-[14px] bg-gray-200 hover:bg-gray-300"
                        >
                          Kick
                        </Button>
                      </Flex>

                    </Flex>
                    </Flex>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic text-center py-8">
                  No Members
                </p>
              )}
            </div>

            </Flex>

            <Flex>

            </Flex>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyGroups;