import { useEffect } from "react"
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const isLogin = () => {

  const {currentUser} = useSelector((state) => state.users);

  const navigate = useNavigate();

  // useEffect(() => {
  //   if(currentUser)
  //   {
  //     navigate("/");
  //     return;
  //   }
  //   else localStorage.clear();
  // }, []);
}