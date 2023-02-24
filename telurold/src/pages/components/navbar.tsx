import Image from "next/image";
import hamburger from "./../../../assets/hamburger.png";
import logo from "../../../assets/newegg-logo.png";
import style from "../../styles/style.module.scss"
import LocationNavbar from "./locationNavbar";
import locationLogo from "../../../assets/location.png"
import GuestNavbar from "./guestNavbar";
import LoggedInNavbar from "./loggedInNavbar";

interface NavbarProps {
    isDarkMode: boolean;
    setIsDarkMode: (isDarkMode: boolean) => void;
  }

const Navbar:React.FC<NavbarProps> = ({isDarkMode, setIsDarkMode}) => {
    // const userInfo = localStorage?.getItem("user_info");
    const userInfo = typeof localStorage !== "undefined" && localStorage?.getItem("user_info");

    if (!userInfo)
    return ( 
        <GuestNavbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}/>
     );

     else {
        return (
            <LoggedInNavbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode}/>
        )
     }
}
 
export default Navbar;
