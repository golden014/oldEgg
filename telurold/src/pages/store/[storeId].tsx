import { useRouter } from "next/router";
import Theme from "../components/theme";
import { useEffect, useState } from "react"
import { Store } from "modules/authProvider";
import StoreMainPage from "../components/storeMainPage";

const StorePage = () => {

    const router = useRouter()
    const storeId = router.query.storeId
    const [store, setStore] = useState<Store>()

    useEffect(() => {
        //ambil data product id berdasarkan id nya
        const getStore = async () => {
            if (storeId) {
                try {
                    const res = await fetch("http://localhost:1234/getStoreById", {
                        method: "POST",
                        headers: { "Content-Type": "application/json;charset=utf-8" },
                        body: JSON.stringify({
                            store_id: parseInt(String(storeId))
                        }),
                    });
        
                    if (res.ok) {
                        const data = await res.json();
                        setStore(data)
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
    
        }
        getStore()
    }, [storeId])

    if (storeId && store) {
        return (  
            <Theme>
                <StoreMainPage store={store}/>
            </Theme>
        );
    } else {
        return(
            <Theme>
                <h1>Loading...</h1>
            </Theme>
        )
    }
}
 
export default StorePage;