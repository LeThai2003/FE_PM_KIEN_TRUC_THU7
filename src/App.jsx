
import Login from "./pages/auth/Login"
import Signup from "./pages/auth/Signup"
import Home from "./pages/home/Home"
import {BrowserRouter, Routes, Route} from "react-router-dom"
import Project from "./pages/project"
import TaskDetail from "./pages/Task/TaskDetail"
import ForgotPassword from "./pages/auth/ForgotPassword"
import OtpPassword from "./pages/auth/OtpPassword"
import ResetPassword from "./pages/auth/ResetPassword"
import PrivateRoute from "./components/privateRoute"
import Profile from "./pages/account/Profile"
import Account from "./pages/account/Account"
import Search from "./pages/search/Search"
import Priority from "./pages/priority/Priority"
import Timeline from "./pages/timeline/Timeline"


function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/forgot-password" element={<ForgotPassword/>}/>
          <Route path="/otp-password" element={<OtpPassword/>}/>
          <Route path="/reset-password" element={<ResetPassword/>}/>
       
          {/* <Route path="/" element={<Home/>}/>
          <Route path="/project/:id" element={<Project/>}/>
          <Route path="/task/:id" element={<TaskDetail/>}/> */}
 
          <Route element={<PrivateRoute/>}>
            <Route path="/" element={<Home/>}/>
            <Route path="/project/:id" element={<Project/>}/>
            <Route path="/task/:id" element={<TaskDetail/>}/>
            <Route path="/profile/:id" element={<Profile/>}/>
            <Route path="/account/:id" element={<Account/>}/>
            <Route path="/search" element={<Search/>}/>
            <Route path="/task/priority/:priority" element={<Priority/>}/>
            <Route path="/timeline" element={<Timeline/>}/>
          </Route>
          
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
