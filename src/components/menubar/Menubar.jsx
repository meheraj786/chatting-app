import React, { useState } from "react";
import Flex from "../../layouts/Flex";
import { Link, NavLink, Outlet } from "react-router";
import { VscHome } from "react-icons/vsc";
import { AiFillMessage } from "react-icons/ai";
import { MdOutlineSettings } from "react-icons/md";
import { GrLogout } from "react-icons/gr";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";

const Menubar = () => {
  const [show, setShow] = useState(false);
  return (
    <>
    <Flex className="xl:justify-start justify-center items-start gap-x-7">
      <Flex className="flex-col fixed xl:static justify-end xl:justify-between  xl:w-[186px] z-[9999] bottom-10 xl:top-0 text-white xl:h-[95vh] xl:bg-primary bg-primary/80 backdrop-blur-lg mt-[35px] py-[30px]  xl:pt-[35px] xl:pb-[47px] ml-[32px] rounded-[20px]">
        <Flex className="flex-col hidden xl:flex gap-y-[78px]">
          <div className="avatar group relative w-[100px] h-[100px] rounded-full bg-[url(assets/dp.png)] bg-cover bg-center cursor-pointer">
            <div className="absolute inset-0 bg-gray-500/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <FaCloudUploadAlt className="text-white absolute text-[25px]" />
            </div>
          </div>
          <Flex className="flex-col gap-y-7 pl-[25px]">
            <NavLink
              to="/home"
              className={({isActive})=> isActive ? "xl:py-[22px] py-3 relative rounded-l-2xl px-10 xl:pl-[45px] xl:pr-[59px] bg-white text-primary" : "xl:py-[22px] py-3 group hover:text-primary z-10 relative rounded-l-2xl px-10 xl:pl-[45px] xl:pr-[59px] bg-primary hover:bg-white text-[#C3C3C3]"}
            >
              <VscHome className="text-[46px]" />
              <div className="absolute w-[10px] h-full xl:bg-primary bg-primary/80 b top-0 right-0 rounded-l-2xl"></div>
            </NavLink>
            <NavLink
              to="/chat"
              className={({isActive})=> isActive ? "xl:py-[22px] py-3 relative rounded-l-2xl px-10 xl:pl-[45px] xl:pr-[59px] bg-white text-primary" : "xl:py-[22px] py-3 group hover:text-primary z-10 relative rounded-l-2xl px-10 xl:pl-[45px] xl:pr-[59px] bg-primary hover:bg-white text-[#C3C3C3]"}
            >
              <AiFillMessage className="text-[46px]" />
              <div className="absolute w-[10px] h-full xl:bg-primary bg-primary/80 b top-0 right-0 rounded-l-2xl"></div>
            </NavLink>
            <NavLink
              to="/setting"
              className={({isActive})=> isActive ? "xl:py-[22px] py-3 relative rounded-l-2xl px-10 xl:pl-[45px]  xl:pr-[59px] bg-white text-primary" : "xl:py-[22px] py-3 group hover:text-primary z-10 relative rounded-l-2xl px-10 xl:pl-[45px] xl:pr-[59px] bg-primary hover:bg-white text-[#C3C3C3]"}
            >
              <MdOutlineSettings className="text-[46px]" />
              <div className="absolute w-[10px] h-full xl:bg-primary bg-primary/80 b top-0 right-0 rounded-l-2xl"></div>
            </NavLink>
          </Flex>
        </Flex>
        <NavLink className="hidden xl:block" to="/login">
          <GrLogout className="text-[46px] hover:text-[#C3C3C3]" />
        </NavLink>
        {show && (
          <>
            <Flex className="flex-col  xl:hidden gap-y-[78px]">
              <div className="avatar group relative w-[100px] h-[100px] rounded-full bg-[url(assets/dp.png)] bg-cover bg-center cursor-pointer">
                <div className="absolute inset-0 bg-gray-500/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <FaCloudUploadAlt className="text-white text-[25px]" />
                </div>
              </div>
              <Flex className="flex-col gap-y-7 mb-[100px] pl-[25px]">
                <NavLink
                  to="/home"
                  className={({isActive})=> isActive ? "xl:py-[22px] py-3 relative rounded-l-2xl px-10 xl:pl-[45px] xl:pr-[59px] bg-white text-primary" : "xl:py-[22px] py-3 group hover:text-primary z-10 relative rounded-l-2xl px-10 xl:pl-[45px] xl:pr-[59px] bg-none hover:bg-white text-[#C3C3C3]"}
                >
                  <VscHome className="text-[46px]" />
                   <div className="absolute w-[10px] h-full xl:bg-primary bg-primary/80 b top-0 right-0 rounded-l-2xl"></div>
                </NavLink>

                <NavLink
                  to="/chat"
                  className={({isActive})=> isActive ? "xl:py-[22px] py-3 relative rounded-l-2xl px-10 xl:pl-[45px] xl:pr-[59px] bg-white text-primary" : "xl:py-[22px] py-3 group hover:text-primary z-10 relative rounded-l-2xl px-10 xl:pl-[45px] xl:pr-[59px] bg-none hover:bg-white text-[#C3C3C3]"}
                >
                  <AiFillMessage className="text-[46px]" />
                   <div className="absolute w-[10px] h-full xl:bg-primary bg-primary/80 b top-0 right-0 rounded-l-2xl"></div>
                </NavLink>

                <NavLink
                  to="/setting"
                  className={({isActive})=> isActive ? "xl:py-[22px] py-3 relative rounded-l-2xl px-10 xl:pl-[45px] xl:pr-[59px] bg-white text-primary" : "xl:py-[22px] py-3 group hover:text-primary z-10 relative rounded-l-2xl px-10 xl:pl-[45px] xl:pr-[59px] bg-none hover:bg-white text-[#C3C3C3]"}
                >
                  <MdOutlineSettings className="text-[46px]" />
                  <div className="absolute w-[10px] h-full xl:bg-primary bg-primary/80 b top-0 right-0 rounded-l-2xl"></div>
                </NavLink>
              </Flex>
            </Flex>
            <NavLink className="xl:hidden my-10" to="/login">
              <GrLogout className="text-[46px] hover:text-[#C3C3C3]" />
            </NavLink>
          </>
        )}
        {show ? (
          <RxCross2
            onClick={() => setShow(false)}
            className="text-[34px] mx-6 xl:hidden"
          />
        ) : (
          <IoMenu
            onClick={() => setShow(true)}
            className="text-[24px] mx-6 xl:hidden"
          />
        )}
      </Flex>

      <Outlet />
    </Flex>
    </>
  );
};

export default Menubar;
