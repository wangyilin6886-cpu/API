import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Corporate from './pages/Corporate'

const Home = lazy(() => import('./pages/Home'))
const Profile = lazy(() => import('./pages/Profile'))
const Recharge = lazy(() => import('./pages/Recharge'))
const Login = lazy(() => import('./pages/Login'))
const Chat = lazy(() => import('./pages/Chat'))
const ApiDocs = lazy(() => import('./pages/ApiDocs'))
const Models = lazy(() => import('./pages/Models'))
const ArticleDeepSeek = lazy(() => import('./pages/ArticleDeepSeek'))
const ArticleH200 = lazy(() => import('./pages/ArticleH200'))
const AIInfra = lazy(() => import('./pages/AIInfra'))

function PageLoader() {
  return <div className="route-loader"><span className="route-spinner" /></div>
}

export default function App() {
  const loc = useLocation()
  const hideNav = loc.pathname.startsWith('/article/')

  return (
    <>
      {!hideNav && <Navbar />}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Corporate />} />
          <Route path="/ecoapi" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/recharge" element={<Recharge />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/api" element={<ApiDocs />} />
          <Route path="/models" element={<Models />} />
          <Route path="/article/deepseek-huawei" element={<ArticleDeepSeek />} />
          <Route path="/article/h200-china" element={<ArticleH200 />} />
          <Route path="/ai-infra" element={<AIInfra />} />
        </Routes>
      </Suspense>
    </>
  )
}
