import { Store } from "modules/authProvider";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import style from "../../styles/style.module.scss"
import StoreMainPage from "./storeMainPage";

const StoreHome = (props: {seller_id:any}) => {
    
    console.log("QQQQQQQQQQQQQQQQQQQQQQQ");
    console.log(props.seller_id);
    const router = useRouter()

    // const [store, setStore] = useState<Store[]>()
    
    //find store with store_id = store_id
    // useEffect(() => {
    //     try {
    //         const res =  fetch("http://localhost:1234/getStoreBySeller", {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json;charset=utf-8" },
    //             body: JSON.stringify({
    //                 seller_id: props.seller_id
    //             }),
    //         });

    //         if (res.ok) {
    //             const jsonRes = await res.json();
    //             setStore(data)
                
    //         } else {
    //             alert("Fail!")
    //         }
    //     } catch (error) {
    //         alert("Fail")
    //     }
    // }, [])

    const [store, setStore] = useState<Store | null>(null);
    // console.log("LOL");
    
    // console.log(props.seller_id);
    useEffect(() => {
        const fetchStore = async () => {
        try {
            const res = await fetch("http://localhost:1234/getStoreBySeller", {
            method: "POST",
            headers: { "Content-Type": "application/json;charset=utf-8" },
            body: JSON.stringify({
                seller_id: props.seller_id,
            }),
            });

            if (res.ok) {
            const data = await res.json();
            setStore(data);
            console.log(data);
            
            
            } else {
            alert("Failed to fetch store data!");
            }
        } catch (error) {
            alert("Failed to fetch store data!");
        }
        };
        fetchStore();
    }, []);

    if (store) {
        localStorage.setItem("store_id", store.store_id)
        router.push("/store/" + store.store_id)

        return (
            // rout
            // <StoreMainPage store={store}/>
            <div>

            </div>
        );
    }
    else {
        return (  
            <div>
                <h1>Loading ...</h1>
            </div>
        ); 
    }
   
}
 
export default StoreHome;