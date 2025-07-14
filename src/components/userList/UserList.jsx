import React, { useEffect, useState } from "react";
import Flex from "../../layouts/Flex";
import SearchInput from "../../layouts/SearchInput";
import { BsThreeDotsVertical } from "react-icons/bs";
import Button from "../../layouts/Button";
import user from "../../assets/user.png";
import {
  getDatabase,
  ref,
  onValue,
  set,
  push,
  remove,
} from "firebase/database";
import { useSelector } from "react-redux";
import { Bounce, toast, ToastContainer } from "react-toastify";

const UserList = () => {
  const [userList, setUserList] = useState([]);
  const [requestList, setRequestList] = useState([]);
  const [friendList, setFriendList] = useState([]);

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
    });
  }, []);

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
    onValue(requestRef, (snapshot) => {
      snapshot.forEach((item) => {
        const request = item.val();
        const key = item.key;

        if (
          (request.senderid === data.uid && request.reciverid === friend.id) ||
          (request.reciverid === data.uid && request.senderid === friend.id)
        ) {
          remove(ref(db, "friendRequest/" + key))
            .then(() => {
              toast.success("Friend request canceled");
            })
            .catch((error) => {
              console.error(error);
            });
        }
      });
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
        {userList.map((friend, idx) => (
          <Flex
            key={idx}
            className="py-[10px] border-b-2 border-gray-300 items-center justify-between"
          >
            <Flex className="gap-x-[14px] w-[75%] items-center justify-start">
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
{friendList.includes(data.uid + friend.id) ||
  friendList.includes(friend.id + data.uid) ? (
  <Button className="text-[14px] bg-gray-200 cursor-default">
    Friend
  </Button>
) : requestList.includes(data.uid + friend.id) ||
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
    className="text-[14px] !text-black bg-white"
  >
    +
  </Button>
)}


          </Flex>
        ))}
      </div>
    </div>
  );
};

export default UserList;
