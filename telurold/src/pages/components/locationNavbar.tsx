import locationLogo from "../../../assets/location.png"
import Image, { StaticImageData } from "next/image";
import style from "../../styles/style.module.scss"
import { useRouter } from "next/router";


const LocationNavbar = ({smallText, bigText, img, link}:any) => {
    const router = useRouter();

    const clickHandler = () => {
        if (link != "") {
            router.push(link);
        }
    }

    return ( 
        <div className={style.button_navbar_container} onClick={clickHandler}>
            <Image
            src={img}
            alt="location logo"
            width={20}
            height={20}
            />
            <div className={style.button_navbar_text}>
                <p>{smallText}</p>
                <h1>{bigText}</h1>
            </div>
        </div>
     );
}
 
export default LocationNavbar;