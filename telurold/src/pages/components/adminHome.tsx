import { useRouter } from "next/router";
import style from "../../styles/style.module.scss"

const AdminHome = () => {

    const router = useRouter();
    
    return ( 
        <div className={style.admin_home_container}>
            <div className={style.admin_home_top}>
                <div className={style.admin_home_button}>
                    <button onClick={(e) => router.push("/editCarousel")}> Edit Carousel </button>
                    <button onClick={(e) => router.push("/addNewVoucher")}>Add New Voucher</button>
                </div>
            </div>
        </div>

    );
}
 
export default AdminHome;