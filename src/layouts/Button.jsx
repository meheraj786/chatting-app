import React from 'react'

const Button = ({children, className}) => {
  return (
    <Button
    className={`px-2 bg-primary text-[20px] font-semibold font-poppins rounded-[5px] ${className}`}
    >{children}</Button>
  )
}

export default Button