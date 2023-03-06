import Image from "next/image";
import hamburger from "./../../../assets/hamburger.png";
import logo from "../../../assets/newegg-logo.png";
import style from "../../styles/style.module.scss"
import LocationNavbar from "./locationNavbar";
import locationLogo from "../../../assets/location.png"
import userLogo from "../../../assets/user.png"
import { useRouter } from "next/router";
import NavbarDropDown from "./navbarDropdown";
import notification from "../../../assets/notification.png"
import unitedStates from "../../../assets/united-states.png"

interface NavbarProps {
    isDarkMode: boolean;
    setIsDarkMode: (isDarkMode: boolean) => void;
  }

const LoggedInNavbar:React.FC<NavbarProps> = ({isDarkMode, setIsDarkMode}) => {

    // console.log(localStorage.getItem("user_info"));

    const userInfoString = localStorage.getItem("user_info");
    var userInfoObject;
    if (userInfoString) {
        userInfoObject = JSON.parse(userInfoString);
        console.log(userInfoObject.firstName);
    }

    const router = useRouter()

    return (
        <div className={style.navbar}>
            <div className={style.navbar_top}>
                {/* <Image
                    src={hamburger}
                    alt="hamburger menu"
                    width={20}
                    height={20}
                /> */}
                <NavbarDropDown
                //ntar diganti komponen nya dengan dropdown 
                //component yg asli
                    component={<LocationNavbar/>}
                    img = {hamburger}
                />

                <Image
                    src={logo}
                    alt="logo"
                    width={93}
                    height={50}
                    onClick= {(e) => router.push("/")}
                />

                <LocationNavbar smallText= "Deliver to" bigText="Indonesia" img= {locationLogo} link=""/>

                <div className={style.search_bar_home}>
                    <input 
                    type="text" 
                    placeholder="Search..." 
                    className="search-bar"
                    // onChange={}
                    // onKeyDown={}
                    />
                </div>

                <br />

                <NavbarDropDown
                    component={<LocationNavbar/>}
                    img = {notification}
                />

                <br />
                
                <NavbarDropDown
                    component={<LocationNavbar/>}
                    img = {unitedStates}
                />

                <button className={style.theme_button} onClick={() => setIsDarkMode(!isDarkMode)}>
  {                 isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </button>

                <LocationNavbar smallText= "Welcome" bigText={userInfoObject.firstName + " " + userInfoObject.lastName} img= {userLogo} link = "/home"/>

            </div>

            <div className={style.navbar_bot}>

            </div>
        </div>

    );
}

export default LoggedInNavbar;
