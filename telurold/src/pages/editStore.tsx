import Theme from "./components/theme";
import style from "../styles/style.module.scss"
import { useState } from "react"
import { storeChangeInfo } from "./components/storeChangeInfo";

const EditStore = () => {

    const store_id = localStorage.getItem("store_id")
    console.log("STORE ID");
    
    console.log(store_id);

    const [newName, setNewName] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [newDisplayPic, setNewDisplayPic] = useState("")
    const [newEmail, setNewEmail] = useState("")

    

    if (store_id) {
        const handleName = () => {
            storeChangeInfo("store_name", newName, store_id)
        }
        const handlePass = () => {
            storeChangeInfo("store_password", newPassword, store_id)
        }
        const handleEmail = () => {
            storeChangeInfo("store_email", newEmail, store_id)
        }
        return (  
            <Theme>
                {/* form change name */}
                {/* form change display pic */}
                {/* form change password */}
                {/* form change email */}
                <div className={style.edit_store_container}>
                    <div className={style.voucher_balance_input}>
                        <p>Set new store name</p>
                        <input type="text" placeholder="Store Name" onChange={(e) => setNewName(e.target.value)}/>
                        <button onClick={handleName}>Change Name</button>
                    </div>
                    <div className={style.voucher_balance_input}>
                        <p>Set new store password</p>
                        <input type="password" placeholder="New Password" onChange={(e) => setNewPassword(e.target.value)}/>
                        <button onClick={handlePass}>Change Password</button>
                    </div>
                    <div className={style.voucher_balance_input}>
                        <p>Set new store email</p>
                        <input type="text" placeholder="Store Email" onChange={(e) => setNewEmail(e.target.value)}/>
                        <button onClick={handleEmail}>Change Email</button>
                    </div>
                </div>
            </Theme>
        );
    } else {
        return (
            <Theme>
                <h1>Loading ...</h1>
            </Theme>
        )
    }
}
 
export default EditStore;