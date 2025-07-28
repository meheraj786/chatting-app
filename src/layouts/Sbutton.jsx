import React from 'react'

const Sbutton = ({className, children, onClick}) => {
  return (
    <button onClick={onClick} className={`relative inline-flex items-center justify-center px-4 py-2 text-sm font-medium  bg-black text-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none hover:text-black cursor-pointer focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 transition-all duration-200 shadow-sm hover:shadow-md ${className}`}>
      {children}
    </button>
  )
}

export default Sbutton