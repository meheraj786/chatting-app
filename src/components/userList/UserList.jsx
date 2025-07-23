import React, { useEffect, useState } from "react";
import Flex from "../../layouts/Flex";
import SearchInput from "../../layouts/SearchInput";
import { BsThreeDotsVertical } from "react-icons/bs";
import Button from "../../layouts/Button";
import user from "../../assets/user.png";
import { MdClose, MdPersonRemove, MdWarning } from 'react-icons/md';
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
  get,
} from "firebase/database";
import { useSelector } from "react-redux";
import { Bounce, toast, ToastContainer } from "react-toastify";
import UserSkeleton from "../skeleton/UserSkeleton";

const UserList = () => {
  const [userList, setUserList] = useState([]);
  const [userLoading, setUserLoading] = useState(true);
  const [requestList, setRequestList] = useState([]);
  const [blockList, setBlockList]= useState([])
  const [friendList, setFriendList] = useState([]);
  const [unfriendConfirm, setUnfriendConfirm]= useState(false)
  const [selectedFriend, setSelectedFriend] = useState(null);


  const db = getDatabase();
  const data = useSelector((state) => state.userInfo.value);

  useEffect(() => {
    const userRef = ref(db, "users/");
    onValue(userRef, (snapshot) => {
      let arr = [];

      snapshot.forEach((item) => {
        const user = item.val();
        const userId = item.key;
        if (userId !== data.uid) {
          arr.push({ ...user, id: userId });
        }
      });
      setUserList(arr);
      setUserLoading(false);
    });
  }, []);
    useEffect(() => {
    const blockRef = ref(db, "blocklist/");
    onValue(blockRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const block = item.val();
        arr.push(block.blockerId + block.blockedId);
      });
      setBlockList(arr);
    });
  }, []);



const unFriendHandler = async (friendId) => {
  const friendListRef = ref(db, "friendlist/");
  const snapshot = await get(friendListRef);

  snapshot.forEach((item) => {
    const friend = item.val();
    if (
      (friend.senderid === data.uid && friend.reciverid === friendId) ||
      (friend.senderid === friendId && friend.reciverid === data.uid)
    ) {
      remove(ref(db, "friendlist/" + item.key));
      toast.success("Unfriended successfully");
    }
  });
};



  useEffect(() => {
    const requestRef = ref(db, "friendRequest/");
    onValue(requestRef, (snapshot) => {

      let arr = [];
      snapshot.forEach((item) => {
        const request = item.val();
        arr.push(request.reciverid + request.senderid);
      });
      setRequestList(arr);
    });
  }, []);

  useEffect(() => {
    const requestRef = ref(db, "friendlist/");
    onValue(requestRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const request = item.val();
        arr.push(request.reciverid + request.senderid);
      });
      setFriendList(arr);
    });
  }, [db]);

  const handleRequest = (item) => {
    set(push(ref(db, "friendRequest/")), {
      senderid: data.uid,
      sendername: data.displayName,
      reciverid: item.id,
      recivername: item.username,
    });
    toast.success("Friend Request Sent");
  };

  const cancelRequest = (friend) => {
    const requestRef = ref(db, "friendRequest/");

    get(requestRef)
      .then((snapshot) => {
        snapshot.forEach((item) => {
          const request = item.val();
          const key = item.key;
          if (
            (request.senderid === data.uid &&
              request.reciverid === friend.id) ||
            (request.reciverid === data.uid && request.senderid === friend.id)
          ) {
            toast.success("Friend request canceled");
            return remove(ref(db, "friendRequest/" + key));
          }
        });
      })
      .catch((error) => {
        console.error("Error canceling request:", error);
        toast.error("Failed to cancel request");
      });
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
        <h3 className="text-[20px] font-semibold text-black">Users</h3>
        <BsThreeDotsVertical />
      </Flex>

      <SearchInput />

      <div className="overflow-y-auto h-[70%]">
        {userLoading ? (
          <>
            <UserSkeleton />
            <UserSkeleton />
            <UserSkeleton />
          </>
        ) : (
          userList.map((friend, idx) => (
            <Flex
              key={idx}
              className="py-[10px] border-b-2 border-gray-300 items-center justify-between"
            >
{
  unfriendConfirm && (
    <div className='fixed inset-0 flex justify-center items-center w-full z-[9999] h-full bg-black/20 backdrop-blur-sm'>
      <div className='w-1/2 max-w-1/2 flex flex-col justify-center items-center min-h-[500px] relative bg-white shadow-2xl gap-y-5 rounded-xl border border-gray-100'> 
        
        {/* Close Button */}
        <span 
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors p-1"
          onClick={() => setUnfriendConfirm(false)}
        >
          <MdClose size={24} />
        </span>

        {/* Warning Icon */}
        <div className="mb-4">
          <div className="p-3 bg-red-100 rounded-full">
            <MdWarning className="w-8 h-8 text-red-600" />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Remove Friend?
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-center mb-6 px-6">
          Are you sure you want to remove <span className="font-bold">{selectedFriend?.username}</span> from your friends list?
        </p>

        {/* Buttons */}
        <div className="flex space-x-3">
          <button 
            onClick={() => setUnfriendConfirm(false)}
            className="px-6 py-2 cursor-pointer bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              unFriendHandler(selectedFriend?.id); // selectedFriend use করুন
              setUnfriendConfirm(false);
            }} 
            className="flex bg-red-600 px-6 py-2 hover:bg-red-700 hover:text-white rounded-lg text-white font-semibold cursor-pointer transition-colors items-center space-x-2"
          >
            <MdPersonRemove />
            <span>UnFriend</span>
          </button>
        </div>
        
      </div>
    </div>
  ) 
}
              <Flex className="gap-x-[14px] w-[65%] items-center justify-start">
                <div>
                  <img
                    src={user}
                    className="avatar border w-[52px] h-[52px] rounded-full"
                    alt=""
                  />
                </div>

                <div className="w-[60%]">
                  <h3 className="text-[14px] font-semibold text-black truncate w-full">
                    {friend.username}
                  </h3>
                  <p className="text-[10px] text-black/50 truncate w-full">
                    {friend.email}
                  </p>
                </div>
              </Flex>
              { blockList.includes(data.uid + friend.id) ||
                blockList.includes(friend.id + data.uid) ? (
                <span className="text-[12px] text-gray-400">Block</span>
              ) : friendList.includes(data.uid + friend.id) ||
              friendList.includes(friend.id + data.uid) ? (
<Button
  onClick={() => {
    setSelectedFriend(friend); // friend info store করুন
    setUnfriendConfirm(true);
  }}
  className="text-[14px] bg-gray-200 cursor-default"
>
  Unfriend
</Button>
              ) :requestList.includes(data.uid + friend.id) ||
                requestList.includes(friend.id + data.uid) ? (
                <Button
                  onClick={() => cancelRequest(friend)}
                  className="text-[14px] !text-black bg-white"
                >
                  -
                </Button>
              ) : (
                <Button
                  onClick={() => handleRequest(friend)}
                  className="text-[14px] bg-black"
                >
                  +
                </Button>
              )}
            </Flex>
          ))
        )}
      </div>
    </div>
  );
};

export default UserList;
