import { useRouter } from "next/router";
import style from "../../styles/style.module.scss"

const Footer = () => {

    const router = useRouter()
    return (  
        <div className={style.footer_container}>
            <div className={style.footer_top}>
                <div className={style.footer_top_items}>
                    <h1>Customer Service</h1>
                    <a href="">Help Center</a>
                    <a href="">Help Center</a>
                    <a href="">Help Center</a>
                    <a href="">Help Center</a>
                </div>

                <div className={style.footer_top_items}>
                    <h1>My Account</h1>
                    <a href="">Login/Register</a>
                    <p onClick={(e) => router.push("/")}>Home</p>
                    <a href="">Help Center</a>
                    <a href="">Help Center</a>
                </div>

                <div className={style.footer_top_items}>
                    <h1>Customer Service</h1>
                    <a href="">Help Center</a>
                    <a href="">Help Center</a>
                    <a href="">Help Center</a>
                    <a href="">Help Center</a>
                </div>

                <div className={style.footer_top_items}>
                    <h1>Customer Service</h1>
                    <a href="">Help Center</a>
                    <a href="">Help Center</a>
                    <a href="">Help Center</a>
                    <a href="">Help Center</a>
                </div>
            </div>
        </div>
    );
}
 
export default Footer;