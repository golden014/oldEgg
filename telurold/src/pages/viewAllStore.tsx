import { Store } from "modules/authProvider"
import { useEffect, useState } from "react"
import AllStores from "./components/allStores"
import Theme from "./components/theme"
import style from "../styles/style.module.scss"



const ViewAllStore = () => {
    const [stores, setStores] = useState<Store[]>([])
    const [page, setPage] = useState(0)
    const [onFilter, setFilter] = useState(false)
    const [colValue, setColValue] = useState("")

    const nextPage = () => {
        setPage(page + 1)
    }

    const prevPage = () => {
        if (page > 0) {
            setPage(page - 1)
        } else {

        }

    }
        useEffect(() => {
            if (!onFilter) {
                const getPagintedUsers = async () => {
                    try {
                        const res = await fetch("http://localhost:1234/paginatedStore", {
                            method: "POST",
                            headers: {"Content-Type": "application/json;charset=utf-8"},
                            body: JSON.stringify({
                                page: page
                            }),
                        });
        
                        if (res.ok) {
                            const data = await res.json();
                            setStores(data)
                        } else {
                            console.log("smth went wrong retreiving reviews");
                        }
        
                    } catch (error){
                        console.log(error);                
                    }
                }
        
                getPagintedUsers()
            } else {
                const getPagintedUsers = async () => {
                    try {
                        const res = await fetch("http://localhost:1234/paginatedStoreFiltered", {
                            method: "POST",
                            headers: {"Content-Type": "application/json;charset=utf-8"},
                            body: JSON.stringify({
                                page: page,
                                column: "store_status",
                                column_value: colValue
                            }),
                        });
        
                        if (res.ok) {
                            const data = await res.json();
                            setStores(data)
                        } else {
                            console.log("smth went wrong retreiving reviews");
                        }
        
                    } catch (error){
                        console.log(error);                
                    }
                }
        
                getPagintedUsers()
            }
        }, [page, colValue, onFilter])
    
    const handleShowActive = () => {
        setFilter(true)
        setColValue("Active")
    }

    const handleShowbanned = () => {
        setFilter(true)
        setColValue("Banned")
    }

    return (  
        <Theme>
            <div className={style.view_all_users_container}>
                <div className={style.buttons}>
                    <button onClick={prevPage}>Prev</button>
                    <button onClick={nextPage}>Next</button>
                </div>
                <div className={style.filter_buttons}>
                    <button onClick={(e) => setFilter(false)}>No Filter</button>
                    <button onClick={handleShowActive}>Show Active Only</button>
                    <button onClick={handleShowbanned}>Show Banned Only</button>
                </div>
                <AllStores stores={stores} />
                <div style={{height: "300px"}}></div>
            </div>
        </Theme>
    );
}
 
export default ViewAllStore;