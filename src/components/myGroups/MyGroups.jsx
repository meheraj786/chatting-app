// import React, { useEffect, useState } from "react";
// import Flex from "../../layouts/Flex";
// import SearchInput from "../../layouts/SearchInput";
// import { BsThreeDotsVertical } from "react-icons/bs";
// import groupImg from "../../assets/groupImg.png";
// import grpImg1 from "../../assets/grpImg1.png";
// import grpImg2 from "../../assets/grpImg2.png";
// import grpImg3 from "../../assets/grpImg3.png";
// import grpImg4 from "../../assets/grpImg4.jpg";
// import { FaTrashCan } from "react-icons/fa6";

// import {
//   getDatabase,
//   onValue,
//   ref,
//   remove,
//   set,
//   push,
//   get,
// } from "firebase/database";
// import { useSelector } from "react-redux";
// import UserSkeleton from "../skeleton/UserSkeleton";
// import Button from "../../layouts/Button";
// import time from "../time/time";
// import LetterAvatar from "../../layouts/LetterAvatar";
// import { IoClose, IoWarningOutline } from "react-icons/io5";
// import Sbutton from "../../layouts/Sbutton";
// import toast, { Toaster } from "react-hot-toast";

// const MyGroups = () => {
//   const db = getDatabase();
//   const [groups, setGroups] = useState([]);
//   const [joinReq, setJoinReq] = useState([]);
//   const [showRequests, setShowRequests] = useState({});
//   const [groupListLoading, setGroupListLoading] = useState(true);
//   const [showGroupInfo, setShowGroupInfo] = useState(false);
//   const [selectedGroup, setSelectedGroup] = useState(null);
//   const [groupMemberList, setGroupMemberList] = useState([]);
//   const [memberGroup, setMemberGroup] = useState([]);
//   const [grpDeletePopup, setGrpDeletePopup] = useState(false);
//   const data = useSelector((state) => state.userInfo.value);
//   const [groupLeavePopup, setGroupLeavePopup] = useState(false);

//   const toggleRequests = (group) => {
//     setSelectedGroup(group);
//     setShowGroupInfo(true);
//   };

//   const closePopup = () => {
//     setShowGroupInfo(false);
//     setSelectedGroup(null);
//   };

//   const getRequestsForGroup = (groupId) => {
//     return joinReq.filter((req) => req.groupId === groupId);
//   };
//   useEffect(() => {
//     const requestRef = ref(db, "groupmembers/");
//     onValue(requestRef, (snapshot) => {
//       let arr = [];
//       snapshot.forEach((item) => {
//         const request = item.val();
//         if (request.creatorId != data.uid && request.memberId == data.uid) {
//           arr.push({ ...request, id: item.key });
//         }
//       });
//       setMemberGroup(arr);
//     });
//   }, []);

//   useEffect(() => {
//     const groupList = ref(db, "grouplist/");
//     onValue(groupList, (snapshot) => {
//       let arr = [];
//       snapshot.forEach((group) => {
//         const groupItem = group.val();
//         const groupId = group.key;
//         if (groupItem.creatorId == data.uid) {
//           arr.push({ ...groupItem, id: groupId });
//         }
//       });
//       setGroups(arr);
//       setGroupListLoading(false);
//     });
//   }, []);

//   useEffect(() => {
//     const requestRef = ref(db, "joingroupreq/");
//     onValue(requestRef, (snapshot) => {
//       let arr = [];
//       snapshot.forEach((item) => {
//         const request = item.val();
//         if (request.creatorId == data.uid) {
//           arr.push({ ...request, id: item.key });
//         }
//       });
//       setJoinReq(arr);
//     });
//   }, []);

//   const deleteHandler = (id) => {
//     remove(ref(db, "grouplist/" + id));
//     toast.success("Group Deleted");
//     const memberRef = ref(db, "groupmembers/");
//     onValue(memberRef, (snapshot) => {
//       snapshot.forEach((item) => {
//         const request = item.val();
//         if (request.groupId == id) {
//           console.log(request);
//           remove(ref(db, "groupmembers/" + item.key));
//         }
//       });
//     });
//   };

