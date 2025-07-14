import React, { useEffect, useState } from "react";
import {
  getDatabase,
  ref,
  onValue,
  set,
  remove,
  push,
} from "firebase/database";
import { useSelector } from "react-redux";
import { BsThreeDotsVertical } from "react-icons/bs";
import Button from "../../layouts/Button";
import userImg1 from "../../assets/user1.png";
import userImg from "../../assets/user.png";
import userImg2 from "../../assets/user2.png";
import userImg3 from "../../assets/user3.png";
import userImg4 from "../../assets/user4.png";
import Flex from "../../layouts/Flex";
import { toast } from "react-toastify";

const FriendReq = () => {

  const [requestList, setRequestList] = useState([]);
  const db = getDatabase();
  const data = useSelector((state) => state.userInfo.value);

  useEffect(() => {
    const requestRef = ref(db, "friendRequest/");
    onValue(requestRef, (snapshot) => {
      let arr = [];

      snapshot.forEach((item) => {
        const request = item.val();
        if (request.reciverid == data.uid) {
          arr.push({ ...request, id: item.key });
        }
      });
      setRequestList(arr);
    });
  }, []);
  const cancelRequest = (friend) => {
    console.log(friend.key);
    const requestRef = ref(db, "friendRequest/");
    onValue(requestRef, (snapshot) => {
      snapshot.forEach((item) => {
        const key = item.key;
        if (key === friend.id) {
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
  const acceptFriendReq = (user) => {
    set(push(ref(db, "friendlist/")), {
      senderid: user.senderid,
      sendername: user.sendername,
      reciverid: data.uid,
      recivername: data.displayName,
    });
    toast.success("Friend Request Sent");
    cancelRequest(user);
  };

  return (
    <div className="xl:w-[36%] w-full h-[50%] rounded-[20px] px-[20px] font-poppins py-[20px] ">
      <Flex className="">
        <h3 className="text-[20px] font-semibold text-black">Friend Request</h3>
        <BsThreeDotsVertical />
      </Flex>
      {/* <SearchInput /> */}

      <div className="overflow-y-auto h-[90%]">
        {requestList.length > 0 ? (
          requestList.map((user) => (
            <Flex
              key={user.id}
              className="py-[13px] border-b-2 border-gray-300 items-center justify-between"
            >
              <Flex className="gap-x-[14px] w-[60%] justify-start">
                <div>
                  <img
                    src={userImg}
                    className="avatar border w-[70px] h-[70px] rounded-full"
                    alt=""
                  />
                </div>
                <div className="w-[55%]">
                  <h3 className="text-[20px] truncate font-semibold text-black w-full">
                    {user.sendername}
                  </h3>
                  <p className="font-medium text-[14px] text-[#4D4D4D]/75 truncate w-full">
                    {user.senderemail}
                  </p>
                </div>
              </Flex>
              <Button
                onClick={() => acceptFriendReq(user)}
                className="px-[15px]"
              >
                Accept
              </Button>
              <Button onClick={() => cancelRequest(user)} className="px-[15px]">
                Reject
              </Button>
            </Flex>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-10">
            No Friend Request found
          </p>
        )}
      </div>
    </div>
  );
};

export default FriendReq;
