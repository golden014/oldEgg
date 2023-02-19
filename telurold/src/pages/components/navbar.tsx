import Image from "next/image";
import hamburger from "./../../../assets/hamburger.png";
import logo from "../../../assets/newegg-logo.png";
import style from "../../styles/style.module.scss"

interface NavbarProps {
    isDarkMode: boolean;
    setIsDarkMode: (isDarkMode: boolean) => void;
  }

const Navbar:React.FC<NavbarProps> = ({isDarkMode, setIsDarkMode}) => {

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

                {/* <button className={style.theme_button} onClick={_ => toggleTheme()}>Change Theme</button> */}
                <button className={style.theme_button} onClick={() => setIsDarkMode(!isDarkMode)}>
  {                 isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </button>
            </div>

            <div className={style.navbar_bot}>

            </div>
        </div>

    );
}

export default Navbar;