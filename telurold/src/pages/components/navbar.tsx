import Image from "next/image";
import hamburger from "./../../../assets/hamburger.png";
import logo from "../../../assets/newegg-logo.png";
import style from "../../styles/style.module.scss"
import { useEffect, useState } from "react";

const Navbar = () => {

    var temp = false;

    const [darkTheme, setDarkTheme] = useState(false);

    useEffect(() => {

        if (localStorage.getItem("isDarkTheme") === null) {
            setDarkTheme(false)
            localStorage.setItem("isDarkTheme", "false")
        
        } else if (localStorage.getItem("isDarkTheme") === "true") {
            setDarkTheme(true)
            localStorage.setItem("isDarkTheme", "true")
        } else {
            setDarkTheme(false)
            localStorage.setItem("isDarkTheme", "false")
        }

        console.log(darkTheme)
       
        const root = document.documentElement;
        root?.style.setProperty("--background-color", darkTheme ? "#050c2e" : "#fff");
        root?.style.setProperty("--button_bg_color", darkTheme ? "#8EAFF0" : "#1946B8");
        root?.style.setProperty("--button_txt_color", darkTheme ? "#050c2e" : "#fff");
        console.log(darkTheme)
    }, [darkTheme]);

    function toggleTheme() {
        if (darkTheme === true) {
            setDarkTheme(false)
            localStorage.setItem("isDarkTheme", "false")
        } else {
            setDarkTheme(true)
            localStorage.setItem("isDarkTheme", "true")
        }
    }

    return (
        <div>
            <div className={style.navbar_top}>
                <Image
                    src={hamburger}
                    alt="hamburger menu"
                    width={25}
                    height={25}
                />

                <Image
                    src={logo}
                    alt="logo"
                    width={93}
                    height={50}
                />

                <div className={style.search_bar_home}>
                    <input 
                    type="text" 
                    placeholder="Search..." 
                    className="search-bar"
                    // onChange={}
                    // onKeyDown={}
                    />
                </div>

                <button className={style.theme_button} onClick={_ => toggleTheme()}>Change Theme</button>
            </div>

            <div className={style.navbar_bot}>

            </div>
        </div>

    );
}

export default Navbar;