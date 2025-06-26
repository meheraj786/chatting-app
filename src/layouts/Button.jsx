import React from 'react'

const Button = ({children, className}) => {
  return (
    <button
    className={`px-2 bg-primary text-[20px] text-white font-semibold font-poppins rounded-[5px] ${className}`}
    >{children}</button>
  )
}

export default Button