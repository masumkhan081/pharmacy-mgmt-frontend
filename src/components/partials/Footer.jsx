import React from 'react'
import { useSelector } from 'react-redux';

export default function Footer() {
  const { userRole } = useSelector((state) => state.user);

  const footerText = () => userRole ? userRole :
    'developedBy: "github.com/masumkhan081",  isCustomCoded: true'

  return (
    <div className=' px-4 py-1 text-center shadow-inner shadow-slate-300 text-xs font-serif'>
      {footerText()}
    </div>
  )
}