//   const acceptRequest = (request) => {
//     set(push(ref(db, "groupmembers/")), {
//       groupId: request.groupId,
//       groupName: request.groupName,
//       memberId: request.wantedId,
//       memberName: request.wantedName,
//       creatorId: request.creatorId,
//     });
//     set(push(ref(db, "notification/")), {
//       notifyReciver: request.wantedId,
//       type: "positive",
//       time: time(),
//       content: `Your request to join the group "${request.groupName}" has been approved. Welcome to the group!`,
//     });

//     remove(ref(db, "joingroupreq/" + request.id));
//     toast.success(`${request.wantedName} added to group`);
//   };

//   const rejectRequest = (request) => {
//     remove(ref(db, "joingroupreq/" + request.id));
//     set(push(ref(db, "notification/")), {
//       notifyReciver: request.wantedId,
//       type: "negative",
//       time: time(),
//       content: `Your request to join the group "${request.groupName}" has been Rejected.`,
//     });
//     toast.success(`Request from ${request.wantedName} rejected`);
//   };

//   useEffect(() => {
//     const memberRef = ref(db, "groupmembers/");
//     onValue(memberRef, (snapshot) => {
//       let arr = [];
//       snapshot.forEach((item) => {
//         const request = item.val();
//         if (request.creatorId == data.uid) {
//           arr.push({ ...request, id: item.key });
//         }
//       });
//       setGroupMemberList(arr);
//     });
//   }, []);

//   const leaveHandler = (item) => {
//     remove(ref(db, "groupmembers/" + item.id));
//     toast.success(`Leave from ${item.groupName} successful`);
//     set(push(ref(db, "notification/")), {
//       notifyReciver: item.creatorId,
//       type: "negative",
//       time: time(),
//       content: `"${item.memberName}" has left the group "${item.groupName}".`,
//     });
//   };

//   const getMemberList = (groupId) => {
//     return groupMemberList.filter((item) => item.groupId == groupId);
//   };

//   const kickHandler = (group) => {
//     remove(ref(db, "groupmembers/" + group.id));
//     set(push(ref(db, "notification/")), {
//       notifyReciver: group.memberId,
//       type: "negative",
//       time: time(),
//       content: `You have been removed from the group "${group.groupName}".`,
//     });
//     toast.success(`${group.memberName} removed successfully`);
//   };

//   return (
//     <div className="xl:w-[30%] w-full shadow-shadow h-[50%] rounded-[20px] px-[20px] font-poppins py-[20px]">
//       <Toaster position="top-right" reverseOrder={false} />

//       <Flex className="justify-between items-center mb-2">
//         <h3 className="text-[20px] font-semibold text-black">My Groups</h3>
//         <BsThreeDotsVertical />
//       </Flex>

//       <div className="overflow-y-auto h-[90%]">
//         {groupListLoading ? (
//           <>
//             <UserSkeleton />
//             <UserSkeleton />
//           </>
//         ) : (
//           groups.map((group) => (
//             <div
//               key={group.id}
//               className="border-b-2 border-gray-300 pb-4 mb-4"
//             >
//               <Flex className="py-[10px] items-center justify-between">
//                 <Flex className="gap-x-[14px] w-[65%] items-center justify-start">
//                   <div>
//                     {/* <img
//                       src={groupImg}
//                       className="avatar border w-[52px] h-[52px] rounded-full"
//                       alt=""
//                     /> */}
//                     <LetterAvatar>{group.groupName.charAt(0)}</LetterAvatar>
//                   </div>

//                   <div className="w-[40%]">
//                     <h3 className="text-[14px] font-semibold text-black truncate w-full">
//                       {group.groupName}
//                     </h3>
//                     <p className="font-medium text-[12px] text-[#4D4D4D]/75 truncate w-full">
//                       {getRequestsForGroup(group.id).length} pending requests
//                     </p>
//                   </div>
//                 </Flex>

//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => toggleRequests(group)}
//                     className="relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium  bg-black text-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none hover:text-black cursor-pointer focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200 shadow-sm hover:shadow-md"
//                   >
//                     <span className="">Info</span>

