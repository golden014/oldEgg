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
import { useEffect, useState } from "react";
import SearchHome from "./searchHome";

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
    const [country, setCountry] = useState("")

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(async({coords})=> {
            const {longitude, latitude} = coords
            if(longitude && latitude) {
                
            }
            // const endpoint = `http://api.geonames.org/countryCodeJSON?lat=` + latitude + `&lng=` + latitude + `&username=josua_golden`
            const endpoint = "http://api.geonames.org/countryCodeJSON?lat=-6.202056&lng=106.78186&username=dnj_isme"
            fetch(endpoint)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                
                setCountry(data.countryName)
            })
            .catch((error) => {
                console.log(error);
            })
        })

    }, [])



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

                <LocationNavbar smallText= "Deliver to" bigText={country} img= {locationLogo} link=""/>
                <SearchHome/>
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

                <LocationNavbar smallText= "Welcome" bigText={userInfoObject.firstname + " " + userInfoObject.lastname} img= {userLogo} link = "/home"/>

            </div>

            <div className={style.navbar_bot}>

            </div>
        </div>

    );
}

export default LoggedInNavbar;
