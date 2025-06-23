import React, { useState } from 'react'
import Flex from "../layouts/Flex";
import image from "../assets/registerImg.png";
import { LuEyeClosed } from "react-icons/lu";
import { LuEye } from "react-icons/lu";
import { Link } from 'react-router';

const Registration = () => {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [emailErr, setEmailErr] = useState("");
  const [fullNameErr, setFullNameErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [passShow, setPassShow]= useState(false)

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const emailHandler = (e) => {
    setEmail(e.target.value);
    setEmailErr("");
  };
  const fullNameHandler = (e) => {
    setFullName(e.target.value);
    setFullNameErr("");
  };
  const passwordHandler = (e) => {
    setPassword(e.target.value);
    setPasswordErr("");
  };
  const submitHandler = () => {
    console.log(email + fullName + password);
    if (!email) {
      setEmailErr("Enter Your Email");
    }
    if (!fullName) {
      setFullNameErr("Enter Your Full Name");
    }
    if (!password) {
      setPasswordErr("Enter a Password");
    }
    if (!emailRegex.test(email)) {
      setEmailErr("Invalid email format");
    }
    if (!password) {
      setPasswordErr("Enter a Password");
    }
    if (password.length < 8) {
      setPasswordErr("Password must be at least 8 characters long.");
    }

    if (!/[a-z]/.test(password)) {
      setPasswordErr("Password must contain at least one lowercase letter.");
    }

    if (!/[A-Z]/.test(password)) {
      setPasswordErr("Password must contain at least one uppercase letter.");
    }

    if (!/\d/.test(password)) {
      setPasswordErr("Password must contain at least one number.");
    }

    if (!/[\W_]/.test(password)) {
      setPasswordErr("Password must contain at least one special character.");
    }
  };
  return (
        <>
      <Flex>
        <Flex className="left flex-col mx-auto xl:mx-0 items-end justify-center  font-primary p-10 xl:p-0 xl:w-[55%] xl:pr-[169px]">
          <div>
            <h1 className="font-bold text-4xl text-secondary">
              Get started with easily register
            </h1>
            <p className="mt-[13px] text-xl mb-10 text-primary/50">
              Free register and you can enjoy it
            </p>
            <div className="relative">
              <input
                type="text"
                onChange={emailHandler}
                id="floating_outlined"
                className="block w-full px-[26px] py-[26px] xl:w-[368px] text-xl text-secondary font-semibold bg-transparent rounded-lg border-1 border-gray-300 appearance-none   focus:outline-none focus:ring-0 focus:border-secondary/30 peer"
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
                type="text"
                onChange={fullNameHandler}
                id="floating_outlined2"
                className="block w-full px-[26px] py-[26px] xl:w-[368px] text-xl text-secondary font-semibold bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-secondary/30 peer"
                placeholder=""
              />
              <label
                for="floating_outlined2"
                className="absolute text-sm text-secondary/70 duration-300 transform  -translate-y-4 top-2 z-10 origin-[0] bg-white  px-4 peer-focus:px-4 peer-focus:text-secondary/70  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2  peer-focus:-translate-y-4 rtl:peer-focus:translate-x-2/5 rtl:peer-focus:left-auto start-4"
              >
                Full Name
              </label>
            </div>
            <p className="text-red-500 mx-2">{fullNameErr}</p>
            <div className="relative mt-[32px]">
              <input
                type={passShow ? "text": "password"}
                onChange={passwordHandler}
                id="floating_outlined3"
                className="block w-full px-[26px] xl:w-[368px] py-[26px]  text-xl text-secondary font-semibold bg-transparent rounded-lg border-1 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-secondary/30 peer"
                placeholder=" "
              />
              {
                passShow ? <LuEye onClick={()=> setPassShow(!passShow)} className="text-2xl absolute top-1/2 -translate-y-1/2 cursor-pointer right-5 xl:right-[35%] text-primary" />
 : <LuEyeClosed onClick={()=> setPassShow(!passShow)} className="text-2xl cursor-pointer absolute top-1/2 -translate-y-1/2 right-5 xl:right-[35%] text-primary" />
              }

              <label
                for="floating_outlined3"
                className="absolute text-sm duration-300 transform text-secondary/70 top-2 -translate-y-4 z-10 origin-[0] bg-white  px-4 peer-focus:px-4 peer-focus:text-secondary/70  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2  peer-focus:-translate-y-4 rtl:peer-focus:translate-x-2/5 rtl:peer-focus:left-auto start-4"
              >
                Password
              </label>
            </div>
            <p className="text-red-500 mx-2">{passwordErr}</p>
            <button
              onClick={submitHandler}
              className="xl:w-[368px] w-full cursor-pointer py-5 bg-primary text-white font-semibold mt-[51px] mb-[35px] rounded-[86px] text-xl"
            >
              Sign Up
            </button>
            <p className="xl:w-[368px] font-secondary text-center text-[14px] text-primary">
              Already have an account ?{" "}
              <Link to="/login" className="text-[#EA6C00] cursor-pointer">Sign In</Link>
            </p>
          </div>
        </Flex>

        <div className="right xl:xl:w-[45%] object-cover h-screen">
          <img className="xl:w-full object-cover h-full" src={image} alt="" />
        </div>
      </Flex>
    </>
  )
}

export default Registration