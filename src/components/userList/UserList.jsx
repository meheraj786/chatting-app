import React, { useEffect, useState } from "react";
import Flex from "../../layouts/Flex";
import SearchInput from "../../layouts/SearchInput";
import { BsThreeDotsVertical } from "react-icons/bs";
import Button from "../../layouts/Button";
import user from "../../assets/user.png";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { useSelector } from "react-redux";
import { Bounce, toast, ToastContainer } from "react-toastify";

const UserList = () => {
  const [userList, setUserList] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const [sentReqList, setSentReqList] = useState([]);

  const db = getDatabase();
  const data = useSelector((state) => state.userInfo.value);

  useEffect(() => {
    const requestRef = ref(db, "friendList/");
    onValue(requestRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((friend) => {
        const val = friend.val();
        if (val.reciverid === data.uid || val.senderid === data.uid) {
          arr.push(val);
        }
      });
      setFriendList(arr);
    });
  }, []);

  useEffect(() => {
    const reqRef = ref(db, "friendRequest/");
    onValue(reqRef, (snapshot) => {
      let sentReqArr = [];
      snapshot.forEach((item) => {
        const request = item.val();
        if (request.senderid === data.uid) {
          sentReqArr.push(request.reciverid);
        }
      });
      setSentReqList(sentReqArr);
    });
  }, []);

  useEffect(() => {
    const userRef = ref(db, "users/");
    onValue(userRef, (snapshot) => {
      let arr = [];

      snapshot.forEach((item) => {
        const user = item.val();
        const userId = item.key;

        if (userId !== data.uid) {
          let isFriend = false;
          let isSentRequest = false;

          friendList.forEach((friend) => {
            if (
              (friend.senderid === userId && friend.reciverid === data.uid) ||
              (friend.reciverid === userId && friend.senderid === data.uid)
            ) {
              isFriend = true;
            }
          });

          sentReqList.forEach((id) => {
            if (id === userId) {
              isSentRequest = true;
            }
          });

          if (!isFriend && !isSentRequest) {
            arr.push({ ...user, id: userId });
          }
        }
      });
      setUserList(arr);
    });
  }, [friendList, sentReqList]);

  const handleRequest = (item) => {
    if (sentReqList.includes(item.id)) {
      toast.warning("Friend Request Already Sent");
    } else {
      const uniqueId = data.uid + item.id;
      set(ref(db, "friendRequest/" + uniqueId), {
        senderid: data.uid,
        sendername: data.displayName,
        reciverid: item.id,
        recivername: item.username,
      });
      toast.success("Friend Request Sent");
    }
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

            <Button
              onClick={() => handleRequest(friend)}
              className="text-[14px]"
            >
              +
            </Button>
          </Flex>
        ))}
      </div>
    </div>
  );
};

export default UserList;
