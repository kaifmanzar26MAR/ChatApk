import React from 'react'
import { Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
const App = () => {
  return (
    <div>
      <Routes>
        <Route element={<Home/>} path='/'></Route>
        <Route element={<Login/>} path='/login'></Route>
        <Route element={<Register/>} path='/register'></Route>
      </Routes>
    </div>
  )
}

export default App