//                     {getRequestsForGroup(group.id).length > 0 && (
//                       <span className="absolute -right-2 -top-2 min-w-[18px] h-[18px] flex items-center justify-center text-[9px] font-bold text-white bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-full border-2 border-white shadow-lg transform scale-100 hover:scale-110 transition-transform duration-200">
//                         {getRequestsForGroup(group.id).length}
//                       </span>
//                     )}
//                   </button>
//                   {grpDeletePopup && (
//                     <div className="fixed inset-0 z-[99999] w-full h-full flex justify-center items-center bg-black/50 backdrop-blur-sm">
//                       <div className="w-[90%] max-w-md relative flex flex-col justify-center items-center p-8 rounded-2xl shadow-2xl bg-white border border-red-100">
//                         <button
//                           className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer text-2xl font-bold hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center"
//                           onClick={() => setGrpDeletePopup(false)}
//                         >
//                           ×
//                         </button>

//                         <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
//                           <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
//                             <FaTrashCan className="text-white text-xl" />
//                           </div>
//                         </div>

//                         <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
//                           Delete Group
//                         </h2>

//                         <p className="text-gray-600 text-center mb-8 leading-relaxed">
//                           Are you sure you want to delete this group?
//                           <br />
//                           <span className="text-red-600 font-semibold">
//                             This action cannot be undone.
//                           </span>
//                         </p>

//                         <div className="flex gap-4 w-full">
//                           <button
//                             onClick={() => setGrpDeletePopup(false)}
//                             className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-all duration-200 hover:shadow-md"
//                           >
//                             Cancel
//                           </button>
//                           <button
//                             onClick={() => {
//                               deleteHandler(group.id);
//                               setGrpDeletePopup(false);
//                             }}
//                             className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-md flex items-center justify-center gap-2"
//                           >
//                             <FaTrashCan className="text-sm" />
//                             Delete
//                           </button>
//                         </div>

//                         <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded-lg w-full">
//                           <p className="text-red-700 text-sm text-center flex items-center justify-center gap-2">
//                             <span className="text-red-500">⚠️</span>
//                             All group messages and members will be removed
//                             permanently
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                   <button
//                     onClick={() => setGrpDeletePopup(true)}
//                     className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-md flex items-center justify-center gap-2"
//                   >
//                     <FaTrashCan className="text-sm" />
//                   </button>
//                 </div>
//               </Flex>
//             </div>
//           ))
//         )}

//         {memberGroup.map((req) => (
//           <Flex>
//             <Flex
//               key={req.id}
//               className="py-[10px] border-b-2 border-gray-300 w-full items-center justify-between"
//             >
//               <Flex
//                 className="gap-x-[15px] items-center w-full justify-start
              
//               3"
//               >
//                 <div>
//                   {/* <img
//                     src={groupImg}
//                     className="avatar border w-[52px] h-[52px] rounded-full"
//                     alt=""
//                   /> */}
//                   <LetterAvatar>{req.groupName.charAt(0)}</LetterAvatar>
//                 </div>

//                 <div className="w-[60%]">
//                   <h3 className="text-[14px] font-semibold text-black truncate w-full">
//                     {req.groupName}
//                   </h3>
//                   <p className="text-[10px] text-black/50 truncate w-full">
//                     Wants to join group
//                   </p>
//                 </div>
//                 <div className="flex gap-2">
//                   <Sbutton onClick={() => setGroupLeavePopup(true)}>Leave</Sbutton>
//                   {groupLeavePopup && (
//                     <div className="fixed inset-0 z-[99999] flex justify-center items-center bg-black/40 backdrop-blur-sm">
//                       <div className="w-full max-w-md mx-4 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
//                         <div className="flex items-center justify-between p-6 border-b border-gray-100">
//                           <div className="flex items-center gap-3">
//                             <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
//                               <IoWarningOutline className="w-5 h-5 text-red-500" />
//                             </div>
//                             <h3 className="text-lg font-semibold text-gray-900">
//                               Leave Group
//                             </h3>
//                           </div>
//                           <button
//                             onClick={() => setGroupLeavePopup(false)}
//                             className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
//                           >
//                             <IoClose className="w-4 h-4 text-gray-500" />
//                           </button>
//                         </div>

