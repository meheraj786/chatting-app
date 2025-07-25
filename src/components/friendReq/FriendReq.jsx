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
import UserSkeleton from "../skeleton/UserSkeleton";
import time from "../time/time";
import LetterAvatar from "../../layouts/LetterAvatar";

const FriendReq = () => {
  const [requestList, setRequestList] = useState([]);
  const [requestListLoading, setRequestListLoading] = useState(true);
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
      setRequestListLoading(false);
    });
  }, []);

const cancelRequest = (friend, dontShow) => {
  remove(ref(db, "friendRequest/" + friend.id))
    .then(() => {
      if (!dontShow) {
        toast.success("Friend request canceled");
        set(push(ref(db, "notification/")), {
          notifyReciver: friend.senderid,
          type: "negative",
          time: time(),
          content: `${friend.recivername} canceled your friend request`,
        });
      }
    })
    .catch((error) => {
      console.error(error);
      toast.error("Failed to cancel request");
    });
};


  const acceptFriendReq = (user) => {
    set(push(ref(db, "friendlist/")), {
      senderid: user.senderid,
      sendername: user.sendername,
      reciverid: data.uid,
      recivername: data.displayName,
    }).then(() => {
      toast.success("Friend Request Accepted");
      set(push(ref(db, "notification/")), {
          notifyReciver: user.senderid,
          type: "positive",
          time: time(),
          content: `${user.recivername} accept your friend request`,
        });
      const dontShow = true;
      cancelRequest(user, dontShow);
    });
  };

  return (
    <div className="xl:w-[36%] w-full h-[50%] rounded-[20px] px-[20px] font-poppins py-[20px] ">
      <Flex className="">
        <h3 className="text-[20px] font-semibold text-black">Friend Request</h3>
        <BsThreeDotsVertical />
      </Flex>

      <div className="overflow-y-auto h-[90%]">
        {requestListLoading ? (
          <>
            <UserSkeleton />
          </>
        ) : requestList.length > 0 ? (
          requestList.map((user) => (
            <Flex
              key={user.id}
              className="py-[13px] border-b-2 border-gray-300 items-center justify-between"
            >
              <Flex className="gap-x-[14px] w-[60%] justify-start">
                <div>
                  {/* <img
                    src={userImg}
                    className="avatar border w-[70px] h-[70px] rounded-full"
                    alt=""
                  /> */}
                  <LetterAvatar>
                      {user.sendername.charAt(0)}
                    </LetterAvatar>
                </div>
                <div className="w-[55%]">
                  <h3 className="text-[20px] truncate font-semibold text-black w-full">
                    {user.sendername}
                  </h3>
                  <p className="font-medium text-[12px] text-[#4D4D4D]/75 truncate w-full">
                    {user.time}
                  </p>
                </div>
              </Flex>
              <Button
                onClick={() => acceptFriendReq(user)}
                className="px-[15px]"
              >
                Accept
              </Button>
              <Button
                onClick={() => cancelRequest(user)}
                className="px-[15px]"
              >
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
