import React from 'react'
import { FiSearch } from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";

const SearchInput = () => {
  return (
    <div className='w-auto mb-3 relative'>
      <input type="text" className='w-full rounded-[20px] shadow-shadow pr-10 pl-[68px] py-[18px] outline-none font-poppins' placeholder='Search' />
<FiSearch className='absolute text-[19px] font-semibold top-[50%] translate-y-[-50%] left-[23px]'/>
<BsThreeDotsVertical className='absolute text-[19px] font-semibold top-[50%] translate-y-[-50%] right-[22px]'/>
    </div>
  )
}

export default SearchInput