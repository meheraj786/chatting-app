import React, { useEffect, useState } from 'react'
import Flex from '../../layouts/Flex'
import SearchInput from '../../layouts/SearchInput'
import { BsThreeDotsVertical } from 'react-icons/bs'
import Button from '../../layouts/Button'
import grpImg1 from '../../assets/grpImg1.png'
import grpImg from '../../assets/groupImg.png'
import grpImg2 from '../../assets/grpImg2.png'
import grpImg3 from '../../assets/grpImg3.png'
import grpImg4 from '../../assets/grpImg4.jpg'
import grpImg5 from '../../assets/grpImg5.jpg'
import { useSelector } from 'react-redux'
import { getDatabase, onValue, push, ref, set } from 'firebase/database'
import { toast } from 'react-toastify'
import UserSkeleton from '../skeleton/UserSkeleton'

const GroupList = () => {
  const db= getDatabase()
  const [createGroup, setCreateGroup]=useState(false)
    const data = useSelector((state) => state.userInfo.value);
    const [groups, setGroups]=useState([])
    const [groupListLoading, setGroupListLoading]=useState(true)
  const [groupName, setGroupName]=useState("")
  // const groups = [
  //   {
  //     img: grpImg1,
  //     grpName: "Friends Reunion",
  //     lastMsg: "Hi Guys, Wassup!"
  //   },
  //   {
  //     img: grpImg2,
  //     grpName: "Friends Forever",
  //     lastMsg: "Good to see you"
  //   },
  //   {
  //     img: grpImg3,
  //     grpName: "Crazy Cousins",
  //     lastMsg: "What plans today?"
  //   },
  //   {
  //     img: grpImg4,
  //     grpName: "Office Group",
  //     lastMsg: "Join the meeting"
  //   },
  //   {
  //     img: grpImg5,
  //     grpName: "Gaming Group",
  //     lastMsg: "Let's play"
  //   },
  // ];
  const createGroupHandler=()=>{
    set(push(ref(db, "grouplist/")), {
          groupName: groupName,
          creatorId: data.uid
        });
        setGroupName("")
        setCreateGroup(false)
        toast.success("Group Created");
  }

    useEffect(() => {
      const groupList = ref(db, "grouplist/");
      onValue(groupList, (snapshot) => {
        let arr = [];
        snapshot.forEach((group) => {
          const groupItem= group.val()
          const groupId=group.key
          arr.push({...groupItem, id:groupId});
        });
        setGroups(arr);
        setGroupListLoading(false);
      });
    }, []);
    

  return (
    <div className='xl:w-[36%] w-full shadow-shadow h-[50%] rounded-[20px] px-[20px] font-poppins py-[20px]'>
      {
        createGroup && <div className='absolute  top-1/2 left-1/2 -translate-1/2 flex justify-center items-center w-full z-[9999] h-full bg-gray-200/10 backdrop-blur-[3px]'>
          <div className=' w-1/2 flex flex-col justify-center items-center h-1/2 relative bg-white shadow-2xl'> 
            <span onClick={()=>setCreateGroup(false)} className="absolute font-semibold text-[22px] cursor-pointer right-10 top-10">X</span>
          <div className="relative ">
          <input
            type="text"
            value={groupName}
            onChange={(e)=>setGroupName(e.target.value)}
            id="floating_outlined"
            className="block w-full px-[26px] py-[26px] xl:w-[368px] text-xl text-secondary font-semibold bg-transparent rounded-lg border-0 border-b-2 border-gray-300 appearance-none   focus:outline-none focus:ring-0 focus:border-secondary/30 peer"
            placeholder=" "
          />
          <label
            for="floating_outlined"
            className="absolute text-sm text-secondary/70 duration-300 transform  top-2 z-10 origin-[0] bg-white  -translate-y-4 px-4 peer-focus:px-4 peer-focus:text-secondary/70  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2  peer-focus:-translate-y-4 rtl:peer-focus:translate-x-2/5 rtl:peer-focus:left-auto start-4"
          >
            Group Name
          </label>
        </div>
<Button onClick={createGroupHandler} className="mt-10">Create Group</Button>
          
          </div>
        </div>
      }
      <Flex className="justify-between items-center mb-2">
        <h3 className='text-[20px] font-semibold text-black'>Group List</h3>
        {/* <BsThreeDotsVertical /> */}
        <Button onClick={()=>setCreateGroup(true)} >Create Group</Button>
      </Flex>

      {/* <SearchInput /> */}
      <div className='overflow-y-auto h-[90%]'>
        {
          groupListLoading ? <>
          <UserSkeleton/>
          <UserSkeleton/>
          <UserSkeleton/>
          </> : groups.map((group, i) => (
            <Flex key={i} className="py-[13px] border-b-2 border-gray-300 items-center justify-between">
              <Flex className="gap-x-[14px] w-[70%] items-center justify-start">
                <div

                >
                                    <img src={grpImg}  className='avatar border w-[70px] h-[70px]  rounded-full' alt="" />
                </div>

                <div className="w-[60%]">
                  <h3 className='text-[20px] font-semibold text-black truncate w-full'>{group.groupName}</h3>
                  <p className='font-medium text-[14px] text-[#4D4D4D]/75 truncate w-full'>{group.lastMsg}</p>
                </div>
              </Flex>

              <Button className="px-[22px] text-[14px]">Join</Button>
            </Flex>
          ))
        }
      </div>
    </div>
  );
}

export default GroupList;
