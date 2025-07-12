import React, { useEffect, useState } from "react";
import Flex from "../../layouts/Flex";
import SearchInput from "../../layouts/SearchInput";
import { BsThreeDotsVertical } from "react-icons/bs";
import Button from "../../layouts/Button";
import user from "../../assets/user.png";
import userImg1 from "../../assets/user1.png";
import userImg2 from "../../assets/user2.png";
import userImg3 from "../../assets/user3.png";
import userImg4 from "../../assets/user4.png";
import userImg5 from "../../assets/user5.png";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { useSelector } from "react-redux";
import { Bounce, toast, ToastContainer } from "react-toastify";

const UserList = () => {
  const [userList, setUserList]= useState([])
  const [friendList, setFriendList] = useState([]);
  const [sentReqList, setSentReqList]= useState([])
  const db = getDatabase();
  const data= useSelector((state)=>state.userInfo.value)
  
  // const friends = [
  //   {
  //     img: userImg1,
  //     frndName: "Friends Reunion",
  //     lastTime: "Today, 2:23pm",
  //   },
  //   {
  //     img: userImg2,
  //     frndName: "Friends Forever",
  //     lastTime: "Today, 2:23pm",
  //   },
  //   {
  //     img: userImg3,
  //     frndName: "Crazy Cousins",
  //     lastTime: "Today, 2:23pm",
  //   },
  //   {
  //     img: userImg4,
  //     frndName: "Office friend",
  //     lastTime: "Today, 2:23pm",
  //   },
  //   {
  //     img: userImg5,
  //     frndName: "Gaming friend",
  //     lastTime: "Today, 2:23pm",
  //   },
  // ];
useEffect(() => {
  const userRef = ref(db, "users/");
  onValue(userRef, (snapshot) => {
    let arr = [];

    snapshot.forEach((item) => {
      const user = item.val();
      const userId = item.key;

      // নিজের uid বাদ
      if (userId !== data.uid) {
        let isFriend = false;

        friendList.forEach((friend) => {
          if (
            (friend.senderid === userId && friend.reciverid === data.uid) ||
            (friend.reciverid === userId && friend.senderid === data.uid)
          ) {
            isFriend = true;
          }
        });

        if (!isFriend) {
          arr.push({ ...user, id: userId });
        }
      }
    });

    setUserList(arr);
  });
}, [friendList]);

    useEffect(() => {
      const requestRef = ref(db, "friendList/");
      onValue(requestRef, (snapshot) => {
        let arr = [];
        snapshot.forEach((friend) => {
          if (friend.val().reciverid === data.uid) {
            arr.push(friend.val());
          }
          setFriendList(arr);
        });
      });
    }, []);

const handleRequest= (item)=>{
  if (sentReqList.includes(item.userid)) {
    toast.warning("Friend Request Already Sent");
  }else{
    const uniqueId= data.uid+item.userid
          set(ref(db, 'friendRequest/' + uniqueId), {
            senderid: data.uid,
            sendername: data.displayName,
            reciverid:item.userid,
            recivername: item.username,
          });
          toast.success("Friend Request Sent");
  }
  }
useEffect(()=>{
  const reqRef = ref(db, 'friendRequest/');
onValue(reqRef, (snapshot)=>{
  let sentReqArr= []
snapshot.forEach((item)=>{
const request = item.val();
if (request.senderid == data.uid) {
  sentReqArr.push(request.reciverid);
}
})
setSentReqList(sentReqArr)
})

}, [])

  return (
    <div className="xl:w-[30%] w-full shadow-shadow h-[50%] rounded-[20px] px-[20px] font-poppins py-[20px]">
        <ToastContainer
          position="top-right"
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
      <Flex className="justify-between items-center mb-2">
        <h3 className="text-[20px] font-semibold text-black">Users</h3>
        <BsThreeDotsVertical />
      </Flex>

      <SearchInput />

      <div className="overflow-y-auto h-[70%]">
        {userList.map((friend, idx) => (
          <Flex
            key={idx}
            className="py-[10px] border-b-2 border-gray-300 items-center justify-between"
          >
            <Flex className="gap-x-[14px] w-[75%] items-center justify-start">
              <div>
                <img
                  src={user}
                  className="avatar border w-[52px] h-[52px] rounded-full"
                  alt=""
                />
              </div>

              <div className="w-[60%]">
                <h3 className="text-[14px] font-semibold text-black truncate w-full">
                  {friend.username}
                </h3>
                <p className="text-[10px] text-black/50 truncate w-full">
                  {friend.email}
                </p>
              </div>
            </Flex>
          {
            sentReqList.includes(friend.userid) ? (<Button onClick={()=>handleRequest(friend)} className="text-[14px] !text-black bg-white border">-</Button>):(<Button onClick={()=>handleRequest(friend)} className="text-[14px]">+</Button>)
          }
            
          </Flex>
        ))}
      </div>
    </div>
  );
};

export default UserList;
