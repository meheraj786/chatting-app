import React, { useEffect, useState } from "react";
import Flex from "../../layouts/Flex";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { VscHome } from "react-icons/vsc";
import { AiFillMessage } from "react-icons/ai";
import { MdOutlineSettings } from "react-icons/md";
import { useDispatch } from "react-redux";
import { GrLogout } from "react-icons/gr";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoArrowBack, IoMenu } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import welcomeImg from "../../assets/welcomeImg.png";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useSelector } from "react-redux";
import { HashLoader } from "react-spinners";
import { ImExit } from "react-icons/im";
import { signOut } from "firebase/auth";
import dp from "../../assets/dp.png";
import { userInfo } from "../../features/user/userSlice";

const Menubar = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [verify, setVerify] = useState(false);
  const [loading, setLoading] = useState(true);
  const data = useSelector((state) => state.userInfo.value);

  useEffect(() => {
    if (!data) {
      navigate("/registration");
    }
  }, []);
  

  
onAuthStateChanged(auth, (user) => {
      if (data) {
        if (user && user.emailVerified) {
          setVerify(true);
        } else {
          setVerify(false);
        }
        setLoading(false);
      }
    })
  const signoutHandler = () => {
    setLoading(true);
    signOut(auth)
      .then(() => {
        localStorage.removeItem("userInfo");
        dispatch(userInfo(null));
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };
  if (loading) {
    return (
      <Flex className="justify-center h-screen">
        <HashLoader size={100} />
      </Flex>
    );
  }
  return (
    <>
      {verify ? (
        <Flex className="xl:justify-start justify-center items-start gap-x-7">
          <Flex className="flex-col fixed xl:static left-[10px] justify-end xl:justify-between xl:w-[186px] z-[9999] bottom-10 xl:top-0 text-white xl:h-[95vh] xl:bg-primary bg-primary/80 backdrop-blur-lg mt-[35px] py-[30px]  xl:pt-[35px] min-w-[100px] xl:pb-[47px] ml-[32px] rounded-[20px]">
            <Flex className="flex-col w-full hidden xl:flex gap-y-[78px]">
              <div>
              <div className="relative group">
                <div className="absolute top-1/2 left-1/2 bg-gray-500/40 rounded-full z-[555] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <FaCloudUploadAlt className="text-white absolute z-[555] text-[25px]" />
                </div>
                <img
                  src={dp}
                  className="avatar relative w-[100px] mx-auto z-[0] h-[100px] rounded-full cursor-pointer"
                  alt=""
                />
              </div>
                <p className="text-white text-center font-primary font-bold mt-3">{data.displayName}</p>

              </div>
              <Flex className="flex-col w-full gap-y-7 ">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? "relative navItem bg-primary text-primary  mx-auto transition-all z-10 w-full group hover:text-primary after:group-hover:bg-primary py-5 after:content-[''] after:ml-[25px] after:w-full after:h-full after:rounded-l-[20px] after:absolute after:top-0 after:z-[-2] before:z-[-1] after:left-0 after:bg-white before:content-[''] before:absolute before:w-[10px] before:h-full before:bg-primary before:rounded-l-[20px] before:top-0 before:right-0 "
                      : "relative navItem bg-primary text-white  mx-auto transition-all z-10 w-full group hover:text-primary after:group-hover:bg-primary py-5 after:content-[''] after:ml-[25px] after:w-full after:h-full after:rounded-l-[20px] after:absolute after:top-0 after:z-[-2] before:z-[-1] after:left-0 after:bg-white before:content-[''] before:absolute before:w-full before:h-full before:bg-primary before:rounded-l-[20px] before:top-0 before:right-0 "
                  }
                >
                  <VscHome className="text-[46px] font-bold mx-auto" />
                </NavLink>

                <NavLink
                  to="/chat"
                  className={({ isActive }) =>
                    isActive
                      ? "relative navItem bg-primary text-primary  mx-auto transition-all z-10 w-full group hover:text-primary after:group-hover:bg-primary py-5 after:content-[''] after:ml-[25px] after:w-full after:h-full after:rounded-l-[20px] after:absolute after:top-0 after:z-[-2] before:z-[-1] after:left-0 after:bg-white before:content-[''] before:absolute before:w-[10px] before:h-full before:bg-primary before:rounded-l-[20px] before:top-0 before:right-0 "
                      : "relative navItem bg-primary text-[#C3C3C3] mx-auto transition-all z-10 w-full group hover:text-primary after:group-hover:bg-primary py-5 after:content-[''] after:ml-[25px] after:w-full after:h-full after:rounded-l-[20px] after:absolute after:top-0 after:z-[-2] before:z-[-1] after:left-0 after:bg-white before:content-[''] before:absolute before:w-full before:h-full before:bg-primary before:rounded-l-[20px] before:top-0 before:right-0 "
                  }
                >
                  <AiFillMessage className="text-[46px] font-bold mx-auto" />
                </NavLink>
                <NavLink
                  to="/setting"
                  className={({ isActive }) =>
                    isActive
                      ? "relative navItem bg-primary text-primary  mx-auto transition-all z-10 w-full group hover:text-primary after:group-hover:bg-primary py-5 after:content-[''] after:ml-[25px] after:w-full after:h-full after:rounded-l-[20px] after:absolute after:top-0 after:z-[-2] before:z-[-1] after:left-0 after:bg-white before:content-[''] before:absolute before:w-[10px] before:h-full before:bg-primary before:rounded-l-[20px] before:top-0 before:right-0 "
                      : "relative navItem bg-primary text-[#C3C3C3] mx-auto transition-all z-10 w-full group hover:text-primary after:group-hover:bg-primary py-5 after:content-[''] after:ml-[25px] after:w-full after:h-full after:rounded-l-[20px] after:absolute after:top-0 after:z-[-2] before:z-[-1] after:left-0 after:bg-white before:content-[''] before:absolute before:w-full before:h-full before:bg-primary before:rounded-l-[20px] before:top-0 before:right-0 "
                  }
                >
                  <MdOutlineSettings className="text-[46px] font-bold mx-auto" />
                </NavLink>
              </Flex>
            </Flex>
            <div className="hidden cursor-pointer xl:block">
              <ImExit
                onClick={signoutHandler}
                className="text-[46px] hover:text-[#C3C3C3]"
              />
            </div>
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
                      to="/"
                      className={({ isActive }) =>
                        isActive
                          ? "xl:py-[22px] py-3 relative rounded-l-2xl px-10 xl:pl-[45px] xl:pr-[59px] bg-white text-primary"
                          : "xl:py-[22px] py-3 group hover:text-primary z-10 relative rounded-l-2xl px-10 xl:pl-[45px] xl:pr-[59px] bg-none hover:bg-white text-[#C3C3C3]"
                      }
                    >
                      <VscHome className="text-[46px]" />
                      <div className="absolute w-[10px] h-full xl:bg-primary bg-primary/80 b top-0 right-0 rounded-l-2xl"></div>
                    </NavLink>

                    <NavLink
                      to="/chat"
                      className={({ isActive }) =>
                        isActive
                          ? "xl:py-[22px] py-3 relative rounded-l-2xl px-10 xl:pl-[45px] xl:pr-[59px] bg-white text-primary"
                          : "xl:py-[22px] py-3 group hover:text-primary z-10 relative rounded-l-2xl px-10 xl:pl-[45px] xl:pr-[59px] bg-none hover:bg-white text-[#C3C3C3]"
                      }
                    >
                      <AiFillMessage className="text-[46px]" />
                      <div className="absolute w-[10px] h-full xl:bg-primary bg-primary/80 b top-0 right-0 rounded-l-2xl"></div>
                    </NavLink>

                    <NavLink
                      to="/setting"
                      className={({ isActive }) =>
                        isActive
                          ? "xl:py-[22px] py-3 relative rounded-l-2xl px-10 xl:pl-[45px] xl:pr-[59px] bg-white text-primary"
                          : "xl:py-[22px] py-3 group hover:text-primary z-10 relative rounded-l-2xl px-10 xl:pl-[45px] xl:pr-[59px] bg-none hover:bg-white text-[#C3C3C3]"
                      }
                    >
                      <MdOutlineSettings className="text-[46px]" />
                      <div className="absolute w-[10px] h-full xl:bg-primary bg-primary/80 b top-0 right-0 rounded-l-2xl"></div>
                    </NavLink>
                  </Flex>
                </Flex>
                <div className="xl:hidden cursor-pointer my-10">
                  <ImExit
                    onClick={signoutHandler}
                    className="text-[46px] hover:text-[#C3C3C3]"
                  />
                </div>
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
      ) : (
        <Flex className="justify-center items-center flex-col h-screen">
          <img className="w-auto" src={welcomeImg} alt="" />
          <p className="text-2xl xl:w-[400px] text-center font-semibold mt-5">
            Please Verify Your Email at this email{" "}
            <span className="font-bold">{data.email}</span>{" "}
          </p>
          <button
            onClick={signoutHandler}
            className="flex items-center mt-10 gap-x-2  cursor-pointer py-5 bg-primary text-white font-semibold rounded-[9px] text-sm px-4"
          >
            <IoArrowBack className="text-[20px]" />
            Back To Login
          </button>
        </Flex>
      )}
    </>
  );
};

export default Menubar;
