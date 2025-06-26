import React from 'react'

const Button = ({children, className}) => {
  return (
<button className={`relative group overflow-hidden px-2 bg-primary text-white text-[20px] font-semibold font-poppins rounded-[5px] border border-primary cursor-pointer hover:text-primary ${className}`}>
  <span className="relative z-10">{children}</span>
  <span className="absolute right-0 top-0 h-full w-0 bg-white z-0 group-hover:w-full transition-all duration-300 ease-in-out"></span>
</button>
  )
}

export default Button