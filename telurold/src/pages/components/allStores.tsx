import { Store } from "modules/authProvider";
import { useRouter } from "next/router";
import style from "../../styles/style.module.scss"

interface AllStoresObject {
    stores: Store[]
}

const AllStores: React.FC <AllStoresObject> = ({ stores }) => {


    const handleBan = async (id:any) => {
        //send ke backend, user dengan id ini, Status = "Banned"
        try {
            console.log("id nya adalahhh: " + id);
            const res = await fetch("http://localhost:1234/banStore", {
                method: "POST",
                headers: { "Content-Type": "application/json;charset=utf-8" },
                body: JSON.stringify({
                    user_id: id,
                }),
            });

            if (res.ok) {
                alert("Ban, Success!")
                window.location = window.location
                
            } else {
                alert("Ban Unsuccess!")
            }
        } catch (error) {
            alert("Ban Unsuccess!")
        }
    }

    const handleUnban = async (id:any) => {
        try {
            const res = await fetch("http://localhost:1234/unbanStore", {
                method: "POST",
                headers: { "Content-Type": "application/json;charset=utf-8" },
                body: JSON.stringify({
                    user_id: id,
                }),
            });

            if (res.ok) {
                alert("Unban, Success!")
                window.location = window.location
                
            } else {
                alert("Unban Unsuccess!")
            }
        } catch (error) {
            alert("Unban Unsuccess!")
        }
    }

    const router = useRouter()

    return (  
        <div className={style.all_user_container}>
           {stores.map((store) => (
                <div key={store.store_id} className={style.user_container}>
                    <div className={style.user_title}>
                        <h1 onClick={(e) => router.push("/store/" + store.store_id)} style={{cursor: "pointer"}}>{store.store_name}</h1>
                    </div>
                
                    <div className={style.user_detail}>
                        <p>Email: {store.store_email}</p>
                        <p>Status: {store.store_status}</p>
                    </div>
                    <div className={style.user_ban_buttons}>
                        <button className={style.ban_buttons} onClick={(e) => handleBan(store.store_id)}>Ban</button>
                        <button className={style.unban_buttons} onClick={(e) => handleUnban(store.store_id)}>Unban</button>
                    </div>
                </div>
            ))}
        </div>
    );
}
 
export default AllStores
