import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Profile from './pages/Profile'
import Recharge from './pages/Recharge'
import Login from './pages/Login'
import Chat from './pages/Chat'
import ApiDocs from './pages/ApiDocs'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/recharge" element={<Recharge />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/api" element={<ApiDocs />} />
      </Routes>
    </>
  )
}
