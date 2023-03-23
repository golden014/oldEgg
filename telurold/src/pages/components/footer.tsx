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
                    <a onClick={(e) => router.push("/login")}>Login</a>
                    <p onClick={(e) => router.push("/")}>Main Page</p>
                    <a onClick={(e) => router.push("/home")}>Home</a>
                    <a onClick={(e) => router.push("/cart")}>Cart</a>
                </div>

                <div className={style.footer_top_items}>
                    <h1>Actions</h1>
                    <a onClick={(e) => router.push("/userOrders")}>View Orders</a>
                    <a onClick={(e) => router.push("/userReviews")}>Your Reviews</a>
                    <a onClick={(e) => router.push("/accountSettings")}>Account Settings</a>
                    <a onClick={(e) => router.push("/wishlist")}>Wishlist</a>
                </div>

                <div className={style.footer_top_items}>
                    <h1>Promotions</h1>
                    <a onClick={(e) => router.push("/inputVoucher")}>Claim Voucher</a>
                    <a onClick={(e) => router.push("/signup")}>Register</a>
                    <a href="">Help Center</a>
                    <a href="">Help Center</a>
                </div>
            </div>
        </div>
    );
}
 
export default Footer;