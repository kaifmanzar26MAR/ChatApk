import React from 'react'
import { Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
const App = () => {
  return (
    <div className='bg-[url(https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcTXUwyGWNtSW8ibjxNUIbVL9aOORsNz_dXDSvtXsxDfLz1lhM7IdeWc5QjcDFZQFS1wedkjdNL0Vw5cNwiF8Uq0A8MOcZkCkYOTFtF3xg)] bg-no-repeat bg-cover'>
      <Routes>
        <Route element={<Home/>} path='/'></Route>
        <Route element={<Login/>} path='/login'></Route>
        <Route element={<Register/>} path='/register'></Route>
      </Routes>
    </div>
  )
}

export default App
