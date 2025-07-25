import React from 'react'

const LetterAvatar = ({children, className}) => {
  return (
      <span className={`avatar flex justify-center items-center w-12 h-12 rounded-full bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 text-slate-700 font-semibold text-lg uppercase shadow-sm border border-slate-200/50 hover:shadow-md transition-shadow duration-200 ${className}`}>
        {children}
      </span>
  )
}

export default LetterAvatar