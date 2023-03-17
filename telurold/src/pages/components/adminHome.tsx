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
                    <button onClick={(e) => router.push("/viewAllUsers")}>View All Users</button>
                    <button onClick={(e) => router.push("/addNewStore")}>Add New Store</button>
                    <button onClick={(e) => router.push("/viewAllStore")}>View All Stores</button>
                    <button onClick={(e) => router.push("/sendNewsletters")}>Send Newsletters</button>

                </div>
            </div>
        </div>

    );
}
 
export default AdminHome;