import React, { useEffect, useState } from "react";
import Flex from "../layouts/Flex";
import SearchInput from "../layouts/SearchInput";
import { RiEdit2Fill } from "react-icons/ri";
import { TbMessageCircleFilled } from "react-icons/tb";
import { BiSolidImageAdd } from "react-icons/bi";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { FaKey } from "react-icons/fa";
import { HiTrash } from "react-icons/hi";
import dp from "../assets/dp.png";
import { useDispatch, useSelector } from "react-redux";
import LetterAvatar from "../layouts/LetterAvatar";
import Sbutton from "../layouts/Sbutton";
import { getAuth, updateProfile } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";
import { updateUserName, updateUserStatus } from "../features/user/userSlice";
import { getDatabase, onValue, ref, update } from "firebase/database";

const Setting = () => {
  const data = useSelector((state) => state.userInfo.value);
  const [nameEditMode, setNameEditMode] = useState(false);
  const [statusEditMode, setStatusEditMode]= useState(false)
  const [editedName, setEditedName] = useState(data?.displayName || "");
  const [status, setStatus]= useState(data?.status || "No bio")
  const [friendList, setFriendList] = useState([]);
  const [requestList, setRequestList] = useState([]);
  const [memberGroup, setMemberGroup] = useState([]);
  const [groups, setGroups]= useState([])
  const [groupMessageList, setGroupMessageList]= useState([])
  const [blockList, setBlockList]= useState([])
  const auth = getAuth();
  const db = getDatabase();
  const dispatch = useDispatch();

  useEffect(() => {
    const requestRef = ref(db, "friendlist/");
    onValue(requestRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const request = item.val();
        arr.push({ ...request, id: item.key });
      });
      setFriendList(arr);
    });
  }, []);
  useEffect(() => {
    const requestRef = ref(db, "friendRequest/");
    onValue(requestRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const request = item.val();
        arr.push({ ...request, id: item.key });
      });
      setRequestList(arr);
    });
  }, []);
  useEffect(() => {
    const requestRef = ref(db, "groupmembers/");
    onValue(requestRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const request = item.val();
        arr.push({ ...request, id: item.key });
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
            arr.push({ ...groupItem, id: groupId });
        });
        setGroups(arr);
      });
    }, []);
    useEffect(() => {

    const memberRef = ref(db, "groupmessage/");
    onValue(memberRef, (snapshot) => {
      let arr = [];
      if (snapshot.exists()) {
        snapshot.forEach((item) => {
          const request = item.val();
            arr.push({ ...request, id: item.key });
          
        });
      }

      setGroupMessageList(arr);
    });
  }, []);
  useEffect(() => {
      const requestRef = ref(db, "blocklist/");
      onValue(requestRef, (snapshot) => {
        let arr = [];
        snapshot.forEach((item) => {
          const blockItem = item.val();
          const blockId = item.key;
            arr.push({ ...blockItem, id: blockId });
          
        });
        setBlockList(arr);
      });
    }, []);

  const changeNameHandler = () => {
    updateProfile(auth.currentUser, {
      displayName: editedName,
    })
      .then(() => {
        dispatch(updateUserName(editedName));

        update(ref(db, "users/" + data?.uid), {
          username: editedName,
        });
        toast.success("Name updated successfully!");
        setNameEditMode(false);

        friendList.forEach((friend) => {
          if (friend.senderid == data?.uid) {
            update(ref(db, "friendlist/" + friend.id), {
              sendername: editedName,
            });
          } else if (friend.reciverid == data?.uid) {
            update(ref(db, "friendlist/" + friend.id), {
              recivername: editedName,
            });
          }
        });
        blockList.forEach((friend) => {
          if (friend.blockerId == data?.uid) {
            update(ref(db, "blocklist/" + friend.id), {
              blockerName: editedName,
            });
          } else if (friend.blockedId == data?.uid) {
            update(ref(db, "blocklist/" + friend.id), {
              blockedName: editedName,
            });
          }
        });
        requestList.forEach((friend) => {
          if (friend.senderid == data?.uid) {
            update(ref(db, "friendRequest/" + friend.id), {
              sendername: editedName,
            });
          } else if (friend.reciverid == data?.uid) {
            update(ref(db, "friendRequest/" + friend.id), {
              recivername: editedName,
            });
          }
        });
        memberGroup.forEach((group) => {
          if (group.memberId == data?.uid) {
            update(ref(db, "groupmembers/" + group.id), {
              memberName: editedName,
            });
          }
        });
        groups.forEach((group) => {
          if (group.creatorId == data?.uid) {
            update(ref(db, "grouplist/" + group.id), {
              adminName: editedName,
            });
          }
        });
        groupMessageList.forEach((group) => {
          if (group.senderid == data?.uid) {
            update(ref(db, "groupmessage/" + group.id), {
              sendername: editedName,
            });
          }
        });
        memberGroup.forEach((group) => {
          if (group.creatorId == data?.uid) {
            update(ref(db, "groupmembers/" + group.id), {
              adminName: editedName,
            });
          }
        });
      })
      .catch((error) => {
        toast.error("Error updating auth profile: " + error.message);
      });
  };
  const changeStatus=()=>{
    updateProfile(auth.currentUser, {
      status: status,
    }).then(()=>{
      toast.success("Status Successfully Updated")
      setStatusEditMode(false)
      dispatch(updateUserStatus(status))
    })
  }

  return (
    <div className="xl:w-[82%] w-full font-poppins h-screen rounded-[20px] pt-[30px]">
      <SearchInput className="mb-[36px]" />
      <Toaster position="top-right" />
      <Flex className="gap-x-[36px]">
        <div className="profile p-[26px] w-full xl:w-[48%] xl:h-[85vh] rounded-[20px] shadow-shadow">
          <h3 className="text-[20px] text-black font-semibold">
            Profile Settings
          </h3>
          <div className="data">
            <Flex className="details w-full h-[15%]">
              <Flex className="py-[10px] w-full border-b-2 mt-[50px] mx-[50px] pb-[25px] border-gray-300 items-center justify-between">
                <Flex className="gap-x-[14px] w-full justify-start  items-center">
                  <div>
                    {/* <img src={dp} className="avatar w-[100px] relative h-[100px]  rounded-full" alt="" /> */}
                    <LetterAvatar className="w-[100px] relative h-[100px]">
                      {data.displayName.charAt(0)}
                    </LetterAvatar>
                  </div>

                  <div className="xl:w-[70%] cursor-pointer">
                    <h3 className="text-[25px] font-semibold text-black truncate w-full">
                      {data.displayName}
                    </h3>
{
  statusEditMode ? (<>
    <input type="text" value={status} onChange={(e)=>setStatus(e.target.value)} className="text-[20px] border rounded-lg p-2" /> 
    <Sbutton onClick={changeStatus}>Save</Sbutton>
    </>

  ): <p className="text-[20px]">{status}</p>
}
                    
                  </div>
                </Flex>
              </Flex>
              <div className="options xl:px-[84px] px-10 mt-[43px]">
                <Flex className="justify-start text-[20px] gap-x-[37px]">
                  {nameEditMode ? (
                    <Flex>
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="p-2 rounded-lg  border"
                      />
                      <Sbutton onClick={() => setNameEditMode(false)}>
                        Cancel
                      </Sbutton>
                      <Sbutton onClick={changeNameHandler}>Save</Sbutton>
                    </Flex>
                  ) : (
                    <>
                      <span
                        className="text-[25px] cursor-pointer"
                        onClick={() => setNameEditMode(true)}
                      >
                        <RiEdit2Fill />
                      </span>
                      Edit Profile Name
                    </>
                  )}
                </Flex>
                <Flex className="justify-start text-[20px] my-[37px] gap-x-[37px]">
                  {" "}
                  <span onClick={()=>setStatusEditMode(!statusEditMode)} className="text-[25px]">
                    <TbMessageCircleFilled />
                  </span>{" "}
                  Edit Status Info
                </Flex>
                <Flex className="justify-start text-[20px] my-[37px] gap-x-[37px]">
                  {" "}
                  <span className="text-[25px]">
                    <BiSolidImageAdd />
                  </span>{" "}
                  Edit Profile Photo
                </Flex>
                <Flex className="justify-start text-[20px] gap-x-[37px]">
                  {" "}
                  <span className="text-[25px]">
                    <IoMdHelpCircleOutline />
                  </span>{" "}
                  Help
                </Flex>
              </div>
            </Flex>
          </div>
        </div>
        <div className="account p-[26px] w-full xl:w-[48%] xl:h-[85vh] rounded-[20px] shadow-shadow">
          <h3 className="text-[20px] text-black font-semibold">
            Account Settings
          </h3>
          <div className="options xl:px-[84px] px-10 mt-[43px]">
            <Flex className="justify-start text-[20px] gap-x-[37px]">
              {" "}
              <span className="text-[25px]">
                <FaKey />
              </span>{" "}
              Change Password
            </Flex>
            <Flex className="justify-start text-[20px] my-[37px] gap-x-[37px]">
              {" "}
              <span className="text-[25px]">
                <HiTrash />
              </span>{" "}
              Delete Account
            </Flex>
          </div>
        </div>
      </Flex>
    </div>
  );
};

export default Setting;
