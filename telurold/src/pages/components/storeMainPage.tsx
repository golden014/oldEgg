import { Category, Store } from "modules/authProvider";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import style from "../../styles/style.module.scss"
import CategoryCard from "./categoryCard";
import StoreSubPage from "./storeSubPage";

const StoreMainPage = (props: {store: Store}) => {
    const store = props.store
    const [threeOption, setThreeOption] = useState("");

    //bikin useeffect setiap threeoption di change ganti isi sub page nya jadi berdasarkan three option tsb

    // useEffect(() => {
        
    // }, [threeOption])

    const router = useRouter();

    const handleEditStore = () => {
        router.push("/editStore")
    }

    const currStoreId = localStorage.getItem("store_id")
    const [categories, setCategories] = useState<Category[]>([])

    useEffect(() => {
        const getCategories = async () => {
                try {
                    const res = await fetch("http://localhost:1234/getCategoryInStore", {
                        method: "POST",
                        headers: { "Content-Type": "application/json;charset=utf-8" },
                        body: JSON.stringify({
                            store_id: parseInt(String(store.store_id))
                        }),
                    });
        
                    if (res.ok) {
                        const data = await res.json();
                        setCategories(data)
                        console.log("success");
                        console.log(data);
                        
                    } else {
                        console.log("smth went wrong");        
                    }
        
                    console.log(res);
                } catch (error) {
                    console.log(error);
                }
        }
        getCategories()
    }, [])

    //SELLER-----------------------------------------------------------------------------------------------------------------------------------------------------------------
    if (categories) {
        if (currStoreId) {
            //ini adalah store nya sendiri
            if (currStoreId == store.store_id) {
                //return yg ada tombol edit dll
                return (  
                    <div className={style.store_main_page_container}>
                        {store.store_status == "Banned" &&
                            <div style={{paddingLeft: "20px", backgroundColor: "#b7312c"}}>
                                <h2 style={{color: "white"}}>Your store is banned</h2>
                            </div>
                        }
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
        } else {
            //return yg user biasa
            if (store.store_status == "Banned") {
                return (
                    <h1>This store is banned !</h1>
                )
            } else {
    //USER BIASA-----------------------------------------------------------------------------------------------------------------------------------------------------------------

                //home store user biasa
                return (  
                    <div className={style.store_main_page_container}>
                        <div className={style.store_main_page_top}>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png"/>
                            <div className={style.top_detail}>
                                <h1>{store.store_name}</h1>
                                <p>{store.store_description}</p>
                            </div>
                        </div>
                        <div className={style.store_three_option}>
                            <button onClick={(e) => setThreeOption("")}>Home</button>
                            <button onClick={(e) => setThreeOption("Products")}>Products</button>
                            <button onClick={(e) => setThreeOption("Reviews")}>Reviews</button>
                            <button onClick={(e) => setThreeOption("AboutUs")}>About Us</button>   
                        </div>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <img src={store.store_banner} ></img>
                        </div>

                        <div style={{display: "flex", justifyContent: "center", marginTop: "30px"}}>
                            <StoreSubPage threeOption={threeOption}/>
                        </div>

                        <div className={style.store_main_page_top}>
                            <h1>Shop by category</h1>
                        </div>
                        <div className={style.store_category_container}>
                            {categories.map((category) => (
                                   <CategoryCard category={category} />
                            ))}
                        </div>

                        {/* <div className={style.store_main_page_bot}>
                            <div className={style.top_detail}>
                                <button onClick={handleEditStore}>Edit Store Info</button>
                                <button onClick={(e) => router.push("/insertNewProduct")}>Insert New Product</button>
                            </div>
                        </div> */}
                    </div>
                );
            }
        }

    }

    return(
        <h1>Loading</h1>
    )

   
}
 
export default StoreMainPage;