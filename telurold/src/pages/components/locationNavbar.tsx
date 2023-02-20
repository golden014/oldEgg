import locationLogo from "../../../assets/location.png"
import Image from "next/image";
import style from "../../styles/style.module.scss"


const LocationNavbar = () => {
    return ( 
        <div className={style.button_navbar_container}>
            <Image
            src={locationLogo}
            alt="location logo"
            width={20}
            height={20}
            />
            <div className={style.button_navbar_text}>
                <p>Hello</p>
                <h1>Select address</h1>
            </div>
        </div>
     );
}
 
export default LocationNavbar;