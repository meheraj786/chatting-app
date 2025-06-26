import React from "react";
import Menubar from "../components/menubar/Menubar";
import Flex from "../layouts/Flex";
import GroupList from "../components/groupList/GroupList";
import FriendsList from "../components/friendsList/FriendsList";

const Home = () => {
  return (
    <>
      <Menubar />
      <Flex className="ml-[261px]">
        <GroupList />
        <FriendsList/>
      </Flex>
    </>
  );
};

export default Home;
