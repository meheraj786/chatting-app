import React, { useEffect, useState } from "react";
import Flex from "../../layouts/Flex";
import SearchInput from "../../layouts/SearchInput";
import { BsThreeDotsVertical } from "react-icons/bs";
import Button from "../../layouts/Button";
import userImg from "../../assets/user.png";
// import userImg1 from "../../assets/user1.png";
// import userImg2 from "../../assets/user2.png";
// import userImg3 from "../../assets/user3.png";
// import userImg4 from "../../assets/user4.png";
// import userImg5 from "../../assets/user5.png";
import { getDatabase, onValue, push, ref, remove, set } from "firebase/database";
import { useSelector } from "react-redux";
import UserSkeleton from "../skeleton/UserSkeleton";
import { Bounce, toast, ToastContainer } from "react-toastify";
import time from "../time/time";
import LetterAvatar from "../../layouts/LetterAvatar";
import Sbutton from "../../layouts/Sbutton";

const BlockedUser = () => {
  const db = getDatabase();
  const [blockList, setBlockList] = useState([]);
  const data = useSelector((state) => state.userInfo.value);
  const [blockListLoading, setBlockListLoading] = useState(true);

  useEffect(() => {
    const requestRef = ref(db, "blocklist/");
    onValue(requestRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const blockItem = item.val();
        const blockId = item.key;
        if (
          blockItem.blockerId == data.uid ||
          blockItem.blockedId == data.uid
        ) {
          arr.push({ ...blockItem, id: blockId });
        }
      });
      setBlockList(arr);
      setBlockListLoading(false);
    });
  }, []);

  const unBlockHandler = (user) => {
    console.log("Block");
    set(push(ref(db, "notification/")), {
          notifyReciver: user.blockedId,
          type: "positive",
          time: time(),
          content: `${user.blockerName} unblocked you`
        });
    
    remove(ref(db, "blocklist/" + user.id));
    toast.success("User Unblocked")
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
        <h3 className="text-[20px] font-semibold text-black">Blocked Users</h3>
        <BsThreeDotsVertical />
      </Flex>

      {/* <SearchInput /> */}

      <div className="overflow-y-auto h-[90%]">
        {blockListLoading ? (
          <UserSkeleton />
        ) : (
          blockList.map((user, idx) => (
            <Flex
              key={idx}
              className="py-[10px] border-b-2 border-gray-300 items-center justify-between"
            >
              <Flex className="gap-x-[14px] w-[60%] items-center justify-start">
                <div>
                  {/* <img
                    src={userImg}
                    className="avatar border w-[52px] h-[52px] rounded-full"
                    alt=""
                  /> */}
                  <LetterAvatar>
                                        {user.blockerId == data.uid
                      ? user.blockedName.charAt(0)
                      : user.blockerName.charAt(0)}
                                      </LetterAvatar>
                </div>

                <div className="w-[60%]">
                  <h3 className="text-[14px] font-semibold text-black truncate w-full">
                    {user.blockerId == data.uid
                      ? user.blockedName
                      : user.blockerName}
                  </h3>
                  <p className="text-[10px] text-black/50 truncate w-full">
                    12:27
                  </p>
                </div>
              </Flex>
              {user.blockerId == data.uid && (
                <Sbutton
                  onClick={() => unBlockHandler(user)}
                  className="text-[12px]"
                >
                  Unblock
                </Sbutton>
              )}
            </Flex>
          ))
        )}
        {!blockListLoading && blockList.length==0 && (
          <p className="mt-5 text-gray-500 text-center italic">No Block User Found</p>
        )
      }
      </div>
    </div>
  );
};

export default BlockedUser;
