import { Store } from "modules/authProvider";
import { useRouter } from "next/router";
import { useEffect } from "react";
import style from "../../styles/style.module.scss"

const StoreMainPage = (props: {store: any}) => {
    const store = props.store

    useEffect(() => {
        localStorage.setItem("store_id", store.store_id)
    })
    const router = useRouter();

    const handleEditStore = () => {
        
        router.push("/editStore")
    }

    return (  
        <div className={style.store_main_page_container}>
            <img src={store.store_banner} ></img>
            <div className={style.store_main_page_top}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png"/>
                <div className={style.top_detail}>
                    <h1>{store.store_name}</h1>
                    <p>{store.store_description}</p>
                </div>
            </div>

            <div className={style.store_main_page_bot}>
                <div className={style.top_detail}>
                    <button onClick={handleEditStore}>Edit Store Info</button>
                    <button onClick={(e) => router.push("/insertNewProduct")}>Insert New Product</button>
                </div>
            </div>
        </div>
    );
}
 
export default StoreMainPage;