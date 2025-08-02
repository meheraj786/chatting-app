import React, { useEffect, useState } from "react";
import Flex from "../../layouts/Flex";
import { Link, NavLink, Outlet, useNavigate } from "react-router";
import { VscHome } from "react-icons/vsc";
import { AiFillMessage } from "react-icons/ai";
import { MdOutlineNotifications, MdOutlineSettings } from "react-icons/md";
import { useDispatch } from "react-redux";
import { GrLogout } from "react-icons/gr";
import { FaCloudUploadAlt } from "react-icons/fa";
import { IoArrowBack, IoMenu, IoReload } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import welcomeImg from "../../assets/welcomeImg.png";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useSelector } from "react-redux";
import { HashLoader } from "react-spinners";
import { ImExit } from "react-icons/im";
import { signOut } from "firebase/auth";
import dp from "../../assets/dp.png";
import { userInfo } from "../../features/user/userSlice";
import { getDatabase, onValue, ref } from "firebase/database";
import LetterAvatar from "../../layouts/LetterAvatar";

const Menubar = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const db = getDatabase();
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);
  const [verify, setVerify] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState([]);
  const [msgNotification, setMsgNotification] = useState([]);
  const data = useSelector((state) => state.userInfo.value);

  useEffect(() => {
    if (!data) {
      navigate("/registration");
    }
  }, []);

  const handleReload = () => {
    window.location.reload();
  };

  useEffect(() => {
    const notificationRef = ref(db, "notification/");
    onValue(notificationRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const notification = item.val();

        if (notification.notifyReciver == data?.uid) {
          arr.push({
            id: item.key,
            ...notification,
          });
        }
      });
      setNotification(arr);
    });
  }, []);
  
  useEffect(() => {
    const notificationRef = ref(db, "messagenotification/");
    onValue(notificationRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((item) => {
        const notification = item.val();

        if (notification.reciverid == data.uid) {
          arr.push({
            id: item.key,
            ...notification,
          });
        }
      });
      setMsgNotification(arr);
    });
  }, [data?.uid, db]);

  onAuthStateChanged(auth, (user) => {
    if (data) {
      if (user && user.emailVerified) {
        setVerify(true);
      } else {
        setVerify(false);
      }
      setLoading(false);
    }
  });

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

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (show && !event.target.closest('.mobile-sidebar')) {
        setShow(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show]);

  if (loading) {
    return (
      <Flex className="justify-center items-center h-screen">
        <HashLoader size={100} />
      </Flex>
    );
  }

  return (
    <>
      {verify ? (
        <Flex className="xl:justify-between justify-between w-full items-start gap-x-7 relative">
          {/* Desktop Sidebar */}
          <Flex className="flex-col fixed xl:static left-0 top-0 xl:justify-between xl:w-[186px] z-[9999] xl:z-auto text-white xl:h-[95vh] xl:bg-primary bg-primary/95 backdrop-blur-lg xl:mt-[35px] py-[30px] xl:pt-[35px] min-w-[100px] xl:pb-[47px] xl:ml-[32px] rounded-none xl:rounded-[20px] h-full  w-full transform xl:transform-none transition-transform duration-300 ease-in-out hidden xl:flex">
            <Flex className="flex-col w-full gap-y-[78px]">
              <div>
                <div className="relative group">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-500/40 rounded-full z-[555] w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <FaCloudUploadAlt className="text-white text-[25px]" />
                  </div>
                  <LetterAvatar className="w-[100px] h-[100px] !text-4xl mx-auto">
                    {data.displayName.charAt(0)}
                  </LetterAvatar>
                </div>
                <p className="text-white text-center font-primary font-bold mt-3">
                  {data.displayName}
                </p>
              </div>
              <Flex className="flex-col w-full gap-y-7">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? "relative navItem bg-primary text-primary mx-auto transition-all z-10 w-full group hover:text-primary after:group-hover:bg-primary py-5 after:content-[''] after:ml-[25px] after:w-full after:h-full after:rounded-l-[20px] after:absolute after:top-0 after:z-[-2] before:z-[-1] after:left-0 after:bg-white before:content-[''] before:absolute before:w-[10px] before:h-full before:bg-primary before:rounded-l-[20px] before:top-0 before:right-0"
                      : "relative navItem bg-primary text-[#C3C3C3] mx-auto transition-all z-10 w-full group hover:text-primary after:group-hover:bg-primary py-5 after:content-[''] after:ml-[25px] after:w-full after:h-full after:rounded-l-[20px] after:absolute after:top-0 after:z-[-2] before:z-[-1] after:left-0 after:bg-white before:content-[''] before:absolute before:w-full before:h-full before:bg-primary before:rounded-l-[20px] before:top-0 before:right-0"
                  }
                >
                  <VscHome className="text-[46px] font-bold mx-auto" />
                </NavLink>

                <NavLink
                  to="/chat"
                  className={({ isActive }) =>
                    isActive
                      ? "relative navItem bg-primary text-primary mx-auto transition-all z-10 w-full group hover:text-primary after:group-hover:bg-primary py-5 after:content-[''] after:ml-[25px] after:w-full after:h-full after:rounded-l-[20px] after:absolute after:top-0 after:z-[-2] before:z-[-1] after:left-0 after:bg-white before:content-[''] before:absolute before:w-[10px] before:h-full before:bg-primary before:rounded-l-[20px] before:top-0 before:right-0"
                      : "relative navItem bg-primary text-[#C3C3C3] mx-auto transition-all z-10 w-full group hover:text-primary after:group-hover:bg-primary py-5 after:content-[''] after:ml-[25px] after:w-full after:h-full after:rounded-l-[20px] after:absolute after:top-0 after:z-[-2] before:z-[-1] after:left-0 after:bg-white before:content-[''] before:absolute before:w-full before:h-full before:bg-primary before:rounded-l-[20px] before:top-0 before:right-0"
                  }
                >
                  {msgNotification.length > 0 && (
                    <span className="w-5 h-5 flex justify-center items-center bg-red-600 text-white rounded-full absolute top-1 left-7 text-[12px] z-10">
                      {msgNotification.length}
                    </span>
                  )}
                  <AiFillMessage className="text-[46px] font-bold mx-auto" />
                </NavLink>

                <NavLink
                  to="/notification"
                  className={({ isActive }) =>
                    isActive
                      ? "relative navItem bg-primary text-primary mx-auto transition-all z-10 w-full group hover:text-primary after:group-hover:bg-primary py-5 after:content-[''] after:ml-[25px] after:w-full after:h-full after:rounded-l-[20px] after:absolute after:top-0 after:z-[-2] before:z-[-1] after:left-0 after:bg-white before:content-[''] before:absolute before:w-[10px] before:h-full before:bg-primary before:rounded-l-[20px] before:top-0 before:right-0"
                      : "relative navItem bg-primary text-[#C3C3C3] mx-auto transition-all z-10 w-full group hover:text-primary after:group-hover:bg-primary py-5 after:content-[''] after:ml-[25px] after:w-full after:h-full after:rounded-l-[20px] after:absolute after:top-0 after:z-[-2] before:z-[-1] after:left-0 after:bg-white before:content-[''] before:absolute before:w-full before:h-full before:bg-primary before:rounded-l-[20px] before:top-0 before:right-0"
                  }
                >
                  <MdOutlineNotifications className="text-[46px] font-bold mx-auto" />
                  {notification.length > 0 && (
                    <span className="w-5 h-5 flex justify-center items-center bg-red-600 text-white rounded-full absolute top-1 left-7 text-[12px] z-10">
                      {notification.length}
                    </span>
                  )}
                </NavLink>

                <NavLink
                  to="/setting"
                  className={({ isActive }) =>
                    isActive
                      ? "relative navItem bg-primary text-primary mx-auto transition-all z-10 w-full group hover:text-primary after:group-hover:bg-primary py-5 after:content-[''] after:ml-[25px] after:w-full after:h-full after:rounded-l-[20px] after:absolute after:top-0 after:z-[-2] before:z-[-1] after:left-0 after:bg-white before:content-[''] before:absolute before:w-[10px] before:h-full before:bg-primary before:rounded-l-[20px] before:top-0 before:right-0"
                      : "relative navItem bg-primary text-[#C3C3C3] mx-auto transition-all z-10 w-full group hover:text-primary after:group-hover:bg-primary py-5 after:content-[''] after:ml-[25px] after:w-full after:h-full after:rounded-l-[20px] after:absolute after:top-0 after:z-[-2] before:z-[-1] after:left-0 after:bg-white before:content-[''] before:absolute before:w-full before:h-full before:bg-primary before:rounded-l-[20px] before:top-0 before:right-0"
                  }
                >
                  <MdOutlineSettings className="text-[46px] font-bold mx-auto" />
                </NavLink>
              </Flex>
            </Flex>
            <div className="cursor-pointer">
              <ImExit
                onClick={signoutHandler}
                className="text-[46px] hover:text-[#C3C3C3] transition-colors"
              />
            </div>
          </Flex>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShow(!show)}
            className="xl:hidden fixed top-4 left-4 z-[10000] bg-primary text-white p-3 rounded-full shadow-lg"
          >
            {show ? (
              <RxCross2 className="text-[24px]" />
            ) : (
              <IoMenu className="text-[24px]" />
            )}
          </button>

          {/* Mobile Sidebar Overlay */}
          {show && (
            <div className="xl:hidden fixed inset-0 bg-black/50 z-[9998]" onClick={() => setShow(false)} />
          )}

          {/* Mobile Sidebar */}
          <Flex className={`mobile-sidebar flex-col fixed xl:hidden left-0 top-0 justify-between w-[280px] sm:w-[320px] z-[9999] text-white h-full bg-primary/95 backdrop-blur-lg py-[30px] pt-[80px] px-6 transform transition-transform duration-300 ease-in-out ${
            show ? 'translate-x-0' : '-translate-x-full'
          }`}>
            <Flex className="flex-col w-full gap-y-[50px]">
              <div className="text-center">
                <div className="relative group mx-auto w-fit">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-500/40 rounded-full z-[555] w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <FaCloudUploadAlt className="text-white text-[25px]" />
                  </div>
                  <LetterAvatar className="w-[80px] h-[80px] !text-3xl">
                    {data.displayName.charAt(0)}
                  </LetterAvatar>
                </div>
                <p className="text-white text-center font-primary font-bold mt-3 text-lg">
                  {data.displayName}
                </p>
              </div>
              
              <Flex className="flex-col w-full gap-y-4">
                <NavLink
                  to="/"
                  onClick={() => setShow(false)}
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center gap-4 py-4 px-4 rounded-lg bg-white text-primary font-medium transition-all"
                      : "flex items-center gap-4 py-4 px-4 rounded-lg text-[#C3C3C3] hover:bg-white/10 hover:text-white font-medium transition-all"
                  }
                >
                  <VscHome className="text-[28px]" />
                  <span className="text-base">Home</span>
                </NavLink>

                <NavLink
                  to="/chat"
                  onClick={() => setShow(false)}
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center gap-4 py-4 px-4 rounded-lg bg-white text-primary font-medium transition-all relative"
                      : "flex items-center gap-4 py-4 px-4 rounded-lg text-[#C3C3C3] hover:bg-white/10 hover:text-white font-medium transition-all relative"
                  }
                >
                  <div className="relative">
                    <AiFillMessage className="text-[28px]" />
                    {msgNotification.length > 0 && (
                      <span className="w-5 h-5 flex justify-center items-center bg-red-600 text-white rounded-full absolute -top-1 -right-1 text-[12px]">
                        {msgNotification.length}
                      </span>
                    )}
                  </div>
                  <span className="text-base">Messages</span>
                </NavLink>

                <NavLink
                  to="/notification"
                  onClick={() => setShow(false)}
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center gap-4 py-4 px-4 rounded-lg bg-white text-primary font-medium transition-all relative"
                      : "flex items-center gap-4 py-4 px-4 rounded-lg text-[#C3C3C3] hover:bg-white/10 hover:text-white font-medium transition-all relative"
                  }
                >
                  <div className="relative">
                    <MdOutlineNotifications className="text-[28px]" />
                    {notification.length > 0 && (
                      <span className="w-5 h-5 flex justify-center items-center bg-red-600 text-white rounded-full absolute -top-1 -right-1 text-[12px]">
                        {notification.length}
                      </span>
                    )}
                  </div>
                  <span className="text-base">Notifications</span>
                </NavLink>

                <NavLink
                  to="/setting"
                  onClick={() => setShow(false)}
                  className={({ isActive }) =>
                    isActive
                      ? "flex items-center gap-4 py-4 px-4 rounded-lg bg-white text-primary font-medium transition-all"
                      : "flex items-center gap-4 py-4 px-4 rounded-lg text-[#C3C3C3] hover:bg-white/10 hover:text-white font-medium transition-all"
                  }
                >
                  <MdOutlineSettings className="text-[28px]" />
                  <span className="text-base">Settings</span>
                </NavLink>
              </Flex>
            </Flex>
            
            <button
              onClick={signoutHandler}
              className="flex items-center gap-4 py-4 px-4 rounded-lg text-[#C3C3C3] hover:bg-red-500/20 hover:text-red-400 font-medium transition-all w-full"
            >
              <ImExit className="text-[28px]" />
              <span className="text-base">Logout</span>
            </button>
          </Flex>

          {/* Main Content */}
          <div className="flex-2 me-auto xl:ml-0 ">
            <Outlet />
          </div>
        </Flex>
      ) : (
        <Flex className="justify-center items-center flex-col h-screen px-4">
          <div className="max-w-md w-full text-center">
            <img className="w-auto mx-auto max-w-full" src={welcomeImg} alt="Welcome" />
            <p className="text-xl sm:text-2xl text-center font-semibold mt-5 px-4">
              Please Verify Your Email at this email{" "}
              <span className="font-bold break-words">{data?.email}</span>
            </p>
            <Flex className="gap-x-3 flex-col sm:flex-row gap-y-3 sm:gap-y-0 justify-center">
              <button
                onClick={signoutHandler}
                className="flex items-center justify-center mt-6 sm:mt-10 gap-x-2 cursor-pointer py-4 bg-primary text-white font-semibold rounded-[9px] text-sm px-6 w-full sm:w-auto"
              >
                <IoArrowBack className="text-[20px]" />
                Back To Login
              </button>
              <button
                onClick={handleReload}
                className="flex items-center justify-center mt-3 sm:mt-10 gap-x-2 cursor-pointer py-4 bg-primary text-white font-semibold rounded-[9px] text-sm px-6 w-full sm:w-auto"
              >
                <IoReload className="text-[20px]" />
                Reload
              </button>
            </Flex>
          </div>
        </Flex>
      )}
    </>
  );
};

export default Menubar;