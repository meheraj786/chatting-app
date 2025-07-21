import React, { useEffect, useState } from 'react'
import Flex from '../../layouts/Flex'
import SearchInput from '../../layouts/SearchInput'
import { BsThreeDotsVertical } from 'react-icons/bs'
import groupImg from '../../assets/groupImg.png'
import grpImg1 from '../../assets/grpImg1.png'
import grpImg2 from '../../assets/grpImg2.png'
import grpImg3 from '../../assets/grpImg3.png'
import grpImg4 from '../../assets/grpImg4.jpg'
import { getDatabase, onValue, ref, remove } from 'firebase/database'
import { useSelector } from 'react-redux'
import UserSkeleton from '../skeleton/UserSkeleton'
import Button from '../../layouts/Button'
import { Bounce, toast, ToastContainer } from 'react-toastify'

const MyGroups = () => {
  const db=getDatabase()
  const [groups, setGroups]= useState([])
  const [groupListLoading, setGroupListLoading]=useState(true)
  const data = useSelector((state) => state.userInfo.value);

    useEffect(() => {
      const groupList = ref(db, "grouplist/");
      onValue(groupList, (snapshot) => {
        let arr = [];
        snapshot.forEach((group) => {
          const groupItem= group.val()
          const groupId=group.key
          if (groupItem.creatorId==data.uid) {
            arr.push({...groupItem, id:groupId});
          }
        });
        setGroups(arr);
        setGroupListLoading(false);
      });
    }, []);

    const deleteHandler=(id)=>{
      remove(ref(db, "grouplist/" + id));
      toast.success("Group Created");

    }

  // const myGrp = [
  //   {
  //     img: grpImg1,
  //     frndName: "Friends Reunion",
  //     lastMsg: "Hi Guys, Wassup!",
  //     lastTime: "Today, 2:23pm"
  //   },
  //   {
  //     img: grpImg2,
  //     frndName: "Friends Forever",
  //     lastMsg: "Good to see you",
  //     lastTime: "Today, 2:23pm"
  //   },
  //   {
  //     img: grpImg3,
  //     frndName: "Crazy Cousins",
  //     lastMsg: "What plans today?",
  //     lastTime: "Today, 2:23pm"
  //   },
  //   {
  //     img: grpImg4,
  //     frndName: "Office friend",
  //     lastMsg: "Join the meeting",
  //     lastTime: "Today, 2:23pm"
  //   },
  // ];

  return (
    <div className='xl:w-[30%] w-full shadow-shadow h-[50%] rounded-[20px] px-[20px] font-poppins py-[20px]'>
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
        <h3 className='text-[20px] font-semibold text-black'>My Groups</h3>
        <BsThreeDotsVertical />
      </Flex>

      {/* <SearchInput /> */}

      <div className='overflow-y-auto h-[90%]'>
        {
          groupListLoading ? <>
          <UserSkeleton/>
          <UserSkeleton/>
          </> : groups.map((group, idx) => (
            <Flex key={idx} className="py-[10px] border-b-2 border-gray-300 items-center justify-between">
              <Flex className="gap-x-[14px] w-[75%] items-center justify-start">
                <div

                >
                  <img src={groupImg}  className='avatar w-[52px] h-[52px] rounded-full' alt="" />
                </div>

                <div className="w-[60%]">
                  <h3 className='text-[14px] font-semibold text-black truncate w-full'>{group.groupName}</h3>
                  <p className='font-medium text-[12px] text-[#4D4D4D]/75 truncate w-full'></p>
                </div>
              </Flex>

            <Button onClick={()=>deleteHandler(group.id)}>Delete</Button>
            </Flex>
          ))
        }
        
      </div>
    </div>
  );
}

export default MyGroups;
