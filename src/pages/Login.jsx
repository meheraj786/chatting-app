import React, { useState } from "react";
import Flex from "../layouts/Flex";
import image from "../assets/registerImg.png";
import { LuEyeClosed } from "react-icons/lu";
import { LuEye } from "react-icons/lu";
import { Link, useNavigate } from "react-router";
import { FcGoogle } from "react-icons/fc";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PulseLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { userInfo } from "../features/user/userSlice";

const Login = () => {
  const dispatch= useDispatch()
  const navigate = useNavigate();
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [passShow, setPassShow] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleGoogleLogin = () => {
    console.log("google button clicked");

    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result);
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Something Went Wrong!")
      });
  };
  const emailHandler = (e) => {
    setEmail(e.target.value);
    setEmailErr("");
    
  };
  const passwordHandler = (e) => {
    setPassword(e.target.value);
    setPasswordErr("");
  };
  const submitHandler = () => {
    if (!email) {
      setEmailErr("Enter Your Email");
    }
    if (!emailRegex.test(email)) {
      setEmailErr("Invalid email format");
    }
    if (!password) {
      setPasswordErr("Enter a Password");
    } else if (password.length < 6) {
      setPasswordErr("Password must be at least 6 characters long.");
    } else if (!/[a-z]/.test(password)) {
      setPasswordErr("Password must contain at least one lowercase letter.");
    } else if (!/[A-Z]/.test(password)) {
      setPasswordErr("Password must contain at least one uppercase letter.");
    } else if (!/\d/.test(password)) {
      setPasswordErr("Password must contain at least one number.");
    } else if (!/[\W_]/.test(password)) {
      setPasswordErr("Password must contain at least one special character.");
    }
    if (
      email &&
      password &&
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,}$/.test(password)
    ) {
      setLoading(true);
      signInWithEmailAndPassword(auth, email, password)
        .then((user) => {
          console.log(user.user.emailVerified);
            toast.success("Login Done");
            setEmail("");
            setPassword("");
            setLoading(false);
            dispatch(userInfo(user.user))
            localStorage.setItem("userInfo", JSON.stringify(user.user))
            setTimeout(() => {
              navigate("/");
            }, 2000);
        })

        .catch((error) => {
          if (error.message.includes("auth/email-already-in-use")) {
            setEmailErr("This email already exist");
          }
          if (error.message.includes("auth/invalid-credential")) {
            toast.error("Invalid Inputs");
          }
          console.log("auth error: " + error);
          setLoading(false);
        });
    }
  };
  return (
    <>
      <Flex>
        <ToastContainer
          position="top-center"
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
        <Flex className="left flex-col mx-auto xl:mx-0 items-end justify-center  font-primary p-10 xl:p-0 xl:w-[55%] xl:pr-[250px]">
          <div>
            <h1 className="font-bold text-4xl text-secondary">
              Login to your account!
            </h1>
            <button onClick={handleGoogleLogin}>
            <Flex
              onClick={handleGoogleLogin}
              className="google cursor-pointer gap-2 mt-[30px] items-baseline py-[23px] text-[14px] font-secondary text-secondary font-semibold justify-center w-[221px] rounded-[16px] border border-gray-300"
            >
              <FcGoogle className="text-xl" />
              <p>Loging with Google</p>
            </Flex>

            </button>
            <div className="relative mt-[32px]">
              <input
                type="text"
                value={email}
                onChange={emailHandler}
                id="floating_outlined"
                className="block w-full px-[26px] py-[26px] xl:w-[368px] text-xl text-secondary font-semibold bg-transparent rounded-lg border-0 border-b-2 border-gray-300 appearance-none   focus:outline-none focus:ring-0 focus:border-secondary/30 peer"
                placeholder=" "
              />
              <label
                for="floating_outlined"
                className="absolute text-sm text-secondary/70 duration-300 transform  top-2 z-10 origin-[0] bg-white  -translate-y-4 px-4 peer-focus:px-4 peer-focus:text-secondary/70  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2  peer-focus:-translate-y-4 rtl:peer-focus:translate-x-2/5 rtl:peer-focus:left-auto start-4"
              >
                Email Address
              </label>
            </div>
            <p className="text-red-500 mx-2">{emailErr}</p>

            <div className="relative mt-[32px]">
              <input
                type={passShow ? "text" : "password"}
                value={password}
                onChange={passwordHandler}
                id="floating_outlined3"
                className="block w-full px-[26px] xl:w-[368px] py-[26px]  text-xl text-secondary font-semibold bg-transparent rounded-lg border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-secondary/30 peer"
                placeholder=" "
              />
              {passShow ? (
                <LuEye
                  onClick={() => setPassShow(!passShow)}
                  className="text-2xl absolute top-1/2 -translate-y-1/2 cursor-pointer right-5 xl:right-[10%] text-primary"
                />
              ) : (
                <LuEyeClosed
                  onClick={() => setPassShow(!passShow)}
                  className="text-2xl cursor-pointer absolute top-1/2 -translate-y-1/2 right-5 xl:right-[10%] text-primary"
                />
              )}

              <label
                for="floating_outlined3"
                className="absolute text-sm duration-300 transform text-secondary/70 top-2 -translate-y-4 z-10 origin-[0] bg-white  px-4 peer-focus:px-4 peer-focus:text-secondary/70  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2  peer-focus:-translate-y-4 rtl:peer-focus:translate-x-2/5 rtl:peer-focus:left-auto start-4"
              >
                Password
              </label>
            </div>
            <p className="text-red-500 xl:w-[368px] mx-2">{passwordErr}</p>
            <button
              onClick={submitHandler}
              className="xl:w-[368px] w-full cursor-pointer py-5 bg-primary text-white font-semibold mt-[51px] mb-[35px] rounded-[9px] text-xl"
            >
              {loading ? <PulseLoader color="white" /> : "Login to Continue"}
            </button>
            <p className="xl:w-[368px] font-secondary mb-2 text-left text-[14px] text-primary">
              Don’t have an account ?{" "}
              <Link
                to="/registration"
                className="text-[#EA6C00] cursor-pointer"
              >
                Sign up
              </Link>
            </p>
            <Link
              to="/forgotpassword"
              className="xl:w-[368px] font-secondary text-left text-[14px] text-red-500"
            >
              Forgot Password?
            </Link>
          </div>
        </Flex>

        <div className="right xl:xl:w-[45%] object-cover h-screen">
          <img className="xl:w-full object-cover h-full" src={image} alt="" />
        </div>
      </Flex>
    </>
  );
};

export default Login;
