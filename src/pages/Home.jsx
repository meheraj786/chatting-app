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
      <Menubar />
      <Flex className="ml-[261px] pt-[30px]  h-[95vh] gap-y-8 mr-[23px]">
        <GroupList />
        <FriendsList/>
        <UserList/>
<FriendReq/>
<MyGroups/>
<BlockedUser/>
      </Flex>
    </>
  );
};

export default Home;
