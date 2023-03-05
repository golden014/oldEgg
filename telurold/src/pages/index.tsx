import { useEffect, useState } from "react";
import AdminHome from "./components/adminHome";
import Navbar from "./components/navbar";
import RealHome from "./components/realHome";
import Theme from "./components/theme";
import style from "../styles/style.module.scss"

export default function Home() {

  const [userInfo, setUserInfo] = useState<string | null>(null);

    useEffect(() => {
        const localStorageUserInfo = localStorage?.getItem('user_info');
        setUserInfo(localStorageUserInfo);
    }, []);

    const userInfoObject = userInfo ?  JSON.parse(userInfo) : null

    if (userInfo) {
      if (userInfoObject.role == "Admin") {
        return (
          <Theme>
            <div className={style.big_big_container}>
              
              <AdminHome/>
            </div>
          </Theme>
        )
      } 
      else {
  
        return (
          <Theme>
            <div className={style.big_big_container}>
            <div className="aaaaaa">
              <RealHome/> 

            </div>
            </div>
          </Theme>
        )
      }
    }

    else {
  
      return (
        <Theme>
          <RealHome/>
        </Theme>
      )
    }

}
