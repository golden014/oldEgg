import { Store } from "modules/authProvider"
import { useEffect, useState } from "react"
import AllStores from "./components/allStores"
import Theme from "./components/theme"
import style from "../styles/style.module.scss"



const ViewAllStore = () => {
    const [stores, setStores] = useState<Store[]>([])

    useEffect(() => {
        fetch('http://localhost:1234/getAllStores')
        .then((response) => response.json())
        .then((data) => {
            setStores(data)
            console.log("tessssss");
            console.log(data.data);
            console.log(data);
        })
        .catch((error) => {
            console.log(error);
        })
    }, [])
    
    return (  
        <Theme>
            <div className={style.view_all_users_container}>
                <AllStores stores={stores} />
            </div>
        </Theme>
    );
}
 
export default ViewAllStore;