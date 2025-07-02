import React from "react";
import Menubar from "../components/menubar/Menubar";
import Flex from "../layouts/Flex";
import GroupList from "../components/groupList/GroupList";
import FriendsList from "../components/friendsList/FriendsList";
import UserList from "../components/userList/UserList";
import FriendReq from "../components/friendReq/FriendReq";
import MyGroups from "../components/myGroups/MyGroups";
import BlockedUser from "../components/blockedUser/BlockedUser";

const Home = () => {

  return (
    <>
      <Flex className=" xl:w-[82%] pt-[30px] flex-col xl:flex-row px-3 xl:px-0 items-start  xl:h-[95vh] gap-y-8 xl:mr-[15px]">
        <GroupList />
        <FriendsList />
        <UserList />
        <FriendReq />
        <MyGroups />
        <BlockedUser />
      </Flex>
    </>
  );
};

export default Home;
