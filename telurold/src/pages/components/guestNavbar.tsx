import Image from "next/image";
import hamburger from "./../../../assets/hamburger.png";
import logo from "../../../assets/newegg-logo.png";
import style from "../../styles/style.module.scss"
import LocationNavbar from "./locationNavbar";
import locationLogo from "../../../assets/location.png"
import userLogo from "../../../assets/user.png"
import { useRouter } from "next/router";

interface NavbarProps {
    isDarkMode: boolean;
    setIsDarkMode: (isDarkMode: boolean) => void;
  }

const GuestNavbar:React.FC<NavbarProps> = ({isDarkMode, setIsDarkMode}) => {

    const router = useRouter()
    return (
        <div className={style.navbar}>
            <div className={style.navbar_top}>
                <Image
                    src={hamburger}
                    alt="hamburger menu"
                    width={20}
                    height={20}
                />

                <Image
                    src={logo}
                    alt="logo"
                    width={93}
                    height={50}
                    onClick= {(e) => router.push("/")}
                />

                <LocationNavbar smallText= "Deliver to" bigText="Indonesia" img= {locationLogo}/>

                <div className={style.search_bar_home}>
                    <input 
                    type="text" 
                    placeholder="Search..." 
                    className="search-bar"
                    // onChange={}
                    // onKeyDown={}
                    />
                </div>

                <button className={style.theme_button} onClick={() => setIsDarkMode(!isDarkMode)}>
  {                 isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </button>

                <LocationNavbar smallText= "Welcome" bigText="Sign In / Register" img= {userLogo} link="/login"/>

            </div>

            <div className={style.navbar_bot}>

            </div>
        </div>

    );
}

export default GuestNavbar;