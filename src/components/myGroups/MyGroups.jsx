import React, { useEffect, useState } from "react";
import Flex from "../../layouts/Flex";
import SearchInput from "../../layouts/SearchInput";
import { BsThreeDotsVertical } from "react-icons/bs";
import groupImg from "../../assets/groupImg.png";
import grpImg1 from "../../assets/grpImg1.png";
import grpImg2 from "../../assets/grpImg2.png";
import grpImg3 from "../../assets/grpImg3.png";
import grpImg4 from "../../assets/grpImg4.jpg";
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
  const data = useSelector((state) => state.userInfo.value);

  const toggleRequests = (groupId) => {
    setShowRequests((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
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
            <div className="border-b-2 border-gray-300 pb-4 mb-4">
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
                    onClick={() => toggleRequests(group.id)}
                    className="text-[12px] px-3 py-1"
                  >
                    {showRequests[group.id] ? "Hide" : "Show"} (
                    {getRequestsForGroup(group.id).length})
                  </Button>
                  <Button
                    onClick={() => deleteHandler(group.id)}
                    className="text-[12px] !font-normal px-3 py-1 !bg-gray-500 hover:!bg-gray-600"
                  >
                    Delete
                  </Button>
                </div>
              </Flex>

              {showRequests[group.id] && (
                <div className="ml-16 mt-2 bg-gray-50 rounded-lg p-3">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Join Requests:
                  </h4>
                  {getRequestsForGroup(group.id).length > 0 ? (
                    <ul className="space-y-2">
                      {getRequestsForGroup(group.id).map((req) => (
                        <li
                          key={req.id}
                          className="flex items-center justify-between bg-white p-2 rounded border"
                        >
                          <span className="text-sm text-gray-800 font-medium">
                            {req.wantedName}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => acceptRequest(req)}
                              className="text-xs px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => rejectRequest(req)}
                              className="text-xs px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      No pending requests
                    </p>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyGroups;
