import React, { useEffect, useState } from "react";
import Menubar from "../components/menubar/Menubar";
import Flex from "../layouts/Flex";
import GroupList from "../components/groupList/GroupList";
import FriendsList from "../components/friendsList/FriendsList";
import UserList from "../components/userList/UserList";
import FriendReq from "../components/friendReq/FriendReq";
import MyGroups from "../components/myGroups/MyGroups";
import BlockedUser from "../components/blockedUser/BlockedUser";
import { getDatabase, onValue, ref } from "firebase/database";
import { useSelector } from "react-redux";

const Home = () => {
    const [requestList, setRequestList] = useState([]);
  const db = getDatabase();
  // const [friendList, setFriendList] = useState([]);
  const data = useSelector((state) => state.userInfo.value);

  useEffect(() => {
    const requestRef = ref(db, "friendRequest/");
    onValue(requestRef, (snapshot) => {
      let arr = [];

      snapshot.forEach((item) => {
        const request = item.val();

        if (request.reciverid === data.uid) {
          arr.push({ ...request, id: item.key });
          // let isAlreadyFriend = false;

          // friendList.forEach((friend) => {
          //   if (
          //     friend.senderid === request.senderid ||
          //     friend.reciverid === request.senderid
          //   ) {
          //     isAlreadyFriend = true;
          //   }
          // });

          // if (!isAlreadyFriend) {
          //   arr.push({ ...request, id: item.key });
          // }
        }
      });
      setRequestList(arr);
    });
  }, []);

  return (
    <>
      <Flex className=" xl:w-[82%] pt-[30px] flex-col xl:flex-row px-3 xl:px-0 items-start  xl:h-[95vh] gap-y-8 xl:mr-[15px]">
        <GroupList />
        <FriendsList />
        <UserList requestList={requestList} />
        <FriendReq requestList={requestList} />
        <MyGroups />
        <BlockedUser />
      </Flex>
    </>
  );
};

export default Home;
