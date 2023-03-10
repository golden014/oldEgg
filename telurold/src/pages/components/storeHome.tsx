import { Store } from "modules/authProvider";
import { useEffect, useState } from "react";
import style from "../../styles/style.module.scss"
import StoreMainPage from "./storeMainPage";

const StoreHome = (props: {seller_id:any}) => {
    
    console.log("QQQQQQQQQQQQQQQQQQQQQQQ");
    console.log(props.seller_id);

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
        return (
            <StoreMainPage store={store}/>
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