//                         <div className="p-6">
//                           <p className="text-gray-600 mb-2">
//                             Are you sure you want to leave
//                           </p>
//                           <p className="font-medium text-gray-900 mb-4">
//                             "{req.groupName}"?
//                           </p>
//                           <p className="text-sm text-gray-500">
//                             You'll no longer receive messages from this group
//                             and won't be able to participate in conversations.
//                           </p>
//                         </div>

//                         <div className="flex gap-3 p-6 pt-0">
//                           <button
//                             onClick={() => setGroupLeavePopup(false)}
//                             className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
//                           >
//                             Cancel
//                           </button>
//                           <button
//                             onClick={() => {
//                               leaveHandler(req);
//                               setGroupLeavePopup(false);
//                             }}
//                             className="flex-1 px-4 py-2.5 text-white bg-red-500 hover:bg-red-600 rounded-lg font-medium transition-colors"
//                           >
//                             Leave Group
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </Flex>
//             </Flex>
//           </Flex>
//         ))}
//         {!groupListLoading && groups.length == 0 && memberGroup.length == 0 && (
//           <p className="mt-5 text-gray-500 text-center italic">
//             No Groups Found
//           </p>
//         )}
//       </div>

//       {showGroupInfo && selectedGroup && (
//         <div className="fixed inset-0 flex justify-center items-center w-full z-[9999] h-full bg-black/40 backdrop-blur-[8px]">
//           <div className="p-8 relative bg-white w-[90%] max-w-4xl max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden">
//             <button
//               className="absolute right-6 top-6 text-gray-400 hover:text-red-500 transition-colors cursor-pointer text-3xl font-bold hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center"
//               onClick={closePopup}
//             >
//               ×
//             </button>

//             <div className="mb-8">
//               <div className="flex items-center gap-4 mb-4">
//                 <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
//                   <span className="text-white text-2xl font-bold">
//                     {selectedGroup.groupName.charAt(0).toUpperCase()}
//                   </span>
//                 </div>
//                 <div>
//                   <h3 className="text-3xl font-bold text-gray-800 mb-1">
//                     {selectedGroup.groupName}
//                   </h3>
//                   <p className="text-gray-500">
//                     Group Information & Management
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//               <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
//                     <span className="text-white text-sm font-bold">!</span>
//                   </div>
//                   <h3 className="text-xl font-bold text-gray-800">
//                     Join Requests
//                   </h3>
//                   <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
//                     {getRequestsForGroup(selectedGroup.id).length}
//                   </span>
//                 </div>

//                 <div className="overflow-y-auto max-h-[350px] space-y-3">
//                   {getRequestsForGroup(selectedGroup.id).length > 0 ? (
//                     getRequestsForGroup(selectedGroup.id).map((req) => (
//                       <div
//                         key={req.id}
//                         className="bg-white rounded-lg p-4 shadow-sm border border-orange-100 hover:shadow-md transition-shadow"
//                       >
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-3">
//                             <img
//                               src={groupImg}
//                               className="w-12 h-12 rounded-full border-2 border-orange-200"
//                               alt={req.wantedName}
//                             />
//                             <div>
//                               <h4 className="font-semibold text-gray-800 text-sm">
//                                 {req.wantedName}
//                               </h4>
//                               <p className="text-xs text-gray-500">
//                                 Wants to join group
//                               </p>
//                             </div>
//                           </div>
//                           <div className="flex gap-2">
//                             <button
//                               onClick={() => acceptRequest(req)}
//                               className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors"
//                             >
//                               Accept
//                             </button>
//                             <button
//                               onClick={() => rejectRequest(req)}
//                               className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors"
//                             >
//                               Reject
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="text-center py-12">
//                       <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                         <span className="text-orange-500 text-2xl">📭</span>
//                       </div>
//                       <p className="text-gray-500 font-medium">
//                         No pending requests
//                       </p>
//                       <p className="text-gray-400 text-sm mt-1">
//                         All caught up!
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
//                 <div className="flex items-center gap-3 mb-6">
//                   <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
//                     <span className="text-white text-sm font-bold">👥</span>
//                   </div>
//                   <h3 className="text-xl font-bold text-gray-800">
//                     Group Members
//                   </h3>
//                   <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
//                     {getMemberList(selectedGroup.id).length}
//                   </span>
//                 </div>

