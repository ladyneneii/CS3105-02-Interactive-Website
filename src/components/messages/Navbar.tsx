import React from 'react'
import trisha from "../../assets/img/trisha-3328x1872.jpg"

const Navbar = () => {
  return (
    <div className='navbar'>
      <span className="logo">Message</span>
      <div className="user">
        <img className="img" src={trisha} alt="" />
        <span>John</span>
        <button className='button'>logout</button>
      </div>
    </div>
  )
}

export default Navbar