import './App.css'
import React from 'react'
import Flex from './layouts/Flex'
import image from './assets/registerImg.png'

function App() {

  return (
<>
<Flex>
  <div className="left w-[55%]">
    <h1>Get started with easily register</h1>
    <p>Free register and you can enjoy it</p>
  </div>
  <div className="right w-[45%] object-cover h-screen">
    <img className='w-full object-cover h-full' src={image} alt="" />
  </div>
</Flex>

</>
  )
}

export default App