//                 <div className="overflow-y-auto max-h-[350px] space-y-3">
//                   {getMemberList(selectedGroup.id).length > 0 ? (
//                     getMemberList(selectedGroup.id).map((member) => (
//                       <div
//                         key={member.id}
//                         className="bg-white rounded-lg p-4 shadow-sm border border-blue-100 hover:shadow-md transition-shadow"
//                       >
//                         <div className="flex items-center justify-between">
//                           <div className="flex items-center gap-3">
//                             <img
//                               src={groupImg}
//                               className="w-12 h-12 rounded-full border-2 border-blue-200"
//                               alt={member.memberName}
//                             />
//                             <div>
//                               <h4 className="font-semibold text-gray-800 text-sm">
//                                 {member.memberName}
//                               </h4>
//                               <p className="text-xs text-green-600 font-medium">
//                                 Active Member
//                               </p>
//                             </div>
//                           </div>
//                           <button
//                             onClick={() => kickHandler(member)}
//                             className="bg-gray-200 hover:bg-red-100 hover:text-red-600 text-gray-600 px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200"
//                           >
//                             Remove
//                           </button>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <div className="text-center py-12">
//                       <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                         <span className="text-blue-500 text-2xl">👤</span>
//                       </div>
//                       <p className="text-gray-500 font-medium">
//                         No members yet
//                       </p>
//                       <p className="text-gray-400 text-sm mt-1">
//                         Invite people to join!
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className="mt-8 pt-6 border-t border-gray-200">
//               <div className="flex justify-between items-center text-sm text-gray-500">
//                 <p>Group created by you</p>
//                 <p>Manage your group settings</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyGroups;


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
import time from "../time/time";
import LetterAvatar from "../../layouts/LetterAvatar";
import { IoClose, IoWarningOutline } from "react-icons/io5";
import Sbutton from "../../layouts/Sbutton";
import toast, { Toaster } from "react-hot-toast";

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
  const [grpDeletePopup, setGrpDeletePopup] = useState(false);
  const [groupLeavePopup, setGroupLeavePopup] = useState(false);
  const [friendList, setFriendList] = useState([]);
  const [friendListLoading, setFriendListLoading] = useState(true);
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

  // Get friend list
  useEffect(() => {
    const requestRef = ref(db, "friendlist/");
    onValue(requestRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const request = item.val();
        if (request.senderid == data.uid || request.reciverid == data.uid) {
          arr.push({ ...request, id: item.key });
        }
      });
      setFriendList(arr);
      setFriendListLoading(false);
    });
  }, []);

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
    set(push(ref(db, "notification/")), {
      notifyReciver: request.wantedId,
      type: "positive",
      time: time(),
      content: `Your request to join the group "${request.groupName}" has been approved. Welcome to the group!`,
    });

    remove(ref(db, "joingroupreq/" + request.id));
    toast.success(`${request.wantedName} added to group`);
  };

  const rejectRequest = (request) => {
    remove(ref(db, "joingroupreq/" + request.id));
    set(push(ref(db, "notification/")), {
      notifyReciver: request.wantedId,
      type: "negative",
      time: time(),
      content: `Your request to join the group "${request.groupName}" has been Rejected.`,
    });
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
    set(push(ref(db, "notification/")), {
      notifyReciver: item.creatorId,
      type: "negative",
      time: time(),
      content: `"${item.memberName}" has left the group "${item.groupName}".`,
    });
  };

  const getMemberList = (groupId) => {
    return groupMemberList.filter((item) => item.groupId == groupId);
  };

  const kickHandler = (group) => {
    remove(ref(db, "groupmembers/" + group.id));
    set(push(ref(db, "notification/")), {
      notifyReciver: group.memberId,
      type: "negative",
      time: time(),
      content: `You have been removed from the group "${group.groupName}".`,
    });
    toast.success(`${group.memberName} removed successfully`);
  };

  // Get friends who are not already in the group
  const getAvailableFriends = (groupId) => {
    const currentMembers = getMemberList(groupId);
    const pendingRequests = getRequestsForGroup(groupId);
    
    return friendList.filter(friend => {
      const friendId = friend.senderid === data.uid ? friend.reciverid : friend.senderid;
      
      // Check if friend is already a member
      const isAlreadyMember = currentMembers.some(member => member.memberId === friendId);
      
      // Check if friend has pending request
      const hasPendingRequest = pendingRequests.some(req => req.wantedId === friendId);
      
      return !isAlreadyMember && !hasPendingRequest;
    });
  };

  // Add friend to group directly
  const addFriendToGroup = (friend, group) => {
    const friendId = friend.senderid === data.uid ? friend.reciverid : friend.senderid;
    const friendName = friend.senderid === data.uid ? friend.recivername : friend.sendername;
    
    set(push(ref(db, "groupmembers/")), {
      groupId: group.id,
      groupName: group.groupName,
      memberId: friendId,
      memberName: friendName,
      creatorId: data.uid,
    });
    
    set(push(ref(db, "notification/")), {
      notifyReciver: friendId,
      type: "positive",
      time: time(),
      content: `You have been added to the group "${group.groupName}" by ${data.displayName}!`,
    });
    
    toast.success(`${friendName} added to group successfully`);
  };

  return (
    <div className="xl:w-[30%] w-full shadow-shadow h-[50%] rounded-[20px] px-[20px] font-poppins py-[20px]">
      <Toaster position="top-right" reverseOrder={false} />

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
                    <LetterAvatar>{group.groupName.charAt(0)}</LetterAvatar>
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
                  <button
                    onClick={() => toggleRequests(group)}
                    className="relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium  bg-black text-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none hover:text-black cursor-pointer focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <span className="">Info</span>

                    {getRequestsForGroup(group.id).length > 0 && (
                      <span className="absolute -right-2 -top-2 min-w-[18px] h-[18px] flex items-center justify-center text-[9px] font-bold text-white bg-gradient-to-br from-red-500 via-red-600 to-red-700 rounded-full border-2 border-white shadow-lg transform scale-100 hover:scale-110 transition-transform duration-200">
                        {getRequestsForGroup(group.id).length}
                      </span>
                    )}
                  </button>
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
                    className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-md flex items-center justify-center gap-2"
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
              className="py-[10px] border-b-2 border-gray-300 w-full items-center justify-between"
            >
              <Flex
                className="gap-x-[15px] items-center w-full justify-start
              
              3"
              >
                <div>
                  <LetterAvatar>{req.groupName.charAt(0)}</LetterAvatar>
                </div>

                <div className="w-[60%]">
                  <h3 className="text-[14px] font-semibold text-black truncate w-full">
                    {req.groupName}
                  </h3>
                  <p className="text-[10px] text-black/50 truncate w-full">
                    Wants to join group
                  </p>
                </div>
                <div className="flex gap-2">
                  <Sbutton onClick={() => setGroupLeavePopup(true)}>Leave</Sbutton>
                  {groupLeavePopup && (
                    <div className="fixed inset-0 z-[99999] flex justify-center items-center bg-black/40 backdrop-blur-sm">
                      <div className="w-full max-w-md mx-4 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                              <IoWarningOutline className="w-5 h-5 text-red-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Leave Group
                            </h3>
                          </div>
                          <button
                            onClick={() => setGroupLeavePopup(false)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                          >
                            <IoClose className="w-4 h-4 text-gray-500" />
                          </button>
                        </div>

                        <div className="p-6">
                          <p className="text-gray-600 mb-2">
                            Are you sure you want to leave
                          </p>
                          <p className="font-medium text-gray-900 mb-4">
                            "{req.groupName}"?
                          </p>
                          <p className="text-sm text-gray-500">
                            You'll no longer receive messages from this group
                            and won't be able to participate in conversations.
                          </p>
                        </div>

                        <div className="flex gap-3 p-6 pt-0">
                          <button
                            onClick={() => setGroupLeavePopup(false)}
                            className="flex-1 px-4 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              leaveHandler(req);
                              setGroupLeavePopup(false);
                            }}
                            className="flex-1 px-4 py-2.5 text-white bg-red-500 hover:bg-red-600 rounded-lg font-medium transition-colors"
                          >
                            Leave Group
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Flex>
            </Flex>
          </Flex>
        ))}
        {!groupListLoading && groups.length == 0 && memberGroup.length == 0 && (
          <p className="mt-5 text-gray-500 text-center italic">
            No Groups Found
          </p>
        )}
      </div>

      {showGroupInfo && selectedGroup && (
        <div className="fixed inset-0 flex justify-center items-center w-full z-[9999] h-full bg-black/40 backdrop-blur-[8px]">
          <div className="p-8 relative bg-white w-[90%] max-w-6xl max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden">
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Join Requests Section */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 border border-orange-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">!</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Join Requests
                  </h3>
                  <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                    {getRequestsForGroup(selectedGroup.id).length}
                  </span>
                </div>

                <div className="overflow-y-auto max-h-[300px] space-y-3">
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
                              className="w-10 h-10 rounded-full border-2 border-orange-200"
                              alt={req.wantedName}
                            />
                            <div>
                              <h4 className="font-semibold text-gray-800 text-sm">
                                {req.wantedName}
                              </h4>
                              <p className="text-xs text-gray-500">
                                Wants to join
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => acceptRequest(req)}
                              className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => rejectRequest(req)}
                              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-medium transition-colors"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-orange-500 text-xl">📭</span>
                      </div>
                      <p className="text-gray-500 font-medium text-sm">
                        No pending requests
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Group Members Section */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">👥</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Members
                  </h3>
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    {getMemberList(selectedGroup.id).length}
                  </span>
                </div>

                <div className="overflow-y-auto max-h-[300px] space-y-3">
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
                              className="w-10 h-10 rounded-full border-2 border-blue-200"
                              alt={member.memberName}
                            />
                            <div>
                              <h4 className="font-semibold text-gray-800 text-sm">
                                {member.memberName}
                              </h4>
                              <p className="text-xs text-green-600 font-medium">
                                Member
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => kickHandler(member)}
                            className="bg-gray-200 hover:bg-red-100 hover:text-red-600 text-gray-600 px-2 py-1 rounded text-xs font-medium transition-all duration-200"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-blue-500 text-xl">👤</span>
                      </div>
                      <p className="text-gray-500 font-medium text-sm">
                        No members yet
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Add Member Section */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">+</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">
                    Add Friends
                  </h3>
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    {getAvailableFriends(selectedGroup.id).length}
                  </span>
                </div>

                <div className="overflow-y-auto max-h-[300px] space-y-3">
                  {friendListLoading ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 text-sm">Loading friends...</p>
                    </div>
                  ) : getAvailableFriends(selectedGroup.id).length > 0 ? (
                    getAvailableFriends(selectedGroup.id).map((friend) => {
                      const friendId = friend.senderid === data.uid ? friend.reciverid : friend.senderid;
                      const friendName = friend.senderid === data.uid ? friend.recivername : friend.sendername;
                      
                      return (
                        <div
                          key={friend.id}
                          className="bg-white rounded-lg p-4 shadow-sm border border-green-100 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <img
                                src={groupImg}
                                className="w-10 h-10 rounded-full border-2 border-green-200"
                                alt={friendName}
                              />
                              <div>
                                <h4 className="font-semibold text-gray-800 text-sm">
                                  {friendName}
                                </h4>
                                <p className="text-xs text-gray-500">
                                  Friend
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => addFriendToGroup(friend, selectedGroup)}
                              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-green-500 text-xl">👫</span>
                      </div>
                      <p className="text-gray-500 font-medium text-sm">
                        All friends are already members
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