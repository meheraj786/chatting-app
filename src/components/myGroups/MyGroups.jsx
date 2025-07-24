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
  get,
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
  const [groupMemberList, setGroupMemberList] = useState([]);
  const [memberGroup, setMemberGroup] = useState([]);
  const [grpDeletePopup, setGrpDeletePopup] = useState(true);
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
    const requestRef = ref(db, "groupmembers/");
    onValue(requestRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const request = item.val();
        if (request.creatorId != data.uid && request.memberId == data.uid) {
          arr.push({ ...request, id: item.key });
        }
      });
      setMemberGroup(arr);
    });
  }, []);

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
    const memberRef = ref(db, "groupmembers/");
    onValue(memberRef, (snapshot) => {
      snapshot.forEach((item) => {
        const request = item.val();
        if (request.groupId == id) {
          console.log(request);
          remove(ref(db, "groupmembers/" + item.key));
        }
      });
    });
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

  const leaveHandler = (item) => {
    remove(ref(db, "groupmembers/" + item.id));
    toast.success(`Leave from ${item.groupName} successful`);
  };

  const getMemberList = (groupId) => {
    return groupMemberList.filter((item) => item.groupId == groupId);
  };

  const kickHandler = (group) => {
    remove(ref(db, "groupmembers/" + group.id));
    toast.success(`${group.memberName} removed successfully`);
  };

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
            <div
              key={group.id}
              className="border-b-2 border-gray-300 pb-4 mb-4"
            >
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
                    Info{" "}
                    {getRequestsForGroup(group.id).length > 0 && (
                      <span className="p-1 absolute -right-3 -top-2  text-[12px] rounded-full bg-red-500">
                        {getRequestsForGroup(group.id).length}
                      </span>
                    )}
                  </Button>
                  {grpDeletePopup && (
                    <div className="fixed inset-0 z-[99999] w-full h-full flex justify-center items-center bg-black/50 backdrop-blur-sm">
                      <div className="w-[90%] max-w-md relative flex flex-col justify-center items-center p-8 rounded-2xl shadow-2xl bg-white border border-red-100">
                        <button
                          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer text-2xl font-bold hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center"
                          onClick={() => setGrpDeletePopup(false)}
                        >
                          ×
                        </button>

                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                            <FaTrashCan className="text-white text-xl" />
                          </div>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                          Delete Group
                        </h2>

                        <p className="text-gray-600 text-center mb-8 leading-relaxed">
                          Are you sure you want to delete this group?
                          <br />
                          <span className="text-red-600 font-semibold">
                            This action cannot be undone.
                          </span>
                        </p>

                        <div className="flex gap-4 w-full">
                          <button
                            onClick={() => setGrpDeletePopup(false)}
                            className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-all duration-200 hover:shadow-md"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              deleteHandler(group.id);
                              setGrpDeletePopup(false);
                            }}
                            className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-md flex items-center justify-center gap-2"
                          >
                            <FaTrashCan className="text-sm" />
                            Delete
                          </button>
                        </div>

                        <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded-lg w-full">
                          <p className="text-red-700 text-sm text-center flex items-center justify-center gap-2">
                            <span className="text-red-500">⚠️</span>
                            All group messages and members will be removed
                            permanently
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => setGrpDeletePopup(true)}
                    className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-md flex items-center justify-center gap-2"
                  >
                    <FaTrashCan className="text-sm" />
                  </button>
                </div>
              </Flex>
            </div>
          ))
        )}

        {memberGroup.map((req) => (
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
                    {req.groupName}
                  </h3>
                  <p className="text-[10px] text-black/50 truncate w-full">
                    Wants to join group
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => leaveHandler(req)}>Leave</Button>
                </div>
              </Flex>
            </Flex>
          </Flex>
        ))}
      </div>

      {showGroupInfo && selectedGroup && (
        <div className="fixed inset-0 flex justify-center items-center w-full z-[9999] h-full bg-black/40 backdrop-blur-[8px]">
          <div className="p-8 relative bg-white w-[90%] max-w-4xl max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden">
            <button
              className="absolute right-6 top-6 text-gray-400 hover:text-red-500 transition-colors cursor-pointer text-3xl font-bold hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center"
              onClick={closePopup}
            >
              ×
            </button>

            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {selectedGroup.groupName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-1">
                    {selectedGroup.groupName}
                  </h3>
                  <p className="text-gray-500">
                    Group Information & Management
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">!</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Join Requests
                  </h3>
                  <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                    {getRequestsForGroup(selectedGroup.id).length}
                  </span>
                </div>

                <div className="overflow-y-auto max-h-[350px] space-y-3">
                  {getRequestsForGroup(selectedGroup.id).length > 0 ? (
                    getRequestsForGroup(selectedGroup.id).map((req) => (
                      <div
                        key={req.id}
                        className="bg-white rounded-lg p-4 shadow-sm border border-orange-100 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img
                              src={groupImg}
                              className="w-12 h-12 rounded-full border-2 border-orange-200"
                              alt={req.wantedName}
                            />
                            <div>
                              <h4 className="font-semibold text-gray-800 text-sm">
                                {req.wantedName}
                              </h4>
                              <p className="text-xs text-gray-500">
                                Wants to join group
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => acceptRequest(req)}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => rejectRequest(req)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-orange-500 text-2xl">📭</span>
                      </div>
                      <p className="text-gray-500 font-medium">
                        No pending requests
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        All caught up!
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">👥</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Group Members
                  </h3>
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    {getMemberList(selectedGroup.id).length}
                  </span>
                </div>

                <div className="overflow-y-auto max-h-[350px] space-y-3">
                  {getMemberList(selectedGroup.id).length > 0 ? (
                    getMemberList(selectedGroup.id).map((member) => (
                      <div
                        key={member.id}
                        className="bg-white rounded-lg p-4 shadow-sm border border-blue-100 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img
                              src={groupImg}
                              className="w-12 h-12 rounded-full border-2 border-blue-200"
                              alt={member.memberName}
                            />
                            <div>
                              <h4 className="font-semibold text-gray-800 text-sm">
                                {member.memberName}
                              </h4>
                              <p className="text-xs text-green-600 font-medium">
                                Active Member
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => kickHandler(member)}
                            className="bg-gray-200 hover:bg-red-100 hover:text-red-600 text-gray-600 px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-blue-500 text-2xl">👤</span>
                      </div>
                      <p className="text-gray-500 font-medium">
                        No members yet
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        Invite people to join!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center text-sm text-gray-500">
                <p>Group created by you</p>
                <p>Manage your group settings</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyGroups;
