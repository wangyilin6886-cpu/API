import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'

const Profile = lazy(() => import('./pages/Profile'))
const Recharge = lazy(() => import('./pages/Recharge'))
const Login = lazy(() => import('./pages/Login'))
const Chat = lazy(() => import('./pages/Chat'))
const ApiDocs = lazy(() => import('./pages/ApiDocs'))
const Models = lazy(() => import('./pages/Models'))

function PageLoader() {
  return <div className="route-loader"><span className="route-spinner" /></div>
}

export default function App() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/recharge" element={<Recharge />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/api" element={<ApiDocs />} />
          <Route path="/models" element={<Models />} />
        </Routes>
      </Suspense>
    </>
  )
}
