import React from "react";
import Menubar from "../components/menubar/Menubar";
import Flex from "../layouts/Flex";
import GroupList from "../components/groupList/GroupList";

const Home = () => {
  return (
    <>
      <Menubar />
      <Flex className="ml-[261px]">
        <GroupList />
      </Flex>
    </>
  );
};

export default Home;
